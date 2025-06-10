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

import { logoutAction } from "@/actions/auth";
import { getUserProfilesClient } from "@/lib/supabase/client/user";
import { IUser } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GiTwoCoins } from "react-icons/gi";
import { IoIosLogOut } from "react-icons/io";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";

export default function Header({ children }: { children?: React.ReactNode }) {
  const [user, setUser] = useState<IUser | undefined>(undefined);

  useEffect(() => {
    async function fetchUser() {
      const data = await getUserProfilesClient();

      setUser(data);
    }

    fetchUser();
  }, []);

  return (
    <div className="flex items-center justify-between">
      <SidebarTrigger />

      {children}

      <Button
        type="button"
        className="bg-zinc-700 border border-zinc-600 px-4 py-2 rounded-sm shadow hover:bg-zinc-600"
        asChild
      >
        <Link href={"/coin"} className="flex items-center gap-x-2">
          <GiTwoCoins className="text-white" />
          <span className="font-medium text-sm md:text-base">
            {user?.coins}
          </span>
        </Link>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer hover:border-2 hover:border-zinc-600 transition-all duration-200">
            <AvatarImage src={user?.image} />
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
