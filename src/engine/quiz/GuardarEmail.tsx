"use client";

import { useState, type FormEvent } from "react";
import { ETIQUETA } from "@/components/estilo";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Bloque de cierre: guardar la rutina por email. Aparece DESPUÉS de los resultados,
// nunca antes. Valida el formato del lado del cliente; el guardado real (POST a
// /api/leads con validación server-side) se engancha en la parte 4 vía onGuardar.
export function GuardarEmail({
  label,
  onGuardar,
}: {
  label: string;
  /** `website` es el honeypot: una persona lo manda vacío. */
  onGuardar?: (email: string, website: string) => Promise<void> | void;
}) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
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
      await onGuardar?.(val, website);
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
      <label htmlFor="email-rutina" className={ETIQUETA}>
        {label}
      </label>
      {/* Honeypot: fuera de la vista y del tab, sin autocompletar. Un bot que
          llena todo lo llena; una persona no lo ve. La API descarta el envío. */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />
      <div className="flex gap-2">
        {/* text-base explícito: el tamaño heredado depende de dónde se monte, y con
            menos de 16 px Safari en iPhone agranda la página al enfocar el campo.

            El borde va en tinta/70, que da 5,7:1. En niebla quedaba en 1,35:1, y
            cuando el borde es lo que muestra dónde está el campo, WCAG 1.4.11 pide
            3:1. El placeholder, también en tinta/70: el de Tailwind es la mitad
            del color del texto y quedaba cerca de 3:1. */}
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
          className="min-h-13 min-w-0 flex-1 border border-tinta/70 bg-porcelana px-4 font-body text-base text-tinta outline-none placeholder:text-tinta/70 focus:border-tinta focus:ring-1 focus:ring-tinta"
        />
        <button
          type="submit"
          className="min-h-13 border border-tinta px-5 font-body text-xs font-medium uppercase tracking-[0.16em] text-tinta transition-colors hover:bg-tinta hover:text-porcelana"
        >
          guardar
        </button>
      </div>
      {/* Los errores van en tinta y no en terracota, que es sólo para comprar: lo
          que avisa es la frase, no el color. */}
      {error ? (
        <p role="alert" className="font-body text-sm font-medium text-tinta">
          {error}
        </p>
      ) : null}
      {estado === "error" ? (
        <p role="alert" className="font-body text-sm font-medium text-tinta">
          No se pudo guardar, probá de nuevo.
        </p>
      ) : null}
    </form>
  );
}
