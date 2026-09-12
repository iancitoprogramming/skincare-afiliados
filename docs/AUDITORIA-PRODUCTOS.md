# Auditoría de productos

> Abierta el 11/9/2026. Registro de la verificación producto por producto: qué
> trae cada fórmula, contra qué fuente se confirmó y qué se corrigió.
>
> Existe porque el catálogo tenía listas de activos vacías que el motor leía como
> "no tiene nada", cuando en realidad querían decir "no miramos". Las dos cosas se
> ven igual en el código y son opuestas. Acá se distinguen.

---

## Por qué se audita todo, incluso lo que hoy no se recomienda

Un producto entra al catálogo **por su fórmula, no por cuánto se vende**. El
criterio completo está en `docs/proyecto/04-CATALOGO.md` § *Antes de cargarlo: por
qué entra*.

Se auditan también los 20 productos que hoy están fuera del motor
(`en_rutina: false`). No se recomiendan porque su fórmula choca con el resto del
catálogo **de hoy**; cuando entren los productos que les faltan como complemento,
varios pueden volver. Tener su fórmula verificada es lo que permite decidirlo con
datos en vez de volver a mirarlos de cero.

## Los cinco estados

| Estado | Qué significa |
|---|---|
| **verificado** | Se leyó el INCI de fuente oficial y se mapearon los activos. |
| **verificado vacío** | Se leyó el INCI y **no hay nada que declarar**. Distinto de no haber mirado. |
| **corregido** | La lista que tenía el catálogo estaba mal y se cambió. |
| **bloqueado** | La marca no publica INCI. Hace falta leer la etiqueta física. |
| **pendiente** | Falta resolver algo concreto, anotado en la fila. |

## Método

1. INCI de la **página oficial de la marca** o del prospecto del laboratorio. La
   ficha de Mercado Libre no sirve como fuente: sus atributos ya se demostraron
   poco confiables (ver el caso Libra en la sección de hallazgos).
2. Una **segunda fuente independiente** cuando el mapeo va a cambiar el catálogo.
3. Mapear sólo lo que el diccionario modela. Lo que aparece en el INCI pero no
   tiene activo al que apuntar —tensioactivos, por ejemplo— se anota en el
   comentario, no en la lista.
4. Medir el impacto con `npm run auditar`, `npm run huecos` y `npm run cobertura`
   antes y después.

---

## Registro

