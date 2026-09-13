# Monografía de ingredientes activos

> Qué hace cada activo del catálogo, con qué evidencia, a qué concentración, y con qué se lleva.
> Complementa a `COMPATIBILIDAD.md`: aquel dice qué se puede mezclar; éste dice qué hace cada cosa
> y cuánto podemos afirmarlo sin mentir.
>
> Cubre los **114 tokens de activo, filtro o irritante** que aparecen en las listas INCI de los 72
> productos del catálogo (26 del vault original + 46 del vault *Organize*). Los ingredientes de
> vehículo, emulsión y conservación quedan afuera a propósito: no cambian ninguna recomendación.
>
> Revisión: 2026-09-06.

---

## 0 · La escala de evidencia

Un documento que no distingue entre "esto tiene tres ensayos aleatorizados" y "esto lo dice el
fabricante" no sirve para decidir. Cada ingrediente lleva una letra:

| | Qué significa |
|---|---|
| **A** | Ensayos aleatorizados y controlados, replicados por grupos independientes, o revisión sistemática. Podemos afirmarlo. |
| **B** | Al menos un ensayo aleatorizado serio, o varios estudios controlados chicos que apuntan al mismo lado. Podemos afirmarlo con matices. |
| **C** | Estudios abiertos, in vitro con plausibilidad biológica fuerte, o consenso clínico sin ensayo formal. Se puede sugerir, no afirmar. |
| **D** | Mecanismo plausible y poco más: evidencia tópica escasa, chica, o sólo del fabricante. No se promete nada. |

**Regla de la casa:** en la landing sólo se afirma lo que está en A o B. Lo C y D puede estar en la
fórmula y mencionarse como acompañamiento, pero nunca como el motivo para comprar.

Segunda regla, y es la que más nos va a doler: **el nivel de evidencia de una molécula no es el
nivel de evidencia de un producto.** El retinol tiene evidencia A; una crema con retinol al 0,01%
en un envase transparente no hereda esa A. Donde el producto concreto no permite sostener la
afirmación, se dice.

> **Esta escala está codificada desde el 2026-09-06.** Cada activo de
> `src/niches/skincare/activos.ts` lleva su letra en el campo `nivelEvidencia`, y el motor la usa
> para desempatar entre productos que sirven igual. Un test verifica que ningún activo se quede sin
> letra —o sin una exención escrita— y fija los grados de las secciones que sostienen afirmaciones
> del sitio, así que **cambiar una letra acá obliga a cambiarla allá, y viceversa.** Cómo se
> convierte en un orden está en `docs/CALIDAD.md`, con la segunda regla de arriba puesta como
> límite explícito del cálculo.

---

## 1 · Renovadores

### 1.1 · Retinol · **A**

**Qué es.** Vitamina A en su forma alcohol. La piel la convierte en dos pasos —retinol →
retinaldehído → ácido retinoico— y recién el ácido retinoico se une a los receptores nucleares que
disparan el efecto. Cada conversión pierde material: por eso el retinol es varias veces menos
potente que la tretinoína a igual concentración, y también por eso irrita menos.

**Qué hace.** Aumenta el recambio epidérmico, estimula síntesis de colágeno, dispersa gránulos de
melanina y normaliza la queratinización del folículo. Es el activo cosmético con más respaldo para
fotoenvejecimiento, y de los pocos donde "antiarrugas" no es marketing.

**Concentración.** 0,1% a 1%. Por debajo de 0,1% el efecto es dudoso. La mayoría de las marcas no
declara el porcentaje, y eso ya es información.

**Lo que hay que decirle a la gente.** El período de adaptación es real: descamación y sequedad las
primeras semanas. Dos noches por semana durante dos semanas, después tres. La constancia a lo largo
de meses ES el resultado; el abandono en el primer mes es el modo de falla más común.

**Combina con.** Niacinamida (baja la irritación, evidencia B). Ceramidas y pantenol. **Separar de:**
peróxido de benzoilo en la misma aplicación (degradación, A), exfoliantes ácidos la misma noche
(irritación acumulada, C), vitamina C pura en la misma aplicación (irritación, C).

**Contraindicado.** Embarazo y lactancia, por precaución. Durante isotretinoína oral.

