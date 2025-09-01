import React, { forwardRef, useCallback, useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface LineNumberedTextareaProps {
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  dir?: 'rtl' | 'ltr';
  readOnly?: boolean;
  style?: React.CSSProperties;
  overlayContent?: string;
  onOverlayClick?: (e: React.MouseEvent) => void;
  overlayRef?: React.RefObject<HTMLDivElement>;
}

const LineNumberedTextarea = forwardRef<HTMLTextAreaElement, LineNumberedTextareaProps>(
  ({ 
    value, 
    onChange, 
    placeholder, 
    className, 
    dir = 'ltr', 
    readOnly = false,
    style,
    overlayContent,
    onOverlayClick,
    overlayRef,
    ...props 
  }, ref) => {
    
    const lineCount = useMemo(() => {
      return Math.max(1, value.split('\n').length);
    }, [value]);

    const lineNumbers = useMemo(() => {
      return Array.from({ length: lineCount }, (_, i) => i + 1);
    }, [lineCount]);

    const isRtl = dir === 'rtl';

    return (
      <div className="relative flex border rounded-md overflow-hidden bg-background">
        {/* Line numbers */}
        <div className={cn(
          "flex flex-col bg-muted/30 border-r text-xs text-muted-foreground font-mono select-none",
          isRtl && "border-l border-r-0 order-2"
        )}>
          {lineNumbers.map((num) => (
            <div
              key={num}
              className="h-6 flex items-center justify-center px-2 min-w-[3rem]"
              style={{ lineHeight: '1.5rem' }}
            >
              {num}
            </div>
          ))}
        </div>

        {/* Text area container */}
        <div className={cn("flex-1 relative", isRtl && "order-1")}>
          {/* Overlay for highlighting errors (Arabic side only) */}
          {overlayContent && (
            <div
              ref={overlayRef}
              className="absolute inset-0 z-10 whitespace-pre-wrap font-mono text-sm leading-6 px-3 py-2 pointer-events-none"
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
              "min-h-[400px] font-mono text-sm leading-6 border-0 resize-none focus:ring-0 focus:ring-offset-0",
              overlayContent && "text-transparent caret-transparent bg-transparent",
              className
            )}
            dir={dir}
            readOnly={readOnly}
            style={overlayContent ? { ...style, caretColor: 'hsl(var(--foreground))' } : style}
            {...props}
          />
        </div>
      </div>
    );
  }
);

LineNumberedTextarea.displayName = 'LineNumberedTextarea';

export default LineNumberedTextarea;