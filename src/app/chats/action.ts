'use server';

import { createSupabaseServerClient } from '@/utils/supabase/server-client';
import { redirect } from 'next/navigation';
import { Chat, ChatMessage } from '@/lib/types';

export async function getUserChats(): Promise<(Chat & { unread_count: number; last_message: ChatMessage | null })[]> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const msg = encodeURIComponent('Session expired, please sign in again');
    redirect(`/login?flash=${msg}`);
  }

  
  const { data: chats, error: chatError } = await supabase
    .from('chats')
    .select('*, user:user_id(username), owner:user_owner_id(username)')
    .or(`user_id.eq.${user.id},user_owner_id.eq.${user.id}`)
    .order('created_at', { ascending: false });

  if (chatError || !chats) {
    console.error('Error fetching chats:', chatError?.message);
    return [];
  }

  const chatIds = chats.map((chat) => chat.id);

  
  const { data: lastMessagesRaw, error: msgError } = await supabase
    .from('messages')
    .select('id, text, sender_id, chat_id, created_at')
    .in('chat_id', chatIds)
    .order('created_at', { ascending: false });

  if (msgError) {
    console.warn('Failed to fetch last messages:', msgError.message);
  }

  
  const lastMessageMap = new Map<string, ChatMessage>();
  for (const msg of lastMessagesRaw ?? []) {
    if (!lastMessageMap.has(msg.chat_id)) {
      lastMessageMap.set(msg.chat_id, msg);
    }
  }

  
  const { data: participants, error: lastSeenErr } = await supabase
    .from('chat_participants')
    .select('chat_id, last_seen_at')
    .eq('user_id', user.id);

  if (lastSeenErr) {
    console.warn('Error fetching last_seen_at data:', lastSeenErr.message);
  }

  const lastSeenMap = new Map(
    (participants ?? []).map((p) => [p.chat_id, new Date(p.last_seen_at)])
  );

  
  const unreadCountMap = new Map<string, number>();
  for (const chatId of chatIds) {
    const lastSeen = lastSeenMap.get(chatId);
    const lastMsg = lastMessagesRaw?.find((m) => m.chat_id === chatId);
    let unread = 0;

    if (lastMsg && lastMsg.sender_id !== user.id) {
      if (!lastSeen || new Date(lastMsg.created_at) > lastSeen) {
        unread = 1;
      }
    }

    unreadCountMap.set(chatId, unread);
  }

  
  const enrichedChats: (Chat & {
    unread_count: number;
    last_message: ChatMessage | null;
  })[] = chats.map((chat) => ({
    ...chat,
    chat_type: chat.user_owner_id === user.id ? 'incoming' : 'outgoing',
    last_message: lastMessageMap.get(chat.id) ?? null,
    unread_count: unreadCountMap.get(chat.id) ?? 0,
  }));

  return enrichedChats;
}
