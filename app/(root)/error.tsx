"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-y-4">
        <h2>Something went wrong!</h2>
        <p>{error.message}</p>

        <Button
          className="text-sm md:text-base border border-zinc-600 bg-zinc-700 hover:bg-zinc-600 transition-all duration-200"
          onClick={() => reset()}
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
