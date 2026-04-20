"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { chatApi } from "@/features/chat/api/chat-api";
import type { ConversationMessage, ConversationResponse } from "@/features/chat/types";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const chatId = searchParams.get("chatId");
  const itemTitle = searchParams.get("itemTitle") ?? "Requested Item";

  const conversationQuery = useQuery({
    queryKey: ["chat", "conversation", chatId, user?.id],
    queryFn: () => chatApi.getConversation(chatId!, user!.id),
    enabled: Boolean(chatId && user?.id),
  });

  const messages = useMemo(() => {
    return conversationQuery.data?.messages ?? [];
  }, [conversationQuery.data?.messages]);

  const sendMessageMutation = useMutation({
    mutationFn: async (body: string) => {
      if (!chatId || !user?.id) {
        throw new Error("Missing chat context.");
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

          return {
            ...previous,
            messages: [...previous.messages, newMessage],
          };
        }
      );
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : "Failed to send message.";
      toast.error(errorMessage);
    },
  });

  if (!chatId) {
    return (
      <div className="min-h-screen bg-neutral-100 px-4 pb-10 pt-28 md:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-neutral-800">No chat selected</h1>
          <p className="mt-2 text-neutral-500">Send a marketplace request to open a conversation with an item owner.</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-neutral-100 px-4 pb-50 pt-50 md:px-8">
      <div className="mx-auto flex max-w-3xl flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-200 bg-neutral-50 px-5 py-4">
          <p className="text-lg font-bold text-neutral-800">{itemTitle}</p>
          <p className="text-sm text-neutral-500">Chat ID: {chatId}</p>
        </div>

        <div className="flex min-h-105 flex-col gap-3 bg-neutral-100 px-4 py-5">
          {conversationQuery.isLoading ? (
            <p className="text-sm text-neutral-500">Loading conversation...</p>
          ) : conversationQuery.isError ? (
            <p className="text-sm text-red-600">Failed to load conversation. Please refresh and try again.</p>
          ) : messages.length === 0 ? (
            <p className="text-sm text-neutral-500">No messages yet. Start the conversation.</p>
          ) : (
            messages.map((entry: ConversationMessage, index: number) => {
              const isMine = entry.senderId === user?.id;
              const messageKey =
                entry.messageId && entry.messageId.trim().length > 0
                  ? entry.messageId
                  : `${entry.senderId}-${entry.sentAt}-${index}`;
              return (
                <div
                  key={messageKey}
                  className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                    isMine
                      ? "ml-auto bg-primary text-white"
                      : "mr-auto bg-[#e6edf0] text-neutral-800"
                  }`}
                >
                  <p>{entry.body || "..."}</p>
                  <p className={`mt-1 text-[11px] ${isMine ? "text-white/80" : "text-neutral-500"}`}>
                    {new Date(entry.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              );
            })
          )}
        </div>

        <form
          className="flex items-center gap-3 border-t border-neutral-200 px-4 py-4"
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
            placeholder="Message..."
            className="h-11 w-full rounded-full border border-neutral-300 bg-white px-4 text-sm text-neutral-800 outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={sendMessageMutation.isPending}
            className="flex h-11 shrink-0 items-center justify-center rounded-full bg-primary px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
