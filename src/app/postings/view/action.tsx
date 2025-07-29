'use server';

import { createSupabaseServerClient } from '@/utils/supabase/server-client';
import { redirect } from 'next/navigation';
import { Posting } from '@/lib/types';

interface FilterParams {
  project_id?: string;
  status?: string;
  mode_of_meeting?: string;
  start_date?: string;
  end_date?: string;
  view_mode?: string;
}

export async function getUserPostings(

  curPage: number = 1,
  perPage: number = 10,
  filters: FilterParams = {}
): Promise<{ postings: Posting[]; errors?: Record<string, string[]>; count: number }> {
  const supabase = await createSupabaseServerClient();
  console.log('Fetching user postings with filters:', filters);
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const msg = encodeURIComponent('Session expired, please sign in again');
    redirect(`/login?flash=${msg}`);
  }

  const from = (curPage - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase.from('postings').select(
    `id,
     project_id,
     user_id,
     role_name,
     description,
     start_date,
     end_date,
     hours_required,
     mode_of_meeting,
     status,
     application_deadline,
     skills(id, name)`,
    { count: 'exact' }
  );

  if (filters.view_mode === 'community_postings') {
    
    query = query
      .eq('status', 'open')
      .neq('user_id', user.id);
  } else {
    query = query.eq('user_id', user.id);
    

    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
  }

  if (filters.project_id && filters.project_id !== 'all') {
    query = query.eq('project_id', filters.project_id);
  }

  if (filters.mode_of_meeting && filters.mode_of_meeting !== 'all') {
    query = query.eq('mode_of_meeting', filters.mode_of_meeting);
  }

  if (filters.start_date) {
    query = query.gte('start_date', filters.start_date);
  }

  if (filters.end_date) {
    query = query.lte('end_date', filters.end_date);
  }

  query = query.order('created_at', { ascending: false }).range(from, to);

  const { data, error, count } = await query;

  if (error) {
    return { postings: [], errors: { supabase: [error.message] }, count: 0 };
  }

  return {
    postings: (data as Posting[]) ?? [],
    count: count ?? 0,
  };
}
