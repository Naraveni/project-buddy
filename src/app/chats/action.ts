'use server';

import { createSupabaseServerClient } from '@/utils/supabase/server-client';
import { redirect } from 'next/navigation';
import { Chat, ChatMessage } from '@/lib/types';

export async function getUserChats(): Promise<(Chat & { unread_count: number })[]> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const msg = encodeURIComponent('Session expired, please sign in again');
    redirect(`/login?flash=${msg}`);
  }

  // Fetch chats where user is either participant or owner
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

  const { data: allMessagesRaw, error: msgError } = await supabase
    .from('messages')
    .select('id, text, sender_id, chat_id, created_at ')
    .in('chat_id', chatIds)
    .order('created_at', { ascending: false }).limit(25);
  
  const allMessages: ChatMessage[] = (allMessagesRaw ?? []).map((msg) => ({
    ...msg,
  })).reverse();

  

  if (msgError) {
    console.warn('Failed to fetch messages:', msgError.message);
  }

  
  const groupedMessages: Record<string, ChatMessage[]> = {};
  for (const msg of allMessages ?? []) {
    if (!msg.chat_id) {
      continue;
    }
    if (!groupedMessages[msg.chat_id]) {
      groupedMessages[msg.chat_id] = [];
    }
    groupedMessages[msg.chat_id].push(msg);
  }
  for (const chatId in groupedMessages) {
    groupedMessages[chatId] = groupedMessages[chatId]
  }

  // Fetch last_seen_at info for user
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

  for (const chat of chats) {
    const lastSeen = lastSeenMap.get(chat.id);
    const msgs = groupedMessages[chat.id] ?? [];
    const unread = msgs.filter(
      (m) =>
        m.sender_id !== user.id &&
        (!lastSeen || new Date(m?.created_at || '') > lastSeen)
    ).length;
    unreadCountMap.set(chat.id, unread);
  }

  // Merge messages, unread_count, and metadata into chat objects
  const enrichedChats: (Chat & { unread_count: number })[] = chats.map((chat) => ({
    ...chat,
    chat_type: chat.user_owner_id === user.id ? 'incoming' : 'outgoing',
    messages: groupedMessages[chat.id] ?? [],
    unread_count: unreadCountMap.get(chat.id) ?? 0,
  }));

  return enrichedChats;
}
