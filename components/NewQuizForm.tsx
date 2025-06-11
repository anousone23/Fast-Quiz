"use client";

import {
  ChangeEvent,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { BarLoader } from "react-spinners";
import { upload } from "@vercel/blob/client";

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

  const [state, formAction, isPending] = useActionState(createQuizAction, {
    success: false,
    error: null,
    pdfId: null,
  });

  useEffect(() => {
    if ((state.success || state.error) && formRef.current) {
      formRef.current.reset();
      setFileName(null);
      setSelectedFile(null);
      setUploadProgress(0);
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

    const file = files[0];

    // Validate file type
    if (file.type !== "application/pdf") {
      alert("Please select a PDF file");
      return;
    }

    // Check file size (optional client-side check)
    if (file.size > 50 * 1024 * 1024) {
      // 50MB limit for Vercel Blob
      alert("File size must be less than 50MB");
      return;
    }

    setFileName(file.name);
    setSelectedFile(file);
  }

  function handleRemoveFile() {
    setFileName(null);
    setSelectedFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select a PDF file");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const language = formData.get("language") as string;
    const questionType = formData.get("questionType") as string;
    const numberOfQuestion = formData.get("numberOfQuestion") as string;

    // Validate form data
    if (!language || !["english", "thai"].includes(language)) {
      alert("Please select a valid language");
      return;
    }

    if (!["multiple-choice", "true-false"].includes(questionType)) {
      alert("Please select a valid question type");
      return;
    }

    if (!numberOfQuestion || isNaN(Number(numberOfQuestion))) {
      alert("Please enter a valid number of questions");
      return;
    }

    if (+numberOfQuestion < 1 || +numberOfQuestion > 50) {
      alert("Number of questions must be between 1 and 50");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Create unique filename to avoid caching issues
      const timestamp = Date.now();
      const uniqueFileName = `${timestamp}-${selectedFile.name}`;

      // Upload file to Vercel Blob with TTL (auto-deletion after 1 hour)
      const blob = await upload(uniqueFileName, selectedFile, {
        access: "public",
        handleUploadUrl: "/api/upload",
        multipart: true, // Better for large files
        onUploadProgress: (progress) => {
          setUploadProgress(
            Math.round((progress.loaded / progress.total) * 100)
          );
        },
      });

      // Create new FormData with blob URL instead of file
      const newFormData = new FormData();
      newFormData.append("blobUrl", blob.url);
      newFormData.append("fileName", selectedFile.name); // Keep original name for display
      newFormData.append("language", language);
      newFormData.append("questionType", questionType);
      newFormData.append("numberOfQuestion", numberOfQuestion);

      // Call the server action with blob URL
      formAction(newFormData);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  const isLoading = isPending || isUploading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-y-2">
        <p>
          {isUploading
            ? `Uploading... ${uploadProgress}%`
            : "Generating quiz..."}
        </p>
        <BarLoader
          color={"#fafafa"}
          loading={true}
          className="rounded-sm"
          cssOverride={{ width: 320 }}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-y-4"
      onSubmit={handleSubmit}
      ref={formRef}
    >
      <div
        className="rounded-sm px-4 py-2 bg-zinc-700 border border-zinc-600 text-sm md:text-base w-full cursor-pointer hover:bg-zinc-600 transition-all duration-200 relative"
        onClick={() => fileInputRef.current?.click()}
      >
        <p>{fileName ? fileName : "Upload a PDF file"}</p>

        {fileName && (
          <div
            className="absolute right-2 top-3 cursor-pointer"
            onClick={(e) => {
              if (isLoading) return;
              e.stopPropagation();
              handleRemoveFile();
            }}
          >
            <RxCross2 />
          </div>
        )}
      </div>

      <div className="flex items-center gap-x-4">
        <Select name="language" defaultValue="english" disabled={isLoading}>
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
          disabled={isLoading}
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
          disabled={isLoading}
        />
      </div>

      {state.error && (
        <p className="text-sm md:text-base text-red-400">{state.error}</p>
      )}

      <div className="mt-8 mx-auto">
        <Button
          type="submit"
          className="bg-zinc-700 border border-zinc-600 hover:bg-zinc-600 transition-all duration-200"
          disabled={isLoading}
        >
          Generate quiz
        </Button>
      </div>

      <input
        type="file"
        name="file"
        ref={fileInputRef}
        hidden
        onChange={handleFileChange}
        accept="application/pdf"
        disabled={isLoading}
      />
    </form>
  );
}
