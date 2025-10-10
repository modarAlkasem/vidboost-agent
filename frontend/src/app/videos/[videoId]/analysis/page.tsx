"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import { useVideoAnalysisTask } from "@/lib/websocket/hooks/use-video-analysis-task";

const VideoAnalysisPage = () => {
  const params = useParams();
  const videoId = params.videoId as string;

  return (
    <div className="xl:container mx-auto p-4 bg-gradient-to-b from-[#121224] to-[#2D2D4D]">
      <div className="grid lg:grid-cols-2 gap-4">
        {/** Left Side */}
        <div className="order-2 lg:order-1 flex flex-col gap-4  lg:border-r border-blue-600 p-4">
          {/** Analysis Section */}
          <div className="flex flex-col gap-4 border  border-blue-600 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

export default VideoAnalysisPage;
