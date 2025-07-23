'use client';

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { sendMessage } from "@/app/chats/send-chat-action";

interface ChatInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  chat_id?: string;
  user_id?: string; // optional, if not taken from session inside action
}

const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
  (props, ref) => {
    const [text, setText] = React.useState('');
    const { className, chat_id, user_id } = props;
    const [error, setError] = React.useState<string | null>(null);
    const [isSending, setIsSending] = React.useState(false);

    const handleSend = async () => {
      if (!text.trim()) {
        setError("Message cannot be empty.");
        return;
      }

      if (!chat_id) {
        setError("Chat ID is missing.");
        return;
      }

      try {
        setIsSending(true);
        setError(null);
        const formData = new FormData();
        formData.append("chat_id", chat_id ?? "");
        if (user_id) formData.append("user_id", user_id);
        formData.append("text", text);
        await sendMessage(formData);
        setText('');
      } catch (err) {
        console.error("Send error:", err);
        setError("Failed to send message.");
      } finally {
        setIsSending(false);
      }
    };

    return (
      <div className="flex flex-col gap-2 w-full">
        <div className="flex gap-2 items-center">
          <Textarea
            autoComplete="off"
            ref={ref}
            name="message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-invalid={!!error}
            placeholder="Type your message..."
            className={cn(
              "max-h-32 px-4 py-3 bg-white text-sm placeholder:text-muted-foreground border border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-md resize-none shadow-sm",
              error && "border-red-500",
              className
            )}
            disabled={isSending}
            {...props}
          />
          <Button
            type="button"
            onClick={handleSend}
            disabled={isSending || !chat_id}
            className="h-fit mt-1 px-4 py-2"
          >
            {isSending ? "Sending..." : "Send"}
          </Button>
        </div>
        {error && (
          <p className="text-sm text-red-600 font-medium pl-1">{error}</p>
        )}
      </div>
    );
  }
);

ChatInput.displayName = "ChatInput";

export { ChatInput };
