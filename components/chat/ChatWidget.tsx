"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import ChatWindow from "@/components/chat/ChatWindow";

export default function ChatWidget() {
  const pathname = usePathname();
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const {
    userUnread,
    socket,
    playNotifySound,
    ensureAudioUnlocked,
    showBrowserNotification,
    setUserUnread,
  } = useSocket();
  const [open, setOpen] = useState(false);
  const unreadRef = useRef(userUnread);

  useEffect(() => {
    unreadRef.current = userUnread;
  }, [userUnread]);

  useEffect(() => {
    if (!socket || isAdmin || !isAuthenticated) return;

    const onNew = (payload: {
      message?: { senderRole?: string; text?: string; messageType?: string };
      conversation?: { unreadForUser?: number };
    }) => {
      if (payload.message?.senderRole !== "ADMIN") return;
      if (open || pathname?.startsWith("/account/support")) return;

      playNotifySound();
      showBrowserNotification(
        "Glamira Support",
        payload.message.text ||
          (payload.message.messageType === "IMAGE"
            ? "Sent an image"
            : "New support message"),
      );

      if (typeof payload.conversation?.unreadForUser === "number") {
        setUserUnread(payload.conversation.unreadForUser);
      } else {
        setUserUnread(unreadRef.current + 1);
      }
    };

    const onConv = (payload: { conversation?: { unreadForUser?: number } }) => {
      if (
        typeof payload.conversation?.unreadForUser === "number" &&
        !open &&
        !pathname?.startsWith("/account/support")
      ) {
        setUserUnread(payload.conversation.unreadForUser);
      }
    };

    socket.on("chat:message:new", onNew);
    socket.on("chat:conversation:update", onConv);

    return () => {
      socket.off("chat:message:new", onNew);
      socket.off("chat:conversation:update", onConv);
    };
  }, [
    socket,
    isAdmin,
    isAuthenticated,
    open,
    pathname,
    playNotifySound,
    showBrowserNotification,
    setUserUnread,
  ]);

  if (loading || !isAuthenticated || isAdmin) return null;
  if (pathname?.startsWith("/account/support")) return null;
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          ensureAudioUnlocked();
          setOpen((prev) => !prev);
        }}
        className="fixed right-5 bottom-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#be185d] shadow-2xl transition hover:scale-105 hover:bg-pink-100"
        aria-label="Open support chat"
      >
        {open ? <X size={22} /> : <MessageCircle size={24} />}
        {!open && userUnread > 0 ? (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#be185d] px-1 text-[11px] font-bold text-white">
            {userUnread > 99 ? "99+" : userUnread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="fixed right-4 bottom-[5.5rem] z-[60] w-[min(420px,calc(100vw-2rem))] overflow-hidden shadow-2xl sm:right-5 sm:bottom-24">
          <div className="max-h-[75vh]">
            <ChatWindow
              mode="user"
              compact
              title="Glamira Support"
              subtitle="Beauty help & order support"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