**En el catálogo:** Neutrogena Retinol Boost · Eximia Hyalu-R · La Roche-Posay Retinol B3.

---

### 1.2 · Retinil palmitato · **C**

**Qué es.** Éster de retinol. Necesita **tres** conversiones para llegar a ácido retinoico, así que
es el retinoide más débil de la escala.

**Por qué importa igual.** Porque permite decir "con retinol" en el frente del envase sin el costo
de irritar — y porque **aparece escondido en productos que nadie clasifica como retinoide**.

> **Hallazgo del catálogo.** Los dos sérums **La Roche-Posay Mela B3** se venden como sérums de
> niacinamida antimanchas y llevan retinil palmitato. Alguien que use Mela B3 de noche y además un
> sérum de retinol está usando dos retinoides sin saberlo. El motor lo detecta y lo avisa; a ojo,
> nadie lo ve.

**En el catálogo:** LRP Mela B3 (×2) · Eximia Hyalu-R · LRP Retinol B3.

---

### 1.3 · Bakuchiol · **B**

Extracto de *Psoralea corylifolia*. No es un retinoide: activa vías parcialmente superpuestas. Un
ensayo aleatorizado a doble ciego, 44 participantes, 12 semanas, comparó bakuchiol 0,5% dos veces
por día contra retinol 0,5% una vez por día: mejoras equivalentes en arrugas e hiperpigmentación,
con menos descamación y ardor. Es un solo estudio, chico, pero del tipo correcto.

**Para quién.** Piel que no tolera retinoides, y embarazo — aunque acá conviene ser prudente: la
ausencia de señal de daño no es lo mismo que evidencia de seguridad, y no hay datos en embarazadas.

**En el catálogo:** ninguno. **Es un hueco.**

---

### 1.4 · Adapaleno · **A** · (no está en el catálogo)

Retinoide sintético de tercera generación. Se documenta acá porque es la excepción que ordena todo
el capítulo de incompatibilidades: **es fotoestable y no se degrada con peróxido de benzoilo**. Si
alguien necesita retinoide y peróxido juntos, es la respuesta.

---

## 2 · Antioxidantes y vitamina C

### 2.1 · Ácido L-ascórbico (vitamina C pura) · **A**

**Qué es.** La forma activa, sin conversión previa. También la más inestable: se oxida con aire, luz,
calor y metales de transición.

**Qué hace.** Cofactor obligatorio de las enzimas que hidroxilan prolina y lisina en la síntesis de
colágeno — no es un "estimulante" de colágeno, es una pieza sin la cual la reacción no ocurre.
Además es antioxidante sacrificial (se oxida antes que tu piel) e inhibe tirosinasa.

**Concentración y pH.** 10–20%. Necesita **pH ≤ 3,5** para estar protonada y atravesar el estrato
córneo; por encima de eso se ioniza y no entra. Es la razón por la que un sérum de vitamina C pura
pica y uno con derivado no.

**La fórmula que definió el rubro.** 15% de ascórbico + 1% de alfa-tocoferol + 0,5% de ácido
ferúlico: más del 90% del activo intacto tras un mes a 45 °C, y fotoprotección de ~4× a ~8× medida
por eritema y células de quemadura solar.

> **El catálogo tiene la fórmula original.** **SkinCeuticals C E Ferulic** es exactamente eso, en una
> lista de 12 ingredientes sin fragancia. **Kosmos Vitamina C Pura** replica el trío y suma ceramida.
> Son los dos productos del catálogo cuya afirmación principal es de nivel A.

**Cómo saber si se oxidó.** Vira a amarillo, después a naranja oscuro. Ahí ya no sirve.

**Separar de:** peróxido de benzoilo (A), cobre (B in vitro). Cuidado con retinoide y con exfoliantes
en la misma aplicación (C, irritación).

**En el catálogo:** SkinCeuticals C E Ferulic · Kosmos Vitamina C Pura · LRP Pure Vitamin C12 ·
Vichy Liftactiv Supreme 16% · (trazas en Isdin Ureadin y Neutrogena Retinol Boost, ahí como
antioxidante de fórmula, no como activo).

> **Ojo con el LRP Pure Vitamin C12:** además del ascórbico al 12% trae **ácido salicílico, alcohol
> denat y fragancia**. Es un sérum de vitamina C que también exfolia. No es un defecto, pero cambia
> con qué se puede combinar y a quién se le puede ofrecer.

