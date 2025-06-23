import { createSupabaseServerClient } from "@/utils/supabase/server-client";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { POST as logout } from "@/app/logout/action";

import { LOGO_NAME } from "@/utils/constants";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default async function Header() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black border-b border-white">
      <div className="w-full max-w-10xl px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0">
          <Link
            href="/"
            className="flex items-center space-x-2 hover:text-neutral-300 transition text-white font-bold text-xl"
          >
            <Image src={LOGO_NAME} width={8} height={8} alt="ProjectBuddy Logo" className="h-8 w-8" />
            <span>ProjectBuddy</span>
          </Link>

          {user && (
            <NavigationMenu>
              <NavigationMenuList className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <NavigationMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="text-white font-semibold hover:bg-neutral-900 hover:text-white hover:no-b">
                        Projects
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuItem asChild>
                        <Link href="/projects/new">Add Project</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/projects/me">My Projects</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/projects/community">Community Projects</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          {user ? (
            <>
              <span className="text-white font-semibold">You</span>
              <form action={logout}>
                <Button
                  type="submit"
                  variant="destructive"
                  className="text-white border-white hover:bg-neutral-800 hover:text-white"
                >
                  Logout
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="text-black border-white hover:bg-neutral-800 hover:text-white"
                >
                  Login
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
