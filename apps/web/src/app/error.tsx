"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
      <h2 className="font-serif text-3xl">Something went wrong</h2>
      <p className="text-muted-foreground text-sm max-w-sm">
        An unexpected error occurred. Please try again or refresh the page.
      </p>
      <button
        type="button"
        onClick={reset}
        className="px-4 py-2 text-sm rounded-md bg-foreground text-background hover:opacity-90 transition-opacity"
      >
        Try again
      </button>
    </div>
  );
}
