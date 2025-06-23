'use server'
import { profileSchema } from "@/lib/validations/profile";
import { createSupabaseServerClient } from "@/utils/supabase/server-client";
import { redirect } from "next/navigation";
import { ProfileFormState } from "@/lib/types";
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
    return {
      errors: zodErrors,
      values: { ...raw, experience, education, skills },
    };
  }

  const supabase = await createSupabaseServerClient();

  // 2) Auth check
  const { data: record, error: authErr } = await supabase.auth.getUser();
  if (authErr || !record.user) {
    const msg = encodeURIComponent('Session expired, please sign in again');
    redirect(`/login?flash=${msg}`);
  }

  // 3) Check if profile exists
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", record.user.id)
    .single();

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

  

  
  const skillLinks = skills.map((skillId) => ({
    profile_id: record.user.id,
    skill_id: skillId,
  }));

  const { error: skillUpsertError } = await supabase
    .from('profile_skills')
    .upsert(skillLinks, { onConflict: 'profile_id, skill_id' });

  

  if (profileError || skillUpsertError) {
    const message = profileError?.message ?? skillUpsertError?.message ?? "Unknown error";
    return {
      errors: { form: [message] },
      values: { ...raw, experience, education, skills },
    };
  }

  redirect("/dashboard");
}
