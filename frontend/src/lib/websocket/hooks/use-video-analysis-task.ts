import { useState, useEffect } from "react";

import {
  VideoAnalysisTaskWebSocket,
  type VideoAnalysisTaskEventPayload,
} from "../video-analysis-task-websocket";

export const useVideoAnalysisTask = (taskId: string | null) => {
  const [taskStatus, setTaskStatus] =
    useState<VideoAnalysisTaskEventPayload | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!taskId) return;

    const ws = new VideoAnalysisTaskWebSocket(taskId);

    const unsubscriber = ws.onStatusUpdate((data) => {
      setTaskStatus({
        type: data.type,
        status: data.status,
        message: data.message,
        data: data?.data,
        error: data?.error,
      });
    });

    ws.connect()
      .then(() => setIsConnected(true))
      .catch((err) => {
        console.error("❌ Failed  connect to WebSocket:", err);
        setTaskStatus({
          type: "task_update",
          status: "FAILURE",
          message: "Failed  connect to WebSocket",
        });
      });

    return () => {
      unsubscriber();
      ws.disconnect();
    };
  }, [taskId]);

  return {
    isConnected,
    taskStatus,
  };
};