| Producto | `ml_id` | Estado | Qué se encontró |
|---|---|---|---|
| Cleanex Free Gel Limpiador | `MLA27603374` | **corregido** | Trae `Fragrance (Parfum)` y `Sodium Laureth Sulfate`. Estaba cargado como "no verificado" con lista vacía, así que el motor lo tomaba por limpio en 36 rutinas. Ahora declara `fragancia`. |
| LRP Toleriane Dermallergo Crema | `MLA19866311` | **verificado** | Sin fragancia, sin alcohol denat, sin ácidos. Se mapean `escualano` y `manteca_karite`. El `Citric Acid` va al final entre ajustadores y no se cuenta como exfoliante. |
| Vanicream Moisturizing Lotion | `MLAU3880810580` | **verificado vacío** | Vaselina, propilenglicol, alcohol ceteárico y emulsionantes. Fórmula deliberadamente mínima, nada del diccionario. |
| Garnier Agua Micelar Todo en 1 | `MLA20546060` | **verificado vacío** | INCI de siete ingredientes. Sin fragancia, sin ácidos. |
| Vanicream Gentle Facial Cleanser | `MLAU3382695636` | **verificado vacío** | Ya venía justificado en el código: tensioactivos suaves, nada que declarar. Falta citarle la fuente. |
| Idraet Espuma Extra Suave | `MLA21801426` | **bloqueado** | La marca no publica INCI en ninguna de sus páginas. Declara sólo principios activos botánicos: hamamelis, manzanilla, tilo y caléndula, más "sin sulfatos" e hipoalergénico. Hay que leer la etiqueta física. |
| Avène Hydrance SPF30 | `MLA67629151` | **pendiente** | Se descartó mapearle el INCI de la variante *UV Rich* —que trae `Fragrance (Parfum)`—. La ficha oficial de ML dice "Normal a sensible" y su descripción menciona **ácido hialurónico**, que el INCI de la Rich no contiene: no es esa variante. Falta el INCI de la que se vende acá. Mapear el de la Rich habría metido fragancia y filtros de otro producto. |
| COSRX Advanced Snail 92 All In One | `MLA45253335` | **verificado** | El mapeo que venía del vault era correcto y no se cambió: baba de caracol, pantenol, alantoína, adenosina e hialurónico. Sin fragancia ni ácidos. Es el producto que más aparece en el catálogo —376 rutinas sin conflicto—, así que confirmarlo era lo de mayor impacto posible. |
| Skin1004 Hyalu-Cica Water-Fit Sun Serum | `MLA24454808` | **verificado** | Confirma lo del vault y suma `tocoferol` y `adenosina`. Sin fragancia. Los cuatro filtros son orgánicos: el Methylene Bis-Benzotriazolyl es partícula orgánica microfina, **no** filtro mineral. |
| BoJ Relief Sun: Rice + Probiotics | `MLA21801065` | **verificado** | Lista completa: sin fragancia, sin alcohol denat, sin ácidos. Se suman `adenosina` y `ginseng`. La primera búsqueda devolvió la lista cortada en el ingrediente 33 de 42 —y la cola es donde suele ir la fragancia—, así que se buscó la completa antes de darlo por bueno. |
| BoJ Dynasty Cream | `MLA21179266` | **corregido** | El vault le puso `arroz_fermentado`, pero el INCI dice *Rice Bran Water*: agua de salvado, no un fermento. Sale ese activo y entran `escualano` y `adenosina`, que estaban en el INCI y faltaban. |
| Mixsoon Centella Cleansing Foam | `MLAU3453545171` | **verificado** | Confirma el mapeo del vault: trae salicílico. Los tensioactivos son suaves; lo que lo saca de las rutinas de acné es el ácido, no la base. |
| Skin1004 Centella Ampoule Foam | `MLA47129399` | **corregido** | Sale `aha_citrico`: el `Citric Acid` está en la posición 12, entre benzoato y cloruro de sodio, y la marca declara pH 5. Es ajustador, no exfoliante, y le sumaba carga que la fórmula no tiene. Tensioactivos suaves. |
| Skin1004 Tea-trica B5 Crema | `MLA37722163` | **verificado** | Tea tree dos veces —agua de hoja 94.000 ppm y aceite 300 ppm— más ácido mandélico. Se suman `hialuronico`, `alantoina` y `tocoferol`. Confirma por qué salió del motor, y deja a la vista que sigue marcado `apto_sensible: true` con tea tree adentro. |
| BoJ Ginseng Cleansing Oil | `MLA37240248` | **corregido** | Ginseng y tocoferol, como estaba, **más los cuatro que el diccionario no podía nombrar**: aceites esenciales de salvia, artemisa y albahaca, y alcanfor. Los cuatro activos se dieron de alta el 12/9 y el producto los declara. Salió de piel sensible. Ver *Los cuatro aceites del Beauty of Joseon*. |
| Aveno Gel Crema Hidratante | `MLA22990183` | **corregido** | Sale `hialuronico`: **no está en el INCI** y estaba mapeado. Entran `manteca_karite` y `alantoina`. La `Hydroxyethyl Urea` no se mapea como `urea`: es un humectante derivado, no la urea que el diccionario gradúa con evidencia A. Sin fragancia. Está en 168 rutinas. |
| Haruharu Black Rice Soft Cleansing Gel | `MLA37826532` | **verificado** | Confirma el mapeo del catálogo: fermento de Aspergillus y ginseng. Sin fragancia, sin aceites, sin sulfatos. Está en 140 rutinas. |
| Kosmos Vitamina C Pura | `MLA45672941` | **verificado** | Once ingredientes, mapeo confirmado entero: ascórbico 15%, ferúlico 0,5%, tocoferol 1%, ceramida NP y D-pantenol. Confirma el ejemplo de `CALIDAD.md` §5. Está en 144 rutinas. |
| The Ordinary Niacinamida 10% + Zinc | — | **verificado** | Once ingredientes: niacinamida, zinc PCA y vehículos. Sin fragancia ni ácidos. Está en 102 rutinas. |
| Cetaphil Pro AD Restoraderm | — | **verificado** | Mapeo confirmado: karité, alantoína, niacinamida y tocoferol. Sin fragancia. El tensioactivo es trideceth sulfato, más duro que un cocoil isetionato, pero no hay activo al que apuntar. |
| Round Lab 1025 Dokdo Cleanser | `MLA28943962` | **corregido** | Confirma hialurónico, pantenol, alantoína y ceramida NP. Traía además **aceite de flor de manzanilla** sin que el diccionario pudiera nombrarlo; el 12/9 se dio de alta `aceite_esencial_manzanilla` y el producto lo declara. Salió de piel sensible y sigue en el motor para las otras cuatro. Ver *El primer aceite esencial que faltaba*. |
| CeraVe Limpiador Hidratante | `MLA37598876` | **verificado** | Mapeo confirmado entero: ceramidas NP, AP y EOP, hialuronato, colesterol, fitoesfingosina y tocoferol. Sin fragancia ni ácidos. Está en 72 rutinas. |
| Avène Tolerance Control | `MLA23143346` | **verificado** | Catorce ingredientes: agua termal y escualano, confirmados. Sin fragancia y sin conservantes, por envase estéril. Está en 56 rutinas. |
| Haruharu Black Rice Pure Mineral SPF50 | `MLA2068351806` | **verificado** | Mapeo confirmado: óxido de zinc, niacinamida, hialuronato, ceramida y tocoferol. Confirma que el `Butyloctyl Salicylate` es emoliente y no salicílico. Es el único mineral del catálogo y está en 110 rutinas. |
| Dermaglós Crema de Día Ultra Volumen FPS30 | `MLA24692733` | **corregido** | Estaba mapeada como `filtro_quimico` a secas. El INCI —Andrómaco, confirmado en un retailer independiente— trae además **fragancia** y **palmitato de retinilo**: un retinoide escondido en lo que usamos como paso de protector solar. Entran también avobenzona, niacinamida, pantenol, alantoína, hialuronato y tocoferol. Está en 36 rutinas. Aparte del mapeo, la ficha de ML la vende como crema antiedad para 40+ y piel normal a seca, no como protector. |

