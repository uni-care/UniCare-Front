import { axiosInstance } from "./axios-instance";
import type {
  ConversationMessage,
  ConversationResponse,
  CreateChatPayload,
  CreateChatResponse,
  SendMessagePayload,
  ChatSummary,
} from "@/types/chat";

const CHAT_ENDPOINTS = {
  root: "/api/v1/chats",
  forTransaction: "/api/v1/chats/for-transaction",
} as const;

const GUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const asRecord = (value: unknown): Record<string, unknown> =>
  typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};

const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

const pickChatId = (rawData: unknown): string => {
  const root = asRecord(rawData);
  const data = asRecord(root.data);
  const value = asRecord(root.value);

  const candidates = [
    root.chatId,
    root.ChatId,
    root.chatID,
    root.id,
    root.Id,
    data.chatId,
    data.ChatId,
    data.chatID,
    data.id,
    data.Id,
    value.chatId,
    value.ChatId,
    value.chatID,
    value.id,
    value.Id,
  ];

  const match = candidates.find((candidate) => typeof candidate === "string" && GUID_REGEX.test(candidate));
  return typeof match === "string" ? match : "";
};

const normalizeConversation = (rawData: unknown): ConversationResponse => {
  const root = asRecord(rawData);
  const data = asRecord(root.data);
  const value = asRecord(root.value);
  const source =
    Object.keys(data).length > 0
      ? data
      : Object.keys(value).length > 0
        ? value
        : root;
  const messagesRaw = asArray(source.messages ?? source.Messages);

  return {
    chatId: String(source.chatId ?? source.ChatId ?? ""),
    transactionId: String(source.transactionId ?? source.TransactionId ?? ""),
    ownerId: String(source.ownerId ?? source.OwnerId ?? ""),
    requesterId: String(source.requesterId ?? source.RequesterId ?? ""),
    messages: messagesRaw.map((entry) => {
      const record = asRecord(entry);
      return {
        messageId: String(record.messageId ?? record.MessageId ?? ""),
        senderId: String(record.senderId ?? record.SenderId ?? ""),
        body: String(record.body ?? record.Body ?? ""),
        type: String(record.type ?? record.Type ?? "Text"),
        sentAt: String(record.sentAt ?? record.SentAt ?? new Date().toISOString()),
        readAt:
          record.readAt === undefined && record.ReadAt === undefined
            ? null
            : String(record.readAt ?? record.ReadAt ?? ""),
      };
    }),
    pageNumber: Number(source.pageNumber ?? source.PageNumber ?? 1),
    pageSize: Number(source.pageSize ?? source.PageSize ?? 50),
  };
};

const normalizeSentMessage = (rawData: unknown): ConversationMessage => {
  const root = asRecord(rawData);
  const data = asRecord(root.data);
  const value = asRecord(root.value);
  const source =
    Object.keys(data).length > 0
      ? data
      : Object.keys(value).length > 0
        ? value
        : root;

  const fallbackId = crypto.randomUUID();

  return {
    messageId: String(source.messageId ?? source.MessageId ?? fallbackId),
    senderId: String(source.senderId ?? source.SenderId ?? ""),
    body: String(source.body ?? source.Body ?? ""),
    type: String(source.type ?? source.Type ?? "Text"),
    sentAt: String(source.sentAt ?? source.SentAt ?? new Date().toISOString()),
    readAt:
      source.readAt === undefined && source.ReadAt === undefined
        ? null
        : String(source.readAt ?? source.ReadAt ?? ""),
  };
};

export const chatApi = {
  getUserChats: async (): Promise<ChatSummary[]> => {
    const { data } = await axiosInstance.get<unknown>(CHAT_ENDPOINTS.root);
    const root = asRecord(data);
    const list = asArray(root.data ?? root.value ?? root);
    return list.map((item) => {
      const rec = asRecord(item);
      return {
        chatId: String(rec.chatId ?? rec.ChatId ?? rec.id ?? rec.Id ?? ""),
        transactionId: String(rec.transactionId ?? rec.TransactionId ?? ""),
        otherUserId: String(rec.otherUserId ?? rec.OtherUserId ?? ""),
        lastMessageBody: String(rec.lastMessageBody ?? rec.LastMessageBody ?? ""),
        lastMessageAt: String(rec.lastMessageAt ?? rec.LastMessageAt ?? ""),
        unreadCount: Number(rec.unreadCount ?? rec.UnreadCount ?? 0),
      };
    });
  },
  getOrCreateForTransaction: async (payload: CreateChatPayload): Promise<CreateChatResponse> => {
    const { data } = await axiosInstance.post<unknown>(CHAT_ENDPOINTS.forTransaction, payload);
    const chatId = pickChatId(data);

    if (!chatId) {
      throw new Error("Chat was created but no chat id was returned from the server.");
    }

    const root = asRecord(data);

    return {
      chatId,
      transactionId: String(root.transactionId ?? root.TransactionId ?? payload.transactionId),
      wasCreated: Boolean(root.wasCreated ?? root.WasCreated),
    };
  },
  getConversation: async (chatId: string, requestingUserId: string): Promise<ConversationResponse> => {
    const { data } = await axiosInstance.get<unknown>(`${CHAT_ENDPOINTS.root}/${chatId}/messages`, {
      params: {
        requestingUserId,
        pageNumber: 1,
        pageSize: 50,
      },
    });

    return normalizeConversation(data);
  },
  sendMessage: async (chatId: string, payload: SendMessagePayload): Promise<ConversationMessage> => {
    const { data } = await axiosInstance.post<unknown>(`${CHAT_ENDPOINTS.root}/${chatId}/messages`, payload);
    return normalizeSentMessage(data);
  },
};
