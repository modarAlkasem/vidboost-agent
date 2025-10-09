import api from "@/lib/axios";
import type { CreateVideoPayload, CreateVideoResponse } from "./types";

export const createVideo = async ({
  url,
}: CreateVideoPayload): Promise<CreateVideoResponse> => {
  const response = await api.post<CreateVideoResponse>("/videos/", {
    url,
  });

  return response.data;
};
