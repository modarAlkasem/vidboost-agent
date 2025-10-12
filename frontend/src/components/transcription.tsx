"use client";

import { useCallback, useEffect, useState } from "react";

import { Usage } from "./usage";

import type { VideoAnalysisTaskData } from "@/lib/websocket/video-analysis-task-websocket";

interface TranscriptEntry {
  id: number;
  text: string;
  timestamp: string;
}

export const Transcription = ({
  transcript,
  isLoading = true,
}: {
  transcript: VideoAnalysisTaskData["video_transcript"] | undefined;
  isLoading: boolean;
}) => {
  const featureUsageExceeded = false;

  return (
    <div className="border p-4 p-b-0 rounded-xl gap-4 flex flex-col border-blue-600">
      <Usage title="Transcription" />

      {/** Transcription */}

      {!featureUsageExceeded && (
        <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto rounded-md p-4">
          {transcript ? (
            transcript?.map((entry, index) => (
              <div key={index} className="flex gap-2">
                <span className="text-sm text-gray-400 min-w-[50px]">
                  {entry.timestamp}
                </span>
                <p className="text-sm text-gray-700">{entry.text}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500"> No transcription available</p>
          )}
        </div>
      )}
    </div>
  );
};
