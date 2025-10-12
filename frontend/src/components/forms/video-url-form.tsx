"use client";

import { useRouter } from "next/navigation";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { createVideo } from "@/lib/api/video/fetchers";
import { toast } from "sonner";

const ZVideoUrlFormSchema = z.object({
  url: z.string().url().min(2).max(1000),
});

type TVideoUrlFormSchema = z.infer<typeof ZVideoUrlFormSchema>;

export const VideoUrlForm = () => {
  const form = useForm<TVideoUrlFormSchema>({
    resolver: zodResolver(ZVideoUrlFormSchema),
    values: {
      url: "",
    },
  });

  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationKey: ["videos", "create"],
    mutationFn: createVideo,
    onSuccess: (data, variables, onMutateResult, context) => {
      console.log("📹 Created video data:", data);
      router.push(
        `/videos/${data.provider_video_id}/analysis?taskId=${data.task_id}&isNew=${data.is_new}`
      );
    },
    onError: (error, variables, onMutateResult, context) => {
      console.log("⚠️ Error analyzing video:", error);
      toast.error("An error ocurred", {
        position: "bottom-right",
        description:
          "Something went wrong while trying to analyze your video, please try again later.",
        duration: 5000,
      });
    },
  });

  const onFormSubmit = ({ url }: TVideoUrlFormSchema) => {
    mutate({ url });
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <Form {...form}>
        <form
          className=" flex flex-col md:flex-row items-center  justify-center gap-y-5 md:gap-x-5 md:items-start"
          onSubmit={form.handleSubmit(onFormSubmit)}
        >
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => {
              return (
                <FormItem className="flex-1 ">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter YouTube video URL"
                      className="border-none 
                        ring-1
                        ring-blue-300 
                         focus-visible:ring-blue-600  text-blue-300 placeholder:text-gray-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <Button
            className="py-2  bg-transparent shadow-[0_0_8px_4px_rgba(37,99,235,0.5)] hover:shadow-[0_0_12px_8px_rgba(37,99,235,0.5)] transition-shadow duration-300 hover:bg-transparent rounded-xl text-blue-500 hover:text-blue-300 "
            disabled={isPending}
            loading={isPending}
          >
            {isPending ? "Analyzing..." : "Analyze"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default VideoUrlForm;
