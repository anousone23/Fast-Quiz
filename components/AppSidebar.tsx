import Link from "next/link";
import { FaMoneyBill } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { RiHistoryFill } from "react-icons/ri";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getAllPdfs } from "@/lib/supabase/server/pdf";
import { getUserProfilesServer } from "@/lib/supabase/server/user";
import CustomSideBarMenuItem from "./CustomSidebarMenuItem";

export async function AppSidebar() {
  const pdfs = await getAllPdfs();
  const user = await getUserProfilesServer();

  return (
    <Sidebar>
      <SidebarContent className="px-4">
        {/* new quiz */}
        <SidebarGroup>
          <SidebarGroupContent className="mt-6">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="hover:bg-zinc-600 transition-all duration-200"
                >
                  <Link href={"/"} className="flex items-center gap-x-4">
                    <FiEdit className="text-white" />
                    <p className="text-sm md:text-base text-white">New quiz</p>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* history */}
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel className="md:text-sm">History</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-y-4">
              {pdfs.map((pdf) => (
                <CustomSideBarMenuItem key={pdf.id} pdf={pdf} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* payments */}
        <SidebarGroup className="mb-20">
          <SidebarGroupContent>
            <SidebarMenu className="gap-y-8">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="hover:bg-zinc-600 transition-all duration-200"
                >
                  <Link
                    href={"/my-payments"}
                    className="flex items-center gap-x-4"
                  >
                    <RiHistoryFill className="text-white" />
                    <p className="text-sm md:text-base text-white">
                      My payments
                    </p>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {user?.status === "admin" && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-zinc-600 transition-all duration-200"
                  >
                    <Link
                      href={"/payments"}
                      className="flex items-center gap-x-4"
                    >
                      <FaMoneyBill className="text-white" />
                      <p className="text-sm md:text-base text-white">Payment</p>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
