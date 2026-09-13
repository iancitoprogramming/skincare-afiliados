"use client";

import { useEffect, useRef } from "react";
import { FOTO } from "@/niches/skincare/foto";
import s from "./FondoMonte.module.css";

// ── El taquín ────────────────────────────────────────────────────────────────
// Una función de posición por banda y un seguidor con inercia que la persigue.
// Los puntos de descanso son donde sin() = 0: p = 0 (arriba de todo), ½ (las
// tarjetas centradas) y 1 (abajo de todo). Ahí las tres coinciden y la foto se
// reconstruye entera.
//
// `amp` es fracción del recorrido disponible, (ancho − 1) / 2 viewports. Con
// la foto a 2,2× eso son 60 vw, y la banda en foco viaja hasta ~50 vw.
const BANDAS = [
  { amp: -0.83, n: 1 }, // superior: a la izquierda
  { amp: 0.58, n: 1 }, // media: a la derecha, más lento
  { amp: -0.77, n: 2 }, // inferior: a la izquierda, el doble de rápido
];
const TAU = 0.1; // s · constante de tiempo del seguidor (arranque y frenado)
const QUIETA = 0.12; // cuánto se mueven las bandas que NO están en foco
const EMPUJON = 0.15; // corrimiento extra al entrar en foco, que vuelve solo
// Zoom y deriva del conjunto: es lo que hace que las tres ventanas se lean
// como un solo paisaje. Va sobre el contenedor, así las tres se mueven juntas.
// Máximo en las tarjetas, cero en los extremos. Los dos van con sin²(πp), y
// DERIVA ≤ ZOOM / 2 a propósito: el zoom deja ZOOM/2 de sobrante arriba y
// abajo en cada instante, y la deriva nunca lo supera. Con la deriva en sin()
// y el zoom en sin² asomaban 3–4 px de fondo abajo cerca de los extremos.
const ZOOM = 0.05;
const DERIVA = 0.02;

const columnas = () => matchMedia("(max-height: 500px) and (orientation: landscape)").matches;
const desktop = () => matchMedia("(min-width: 900px)").matches;
// Tiene que dar lo mismo que `--ancho` en el CSS. Si se cambia uno, el otro.
const ancho = () => (columnas() ? 2.2 : desktop() ? 1.8 : 2.2);

// Sin JS la página ya se ve bien: las capas quedan centradas y alineadas por
// CSS. Esto sólo agrega el movimiento, y se apaga solo donde no corresponde.
function sinMovimiento(): boolean {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean };
    deviceMemory?: number;
  };
  if (nav.connection?.saveData === true) return true;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2) return true;
  return false;
}

