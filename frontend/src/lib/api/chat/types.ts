export type ChatSession = {
  id: string;
  video: string;
  user: string;
  created_at: string;
  is_new: boolean;
};

export type CreateChatSessionPayload = {
  videoId: string;
};

export type CreateChatSessionResponse = ChatSession;

export type ChatMessage = {
  id: string;
  session: string;
  role: "user" | "assistant";
  content: string;
  tool_calls: Array<null | object>;
};

export type GetChatMessagesPayload = {
  sessionId: string;
};

export type GetChatMessagesResponse = Array<ChatMessage>;