---

## Hallazgos que cambian cómo trabajamos

**Una lista vacía no dice lo mismo que un INCI leído.** Cleanex figuraba como
"no verificado" con la lista vacía y el motor lo trataba igual que a un producto
sin nada. La distinción entre *verificado vacío* y *sin mirar* no existía en el
dato; por eso este registro la lleva aparte.

**Los atributos de Mercado Libre no sirven como fuente.** Buscando un limpiador
por la API oficial, el único candidato que pasaba el filtro "sin fragancia" de ML
—Libra Gel Limpiador— tenía `Fragrance` y DMDM Hydantoin en el INCI real. El
campo de ML mezcla "libre de alérgenos declarables" con "sin fragancia", que no
es lo mismo.

**Corregir un dato puede reabrir un hueco, y está bien.** Declarar la fragancia de
Cleanex bajó las rutinas sin conflicto de 352 a 346 y dejó 4 conflictos nuevos:
para piel grasa o mixta, objetivo acné, banda 2 y rama "prefiero lo de siempre",
Cleanex era el **único** limpiador candidato. El hueco ya existía; lo que no
existía era saberlo.

No se tapó etiquetando a Idraet para acné, que sería la salida fácil: es
justamente el producto cuyo INCI no se pudo verificar.

---

## Decisiones que la auditoría deja abiertas

**~~El diccionario no puede nombrar todos los aceites esenciales.~~ Cerrado el
12/9/2026.** Agregar un activo `aceite_esencial` genérico lo habría arreglado de
golpe, pero cambiaba varios productos de una vez y afecta al cálculo de lastre,
así que quedó descartado. El camino elegido fue **darle id a los que aparezcan de
verdad, de a uno**, y los dos productos que estaban en esta lista se cerraron el
mismo día: entró `aceite_esencial_manzanilla` por el Round Lab Dokdo, y después
`aceite_esencial_salvia`, `aceite_esencial_artemisa`,
`aceite_esencial_albahaca` y `alcanfor` por el Beauty of Joseon.

**Esto no clausura el problema, le cambia la forma.** El diccionario sigue
modelando sólo los aceites que aparecieron en un INCI del catálogo —ahora son
siete— y el que entre mañana con un aceite nuevo va a volver a parecerle limpio
al motor hasta que alguien lea su INCI. La diferencia es que ahora hay un
procedimiento en vez de una decisión pendiente: se le da id, se declara, y
`apto-sensible.test.ts` avisa solo a quién le cambia el veto.

> Las otras dos decisiones que esta sección dejó abiertas el 12/9 —si la
> fragancia veta para piel sensible, y si un extracto de hoja es el mismo activo
> que su aceite esencial— **se tomaron el mismo día**. Están abajo, en
> *Las dos decisiones de criterio del 12/9*.

---

## Las dos decisiones de criterio del 12/9

