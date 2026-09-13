"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Producto } from "@/engine/recomendacion";
import { slugProducto } from "@/engine/slug";
import { PruebaSocial } from "@/components/PruebaSocial";
import { RangoPrecio } from "@/components/RangoPrecio";

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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Fila titulo="tipo de piel" opciones={pieles} valor={piel} onChange={setPiel} contar={(v) => contar("piel", v)} />
        <Fila titulo="paso" opciones={pasos} valor={paso} onChange={setPaso} contar={(v) => contar("paso", v)} />
        <Fila titulo="origen" opciones={origenes} valor={origen} onChange={setOrigen} contar={(v) => contar("origen", v)} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-y border-niebla py-3">
        <p className="font-etiqueta text-xs text-piedra">
          {visibles.length} {visibles.length === 1 ? "producto" : "productos"}
          {hayFiltros ? (
            <button
              type="button"
              onClick={limpiar}
              className="ml-3 text-terracota underline underline-offset-2"
            >
              limpiar filtros
            </button>
          ) : null}
        </p>

        <label className="flex items-center gap-2 font-etiqueta text-xs text-piedra">
          orden
          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value as Orden)}
            className="rounded-lg border border-niebla bg-porcelana px-2 py-1 font-etiqueta text-xs text-tinta"
          >
            <option value="criterio">nuestro criterio</option>
            <option value="vendidos">más vendidos en Mercado Libre</option>
            <option value="precio_asc">precio: de accesible a premium</option>
            <option value="precio_desc">precio: de premium a accesible</option>
          </select>
        </label>
      </div>

      {visibles.length === 0 ? (
        <div className="rounded-2xl border border-niebla bg-gel/25 p-6 text-center">
          <p className="font-body text-tinta">
            No tenemos nada con esa combinación todavía.
          </p>
          <button
            type="button"
            onClick={limpiar}
            className="mt-3 font-body font-medium text-terracota"
          >
            Ver todo el catálogo
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {visibles.map((p) => (
            <li key={p.id}>
              <Link
                href={`/producto/${slugProducto(p)}`}
                className="flex h-full flex-col gap-2 rounded-2xl border border-niebla bg-gel/20 p-3 transition-transform active:scale-[0.99]"
              >
                {p.imagen_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.imagen_url}
                    alt={`${p.marca ?? ""} ${p.nombre}`.trim()}
                    loading="lazy"
                    className="aspect-square w-full rounded-xl bg-porcelana object-contain p-1"
                  />
                ) : (
                  <div className="aspect-square w-full rounded-xl bg-porcelana" />
                )}

                {p.marca ? (
                  <span className="font-etiqueta text-[11px] leading-none text-piedra">{p.marca}</span>
                ) : null}
                <span className="font-display text-sm font-medium leading-tight text-tinta">
                  {p.nombre}
                </span>

                <span className="mt-auto flex flex-col items-start gap-1">
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
  valor,
  onChange,
  contar,
}: {
  titulo: string;
  opciones: OpcionFiltro[];
  valor: string | null;
  onChange: (v: string | null) => void;
  contar: (valor: string) => number;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-etiqueta text-xs text-piedra">{titulo}</p>
      <div className="flex flex-wrap gap-2">
        {opciones.map((o) => {
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
                  ? "border-terracota bg-terracota text-porcelana"
                  : "border-niebla bg-porcelana text-tinta disabled:text-tinta/35"
              }`}
            >
              {o.label}
              {/* Porcelana entera: con /70 el número quedaba en 3,07:1 sobre el terracota. */}
              <span className={activo ? "text-porcelana" : "text-piedra group-disabled:text-tinta/35"}> {n}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
