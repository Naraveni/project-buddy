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

  // Fetch user skills
  const { data } = await supabase
    .from('profile_skills')
    .select('skill_id, skills(name)')
    .eq('profile_id', user.id);

  type SkillRow = {
    skill_id: string;
    skills: { name: string } | null;
  };

  const skills = (data ?? []) as SkillRow[];

  const skillObjects = skills
    .filter((s) => s.skills !== null)
    .map((s) => ({
      id: s.skill_id,
      name: s.skills!.name,
    }));

  // Fetch user projects
  const projectsResult = await getProjects(1, 20, '');
  const projects = (projectsResult.projects ?? []) as Project[];

  return { profile, skills: skillObjects, error: null, projects };
}
