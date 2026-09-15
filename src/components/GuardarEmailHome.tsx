"use client";

import { GuardarEmail } from "@/engine/quiz/GuardarEmail";
import { guardarLead } from "@/engine/tracking";
import { copy } from "@/niches/skincare/copy";

// La home es un server component y no puede pasarle una función a GuardarEmail.
// Este envoltorio la pone del lado del cliente. Sin sesión (todavía no hubo
// quiz): el lead se guarda con sesion_id null, que la API acepta.
//
// Etiqueta, nota y mensaje de éxito son los de la home y no los del resultado:
// acá no hay rutina que guardar. Ver `copy.home.correo`.
export function GuardarEmailHome() {
  return (
    <>
      <GuardarEmail
        label={copy.home.correo.etiqueta}
        listo={copy.home.correo.listo}
        onGuardar={(email, website) => guardarLead(null, email, { website })}
      />
      <p className="mt-3 font-body text-sm leading-relaxed text-tinta/80">{copy.home.correo.nota}</p>
    </>
  );
}
