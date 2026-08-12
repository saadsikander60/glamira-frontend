"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";

type SocketContextValue = {
  socket: Socket | null;
  connected: boolean;
  userUnread: number;
  adminUnreadTotal: number;
  muted: boolean;
  setMuted: (value: boolean) => void;
  setUserUnread: (value: number) => void;
  setAdminUnreadTotal: (value: number) => void;
  playNotifySound: () => void;
  ensureAudioUnlocked: () => void;
  requestNotifyPermission: () => Promise<void>;
  showBrowserNotification: (title: string, body: string) => void;
};

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

function getSocketUrl() {
  if (process.env.NEXT_PUBLIC_SOCKET_URL) {
    return process.env.NEXT_PUBLIC_SOCKET_URL;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  return apiUrl.replace(/\/api\/v1\/?$/, "");
}

export function SocketProvider({ children }: { children: ReactNode }) {
  const { token, isAuthenticated, isAdmin, loading } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [userUnread, setUserUnread] = useState(0);
  const [adminUnreadTotal, setAdminUnreadTotal] = useState(0);
  const [muted, setMutedState] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem("glamira-chat-muted") === "1";
    } catch {
      return false;
    }
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUnlockedRef = useRef(false);
  const socketRef = useRef<Socket | null>(null);

  const setMuted = useCallback((value: boolean) => {
    setMutedState(value);
    try {
      localStorage.setItem("glamira-chat-muted", value ? "1" : "0");
    } catch {
      // ignore
    }
  }, []);

  const ensureAudioUnlocked = useCallback(() => {
    if (typeof window === "undefined") return;
    if (!audioRef.current) {
      audioRef.current = new Audio("/sounds/chat-notify.wav");
      audioRef.current.preload = "auto";
      audioRef.current.volume = 0.45;
    }

    if (audioUnlockedRef.current) return;

    audioRef.current
      .play()
      .then(() => {
        audioRef.current?.pause();
        if (audioRef.current) audioRef.current.currentTime = 0;
        audioUnlockedRef.current = true;
      })
      .catch(() => {
        // Browser may still block until real gesture; ignore.
      });
  }, []);

  const playNotifySound = useCallback(() => {
    if (muted) return;
    if (typeof window === "undefined") return;

    try {
      if (!audioRef.current) {
        audioRef.current = new Audio("/sounds/chat-notify.wav");
        audioRef.current.preload = "auto";
        audioRef.current.volume = 0.45;
      }

      audioRef.current.currentTime = 0;
      void audioRef.current.play().catch(() => {
        // Autoplay blocked until interaction
      });
    } catch {
      // ignore
    }
  }, [muted]);

  const requestNotifyPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission === "granted") return;
    if (Notification.permission === "denied") return;
    await Notification.requestPermission();
  }, []);

  const showBrowserNotification = useCallback(
    (title: string, body: string) => {
      if (typeof window === "undefined" || !("Notification" in window)) return;
      if (Notification.permission !== "granted") return;
      if (document.visibilityState === "visible") return;

      try {
        new Notification(title, {
          body,
          icon: "/favicon.ico",
        });
      } catch {
        // ignore
      }
    },
    [],
  );

  // Bootstrap unread counts via REST
  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || !token) {
      const reset = () => {
        setUserUnread(0);
        setAdminUnreadTotal(0);
      };
      queueMicrotask(reset);
      return;
    }

    let cancelled = false;

    const loadUnread = async () => {
      try {
        if (isAdmin) {
          const res = await api.get("/chat/admin/unread-total");
          if (!cancelled) setAdminUnreadTotal(res.data.unreadTotal || 0);
        } else {
          const res = await api.get("/chat/conversation");
          if (!cancelled) {
            setUserUnread(res.data.conversation?.unreadForUser || 0);
          }
        }
      } catch {
        // ignore bootstrap errors
      }
    };

    void loadUnread();
    return () => {
      cancelled = true;
    };
  }, [loading, isAuthenticated, token, isAdmin]);

  // Manage socket lifecycle
  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || !token) {
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      queueMicrotask(() => {
        setSocket(null);
        setConnected(false);
      });
      return;
    }

    const url = getSocketUrl();
    const next = io(url, {
      auth: { token },
      transports: ["websocket", "polling"],
      autoConnect: true,
    });

    socketRef.current = next;
    queueMicrotask(() => setSocket(next));

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    const onUnread = (payload: {
      unreadForUser?: number;
      unreadForAdmin?: number;
      conversationId?: string;
    }) => {
      if (typeof payload.unreadForUser === "number" && !isAdmin) {
        setUserUnread(payload.unreadForUser);
      }
    };

    const refreshAdminUnread = () => {
      if (!isAdmin) return;
      api
        .get("/chat/admin/unread-total")
        .then((res) => setAdminUnreadTotal(res.data.unreadTotal || 0))
        .catch(() => undefined);
    };

    const onConversationUpdate = () => {
      refreshAdminUnread();
    };

    // Global admin alerts when not handled by a mounted chat UI
    const onAdminMessage = (payload: {
      message?: { senderRole?: string; text?: string; messageType?: string };
      conversation?: { user?: { name?: string } | string };
    }) => {
      if (!isAdmin) return;
      if (payload.message?.senderRole !== "USER") return;

      // Prefer page-level handlers when Live Chat is open
      if (
        typeof window !== "undefined" &&
        window.location.pathname.startsWith("/admin/chat")
      ) {
        refreshAdminUnread();
        return;
      }

      playNotifySound();
      const userName =
        typeof payload.conversation?.user === "object"
          ? payload.conversation.user?.name || "Customer"
          : "Customer";
      showBrowserNotification(
        `New message from ${userName}`,
        payload.message.text ||
          (payload.message.messageType === "IMAGE"
            ? "Sent an image"
            : "New chat message"),
      );
      refreshAdminUnread();
    };

    next.on("connect", onConnect);
    next.on("disconnect", onDisconnect);
    next.on("chat:unread:update", onUnread);
    next.on("chat:conversation:update", onConversationUpdate);
    next.on("chat:message:new", onAdminMessage);

    return () => {
      next.off("connect", onConnect);
      next.off("disconnect", onDisconnect);
      next.off("chat:unread:update", onUnread);
      next.off("chat:conversation:update", onConversationUpdate);
      next.off("chat:message:new", onAdminMessage);
      next.removeAllListeners();
      next.disconnect();
      if (socketRef.current === next) socketRef.current = null;
    };
  }, [
    loading,
    isAuthenticated,
    token,
    isAdmin,
    playNotifySound,
    showBrowserNotification,
  ]);

  const value = useMemo(
    () => ({
      socket,
      connected,
      userUnread,
      adminUnreadTotal,
      muted,
      setMuted,
      setUserUnread,
      setAdminUnreadTotal,
      playNotifySound,
      ensureAudioUnlocked,
      requestNotifyPermission,
      showBrowserNotification,
    }),
    [
      socket,
      connected,
      userUnread,
      adminUnreadTotal,
      muted,
      setMuted,
      playNotifySound,
      ensureAudioUnlocked,
      requestNotifyPermission,
      showBrowserNotification,
    ],
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used inside SocketProvider");
  }
  return context;
}