Las dos se resolvieron igual, y el argumento que decidió no fue de la
literatura: fue que **el catálogo ya tenía las dos decisiones tomadas de hecho, y
los tres productos en discusión eran las excepciones**. La evidencia externa
confirma la dirección, pero lo que la fijó fue la consistencia interna.

### 1 · La fragancia veta `apto_sensible`. Sí.

Lo que decidió: de los **8 productos del motor que declaran `fragancia`, 6 ya
estaban cargados `apto_sensible: false`**. Los 2 que no lo estaban eran el Cleanex
Free Gel y la Lidherma Hyaluronic 4D. O sea que no había dos políticas en
disputa: había una política y dos productos mal cargados, igual que el COSRX.

Y el diccionario ya lo decía por escrito en el campo `evidencia` de `fragancia`:
*"primera causa de dermatitis de contacto alérgica en cosmética. Para piel que
reacciona, es lo primero que conviene sacar"*.

| Producto | `ml_id` | Qué trae |
|---|---|---|
| Cleanex Free Gel Limpiador | `MLA27603374` | `Fragrance (Parfum)` en la posición 10, y es el **único** activo que declara. Tensioactivo: Sodium Laureth Sulfate. Su `por_que` decía "formulado para piel sensible"; se reescribió. |
| Lidherma Hyaluronic 4D Face Cream | `MLA19474747` | `Fragancia` **más cinco alérgenos de declaración obligatoria**: bencil salicilato, citronelol, limoneno, linalol e ionona. Es una crema que queda puesta. |

**El respaldo externo.** En el panel del North American Contact Dermatitis Group
2019-2020, la mezcla de fragancias I dio 12,8% de parches positivos y los
hidroperóxidos de linalol 11,1% —el cuarto alérgeno más frecuente de toda la
serie—, con los de limoneno en 3,5%. La Lidherma declara linalol y limoneno en la
etiqueta. La prevalencia en población general está entre 0,7% y 2,6%, y en
población testeada entre 5% y 11%.

**Lo que se consideró y no alcanzó para cambiar la decisión.** El Cleanex se
enjuaga, y eso cuenta: el reglamento europeo exige declarar los 26 alérgenos de
fragancia desde 0,01% en producto de enjuague y desde 0,001% en producto que
queda puesto, o sea que reconoce diez veces menos exposición. Pero diez veces
menos no es cero, y el catálogo tiene **13 limpiadores aptos sin fragancia, 4 de
ellos en banda 1**. Cuando la alternativa limpia es gratis, no hay nada que
compensar.

### 2 · Un extracto de hoja NO es su aceite esencial.

Lo que decidió: los otros tres productos del mapa que declaran un aceite esencial
apuntan a un **aceite que el INCI nombra**.

| Producto | Lo que dice el INCI | Mapeo |
|---|---|---|
| Celimax The Real Noni Energy Ampoule | `Rosmarinus Officinalis Leaf **Oil**` | `aceite_esencial_romero` |
| COSRX Low pH Good Morning | `Melaleuca Alternifolia Leaf **Oil**` | `aceite_esencial_tea_tree` |
| Skin1004 Tea-trica (los dos) | agua de hoja + **aceite** de hoja de tea tree | `aceite_esencial_tea_tree` |
| **TIRTIR Milk Skin Toner** | `Mentha Piperita Leaf **Extract**`, en la cola de 35 ingredientes | ~~`menta`~~ **sale** |

El TIRTIR era el único que apuntaba a un extracto. Y el diccionario **ya
distingue por forma y no por planta**: `hamamelis` tiene `carga: 0` con el
razonamiento escrito de que *"como agua o extracto sin alcohol es inofensivo; la
mala fama viene de las destilaciones con alcohol de los tónicos astringentes de
los 90"*. Aplicar el mismo criterio a la menta no es inventar una regla, es dejar
de aplicar dos.

**El respaldo externo.** En la evaluación del Cosmetic Ingredient Review sobre los
ingredientes derivados de *Mentha piperita*, un HRIPT con 2,5% de extracto de
menta dio negativo para irritación y sensibilización, y los casos clínicos
publicados son del **aceite** y de sus constituyentes. Las dos reservas del panel
son la pulegona —limitada a ≤1%— y el mentol como promotor de penetración de
otros activos. Ninguna de las dos es lo que declara este INCI.

