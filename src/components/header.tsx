import { createSupabaseServerClient } from "@/utils/supabase/server-client";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import LogoutButton from "@/app/logout/page";
import { IoPerson, IoChatboxEllipsesOutline } from "react-icons/io5";
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
            <Image
              src={LOGO_NAME}
              width={8}
              height={8}
              alt="ProjectBuddy Logo"
              className="h-8 w-8"
            />
            <span>ProjectBuddy</span>
          </Link>

          {user && (
            <NavigationMenu>
              <NavigationMenuList className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <NavigationMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="text-white font-semibold border bg-black border-black hover:border-amber-50 focus-visible::outline-none focus-visible:ring-0  focus-visible:border-transparent "
                      >
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
                        <Link href="/projects/community">
                          Community Projects
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="text-white font-semibold border bg-black border-black hover:border-amber-50 focus-visible::outline-none focus-visible:ring-0  focus-visible:border-transparent"
                      >
                        Postings
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuItem asChild>
                        <Link href="/postings/new">Add Posting</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/postings/postings?view_mode=my_postings">
                          My Postings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/postings/postings?view_mode=community_postings">
                          Community Postings
                        </Link>
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
            <Link className="text-white font-semibold" href="/chats">
                <IoChatboxEllipsesOutline  className="inline-block mr-1 text-lg" />
                Chats
              </Link>
              <Link className="text-white font-semibold" href="/profile">
                <IoPerson className="inline-block mr-1 text-lg" />
                You
              </Link>
              <LogoutButton />
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
