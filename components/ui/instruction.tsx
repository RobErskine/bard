"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface InstructionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
}

export function Instruction({ title, children, className, defaultOpen = false }: InstructionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const contentRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className={cn("w-full mt-0 relative -top-2", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn("flex w-full items-center justify-between bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted/80 focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-1",
					isOpen ? "rounded-b-none" : "rounded-b-lg"
				)}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <div
        ref={contentRef}
        className={cn(
          "overflow-hidden transition-all duration-200",
          isOpen ? "mt-0" : "mt-0"
        )}
        style={{
          height: isOpen ? contentRef.current?.scrollHeight : 0,
        }}
      >
        <div className="rounded-lg rounded-t-none bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
          {children}
        </div>
      </div>
    </div>
  );
}