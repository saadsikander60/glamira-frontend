"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Loader2, MessageCircle, Search } from "lucide-react";
import api from "@/lib/axios";
import { getApiError } from "@/lib/apiError";
import { formatChatTime, ChatConversation } from "@/lib/chatTypes";
import { useSocket } from "@/context/SocketContext";
import { useToast } from "@/context/ToastContext";
import ChatWindow from "@/components/chat/ChatWindow";

export default function AdminChatPage() {
  const { showToast } = useToast();
  const {
    socket,
    adminUnreadTotal,
    setAdminUnreadTotal,
    playNotifySound,
    ensureAudioUnlocked,
    showBrowserNotification,
  } = useSocket();

  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/chat/admin/conversations", {
        params: { search: search || undefined, limit: 50 },
      });
      setConversations(response.data.conversations || []);
      setAdminUnreadTotal(response.data.unreadTotal || 0);
    } catch (error) {
      showToast(getApiError(error), "error");
    } finally {
      setLoading(false);
    }
  }, [search, setAdminUnreadTotal, showToast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadConversations();
    }, 200);
    return () => clearTimeout(timer);
  }, [loadConversations]);

  useEffect(() => {
    if (!socket) return;

    const onNew = (payload: {
      message?: { senderRole?: string; text?: string; messageType?: string };
      conversation?: ChatConversation;
    }) => {
      if (payload.message?.senderRole !== "USER") return;

      if (payload.conversation) {
        setConversations((prev) => {
          const rest = prev.filter((c) => c._id !== payload.conversation?._id);
          return [payload.conversation as ChatConversation, ...rest];
        });
      } else {
        void loadConversations();
      }

      if (selectedId !== payload.conversation?._id) {
        playNotifySound();
        const userName =
          typeof payload.conversation?.user === "object"
            ? payload.conversation?.user?.name || "Customer"
            : "Customer";
        showBrowserNotification(
          `New message from ${userName}`,
          payload.message.text ||
            (payload.message.messageType === "IMAGE"
              ? "Sent an image"
              : "New chat message"),
        );
      }

      api
        .get("/chat/admin/unread-total")
        .then((res) => setAdminUnreadTotal(res.data.unreadTotal || 0))
        .catch(() => undefined);
    };

    const onUpdate = (payload: { conversation?: ChatConversation }) => {
      if (!payload.conversation) return;
      setConversations((prev) => {
        const rest = prev.filter((c) => c._id !== payload.conversation?._id);
        return [payload.conversation as ChatConversation, ...rest].sort(
          (a, b) =>
            new Date(b.lastMessageAt || 0).getTime() -
            new Date(a.lastMessageAt || 0).getTime(),
        );
      });
    };

    socket.on("chat:message:new", onNew);
    socket.on("chat:conversation:update", onUpdate);

    return () => {
      socket.off("chat:message:new", onNew);
      socket.off("chat:conversation:update", onUpdate);
    };
  }, [
    socket,
    selectedId,
    loadConversations,
    playNotifySound,
    showBrowserNotification,
    setAdminUnreadTotal,
  ]);

  const selected = useMemo(
    () => conversations.find((c) => c._id === selectedId) || null,
    [conversations, selectedId],
  );

  const peerUserId =
    selected && typeof selected.user === "object"
      ? selected.user._id || selected.user.id || ""
      : "";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white">Live Chat</h2>
          <p className="mt-1 text-sm text-pink-100">
            Real-time USER ↔ ADMIN support conversations.
          </p>
        </div>
        <div className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-pink-100">
          Unread: {adminUnreadTotal}
        </div>
      </div>

      <div className="grid h-[70vh] min-h-[560px] overflow-hidden rounded-2xl border border-white/20 bg-white/5 lg:grid-cols-[320px_1fr]">
        <aside
          className={`flex flex-col border-r border-white/15 bg-[#3b1026]/40 ${
            mobileShowChat ? "hidden lg:flex" : "flex"
          }`}
        >
          <div className="border-b border-white/15 p-3">
            <div className="relative">
              <Search
                size={14}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#9f6b82]"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customers..."
                className="w-full rounded-full border border-white/20 bg-white/90 py-2.5 pr-3 pl-9 text-sm text-gray-800 outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center gap-2 p-8 text-pink-100">
                <Loader2 className="animate-spin" size={16} />
                Loading...
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-sm text-pink-100">
                No conversations yet.
              </div>
            ) : (
              conversations.map((conversation) => {
                const name =
                  typeof conversation.user === "object"
                    ? conversation.user.name || "Customer"
                    : "Customer";
                const email =
                  typeof conversation.user === "object"
                    ? conversation.user.email || ""
                    : "";
                const active = selectedId === conversation._id;

                return (
                  <button
                    key={conversation._id}
                    type="button"
                    onClick={() => {
                      ensureAudioUnlocked();
                      setSelectedId(conversation._id);
                      setMobileShowChat(true);
                    }}
                    className={`flex w-full items-start gap-3 border-b border-white/10 px-4 py-3 text-left transition ${
                      active ? "bg-white/20" : "hover:bg-white/10"
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-[#be185d]">
                      {name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate font-semibold text-white">{name}</p>
                        <span className="text-[10px] text-pink-200">
                          {formatChatTime(conversation.lastMessageAt)}
                        </span>
                      </div>
                      <p className="truncate text-xs text-pink-200">{email}</p>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <p className="truncate text-xs text-pink-100">
                          {conversation.lastMessage || "No messages yet"}
                        </p>
                        {(conversation.unreadForAdmin || 0) > 0 ? (
                          <span className="rounded-full bg-[#be185d] px-1.5 text-[10px] font-bold text-white">
                            {conversation.unreadForAdmin}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <section
          className={`min-h-0 ${mobileShowChat ? "flex" : "hidden lg:flex"} flex-col`}
        >
          {selectedId ? (
            <>
              <div className="flex items-center gap-2 border-b border-white/15 px-3 py-2 lg:hidden">
                <button
                  type="button"
                  onClick={() => setMobileShowChat(false)}
                  className="rounded-full bg-white/10 p-2 text-white"
                >
                  <ArrowLeft size={16} />
                </button>
                <span className="text-sm text-pink-100">Back to chats</span>
              </div>
              <div className="min-h-0 flex-1 p-2 lg:p-3">
                <ChatWindow
                  mode="admin"
                  conversationId={selectedId}
                  peerUserId={peerUserId}
                />
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center text-pink-100">
              <MessageCircle size={28} />
              <p>Select a customer conversation to reply in real time.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
