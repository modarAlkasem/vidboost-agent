"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import { useVideoAnalysisTask } from "@/lib/websocket/hooks/use-video-analysis-task";
import { Usage } from "@/components/usage";
import { YoutubeVideoDetails } from "@/components/youtube-video-details";
import { ThumbnailGeneration } from "@/components/thumbnail-generation";

const VideoAnalysisPage = () => {
  const params = useParams();
  const videoId = params.videoId as string;
  const video = true;

  const videoTranscriptionStatus =
    video == undefined ? (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 border-r bg-[#3e3e68] border-blue-600 rounded-full ">
        <div className="w-2 h-2 bg-[#5a5a8c] rounded-full mr-2 animate-pulse" />
        <span className="text-sm text-gray-400"> Loading...</span>
      </div>
    ) : !video ? (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 border-r bg-amber-50 border-amber-200 rounded-full ">
        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2 animate-pulse" />
        <p className="text-sm text-amber-700">
          This is your first time analyzing this video.
          <span className="font-semibold">
            [1 Analysis token is being used!]
          </span>
        </p>
      </div>
    ) : (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 border-r bg-green-50 border-green-200 rounded-full ">
        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
        <p className="text-sm text-green-700">
          Analysis exists for this video - no additional tokens needed in future
          calls.
        </p>
      </div>
    );

  return (
    <div className="xl:container mx-auto p-4 bg-gradient-to-b from-[#121224] to-[#2D2D4D]">
      <div className="grid lg:grid-cols-2 gap-4">
        {/** Left Side */}
        <div className="order-2 lg:order-1 flex flex-col gap-4  lg:border-r border-blue-600 p-4">
          {/** Analysis Section */}
          <div className="flex flex-col p-4 gap-4 border  border-blue-600 rounded-xl">
            <Usage title="Video Analysis" />

            {/** Video Transcription status */}
            {videoTranscriptionStatus}
          </div>

          {/** Youtube video Details Section */}
          <YoutubeVideoDetails videoId={videoId} />
          {/** Thumbnail Generation Section */}
          <ThumbnailGeneration videoId={videoId} />
          {/** Title Section */}
          <TitleGeneration videoId={videoId} />
        </div>
      </div>
    </div>
  );
};

export default VideoAnalysisPage;
