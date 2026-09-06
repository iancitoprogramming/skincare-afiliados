# Catálogo

## Estado

**25 productos activos + 2 kits de compra única.** Los 27 con link que monetiza,
precio real, foto e imagen HD, y prueba social de Mercado Libre.

Un producto inactivo: The Ordinary Ácido Glicólico 7%, que quedó sin slot cuando
el exfoliante salió de las rutinas. Está cargado entero — alcanza con poner
`activo: true` y devolver el slot a `TIERS`.

### Por origen

| Origen | Productos | Marcas |
|---|---|---|
| Coreano | 11 | COSRX · Skin1004 · Beauty of Joseon · Mixsoon · TIRTIR |
| Europeo | 11 | ISDIN · CeraVe · La Roche-Posay · Vichy · Eucerin · NIVEA · Garnier · The Ordinary · L'Oréal |
| Nacional | 4 | Idraet · Lidherma · Cleanex · Dermaglós |

> Nota de taxonomía: CeraVe, The Ordinary y L'Oréal no son estrictamente
> europeas (US / Canadá). Quedaron en `europeo` por ser el balde de "no coreano,
> no nacional". Si el origen se le muestra al usuario, conviene renombrarlo
> "occidental" o abrir un cuarto valor.

## Forma de un producto

```ts
{
  id, ml_id,                    // ml_id es la clave de join con el vault de Alex
  nombre, marca, categoria, paso, momento,
  tipos_piel[], preocupaciones[],
  origen,                       // coreano | europeo | nacional
  apto_sensible,                // curado a mano, no derivado
  rango_precio, precio_ars,
  imagen_url,                   // cuadrada 640, para las cards
  imagen_hd,                    // proporción original hasta 1200, para diseño
  link_afiliado,                // meli.la — lo único que monetiza
  url_referencia,               // URL de browse, sólo para identificar
  por_que, como_usar,           // escritos de cero, nunca copiados de ML
  rating, opiniones, vendidos, vendidos_aprox, reputacion,
  prioridad, comodin, activo,
}
```

## Categorías

`limpiador_oleoso` · `limpiador` · `tonico` · `serum_activo` ·
`serum_secundario` · `contorno` · `hidratante` · `protector_solar` ·
`exfoliante` · `retinoide`

## Tipos de piel

`grasa` · `mixta` · `normal` · `seca` · `sensible`

## Huecos abiertos

| Hueco | Impacto |
|---|---|
| **Sin serum secundario ni retinoide** | Bloquean el Tier 4 entero |
| **Tónico: un solo producto**, y caro ($65.999) | Quien elige presupuesto bajo se lo lleva igual, marcado comodín |
| **Limpiador oleoso: un solo producto**, y coreano | Quien pide occidental se lo lleva marcado `otro_origen` |
| **Sin protector solar mineral** | Ver abajo |
| **Sin producto barato** | Falta limpiador y protector abajo de $35.000 |

### El tema del protector mineral

El vault de Obsidian tiene una carpeta llamada `03 - Protector solar mineral` y
una regla escrita: *"Protector químico → reemplazar por mineral"* para piel
sensible. Los tres protectores coreanos del catálogo son de **filtro químico**.

**Ian decidió marcarlos aptos**, verificado contra las páginas de los
fabricantes. Es una excepción consciente y está documentada en el código.

**Pero la contradicción real no es con el fabricante: es con la carpeta.** Si el
slot dice "mineral" y se sirve químico, el criterio contradicho es el que Club de
Piel publica. La salida limpia y gratis es **renombrar la carpeta** a "apto para
piel sensible", que es el criterio real.

## El pipeline de Alex

Alex trabaja en paralelo sobre el vault de Obsidian, con su propio parser
(`parse-catalog.mjs` + `catalog-overlay.json` → `products.json`).

**Cuidado con una trampa de ese archivo:** el campo se llama `affiliateUrl` pero
los valores son URLs de catálogo pelado, sin `matt_tool` ni `meli.la`. **No
monetizan.** Los links que sí pagan están en `productos.ts`, y la clave para
cruzarlos es `ml_id`.

Cosas del pipeline de Alex que conviene adoptar:

- **`sensitiveFlags` por ingrediente** (`bha-salicilato`,
  `aceite-esencial-tea-tree`) es mejor que nuestro booleano: dice *por qué* no es
  apto, y eso se puede mostrar.
- **Su vocabulario de `concerns`** es más rico: `barrera-danada`,
  `lineas-firmeza`, `grasa-brillo`, `rojeces-sensibilidad`, `proteccion-solar`.
- **Su regla de claims médicos** (I8) es lo mejor de sus documentos.

Dos cosas de sus documentos que **chocan con lo que está publicado** y hay que
resolver: dice que la landing no muestra precios (la nuestra sí) y que no se
hotlinkean imágenes de ML (la nuestra sí, aunque ya están las 26 descargadas en
`assets/productos/`).

### Dos formas de contar que no se contradicen

Los documentos de Alex dicen "12 de 115 slots cargados, 10%". Este proyecto dice
"Tiers 1 a 3 servibles". Las dos son ciertas: él cuenta piel × tier × paso en
carpetas, acá se cuenta si el motor puede armar una rutina completa.

## Cómo se carga un producto

1. Generar el link de afiliado en el panel de ML → shortlink `meli.la`
2. Abrir la publicación y anotar precio, rating, opiniones, ventas, reputación
3. Sacar la imagen del CDN en las dos variantes:
   - cuadrada: `D_Q_NP_2X_<base>-V.webp`
   - original: `D_NQ_NP_2X_<base>-F.webp`
4. Escribir `por_que` y `como_usar` **de cero**, sin copiar la ficha de ML
5. Decidir `tipos_piel`, `preocupaciones`, `origen`, `apto_sensible`, `prioridad`
6. `npm run check-links` y `npx tsx scripts/cobertura.ts`
