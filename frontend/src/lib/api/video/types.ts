export type CreateVideoPayload = {
  url: string;
};

export type CreateVideoResponse = {
  id: string;
  user: string;
  provider_video_id: string;
  created_at: string;
  updated_at: string;
};
