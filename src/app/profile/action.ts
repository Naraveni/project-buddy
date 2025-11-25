'use server';

import { createSupabaseServerClient } from '@/utils/supabase/server-client';
import { redirect } from 'next/navigation';
import { getProjects } from '../projects/me/action';
import { Project } from '@/lib/types';

export async function getProfileData() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    redirect('/login?flash=Please%20log%20in%20to%20view%20your%20profile');
  }

  // Fetch user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // 👇 Return null early if no profile found
  if (!profile || profileError) {
    return { profile: null}
  }

  const ids = await supabase
    .from('profile_skills')
    .select('id:skill_id')
    .eq('profile_id', user.id);

  const skillIds = ids.data?.map((item) => item.id) || [];

  const { data } = await supabase.from('skills').select('id, name').in('id', skillIds);
  

  const projectsResult = await getProjects(1, 20, '');
  const projects = (projectsResult.projects ?? []) as Project[];
  return { profile, skills: data, error: null, projects };
}
