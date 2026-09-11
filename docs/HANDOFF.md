# Handoff · Club de Piel

> Escrito el 2026-09-06 para continuar en otra sesión. Todo lo que dice acá está
> verificado contra el repo ese día, no de memoria. Los números que no pude
> verificar están marcados.

---

## 1 · Qué es esto

Landing de afiliados de skincare para Argentina. La persona responde 4 preguntas
y recibe una rutina armada con productos de Mercado Libre; cada botón lleva un
link de afiliado que paga comisión.

**El diferencial no es el catálogo, es el criterio.** Cualquiera lista productos.
Nosotros cruzamos los ingredientes activos de cada producto con los de los demás
para que la rutina no se contradiga a sí misma — que no haya dos exfoliantes sin
querer, que no se pague cuatro veces por la misma niacinamida, que un retinoide
no caiga la misma noche que un ácido.

El copy de la marca lo dice así: *"El problema no era el producto. Era cuál iba
con cuál."*

**Dos personas trabajando:** Ian (`iancitoprogramming`, dueño del repo) y quien
escribe estos handoffs. Ian se ocupa de marca, front, deploy y relevamiento;
esta línea de trabajo se ocupó del motor de compatibilidad, la investigación de
ingredientes y el herramental de auditoría.

---

## 2 · Dónde está todo

| | |
|---|---|
| Repo | `github.com/iancitoprogramming/skincare-afiliados` |
| Carpeta local de trabajo | `C:\Users\zxzxe\OneDrive\Desktop\Main Claude\club-de-piel-web` |
| Vault de Obsidian | `C:\Users\zxzxe\OneDrive\Desktop\Club de Piel\Organize` |
| Producción | `clubdepiel.store` (Ian migró desde vercel.app) |
| Permisos | La cuenta `WomenAre0bjects` **tiene push directo** al repo de Ian. Los PR van ahí, no a un fork — el fork existe pero GitHub le perdió la relación de parentesco (`fork: false`) y no sirve para PRs. |

**Node y npm existen** en la máquina (v24 / npm 11). Hay un warning permanente de
`esbuild` con `install-scripts` que es inofensivo: todo compila y testea igual.

---

## 3 · Estado verificado el 2026-09-06

```
tsc --noEmit      exit 0
npm test          101/101 en verde
npm run build     exit 0 · 69 páginas estáticas
npm audit         0 vulnerabilities
copy-verificar    45 productos, sin claims prohibidos
```

**Catálogo: 71 productos.**

- 25 activos (se muestran) · 46 apagados
- 69 con link de afiliado · 2 sin link
- **45 apagados esperan sólo precio e imagen**, nada más. Ya tienen link,
  categoría, tipos de piel, preocupaciones, activos mapeados y copy escrito.

### PRs

| | |
|---|---|
| #1, #2, #3 | **mergeados** |
| Sin mergear | El commit `2fd9e78` (`relevar-pendientes`) quedó en la rama `revision-catalogo` y **no llegó a main**. Ver §6: probablemente esté bien que así sea. |

---

## 4 · Lo que hay construido

### El motor de compatibilidad

Separa cuatro cosas que el folclore de "no mezclar" mete en la misma bolsa,
porque **cada una se arregla distinto**:

| Clase | Qué pasa | Cómo se arregla |
|---|---|---|
| **degradación** | Una molécula destruye a la otra | Separar AM/PM. Esperar no sirve |
| **pH** | Una necesita medio ácido, la otra neutro | Orden de aplicación |
| **irritación** | No hay química: hay barrera que no da abasto | Calendario, noches alternas |
| **redundancia** | Nada malo. Pagás dos veces lo mismo | Sacar productos |

Archivos:

- `src/engine/compatibilidad.ts` — el motor, agnóstico del nicho
- `src/niches/skincare/activos.ts` — ~50 activos, reglas, sinergias, **mitos**, y
  el mapa `ml_id → activos`
- `src/niches/skincare/matriz.ts` — la tabla pública se **deriva** de las mismas
  reglas, para que no pueda contradecir al motor
- `docs/COMPATIBILIDAD.md` · `docs/INGREDIENTES.md` — el criterio, con fuentes
- `docs/CALIDAD.md` — cómo se ordena · `docs/PRECIO.md` — por qué no hay precios

**El motor no sólo avisa: elige para no chocar.** Al armar la rutina prefiere,
dentro del mismo nivel de match, el producto que menos conflictos genera. La
regla que lo gobierna: *esquivar un conflicto nunca cuesta calidad de match.*

