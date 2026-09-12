# Handoff · Club de Piel

> Reescrito el 2026-09-12. Todo lo que dice acá está verificado contra el repo ese
> día, no de memoria. Reemplaza al handoff del 6/9, que quedó viejo en casi todo:
> decía 56 tests, 69 páginas y 46 links pendientes.

---

## 1 · Qué es esto

Landing de afiliados de skincare para Argentina. La persona responde el quiz y
recibe una rutina armada con productos de Mercado Libre; cada botón lleva un link
de afiliado que paga comisión.

**El diferencial no es el catálogo, es el criterio.** Se cruzan los activos de
cada producto con los de los demás para que la rutina no se contradiga: que no
haya dos exfoliantes sin querer, que no se pague cuatro veces la misma
niacinamida, que un retinoide no caiga la misma noche que un ácido.

| | |
|---|---|
| Repo | `github.com/iancitoprogramming/skincare-afiliados` |
| Carpeta local | `C:\Users\zxzxe\OneDrive\Desktop\Main Claude\club-de-piel-web` |
| Producción | `clubdepiel.store` |
| Vault de Obsidian | `C:\Users\zxzxe\OneDrive\Desktop\Club de Piel\Organize` |
| Permisos | La cuenta `WomenAre0bjects` tiene push directo. Los PR van al repo de Ian, no a un fork. |

---

## 2 · Estado verificado el 12/9/2026

`main`, ya con la auditoría del PR #14 mergeada:

```
tsc --noEmit        exit 0
npm test            116/116 en 14 archivos
npm run build       exit 0 · 175 páginas
npm run auditar     344/360 rutinas sin conflicto (95,6%) · 0 con "separar"
npm run cobertura   346 match · 2 sin preocupación · 72 fuera de banda
                    0 comodín · 0 no-apto-sensible · "catálogo redondo"
npm run cuentas     81 ítems · los 81 declaran maurobilat · exit 0
activos             73 de 79 entradas con fuente verificada
```

**Antes del #14, `main` medía 346/360 y 38 de 84 activos verificados.** Las dos
rutinas que bajan no son una regresión: aparecen porque la auditoría declaró
activos que antes estaban sin declarar —el conflicto ya estaba en el frasco, lo
que faltaba era que el motor lo viera—. Y el total de entradas baja de 84 a 79
porque cinco eran huérfanas, `ml_id` que ya no están en `productos.ts`; no se
quitó ningún activo.

**Ojo al medir:** cada número de acá se mide sobre el catálogo completo, que es
`productos.ts` **más** `productos.organize.ts`. `productos.ts` solo tiene 34 de
los 81 ítems, así que contar grepeando ese archivo da la mitad de la respuesta.

---

## 3 · Qué cambió desde el handoff anterior