---

### 2.2 · Ascorbil glucósido · **B**

**Qué es.** Vitamina C unida a una glucosa. Estable a pH neutro, no irrita.

**El matiz honesto.** Es una prodroga: necesita que la alfa-glucosidasa de la piel la corte para
liberar ascórbico. Esa conversión es real y está demostrada en explantes de piel humana, pero es
**enzima-dependiente, variable entre personas e incompleta**. Los estudios de absorción muestran que
la cantidad de ascórbico que queda en piel es menor que aplicando ascórbico directo.

**Traducción práctica.** Es la opción sensata para piel reactiva y para fórmulas que combinan muchas
cosas. No es equivalente a un 15% de ascórbico puro, y decir que sí sería sobrevender.

**En el catálogo:** L'Oréal Revitalift Glass Skin · L'Oréal Revitalift Hialurónico · Garnier (varios) ·
Garnier Super UV.

---

### 2.3 · Vitamina E (tocoferol) · **A** en combinación, **C** sola

Antioxidante liposoluble. Su papel mejor documentado no es en solitario sino **estabilizando y
potenciando a la vitamina C**: en combinación, la acción de la C se potencia varias veces.

**En el catálogo:** 12 productos.

### 2.4 · Ácido ferúlico · **B**

Antioxidante vegetal. Pese al nombre **no exfolia y no es un ácido de los que bajan el pH para
descamar**. Su función documentada es estabilizar la solución de C+E y duplicar su fotoprotección.

**En el catálogo:** SkinCeuticals C E Ferulic · Kosmos · Eximia Hyalu-R.

### 2.5 · Carnosina · **D** · Noni · **D** · Ginseng · **D**

Antioxidantes con plausibilidad y poca evidencia tópica propia. Acompañan; no son motivo de compra.

---

## 3 · Despigmentantes

### 3.1 · Niacinamida · **A**

**Qué es.** Vitamina B3, forma amida. El activo más versátil y mejor tolerado que existe, y por eso
está en todo — 13 productos del catálogo la traen.

**Qué hace, por mecanismo separado:**

| Efecto | Mecanismo | Evidencia |
|---|---|---|
| Manchas | Frena la transferencia del melanosoma del melanocito al queratinocito | **A** |
| Barrera | Aumenta síntesis de ceramidas y de filagrina | **A** |
| Sebo y poros | Reduce producción de sebo | **B** |
| Rojeces | Antiinflamatorio | **B** |
| Arrugas finas | — | **C** |

**Concentración.** 2–5% cubre casi todo. Por encima de 5% no hay evidencia de más beneficio y sí más
reportes de rubor pasajero. **El 10% es un número de marketing**, no un umbral fisiológico.

**Se lleva bien con todo.** Incluyendo vitamina C (ver `COMPATIBILIDAD.md` §1.1) y retinoides — con
los que además tiene sinergia documentada: baja la irritación y por lo tanto el abandono.

**El problema real de la niacinamida no es un conflicto: es la redundancia.** Está en el limpiador,
el sérum, la crema y el protector. En la auditoría del catálogo anterior, la acumulación de
niacinamida en 3 o más productos aparecía en el 19,6% de las rutinas.

---

### 3.2 · Melasyl (2-mercaptonicotinoil glicina) · **B**

**Qué es.** Molécula nueva de L'Oréal, resultado de una búsqueda larga.

**Por qué es interesante.** Tiene un mecanismo distinto del de casi todos los despigmentantes: **no
inhibe la tirosinasa**. Actúa aguas abajo, capturando la dopaquinona —un intermediario— antes de que
polimerice en melanina. Eso importa porque los inhibidores de tirosinasa comparten un techo de
eficacia y unos efectos adversos; una vía distinta puede sumarse en vez de competir.

**Evidencia.** Un ensayo aleatorizado a 3 meses comparando un sérum con 2-MNG contra **hidroquinona
al 4%** en melasma facial. La hidroquinona es el comparador exigente del rubro, no un placebo.

**En el catálogo:** LRP Mela B3 (×2), junto a niacinamida.

---

### 3.3 · Ácido tranexámico · **B**

