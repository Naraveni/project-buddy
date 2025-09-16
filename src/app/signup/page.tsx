// import { createSupabaseServerClient } from "@/utils/supabase/server-client";
// import ProfileFormPage from "@/components/profileForm";

// export default async function ProfilePage({
//   searchParams,
// }: {
//   searchParams: { errors?: string };
// }) {
//   const supabase = await createSupabaseServerClient({});
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) return null;

  
//   const { data: profile } = await supabase
//     .from("profiles")
//     .select("*")
//     .eq("id", user.id)
//     .single();

//   const { data: skillLinks } = await supabase
//     .from("profile_skills")
//     .select("skills ( id, name )")
//     .eq("profile_id", user.id);

//   const skills = skillLinks?.map((link) => link.skills).filter(Boolean) ?? [];

//   // Prepare error handling
//   let errors: Record<string, string[]> = {};
//   if (searchParams.errors) {
//     try {
//       const parsedErrors: Array<{ path?: string[]; message: string }> = JSON.parse(
//         decodeURIComponent(searchParams.errors)
//       );
//       for (const err of parsedErrors) {
//         const field = err.path?.[0] ?? "form";
//         if (!errors[field]) errors[field] = [];
//         errors[field].push(err.message);
//       }
//     } catch {
//       errors = { form: ["An unknown error occurred."] };
//     }
//   }

//   const mergedProfile = {
//     ...profile,
//     skills,
//     experience: profile?.experience ?? [],
//     education: profile?.education ?? [],
//   };

//   return <ProfileFormPage initialData={mergedProfile} errors={errors} />;
// }

// app/signup/page.tsx
import { getProfileData } from '../profile/action'; // adjust if in different folder
import ProfileFormPage from '@/components/profileForm';

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ errors?: string }>;
}) {
  const { profile, skills } = await getProfileData();


  const searchParam = await searchParams;
  let errors: Record<string, string[]> = {};
  if (searchParam.errors) {
    try {
      const parsedErrors: Array<{ path?: string[]; message: string }> = JSON.parse(
        decodeURIComponent(searchParam.errors)
      );
      for (const err of parsedErrors) {
        const field = err.path?.[0] ?? 'form';
        if (!errors[field]) errors[field] = [];
        errors[field].push(err.message);
      }
    } catch {
      errors = { form: ['An unknown error occurred.'] };
    }
  }

  const mergedProfile = {
    ...profile,
    skills,
    experience: profile?.experience ?? [],
    education: profile?.education ?? [],
  };

  return <ProfileFormPage initialData={mergedProfile} errors={errors} />;
}
