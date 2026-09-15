"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Producto } from "@/engine/recomendacion";
import { slugProducto } from "@/engine/slug";
import { PruebaSocial } from "@/components/PruebaSocial";
import { RangoPrecio } from "@/components/RangoPrecio";
import { ETIQUETA, ETIQUETA_BASE, FOTO_PRODUCTO, MARCO_FOTO } from "@/components/estilo";

// Filtrado en el cliente a propósito: el catálogo son decenas de productos, no
// miles. Traerlos todos y filtrar en memoria es instantáneo y no cuesta un
// round-trip por cada toque de filtro, que en mobile se siente.

// "criterio" es el orden por omisión y es el argumento de la marca hecho lista:
// con qué está hecho el producto primero, y la banda sólo para desempatar.
// "más vendidos" queda como opción aparte y dice de dónde sale el número: es
// popularidad de Mercado Libre, no nuestra valoración. Antes la popularidad
// estaba mezclada adentro del orden por omisión, que es justamente lo que hacía
// que el catálogo terminara pareciéndose a una lista de más vendidos.
type Orden = "criterio" | "vendidos" | "precio_asc" | "precio_desc";

export interface OpcionFiltro {
  valor: string;
  label: string;
  /** Va en un grupo aparte dentro de su fila: los pasos opcionales de una rutina. */
  opcional?: boolean;
}