**No es un ácido exfoliante.** No baja el pH, no descama, no cuenta para la carga de exfoliación. Es
un análogo de la lisina que interfiere con la vía plasminógeno-plasmina, por la que el queratinocito
estimulado por UV le pide pigmento al melanocito.

**Concentración tópica.** 2–5%. Hay ensayos de 5% tópico con eficacia comparable a hidroquinona al
3%, y trabajos combinándolo con niacinamida con reducción del índice de melanina a 4 y 8 semanas.

**Por qué nos importa.** Es el mejor activo para melasma **sin costo de irritación**, que es
exactamente lo que necesita el melasma — un cuadro que la exfoliación agresiva suele empeorar.

**En el catálogo:** sólo Eximia Hyalu-N, y ahí acompañado de un complejo de AHA que va justo en la
dirección contraria. **Un sérum de tranexámico limpio es un hueco.**

---

### 3.4 · Fenetil resorcinol · **B** · Alfa-arbutina · **B** · Tiosulfato de sodio · **D**

Inhibidores de tirosinasa. El fenetil resorcinol es potente para su concentración y bastante bien
tolerado. El tiosulfato acompaña; solo, poca evidencia propia.

### 3.5 · Ácido azelaico · **A** · (no está en el catálogo)

Una revisión sistemática lo respalda para acné, rosácea y melasma. Al 15–20% reduce lesiones
inflamatorias de forma comparable a un retinoide tópico, con mejor tolerabilidad en varios estudios;
al 20% mostró eficacia similar a hidroquinona en melasma. Tolera la compañía de casi todo y es
**compatible con el embarazo**.

> **Sigue siendo el hueco #1 de eficacia del catálogo.** Es el único activo que cubre cuatro
> problemáticas a la vez y no choca con nada. Con 72 productos cargados, no hay ninguno.

---

## 4 · Exfoliantes

### 4.1 · Ácido salicílico (BHA) · **A**

Liposoluble: es el único exfoliante que entra al poro, que es exactamente por lo que sirve para
granitos y comedones. Además es antiinflamatorio (es un pariente de la aspirina).

**Concentración.** 0,5–2%. **El vehículo manda tanto como el porcentaje:** en un limpiador que se
enjuaga a los 30 segundos el efecto es una fracción del que tiene en un sérum que queda puesto.

**En el catálogo:** 9 productos, la mayoría limpiadores.

---

### 4.2 · LHA / capriloil salicílico · **B**

Éster del salicílico con una cadena grasa de 8 carbonos. Más lipofílico, molécula más grande, y
penetración unas **cinco veces más lenta**: se queda en el estrato córneo y descama célula por
célula en vez de actuar en bloque.

**La consecuencia va para los dos lados.** Irrita bastante menos —el panel de revisión lo clasifica
como no sensibilizante, con menor irritación que glicólico y salicílico— y por lo mismo **rinde menos
contra el granito**. No es "salicílico mejorado": es otro punto en la curva entre eficacia y
tolerancia.

**En el catálogo:** LRP Effaclar Mat · LRP Mela B3 (×2) · Garnier Agua Micelar Anti-imperfecciones.

---

### 4.3 · AHA: glicólico, láctico, mandélico, málico, tartárico · **A** (glicólico y láctico)

Hidrosolubles: trabajan en superficie disolviendo la cohesión entre corneocitos.

| | Tamaño | Penetra | Irrita | Extra |
|---|---|---|---|---|
| Glicólico | el más chico | mucho | mucho | el más estudiado |
| Láctico | medio | medio | medio | además humecta |
| Mandélico | el más grande | poco | poco | tolerable en piel reactiva |
| Málico / tartárico | grandes | poco | poco | casi siempre de relleno |

**pH.** Necesitan pH 3–4 para tener suficiente ácido libre. Un AHA en una crema a pH 5,5 es
decorativo.

### 4.4 · PHA (gluconolactona, lactobiónico) · **B** · (no está en el catálogo)

Moléculas grandes: penetran poco y además retienen agua. La literatura los describe como compatibles
con piel clínicamente sensible, rosácea y dermatitis atópica. **Es el reemplazo que la tabla de
sustitutos de piel sensible promete y el catálogo sigue sin tener.**

### 4.5 · Ácido cítrico · **D como exfoliante**

