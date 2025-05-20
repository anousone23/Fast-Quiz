import Header from "@/components/Header";
import NewQuizForm from "@/components/NewQuizForm";

export default async function NewQuizPage() {
  return (
    <div className="w-full h-screen px-8 py-8 flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col justify-center items-center gap-y-4">
        <div className="flex flex-col items-center gap-y-2">
          <h1 className="font-bold text-lg md:text-2xl">Fast Quiz</h1>
          <p className="text-sm md:text-base">
            Generate multiple choices or true false questions from PDF
          </p>
        </div>

        <NewQuizForm />
      </main>
    </div>
  );
}
