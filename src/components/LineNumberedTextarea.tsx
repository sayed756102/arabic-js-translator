import React, { forwardRef, useCallback, useMemo, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface LineNumberedTextareaProps {
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  dir?: "rtl" | "ltr";
  readOnly?: boolean;
  style?: React.CSSProperties;
  overlayContent?: string;
  onOverlayClick?: (e: React.MouseEvent) => void;
  overlayRef?: React.RefObject<HTMLDivElement>;
}

const LineNumberedTextarea = forwardRef<
  HTMLTextAreaElement,
  LineNumberedTextareaProps
>(
  (
    {
      value,
      onChange,
      placeholder,
      className,
      dir = "ltr",
      readOnly = false,
      style,
      overlayContent,
      onOverlayClick,
      overlayRef,
      ...props
    },
    ref,
  ) => {
    
    const lineCount = useMemo(() => {
      return Math.max(1, value.split('\n').length);
    }, [value]);

    // Auto-scroll to cursor position when typing
    useEffect(() => {
      if (!ref || typeof ref === 'function') return;
      
      const textarea = ref.current;
      if (!textarea) return;

      const handleScroll = () => {
        const { selectionStart, scrollLeft, clientWidth } = textarea;
        const text = textarea.value.substring(0, selectionStart);
        const lastLineBreak = text.lastIndexOf('\n');
        const currentLine = text.substring(lastLineBreak + 1);
        
        // Approximate cursor position (works for monospace fonts)
        const charWidth = 8.4; // Approximate width of a character in mono font
        const cursorPosition = currentLine.length * charWidth;
        
        // Scroll if cursor is near the edges
        if (cursorPosition > scrollLeft + clientWidth - 50) {
          textarea.scrollLeft = cursorPosition - clientWidth + 100;
        } else if (cursorPosition < scrollLeft + 50) {
          textarea.scrollLeft = Math.max(0, cursorPosition - 100);
        }
      };

      textarea.addEventListener('input', handleScroll);
      textarea.addEventListener('click', handleScroll);
      textarea.addEventListener('keyup', handleScroll);

      return () => {
        textarea.removeEventListener('input', handleScroll);
        textarea.removeEventListener('click', handleScroll);
        textarea.removeEventListener('keyup', handleScroll);
      };
    }, [ref]);

    const lineNumbers = useMemo(() => {
      return Array.from({ length: lineCount }, (_, i) => i + 1);
    }, [lineCount]);

    const isRtl = dir === "rtl";

    return (
      <div className="relative flex border rounded-md overflow-hidden bg-background">
        {/* Line numbers */}
        <div
          className={cn(
            "flex flex-col bg-muted/30 border-r text-xs text-muted-foreground font-mono select-none",
            isRtl && "border-l border-r-0 order-2",
          )}
        >
          {lineNumbers.map((num) => (
            <div
              key={num}
              className="h-6 flex items-center justify-center px-2 min-w-[3rem]"
              style={{ lineHeight: "1.5rem" }}
            >
              {num}
            </div>
          ))}
        </div>

        {/* Text area container */}
        <div className={cn("flex-1 relative overflow-x-auto", isRtl && "order-1")}>
          {/* Overlay for highlighting errors (Arabic side only) */}
          {overlayContent && (
            <div
              ref={overlayRef}
              className="absolute inset-0 z-10 whitespace-pre font-mono text-sm leading-6 px-3 py-2 pointer-events-none overflow-x-auto"
              dir={dir}
              dangerouslySetInnerHTML={{ __html: overlayContent }}
              onClick={onOverlayClick}
            />
          )}
          
          <Textarea
            ref={ref}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={cn(
              "min-h-[500px] font-mono text-sm leading-6 border-0 resize-none focus:ring-0 focus:ring-offset-0 whitespace-pre overflow-x-auto",
              overlayContent &&
                "text-transparent caret-transparent bg-transparent",
              className,
            )}
            dir={dir}
            readOnly={readOnly}
            style={
              overlayContent
                ? { ...style, caretColor: "hsl(var(--foreground))" }
                : style
            }
            {...props}
          />
        </div>
      </div>
    );
  }
);

LineNumberedTextarea.displayName = "LineNumberedTextarea";

export default LineNumberedTextarea;