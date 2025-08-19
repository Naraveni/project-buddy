"use client";

import React, { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import { RealtimeChannel } from "@supabase/supabase-js";
import {
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
} from "@/components/ui/chat/expandable-chat";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { Chat, ChatMessage } from "@/lib/types";
import { getUserChats } from "./action";
import { subscribeToMessages } from "./subscription";
import { updateLastSeen } from "./last-seen-action";
import { IoIosArrowDown } from "react-icons/io";
import { PulseLoader } from "react-spinners";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [ChatIds, setChatIDs] = useState<string[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = await createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const chats = await getUserChats();
        console.log("Fetched chats:", chats);
        setChats(chats);
        setChatIDs(chats.map((chat) => chat.id));
        if (chats.length > 0) {
          const searchParams = new URLSearchParams(window.location.search);
          const idFromUrl = searchParams.get("chat_id");
          if (idFromUrl) {
            const chat = chats.find((c) => c.id === idFromUrl);
            if (chat) {
              setCurrentChat(chat);
            } else {
              console.warn(`Chat with ID ${idFromUrl} not found.`);
              setCurrentChat(chats[0]);
            }
          } else {
            setCurrentChat(chats[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  const updateLastSeenTime = async (chat_id: string) => {
    await updateLastSeen(chat_id);
  };

  useEffect(() => {
    if (currentChat) {
      setMessages(currentChat.messages ?? []);
    }
  }, [currentChat]);

  useEffect(() => {
    if (!currentChat?.id || ChatIds.length === 0) return;
    let sub: RealtimeChannel;

    subscribeToMessages(ChatIds, currentChat.id, (msg) => {
      setChats((prevChats) => {
        const updatedChats = prevChats.map((chat) => {
          if (chat.id !== msg.chat_id) return chat;

          const updatedChat = { ...chat };
          updatedChat.messages = [...(updatedChat.messages || []), msg];

          if (currentChat.id !== msg.chat_id) {
            updatedChat.unread_count = (updatedChat.unread_count || 0) + 1;
          }

          return updatedChat;
        });

        const index = updatedChats.findIndex((c) => c.id === msg.chat_id);
        if (index > -1) {
          const [chatToMove] = updatedChats.splice(index, 1);
          updatedChats.unshift(chatToMove);
        }

        return [...updatedChats];
      });

      setMessages((prev) => [...prev, msg]);
    }).then((subscription) => sub = subscription);

    return () => {
      sub?.unsubscribe();
    };
  }, [currentChat, ChatIds]);

  const requestsForMe = chats.filter((chat) => chat.user_owner_id === userId);
  const myRequests = chats.filter((chat) => chat.user_owner_id !== userId);

  const handleChatClick = (chat: Chat) => {
    setCurrentChat(chat);
    updateLastSeenTime(chat.id);
    setChats((prevChats) =>
      prevChats.map((c) => (c.id === chat.id ? { ...c, unread_count: 0 } : c))
    );
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] lg:grid-cols-[20%_1fr] pt-4 flex">
      {/* Left Sidebar */}
      <aside className="w-1/4 border-r flex flex-col px-3 py-2 bg-gray-100 shadow-sm">
        <h4 className="text-lg font-semibold mb-4 pb-2  border-gray-300">
          Conversations
        </h4>

        {loading ? (
          <div className="flex items-center justify-center h-full">
            <PulseLoader />
          </div>
        ) : (
          <div className="space-y-4 overflow-y-auto">
            <Collapsible defaultOpen>
              <CollapsibleTrigger asChild>
                <Button
                  variant="default"
                  className="w-full justify-between text-left font-medium text-sm"
                >
                  Requests for Your Postings <IoIosArrowDown />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 mt-2">
                {requestsForMe.length === 0 ? (
                  <p className="text-sm px-2  text-gray-500">
                    No requests yet.
                  </p>
                ) : (
                  requestsForMe.map((chat) => (
                    <div
                      key={chat.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all bg-white ${
                        currentChat?.id === chat.id
                          ? " border-blue-300 shadow-md"
                          : " border-gray-200"
                      }`}
                      onClick={() => handleChatClick(chat)}
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-sm">
                          {chat.name}{" "}
                          <span className="text-xs font-light text-gray-500">
                            From {chat?.user?.username}
                          </span>
                        </p>

                        {typeof chat.unread_count === "number" &&
                          chat.unread_count > 0 && (
                            <span className="ml-2 inline-block text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                              {chat.unread_count}
                            </span>
                          )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {chat.messages?.[chat.messages.length - 1]?.text ||
                          "No messages yet"}
                      </p>
                    </div>
                  ))
                )}
              </CollapsibleContent>
            </Collapsible>

            {/* Your Requests to Others */}
            <Collapsible defaultOpen>
              <CollapsibleTrigger asChild>
                <Button
                  variant="default"
                  className="w-full justify-between text-left font-medium text-sm"
                >
                  Your Requests to Others <IoIosArrowDown />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 mt-2 pb-3">
                {myRequests.length === 0 ? (
                  <p className="text-sm text-gray-500">No chats yet.</p>
                ) : (
                  myRequests.map((chat) => (
                    <div
                      key={chat.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all bg-white ${
                        currentChat?.id === chat.id
                          ? " border-gray-400 shadow-md"
                          : " border-gray-200"
                      }`}
                      onClick={() => handleChatClick(chat)}
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-sm">
                          {chat.name}{" "}
                          <span className="text-xs font-light text-gray-400">
                            To {chat?.owner?.username}
                          </span>
                        </p>
                        {typeof chat.unread_count === "number" &&
                          chat.unread_count > 0 && (
                            <span className="ml-2 inline-block text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                              {chat.unread_count}
                            </span>
                          )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {chat.messages?.[chat.messages.length - 1]?.text ||
                          "No messages yet"}
                      </p>
                    </div>
                  ))
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}
      </aside>

      {/* Chat Window */}
      <div className="w-3/4 flex flex-col h-full">
        <ExpandableChatHeader>
          <h3 className=" flex text-2xl font-semibold gap-2 items-baseline">
            {currentChat ? currentChat.name : "Chat"}
            <p className="text-sm font-medium">
              From{" "}
              {currentChat?.chat_type === "incoming"
                ? currentChat.user?.username
                : currentChat?.owner?.username}
            </p>
          </h3>
        </ExpandableChatHeader>

        <div className="flex flex-col flex-1 overflow-hidden rounded-xl shadow bg-white">
          <ExpandableChatBody className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <PulseLoader />
              </div>
            ) : currentChat ? (
              <ChatMessageList>
                {[...messages].reverse().map((message) => (
                  <div
                    key={message.id}
                    className={`p-2 rounded-lg max-w-xs mb-2 ${
                      message.sender_id === userId
                        ? "bg-blue-100 self-end ml-auto"
                        : "bg-gray-100 self-start mr-auto"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <div>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(
                          message?.created_at || ""
                        ).toLocaleTimeString()}
                        .{" "}
                        {message.sender_id === userId
                          ? "You"
                          : message.user?.username || "Unknown User"}
                      </p>
                    </div>
                  </div>
                ))}
              </ChatMessageList>
            ) : (
              <p>No chats found.</p>
            )}
          </ExpandableChatBody>

          <ExpandableChatFooter className="border-t p-2">
            <ChatInput chat_id={currentChat?.id} disabled={!currentChat} />
          </ExpandableChatFooter>
        </div>
      </div>
    </div>
  );
}
