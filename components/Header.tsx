"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { IoIosLogOut } from "react-icons/io";
import { SidebarTrigger } from "./ui/sidebar";
import { logoutAction } from "@/actions/auth";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export default function Header({ children }: { children?: React.ReactNode }) {
  const supabase = createClient();

  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    async function fetchUser() {
      const data = (await supabase.auth.getSession()).data.session?.user;
      setUser(data);
    }

    fetchUser();
  });

  return (
    <div className="flex items-center justify-between">
      <SidebarTrigger />

      {children}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer hover:border-2 hover:border-zinc-600 transition-all duration-200">
            <AvatarImage
              src={
                user?.user_metadata.avatar_url ||
                "https://github.com/shadcn.png"
              }
            />
            <AvatarFallback>User</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="bg-zinc-700 border border-zinc-600 text-white">
          <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="hover:bg-zinc-600! transition-all duration-200">
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex items-center gap-x-4 text-white"
              >
                <IoIosLogOut color="#ffffff" />
                Logout
              </button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
