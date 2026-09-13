"use client";

import { useState, type FormEvent } from "react";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Bloque de cierre: guardar la rutina por email. Aparece DESPUÉS de los resultados,
// nunca antes. Valida el formato del lado del cliente; el guardado real (POST a
// /api/leads con validación server-side) se engancha en la parte 4 vía onGuardar.
export function GuardarEmail({
  label,
  onGuardar,
}: {
  label: string;
  onGuardar?: (email: string) => Promise<void> | void;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [estado, setEstado] = useState<"idle" | "ok" | "error">("idle");

  async function submit(e: FormEvent) {
    e.preventDefault();
    const val = email.trim();
    if (!EMAIL_RE.test(val)) {
      setError("Poné un email válido");
      return;
    }
    setError("");
    try {
      await onGuardar?.(val);
      setEstado("ok");
    } catch {
      setEstado("error");
    }
  }

  if (estado === "ok") {
    return <p className="font-body text-tinta">Listo, te guardamos la rutina. Revisá tu correo.</p>;
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <label htmlFor="email-rutina" className="font-etiqueta text-xs text-piedra">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          id="email-rutina"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
          }}
          placeholder="tu@email.com"
          className="min-h-[52px] min-w-0 flex-1 rounded-xl border border-niebla bg-porcelana px-4 font-body text-tinta outline-none focus:border-piedra"
        />
        <button
          type="submit"
          className="min-h-[52px] rounded-xl border border-tinta px-5 font-body font-medium text-tinta transition-colors hover:bg-tinta hover:text-porcelana"
        >
          guardar
        </button>
      </div>
      {error ? <p className="font-body text-sm text-terracota">{error}</p> : null}
      {estado === "error" ? (
        <p className="font-body text-sm text-terracota">No se pudo guardar, probá de nuevo.</p>
      ) : null}
    </form>
  );
}
