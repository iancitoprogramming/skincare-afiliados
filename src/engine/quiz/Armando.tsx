"use client";

import { useEffect, useRef } from "react";

// Transición corta (700-900ms) para que la personalización se perciba como tal.
// Respeta prefers-reduced-motion: casi sin espera y sin rebote.
export function Armando({ label, onDone }: { label: string; onDone: () => void }) {
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const timer = setTimeout(() => onDoneRef.current(), reduce ? 200 : 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16" role="status" aria-live="polite">
      <div className="flex gap-2">
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-piedra [animation-delay:-0.2s]" />
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-piedra [animation-delay:-0.1s]" />
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-piedra" />
      </div>
      <p className="font-mono text-sm text-tinta">{label}…</p>
    </div>
  );
}
