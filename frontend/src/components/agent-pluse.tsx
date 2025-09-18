import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const agentPulseVariants = cva("rounded-full animate-pulse", {
  variants: {
    size: {
      sm: "w-4 h-4",
      md: "w-12 h-12",
      lg: "w-16 h-16",
    },
    defaultVariants: {
      size: "md",
    },
  },
});

function AgentPluse({
  className,
  size,
}: { className?: string } & VariantProps<typeof agentPulseVariants>) {
  return (
    <div
      className={cn(
        "bg-gradient-to-t from-blue-600 to-blue-400 shadow-[0_0_8px_4px_rgba(37,99,235,0.5)]",
        className,
        agentPulseVariants({ size: size })
      )}
    ></div>
  );
}

export default AgentPluse;
