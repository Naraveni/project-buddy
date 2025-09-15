'use server';
import { createSupabaseServerClient } from '@/utils/supabase/server-client';
import { redirect } from 'next/navigation';
import { Project } from '@/lib/types';
import { getSignedImageUrl } from '@/lib/storage';
import { PROJECT_STATUS } from '@/utils/constants';

export async function getProjects(
  page: number = 1,
  perPage: number = 10,
  name?: string,
  community: boolean = false
): Promise<{ projects: Project[]; errors?: Record<string, string[]>; count: number }> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const msg = encodeURIComponent('Session expired, please sign in again');
    redirect(`/login?flash=${msg}`);
  }

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from('projects')
    .select(
      `id, slug, name, description, image_url, github_url, website_url, status, skills(id, name)`,
      { count: 'exact' }
    )
    .eq('user_id', user.id)

  if(community){
    query = query.eq('status',PROJECT_STATUS['PUBLISHED'])
  }
  else{
    query = query.eq('user_id', user?.id)
  }
  query = query.order('created_at', { ascending: false })
    .range(from, to);

  if (name) {
    query = query.ilike('name', `%${name}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    return { projects: [], errors: { supabase: [error.message] }, count: 0 };
  }

  const enrichedProjects = await Promise.all(
    (data ?? []).map(async (project) => {
      const display_image_url = project.image_url
        ? await getSignedImageUrl(project.image_url)
        : null;

      return { ...project, display_image_url };
    })
  );

  return { projects: (enrichedProjects as Project[]) ?? [], count: count ?? 0 };
}