### El criterio de orden

Entre dos productos que sirven igual, cuál se muestra:

```
prioridad  →  calidad de fórmula  →  banda de precio  →  id
```

Los 72 activos del diccionario llevan su nivel de evidencia A–D en el campo
`nivelEvidencia`, tomado sección por sección de `INGREDIENTES.md`.
`src/engine/calidad.ts` lo convierte en un puntaje: cuenta una vez por familia
—cuatro fuentes de niacinamida no son cuatro beneficios— y cada familia
siguiente vale la mitad que la anterior, así que apilar renglones de INCI no
gana. Después resta el lastre: fragancia, aceites esenciales y alcohol denat,
pesados por cuánto tiempo quedan sobre la piel.

El `id` al final del desempate no es decoración: antes, cuando todo empataba,
decidía el orden del archivo. `docs/CALIDAD.md` tiene el cálculo, lo que se
midió al encenderlo y —importante— **lo que el número no mide**: el nivel de
evidencia es de la molécula, no del producto, y la concentración no se puede
puntuar sin inventarla.

### La investigación

`docs/INGREDIENTES.md` cubre los 114 tokens de activo/filtro/irritante que
aparecen en las listas INCI, **con escala de evidencia A–D explícita**. Desde el
2026-09-06 la escala está además **codificada**, y un test verifica que el
documento y el diccionario no se puedan separar.

> **Regla de la casa: en la landing sólo se afirma lo que está en A o B.**

Seis trampas que sólo se ven leyendo el INCI y que ningún envase declara:

1. **LRP Mela B3 lleva retinil palmitato** — un retinoide dentro de un sérum de
   niacinamida. Quien lo combine con un retinol usa dos sin saberlo.
2. **LRP Pure Vitamin C12 lleva ácido salicílico.**
3. **Eximia Hyalu-B lleva gluconato de cobre** — el metal que oxida al ascorbato.
4. **Eximia Hyalu-N** se vende como niacinamida y trae un complejo de AHA.
5. **Garnier Sérum Anti-imperfecciones** apila BHA + AHA + fítico + ascorbil
   glucósido + niacinamida.
6. **Los protectores con color NO son minerales** — el TiO₂ va como pigmento.
   *Excepción encontrada después:* el **Anthelios Ultra Fluido con Color**
   (`MLA16048263`) trae `titanium dioxide [nano]` **entre los filtros**. Es
   híbrido, no mineral limpio: lleva alcohol denat, así que no cierra el
   bloqueante B1.

### Herramental de auditoría

```bash
npm run auditar                  # recorre las 360 rutinas posibles
npm run auditar -- --proyectar   # como si los 71 estuvieran activos
npm run auditar -- --sin-evitar  # con el armado viejo, para medir la mejora
npm run huecos -- --proyectar    # qué conflicto NO se puede evitar y qué falta
npm run ranking-compra           # ordena candidatos de compra por impacto medido
npm run rendimiento              # qué aporta cada paso extra
npm run copy-verificar           # claims prohibidos en el copy de producto
npm run relevar-pendientes       # arma la lista de imagen y precio que falta
npm run relevar-aplicar          # la escribe de vuelta, derivando la banda
```

`npm run auditar` ahora incluye una tabla de **calidad de fórmula por categoría**:
quién gana adentro de cada paso y por qué, con el activo mejor respaldado y el
lastre que arrastra. Es lo que hay que mirar antes de tocar una `prioridad`.

---

## 5 · Decisiones tomadas — no reabrir

Estas se discutieron y se midieron. Si algo las contradice, es un error, no una
propuesta. (Las de Ian están en `docs/proyecto/06-ESTADO.md`; éstas son las de
esta línea de trabajo.)