En la enorme mayoría de las fórmulas está como **ajustador de pH**, no como activo. Aparece en 13
productos del catálogo y en ninguno es un exfoliante. Contarlo como tal sería inflar la cuenta.

### 4.6 · Ácido fítico · **C**

Quelante de hierro y cobre con exfoliación muy suave. En fórmulas despigmentantes está más por
quelar metales que catalizan oxidación que por descamar.

### 4.7 · Urea · **A**, y es dosis-dependiente

El caso más claro de "la dosis hace la molécula":

- **Hasta 10%** — humectante y reparador de barrera. Es parte del factor natural de hidratación de
  la piel; no exfolia.
- **Por encima de 10%** — queratolítico: rompe cohesión de queratina y descama.

En un hidratante facial está en el rango bajo. **En el catálogo:** Isdin Ureadin Fusion Melting.

---

## 5 · Sebo, barrera e hidratación

### 5.1 · Ceramidas + colesterol + ácidos grasos · **A**

La barrera es una estructura lamelar de esos tres en proporción. Un producto que trae **los tres**
repone la estructura; uno que trae sólo ceramidas repone una pieza.

> **Cuatro productos del catálogo traen el set completo** (ceramidas NP/AP/EOP + colesterol +
> fitoesfingosina): CeraVe Limpiador Hidratante, CeraVe Gel Espumoso, Celimax Noni Ampoule y —
> parcialmente — Kosmos. Es un diferencial real y hoy no lo estamos contando.

### 5.2 · Ácido hialurónico · **B**

**Es un humectante, no un hidratante.** Atrae agua y la retiene en superficie; el peso molecular
alto forma película, el bajo penetra algo más.

**El matiz que explica las quejas.** En ambiente seco y sin nada que lo selle encima, puede terminar
tomando agua de las capas más profundas. No es un desastre, pero es por qué a algunas personas "el
hialurónico les reseca". **La respuesta es una crema arriba, no sacar el hialurónico.**

**En el catálogo:** 13 productos, más 4 sérums dedicados.

### 5.3 · Gliceril glucósido · **B**

Humectante con mecanismo propio: en vez de sólo atraer agua, **estimula la expresión de
acuaporina-3**, el canal por el que el agua circula entre queratinocitos. Hay trabajo publicado
midiendo el aumento de AQP3 en queratinocitos cultivados y en piel humana con biopsia de succión.

**En el catálogo:** Eucerin Aquaporin Active. Es su activo diferencial y merece contarse.

### 5.4 · Pantenol (B5) · **B** · Alantoína · **C** · Escualano · **B** · Glicerina · **A**

Humectantes y calmantes de buena tolerancia y cero conflictos.

### 5.5 · Zinc PCA y gluconato de zinc · **C**

Seborreguladores. Evidencia modesta, buena tolerancia. Acompañan a la niacinamida.

### 5.6 · Mucina de caracol · **C**

Mezcla de glicosaminoglicanos, glicoproteínas y alantoína. Buenos datos de hidratación; los de
"reparación" y "cicatrices" son mucho más flojos de lo que sugiere el marketing.

---

## 6 · Calmantes

| Ingrediente | Nivel | Nota |
|---|---|---|
| **Madecasósido** (centella) | **B** | El componente de centella con más respaldo propio: cicatrización epidérmica, protección del queratinocito frente a UVB, síntesis de colágeno vía TGF-β |
| **Centella asiática** (extracto) | **B** | Revisiones lo respaldan para cicatrización, barrera y envejecimiento |
| **Licochalcona A / glicirretínico** | **B** | Derivados de regaliz; antiinflamatorios con datos en enrojecimiento post-sol |
| **Glicirricinato dipotásico** | **C** | Antiinflamatorio suave, muy bien tolerado |
| **Avena coloidal** | **A** | De los pocos calmantes con respaldo regulatorio como protector cutáneo |
| **Bisabolol** | **C** | Componente de manzanilla |
| **Agua termal** | **D** | Aporta poco por sí sola. Su valor real es lo que la fórmula **no** tiene |
| **Aquaphilus dolomiae** (Avène) | **C** | Postbiótico; evidencia casi toda del fabricante |

---

## 7 · Péptidos

