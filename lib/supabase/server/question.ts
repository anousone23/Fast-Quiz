import { ai } from "@/lib/gemini";
import { getPrompt } from "@/lib/helper";
import { IChoice, IGeneratedQuestions, IQuestion } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { ContentUnion, createPartFromUri } from "@google/genai";

export async function getAllPdfQuestions(pdfId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("pdf_id", pdfId);

  if (error) throw new Error(`Failed to fetch questions: ${error.message}`);

  return data as IQuestion[];
}

export async function getAllQuestionChoices(questionId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("choices")
    .select("*")
    .eq("question_id", questionId);

  if (error) throw new Error(`Failed to fetch choices: ${error.message}`);

  return data as IChoice[];
}

export async function generateQuiz({
  file,
  language,
  type,
  numberOfQuestion,
}: {
  file: File;
  language: string;
  type: string;
  numberOfQuestion: string;
}) {
  const uploadedFile = await ai.files.upload({
    file,
    config: {
      displayName: file.name.toLowerCase(),
    },
  });

  if (uploadedFile.error) throw new Error(uploadedFile.error.message);

  let getFile = await ai.files.get({ name: uploadedFile.name! });
  while (getFile.state === "PROCESSING") {
    console.log(`current file status: ${getFile.state}`);
    console.log("File is still processing, retrying in 5 seconds");

    await new Promise((resolve) => setTimeout(resolve, 5000));
    getFile = await ai.files.get({ name: uploadedFile.name! });
  }

  if (uploadedFile.state === "FAILED") {
    throw new Error("File processing failed.");
  }

  const content: ContentUnion = [
    {
      text: getPrompt({ language, type, numberOfQuestion }),
    },
  ];

  if (uploadedFile.uri && uploadedFile.mimeType) {
    const fileContent = createPartFromUri(
      uploadedFile.uri,
      uploadedFile.mimeType
    );
    content.push(fileContent);
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: content,
  });

  const rawText = response.text!.trim();
  const jsonString = rawText.replace(/^```json\s*|\s*```$/g, "");

  const quizData = JSON.parse(jsonString);

  return {
    quizData,
    fileName: uploadedFile.name!,
  };
}

export async function createQuestions({
  type,
  questions,
  pdfId,
}: {
  type: string;
  questions: IGeneratedQuestions[];
  pdfId: string;
}) {
  const supabase = await createClient();

  // Step 1: Prepare and insert questions
  const questionPayload = questions.map((question) => ({
    pdf_id: pdfId,
    text: question.text,
    type,
    answer: question.answer,
  }));

  const { data: insertedQuestions, error: questionError } = await supabase
    .from("questions")
    .insert(questionPayload)
    .select("id");

  if (questionError) {
    throw new Error(`Failed to create questions: ${questionError.message}`);
  }

  // Step 2: Prepare choices with matching question_id
  const choicePayload = questions.flatMap((question, index) =>
    question.choices.map((choiceText) => ({
      question_id: insertedQuestions[index].id,
      text: choiceText,
    }))
  );

  // Step 3: Insert all choices
  const { error: choiceError } = await supabase
    .from("choices")
    .insert(choicePayload);

  if (choiceError) {
    throw new Error(`Failed to create choices: ${choiceError.message}`);
  }
}