**Ojo con lo que esta decisión NO dice.** No dice que el TIRTIR esté verificado
más allá de su INCI, ni toca el problema de al lado: **el diccionario sigue sin
poder nombrar la mayoría de los aceites esenciales**, y ésos son aceites de
verdad. El Round Lab Dokdo trae aceite de flor de manzanilla y el aceite limpiador
de Beauty of Joseon trae salvia, artemisa, albahaca y alcanfor; el motor no los
ve. Esa decisión sigue abierta y es la de arriba.

### El impacto de las dos, medido

```
                        antes    después
auditar, sin conflicto  344/360  344/360
auditar, con "separar"  0        0
cobertura, match        346      346
cobertura, no-apto-sens 0        0
huecos                  10       10
npm test                132      133
```

Cero, en todo lo que se mide. Los dos productos que salieron de la piel sensible
no dejaron ningún paso descubierto, y el TIRTIR es un tónico —categoría
opcional—, así que no entra en ninguna rutina. El único número que se movió es una
sinergia: `niacinamida-x-vitamina-c` pasó de 135 a 134 rutinas, porque en una
rutina de piel sensible cambió qué hidratante toca.

**El candado.** `apto-sensible.test.ts` ahora veta las dos familias y su lista de
excepciones quedó **vacía**. El TIRTIR quedó clavado del otro lado: hay un test de
que su mapeo no vuelve a declarar `menta`, para que cambiar el criterio tenga que
ser deliberado. Se verificó que los tres candados fallan de verdad volviendo a
poner los datos viejos.

---

## Tanda del 12/9/2026 — se auditó lo que queda

Quedan **6 entradas sin verificar de 79**, y ninguna se puede cerrar desde acá:
todas necesitan leer el envase o migrar la entrada a una ficha de catálogo `/p/`.

| Producto | Por qué no se pudo cerrar |
|---|---|
| LRP Anthelios Oil Control | El `ml_id` es `MLAU`, de alcance del vendedor, y la API responde 403. El INCI de la versión sin color trae `Parfum` y `Zinc PCA` que no están mapeados, y no trae los óxidos de hierro que sí lo están. |
| Idraet Espuma Extra Suave | La marca no publica INCI en ninguna de sus páginas. |
| Avène Hydrance SPF30 | La ficha oficial menciona hialurónico, que el INCI de la variante *Rich* no tiene: no es esa variante, y la que se vende acá no publica lista. |
| Detenage N | Panalab responde 403 a la lectura automática; las fichas de farmacia sólo dan activos con porcentaje. |
| Eucerin DermoPure | Dos versiones. El mapeo sirve para ambas porque el salicílico está en las dos; la concentrada suma glicólico, PHA, alcohol denat y fragancia. El nombre no alcanza para decidir. |
| ISDIN Ureadin Fusion | El INCI publicado está truncado y las bases que lo tienen responden 403 y 404. En la parte visible está la urea pero **no** el láctico ni la vitamina C que el mapeo declara. |

> El Neutrogena Retinol Boost quedó también marcado pendiente por una duda menor:
> la lista que se consiguió es la europea y no incluye tocoferol, que el mapeo sí
> declara. No se quitó porque la página argentina responde 403.

### Lo que enseñó esta tanda

**Las fórmulas cambian por región, y tomar la lista equivocada da el resultado
opuesto.** El Neutrogena Hydro Boost recarga no lleva perfume en España —y sí urea
y ceramida— pero la fórmula latinoamericana, que es la que se vende acá, sí lleva
`Parfum`. Lo mismo con el Garnier Agua Micelar: la página argentina declara "sin
perfume" y la lista local no tiene ni LHA ni zinc PCA, que el mapeo sí tenía.

**Las variantes de una misma línea son la trampa más frecuente.** Pasó con Avène
(*Rich* contra *Légère*), con Dermaglós (cuatro cremas FPS30 distintas, y la
nuestra resultó ser *Ultra Volumen*), con Eucerin (Tono Medio contra Toque Seco) y
con Anthelios (con color y sin color). En todos los casos la salida fue preguntarle
a la API oficial qué producto es, y cuando no se pudo, dejarlo pendiente.

**Sumar sin quitar.** Al verificar el Poremizing se reemplazó su mapeo asumiendo
que cuatro activos no existían en el diccionario; sí existían y el INCI los
confirmaba. Desde entonces la regla es sumar lo que falta y quitar sólo cuando la
fuente oficial demuestra la ausencia —como en el Garnier Agua Micelar, donde la
página del fabricante dice "sin perfume".


---

## Corrección del 12/9/2026 — `apto_sensible` contra el mapa de activos

