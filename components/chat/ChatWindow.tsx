"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Check,
  CheckCheck,
  FileText,
  ImagePlus,
  Loader2,
  Paperclip,
  Send,
  Volume2,
  VolumeX,
} from "lucide-react";
import api from "@/lib/axios";
import { getApiError } from "@/lib/apiError";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import { useToast } from "@/context/ToastContext";
import {
  ChatConversation,
  ChatMessage,
  formatChatDayLabel,
  formatChatTime,
  getSenderId,
} from "@/lib/chatTypes";

type ChatWindowProps = {
  mode: "user" | "admin";
  conversationId?: string | null;
  peerUserId?: string | null;
  title?: string;
  subtitle?: string;
  compact?: boolean;
  onConversationLoaded?: (conversation: ChatConversation) => void;
};

export default function ChatWindow({
  mode,
  conversationId: externalConversationId,
  peerUserId,
  title,
  subtitle,
  compact = false,
  onConversationLoaded,
}: ChatWindowProps) {
  const { user } = useAuth();
  const {
    socket,
    connected,
    muted,
    setMuted,
    playNotifySound,
    ensureAudioUnlocked,
    requestNotifyPermission,
    setUserUnread,
    setAdminUnreadTotal,
  } = useSocket();
  const { showToast } = useToast();

  const [conversation, setConversation] = useState<ChatConversation | null>(
    null,
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sending, setSending] = useState(false);
  const [text, setText] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [typing, setTyping] = useState(false);
  const [peerTyping, setPeerTyping] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const knownIdsRef = useRef<Set<string>>(new Set());
  const activeConversationId = conversation?._id || externalConversationId || "";

  const myId = user?.id || user?._id || "";

  const scrollToBottom = useCallback((smooth = true) => {
    bottomRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  const markRead = useCallback(
    async (conversationId: string) => {
      try {
        if (mode === "admin") {
          await api.put(`/chat/admin/conversations/${conversationId}/read`);
          const res = await api.get("/chat/admin/unread-total");
          setAdminUnreadTotal(res.data.unreadTotal || 0);
        } else {
          await api.put(`/chat/messages/${conversationId}/read`);
          setUserUnread(0);
        }
      } catch {
        // ignore
      }
    },
    [mode, setAdminUnreadTotal, setUserUnread],
  );

  const loadInitial = useCallback(async () => {
    try {
      setLoading(true);
      let convId = externalConversationId || "";

      if (mode === "user") {
        const convRes = await api.get("/chat/conversation");
        const conv = convRes.data.conversation as ChatConversation;
        setConversation(conv);
        onConversationLoaded?.(conv);
        convId = conv._id;
        setUserUnread(conv.unreadForUser || 0);
      } else if (convId) {
        // Admin: conversation comes from parent; still fetch messages
      }

      if (!convId) {
        setMessages([]);
        setLoading(false);
        return;
      }

      const msgPath =
        mode === "admin"
          ? `/chat/admin/conversations/${convId}/messages`
          : `/chat/messages/${convId}`;

      const msgRes = await api.get(msgPath, {
        params: { page: 1, limit: 40 },
      });

      const list = (msgRes.data.messages || []) as ChatMessage[];
      knownIdsRef.current = new Set(list.map((m) => m._id));
      setMessages(list);
      setPage(1);
      setTotalPages(msgRes.data.totalPages || 1);

      if (msgRes.data.conversation) {
        setConversation(msgRes.data.conversation);
        onConversationLoaded?.(msgRes.data.conversation);
      }

      await markRead(convId);
      setTimeout(() => scrollToBottom(false), 50);
    } catch (error) {
      showToast(getApiError(error), "error");
    } finally {
      setLoading(false);
    }
  }, [
    externalConversationId,
    mode,
    markRead,
    onConversationLoaded,
    scrollToBottom,
    setUserUnread,
    showToast,
  ]);

  useEffect(() => {
    // Initial conversation/history load (REST). Deferred so setState is not sync-in-effect.
    const timer = window.setTimeout(() => {
      void loadInitial();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadInitial]);

  const loadOlder = async () => {
    if (!activeConversationId || loadingMore || page >= totalPages) return;

    const prevHeight = listRef.current?.scrollHeight || 0;
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const msgPath =
        mode === "admin"
          ? `/chat/admin/conversations/${activeConversationId}/messages`
          : `/chat/messages/${activeConversationId}`;

      const msgRes = await api.get(msgPath, {
        params: { page: nextPage, limit: 40 },
      });

      const older = (msgRes.data.messages || []) as ChatMessage[];
      older.forEach((m) => knownIdsRef.current.add(m._id));
      setMessages((prev) => [...older, ...prev]);
      setPage(nextPage);
      setTotalPages(msgRes.data.totalPages || totalPages);

      requestAnimationFrame(() => {
        if (listRef.current) {
          listRef.current.scrollTop =
            listRef.current.scrollHeight - prevHeight;
        }
      });
    } catch (error) {
      showToast(getApiError(error), "error");
    } finally {
      setLoadingMore(false);
    }
  };

  // Socket listeners for this conversation
  useEffect(() => {
    if (!socket || !activeConversationId) return;

    const onNew = (payload: {
      message: ChatMessage;
      conversation?: ChatConversation;
    }) => {
      const message = payload.message;
      if (!message) return;

      const msgConvId =
        typeof message.conversation === "string"
          ? message.conversation
          : (message.conversation as { _id?: string })?._id;

      if (msgConvId !== activeConversationId) return;
      if (knownIdsRef.current.has(message._id)) return;

      knownIdsRef.current.add(message._id);
      setMessages((prev) => [...prev, message]);

      if (payload.conversation) {
        setConversation(payload.conversation);
      }

      const mine =
        (typeof message.sender === "object" &&
          (message.sender._id === myId || message.sender.id === myId)) ||
        (typeof message.sender === "string" && message.sender === myId);

      if (!mine) {
        // Sound/browser notify only when this window is the active viewer.
        // Floating widget / global admin handlers cover closed/background cases.
        playNotifySound();
        void markRead(activeConversationId);
      }

      setTimeout(() => scrollToBottom(true), 30);
    };

    const onTyping = (payload: { conversationId?: string; userId?: string }) => {
      if (payload.conversationId !== activeConversationId) return;
      if (payload.userId === myId) return;
      setPeerTyping(true);
    };

    const onTypingStop = (payload: { conversationId?: string }) => {
      if (payload.conversationId !== activeConversationId) return;
      setPeerTyping(false);
    };

    const onSeen = (payload: {
      conversationId?: string;
      readerRole?: string;
    }) => {
      if (payload.conversationId !== activeConversationId) return;
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.seenAt) return msg;
          // When peer reads, mark my outgoing as seen
          const mine =
            getSenderId(msg.sender) === myId ||
            msg.senderRole === (mode === "admin" ? "ADMIN" : "USER");
          if (!mine) return msg;
          if (
            (mode === "user" && payload.readerRole === "ADMIN") ||
            (mode === "admin" && payload.readerRole === "USER")
          ) {
            return { ...msg, seenAt: new Date().toISOString() };
          }
          return msg;
        }),
      );
    };

    socket.on("chat:message:new", onNew);
    socket.on("chat:typing", onTyping);
    socket.on("chat:typing:stop", onTypingStop);
    socket.on("chat:seen", onSeen);

    return () => {
      socket.off("chat:message:new", onNew);
      socket.off("chat:typing", onTyping);
      socket.off("chat:typing:stop", onTypingStop);
      socket.off("chat:seen", onSeen);
    };
  }, [
    socket,
    activeConversationId,
    myId,
    mode,
    playNotifySound,
    markRead,
    scrollToBottom,
  ]);

  const emitTyping = (isTyping: boolean) => {
    if (!socket || !activeConversationId) return;
    socket.emit(isTyping ? "chat:typing" : "chat:typing:stop", {
      conversationId: activeConversationId,
      userId: mode === "admin" ? peerUserId : undefined,
    });
  };

  const handleTextChange = (value: string) => {
    setText(value);
    ensureAudioUnlocked();

    if (!typing) {
      setTyping(true);
      emitTyping(true);
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
      emitTyping(false);
    }, 1200);
  };

  const sendPayload = async (formData: FormData) => {
    ensureAudioUnlocked();
    void requestNotifyPermission();

    try {
      setSending(true);
      emitTyping(false);
      setTyping(false);

      const endpoint = mode === "admin" ? "/chat/admin/messages" : "/chat/messages";
      const response = await api.post(endpoint, formData);
      const message = response.data.data as ChatMessage;

      if (message && !knownIdsRef.current.has(message._id)) {
        knownIdsRef.current.add(message._id);
        setMessages((prev) => [...prev, message]);
      }

      if (response.data.conversation) {
        setConversation(response.data.conversation);
      }

      setText("");
      setTimeout(() => scrollToBottom(true), 30);
    } catch (error) {
      showToast(getApiError(error), "error");
    } finally {
      setSending(false);
    }
  };

  const handleSend = async (e?: FormEvent) => {
    e?.preventDefault();
    const value = text.trim();
    if (!value || sending) return;

    if (mode === "admin" && !activeConversationId) {
      showToast("Select a conversation first", "warning");
      return;
    }

    const body = new FormData();
    body.append("text", value);
    if (mode === "admin") {
      body.append("conversationId", activeConversationId);
    }

    await sendPayload(body);
  };

  const handleAttachment = async (file: File | null) => {
    if (!file) return;

    if (mode === "admin" && !activeConversationId) {
      showToast("Select a conversation first", "warning");
      return;
    }

    const body = new FormData();
    body.append("attachment", file);
    if (text.trim()) body.append("text", text.trim());
    if (mode === "admin") body.append("conversationId", activeConversationId);

    await sendPayload(body);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const headerTitle =
    title ||
    (mode === "admin"
      ? typeof conversation?.user === "object"
        ? conversation.user.name || "Customer"
        : "Customer"
      : "Glamira Support");

  const headerSubtitle =
    subtitle ||
    (mode === "admin"
      ? typeof conversation?.user === "object"
        ? conversation.user.email || ""
        : ""
      : connected
        ? "We typically reply quickly"
        : "Reconnecting...");

  const grouped = useMemo(() => {
    const items: Array<
      | { type: "day"; label: string; key: string }
      | { type: "message"; message: ChatMessage; key: string }
    > = [];

    let lastDay = "";
    messages.forEach((message) => {
      const day = formatChatDayLabel(message.createdAt);
      if (day && day !== lastDay) {
        items.push({ type: "day", label: day, key: `day-${day}-${message._id}` });
        lastDay = day;
      }
      items.push({ type: "message", message, key: message._id });
    });

    return items;
  }, [messages]);

  if (mode === "admin" && !externalConversationId) {
    return (
      <div className="flex h-full min-h-[420px] items-center justify-center rounded-2xl border border-white/20 bg-white/10 p-8 text-center text-pink-100">
        Select a customer conversation to start chatting.
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col overflow-hidden border border-white/20 bg-[#3b1026]/55 backdrop-blur-xl ${
        compact ? "h-[560px] rounded-[28px]" : "h-full min-h-[560px] rounded-2xl"
      }`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/15 px-4 py-3">
        <div>
          <p className="font-semibold text-white">{headerTitle}</p>
          <p className="text-xs text-pink-200">
            {peerTyping ? "Typing..." : headerSubtitle}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            ensureAudioUnlocked();
            setMuted(!muted);
          }}
          className="rounded-full border border-white/20 bg-white/10 p-2 text-white hover:bg-white/20"
          title={muted ? "Unmute" : "Mute"}
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>

      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-4">
        {page < totalPages ? (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={loadOlder}
              disabled={loadingMore}
              className="rounded-full bg-white/10 px-3 py-1 text-xs text-pink-100 hover:bg-white/20"
            >
              {loadingMore ? "Loading..." : "Load older messages"}
            </button>
          </div>
        ) : null}

        {loading ? (
          <div className="flex h-full items-center justify-center text-pink-100">
            <Loader2 className="mr-2 animate-spin" size={18} />
            Loading chat...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-pink-100">
            <p className="font-medium text-white">No messages yet</p>
            <p className="mt-1 max-w-xs text-sm">
              Say hello — Glamira Support is here to help with products, orders,
              and beauty advice.
            </p>
          </div>
        ) : (
          grouped.map((item) => {
            if (item.type === "day") {
              return (
                <div key={item.key} className="flex justify-center">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] text-pink-100">
                    {item.label}
                  </span>
                </div>
              );
            }

            const message = item.message;
            const mine = getSenderId(message.sender) === myId;

            return (
              <div
                key={item.key}
                className={`flex ${mine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                    mine
                      ? "rounded-br-md bg-white text-[#7a1f4d]"
                      : "rounded-bl-md bg-white/15 text-pink-50"
                  }`}
                >
                  {message.messageType === "IMAGE" && message.attachment?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={message.attachment.url}
                      alt={message.attachment.fileName || "Image"}
                      className="mb-2 max-h-56 rounded-xl object-cover"
                    />
                  ) : null}

                  {message.messageType === "FILE" && message.attachment?.url ? (
                    <a
                      href={message.attachment.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`mb-2 flex items-center gap-2 rounded-xl px-2 py-2 ${
                        mine ? "bg-pink-50" : "bg-white/10"
                      }`}
                    >
                      <FileText size={16} />
                      <span className="underline">
                        {message.attachment.fileName || "Attachment"}
                      </span>
                    </a>
                  ) : null}

                  {message.text ? (
                    <p className="whitespace-pre-wrap break-words">{message.text}</p>
                  ) : null}

                  <div
                    className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                      mine ? "text-[#9f6b82]" : "text-pink-200/80"
                    }`}
                  >
                    <span>{formatChatTime(message.createdAt)}</span>
                    {mine ? (
                      message.seenAt ? (
                        <CheckCheck size={14} className="text-[#be185d]" />
                      ) : message.deliveredAt ? (
                        <CheckCheck size={14} />
                      ) : (
                        <Check size={14} />
                      )
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="border-t border-white/15 bg-black/10 px-3 py-3"
      >
        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={() => {
              ensureAudioUnlocked();
              fileInputRef.current?.click();
            }}
            className="rounded-full border border-white/20 bg-white/10 p-2.5 text-white hover:bg-white/20"
            title="Attach image or PDF"
          >
            <Paperclip size={16} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
            className="hidden"
            onChange={(e) => handleAttachment(e.target.files?.[0] || null)}
          />

          <textarea
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void handleSend();
              }
            }}
            rows={1}
            placeholder="Type a message..."
            className="max-h-28 min-h-[44px] flex-1 resize-none rounded-2xl border border-white/20 bg-white/90 px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-pink-200"
          />

          <button
            type="submit"
            disabled={sending || !text.trim()}
            className="rounded-full bg-white p-3 text-[#be185d] transition hover:bg-pink-100 disabled:opacity-50"
          >
            {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
        <p className="mt-2 flex items-center gap-2 text-[11px] text-pink-200/80">
          <ImagePlus size={12} />
          Enter to send · Shift+Enter for newline · Images/PDF up to 5MB
        </p>
      </form>
    </div>
  );
}
