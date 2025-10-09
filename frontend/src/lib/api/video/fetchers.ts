import api from "@/lib/axios";
import type { CreateVideoPayload, CreateVideoResponse } from "./types";

export const createVideo = async ({ url }: CreateVideoPayload) => {
  const response = await api.post<ApiResponse<CreateVideoResponse>>(url);

  return response.data;
};
