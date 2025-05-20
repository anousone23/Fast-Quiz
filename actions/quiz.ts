"use server";

import { createPdf } from "@/lib/supabase/server/pdf";
import { createQuestions, generateQuiz } from "@/lib/supabase/server/question";
import { revalidatePath } from "next/cache";

export async function createQuizAction(prevState, formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const questionType = formData.get("questionType") as string;
    const language = formData.get("language") as string;
    const numberOfQuestion = formData.get("numberOfQuestion") as string;

    // check file type
    if (!file || file.type !== "application/pdf") {
      return { success: false, error: "Invalid or missing file." };
    }

    // check language
    if (!language) {
      return { success: false, error: "Language is required." };
    }
    if (!["english", "thai"].includes(language)) {
      return { success: false, error: "Invalid language." };
    }

    // check question type
    if (!["multiple-choice", "true-false"].includes(questionType)) {
      return { success: false, error: "Invalid question type." };
    }

    // check number of questions
    if (!numberOfQuestion || isNaN(Number(numberOfQuestion))) {
      return { success: false, error: "Invalid number of questions." };
    }

    if (+numberOfQuestion < 1 || +numberOfQuestion > 50) {
      return {
        success: false,
        error: "Number of questions must be between 1 and 50.",
      };
    }

    const { quizData, fileName } = await generateQuiz({
      file,
      language,
      type: questionType,
      numberOfQuestion,
    });

    const pdfId = await createPdf(fileName);
    await createQuestions({ type: questionType, questions: quizData, pdfId });

    revalidatePath("/");

    return { success: true, error: null, pdfId };
  } catch (err) {
    return {
      success: false,
      error: (err as Error).message || "Failed to generate quiz.",
    };
  }
}

export async function submitQuizAction(formData: FormData) {
  console.log(formData);
}
