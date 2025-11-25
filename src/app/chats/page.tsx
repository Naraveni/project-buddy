"use client";

import React, { useEffect, useState, useRef } from "react";
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import { RealtimeChannel } from "@supabase/supabase-js";
import {
  ExpandableChatHeader,
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
import { getChatMessages } from "./getChatMessages";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [ChatIds, setChatIDs] = useState<string[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [chatlistOpen, setChatListOpen] = useState(true);
  const [requestListOpen, setRequestListOpen] = useState(false);
  const currentChatRef = useRef<string>(currentChat?.id || "");
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef(0);

  
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  
  const loadMessages = async (chatId: string, pageNum: number) => {
    const scrollContainer = scrollRef.current;
    prevScrollHeightRef.current = scrollContainer?.scrollHeight ?? 0;
    if (loadingMore) return;
    setLoadingMore(true);

    

    const newMsgs = await getChatMessages(chatId, 25, pageNum * 25);
    console.log("Fetched messages:", newMsgs);
    if (newMsgs.length === 0) {
      setHasMore(false);
      setLoadingMore(false);
      return;
    }

    if (pageNum === 0) {
      setMessages(newMsgs);
      setPage(pageNum);
    } else {
      
      setMessages((prev) => [...prev,...newMsgs, ]);
      setPage(pageNum);
    }

    setLoadingMore(false);
  };



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
    currentChatRef.current = currentChat?.id || "";
  }, [currentChat]);

  // Fetch chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const chats = await getUserChats();
        setChats(chats);
        setChatIDs(chats.map((chat) => chat.id));

        if (chats.length > 0) {
          const searchParams = new URLSearchParams(window.location.search);
          const idFromUrl = searchParams.get("chat_id");
          if (idFromUrl) {
            const chat = chats.find((c) => c.id === idFromUrl);
            setCurrentChat(chat ?? chats[0]);
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

  // Reset messages + load first page on chat change
  useEffect(() => {
    if (currentChat) {
      setMessages([]);
      setPage(0);
      setHasMore(true);
      loadMessages(currentChat.id, 0).then(() => {
      });
    }
  }, [currentChat]);

  const updateLastSeenTime = async (chat_id: string) => {
    await updateLastSeen(chat_id);
  };

  useEffect(() => {
    if (!currentChatRef.current ||   ChatIds.length === 0) return;
    let sub: RealtimeChannel;

    subscribeToMessages(ChatIds,  currentChatRef.current, (msg) => {
      setChats((prevChats) => {
        const updatedChats = prevChats.map((chat) => {
          if (chat.id !== msg.chat_id) return chat;

          const updatedChat = { ...chat };
          updatedChat.messages = [msg,...(updatedChat.messages || [])];

          // store last_message
          updatedChat.last_message = msg;

          if (currentChatRef.current !== msg.chat_id) {
            updatedChat.unread_count = (updatedChat.unread_count || 0) + 1;
          }

          return updatedChat;
        });

        // move chat to top
        const index = updatedChats.findIndex((c) => c.id === msg.chat_id);
        if (index > -1) {
          const [chatToMove] = updatedChats.splice(index, 1);
          updatedChats.unshift(chatToMove);
        }

        return [...updatedChats];
      });

      // append to messages if current chat
      if (msg.chat_id === currentChatRef.current) {
        setMessages((prev) => [ msg, ...prev ]);
      }
    }).then((subscription) => (sub = subscription));

    return () => {
      sub?.unsubscribe();
    };
  }, [ChatIds]);

  // Scroll listener for loading older messages
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      console.log("scrollTop:", container.scrollTop);
      if (container.scrollTop === 0 && hasMore && currentChat) {
        loadMessages(currentChat.id, page + 1);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [hasMore, page, currentChat]);

  const requestsForMe = chats.filter((chat) => chat.user_owner_id === userId);
  const myRequests = chats.filter((chat) => chat.user_owner_id !== userId);

  const handleChatClick = async (chat: Chat) => {
    setCurrentChat(chat);
    await updateLastSeenTime(chat.id);
    setChats((prevChats) =>
      prevChats.map((c) =>
        c.id === chat.id ? { ...c, unread_count: 0 } : c
      )
    );
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] lg:grid-cols-[20%_1fr] pt-4 flex">
      {/* Sidebar */}
      <aside className="w-1/4 border-r flex flex-col px-3 py-2 bg-gray-100 shadow-sm">
        <h4 className="text-lg font-semibold mb-4 pb-2 border-gray-300">
          Conversations
        </h4>

        {loading ? (
          <div className="flex items-center justify-center h-full">
            <PulseLoader />
          </div>
        ) : (
          <div className="space-y-4 ">
            <Collapsible open={chatlistOpen} >
              <CollapsibleTrigger asChild>
                <Button
                  variant="default"
                  className="w-full justify-between text-left font-medium text-sm"
                  onClick={()=>setChatListOpen(prev=>!prev)}
                >
                  Requests for Your Postings <IoIosArrowDown />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 mt-2">
                {requestsForMe.length === 0 ? (
                  <p className="text-sm px-2 text-gray-500">No requests yet.</p>
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

                        {(chat.unread_count ?? 0) > 0 && (
                          <span className="ml-2 inline-block text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                            {chat.unread_count}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {chat.last_message?.text || "No messages yet"}
                      </p>
                    </div>
                  ))
                )}
              </CollapsibleContent>
            </Collapsible>

            {/* My requests */}
            <Collapsible open={requestListOpen}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="default"
                  className="w-full justify-between text-left font-medium text-sm"
                   onClick={()=>setRequestListOpen((prev)=>!prev)}
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
                        {(chat.unread_count ?? 0) > 0 && (
                          <span className="ml-2 inline-block text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                            {chat.unread_count}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {chat.last_message?.text || "No messages yet"}
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
          <h3 className="flex text-2xl font-semibold gap-2 items-baseline">
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
          <div className="flex-1 overflow-y-auto p-4"  ref={scrollRef}>
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <PulseLoader />
              </div>
            ) : currentChat ? (
              <ChatMessageList 
              onLoadMore={() => {
    if (hasMore && currentChat) loadMessages(currentChat.id, page + 1);
  }}>
                {messages.map((message) => (
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
                        {new Date(message?.created_at || "").toLocaleTimeString()}{" "}
                        ·{" "}
                        {message.sender_id === userId
                          ? "You"
                          : currentChat.user?.username || "Unknown"}
                      </p>
                    </div>
                  </div>
                ))}
                {loadingMore && (
                  <p className="text-xs text-gray-400 text-center py-2">
                    Loading older messages...
                  </p>
                )}
              </ChatMessageList>
            ) : (
              <p>No chats found.</p>
            )}
          </div>

          <ExpandableChatFooter className="border-t p-2">
            <ChatInput chat_id={currentChat?.id} disabled={!currentChat} />
          </ExpandableChatFooter>
        </div>
      </div>
    </div>
  );
}
