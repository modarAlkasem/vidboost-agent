import api from "@/lib/axios";
import type {
  CreateVideoPayload,
  CreateVideoResponse,
  GetVideoTitlesPayload,
  GetVideoTitlesResponse,
} from "./types";

export const createVideo = async ({
  url,
}: CreateVideoPayload): Promise<CreateVideoResponse> => {
  const response = await api.post<CreateVideoResponse>("/videos/", {
    url,
  });

  return response.data;
};

export const getVideoTitles = async ({
  videoId,
}: GetVideoTitlesPayload): Promise<GetVideoTitlesResponse> => {
  const response = await api.get<GetVideoTitlesResponse>(
    `/videos/${videoId}/titles/`
  );

  return response.data;
};
