'use server';
import { profileSchema } from "@/lib/validations/profile";
import { createSupabaseServerClient } from "@/utils/supabase/server-client";
import { redirect } from "next/navigation";
import { ProfileFormState, Skill } from "@/lib/types";
import { formatZodErrors } from "@/utils/format-zod-error";


function extractNestedArray(formData: FormData, keyPrefix: string) {
  const entries = Array.from(formData.entries()).filter(([key]) =>
    key.startsWith(`${keyPrefix}[`)
  );

  const grouped: Record<number, Record<string, string>> = {};
  entries.forEach(([fullKey, value]) => {
    const match = fullKey.match(/\[(\d+)\]\.(\w+)/);
    if (!match) return;
    const [_, index, field] = match;
    const idx = parseInt(index, 10);
    if (!grouped[idx]) grouped[idx] = {};
    grouped[idx][field] = value.toString();
  });

  return Object.values(grouped);
}

export async function submitProfile(
  prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const raw = Object.fromEntries(formData.entries());
  const experience = extractNestedArray(formData, 'experience');
  const education = extractNestedArray(formData, 'education');
  const skills = formData.getAll('skills');

  // 1) Zod validation
  const parsed = profileSchema.safeParse({
    ...raw,
    skills,
    experience,
    education,
  });
  if (!parsed.success) {
    const zodErrors = formatZodErrors(parsed.error);
    const parsedSkills: Skill[] = skills && typeof skills[0] === 'string' ? JSON.parse(skills[0]) : [];
    console.log(raw,'Parsed Skills');
    return {
      errors: zodErrors,
      values: { ...raw, experience, education, skills: parsedSkills},
    };
  }

  

  const supabase = await createSupabaseServerClient();

  
  const { data: record, error: authErr } = await supabase.auth.getUser();
  if (authErr || !record.user) {
    const msg = encodeURIComponent('Session expired, please sign in again');
    redirect(`/login?flash=${msg}`);
  }

  
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", record.user.id)
    .single();

  const parsedSkills: Skill[] = typeof skills[0] === 'string'
  ? JSON.parse(skills[0])
  : skills;

  const payload = {
    id: record.user.id,
    first_name: raw.first_name,
    last_name: raw.last_name,
    username: raw.username,
    pincode: raw.pincode,
    country: raw.country,
    status: raw.status,
    bio: raw.bio,
    personal_profiles: {
      linkedin: raw.linkedin,
      github: raw.github,
      website: raw.website,
    },
    experience: experience,
    education: education,
  };


  

  let profileError = null;

  if (existingProfile) {
    const { error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("id", record.user.id);
    profileError = error;
  } else {
    const { error } = await supabase.from("profiles").insert(payload);
    profileError = error;
  }
  

  const skillLinks = parsedSkills.map((skillId) => ({
    profile_id: record.user.id,
    skill_id: skillId?.id,
  }));

  

  const { error: skillUpsertError } = await supabase
    .from('profile_skills')
    .upsert(skillLinks, { onConflict: 'profile_id, skill_id' });

    
    
  const { data: existingSkills } = await supabase
    .from("profile_skills")
    .select("skill_id")
    .eq("profile_id", record.user.id);
    



  
  const submittedSkillIds = parsedSkills.map((skill) => skill.id);
  const existingSkillIds = existingSkills?.map((item) => item.skill_id) || [];

  // Find deleted skills by using a set operation (difference between existing and submitted)
  const deletedSkills = Array.from(existingSkillIds).filter(
    (skillId) => !submittedSkillIds.includes(skillId)
  );

  if (deletedSkills.length > 0) {
    const { error: deleteError } = await supabase
      .from("profile_skills")
      .delete()
      .in("skill_id", deletedSkills)
      .eq("profile_id", record.user.id);

    if (deleteError) {
      return {
        errors: { form: ["Error deleting removed skills."] },
        values: { ...raw, experience, education, parsedSkills },
      };
    }
  }
  

  if (profileError || skillUpsertError) {
    const message = profileError?.message ?? skillUpsertError?.message ?? "Unknown error";
    return {
      errors: { form: [message] },
      values: { ...raw, experience, education, parsedSkills },
    };
  }

  redirect("/profile");
}


export async function checkUsernameAvailability(username: string): Promise<boolean > {
  const supabase = await createSupabaseServerClient();
  const {data: {user}} = await supabase.auth.getUser();
  const { data } = await supabase.from('profiles').select('id').neq('id', user?.id).eq('username',username).single();
  if (data && Object.keys(data).length > 0) {
    return false;
  }
   return true;
}