**Nivel general: C, y conviene decirlo.**

| Tipo | En el catálogo | Nivel |
|---|---|---|
| **GHK-Cu** (cobre tripéptido-1) | Skin1004 Poremizing | **C** |
| Péptidos de señal (palmitoil pentapéptido-4, acetil hexapéptido-8, tripéptidos) | Skin1004 Poremizing, L'Oréal Revitalift, LRP Pure Vit C12 | **C/D** |

El GHK-Cu tiene 50 años de literatura celular y resultados clínicos prometedores, pero con estudios
chicos, casi siempre financiados por la industria y sin réplica independiente. **No está al nivel de
un retinoide ni de la vitamina C**, y venderlo como si lo estuviera es la clase de cosa que nos
haría perder credibilidad.

**Nota de compatibilidad importante:** el conflicto con vitamina C pura es del **cobre**, no del
péptido. "Los péptidos no van con vitamina C" es falso como regla general. El catálogo tiene dos
fuentes de cobre: Skin1004 Poremizing (GHK-Cu) y **Eximia Hyalu-B (gluconato de cobre)** — esta
última en un producto que se vende como sérum de hialurónico.

---

## 8 · Filtros solares

**El paso que más cambia resultados a largo plazo, y el único no negociable.**

El respaldo es un ensayo aleatorizado, que es lo más fuerte que hay para esto: Hughes et al.,
*Annals of Internal Medicine* 2013. 903 adultos menores de 55 años en Nambour, Australia, seguidos
4,5 años. El grupo asignado a protector **todos los días** no mostró un aumento detectable de
envejecimiento de la piel, y tuvo 24% menos fotoenvejecimiento que el de uso discrecional (odds
relativo 0,76; IC 95% 0,59–0,98). Agregado el 13/9/2026: esta línea venía sin fuente.

### 8.1 · Los filtros del catálogo

| Filtro | Cubre | Nota |
|---|---|---|
| **Butil metoxidibenzoilmetano** (avobenzona) | UVA | El clásico, y el menos estable: se degrada con la luz que bloquea si no lo acompañan estabilizadores |
| **Bis-etilhexiloxifenol metoxifenil triazina** (Tinosorb S) | UVB + UVA | Muy fotoestable; además estabiliza avobenzona |
| **Etilhexil triazona** (Uvinul T150) | UVB | Alta eficiencia |
| **Dietilamino hidroxibenzoil hexil benzoato** (Uvinul A Plus) | UVA | Fotoestable |
| **Drometrizol trisiloxano** (Mexoryl XL) | UVA + UVB | |
| **Ácido tereftalilideno dicanfor sulfónico** (Mexoryl SX) | UVA | |
| **Metoxipropilamino ciclohexenilideno etoxietilcianoacetato** (Mexoryl 400 / MCE) | **UVA ultra-largo, 380–400 nm** | Ver abajo |
| Homosalato, octocrileno, etilhexil salicilato | UVB | Filtros de relleno; el octocrileno estabiliza avobenzona |

### 8.2 · Mexoryl 400 (MCE) · **B**

Pico de absorción en 385 nm, una franja que casi ningún protector cubre. Fotoestable. En un ensayo
aleatorizado redujo la pigmentación inducida por UVA1 frente a un protector que sólo llega a 370 nm.

**Por qué nos importa comercialmente:** para melasma y para manchas que reaparecen, este detalle
cambia más el resultado que agregar otro sérum despigmentante.

**En el catálogo:** los tres Anthelios de La Roche-Posay.

### 8.3 · Óxidos de hierro (el color) · **B**

**El color de un protector con tono no es cosmético.** Los óxidos de hierro son de lo poco que
bloquea **luz visible**, y la luz visible es un disparador conocido de melasma que los filtros UV no
frenan. Para alguien trabajando manchas, el protector con color es parte del tratamiento.

**En el catálogo:** Anthelios UVMUNE 400 con color · Anthelios Oil Control · Eucerin Tono medio.

### 8.4 · La corrección que hay que hacer: **no hay ningún protector mineral**

Varios protectores del catálogo listan **CI 77891 / dióxido de titanio**. Es tentador contarlos como
minerales. **No lo son.** En esas fórmulas el dióxido de titanio aparece junto a los óxidos de hierro
(CI 77491/77492/77499) y después de los filtros orgánicos: está como **pigmento**, para dar el tono,
no como filtro UV.

