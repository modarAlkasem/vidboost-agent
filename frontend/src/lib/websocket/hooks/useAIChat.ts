import { useState, useRef, useCallback, useEffect } from "react";

import { getSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";

import type { ChatMessage } from "@/lib/api/chat/types";
import { getChatMessages, createChatSession } from "@/lib/api/chat/fetchers";
import { NEXT_PUBLIC_WEB_SOCKET_BASE_API_URL } from "../../constants/app";

export type AIAgentStatus = "ready" | "submitted" | "streaming" | "error";

export const useAIChat = ({ videoId }: { videoId: string }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<AIAgentStatus>("ready");

  const wsRef = useRef<WebSocket | null>(null);
  const [sessionID, setSessionID] = useState<string | null>(null);
  const currentResponseRef = useRef<string>("");

  const { mutateAsync } = useMutation({
    mutationKey: ["chat-session", "create"],
    mutationFn: () => createChatSession({ videoId }),
    onSuccess: async (data, variables, onMutateResult, context) => {
      if (!data.is_new) {
        const chatMessages = await getChatMessages({ sessionId: data.id });
        setMessages(chatMessages);
      }
      setSessionID(data.id);
    },
  });

  useEffect(() => {
    async function loadChatHistory() {
      await mutateAsync();
    }

    loadChatHistory();
  }, [videoId]);

  useEffect(() => {
    if (!sessionID) return;
    async function connect() {
      const session = await getSession();
      const accessToken = session?.accessToken;
      const ws = new WebSocket(
        `${NEXT_PUBLIC_WEB_SOCKET_BASE_API_URL()}/chat/${sessionID}/?token=${accessToken}`
      );

      ws.onopen = (event) => {
        console.log("🤖 WebSocket connection to AI Agent opened", event);
      };

      ws.onmessage = (event) => {
        console.log("📩 Received WebSocket message:", event.data);
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "message_chunk":
            currentResponseRef.current += data.content;
            setStatus("streaming");
            break;

          case "message_complete":
            const content = currentResponseRef.current as string;
            setMessages((prev) => [
              ...prev,
              {
                id: crypto.randomUUID(),
                role: "assistant",
                content: content,
                tool_calls: [],
                session: sessionID as string,
              },
            ]);
            currentResponseRef.current = "";
            setStatus("ready");
            break;

          case "error":
            console.error("💬❌ Chat error:", data.message);
            setStatus("error");
            break;
        }
      };

      ws.onerror = (event) => console.error("💬❌ WebSocket error:", event);
      ws.onclose = (event) =>
        console.log("🔌 WebSocket connection closed", event.code, event.reason);

      wsRef.current = ws;
    }

    connect();

    return () => wsRef.current?.close();
  }, [videoId, sessionID]);

  const sendMessage = useCallback((content: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error("WebSocket not connected");
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: content,
      tool_calls: [],
      session: sessionID as string,
    };
    setMessages((prev) => [...prev, userMessage]);

    wsRef.current.send(JSON.stringify({ message: content }));
    setStatus("submitted");
  }, []);

  return {
    messages,
    sendMessage,
    status,
    currentResponseRef,
  };
};
