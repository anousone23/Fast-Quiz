"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { IPdf } from "@/types";
import { MdOutlineMoreHoriz } from "react-icons/md";
import { SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { useActionState, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { deletePdfAction, renamePdfAction } from "@/actions/pdf";

export default function CustomSideBarMenuItem({ pdf }: { pdf: IPdf }) {
  const pathname = usePathname();
  const isActive = pathname === `/pdf/${pdf.id}`;

  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);

  const [renameState, renameAction, isPendingRename] = useActionState(
    renamePdfAction,
    {
      success: false,
      error: null,
      name: pdf.name,
    }
  );

  const [deleteState, deleteAction, isPendingDelete] = useActionState(
    deletePdfAction,
    {
      success: false,
      error: null,
      currentPathname: pathname,
    }
  );

  useEffect(() => {
    if (renameState.success) {
      setEditMode(false);
    }

    if (deleteState.success) {
      setDeleteMode(false);
    }
  }, [renameState.success, deleteState.success]);

  return (
    <SidebarMenuItem>
      {!editMode && (
        <div>
          <SidebarMenuButton
            className={`hover:bg-zinc-600 transition-all duration-200 data-[active=true]:bg-zinc-600 flex items-center justify-between ${
              pdf.name.length > 15 && "py-8"
            }`}
            isActive={isActive}
          >
            <Link href={`/pdf/${pdf.id}`}>
              <span className="text-sm md:text-base text-white">
                {pdf.name}
              </span>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <MdOutlineMoreHoriz className="text-white" />
              </DropdownMenuTrigger>

              <DropdownMenuContent className="bg-zinc-700 border border-zinc-600 text-white">
                <DropdownMenuItem className="hover:bg-zinc-600! transition-all duration-200">
                  <button
                    type="button"
                    className="flex items-center gap-x-4 text-white text-xs md:text-sm"
                    onClick={() => {
                      if (deleteMode) setDeleteMode(false);

                      setEditMode(true);
                    }}
                  >
                    Rename
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-zinc-600! transition-all duration-200">
                  <button
                    type="button"
                    className="flex items-center gap-x-4 text-white text-xs md:text-sm"
                    onClick={() => {
                      if (editMode) setEditMode(false);

                      setDeleteMode(true);
                    }}
                  >
                    Delete
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuButton>

          {/* delete */}
          {deleteMode && (
            <form action={deleteAction}>
              {deleteState.error && (
                <p className="text-xs md:text-sm text-red-400 mt-2 pl-1">
                  {deleteState.error}
                </p>
              )}
              <Input hidden name="pdfId" defaultValue={pdf.id} />
              <div className="flex items-center gap-x-4 mt-4">
                <Button
                  type="submit"
                  className="bg-red-600 text-xs md:text-sm hover:bg-red-700 transition-all duration-200"
                  disabled={isPendingDelete}
                >
                  {isPendingDelete ? "Deleting..." : "Delete"}
                </Button>
                <Button
                  type="button"
                  className="bg-zinc-700 text-xs md:text-sm hover:bg-zinc-600 transition-all duration-200"
                  onClick={() => setDeleteMode(false)}
                  disabled={isPendingDelete}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* edit */}
      {editMode && (
        <form action={renameAction} className="flex flex-col gap-4">
          <Input
            name="name"
            className="border-zinc-600 text-sm md:text-base text-white focus-visible:ring-0 focus-visible:border-zinc-600 selection:bg-zinc-700"
            defaultValue={pdf.name}
          />
          {renameState.error && (
            <p className="text-xs md:text-sm text-red-400 pl-2">
              {renameState.error}
            </p>
          )}
          <Input hidden name="pdfId" defaultValue={pdf.id} />

          <div className="flex items-center gap-x-4">
            <Button
              type="submit"
              className="bg-zinc-700 text-xs md:text-sm hover:bg-zinc-600 transition-all duration-200"
              disabled={isPendingRename}
            >
              {isPendingRename ? "Updating..." : "Rename"}
            </Button>
            <Button
              type="button"
              className="bg-zinc-700 text-xs md:text-sm hover:bg-zinc-600 transition-all duration-200"
              disabled={isPendingRename}
              onClick={() => setEditMode(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </SidebarMenuItem>
  );
}
