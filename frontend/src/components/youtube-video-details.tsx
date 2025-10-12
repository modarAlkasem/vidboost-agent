"use client";

import Image from "next/image";

import { Eye, MessageCircle, ThumbsUp, Calendar } from "lucide-react";

import type { VideoAnalysisTaskData } from "@/lib/websocket/video-analysis-task-websocket";

export const YoutubeVideoDetails = ({
  videoInfo,
  isLoading = true,
}: {
  videoInfo: VideoAnalysisTaskData["video_info"] | undefined;
  isLoading: boolean;
}) => {
  if (isLoading || !videoInfo) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-12 w-12 rounded-full border-y-4  bg-blue-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="@container rounded-xl">
      <div className="flex flex-col gap-8">
        {/** Video Thumbnail */}
        <div className="flex-shrink-0">
          <Image
            src={videoInfo?.thumbnail_high_res ?? videoInfo?.thumbnail ?? ""}
            alt="Youtube Video Thumbnail"
            width={500}
            height={500}
            className="w-full rouned-xl shadow-md hover:shadow-xl transition-shadow duration-500"
          />
        </div>

        {/** Video Details */}
        <div className="flex-grow space-y-4">
          <h1 className="text-2xl @lg:tex-3xl font-bold text-white leading-tight line-clamp-2">
            {videoInfo?.title}
          </h1>

          {/** Channel Info */}
          <div className="flex items-center gap-4">
            <Image
              src={videoInfo?.channel.thumbnail ?? ""}
              alt="Youtube channel Thumbnail"
              width={48}
              height={48}
              className="w-10 h-10 @md:w-12 @md:h-12 rounded-full border-2 border-blue-600"
            />
            <div>
              <p className="text-base @md:text-lg font-semibold text-white">
                {videoInfo?.channel.name}
              </p>
              <p className="text-sm @md:text-base text-white">
                {videoInfo?.channel.subscriber_count} Subscribers
              </p>
            </div>
          </div>

          {/** Video Status */}
          <div className="grid grid-cols-2 @lg:grid-cols-4 gap-4 pt-4">
            <div className="bg-[#3e3e68]  rouned-lg p-3 transition-all duration-500 hover:bg-[#5a5a8c]">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-400"> Published</p>
              </div>
              <p className="font-medium text-white">
                {new Date(
                  videoInfo?.published_at as string
                ).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-[#3e3e68]  rouned-lg p-3 transition-all duration-500 hover:bg-[#5a5a8c]">
              <div className="flex items-center gap-2 mb-1">
                <Eye className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-400"> Views</p>
              </div>
              <p className="font-medium text-white">{videoInfo?.view_count}</p>
            </div>

            <div className="bg-[#3e3e68]  rouned-lg p-3 transition-all duration-500 hover:bg-[#5a5a8c]">
              <div className="flex items-center gap-2 mb-1">
                <ThumbsUp className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-400"> Likes</p>
              </div>
              <p className="font-medium text-white">{videoInfo?.like_count}</p>
            </div>
            <div className="bg-[#3e3e68]  rouned-lg p-3 transition-all duration-500 hover:bg-[#5a5a8c]">
              <div className="flex items-center gap-2 mb-1">
                <MessageCircle className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-400"> Comments</p>
              </div>
              <p className="font-medium text-white">
                {videoInfo?.comment_count}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
