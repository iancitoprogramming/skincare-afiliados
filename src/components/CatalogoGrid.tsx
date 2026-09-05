"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Producto } from "@/engine/recomendacion";
import { slugProducto } from "@/engine/slug";
import { PruebaSocial } from "@/components/PruebaSocial";

// Filtrado en el cliente a propósito: el catálogo son decenas de productos, no
// miles. Traerlos todos y filtrar en memoria es instantáneo y no cuesta un
// round-trip por cada toque de filtro, que en mobile se siente.

type Orden = "relevancia" | "precio_asc" | "precio_desc";

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
  const [orden, setOrden] = useState<Orden>("relevancia");

  const visibles = useMemo(() => {
    const filtrados = productos.filter(
      (p) =>
        (!piel || p.tipos_piel.includes(piel)) &&
        (!paso || p.categoria === paso) &&
        (!origen || p.origen === origen),
    );
    const orden_ = [...filtrados];
    if (orden === "precio_asc") orden_.sort((a, b) => (a.precio_ars ?? 0) - (b.precio_ars ?? 0));
    else if (orden === "precio_desc") orden_.sort((a, b) => (b.precio_ars ?? 0) - (a.precio_ars ?? 0));
    else orden_.sort((a, b) => (b.vendidos_aprox ?? 0) - (a.vendidos_aprox ?? 0));
    return orden_;
  }, [productos, piel, paso, origen, orden]);

  const limpiar = () => {
    setPiel(null);
    setPaso(null);
    setOrigen(null);
  };
  const hayFiltros = Boolean(piel || paso || origen);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Fila titulo="tipo de piel" opciones={pieles} valor={piel} onChange={setPiel} />
        <Fila titulo="paso" opciones={pasos} valor={paso} onChange={setPaso} />
        <Fila titulo="origen" opciones={origenes} valor={origen} onChange={setOrigen} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-y border-niebla py-3">
        <p className="font-mono text-xs text-piedra">
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

        <label className="flex items-center gap-2 font-mono text-xs text-piedra">
          orden
          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value as Orden)}
            className="rounded-lg border border-niebla bg-porcelana px-2 py-1 font-mono text-xs text-tinta"
          >
            <option value="relevancia">más vendidos</option>
            <option value="precio_asc">precio: menor a mayor</option>
            <option value="precio_desc">precio: mayor a menor</option>
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
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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
                  <span className="font-mono text-[11px] leading-none text-piedra">{p.marca}</span>
                ) : null}
                <span className="font-display text-sm font-medium leading-tight text-tinta">
                  {p.nombre}
                </span>

                <span className="mt-auto flex flex-col gap-1">
                  {p.precio_ars ? (
                    <span className="font-mono text-sm text-tinta">
                      ${p.precio_ars.toLocaleString("es-AR")}
                    </span>
                  ) : null}
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
}: {
  titulo: string;
  opciones: OpcionFiltro[];
  valor: string | null;
  onChange: (v: string | null) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-mono text-xs text-piedra">{titulo}</p>
      <div className="flex flex-wrap gap-2">
        {opciones.map((o) => {
          const activo = valor === o.valor;
          return (
            <button
              key={o.valor}
              type="button"
              aria-pressed={activo}
              onClick={() => onChange(activo ? null : o.valor)}
              className={`rounded-full border px-3 py-1.5 font-body text-sm transition-colors ${
                activo
                  ? "border-terracota bg-terracota text-porcelana"
                  : "border-niebla bg-porcelana text-tinta"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
