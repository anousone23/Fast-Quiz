"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { getAllQuestionChoicesClient } from "@/lib/supabase/client/questions";
import { createGoogleFormQuiz } from "@/lib/googleForm";
import { createClient } from "@/utils/supabase/client";
import { IPdf, IQuestion } from "@/types";
import Link from "next/link";
import { BarLoader } from "react-spinners";
import toast from "react-hot-toast";

export default function PdfDetailsFooter({
  pdf,
  questions,
}: {
  pdf: IPdf;
  questions: IQuestion[];
}) {
  const [isLoading, setIsLoaidng] = useState(false);

  async function handleCreateGoogleForm() {
    try {
      setIsLoaidng(true);

      const supabase = createClient();
      const accessToken = (await supabase.auth.getSession()).data.session
        ?.provider_token;

      if (!accessToken) {
        throw new Error("Google access token not found");
      }

      // Step 1: Fetch choices for all questions in parallel
      const questionsWithChoices = await Promise.all(
        questions.map(async (q) => {
          const choices = await getAllQuestionChoicesClient(q.id);
          return {
            ...q,
            choices,
          };
        })
      );

      // Step 2: Format for Google Form
      const formattedQuestions = questionsWithChoices.map((q) => ({
        text: q.text,
        choices: q.choices.map((c) => c.text),
        answer: q.answer,
      }));

      // Step 3: Call your Google Form function
      const form = await createGoogleFormQuiz(
        accessToken,
        pdf?.name || "Quiz",
        formattedQuestions
      );

      toast.success("Google form created successfully");

      window.open(
        `https://docs.google.com/forms/d/${form.formId}/edit`,
        "_blank"
      );
    } catch (err) {
      throw new Error(
        "Failed to create Google Form: " + (err as Error).message
      );
    } finally {
      setIsLoaidng(false);
    }
  }

  if (isLoading) {
    return (
      <div className="bg-zinc-700 flex flex-col items-center justify-center rounded-sm py-4 gap-y-2">
        <p className="text-sm md:text-base text-white">
          Creating google form ...
        </p>

        <BarLoader
          color={"#fafafa"}
          loading={true}
          aria-label="Loading Spinner"
          data-testid="loader"
          className="rounded-sm"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-4">
      <Button
        type="button"
        asChild
        className="text-xs md:text-sm bg-zinc-700 hover:bg-zinc-600 text-white font-medium"
        disabled={isLoading}
      >
        <Link href={`/pdf/${pdf.id}/quiz`}>Start Quiz</Link>
      </Button>

      <Button
        type="button"
        className="text-xs md:text-sm bg-zinc-700 hover:bg-zinc-600 text-white font-medium"
        onClick={handleCreateGoogleForm}
        disabled={isLoading}
      >
        {isLoading ? "Creating..." : "Create Google Form Quiz"}
      </Button>
    </div>
  );
}