> **Un protector con color no es un protector mineral.** Confundirlos sería exactamente el tipo de
> error que este documento existe para evitar — y el bloqueante B1 de `ISSUES.md` sigue abierto:
> con 72 productos cargados, **piel sensible sigue sin un protector mineral**.

---

## 9 · Lo que no aporta y sí suma costo

Estos no son activos. Se documentan porque para piel reactiva pesan más que varios activos de
verdad, y porque recortar acá es gratis: no se pierde ningún beneficio.

### 9.1 · Alcohol denat — **12 de 41 productos con INCI lo traen**

Merece un tratamiento honesto, porque las dos posturas extremas están mal.

**A favor:** en un protector solar es lo que da la textura liviana y el secado rápido. Un protector
que se usa todos los días protege infinitamente más que uno perfecto que queda en el cajón. Se
evapora en segundos.

**En contra:** en piel seca, reactiva o con la barrera dañada, el efecto se nota. Y en un producto
que queda puesto —un sérum, una crema— el argumento de la textura pesa mucho menos.

**Dónde está, y por qué el caso duele:** los tres Anthelios, los dos Eucerin Sun, Effaclar Mat,
Eucerin Aquaporin, LRP Hyalu B5, LRP Pure Vitamin C12, Eximia Hyalu-N, Garnier Super UV, y **La
Roche-Posay Retinol B3 — que se comercializa "para todo tipo de piel, incluso sensible" y trae
alcohol denat y fragancia**. La etiqueta y la lista de ingredientes no dicen lo mismo.

### 9.2 · Fragancia · limoneno, linalol, geraniol, citral, cumarina

Primera causa de dermatitis de contacto alérgica en cosmética. Los alérgenos declarables aparecen en
8 productos del catálogo nuevo. **No aportan absolutamente nada al resultado.**

### 9.3 · Aceites esenciales — árbol de té, romero, menta

El árbol de té tiene evidencia razonable para acné, pero sigue siendo un aceite esencial y una causa
conocida de dermatitis de contacto. El romero (Celimax Noni) y la menta (TIRTIR) no aportan nada a
cambio del riesgo. **La sensación de fresco no es un beneficio: es la señal de que algo está
irritando.**

---

## 10 · Qué dice todo esto sobre el catálogo

### 10.1 · Lo que el catálogo hace muy bien

- **Vitamina C de nivel A.** SkinCeuticals C E Ferulic es la fórmula del paper, y Kosmos la replica
  a otro precio. Se puede afirmar sin matices.
- **Barrera.** CeraVe (×2), Avène Tolerance Control, Aveno, Cetaphil, Lipikar: el set completo de
  ceramidas + colesterol + ácidos grasos, y fórmulas cortas sin fragancia.
- **Fotoprotección UVA.** Los tres Anthelios con Mexoryl 400 son, técnicamente, lo mejor del
  catálogo, y para manchas los tres con color valen doble.
- **Melasma.** Mela B3 con Melasyl tiene un ECA contra hidroquinona 4%.

### 10.2 · Los huecos, por lo que cuesta no tenerlos

| # | Falta | Por qué duele |
|---|---|---|
| 1 | **Protector solar mineral** | Piel sensible sigue sin rutina servible. 72 productos y ninguno. Los que tienen TiO₂ lo tienen como pigmento |
| 2 | **Ácido azelaico** | Nivel A para cuatro problemáticas, tolera todo, apto en embarazo. Cero unidades |
| 3 | **Exfoliante PHA** | Lo que la tabla de sustitutos de piel sensible promete y no existe |
| 4 | **Tranexámico limpio** | El único que hay viene con un complejo de AHA que va en contra |
| 5 | **Bakuchiol** | La alternativa al retinoide para quien no lo tolera |

### 10.3 · Las trampas que sólo se ven leyendo el INCI

Estas son las que justifican todo el trabajo. Ninguna se ve en el frente del envase:

1. **LRP Mela B3 lleva retinil palmitato.** Un retinoide dentro de un sérum de niacinamida.
2. **LRP Pure Vitamin C12 lleva ácido salicílico.** Un exfoliante dentro de un sérum de vitamina C.
3. **Eximia Hyalu-B lleva gluconato de cobre.** El metal que oxida al ascorbato, dentro de un sérum
   de hialurónico.
