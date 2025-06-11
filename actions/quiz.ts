"use server";

import { removeCoin } from "@/lib/supabase/server/coin";
import { createPdf } from "@/lib/supabase/server/pdf";
import { createQuestions, generateQuiz } from "@/lib/supabase/server/question";
import { del as deleteBlob } from "@vercel/blob";
import { revalidatePath } from "next/cache";

export async function createQuizAction(prevState, formData: FormData) {
  try {
    const blobUrl = formData.get("blobUrl") as string;
    const fileName = formData.get("fileName") as string;
    const questionType = formData.get("questionType") as string;
    const language = formData.get("language") as string;
    const numberOfQuestion = formData.get("numberOfQuestion") as string;

    // Validate blob URL
    if (!blobUrl || !blobUrl.startsWith("https://")) {
      return { success: false, error: "Invalid file URL." };
    }

    // Validate file name
    if (!fileName || !fileName.toLowerCase().endsWith(".pdf")) {
      return { success: false, error: "Invalid file name." };
    }

    // Validate language
    if (!language) {
      return { success: false, error: "Language is required." };
    }
    if (!["english", "thai"].includes(language)) {
      return { success: false, error: "Invalid language." };
    }

    // Validate question type
    if (!["multiple-choice", "true-false"].includes(questionType)) {
      return { success: false, error: "Invalid question type." };
    }

    // Validate number of questions
    if (!numberOfQuestion || isNaN(Number(numberOfQuestion))) {
      return { success: false, error: "Invalid number of questions." };
    }

    if (+numberOfQuestion < 1 || +numberOfQuestion > 50) {
      return {
        success: false,
        error: "Number of questions must be between 1 and 50.",
      };
    }

    // Fetch the PDF from the blob URL
    const response = await fetch(blobUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch PDF from blob storage");
    }

    // Convert to File object for compatibility with existing generateQuiz function
    const arrayBuffer = await response.arrayBuffer();
    const file = new File([arrayBuffer], fileName, { type: "application/pdf" });

    const { quizData } = await generateQuiz({
      file,
      language,
      type: questionType,
      numberOfQuestion,
    });

    const pdfId = await createPdf(fileName);
    await createQuestions({ type: questionType, questions: quizData, pdfId });
    await removeCoin();

    // Delete the blob after processing
    try {
      await deleteBlob(blobUrl);
      console.log("Blob deleted successfully:", blobUrl);
    } catch (deleteError) {
      console.error("Failed to delete blob:", deleteError);
      // Don't fail the entire operation if blob deletion fails
    }

    revalidatePath("/");

    return { success: true, error: null, pdfId };
  } catch (err) {
    console.error("Quiz creation error:", err);

    // Clean up blob if quiz generation failed
    if (formData.get("blobUrl")) {
      try {
        await deleteBlob(formData.get("blobUrl") as string);
        console.log("Blob cleaned up after error");
      } catch (deleteError) {
        console.error("Failed to clean up blob after error:", deleteError);
      }
    }

    return {
      success: false,
      error: (err as Error).message || "Failed to generate quiz.",
    };
  }
}

export async function submitQuizAction(formData: FormData) {
  console.log(formData);
}
