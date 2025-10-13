"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

import { Usage } from "./usage";
import { getVideoImages } from "@/lib/api/video/fetchers";

export const ThumbnailGeneration = ({ videoId }: { videoId: string }) => {
  const { data } = useQuery({
    queryKey: ["videos", videoId, "images", "list"],
    queryFn: () => getVideoImages({ videoId }),
    enabled: !!videoId,
  });

  return (
    <div className="rounded-xl flex flex-col p-4 border border-blue-600">
      <div className="min-w-52">
        <Usage title="Thumbnail Generation" />
      </div>

      {/** Simple horizontal scroll for images */}
      <div
        className={`flex overflow-x-auto overflow-y-hidden gap-4 ${
          data?.length && "mt-4"
        }`}
      >
        {data?.map(
          (image) =>
            image.url && (
              <div
                key={image.id}
                className="flex-none w-[200px] h-[110px] rouned-lg overflow-y-hidden overflow-x-auto"
              >
                <Image
                  src={image.url}
                  alt="Generated Image"
                  width={200}
                  height={200}
                  className="object-cover"
                />
              </div>
            )
        )}
      </div>

      {/** No images generated yet */}
      {!data?.length && (
        <div className="text-center py-8 px-4 rounded-lg mt-4 border-2 border-dashed border-blue-600">
          <p className="text-gray-400"> No thumbnails has been generated yet</p>
          <p className="text-sm text-gray-500 mt-1">
            Generate thumbnails to see appears here.
          </p>
        </div>
      )}
    </div>
  );
};
