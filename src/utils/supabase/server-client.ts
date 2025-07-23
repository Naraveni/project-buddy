'use server';
import { type NextRequest, type NextResponse } from "next/server";
import { cookies as headersCookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function createSupabaseServerClient(opts?: {
  req?: NextRequest
  res?: NextResponse
}) {
  const { req, res } = opts || {}
  const cookies = await headersCookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () =>
          req
            ? req.cookies.getAll()
            : cookies.getAll(),
        setAll: res
          ? (list) =>
              list.forEach(({ name, value, options }) =>
                res.cookies.set(name, value, options)
              )
          : () => {},
      },
    }
  )
}

