import { IPdf } from "@/types";
import { createClient } from "@/utils/supabase/server";

export async function createPdf(name: string) {
  const supabase = await createClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;

  if (!userId) throw new Error("User is not authenticated");

  const { data: pdf, error } = await supabase
    .from("pdfs")
    .insert({ name, user_id: userId })
    .select("id")
    .single();

  if (error) throw new Error(`Failed to create pdf: ${error.message}`);

  return pdf.id;
}

export async function getAllPdfs() {
  const supabase = await createClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;

  if (!userId) throw new Error("User is not authenticated");

  const { data, error } = await supabase
    .from("pdfs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to fetch pdfs: ${error.message}`);

  return data as IPdf[];
}

export async function getPdfById(pdfId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("pdfs")
    .select("*")
    .eq("id", pdfId)
    .single();

  if (error) throw new Error(`Failed to fetch pdf: ${error.message}`);

  return data as IPdf;
}
