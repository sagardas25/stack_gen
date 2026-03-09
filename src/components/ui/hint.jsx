"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

export const Hint = ({ children, label, side = "top", align = "center" }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>

        <TooltipContent side={side} align={align}>
          {label}
        </TooltipContent>

      </Tooltip>
    </TooltipProvider>
  );
};