import React, { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAutoScroll } from "@/components/ui/chat/hooks/useAutoScroll";

interface ChatMessageListProps extends React.HTMLAttributes<HTMLDivElement> {
  smooth?: boolean;
  onLoadMore?: () => void; // callback to fetch more messages
}

const ChatMessageList = React.forwardRef<HTMLDivElement, ChatMessageListProps>(
  ({ className, children, smooth = false, onLoadMore, ...props }, _ref) => {
    const { scrollRef, isAtBottom, scrollToBottom, disableAutoScroll } =
      useAutoScroll({
        smooth,
        content: children,
      });
    const prevScrollHeightRef = useRef(0);
    
    useEffect(() => {
  const scrollContainer = scrollRef.current;
  if (!scrollContainer) return;
  console.log("Previous scroll height:", prevScrollHeightRef.current);
  console.log("Current scroll height:", scrollContainer.scrollHeight);
  console.log("added height:", scrollContainer.scrollHeight - prevScrollHeightRef.current);

  
  if (prevScrollHeightRef.current > 0) {
    const newScrollHeight = scrollContainer.scrollHeight;
    const addedHeight = newScrollHeight - prevScrollHeightRef.current;

    
    scrollContainer.scrollTop += addedHeight
  }

  // Update previous scroll height for next render
  prevScrollHeightRef.current = scrollContainer.scrollHeight;
}, [children]);

    const handleScroll = React.useCallback(() => {
      const el = scrollRef.current;
      console.log("Scroll event:", el?.scrollHeight);
      if (!el) return;

      if (el.scrollTop <= 0) {
        onLoadMore?.();
      }
    }, [scrollRef, onLoadMore]);

    return (
      <div className="relative w-full h-full">
        <div
          className={`flex flex-col w-full h-full p-4 overflow-y-auto ${className}`}
          ref={scrollRef}
          onScroll={handleScroll}
          onWheel={disableAutoScroll}
          onTouchMove={disableAutoScroll}
          {...props}
        >
          <div className="flex flex-col-reverse gap-6 mt-auto">{children}</div>
        </div>

        {!isAtBottom && (
          <Button
            onClick={() => {
              scrollToBottom();
            }}
            size="icon"
            variant="outline"
            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 inline-flex rounded-full shadow-md"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }
);

ChatMessageList.displayName = "ChatMessageList";

export { ChatMessageList };