Fueron ocho PR mergeados (#5 a #13). En orden de impacto:

**El scraping salió (#5).** `cuentas.ts` resolvía la cuenta de cada link siguiendo
el redirect de `meli.la` con un User-Agent falseado, y eso cae bajo la obligación
(e) del Programa de Afiliados. Ahora la cuenta **se declara** al cargar el link y
el script sólo audita. `sin-scraping.test.ts` impide que vuelva: distingue por
host, así que `api.mercadolibre.com` con OAuth está permitida y las páginas no.

**El presupuesto cede ante la piel y el objetivo (#9).** Era filtro duro y
`apto_sensible` se relajaba; ahora es al revés. Las bandas se mezclan dentro de
una rutina. Los pasos marcados "no apto para piel sensible" pasaron de 16 a 0.

**La popularidad dejó de clasificar y de ordenar (#11, #12).** Se retiraron las
etiquetas "muy probado / probado / poca prueba" —que salían sólo de la cantidad de
opiniones en ML— y el desempate por respaldo. El criterio quedó
`prioridad → calidad de fórmula → banda → id`. El rating y las ventas siguen a la
vista como dato atribuido a Mercado Libre.

**Hay CI (#6, #7).** No había nada corriendo `tsc`: un error de tipos vivió en
`main` sin que nada lo frenara. Ahora `npm test` es `tsc --noEmit && vitest run` y
un workflow corre instalar, tipos, tests, build, links y auditoría de cuentas en
cada push a main y cada PR.

**La sincronización con Supabase estaba rota (#10).** Diez campos del catálogo no
tenían columna, así que el upsert fallaba entero. Ver §5.

**El limpiador que faltaba ya estaba en el catálogo (#8).** `npm run huecos` pedía
comprar uno; el problema era que `candidatosDe` devuelve el nivel `match` en
exclusiva, y los tres limpiadores coreanos etiquetados para acné traían ácidos.
Etiquetar dos limpiadores limpios que ya estaban cerró el hueco sin comprar nada.

**Se auditó el catálogo (#13, #14).** Ver §4.

---

## 4 · La auditoría de productos

`docs/AUDITORIA-PRODUCTOS.md` es el registro. Cada entrada del mapa de activos
lleva un marcador —`[INCI]`, `[vault]` o `[pendiente]`— y `fuente-activos.test.ts`
falla si a alguna le falta.

**Por qué existe:** una lista de activos vacía y una sin verificar se ven idénticas
en el código y son opuestas. `Cleanex Free Gel` tenía la lista vacía y el
comentario "no verificado"; el motor lo trataba como limpio en 36 rutinas y el
INCI decía que trae fragancia.

**Lo más grave que encontró:** la Dermaglós Crema de Día FPS30 trae palmitato de
retinilo y fragancia, y el catálogo la usaba como paso de protector solar. Salió
del motor con `en_rutina: false`.

**Confirmó cinco de las seis trampas** de `INGREDIENTES.md` §10.3 contra el INCI:
Mela B3, Pure Vitamin C12, Eximia Hyalu-B, Eximia Hyalu-N y el sérum de Garnier.

### Las 6 que faltan, y por qué

Ninguna se puede cerrar a distancia. Necesitan el envase en la mano o migrar la
entrada a una ficha `/p/`:

| Producto | Qué falta |
|---|---|
| LRP Anthelios Oil Control | El `ml_id` es `MLAU` y la API responde 403. El INCI sin color trae `Parfum` y `Zinc PCA` que no están mapeados, y no trae los óxidos de hierro que sí lo están. |
| ISDIN Ureadin Fusion | **El más importante.** El mapeo declara ácido láctico y vitamina C pura que no aparecen en la parte visible del INCI. Si no estuvieran, sobra un exfoliante y una vitamina C. |
| Idraet Espuma Extra Suave | La marca no publica INCI. |
| Avène Hydrance SPF30 | Variante sin resolver; no es la *Rich*. |
| Detenage N | Panalab bloquea la lectura automática. |
| Eucerin DermoPure | Dos versiones; el nombre del catálogo no alcanza para decidir. |

---

## 5 · Lo que bloquea salir a vender

**1 · El tracking está apagado, y prenderlo tiene tres pasos previos.** Hoy no se
registra ningún clic. `/api/clicks` responde 204 con Supabase configurado o sin
configurar, así que desde afuera no se distingue. Verificado que producción sirve
el catálogo local, no el de Supabase.

Para prenderlo, en este orden:

1. Aplicar las migraciones `0001` a `0004` en Supabase.
2. `npm run sync` — necesita un `.env` con `NEXT_PUBLIC_SUPABASE_URL` y
   `SUPABASE_SERVICE_ROLE_KEY`. El script usa `dotenv`, que lee `.env`, **no**
   `.env.local`.
3. Cargar las dos variables públicas en Production **y redeployar**: según la doc
   de Vercel los cambios de variables sólo aplican a deploys nuevos.
4. Probar completando el quiz en producción: tiene que aparecer una fila en
   `sesiones`. Eso no genera ningún clic de afiliado.

**Consecuencia a tener presente:** una vez que Supabase sirva el catálogo, cada
cambio de catálogo necesita `npm run sync` o producción queda atrasada.

**2 · El check de Vercel falla en todos los PR**, desde antes de esta línea de
trabajo. El motivo apareció en el log: *"Git author WomenAre0bjects must have
access to the project on Vercel to create deployments"*. Es permisos, no código.
Lo gestiona Ian.

**3 · Pinterest**: falta el perfil business y reclamar el dominio
(`NEXT_PUBLIC_PINTEREST_VERIFY`), y revisar el firewall de Vercel antes de mandarle
la URL al crawler.

**Los Medios ya están declarados** en `maurobilat`: sitio, Instagram, TikTok,
YouTube, Pinterest y X. Facebook se descartó por decisión. Los 81 links salen de la
cuenta única y `npm run cuentas` sale 0.

---

## 6 · Decisiones tomadas — no reabrir

Las anteriores están en `docs/proyecto/06-ESTADO.md`. Las de esta línea de trabajo:

| Decisión | Por qué |
|---|---|
| **Nada de scraping a ML** | Obligación (e) del Programa. La API oficial con OAuth sí: es acceso autorizado por otro acuerdo |
| **La popularidad no clasifica ni ordena** | Las ventas no miden la calidad de una fórmula. Un producto excelente y desconocido perdía por desconocido |
| **El presupuesto cede ante la piel y el objetivo** | Hay pasos que no existen en banda accesible; dar algo que no sirve para ahorrar es peor |
| **No se agrega un `aceite_esencial` genérico** | Decisión del usuario. Los que tienen id propio —tea tree, romero, menta— sí se declaran |
| **Un producto entra por su fórmula, no por sus ventas** | Ver `04-CATALOGO.md` § *Antes de cargarlo* |
| **Sumar sin quitar** | Un activo se quita sólo cuando la fuente oficial demuestra su ausencia |

---

## 7 · Trampas conocidas

**Las variantes de una línea son la trampa más frecuente.** Pasó con Avène (*Rich*
contra *Légère*), Dermaglós (cuatro cremas FPS30, la nuestra era *Ultra Volumen*),
Eucerin (Tono Medio contra Toque Seco) y Anthelios (con color y sin color).
Preguntarle a la API oficial qué producto es resuelve la mayoría; cuando no se
puede, dejarlo pendiente en vez de adivinarlo.

**Las fórmulas cambian por región.** El Neutrogena Hydro Boost no lleva perfume en
España y sí en Latinoamérica. Usar la lista del mercado equivocado da el resultado
opuesto.

**Los `ml_id` que empiezan con `MLAU`** son de alcance del vendedor: la API
responde 403 para todo. Panalab, CosDNA y las páginas de Neutrogena Argentina
también bloquean la lectura automática.

**El importador puede borrar los links.** `productos.organize.ts` dice "generado,
no editar" y dejó de ser cierto. Ya abortó una vez dejando cero links. Hoy tiene
guarda, pero además **el vault y el catálogo divergieron**: 5 `ml_id` activos no
existen en los `.md` de Obsidian, así que `npm run importar-organize` aborta a
propósito.

**Vitest no resuelve el alias `@/`.** Sólo funciona para imports de tipo. En
código de valor hay que usar rutas relativas.

**No correr `npm run build` con el server de dev levantado.** Los dos escriben
`.next` y aparecen `MODULE_NOT_FOUND` sobre código que está bien.

**Detalle de herramienta:** encadenar dos o más heredocs en un solo comando de
bash falla con un error de sintaxis que no dice nada. Un heredoc por comando.

---

## 8 · Lo próximo, priorizado

1. **Prender el tracking** (§5). Es lo único que frena lanzar con medición.
2. **Leer el envase de los 6 productos** de §4, empezando por el ISDIN.
3. **La causa de fondo en el motor**: `candidatosDe` devuelve el nivel `match` en
   exclusiva aunque todo lo que contenga choque. Hoy lo compensan los datos, pero
   va a volver en otra categoría. Es un cambio en `recomendacion.ts` con su propio
   PR.
4. **Dato mal cargado**: el Skin1004 Tea-trica sigue marcado `apto_sensible: true`
   con tea tree en la fórmula. Salió del motor, pero la ficha lo muestra apto.
5. **Actualizar `06-ESTADO.md` y `COMPRAR.md`**, que siguen con números viejos y
   mandan a comprar cosas que ya no hacen falta.
6. **9 productos atados a un solo vendedor** (`docs/listados-atados.md`). Necesitan
   links nuevos generados desde la ficha `/p/`.
7. **2 vulnerabilidades moderadas** de `vitest`, sólo de desarrollo. El arreglo
   pide vitest 5, que es un salto mayor.
8. **UX**: sistema visual, mockups para las redes, carrusel y prueba social.

---

## 9 · Cómo trabaja este usuario

- **Escribe en español rioplatense** y espera respuestas así.
- **Pide investigar y corroborar contra las fuentes más rigurosas disponibles,
  siempre**, incluso lo que él mismo afirma. No responder de memoria sobre hechos
  verificables. Las recomendaciones llegan a personas que van a actuar sobre ellas.
- **Corrige de fondo, no de forma.** Cuando dice "la popularidad no mide calidad"
  está cambiando el criterio de producto, no pidiendo un ajuste. Conviene medir el
  impacto antes y después, con `auditar`, `huecos` y `cobertura`.
- **Prefiere que se actúe.** Dice "hacelo" y espera el trabajo hecho y verificado,
  no un plan. Pero agradece que se le marque un blocker real antes de construir
  sobre él.
- **Decide él las cuestiones de producto.** Medir y recomendar, sí; cambiar el
  criterio por cuenta propia, no.

---

## 10 · Comandos para arrancar

```bash
cd "C:\Users\zxzxe\OneDrive\Desktop\Main Claude\club-de-piel-web"
git checkout main && git pull
npm install
npm test && npm run build
npm run auditar
```

Herramental de medición:

```bash
npm run auditar      # las 360 rutinas, con conflictos por tipo
npm run huecos       # qué conflicto NO se puede evitar y qué falta
npm run cobertura    # pasos flojos, fuera de banda, comodines
npm run cuentas      # todos los links salen de maurobilat · exit 1 si no
npm run check-links  # los activos monetizan
npm run frescura     # qué datos están por vencer
```
