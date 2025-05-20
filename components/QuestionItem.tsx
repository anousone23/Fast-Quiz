import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { IQuestion } from "@/types";
import { Label } from "./ui/label";
import { getAllQuestionChoices } from "@/lib/supabase/server/question";

export default async function QuestionItem({
  question,
  index,
}: {
  question: IQuestion;
  index: number;
}) {
  const choices = await getAllQuestionChoices(question.id);

  return (
    <div className="flex flex-col gap-y-4" key={question.text}>
      <p className="text-sm md:text-base">
        {index + 1}. {question.text}
      </p>

      <RadioGroup className="gap-y-4" name={`choice_${index + 1}`}>
        {choices.map((choice) => {
          const isCorrect = choice.text === question.answer;

          return (
            <div className="flex items-center space-x-2" key={choice.id}>
              <RadioGroupItem
                value={choice.text}
                id={choice.id}
                disabled
                className={`${isCorrect && "bg-green-500 border-zinc-50!"}`}
              />
              <Label className="text-sm md:text-base font-normal">
                {choice.text}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
}
