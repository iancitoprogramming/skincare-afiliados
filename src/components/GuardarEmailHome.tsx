"use client";

import { GuardarEmail } from "@/engine/quiz/GuardarEmail";
import { guardarLead } from "@/engine/tracking";

// La home es un server component y no puede pasarle una función a GuardarEmail.
// Este envoltorio la pone del lado del cliente. Sin sesión (todavía no hubo
// quiz): el lead se guarda con sesion_id null, que la API acepta.
export function GuardarEmailHome({ label }: { label: string }) {
  return <GuardarEmail label={label} onGuardar={(email) => guardarLead(null, email)} />;
}
