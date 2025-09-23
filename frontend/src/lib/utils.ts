import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { RequestInternal } from "next-auth";
import { z } from "zod";

const ZIpSchema = z.ipv4().optional() || z.ipv6().optional();
export const ZRequestMetadataSchema = z.object({
  ipAddress: ZIpSchema,
  userAgent: z.string(),
});
export type RequestMetadata = z.infer<typeof ZRequestMetadataSchema>;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const extractNextAuthRequestMetadata = (
  req: Pick<RequestInternal, "body" | "query" | "headers" | "method">
): RequestMetadata => {
  return extractNextHeaderRequestMetadata(req.headers ?? {});
};

export const extractNextHeaderRequestMetadata = (
  headers: Record<string, string>
): RequestMetadata => {
  const parsedIp = ZIpSchema.safeParse(headers?.["x-forwarded-for"]);

  const ipAddress = parsedIp.success ? parsedIp.data : undefined;
  const userAgent = headers?.["user-agent"];

  return {
    ipAddress,
    userAgent,
  };
};
