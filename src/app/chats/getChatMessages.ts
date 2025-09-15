'use server';

import { createSupabaseServerClient } from '@/utils/supabase/server-client';
import { ChatMessage } from '@/lib/types';

export async function getChatMessages(chatId: string, limit = 25, offset = 0): Promise<ChatMessage[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('messages')
    .select('id, text, sender_id, chat_id, created_at')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching messages:", error.message);
    return [];
  }

  return (data ?? [])
}
