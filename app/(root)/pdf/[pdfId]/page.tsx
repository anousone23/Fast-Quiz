import Header from "@/components/Header";
import PdfDetailsFooter from "@/components/PdfDetailsFooter";
import QuestionItem from "@/components/QuestionItem";
import { getPdfById } from "@/lib/supabase/server/pdf";
import { getAllPdfQuestions } from "@/lib/supabase/server/question";

export default async function PdfDetailsPage({
  params,
}: {
  params: Promise<{ pdfId: string }>;
}) {
  const { pdfId } = await params;
  const pdf = await getPdfById(pdfId);
  const questions = await getAllPdfQuestions(pdfId);

  return (
    <div className="w-full h-screen px-8 py-8 flex flex-col">
      <Header>
        <p className="md:text-lg font-medium">{pdf.name}</p>
      </Header>

      <main className="flex-1 mt-8 px-4 py-4 pb-8 flex flex-col gap-y-8 overflow-auto">
        {questions.map((question, i) => (
          <QuestionItem question={question} index={i} key={i} />
        ))}

        <PdfDetailsFooter pdf={pdf} questions={questions} />
      </main>
    </div>
  );
}
