import { IPdf } from "@/types";
import { createClient } from "@/utils/supabase/client";

export async function getAllPdfsClient() {
  const supabase = createClient();
  const userId = (await supabase.auth.getSession()).data.session?.user.id;

  if (!userId) throw new Error("User is not authenticated");

  const { data, error } = await supabase
    .from("pdfs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to fetch pdfs: ${error.message}`);

  return data as IPdf[];
}

export async function getPdfByIdClient(pdfId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pdfs")
    .select("*")
    .eq("id", pdfId)
    .single();

  if (error) throw new Error(`Failed to fetch pdf: ${error.message}`);

  return data as IPdf;
}
