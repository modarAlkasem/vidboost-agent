export type CreateVideoPayload = {
  url: string;
};

export type CreateVideoResponse = {
  id: string;
  user: string;
  provider_video_id: string;
  is_new: boolean;
  created_at: string;
  updated_at: string;
};

export type ChannelDetails = {
  id: number;
  name: string;
  thumbnail: string;
  subscriber_count: number;
};

export type VideoDetails = {
  title: string;
  description: string;
  thumbnail: string;
  thumbnail_high_res: string;
  duration: number;
  view_count: number;
  like_count: number;
  comment_count: number;
  published_at: string;
  channel: ChannelDetails;
};

export type VideoTitle = {
  id: number;
  title: string;
  video: string;
  created_at: string;
  updated_at: string;
};

export type GetVideoTitlesPayload = {
  videoId: string;
};

export type GetVideoTitlesResponse = VideoTitle[];