La auditoría había dejado anotado que el Skin1004 Tea-trica estaba marcado
`apto_sensible: true` teniendo tea tree. Al ir a corregirlo aparecieron **tres**
productos activos en esa situación, no uno, y el peor no era el que estaba
anotado.

| Producto | `ml_id` | Estado | Qué pasó |
|---|---|---|---|
| COSRX Low pH Good Morning Gel Cleanser | `MLA11139349` | **corregido** | `apto_sensible: true` → `false`. Es el grave: `en_rutina` no estaba en `false`, así que el motor **sí** se lo servía a quien declaraba piel sensible. El INCI trae `Melaleuca Alternifolia (Tea Tree) Leaf Oil` y `Betaine Salicylate`, confirmado en dos fuentes. El comentario de su propio mapeo ya decía que el tea tree "lo saca de las rutinas de piel sensible" —la prosa y el dato decían cosas opuestas y ganaba el dato. |
| Skin1004 Tea-trica B5 Crema | `MLA37722163` | **corregido** | `apto_sensible: true` → `false`. Ya estaba fuera del motor, así que no afectaba rutinas, pero la ficha le decía "apto" a quien declara piel sensible. |
| TIRTIR Milk Skin Toner | `MLAU3481553718` | **pendiente, por criterio** | Declara `menta` por `Mentha Piperita Leaf Extract`. No se tocó: ver la decisión abierta sobre extracto contra aceite esencial. |

**El veto no es una regla nueva.** El diccionario ya clasifica los tres aceites
esenciales que modela con `grupos: ["irritante-potencial"]` y carga propia, y su
campo `evidencia` dice que son causa conocida de dermatitis de contacto. El
respaldo externo es de Groot & Schmidt, *Contact Dermatitis* 2016: el tea tree es
el aceite esencial con más reacciones alérgicas publicadas, con 0,1% a 3,5% de
parches positivos en testeo de rutina, y los sensibilizantes son los productos de
oxidación de sus monoterpenos. Lo que faltaba era que el dato dijera lo mismo que
la prosa.

**`tipos_piel` no se tocó, y es deliberado.** Ese campo es la orientación del
producto; `apto_sensible` es el veto por fórmula. Pueden discrepar y de hecho ya
discrepan en The Ordinary Niacinamida 10% y en el Detenage N. El que decide qué se
sirve es `apto_sensible`, que es el que filtra `elegirPaso`.

**Impacto medido, antes y después:**

```
                        antes    después
auditar, sin conflicto  344/360  344/360
auditar, con "separar"  0        0
cobertura, match        346      346
cobertura, no-apto-sens 0        0
cobertura, comodín      0        0
huecos                  3        3
```

Sacar el limpiador de las rutinas de piel sensible **no abrió ningún hueco**: el
catálogo ya tenía limpiadores aptos, que es justo lo que había resuelto el PR #8.
El costo de la corrección fue cero y el beneficio es que dejamos de afirmar algo
que el INCI contradice.

**Lo que queda como candado.** `src/niches/skincare/apto-sensible.test.ts` falla si
un producto activo marcado apto para piel sensible declara un aceite esencial, con
una lista de excepciones que exige motivo escrito —la misma forma que
`SIN_NIVEL_DE_EVIDENCIA`—. Se verificó que el test falla de verdad volviendo a
poner el dato viejo.

---

## El primer aceite esencial que faltaba · 12/9/2026

La auditoría había anotado que el diccionario no puede nombrar la mayoría de los
aceites esenciales, y que por eso el **Round Lab 1025 Dokdo Cleanser** —el
producto que más aparecía en el catálogo— le parecía limpio al motor. Se empezó
a cerrar por ahí.

**Qué declara el envase.** El INCI trae `Chamomilla Recutita Flower Oil`, a dos
tercios de una lista de 38 ingredientes. Es manzanilla **alemana**, no la romana
(*Anthemis nobilis*), y es un **aceite**, no un extracto: cae del lado que el mapa
ya venía aplicando. Verificado contra una base de INCI independiente y no contra
el listado que se había cargado a mano.

**Por qué la manzanilla cuenta, si su fama es de calmante.** Porque no es un solo
ingrediente. El **bisabolol** —grado C en `INGREDIENTES.md`— es un componente
aislado de la manzanilla y es lo que tiene algo medido. El **aceite** de la flor
arrastra además la fracción de oleorresina, y ahí están las lactonas
sesquiterpénicas, que son el alérgeno de la familia Compositae. La manzanilla
alemana es uno de los cinco extractos de la **mezcla Compositae** que va en varias
series base de parche, justamente por eso. De 129 pacientes sensibles a esa
mezcla, **83 —el 64%— dieron positivo al extracto de flor de manzanilla alemana**.
Y la reactividad cruzada entre lactonas sesquiterpénicas es alta, así que no
alcanza con evitar una planta de la familia.

