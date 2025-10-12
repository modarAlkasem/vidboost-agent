import { NEXT_PUBLIC_WEB_SOCKET_BASE_API_URL } from "../constants/app";
import { getSession } from "next-auth/react";

interface VideoAnalysisTaskStatusCallback {
  (data: VideoAnalysisTaskEventPayload): void;
}

export interface VideoAnalysisTaskData {
  video_info: {
    title: string;
    description: string;
    thumbnail: string;
    thumbnail_high_res: string;
    duration: number; // seconds
    view_count: number;
    like_count: number;
    comment_count: number;
    published_at: string; // ISO format
    channel: {
      id: string;
      name: string;
      subscriber_count: number;
      thumbnail: string;
    };
  };
  video_transcript: {
    text: string;
    timestamp: string;
  }[];
}
export interface VideoAnalysisTaskEventPayload {
  type: string;
  message: string;
  status: "STARTED" | "PROCESSING" | "COMPLETED" | "RETRY" | "FAILURE";
  data?: VideoAnalysisTaskData;
  error?: any;
}

export class VideoAnalysisTaskWebSocket {
  private ws: WebSocket | null = null;
  private taskId: string;
  private callbacks: VideoAnalysisTaskStatusCallback[] = [];
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 2000;

  constructor(taskId) {
    this.taskId = taskId;
  }

  connect = (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      const session = await getSession();
      const token = session?.accessToken;
      const wsUrl = `${NEXT_PUBLIC_WEB_SOCKET_BASE_API_URL()}/video/tasks/${
        this.taskId
      }/?token=${token}`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log("Connected to WebSocket:", wsUrl);

        this.reconnectAttempts = 0;
        resolve();
      };

      this.ws.onmessage = (event) => {
        try {
          const data: VideoAnalysisTaskEventPayload = JSON.parse(event.data);
          console.log("📩 Received WebSocket message:", data);

          this.callbacks.forEach((callback) => callback(data));

          if (data.status === "COMPLETED" || data.status === "FAILURE") {
            setTimeout(() => this.disconnect(), 1000);
          }
        } catch (err) {
          console.error("❌ Error parsing WebSocket message:", err);
        }
      };

      this.ws.onerror = (err) => {
        console.error("❌ WebSocket error occurred:", err);
        reject();
      };

      this.ws.onclose = (event) => {
        console.log(
          `🔌 WebSocket connection closed for task ${this.taskId}. Code: ${event.code}`
        );

        if (
          event.code !== 1000 &&
          this.reconnectAttempts < this.maxReconnectAttempts
        ) {
          this.reconnectAttempts++;
          console.log(
            `🔄 Attempting to reconnect... (Attempt ${this.reconnectAttempts} of ${this.maxReconnectAttempts})`
          );
          setTimeout(() => this.connect(), this.reconnectDelay);
        }
      };
    });
  };

  onStatusUpdate = (
    callback: VideoAnalysisTaskStatusCallback
  ): (() => void) => {
    this.callbacks.push(callback);

    return () => {
      this.callbacks = this.callbacks.filter((cb) => cb !== callback);
    };
  };

  disconnect = (): void => {
    if (this.ws) {
      this.ws.close(1000, "Clinet disconnected");
    }
  };

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}
