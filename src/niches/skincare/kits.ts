import type { KitDef } from "@/engine/kits";

// ─────────────────────────────────────────────────────────────────────────────
// KITS ARMADOS — curaduría, no generación automática.
//
// Un kit es una combinación fija de (tipo de piel + tier + foco) que el motor
// resuelve contra el catálogo. Se definen a mano para poder elegir el foco de
// cada piel en vez de dejarlo al azar.
//
// El `tier` tiene que ser servible (todas sus categorías con stock) o el kit no
// se muestra. Cuando cargues Tier 2-4, sumá los kits acá.
// ─────────────────────────────────────────────────────────────────────────────

export const KITS: KitDef[] = [
  {
    slug: "base-piel-grasa",
    nombre: "Kit Base · Piel grasa",
    descripcion: "Para piel que brilla a media tarde y hace granitos.",
    piel: "grasa",
    objetivo: "acne",
    tier: "1",
    presupuesto: 3,
  },
  {
    slug: "base-piel-mixta",
    nombre: "Kit Base · Piel mixta",
    descripcion: "Zona T grasa y mejillas normales, sin resecar de más.",
    piel: "mixta",
    objetivo: "textura",
    tier: "1",
    presupuesto: 3,
  },
  {
    slug: "base-piel-normal",
    nombre: "Kit Base · Piel normal",
    descripcion: "Mantener lo que ya funciona y sumar protección.",
    piel: "normal",
    objetivo: "textura",
    tier: "1",
    presupuesto: 3,
  },
  {
    slug: "base-piel-seca",
    nombre: "Kit Base · Piel seca",
    descripcion: "Para piel que tira, se descama o se siente áspera.",
    piel: "seca",
    objetivo: "deshidratacion",
    tier: "1",
    presupuesto: 3,
  },
  {
    slug: "base-piel-sensible",
    nombre: "Kit Base · Piel sensible",
    descripcion: "Fórmulas suaves para piel que se enrojece fácil.",
    piel: "sensible",
    objetivo: "deshidratacion",
    tier: "1",
    presupuesto: 3,
  },
];
