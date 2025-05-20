"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { IChoice, IQuestion } from "@/types";
import { Label } from "./ui/label";

import { getAllQuestionChoicesClient } from "@/lib/supabase/client/questions";
import { useEffect, useState } from "react";

export default function QuizQuestionItem({
  question,
  index,
  selected,
  onChange,
  showResult,
}: {
  question: IQuestion;
  index: number;
  selected?: string;
  onChange: (questionId: string, value: string) => void;
  showResult?: boolean;
}) {
  const [choices, setChoices] = useState<IChoice[]>([]);

  useEffect(() => {
    async function fetchChoices() {
      const data = await getAllQuestionChoicesClient(question.id);

      setChoices(data);
    }

    fetchChoices();
  }, [question.id]);

  return (
    <div className="flex flex-col gap-y-4">
      <p className="text-sm md:text-base">
        {index + 1}. {question.text}
      </p>

      <RadioGroup
        className="gap-y-4"
        name={`choice_${index + 1}`}
        value={selected}
        onValueChange={(value) => onChange(question.id, value)}
      >
        {choices.map((choice) => {
          const isCorrect = choice.text === question.answer;
          const isSelected = selected === choice.text;

          let choiceClass = "text-sm md:text-base font-normal";
          if (showResult) {
            if (isSelected && isCorrect) {
              choiceClass += " text-green-500";
            } else if (isSelected && !isCorrect) {
              choiceClass += " text-red-500";
            } else if (isCorrect) {
              choiceClass += " text-green-500";
            }
          }

          return (
            <div className="flex items-center space-x-2" key={choice.id}>
              <RadioGroupItem
                value={choice.text}
                id={choice.id}
                disabled={showResult}
              />
              <Label className={choiceClass}>
                {choice.text}{" "}
                <Label className="text-white font-normal">
                  {showResult && !isSelected && isCorrect && "(correct answer)"}
                </Label>
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
}