| Decisión | Por qué |
|---|---|
| **Los tiers son 2, no 4** | Medido: el Tier 4 sumaba 3 pasos, **cero** puntos de cobertura del objetivo y 13× los conflictos |
| **Lo esencial son 3 pasos** | limpiador + hidratante + protector solar. La base ya cubre el objetivo en el 98% de los casos |
| **El tónico no es un paso** | Nunca es necesario. Salía primero en la lista de compras con el 25% de los conflictos, y la respuesta correcta era **sacar el paso**, no comprar otro tónico |
| **La doble limpieza tampoco** | Corroborado: Cleveland Clinic — *"Double cleansing is usually not necessary"*, y el sobrelavado rompe la barrera. La AAD recomienda **una** limpieza suave, dos veces por día. El origen del hábito es cultural, no clínico |
| **Orientación, no restricción** | Las carpetas dicen "ORIENTADOS A". Clasificación **inclusiva por defecto**: se excluye sólo con motivo de fórmula. Piel normal y mixta quedan en 46/46 |
| **Nada entra por inferencia** | Sin INCI verificado, la lista de activos va vacía. Una advertencia inventada cuesta lo mismo que un claim inventado |
| **Sin claims médicos** | Ningún producto "trata", "cura", "repara" ni "elimina". `npm run copy-verificar` lo valida |
| **El precio no se publica** | Mercado Libre prohíbe scrapear, la API pide OAuth y encima está retirando el campo `price`. Un precio fijo de catálogo miente justo sobre lo que la persona verifica en el clic siguiente. Se publica la banda cualitativa. Ver `docs/PRECIO.md` |
| **El orden es calidad + reputación, después precio** | El precio era un proxy de "cuál es mejor" porque no había con qué medir "mejor". Ahora lo hay. Ver `docs/CALIDAD.md` |

---

## 6 · El precio: decidido

**Cerrado el 2026-09-06. El detalle completo, con fuentes, está en `docs/PRECIO.md`.**

El pedido original era el correcto: hacía falta el precio fresco, porque un precio fijo de
catálogo no ve los descuentos y rompe la mecánica. Lo que no se puede es traerlo.

- Los Términos para Desarrolladores de Mercado Libre **prohíben el scraping** con todas las
  letras, y el `robots.txt` bloquea con `Disallow: /` a ClaudeBot, GPTBot y compañía.
- La API oficial pide OAuth, desde abril de 2025 ni la búsqueda anda sin token, y Mercado Libre
  está **retirando `price`, `base_price` y `original_price` de `/items`**. El camino legítimo
  apunta justo al campo que están desmantelando.
- El riesgo es asimétrico: un scraper detectado no rompe una feature, puede costar la cuenta de
  afiliados y con ella los 69 links.

**Se implementó la opción B: banda cualitativa** —accesible · equilibrado · premium— y el número
en pesos salió de las seis superficies donde estaba, empezando por la imagen de Open Graph. Las
bandas están medidas, no inventadas: sobre los 26 productos con precio relevado los tres grupos se
parten solos, sin superponerse.

`precio_ars` sigue guardado como dato de relevamiento (lo usa `npm run frescura`) pero no llega a
la pantalla, y `src/lib/precio.test.ts` falla si alguna vez vuelve. `npm run relevar-aplicar`
ahora escribe también `rango_precio`, derivado del precio con `bandaDePrecio()`.

## 7 · Lo próximo, priorizado

Los dos primeros del handoff anterior —decidir el precio y el ranking por calidad— están hechos.
Lo que queda:

1. **Relevar imagen y banda de los 45.** Es lo único que separa a esos productos de poder
   activarse: link, categoría, tipos de piel, preocupaciones, activos y copy ya los tienen.
   `npm run relevar-pendientes` arma la lista y `relevar-aplicar` la escribe de vuelta; ahora
   además deriva `rango_precio` del precio pegado, así que no hay que traducir a mano.
2. **Revisar los 13 que no gana nunca nadie en proyectado.** Con el criterio nuevo ninguno pierde
   por orden de archivo: pierden contra alguien de mejor prioridad o de mejor fórmula. La palanca
   es editorial —subirles `prioridad` o sacarlos—, y ahora `npm run auditar` imprime la tabla de
   calidad por categoría para decidirlo mirando números. Los tres casos que más conviene mirar
   están en `docs/CALIDAD.md` §5: los filtros solares se aplastan en una sola familia, un
   limpiador minimalista queda mal parado, y "verificamos y no tiene activos" puntúa igual que
   "no verificamos".
3. **Las pilas que subieron en proyectado.** Al preferir fórmulas con más activos bien
   respaldados, los avisos de redundancia suben (vitamina C 33 → 45, exfoliante 83 → 85). No es
   del puntaje: es que `armarRutinaEvitandoConflictos` es voraz y el hidratante se elige después
   del protector solar. Si se quiere corregir, la palanca es subir `nota` por encima de
   `-prioridad` en el desempate de ese armado — hoy está al revés a propósito y está documentado.
4. **Las compras que destraban compatibilidad**, medidas y ordenadas:
   bakuchiol (116 conflictos) → SPF mineral (17, pero es el único que destraba
   piel sensible) → ácido azelaico (44). **Ojo: un retinol "limpio" da −37,
   empeora** — sumar un cuarto retinoide agrega choques.