export function CatalogoGrid({
  productos,
  pieles,
  pasos,
  origenes,
}: {
  productos: Producto[];
  pieles: OpcionFiltro[];
  pasos: OpcionFiltro[];
  origenes: OpcionFiltro[];
}) {
  const [piel, setPiel] = useState<string | null>(null);
  const [paso, setPaso] = useState<string | null>(null);
  const [origen, setOrigen] = useState<string | null>(null);
  const [orden, setOrden] = useState<Orden>("criterio");
  const [masFiltros, setMasFiltros] = useState(false);

  const visibles = useMemo(() => {
    const filtrados = productos.filter(
      (p) =>
        (!piel || p.tipos_piel.includes(piel)) &&
        (!paso || p.categoria === paso) &&
        (!origen || p.origen === origen),
    );
    const orden_ = [...filtrados];
    // Se ordena por la BANDA, no por el precio relevado. Un orden por un número
    // que no se muestra —y que además está viejo— pone los productos en una
    // secuencia que la persona no puede verificar contra nada.
    const porVendidos = (a: Producto, b: Producto) =>
      (b.vendidos_aprox ?? 0) - (a.vendidos_aprox ?? 0);

    if (orden === "precio_asc") orden_.sort((a, b) => a.rango_precio - b.rango_precio);
    else if (orden === "precio_desc") orden_.sort((a, b) => b.rango_precio - a.rango_precio);
    else if (orden === "vendidos") orden_.sort(porVendidos);
    else
      // El mismo criterio con el que el motor arma la rutina, aplicado a la
      // grilla: si el sitio ordena la grilla por popularidad y la rutina por
      // criterio, son dos sitios distintos con la misma marca encima.
      orden_.sort(
        (a, b) =>
          (b.calidad_formula ?? 0) - (a.calidad_formula ?? 0) ||
          a.rango_precio - b.rango_precio ||
          a.id.localeCompare(b.id),
      );
    return orden_;
  }, [productos, piel, paso, origen, orden]);

  // Cuántos productos deja cada filtro, contando los otros filtros ya activos.
  // Robado de Ganga Hunter: saber qué hay detrás de un filtro antes de tocarlo
  // evita el toque a ciegas que devuelve cero.
  const contar = (campo: "piel" | "paso" | "origen", valor: string) =>
    productos.filter(
      (p) =>
        (campo === "piel" ? p.tipos_piel.includes(valor) : !piel || p.tipos_piel.includes(piel)) &&
        (campo === "paso" ? p.categoria === valor : !paso || p.categoria === paso) &&
        (campo === "origen" ? p.origen === valor : !origen || p.origen === origen),
    ).length;

  const limpiar = () => {
    setPiel(null);
    setPaso(null);
    setOrigen(null);
  };
  const hayFiltros = Boolean(piel || paso || origen);
  // Lo aplicado detrás del botón se nombra en el botón: plegado, un filtro
  // activo que no se ve es un catálogo que parece tener menos productos.
  const aplicadosPlegados = [
    pasos.find((o) => o.valor === paso)?.label,
    origenes.find((o) => o.valor === origen)?.label,
  ].filter((l): l is string => Boolean(l));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Fila titulo="tipo de piel" opciones={pieles} valor={piel} onChange={setPiel} contar={(v) => contar("piel", v)} />

        {/* En el celular, tipo de piel queda a la vista y paso y origen se abren
            con un botón. Con los tres abiertos, a 390×844 el primer producto
            empezaba en el píxel 811: la primera pantalla era sólo filtros.

            Baymard aconseja promover a la vista el filtro que casi todos
            necesitan, y acá ese es el tipo de piel, la primera pregunta del
            quiz. También observa que esconder los filtros en otra pantalla
            obliga a ir y volver de la lista, así que el resto se abre en el
            lugar, arriba de la grilla. En pantallas anchas los tres entran sin
            empujar los productos y van abiertos. */}
        <button
          type="button"
          aria-expanded={masFiltros}
          aria-controls="mas-filtros"
          onClick={() => setMasFiltros((v) => !v)}
          className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-niebla bg-porcelana px-4 font-body text-sm text-tinta sm:hidden"
        >
          {aplicadosPlegados.length ? `paso y origen · ${aplicadosPlegados.join(" · ")}` : "filtrar por paso y origen"}
          <span
            aria-hidden
            className={`font-etiqueta text-xs text-piedra transition-transform ${masFiltros ? "rotate-180" : ""}`}
          >
            ↓
          </span>
        </button>
        <div id="mas-filtros" className={`${masFiltros ? "flex" : "hidden"} flex-col gap-3 sm:flex`}>
          <Fila
            titulo="paso"
            opciones={pasos.filter((o) => !o.opcional)}
            aparte={{ titulo: "opcionales", opciones: pasos.filter((o) => o.opcional) }}
            valor={paso}
            onChange={setPaso}
            contar={(v) => contar("paso", v)}
          />
          <Fila titulo="origen" opciones={origenes} valor={origen} onChange={setOrigen} contar={(v) => contar("origen", v)} />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-y border-niebla py-3">
        <p className={`${ETIQUETA_BASE} text-tinta/70`}>
          {visibles.length} {visibles.length === 1 ? "producto" : "productos"}
          {hayFiltros ? (
            <button
              type="button"
              onClick={limpiar}
              className="ml-3 text-tinta underline underline-offset-2"
            >
              limpiar filtros
            </button>
          ) : null}
        </p>

        <label className={`flex items-center gap-2 ${ETIQUETA}`}>
          orden
          {/* 16 px: con menos, Safari en iPhone agranda la página al tocar el selector.
              Minúscula y sin aire entre letras: la etiqueta de al lado va en
              mayúscula espaciada y el selector no tiene que heredarla. El borde va
              en tinta/70 por lo mismo que el campo de mail (WCAG 1.4.11). */}
          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value as Orden)}
            className="border border-tinta/70 bg-porcelana px-2 py-1 font-body text-base normal-case tracking-normal text-tinta"
          >
            <option value="criterio">nuestro criterio</option>
            <option value="vendidos">más vendidos en Mercado Libre</option>
            <option value="precio_asc">precio: de accesible a premium</option>
            <option value="precio_desc">precio: de premium a accesible</option>
          </select>
        </label>
      </div>

      {visibles.length === 0 ? (
        <div className="bg-arena p-6 text-center">
          <p className="font-body text-tinta">
            No tenemos nada con esa combinación todavía.
          </p>
          <button
            type="button"
            onClick={limpiar}
            className="mt-3 inline-flex min-h-11 items-center font-body font-medium text-tinta underline underline-offset-4"
          >
            Ver todo el catálogo
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 xl:grid-cols-5">
          {visibles.map((p) => (
            <li key={p.id}>
              {/* Sin tarjeta: la foto sobre arena ya marca dónde empieza cada
                  producto, como en la grilla de Beauty of Joseon. */}
              <Link href={`/producto/${slugProducto(p)}`} className="flex h-full flex-col">
                {p.imagen_url ? (
                  <div className={`aspect-square w-full p-3 ${MARCO_FOTO}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.imagen_url}
                      alt={`${p.marca ?? ""} ${p.nombre}`.trim()}
                      loading="lazy"
                      className={FOTO_PRODUCTO}
                    />
                  </div>
                ) : (
                  <div className={`aspect-square w-full ${MARCO_FOTO}`} />
                )}

                {p.marca ? <span className={`mt-3 ${ETIQUETA}`}>{p.marca}</span> : null}
                <span className="mt-1 font-display text-base font-normal leading-snug text-tinta">
                  {p.nombre}
                </span>

                <span className="mt-auto flex flex-col items-start gap-1 pt-2">
                  <RangoPrecio rango={p.rango_precio} />
                  <PruebaSocial d={{ rating: p.rating, opiniones: p.opiniones }} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Fila({
  titulo,
  opciones,
  aparte,
  valor,
  onChange,
  contar,
}: {
  titulo: string;
  opciones: OpcionFiltro[];
  /** Un segundo grupo de la misma fila, con su propio rótulo. */
  aparte?: { titulo: string; opciones: OpcionFiltro[] };
  valor: string | null;
  onChange: (v: string | null) => void;
  contar: (valor: string) => number;
}) {
  const chip = (o: OpcionFiltro) => {
    const activo = valor === o.valor;
    const n = contar(o.valor);
    return (
      <button
        key={o.valor}
        type="button"
        aria-pressed={activo}
        // Un filtro que devuelve cero se muestra igual, apagado: esconderlo
        // haría que la lista de opciones cambie sola bajo el dedo.
        //
        // Apagado queda en 2,1:1, y está bien: WCAG 1.4.3 exime el texto de
        // un control inactivo. Por eso va con la variante `disabled:` y no
        // con una condición aparte: el contraste bajo sólo existe mientras
        // el botón está deshabilitado de verdad. `contraste.test.ts` no deja
        // pasar un texto por debajo del mínimo si no lleva esa variante.
        disabled={n === 0 && !activo}
        onClick={() => onChange(activo ? null : o.valor)}
        className={`group rounded-full border px-3 py-1.5 font-body text-sm transition-colors ${
          activo
            ? "border-tinta bg-tinta text-porcelana"
            : "border-niebla bg-porcelana text-tinta disabled:text-tinta/35"
        }`}
      >
        {o.label}
        {/* Porcelana entera, como la palabra: el activo va en tinta llena, no en
            terracota, que es sólo para comprar. */}
        <span className={activo ? "text-porcelana" : "text-piedra group-disabled:text-tinta/35"}> {n}</span>
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <p className={ETIQUETA}>{titulo}</p>
      <div className="flex flex-wrap gap-2">{opciones.map(chip)}</div>
      {aparte?.opciones.length ? (
        <>
          <p className={`mt-1 ${ETIQUETA}`}>{aparte.titulo}</p>
          <div className="flex flex-wrap gap-2">{aparte.opciones.map(chip)}</div>
        </>
      ) : null}
    </div>
  );
}
