"use server";

import { blogMetadataSchema } from "@/lib/validations/blog";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/utils/supabase/server-client";

type TagInput = { id: string | null; name: string };

export default async function updateBlogMetaData(formData: FormData) {
  const id = formData.get("id")?.toString();

  if (!id) {
    const errorParams = encodeURIComponent(JSON.stringify({ id: ["Missing draft ID"] }));
    return redirect(`/blogs/${id}?errors=${errorParams}&dialogOpen=true`);
  }

  const raw = {
    title: formData.get("title"),
    category: formData.get("category"),
    tags: formData.getAll("tags") as string[] | undefined,
    summary: formData.get("summary"),
  };

  const formattedTags: TagInput[] = raw.tags
    ? raw.tags.map((tagStr) => JSON.parse(tagStr))
    : [];

  const parsed = blogMetadataSchema.safeParse({
    ...raw,
    tags: formattedTags,
  });

  const formDataParams = encodeURIComponent(JSON.stringify({ ...raw, id }));

  if (!parsed.success) {
    const zodErrors = parsed.error.flatten().fieldErrors;
    const errorParams = encodeURIComponent(JSON.stringify(zodErrors));
    return redirect(`/blogs/${id}?dialogErrors=${errorParams}&formData=${formDataParams}&dialogOpen=true`);
  }

  const slug = parsed.data.title.toLowerCase().replace(/\s+/g, "-");

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  // Insert any new tags (with conflict handling)
  for (let i = 0; i < formattedTags.length; i++) {
    if (!formattedTags[i].id) {
      const { data: insertedTag, error: tagError } = await supabase
        .from("tags")
        .insert({ name: formattedTags[i].name })
        .onConflict('name') // <-- This avoids inserting duplicates
        .ignore()
        .select("id")
        .eq("name", formattedTags[i].name)
        .single();

      if (tagError && tagError.code !== "PGRST116") {
        const errorParams = encodeURIComponent(
          JSON.stringify({ database: [tagError.message] })
        );
        return redirect(`/blogs/${id}?dialogErrors=${errorParams}&formData=${formDataParams}&dialogOpen=true`);
      }

      // If insertedTag is null (conflict), fetch existing tag id
      if (!insertedTag) {
        const { data: existingTag, error: fetchError } = await supabase
          .from("tags")
          .select("id")
          .eq("name", formattedTags[i].name)
          .single();

        if (fetchError) {
          const errorParams = encodeURIComponent(
            JSON.stringify({ database: [fetchError.message] })
          );
          return redirect(`/blogs/${id}?dialogErrors=${errorParams}&formData=${formDataParams}&dialogOpen=true`);
        }

        formattedTags[i].id = existingTag.id;
      } else {
        formattedTags[i].id = insertedTag.id;
      }
    }
  }

  // Update draft
  const { error: draftError } = await supabase
    .from("drafts")
    .update({
      title: parsed.data.title,
      slug,
      category: parsed.data.category,
      summary: parsed.data.summary,
    })
    .eq("id", id)
    .eq("user_id", userId);

  if (draftError) {
    const errorParams = encodeURIComponent(
      JSON.stringify({ database: [draftError.message] })
    );
    return redirect(`/blogs/${id}?dialogErrors=${errorParams}&formData=${formDataParams}&dialogOpen=true`);
  }

  // Update draft_tags
  await supabase.from("draft_tags").delete().eq("draft_id", id);

  const draftTagsRows = formattedTags.map((tag) => ({
    draft_id: id,
    tag_id: tag.id,
  }));

  const { error: draftTagsError } = await supabase.from("draft_tags").insert(draftTagsRows);

  if (draftTagsError) {
    const errorParams = encodeURIComponent(
      JSON.stringify({ database: [draftTagsError.message] })
    );
    return redirect(`/blogs/${id}?dialogErrors=${errorParams}&formData=${formDataParams}&dialogOpen=true`);
  }

  redirect(`/blogs/${id}`);
}
