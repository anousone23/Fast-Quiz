import { IChoice, IQuestion } from "@/types";
import { createClient } from "@/utils/supabase/client";

export async function getAllQuestionChoicesClient(questionId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("choices")
    .select("*")
    .eq("question_id", questionId);

  if (error) throw new Error(`Failed to fetch choices: ${error.message}`);

  return data as IChoice[];
}

export async function getAllPdfQuestionsClient(pdfId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("pdf_id", pdfId);

  if (error) throw new Error(`Failed to fetch questions: ${error.message}`);

  return data as IQuestion[];
}
