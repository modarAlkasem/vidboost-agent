import api from "@/lib/axios";

import {
  CreateChatSessionPayload,
  CreateChatSessionResponse,
  GetChatMessagesPayload,
  GetChatMessagesResponse,
} from "./types";

export const createChatSession = async ({
  videoId,
}: CreateChatSessionPayload): Promise<CreateChatSessionResponse> => {
  const response = await api.post<CreateChatSessionResponse>(
    "/chat/sessions/",
    {
      video_id: videoId,
    }
  );

  return response.data;
};

export const getChatMessages = async ({
  sessionId,
}: GetChatMessagesPayload): Promise<GetChatMessagesResponse> => {
  const response = await api.get<GetChatMessagesResponse>(
    `/chat/sessions/${sessionId}/messages/`
  );

  return response.data;
};
