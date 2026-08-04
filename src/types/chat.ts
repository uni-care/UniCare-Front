export interface CreateChatPayload {
  transactionId: string;
  ownerId?: string;
  requesterId?: string;
}

export interface CreateChatResponse {
  chatId: string;
  transactionId: string;
  wasCreated: boolean;
}

export interface ConversationMessage {
  messageId: string;
  senderId: string;
  body: string;
  type: string;
  sentAt: string;
  readAt?: string | null;
}

export interface ConversationResponse {
  chatId: string;
  transactionId: string;
  ownerId: string;
  requesterId: string;
  messages: ConversationMessage[];
  pageNumber: number;
  pageSize: number;
}

export interface SendMessagePayload {
  senderId: string;
  body: string;
}
