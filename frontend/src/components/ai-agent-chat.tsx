"use client";

import { useState, useRef, useEffect } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BotIcon, ImageIcon, LetterText, PenIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { useAIChat } from "@/lib/websocket/hooks/useAIChat";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Form, FormControl, FormItem, FormField, FormMessage } from "./ui/form";
import { toast } from "sonner";

const ZAIAgentFormSchema = z.object({
  value: z.string().min(1),
});

export type TAIAgentFormSchema = z.infer<typeof ZAIAgentFormSchema>;

const TOOL_NAME_MAPPINGS = {
  "tool-fetchTranscript": "Fetch Transcript",
};

export const AIAgentChat = ({ videoId }: { videoId: string }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const messageContentRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, status, currentResponse } = useAIChat({
    videoId,
  });

  const [toastId, setToastId] = useState<number | string | undefined>(
    undefined
  );
  useEffect(() => {
    switch (status) {
      case "submitted":
        setToastId(
          toast.info("Agent is thinking...", {
            id: toastId,
            icon: <BotIcon className="w-4 h-4" />,
          })
        );
        break;

      case "streaming":
        setToastId(
          toast.info("Agent is replying...", {
            id: toastId,
            icon: <BotIcon className="w-4 h-4" />,
          })
        );
        break;

      case "error":
        setToastId(
          toast.error("Whoops! Something went wrong, please try again", {
            id: toastId,
            icon: <BotIcon className="w-4 h-4" />,
          })
        );
        break;

      case "ready":
        toast.dismiss(toastId);
        setToastId(undefined);
        break;
    }
  }, [status]);

  useEffect(() => {
    if (messageContentRef.current && bottomRef.current) {
      messageContentRef.current.scrollTop =
        messageContentRef.current.scrollHeight;
    }
  }, [messages]);

  const form = useForm<TAIAgentFormSchema>({
    values: {
      value: "",
    },
    resolver: zodResolver(ZAIAgentFormSchema),
  });

  const isSybmitting =
    status === "submitted" ||
    status === "streaming" ||
    form.formState.isSubmitting;

  const onFormSubmit = ({ value }: TAIAgentFormSchema) => {
    sendMessage(value);
    form.reset();
  };

  const isVideoAnalysisEnabled = true;
  const isScriptGenerationEnabled = true;
  const isTitleGenerationEnabled = true;
  const isImageGenerationEnabled = true;

  const generateScript = () => {};
  const generateTitle = () => {};
  const generateImage = () => {};

  return (
    <div className="flex flex-col h-full">
      <div className="hidden lg:block px-4 pb-3 border-b border-blue-600">
        <h2 className="text-lg font-semibold text-white"> AI Agent</h2>
      </div>

      {/** messages */}
      <div className="fle-1 overflow-y-auto p-4" ref={messageContentRef}>
        <div className="space-y-6">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full min-h-[200px] flex-col gap-y-4">
              <h3 className="text-lg font-medium text-gray-400">
                Welcome to AI Agent Chat
              </h3>
              <p className="text-sm text-gray-500">
                {" "}
                Ask any question about your video!
              </p>
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] ${
                  message.role === "user"
                    ? "bg-blue-400 text-white"
                    : "bg-[#3e3e68] text-gray-400"
                } rounded-2xl px-4 py-3`}
              >
                {message.role === "assistant" ? (
                  <div className="space-y-3">
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  message.content
                )}
                <ReactMarkdown>{message.content}</ReactMarkdown>

                {/* {message && message.role == "assistant" ? (
                  // Assistant Message
                  <div className="space-y-3">
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown>
                        {message.parts
                          .map((part, index) =>
                            part.type === "text" ? (
                              part.text
                            ) : part.type.includes("tool-") ? (
                              <div
                                key={index}
                                className="bg-white/50 rounded-lg p-2 space-y-2 text-white"
                              >
                                <div className="font-medium text-xs">
                                  {formatToolInvocation(
                                    part as DynamicToolUIPart
                                  )}
                                </div>
                                {(part as DynamicToolUIPart).output ? (
                                  <pre className="text-xs bg-white/75 p-2 rounded overflow-auto max-h-40">
                                    {JSON.stringify(
                                      (part as DynamicToolUIPart).output,
                                      null,
                                      2
                                    )}
                                  </pre>
                                ) : null}
                              </div>
                            ) : null
                          )
                          .join("")}
                      </ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  //User Message
                  <ReactMarkdown>
                    {message.parts
                      .map((part, index) =>
                        part.type === "text" ? part.text : null
                      )
                      .join(" ")}
                  </ReactMarkdown>
                )} */}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/** Input Form */}
      <div className="border-t border-blue-400">
        <div className="space-y-3">
          <Form {...form}>
            <form
              className="flex gap-2"
              onSubmit={form.handleSubmit(onFormSubmit)}
            >
              <fieldset disabled={isSybmitting} className="flex-1">
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex-1 ">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={
                              isVideoAnalysisEnabled
                                ? `Enter a question...`
                                : "Upgrade to ask anything about your video..."
                            }
                            className="py-2 px-4 rounded-full border-none 
                        ring-1
                        ring-blue-300 
                         focus-visible:ring-blue-600  text-blue-300 placeholder:text-gray-200text-sm "
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </fieldset>
              <Button
                className="px-4 py-2 bg-transparent shadow-[0_0_8px_4px_rgba(37,99,235,0.5)] hover:shadow-[0_0_12px_8px_rgba(37,99,235,0.5)] transition-colors duration-300  rounded-xl text-blue-500 hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  status === "streaming" ||
                  status === "submitted" ||
                  !isVideoAnalysisEnabled
                }
              >
                {" "}
                {status === "streaming"
                  ? "AI is replying..."
                  : status === "submitted"
                  ? "AI is thinking..."
                  : "Send"}
              </Button>
            </form>
          </Form>

          <div className="flex gap-2">
            <button
              className="text-xs xl:text-sm flex items-center justify-center gap-2 bg-transparent shadow-[0_0_8px_4px_rgba(37,99,235,0.5)] hover:shadow-[0_0_12px_8px_rgba(37,99,235,0.5)] transition-colors duration-300 text-blue-500 hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={generateScript}
              disabled={!isScriptGenerationEnabled}
            >
              <LetterText className="w-4 h-4" />
              {isScriptGenerationEnabled ? (
                <span> Generate Script</span>
              ) : (
                <span> Upgrade to generate a script</span>
              )}
            </button>
            <button
              className="text-xs xl:text-sm flex items-center justify-center gap-2 bg-transparent shadow-[0_0_8px_4px_rgba(37,99,235,0.5)] hover:shadow-[0_0_12px_8px_rgba(37,99,235,0.5)] transition-colors duration-300  text-blue-500 hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={generateTitle}
              disabled={!isTitleGenerationEnabled}
            >
              <PenIcon className="w-4 h-4" />
              {isTitleGenerationEnabled ? (
                <span> Generate Title</span>
              ) : (
                <span> Upgrade to generate a title</span>
              )}
            </button>
            <button
              className="text-xs xl:text-sm flex items-center justify-center gap-2 bg-transparent shadow-[0_0_8px_4px_rgba(37,99,235,0.5)] hover:shadow-[0_0_12px_8px_rgba(37,99,235,0.5)] transition-colors duration-300  text-blue-500 hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={generateImage}
              disabled={!isImageGenerationEnabled}
            >
              <ImageIcon className="w-4 h-4" />
              {isImageGenerationEnabled ? (
                <span> Generate Image</span>
              ) : (
                <span> Upgrade to generate an image</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
