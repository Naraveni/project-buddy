// utils/supabase-subscriptions.ts
import { ChatMessage } from '@/lib/types';
import { createSupabaseBrowserClient } from '@/utils/supabase/browser-client';
import { RealtimeChannel } from '@supabase/supabase-js';

export async function subscribeToMessages(chatsIds: string[], chat_id: string, onNewMessage: (msg: ChatMessage) => void): Promise<RealtimeChannel> {
  const supabase = await createSupabaseBrowserClient();

  return supabase
    .channel(`chat:${chat_id}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      },
      (payload) => {
        onNewMessage(payload?.new as ChatMessage);
      }
    )
    .subscribe();
}
