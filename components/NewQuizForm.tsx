"use client";

import {
  ChangeEvent,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";

import { RxCross2 } from "react-icons/rx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";

import { Input } from "./ui/input";
import { createQuizAction } from "@/actions/quiz";
import { redirect } from "next/navigation";

export default function NewQuizForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const [state, formAction, isPending] = useActionState(createQuizAction, {
    success: false,
    error: null,
    pdfId: null,
  });

  useEffect(() => {
    if ((state.success || state.error) && formRef.current) {
      formRef.current.reset();
      setFileName(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [state.success, state.error]);

  useEffect(() => {
    if (state.success && state.pdfId) {
      redirect(`/pdf/${state.pdfId}`);
    }
  }, [state.success, state.pdfId]);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setFileName(files[0].name);
  }

  function handleRemoveFile() {
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the actual input
    }
  }

  return (
    <form className="flex flex-col gap-y-4" action={formAction} ref={formRef}>
      <div
        className="rounded-sm px-4 py-2 bg-zinc-700 border border-zinc-600 text-sm md:text-base w-full cursor-pointer hover:bg-zinc-600 transition-all duration-200 relative"
        onClick={() => fileInputRef.current?.click()}
      >
        <p>{fileName ? fileName : "Upload a PDF file"}</p>

        {fileName && (
          <div
            className="absolute right-2 top-3 cursor-pointer"
            onClick={(e) => {
              if (isPending) return;

              e.stopPropagation(); // prevent triggering file dialog
              handleRemoveFile();
            }}
          >
            <RxCross2 />
          </div>
        )}
      </div>

      <div className="flex items-center gap-x-4">
        <Select name="language" defaultValue="english" disabled={isPending}>
          <SelectTrigger>
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-700 border border-zinc-600 text-white ">
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="thai">Thai</SelectItem>
          </SelectContent>
        </Select>

        <Select
          name="questionType"
          defaultValue="multiple-choice"
          disabled={isPending}
        >
          <SelectTrigger>
            <SelectValue placeholder="Question type" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-700 border border-zinc-600 text-white">
            <SelectItem value="multiple-choice">Multiple choices</SelectItem>
            <SelectItem value="true-false">True or false</SelectItem>
          </SelectContent>
        </Select>

        <Input
          className="border border-zinc-600 text-sm focus-visible:outline-none focus-visible:ring-0  text-white"
          placeholder="Number of questions (1-50)"
          name="numberOfQuestion"
          disabled={isPending}
        />
      </div>

      {state.error && (
        <p className="text-sm md:text-base text-red-400">{state.error}</p>
      )}

      <div className="mt-8 mx-auto">
        <Button
          className="bg-zinc-700 border border-zinc-600 hover:bg-zinc-600 transition-all duration-200"
          disabled={isPending}
        >
          {isPending ? "Generating..." : "Generate quiz"}
        </Button>
      </div>

      <input
        type="file"
        name="file"
        ref={fileInputRef}
        hidden
        onChange={handleFileChange}
        accept="application/pdf"
        disabled={isPending}
      />
    </form>
  );
}
