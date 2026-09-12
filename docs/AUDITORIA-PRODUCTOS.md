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
| BoJ Ginseng Cleansing Oil | `MLA37240248` | **verificado** | Ginseng y tocoferol, como estaba. Pero el INCI trae aceites esenciales de salvia, artemisa y albahaca, y alcanfor, y **el diccionario no tiene identificador para ninguno**: el motor no los ve. Ver la decisión pendiente abajo. |
| Aveno Gel Crema Hidratante | `MLA22990183` | **corregido** | Sale `hialuronico`: **no está en el INCI** y estaba mapeado. Entran `manteca_karite` y `alantoina`. La `Hydroxyethyl Urea` no se mapea como `urea`: es un humectante derivado, no la urea que el diccionario gradúa con evidencia A. Sin fragancia. Está en 168 rutinas. |
| Haruharu Black Rice Soft Cleansing Gel | `MLA37826532` | **verificado** | Confirma el mapeo del catálogo: fermento de Aspergillus y ginseng. Sin fragancia, sin aceites, sin sulfatos. Está en 140 rutinas. |
| Kosmos Vitamina C Pura | `MLA45672941` | **verificado** | Once ingredientes, mapeo confirmado entero: ascórbico 15%, ferúlico 0,5%, tocoferol 1%, ceramida NP y D-pantenol. Confirma el ejemplo de `CALIDAD.md` §5. Está en 144 rutinas. |
| The Ordinary Niacinamida 10% + Zinc | — | **verificado** | Once ingredientes: niacinamida, zinc PCA y vehículos. Sin fragancia ni ácidos. Está en 102 rutinas. |
| Cetaphil Pro AD Restoraderm | — | **verificado** | Mapeo confirmado: karité, alantoína, niacinamida y tocoferol. Sin fragancia. El tensioactivo es trideceth sulfato, más duro que un cocoil isetionato, pero no hay activo al que apuntar. |
| Round Lab 1025 Dokdo Cleanser | — | **verificado** | Confirma hialurónico en tres formas, pantenol, alantoína y ceramida NP. **Trae además aceite de flor de manzanilla**, que el diccionario no puede nombrar. Está en 210 rutinas. |
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

**El diccionario no puede nombrar la mayoría de los aceites esenciales.** Modela
tres —tea tree, romero y menta— y nada más. Ya van dos productos afectados: el
aceite limpiador de Beauty of Joseon trae salvia, artemisa, albahaca y alcanfor, y
el Round Lab Dokdo —que está en 210 rutinas— trae aceite de flor de manzanilla. El
motor no los ve, así que las dos fórmulas le parecen limpias. Agregar un activo `aceite_esencial` genérico lo
arreglaría, pero cambiaría varios productos de una sola vez y afecta al cálculo de
lastre: es una decisión de criterio, no de carga de datos.

**El Skin1004 Tea-trica sigue marcado `apto_sensible: true` con tea tree.** Salió
del motor, así que hoy no se le ofrece a nadie, pero el dato sigue mal y la ficha
del producto lo muestra como apto.
