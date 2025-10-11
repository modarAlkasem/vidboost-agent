"use client";

import { useCallback, useEffect, useState } from "react";

import { Usage } from "./usage";

interface TranscriptEntry {
  id: number;
  text: string;
  timestamp: string;
}

const TEMP_TRANSCRIPT = [
  {
    id: 1,
    text: " Hello Bro",
    timestamp: "00:01",
  },
  {
    id: 2,
    text: " Gow're you doing?",
    timestamp: "00:02",
  },
];

export const Transcription = ({ videoId }: { videoId: string }) => {
  const [transcript, setTranscript] = useState<{
    transcript: TranscriptEntry[];
    cache: string;
  } | null>(null);

  const featureUsageExceeded = false;

  const handleGenerateTranscription = useCallback(
    async (videoId: string) => {
      if (featureUsageExceeded) {
        console.log("Transcription limit reached, the user must upgrade");
        return;
      }

      const result = await new Promise((resolve, reject) => {
        resolve(TEMP_TRANSCRIPT);
      });
      setTranscript(result);
    },
    [featureUsageExceeded]
  );

  useEffect(() => {
    handleGenerateTranscription(videoId);
  }, [handleGenerateTranscription, videoId]);

  return (
    <div className="border p-4 p-b-0 rounded-xl gap-4 flex flex-col">
      <Usage title="Transcription" />

      {/** Transcription */}

      {!featureUsageExceeded && (
        <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto rounded-md p-4">
          {transcript ? (
            transcript?.transcript.map((entry, index) => (
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
