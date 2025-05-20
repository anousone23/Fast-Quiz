"use client";

import Header from "@/components/Header";
import QuizQuestionItem from "@/components/QuizQuestionItem";
import { Button } from "@/components/ui/button";
import { getPdfByIdClient } from "@/lib/supabase/client/pdf";
import { getAllPdfQuestionsClient } from "@/lib/supabase/client/questions";
import { IPdf, IQuestion } from "@/types";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function QuizPage() {
  const { pdfId } = useParams();

  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [showResult, setShowResult] = useState(false);
  const [pdf, setPdf] = useState<IPdf | null>(null);
  const [questions, setQuestions] = useState<IQuestion[]>([]);

  useEffect(() => {
    async function fetchPdfAndQuestions() {
      const pdfData = await getPdfByIdClient(pdfId as string);
      const questionsData = await getAllPdfQuestionsClient(pdfId as string);

      setPdf(pdfData);
      setQuestions(questionsData);
    }

    fetchPdfAndQuestions();
  }, [pdfId]);

  function handleAnswerChange(questionId: string, value: string) {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowResult(true);
  }

  function handleStartAgain() {
    setSelectedAnswers({});
    setShowResult(false);
  }

  function handleBackToPdf() {
    setSelectedAnswers({});
    setShowResult(false);

    redirect(`/pdf/${pdfId}`);
  }

  const score = questions.reduce((acc, q) => {
    return selectedAnswers[q.id] === q.answer ? acc + 1 : acc;
  }, 0);

  return (
    <div className="w-full h-screen px-4 py-8 flex flex-col">
      <Header>
        <p className="md:text-lg font-medium">{pdf?.name}</p>
      </Header>

      <div className="flex-1 mt-8 px-4 py-4 pb-8 flex flex-col gap-y-8">
        {showResult && (
          <div className="flex items-center gap-x-8">
            <p className="text-white">
              Score: {score} / {questions.length}
            </p>

            <Button
              onClick={handleStartAgain}
              className="bg-zinc-700 hover:bg-zinc-600"
            >
              Start again
            </Button>

            <Button
              onClick={handleBackToPdf}
              className="bg-zinc-700 hover:bg-zinc-600"
            >
              Back to PDF
            </Button>
          </div>
        )}

        {questions.map((question, i) => (
          <QuizQuestionItem
            key={question.id}
            question={question}
            index={i}
            selected={selectedAnswers[question.id]}
            onChange={handleAnswerChange}
            showResult={showResult}
          />
        ))}

        {!showResult && (
          <Button
            className="bg-zinc-700 border border-zinc-600 hover:bg-zinc-600 transition-all duration-200 text-sm md:text-base"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        )}
      </div>
    </div>
  );
}
