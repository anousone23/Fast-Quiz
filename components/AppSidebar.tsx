import Link from "next/link";

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
import { FiEdit } from "react-icons/fi";
import CustomSideBarMenuItem from "./CustomSidebarMenuItem";
import { getAllPdfs } from "@/lib/supabase/server/pdf";

export async function AppSidebar() {
  const pdfs = await getAllPdfs();

  return (
    <Sidebar>
      <SidebarContent className="px-4">
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

        <SidebarGroup>
          <SidebarGroupLabel className="md:text-sm">History</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-y-4">
              {pdfs.map((pdf) => (
                <CustomSideBarMenuItem key={pdf.id} pdf={pdf} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
