// import { NextResponse, type NextRequest } from "next/server";
// import { createSupabaseServerClient } from "./utils/supabase/server-client";

// export async function middleware(request: NextRequest) {
//   const response = NextResponse.next()
//   const supabase = await createSupabaseServerClient({ req: request, res: response })
//   const {
//     data: { user },
//   } = await supabase.auth.getUser()

//   if (!user) {
//     return NextResponse.redirect(new URL('/login', request.url))
//   }
//   if (user && request.nextUrl.pathname.startsWith('/login')) {
//     return NextResponse.redirect(new URL('/dashboard', request.url)) 
//   }
//   return response
// }

// export const config = {
//   matcher: ["/api/:path*","/signup/:path*", "/login/:path*","/dashboard/:path*"],
// };

import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "./utils/supabase/server-client";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = await createSupabaseServerClient({ req: request, res: response });

  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  else if (user && pathname == "/dashboard"){
    const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

    if (!profile) {
      return NextResponse.redirect(new URL("/signup", request.url));
    }
  }

  else if (user && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  
  return response;
}

export const config = {
  matcher: ["/signup/:path*", "/dashboard/:path*", "/projects/:path*"],
};
