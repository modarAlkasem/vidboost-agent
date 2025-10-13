"use client";

import { Copy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Usage } from "./usage";
import { getVideoTitles } from "@/lib/api/video/fetchers";

export const TitleGeneration = ({ videoId }: { videoId: string }) => {
  const { data } = useQuery({
    queryKey: ["videos", videoId, "titles", "list"],
    queryFn: () => getVideoTitles({ videoId }),
    enabled: !!videoId,
  });
  const isTitleGenerationEnabled = true;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-4 border border-blue-600 rounded-xl shadow-sm">
      <div className="min-w-52">
        <Usage title="Titles" />
      </div>

      <div className="space-y-3 mt-4 max-h-[280px] overflow-y-auto ">
        {data?.map((title) => (
          <div
            key={title?.id}
            className="group relative p-4 rounded-lg border border-blue-600 bg-[#3e3e68] hover:bg-[#5a5a8c] transition-all duration-500"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm text-white leading-relaxed ">
                {title?.title}
              </p>
              <button
                onClick={() => copyToClipboard(title.title)}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-1.5 hover:bg-blue-400 rounded-md"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4 text-blue-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/** No titles generated yet */}
      {!data?.length && !!isTitleGenerationEnabled && (
        <div className="text-center py-8 px-4 rounded-lg mt-4 border-2 border-dashed border-blue-600">
          <p className="text-gray-400">No titles have been generated yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Generate titles to see appear here
          </p>
        </div>
      )}
    </div>
  );
};