5. **Resolver la divergencia vault ↔ catálogo** (§8).

---

## 8 · Trampas conocidas

Cosas que ya mordieron. No repetirlas.

**El importador puede borrar los 73 links.** `productos.organize.ts` dice
"generado, no editar a mano" y **dejó de ser cierto**: tiene links, cuenta y
fecha de relevamiento cargados encima. La primera versión de la protección no
normalizaba **CRLF**, no reconoció un solo bloque, y regeneró el archivo dejando
**cero links** — sin un error, sin una advertencia. Ahora el importador arrastra
lo cargado a mano y **aborta** si reconoce menos links de los que hay en disco.

**El vault y el catálogo divergieron.** Cinco `ml_id` del catálogo no existen en
los `.md` de Obsidian (4 publicaciones reemplazadas + 1 producto agregado). Hoy
`npm run importar-organize` **aborta a propósito**. Se destraba actualizando la
URL en el `.md`, o moviendo el producto a `productos.ts`.

**Un merge de git "exitoso" puede producir texto mentiroso.** Al integrar la
primera rama, `config.ts` se auto-mergeó sin marcar conflicto y el quiz quedó
prometiendo "suma el tónico" cuando ningún tier lo tenía. Después de un merge
grande hay que leer los archivos que **ninguno de los dos lados** marcó.

**Cuidado con las sobre-detecciones del propio motor.** Aparecieron dos, y las
dos las encontró la auditoría, no la lectura:
- retinil palmitato marcado `soloNoche` hacía saltar un aviso en 96 rutinas
  contradiciendo al fabricante sobre un ingrediente que ni siquiera es el activo;
- el PHA contaba como carga exfoliante, así que "retinoide + PHA" —la
  combinación que este mismo proyecto recomienda para piel reactiva— disparaba
  un aviso de sobrecarga.

> Una regla que le pega a la recomendación que damos nosotros está mal escrita,
> no mal aplicada.

**El punto es separador de miles.** En `src/lib/relevamiento.ts` hay un test que
lo fija: un parser que lea `24.693` a la inglesa guarda **24,69**, y ese número
se ve perfectamente normal en un JSON. Nadie lo nota hasta que alguien compra.

**No correr `npm audit fix --force`.** Sube a Next 16 (breaking). El problema de
postcss ya se resolvió con `overrides` (PR #2, mergeado).

**Vitest no resuelve el alias `@/`.** No hay `vitest.config.ts`, así que el alias
sólo funciona para imports de TIPO —que TypeScript borra— y revienta en cualquier
import de valor. Por eso `activos.ts` puede hacer `import type … from
"@/engine/compatibilidad"` y `calidad.ts` tiene que hacer `import { calidadFormula }
from "../../engine/calidad"`. El error que tira (`Cannot find package '@/…'`) no
dice nada de esto y manda a buscar un archivo que existe.

**No correr `npm run build` con el server de dev levantado.** Los dos escriben
`.next` y el de dev queda pidiendo chunks que el build borró: todas las páginas
empiezan a tirar `MODULE_NOT_FOUND` sobre código que está perfecto. Se arregla con
`rm -rf .next` y levantándolo de nuevo, pero se pierden veinte minutos buscando un
bug que no existe.

---

## 9 · Cómo trabaja este usuario

- **Escribe en español rioplatense** y espera respuestas así.
- **Pide investigar y corroborar en internet contra las fuentes más rigurosas
  disponibles, siempre**, incluso lo que él mismo afirma. No responder de
  memoria sobre hechos verificables. Es un estándar permanente: las
  recomendaciones llegan a personas que van a actuar sobre ellas.
- **Corrige de fondo, no de forma.** Cuando dice "el tónico nunca es necesario"
  o "la doble limpieza nunca es necesaria", está cambiando el criterio de
  producto, no pidiendo un ajuste. Vale la pena medir el impacto antes y después.
- **Prefiere que se actúe.** Dice "hacelo" y espera el trabajo hecho y
  verificado, no un plan. Pero agradece que se le marque un blocker real antes
  de construir sobre él — como pasó con el scraping.

---

## 10 · Comandos para arrancar

```bash
cd "C:\Users\zxzxe\OneDrive\Desktop\Main Claude\club-de-piel-web"
git checkout main && git pull
npm install
npm test && npm run build
npm run auditar
```

Para retomar el commit sin mergear:

```bash
git log --oneline origin/main..revision-catalogo
```
