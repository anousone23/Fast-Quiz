"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function renamePdfAction(prevState, formData: FormData) {
  const pdfId = formData.get("pdfId") as string;
  const name = formData.get("name") as string;

  if (!pdfId) {
    return {
      success: false,
      error: "Pdf Id is required",
      name: prevState.name,
    };
  }

  if (!name) {
    return { success: false, error: "Name is required", name: prevState.name };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("pdfs")
    .update({ name: name.trim() })
    .eq("id", pdfId)
    .select("name")
    .single();

  if (error) {
    return {
      success: false,
      error: "Failed to rename pdf",
      name: prevState.name,
    };
  }

  revalidatePath(`/pdf/${pdfId}`);

  return { success: true, error: null, name: data.name };
}

export async function deletePdfAction(prevState, formData: FormData) {
  const pdfId = formData.get("pdfId") as string;

  if (!pdfId) {
    return {
      success: false,
      error: "Pdf Id is required",
      currentPathname: prevState.currentPathname,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("pdfs").delete().eq("id", pdfId);

  if (error) {
    return {
      success: false,
      error: "Failed to delete pdf",
      currentPathname: prevState.currentPathname,
    };
  }

  if (prevState.currentPathname === `/pdf/${pdfId}`) {
    redirect(`/`);
  }

  revalidatePath(`/pdf`);

  return {
    success: true,
    error: null,
    currentPathname: prevState.currentPathname,
  };
}
