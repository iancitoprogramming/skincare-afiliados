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
npm test          65/65 en verde
npm run build     exit 0 · 69 páginas estáticas
npm audit         0 vulnerabilities
check-links       los 25 activos monetizan
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

**El motor no sólo avisa: elige para no chocar.** Al armar la rutina prefiere,
dentro del mismo nivel de match, el producto que menos conflictos genera. La
regla que lo gobierna: *esquivar un conflicto nunca cuesta calidad de match.*

### La investigación

`docs/INGREDIENTES.md` cubre los 114 tokens de activo/filtro/irritante que
aparecen en las listas INCI, **con escala de evidencia A–D explícita**.

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
```

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

---

## 6 · LA DECISIÓN ABIERTA: el precio

**Esto es lo primero que hay que resolver.** Quedó planteado y sin decidir.

### Lo que pidió el usuario

Un *pathway* de dos links: uno **no afiliado** para traer datos frescos de la
publicación (precio, descuento, reputación) y otro **de afiliado** para el botón
"Ver en Mercado Libre". El argumento es correcto y es el corazón del proyecto:

> *"Si llegáramos a poner un precio fijo de catálogo, no tendríamos acceso a los
> descuentos ni a las actualizaciones de precio. Eso rompería la mecánica
> fundamental."*

### El blocker que encontré

**Mercado Libre prohíbe scrapear, explícitamente**, en sus Términos para
desarrolladores: *"robots, harvesters, spiders, scraping u otra tecnología para
acceder al Contenido de Mercado Libre"*.

Y el camino oficial tampoco está abierto como esperábamos:

- La API exige **OAuth 2.0**; desde abril de 2025 ni la búsqueda anda sin token.
- ML está **eliminando `price` de `/items`** progresivamente.
- El `robots.txt` bloquea por completo a los bots de IA (`ClaudeBot`, `GPTBot`).

**Por qué importa más de lo que parece:** el activo del negocio es la cuenta de
afiliados. Un scraper detectado no rompe una feature — puede costar la cuenta, y
con ella los 73 links. Riesgo asimétrico.

### Las tres opciones

- **A · No mostrar precio.** Es lo que el proyecto ya había decidido en
  `ISSUES.md` §N2. El precio vive donde siempre está bien: en ML, a un clic.
- **B · Rango cualitativo.** El campo `rango_precio` (1-3) ya existe. Mostrar
  "accesible / equilibrado / premium". No caduca. **Recomendada.**
- **C · API oficial con OAuth.** Legítimo, pero necesita credenciales de ellos,
  refresco de token cada 6 h, y ML está desmantelando justo el campo que quieren.

### Consecuencias de la decisión

- **`precio_ars` se usa en 5 lugares de la UI**, incluido
  `/api/og/producto/[slug]` — **la imagen de Open Graph**. Pinterest cachea esas
  imágenes y no se regeneran solas: un descuento las deja mintiendo en el feed.
  **Ese caso hay que sacarlo elijan lo que elijan.**
- La herramienta `relevar-pendientes` / `relevar-aplicar` (commit `2fd9e78`, sin
  mergear) escribe `precio_ars` fijo — o sea, hace exactamente lo que el usuario
  no quiere. **Su mitad de imagen sigue siendo válida** (las fotos no cambian);
  la de precio depende de esta decisión. Está probada de punta a punta y tiene 9
  tests, así que se puede recuperar parcialmente.

---

## 7 · Lo próximo, priorizado

1. **Decidir el precio** (§6) y sacarlo de la imagen de OG.
2. **Ranking por calidad + reputación.** Es lo que quedó pedido y no empezado.
   Hoy `src/engine/respaldo.ts` gradúa la prueba social (opiniones + rating),
   pero **la calidad de fórmula no entra en ningún ranking**. La escala A–D está
   documentada en `INGREDIENTES.md` pero **sin codificar**: el motor no la puede
   usar. Habría que:
   - codificar el grado de evidencia en cada activo del diccionario;
   - derivar un score de calidad por producto (qué activos trae, con qué
     respaldo, penalizando fragancia/alcohol en leave-on/aceites esenciales);
   - combinarlo con el respaldo social en un criterio de orden explícito.

   Esto además arregla algo ya medido: **11 productos pierden siempre el
   desempate y nadie los ve**, incluido el SkinCeuticals C E Ferulic, que es el
   único producto del catálogo con una afirmación de nivel A.
3. **Relevar precio e imagen de los 45** (según lo que se decida en §6).
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
