
'use server';

import { createSupabaseServerClient } from '@/utils/supabase/server-client';

export async function updateLastSeen(chatId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return;

  const { error } = await supabase
    .from('chat_participants')
    .upsert({
      chat_id: chatId,
      user_id: user.id,
      last_seen_at: new Date().toISOString(),
    });
    console.log(error)
}