export function FondoMonte() {
  const fondoRef = useRef<HTMLDivElement>(null);
  const capas = useRef<(HTMLImageElement | null)[]>([null, null, null]);

  useEffect(() => {
    const fondo = fondoRef.current;
    const imgs = capas.current;
    if (!fondo || imgs.some((i) => !i) || sinMovimiento()) return;

    // Las tarjetas las renderiza la página (server component); acá sólo se
    // observan. Sin tarjetas el fondo igual se mueve, sin foco.
    const tarjetas = Array.from(document.querySelectorAll<HTMLElement>("[data-banda]"));
    const presentacion = document.querySelector<HTMLElement>("[data-presentacion]");

    let targetP = 0;
    let p = 0;
    let foco: number | null = null;
    let focoPuntero: number | null = null;
    let focoScroll: number | null = null;
    const w = [1, 1, 1];
    const kick = [0, 0, 0];
    let raf = 0;
    let last = 0;

    // Tres anclas: arriba de todo → 0, tarjetas centradas → ½, abajo de todo
    // → 1. Lineal entre medio. Así los descansos caen donde importan aunque el
    // cierre mida más de una pantalla o la barra del navegador cambie el alto.
    function progreso(): number {
      const max = document.documentElement.scrollHeight - innerHeight;
      if (max <= 0) return 0;
      const y = Math.min(max, Math.max(0, scrollY));
      if (!presentacion) return y / max;
      const centro = presentacion.offsetTop + presentacion.offsetHeight / 2 - innerHeight / 2;
      if (centro <= 0 || centro >= max) return y / max;
      return y <= centro ? (y / centro) * 0.5 : 0.5 + ((y - centro) / (max - centro)) * 0.5;
    }
    function focoPorScroll(): number | null {
      if (columnas()) return null; // las tres a la misma altura: manda el puntero
      const vh = innerHeight;
      let mejor: number | null = null;
      let dist = Infinity;
      tarjetas.forEach((t, i) => {
        const r = t.getBoundingClientRect();
        const d = Math.abs((r.top + r.bottom) / 2 - vh / 2);
        if (d < dist) {
          dist = d;
          mejor = i;
        }
      });
      return dist < vh / 3 ? mejor : null;
    }
    function setFoco(f: number | null) {
      if (f === foco) return;
      if (f != null) kick[f] = EMPUJON * Math.sign(BANDAS[f].amp);
      foco = f;
      tarjetas.forEach((t, i) => {
        t.dataset.foco = i === f ? "1" : "0";
      });
    }
    function despertar() {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    }
    function frame(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const k = 1 - Math.exp(-dt / TAU);
      p += (targetP - p) * k;
      let moviendo = Math.abs(targetP - p) > 1e-4;

      const eje = columnas() ? "Y" : "X";
      const unidad = eje === "X" ? fondo!.clientWidth : fondo!.clientHeight;
      const recorrido = ((ancho() - 1) / 2) * unidad;
      for (let i = 0; i < 3; i++) {
        const wT = foco == null ? 1 : foco === i ? 1 : QUIETA;
        w[i] += (wT - w[i]) * k;
        kick[i] += (0 - kick[i]) * k;
        if (Math.abs(wT - w[i]) > 1e-3 || Math.abs(kick[i]) > 1e-3) moviendo = true;
        const off = recorrido * (w[i] * BANDAS[i].amp * Math.sin(2 * Math.PI * BANDAS[i].n * p) + kick[i]);
        const v = off.toFixed(2);
        imgs[i]!.style.transform = eje === "X" ? `translate3d(${v}px,0,0)` : `translate3d(0,${v}px,0)`;
      }
      const cerca = Math.sin(Math.PI * p) ** 2;
      const zoom = 1 + ZOOM * cerca;
      const deriva = (-DERIVA * cerca * fondo!.clientHeight).toFixed(2);
      fondo!.style.transform = `translate3d(0,${deriva}px,0) scale(${zoom.toFixed(4)})`;

      raf = moviendo ? requestAnimationFrame(frame) : 0;
    }

    const onScroll = () => {
      targetP = progreso();
      focoScroll = focoPorScroll();
      setFoco(focoPuntero ?? focoScroll);
      despertar();
    };
    const onResize = () => {
      targetP = progreso();
      despertar();
    };
    const entrar = (i: number) => () => {
      focoPuntero = i;
      setFoco(i);
      despertar();
    };
    const salir = () => {
      focoPuntero = null;
      setFoco(focoScroll);
      despertar();
    };

    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize);
    const quitar = tarjetas.map((t, i) => {
      const e = entrar(i);
      t.addEventListener("pointerenter", e);
      t.addEventListener("pointerleave", salir);
      t.addEventListener("focusin", e);
      t.addEventListener("focusout", salir);
      return () => {
        t.removeEventListener("pointerenter", e);
        t.removeEventListener("pointerleave", salir);
        t.removeEventListener("focusin", e);
        t.removeEventListener("focusout", salir);
      };
    });

    // Arranca donde está el scroll (si se recarga a mitad de página, sin salto).
    targetP = progreso();
    p = targetP;
    focoScroll = focoPorScroll();
    setFoco(focoScroll);
    despertar();

    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
      quitar.forEach((q) => q());
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Orden en el DOM: inferior, media, superior. La de arriba se desvanece
  // sobre la de abajo, que en la costura es opaca (ver el CSS).
  const clases = [s.superior, s.media, ""];
  return (
    <div ref={fondoRef} className={s.fondo} aria-hidden="true">
      {[2, 1, 0].map((i) => (
        <div key={i} className={`${s.capa} ${clases[i]}`}>
          {/* Un <img> plano y no next/image: el archivo ya está optimizado al
              tamaño que se sirve (2400 px, WebP), tres etiquetas comparten una
              sola descarga, y el preload lo emite la página. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={(el) => {
              capas.current[i] = el;
            }}
            src={FOTO.archivo}
            alt=""
            decoding="async"
            fetchPriority={i === 0 ? "high" : "auto"}
          />
        </div>
      ))}
    </div>
  );
}
