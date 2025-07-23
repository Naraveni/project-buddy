'use server';

import { createSupabaseServerClient } from '@/utils/supabase/server-client';
import { revalidatePath } from 'next/cache';

export async function sendMessage(formData: FormData) {
  try {
    

    const chat_id = formData.get('chat_id') as string;
    const text = formData.get('text') as string;

    if (!(chat_id &&  text?.trim())) {
      console.log('Missing chat_id or message');
      return { error: 'Chat ID and message text are required.' };
    }

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (!user || authError) {
      console.log('Authentication error', authError);
      return { error: 'User not authenticated.' };
    }

    console.log('Attempting to insert message:', {
      chat_id,
      sender_id: user.id,
      text,
    });

    const { error: insertError } = await supabase.from('messages').insert({
      chat_id,
      sender_id: user.id,
      text,
    });

    if (insertError) {
      console.error('Insert failed:', insertError.message, insertError.details, insertError.hint);
      return { error: 'Failed to send message.' };
    }

    console.log('Message inserted successfully');
    revalidatePath(`/chats/${chat_id}`);

    return { success: true };
  } catch (err) {
    console.error('Unexpected error in sendMessage:', err);
    return { error: 'Unexpected server error.' };
  }
}
