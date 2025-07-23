'use server';

import { projectSchema } from "@/lib/validations/project";
import { createSupabaseServerClient } from "@/utils/supabase/server-client";
import { redirect } from "next/navigation";
import { formatZodErrors } from "@/utils/format-zod-error";
import { ProjectFormState } from "@/lib/types";

export async function submitProject(
  prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const raw = Object.fromEntries(formData.entries());
  const projectId = raw.id;

  
  let parsedSkills: { id: string; name: string }[] = [];
  try {
    parsedSkills = JSON.parse(formData.get("skills") as string);
  } catch (_e) {
    return {
      errors: { skills: ["Invalid skills format"] },
      values: { ...raw, skills: [] },
    };
  }

  const parsed = projectSchema.safeParse({
    ...raw,
    skills: parsedSkills,
  });

  if (!parsed.success) {
    const zodErrors = formatZodErrors(parsed.error);
    return {
      errors: zodErrors,
      values: { ...raw, skills: parsedSkills },
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data: record, error: authErr } = await supabase.auth.getUser();

  if (authErr || !record.user) {
    const msg = encodeURIComponent("Session expired, please sign in again");
    redirect(`/login?flash=${msg}`);
  }

  const payload = {
    name: raw.name,
    slug: raw.slug,
    description: raw.description,
    image_url: raw.image_url,
    github_url: raw.github_url,
    website_url: raw.website_url,
    status: raw.status,
    is_public: raw.is_public === "true",
    category: raw.category,
    user_id: record.user.id,
  };

  let projectIdToUse = projectId;
  if (projectId) {
    
    const { error: updateError } = await supabase
      .from("projects")
      .update(payload)
      .eq("id", projectId)
      .eq("user_id", record.user.id);

    if (updateError) {
      return {
        errors: { form: [updateError.message] },
        values: { ...raw, skills: parsedSkills },
      };
    }
  } else {

  const { data: insertedProject, error: insertError } = await supabase
    .from("projects")
    .insert(payload)
    .select("id")
    .single();

  if (insertError || !insertedProject) {
    return {
      errors: { form: [insertError?.message || "Project insert failed"] },
      values: { ...raw, skills: parsedSkills },
    };
  }
    projectIdToUse = insertedProject.id;
}

  

  const skillLinks = parsedSkills.map((s) => ({
    project_id: projectIdToUse,
    skill_id: s.id,
  }));

  const { error: skillUpsertError } = await supabase
    .from("project_skills")
    .upsert(skillLinks, {
    onConflict: "project_id, skill_id",
    ignoreDuplicates: true
  });

  if (skillUpsertError) {
    return {
      errors: { form: [skillUpsertError.message] },
      values: { ...raw, skills: parsedSkills },
    };
  }

  redirect("/projects/me");
}
