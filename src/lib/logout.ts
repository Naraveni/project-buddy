'use client';

import { createSupabaseBrowserClient } from '@/utils/supabase/browser-client';

export async function logout() {
  const supabaseClient = await createSupabaseBrowserClient();
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    console.error('Logout failed:', error.message);
  }

  // Redirect manually using window.location
  window.location.assign('/login');
}
