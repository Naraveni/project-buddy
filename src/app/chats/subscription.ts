// utils/supabase-subscriptions.ts
import { ChatMessage } from '@/lib/types';
import { createSupabaseBrowserClient } from '@/utils/supabase/browser-client';

export function subscribeToMessages(chatsIds: string[], chat_id: string, onNewMessage: (msg: ChatMessage) => void) {
  const supabase = createSupabaseBrowserClient();

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
        console.log('New message received:', payload);
        onNewMessage(payload?.new as ChatMessage);
      }
    )
    .subscribe();
}
