'use server';

import { createSupabaseServerClient } from '@/utils/supabase/server-client';
import { redirect } from 'next/navigation';
import { postingSchema } from '@/lib/validations/posting';
import { formatZodErrors } from '@/utils/format-zod-error';
import { PostingFormState } from '@/lib/types';

export async function submitPosting(
  prevState: PostingFormState,
  formData: FormData
): Promise<PostingFormState> {
  const raw = Object.fromEntries(formData.entries());
  const postingId = raw.id;
  console.log(raw);

  let parsedSkills: { id: string; name: string }[] = [];
  try {
    parsedSkills = JSON.parse(formData.get('skills') as string);
  } catch {
    return {
      errors: { skills: ['Invalid skills format'] },
      values: { ...raw, skills: [] },
    };
  }

  const parsed = postingSchema.safeParse({ ...raw, skills: parsedSkills });

  if (!parsed.success) {
    return {
      errors: formatZodErrors(parsed.error),
      values: { ...raw, skills: parsedSkills },
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) {
    redirect('/login?flash=' + encodeURIComponent('Session expired'));
  }

  const payload = {
    project_id: raw.project_id,
    role_name: raw.role_name,
    description: raw.description,
    start_date: raw.start_date,
    end_date: raw.end_date,
    hours_required: Number(raw.hours_required),
    mode_of_meeting: raw.mode_of_meeting,
    status: raw.status,
    application_deadline: raw.application_deadline || null,
    user_id: auth.user.id,
  };

  let postingIdToUse = postingId;
  if (postingId) {
    const { error: updateError } = await supabase
      .from('postings')
      .update(payload)
      .eq('id', postingId)
      .eq('user_id', auth.user.id);

    if (updateError) {
      return {
        errors: { form: [updateError.message] },
        values: { ...raw, skills: parsedSkills },
      };
    }
  } else {
    const { data: inserted, error: insertError } = await supabase
      .from('postings')
      .insert(payload)
      .select('id')
      .single();

    if (insertError || !inserted) {
      return {
        errors: { form: [insertError?.message || 'Insert failed'] },
        values: { ...raw, skills: parsedSkills },
      };
    }
    postingIdToUse = inserted.id;
  }

  const skillLinks = parsedSkills.map((s) => ({
    posting_id: postingIdToUse,
    skill_id: s.id,
  }));

  const { error: skillUpsertError } = await supabase
    .from('posting_skills')
    .upsert(skillLinks, {
      onConflict: 'posting_id, skill_id',
      ignoreDuplicates: true,
    });

  if (skillUpsertError) {
    return {
      errors: { form: [skillUpsertError.message] },
      values: { ...raw, skills: parsedSkills },
    };
  }

  redirect('/postings/my_postings');
}