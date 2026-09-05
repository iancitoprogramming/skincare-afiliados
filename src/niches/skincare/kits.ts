import type { KitDef, KitUnico } from "@/engine/kits";

// ─────────────────────────────────────────────────────────────────────────────
// KITS — dos clases, y la diferencia importa para la conversión.
//
// 1. KITS_UNICOS: una sola publicación de Mercado Libre. Un link, un checkout,
//    un envío. Es lo más simple que le podés dar a alguien que llega de una red
//    social, así que van primero.
//
// 2. KITS: curaduría nuestra. El motor los resuelve contra el catálogo y salen
//    N productos, o sea N compras distintas. Más flexibles, más fricción.
// ─────────────────────────────────────────────────────────────────────────────

// Publicaciones reales de ML relevadas el 2026-09-05. `incluye` sólo lista lo que
// el título de la publicación dice explícitamente: no inventamos el contenido.
export const KITS_UNICOS: KitUnico[] = [
  {
    slug: "libra-grasa-acneica",
    ml_id: "MLAU560830924",
    nombre: "Kit Libra · Piel grasa y acneica",
    marca: "Libra",
    descripcion: "Loción con ácido salicílico y serum de niacinamida, para usar de noche.",
    incluye: ["Loción con ácido salicílico 250 ml", "Serum de niacinamida"],
    piel: ["grasa", "mixta"],
    // Lleva ácido salicílico: es justo lo que la tabla de sustitutos manda
    // reemplazar por PHA en piel sensible.
    apto_sensible: false,
    precio_ars: 22314,
    precio_lista: 25634,
    imagen_url: "https://http2.mlstatic.com/D_Q_NP_2X_724305-MLA92285808482_092025-V.webp",
    link_afiliado: "https://meli.la/33qEnHo",
    vendedor: "PeluFan",
    mas_vendido: true,
  },
  {
    slug: "libra-piel-mixta",
    ml_id: "MLAU3408127149",
    nombre: "Kit Libra · Rutina piel mixta",
    marca: "Libra",
    descripcion: "Rutina de piel mixta con hialurónico y vitamina E.",
    incluye: [],
    piel: ["mixta", "normal"],
    apto_sensible: false,
    precio_ars: 45900,
    precio_lista: 54000,
    imagen_url: "https://http2.mlstatic.com/D_Q_NP_2X_799445-MLA91637172120_092025-V.webp",
    link_afiliado: "https://meli.la/2yiV43y",
    vendedor: "CarlaQ",
    mas_vendido: true,
  },
];

// `presupuesto: 2` a propósito. Con 3 el motor agarra siempre lo más caro y los
// kits se iban a $130.000, que para alguien que llega de una red social es un no.
export const KITS: KitDef[] = [
  {
    slug: "base-piel-grasa",
    nombre: "Kit Base · Piel grasa",
    descripcion: "Para piel que brilla a media tarde y hace granitos.",
    piel: "grasa",
    objetivo: "acne",
    tier: "1",
    presupuesto: 2,
  },
  {
    slug: "base-piel-mixta",
    nombre: "Kit Base · Piel mixta",
    descripcion: "Zona T grasa y mejillas normales, sin resecar de más.",
    piel: "mixta",
    objetivo: "textura",
    tier: "1",
    presupuesto: 2,
  },
  {
    slug: "base-piel-normal",
    nombre: "Kit Base · Piel normal",
    descripcion: "Mantener lo que ya funciona y sumar protección.",
    piel: "normal",
    objetivo: "textura",
    tier: "1",
    presupuesto: 2,
  },
  {
    slug: "base-piel-seca",
    nombre: "Kit Base · Piel seca",
    descripcion: "Para piel que tira, se descama o se siente áspera.",
    piel: "seca",
    objetivo: "deshidratacion",
    tier: "1",
    presupuesto: 2,
  },
  {
    slug: "base-piel-sensible",
    nombre: "Kit Base · Piel sensible",
    descripcion: "Fórmulas suaves para piel que se enrojece fácil.",
    piel: "sensible",
    objetivo: "deshidratacion",
    tier: "1",
    presupuesto: 2,
  },
];
