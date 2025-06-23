"use server"; 
import { createSupabaseServerClient } from "@/utils/supabase/server-client";
import { redirect } from "next/navigation";


export async function POST() {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.warn("Logout attempted but failed:", error.message);
  }
  return redirect("/login");
}
