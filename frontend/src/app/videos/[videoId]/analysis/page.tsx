"use client";

import { useParams } from "next/navigation";

const VideoAnalysisPage = () => {
  const { videoId } = useParams();

  return <h1>{videoId}</h1>;
};

export default VideoAnalysisPage;