4. **Eximia Hyalu-N lleva un complejo de AHA y tranexámico.** Un "sérum de niacinamida" que exfolia.
5. **Garnier Sérum Anti-imperfecciones apila BHA + AHA + fítico + ascorbil glucósido + niacinamida**,
   con alcohol y fragancia. Es el producto con más activos por mililitro del catálogo.
6. **Los protectores con color no son minerales.**

---

## 11 · Fuentes

Las de `COMPATIBILIDAD.md` §10, más:

- Martin B, et al. *Chemical stability of adapalene and tretinoin when combined with benzoyl peroxide…*
  Br J Dermatol. 1998. [Wiley](https://onlinelibrary.wiley.com/doi/10.1046/j.1365-2133.1998.1390s2008.x)
- Lin FH, Pinnell SR, et al. *Ferulic acid stabilizes a solution of vitamins C and E and doubles its
  photoprotection of skin.* J Invest Dermatol. 2005.
  [ScienceDirect](https://www.sciencedirect.com/science/article/pii/S0022202X1532491X)
- *Efficacy and Tolerability of a New Facial 2-Mercaptonicotinoyl Glycine-Containing Depigmenting
  Serum Versus Hydroquinone 4% over 3-Month Treatment of Facial Melasma.* Dermatol Ther. 2025.
  [PubMed](https://pubmed.ncbi.nlm.nih.gov/40586974/) ·
  [Springer](https://link.springer.com/article/10.1007/s13555-025-01473-4)
- *Sunscreens with the New MCE Filter Cover the Whole UV Spectrum: Improved UVA1 Photoprotection
  In Vitro and in a Randomized Controlled Trial.* JID Innovations. 2022.
  [PubMed](https://pubmed.ncbi.nlm.nih.gov/35072138/)
- Jacques C, et al. *Ascorbic acid 2-glucoside: an ascorbic acid pro-drug with longer-term
  antioxidant efficacy in skin.* Int J Cosmet Sci. 2021.
  [PubMed](https://pubmed.ncbi.nlm.nih.gov/34679221/)
- *Effects of Glyceryl Glucoside on AQP3 Expression, Barrier Function and Hydration of Human Skin.*
  Skin Pharmacol Physiol. 2012.
  [Karger](https://karger.com/spp/article/25/4/192/295685/Effects-of-Glyceryl-Glucoside-on-AQP3-Expression)
- King M, et al. *A systematic review to evaluate the efficacy of azelaic acid…* J Cosmet Dermatol.
  2023. [Wiley](https://onlinelibrary.wiley.com/doi/10.1111/jocd.15923)
- Dhaliwal S, et al. *Prospective, randomized, double-blind assessment of topical bakuchiol and
  retinol for facial photoageing.* Br J Dermatol. 2019.
  [Wiley](https://onlinelibrary.wiley.com/doi/full/10.1111/bjd.16918)
- *Topical Application of Centella asiatica in Wound Healing: Recent Insights into Mechanisms and
  Clinical Efficacy.* [PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11510310/)
- Starace M, et al. *Clinical evidences of urea at high concentration on skin and annexes.*
  Int J Clin Pract. 2020. [Wiley](https://onlinelibrary.wiley.com/doi/10.1111/ijcp.13740)
- Capryloyl salicylic acid / LHA: perfil de penetración y tolerancia —
  [Paula's Choice ingredient dictionary](https://www.paulaschoice.com/ingredient-dictionary/ingredient-capryloyl-salicylic-acid.html)
- Lab Muffin Beauty Science — [UVMune 400](https://labmuffin.com/la-roche-posay-uvmune-400-science-and-review/)

**Listas INCI:** las de los 46 `.md` del vault *Organize*, más verificación externa (INCIDecoder,
SkinSort, fichas de fabricante) para Celimax Noni Ampoule, Garnier Sérum Anti-imperfecciones,
Detenage N y Vichy Liftactiv. **Sin verificar:** Avène Hydrance SPF30 y Garnier Agua Micelar Todo en
1 — los dos quedan con lista de activos vacía y el motor no dice nada sobre ellos.