Así que el activo entra como los otros tres: `familia: "aceite-esencial"`,
`grupos: ["irritante-potencial"]`, `carga: 1`, y en `SIN_NIVEL_DE_EVIDENCIA`,
porque no se le acredita beneficio: lo calmante que hay medido es del bisabolol,
que es otro ingrediente.

**El candado lo agarró solo.** No hubo que ir a buscar el producto: al declarar el
activo, `apto-sensible.test.ts` falló señalando
`MLA28943962 Dokdo Cleanser → aceite_esencial_manzanilla`. Es la primera vez que
ese test encuentra un caso que nadie había anotado antes, que es para lo que se
escribió.

### El impacto medido: cero, y la verificación de que es cero de verdad

```
                        antes    después
auditar, sin conflicto  344/360  344/360
auditar, por piel       2/8/3/3/0  2/8/3/3/0   (grasa, mixta, normal, seca, sensible)
auditar, con "separar"  0        0
cobertura, match        346      346
cobertura, no-apto-sens 0        0
cobertura, comodín      0        0
cobertura, fuera banda  72       72
huecos                  10       10
npm test                133      133
```

Que un producto que aparecía en 210 rutinas salga de piel sensible sin mover un
número parece raro, así que se verificó paso por paso. **Quedan 12 limpiadores
aptos para piel sensible**, en las tres bandas, y las 12 combinaciones de objetivo
y presupuesto siguen recibiendo uno de nivel `match`:

```
acne            $1·$2·$3  →  Haruharu Wonder Black Rice Gel        [match]
manchas         $1        →  Cetaphil Pro Ad Restoraderm           [fuera_de_presupuesto]
manchas         $2        →  CeraVe Gel Limpiador Espumoso         [match]
manchas         $3        →  Cetaphil Pro Ad Restoraderm           [match]
textura         $1·$2·$3  →  Haruharu Wonder Black Rice Gel        [match]
deshidratacion  $1        →  Haruharu Wonder Black Rice Gel        [match]
deshidratacion  $2·$3     →  CeraVe Limpiador Hidratante           [match]
```

El único `fuera_de_presupuesto` de esa tabla ya estaba antes: el total de pasos
fuera de banda no se movió de 72. Los 210 del Dokdo eran apariciones sumadas
sobre las cinco pieles, y el producto **sigue en el motor para las otras cuatro**.

**Sigue siendo un buen limpiador y eso no es un consuelo, es un dato:** los
tensioactivos son suaves de verdad —cocoil isetionato de sodio, metil cocoil
taurato, coco-betaína, cocoil glicinato de potasio—, y trae ceramida NP, pantenol,
alantoína, hialurónico en dos formas y beta-glucano, a pH 5,0-6,0. No ser apto
para una piel que reacciona es otra cosa que ser malo.

---

## Los cuatro aceites del Beauty of Joseon · 12/9/2026

El segundo y último producto de la lista de aceites que el diccionario no podía
nombrar. El **Ginseng Cleansing Oil** declaraba sólo ginseng y tocoferol, y su
propio comentario en el mapa decía que el INCI trae cuatro cosas más y que "no hay
activo al que apuntar, así que el motor no los ve y este producto le parece
limpio". Ahora los ve.

**Qué declara la página oficial de la marca**, en este orden y después del
tocoferol y del aceite de semilla de ginseng:

```
… TOCOPHEROL, PANAX GINSENG SEED OIL, SALVIA OFFICINALIS (SAGE) OIL,
ARTEMISIA VULGARIS OIL, OCIMUM BASILICUM (BASIL) OIL, CAMPHOR,
CORYLUS AVELLANA (HAZELNUT) SEED OIL …
```

Los cuatro van seguidos y a media lista: no son trazas del final.

### Una versión sin resolver, y por qué se declaró igual

Una base independiente publica una **"reformulación 2024"** con los tres aceites
pero **sin alcanfor**, y con el resto del orden casi idéntico. No se pudo
determinar cuál de las dos versiones se vende en Argentina — es la trampa de
siempre, la misma de Avène *Rich* contra *Légère*.

