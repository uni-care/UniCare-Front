"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { MdArrowBack, MdPerson } from "react-icons/md";
import { useRouter } from "@/i18n/routing";

import { useAuth } from "@/hooks/useAuth";
import { chatApi } from "@/api/chat-api";
import type { ConversationMessage, ConversationResponse } from "@/types/chat";
import { ensureSignalRStarted, getSignalRConnection } from "@/lib/signalr";
import { useLocale } from "next-intl";

function formatMessageTime(sentAt?: string, isAr = false) {
  if (!sentAt) return "";
  try {
    let normalized = sentAt.trim();
    if (!normalized.endsWith("Z") && !/[+-]\d{2}:\d{2}$/.test(normalized)) {
      normalized += "Z";
    }
    const date = new Date(normalized);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString(isAr ? "ar-EG" : "en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "";
  }
}

export default function ChatPageClient() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const [signalRErrorShown, setSignalRErrorShown] = useState(false);
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const locale = useLocale();
  const isAr = locale === "ar";

  const chatId = searchParams.get("chatId");
  const itemTitle = searchParams.get("itemTitle") ?? (isAr ? "المورد المطلوب" : "Requested Item");
  const ownerName = searchParams.get("ownerName") ?? searchParams.get("userName");

  const conversationQuery = useQuery({
    queryKey: ["chat", "conversation", chatId, user?.id],
    queryFn: () => chatApi.getConversation(chatId!, user!.id),
    enabled: Boolean(chatId && user?.id),
    refetchInterval: isRealtimeConnected ? false : 2500,
    refetchOnWindowFocus: !isRealtimeConnected,
  });

  const messages = useMemo(() => {
    return conversationQuery.data?.messages ?? [];
  }, [conversationQuery.data?.messages]);

  useEffect(() => {
    if (!chatId || !user?.id) {
      return;
    }

    const apiBase = (process.env.NEXT_PUBLIC_API_URL ?? "").trim().replace(/\/$/, "");
    const hubUrl = apiBase ? `${apiBase}/hubs/chat` : "/hubs/chat";
    const connection = getSignalRConnection(hubUrl);
    const queryKey = ["chat", "conversation", chatId, user?.id] as const;
    let isDisposed = false;

    const onReceiveMessage = (payload: unknown) => {
      const data = payload as Partial<ConversationMessage> & { chatId?: string; ChatId?: string; MessageId?: string };
      const payloadChatId = data.chatId ?? data.ChatId;
      if (!payloadChatId || payloadChatId !== chatId) {
        return;
      }

      const normalized: ConversationMessage = {
        messageId: String(data.messageId ?? data.MessageId ?? crypto.randomUUID()),
        senderId: String(data.senderId ?? ""),
        body: String(data.body ?? ""),
        type: String(data.type ?? "Text"),
        sentAt: String(data.sentAt ?? new Date().toISOString()),
        readAt: data.readAt ?? null,
      };

      queryClient.setQueryData(queryKey, (previous: ConversationResponse | undefined) => {
        if (!previous) {
          return previous;
        }

        const exists = previous.messages.some((entry) => entry.messageId === normalized.messageId);
        if (exists) {
          return previous;
        }

        return {
          ...previous,
          messages: [...previous.messages, normalized],
        };
      });
    };

    const onMessagesRead = (payload: unknown) => {
      const data = payload as { chatId?: string; ChatId?: string; readerId?: string; ReaderId?: string };
      const payloadChatId = data.chatId ?? data.ChatId;
      const readerId = data.readerId ?? data.ReaderId;

      if (!payloadChatId || payloadChatId !== chatId || !readerId || readerId === user?.id) {
        return;
      }

      queryClient.setQueryData(queryKey, (previous: ConversationResponse | undefined) => {
        if (!previous) {
          return previous;
        }

        return {
          ...previous,
          messages: previous.messages.map((entry) =>
            entry.senderId === user?.id
              ? { ...entry, readAt: entry.readAt ?? new Date().toISOString() }
              : entry
          ),
        };
      });
    };

    connection.on("ReceiveMessage", onReceiveMessage);
    connection.on("MessagesRead", onMessagesRead);

    void (async () => {
      try {
        await ensureSignalRStarted(connection);
        await connection.invoke("JoinChat", chatId);
        if (!isDisposed) {
          setIsRealtimeConnected(true);
          setSignalRErrorShown(false);
        }
      } catch (error) {
        if (!isDisposed) {
          setIsRealtimeConnected(false);
          if (!signalRErrorShown) {
            toast.message(isAr ? "الاتصال المباشر غير متوفر. جاري مزامنة الرسائل تلقائيًا." : "Realtime unavailable. Chat is syncing automatically.");
            setSignalRErrorShown(true);
          }
        }
        console.error("SignalR setup failed:", error);
      }
    })();

    return () => {
      isDisposed = true;
      setIsRealtimeConnected(false);
      connection.off("ReceiveMessage", onReceiveMessage);
      connection.off("MessagesRead", onMessagesRead);
      void connection.invoke("LeaveChat", chatId).catch(() => undefined);
    };
  }, [chatId, queryClient, signalRErrorShown, user?.id, isAr]);

  const sendMessageMutation = useMutation({
    mutationFn: async (body: string) => {
      if (!chatId || !user?.id) {
        throw new Error(isAr ? "سياق المحادثة مفقود." : "Missing chat context.");
      }
      return chatApi.sendMessage(chatId, {
        senderId: user.id,
        body,
      });
    },
    onSuccess: async (newMessage) => {
      setMessage("");
      queryClient.setQueryData(
        ["chat", "conversation", chatId, user?.id],
        (previous: ConversationResponse | undefined) => {
          if (!previous) {
            return previous;
          }

          const exists = previous.messages.some(
            (entry) => entry.messageId === newMessage.messageId
          );
          if (exists) {
            return previous;
          }

          return {
            ...previous,
            messages: [...previous.messages, newMessage],
          };
        }
      );
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : (isAr ? "فشل إرسال الرسالة." : "Failed to send message.");
      toast.error(errorMessage);
    },
  });

  if (!chatId) {
    return (
      <div className="min-h-screen bg-neutral-100 px-4 pb-10 pt-28 md:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-neutral-800">
            {isAr ? "لم يتم تحديد أي محادثة" : "No chat selected"}
          </h1>
          <p className="mt-2 text-neutral-500">
            {isAr ? "أرسل طلبًا من المتجر لفتح محادثة مع صاحب المورد." : "Send a marketplace request to open a conversation with an item owner."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-neutral-100 px-4 pb-50 pt-36 md:px-8">
      <div className="mx-auto flex max-w-3xl flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
        <div className={`border-b border-neutral-200 bg-white px-5 py-4 flex items-center justify-between ${isAr ? "flex-row-reverse" : ""}`}>
          <div className={`flex items-center gap-3 ${isAr ? "flex-row-reverse" : ""}`}>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-colors hover:bg-neutral-200 shrink-0"
              title={isAr ? "رجوع" : "Back"}
            >
              <MdArrowBack className={`text-xl ${isAr ? "rotate-180" : ""}`} />
            </button>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 font-bold text-primary">
              {ownerName ? ownerName.charAt(0).toUpperCase() : <MdPerson className="text-xl" />}
            </div>
            <div className={isAr ? "text-right" : "text-left"}>
              <h2 className="text-base font-bold leading-tight text-neutral-800">{itemTitle}</h2>
              {ownerName && (
                <p className="text-xs font-medium text-neutral-500">
                  {isAr ? `مع: ${ownerName}` : `With: ${ownerName}`}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex min-h-105 flex-col gap-3 bg-neutral-100 px-4 py-5">
          {conversationQuery.isLoading ? (
            <p className={`text-sm text-neutral-500 ${isAr ? "text-right" : "text-left"}`}>
              {isAr ? "جاري تحميل المحادثة..." : "Loading conversation..."}
            </p>
          ) : conversationQuery.isError ? (
            <p className={`text-sm text-red-600 ${isAr ? "text-right" : "text-left"}`}>
              {isAr ? "فشل تحميل المحادثة. يرجى التحديث والمحاولة مرة أخرى." : "Failed to load conversation. Please refresh and try again."}
            </p>
          ) : messages.length === 0 ? (
            <p className={`text-sm text-neutral-500 ${isAr ? "text-right" : "text-left"}`}>
              {isAr ? "لا توجد رسائل بعد. ابدأ المحادثة الآن." : "No messages yet. Start the conversation."}
            </p>
          ) : (
            messages.map((entry: ConversationMessage, index: number) => {
              const isMine = entry.senderId === user?.id;
              const messageKey =
                entry.messageId && entry.messageId.trim().length > 0
                  ? `${entry.messageId}-${index}`
                  : `${entry.senderId}-${entry.sentAt}-${index}`;
              return (
                <div
                  key={messageKey}
                  className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                    isMine
                      ? "ml-auto bg-primary text-white"
                      : "mr-auto bg-[#e6edf0] text-neutral-800"
                  } ${isAr ? "text-right" : "text-left"}`}
                >
                  <p>{entry.body || "..."}</p>
                  <p className={`mt-1 text-[11px] ${isMine ? "text-white/80" : "text-neutral-500"}`}>
                    {formatMessageTime(entry.sentAt, isAr)}
                  </p>
                </div>
              );
            })
          )}
        </div>

        <form
          className={`flex items-center gap-3 border-t border-neutral-200 px-4 py-4 ${isAr ? "flex-row-reverse" : ""}`}
          onSubmit={(event) => {
            event.preventDefault();
            const trimmed = message.trim();
            if (!trimmed) {
              return;
            }
            sendMessageMutation.mutate(trimmed);
          }}
        >
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={isAr ? "اكتب رسالة..." : "Message..."}
            className={`h-11 w-full rounded-full border border-neutral-300 bg-white px-4 text-sm text-neutral-800 outline-none focus:border-primary ${isAr ? "text-right" : "text-left"}`}
          />
          <button
            type="submit"
            disabled={sendMessageMutation.isPending}
            className="flex h-11 shrink-0 items-center justify-center rounded-full bg-primary px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isAr ? "إرسال" : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
