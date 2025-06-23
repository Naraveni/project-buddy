import { createSupabaseServerClient } from "@/utils/supabase/server-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (code) {
    const response = NextResponse.redirect(new URL("/dashboard", url.origin));
    const supabase = await createSupabaseServerClient({ req: request, res: response });

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error || !data.session) {
      console.error("Auth callback error:", error);
      return NextResponse.redirect(new URL("/login", url.origin));
    }

    const userId = data.session.user.id;
    response.cookies.set("user_id", userId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      sameSite: "lax",
      //PORDUCTION CHANGE
      // secure: process.env.NODE_ENV === "production",
    });

    return response;
  }

  return NextResponse.redirect(new URL("/auth/auth-error", url.origin));
}