Se declaró el alcanfor, por dos motivos que se sostienen juntos: la página oficial
de la marca es la fuente primaria del método, y la regla de la casa es que **un
activo se quita sólo cuando la fuente oficial demuestra su ausencia**. Y el costo
de equivocarse es asimétrico: si la local es la reformulación, lo único que sobra
es un irritante declarado en un producto que no entra en ninguna rutina; si es la
otra y no lo declarábamos, le decíamos "apto para piel sensible" a alguien con un
alcanfor en el frasco. Vale confirmarlo con el envase en la mano.

### Los cuatro activos, y por qué el alcanfor no es un aceite esencial

| Activo | Familia | Por qué |
|---|---|---|
| `aceite_esencial_salvia` | `aceite-esencial` | Aceite esencial sin beneficio tópico documentado. Mismo trato que el romero. |
| `aceite_esencial_artemisa` | `aceite-esencial` | **El que más pesa.** Es una Compositae: su dermatitis se atribuye a las lactonas sesquiterpénicas, el mismo alérgeno que la manzanilla, y la reactividad cruzada dentro de la familia es alta. La EFSA además señaló como potencialmente adversos varios componentes de su aceite —alfa y beta tuyona, alcanfor y 1,8-cineol—. |
| `aceite_esencial_albahaca` | `aceite-esencial` | Aceite esencial sin beneficio tópico documentado. |
| `alcanfor` | **`contrairritante`** | No es un aceite esencial: es un compuesto único, así que tiene familia propia en vez de forzarlo. Es un contrairritante —produce frío o calor estimulando las terminaciones de temperatura, la misma lógica que el mentol—, el alcanfor puro puede dar sarpullido, ampollas y quemadura, hay dermatitis alérgica de contacto descrita, y se lo señala entre los monoterpenos responsables de la dermatitis por Compositae. |

La familia `contrairritante` se agregó a `FAMILIAS_QUE_VETAN` en
`apto-sensible.test.ts`: veta igual, pero la taxonomía no se fuerza para que el
veto funcione. `menta` se quedó en `aceite-esencial` porque ese id nombra también
al aceite de la planta y no sólo al compuesto; si algún día hace falta separarlos,
ahí está la costura.

### Un cero silencioso que este trabajo dejó a la vista

`CONFIG_CALIDAD.lastre` en `calidad.ts` es una tabla **por id**, no por familia.
Cuando se dio de alta `aceite_esencial_manzanilla` el día anterior, el activo no
entró en esa tabla, así que el Round Lab Dokdo declaraba el aceite pero **no
pagaba lastre**: el descuento fue cero y nada falló. Es el mismo tipo de error que
el proyecto ya sabe evitar del otro lado —`activos.test.ts` no deja que un activo
quede sin nivel de evidencia— pero faltaba la dirección de vuelta.

Se agregaron las cinco entradas que faltaban y un test nuevo:
*"todo irritante potencial pesa como lastre, sin ceros silenciosos"*.

### El impacto medido

```
                        antes    después
auditar, sin conflicto  344/360  344/360
auditar, por piel       2/8/3/3/0  2/8/3/3/0
cobertura, match        346      346
cobertura, no-apto-sens 0        0
huecos                  10       10
npm test                133      134
```

Cero en las rutinas, y era lo esperado: `limpiador_oleoso` está en
`CATEGORIAS_OPCIONALES` desde que la doble limpieza no se ganó su lugar, así que
este producto no entra en ninguna rutina armada. Lo que se arregló es lo que dice
su ficha.

**Donde sí se movió el número es en la calidad de fórmula**, que es exactamente
donde tenía que moverse:

| Producto | Antes | Después | Por qué |
|---|---|---|---|
| BoJ Ginseng Cleansing Oil | 1,5 | **0** | Los cuatro irritantes pesan 1,5 cada uno, por 0,25 de exposición de un producto que se enjuaga: 1,5 de lastre, que cancela justo el ginseng (grado C). Es el único `limpiador_oleoso` del catálogo, así que no cambia ningún orden. |
| Round Lab Dokdo Cleanser | 6,25 | **5,875** | La manzanilla ahora paga su lastre: 1,5 × 0,25. Es el cero silencioso de arriba, corregido. |

Que el enjuague pese un cuarto no es una gentileza: `CONFIG_CALIDAD.exposicion`
ya lo tenía resuelto para `limpiador` y `limpiador_oleoso` desde antes, con el
mismo argumento que `INGREDIENTES.md` §4.1 usa para el salicílico. Ajusta el
lastre, no el veto: un desmaquillante se masajea sobre la cara un rato largo antes
de emulsionar, y para una piel que reacciona no es el producto.
