
import { createSupabaseServerClient } from '@/utils/supabase/server-client';
import { redirect } from 'next/navigation';
import { Project } from '@/lib/types';

export async function getUserProjects(
  page: number = 1,
  perPage: number = 10
): Promise<{ projects: Project[]; errors?: Record<string, string[]>; count: number }> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const msg = encodeURIComponent(
      'Session expired, please sign in again'
    );
    redirect(`/login?flash=${msg}`);
  }

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const { data, error, count } = await supabase
    .from('projects')
    .select(
      `id,
       slug,
       name,
       description,
       image_url,
       github_url,
       website_url,
       status,
       skills(id, name)`,
      { count: 'exact' }
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(from, to);

console.log('Fetched projects:', data, 'Count:', count);

  if (error) {
    return { projects: [], errors: { supabase: [error.message] }, count: 0 };
  }

  return { projects: (data as Project[]) ?? [], count: count ?? 0 };
}
