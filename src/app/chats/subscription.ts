// utils/supabase-subscriptions.ts
import { createSupabaseBrowserClient } from '@/utils/supabase/browser-client';

export function subscribeToMessages(chat_id: string, onNewMessage: (msg: string) => void) {
  const supabase = createSupabaseBrowserClient();

  return supabase
    .channel(`chat:${chat_id}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${chat_id}`,
      },
      (payload) => {
        onNewMessage(payload?.new);
      }
    )
    .subscribe();
}
