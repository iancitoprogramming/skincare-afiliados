# Qué comprar, y por qué exactamente eso

> Lista de compras derivada de `npm run huecos` y `npm run cobertura`, cruzada
> con `INGREDIENTES.md` y `COMPATIBILIDAD.md`. **Corte: 12 de septiembre de
> 2026**, sobre 79 productos y 360 rutinas posibles.
>
> No es una lista de deseos. Cada ítem sale de un conflicto que el motor **no
> puede evitar hoy** porque no hay alternativa limpia en ese paso, y trae la
> especificación de qué activos tiene que traer y —más importante— cuáles no.

> **El corte anterior era del 9/9 y pedía cuatro compras. Hoy son dos.** Dos se
> cerraron sin comprar nada: una etiquetando productos que ya estaban en el
> catálogo, y la otra porque cambió la política de presupuesto del motor. El
> detalle de cada una está al final, en *Lo que se cerró*, para que no vuelvan a
> entrar a la lista.

---

## El criterio que ordena todo

Un producto nuevo sirve si **agrega cobertura sin agregar carga**. Los conflictos
que quedan son todos de acumulación, así que sumar otro producto con los mismos
activos empeora en vez de mejorar.

La pregunta operativa es: *¿qué activos tienen evidencia buena y no suman a
ninguna pila?* La respuesta sale de cruzar `ACTIVOS` con el grupo `exfoliante`,
que junta AHA, BHA **y retinoides** en una sola cuenta:

| Para qué | Activos que sirven y **no** suman carga exfoliante |
|---|---|
| Manchas | **Ácido azelaico (A)** · Niacinamida (A) · Tranexámico (B) · Alfa-arbutina (B) · Melasyl (B) · Fenetil resorcinol (B) |
| Acné | **Ácido azelaico (A)** · Niacinamida (A) · Peróxido de benzoilo (A, con reservas) |
| Barrera | Ceramidas (A) · Urea (A) · Fitoesfingosina (A) · Colesterol (A) · Avena coloidal (A) · Centella (B) · Pantenol (B) · Madecasósido (B) |
| Textura | Bakuchiol (B) · PHA (B) · Urea (A) |

**El ácido azelaico sigue siendo la pieza que más destraba de todo el catálogo.**
Tiene evidencia A para pigmento y para acné al mismo tiempo, y no pertenece al
grupo `exfoliante`: se puede apilar con retinoides y con vitamina C sin disparar
nada. Verificado el 12/9: **sigue habiendo cero productos con azelaico** en el
catálogo.

Del peróxido de benzoilo, en cambio, conviene desconfiar: tiene evidencia A pero
es un oxidante, y `COMPATIBILIDAD.md` lo pone como el ejemplo canónico de
conflicto de **degradación** contra la tretinoína — el que no se arregla
separando por horario.

---

## 1 · Hidratante con despigmentante que no sea ácido

**Destraba 6 de los 10 conflictos que el motor no puede evitar.** Es el hueco más
grande que queda, y en los dos casos el motivo es el mismo: en ese paso queda **un
solo candidato** y choca. No hay a dónde ir.

Así se presenta hoy, medido con `npm run huecos`:

```
4 veces · [nota] pila-vitamina-c   · piel mixta/normal · objetivo textura
2 veces · [cuidado] pila-irritante · piel seca         · objetivo textura
```

| | |
|---|---|
| **Categoría** | `hidratante` |
| **Para** | grasa · mixta · normal · seca |
| **Objetivo** | manchas · textura |
| **Tiene que traer** | ácido azelaico **o** tranexámico **o** alfa-arbutina, sobre base de ceramidas |
| **Puede traer** | niacinamida · centella · madecasósido · escualano |
| **NO puede traer** | alcohol denat · vitamina C pura · ácido salicílico · fragancia |

**El azelaico es la mejor compra del listado.** Cubre manchas y acné con
evidencia A, no suma carga exfoliante, y hoy el catálogo no tiene ninguno. Un
solo producto tapa el hueco de textura y adelanta el de acné.

Si no aparece uno bueno en Mercado Libre, la segunda opción es **tranexámico +
alfa-arbutina**: menos evidencia (B), pero el mismo comportamiento en el motor —
despigmentan sin exfoliar.

Los dos "NO puede traer" que importan acá son los que están causando el hueco:
el caso de piel seca choca por `alcohol_denat` y `fragancia`, y el de mixta y
normal por pila de vitamina C. Un hidratante con azelaico y sin esos tres cierra
los dos de una vez.

---

## 2 · Sérum activo suave para piel sensible

**No aparece en `huecos` y aun así es la compra más urgente en riesgo**, porque el
problema no es un conflicto: es que **hay un solo producto**.

Medido el 12/9: de los 57 productos que el motor sirve, los `serum_activo`
marcados aptos para piel sensible son **uno**, el Vanicream Vitamin C Serum, y
está en **banda 3**. O sea que quien declara piel sensible y presupuesto
accesible recibe el paso de tratamiento —el motivo por el que entró al quiz—
fuera de su banda y sin alternativa. No falla ningún test porque el motor hace lo
correcto con lo que tiene.

| | |
|---|---|
| **Categoría** | `serum_activo` |
| **Para** | sensible |
| **Banda** | 1 o 2. En banda 3 ya hay uno |
| **Tiene que traer** | alfa-arbutina · tranexámico · azelaico · o niacinamida **al 5%** |
| **Puede traer** | centella · madecasósido · pantenol · ceramidas |
| **NO puede traer** | vitamina C pura · ningún AHA/BHA · retinoide · fragancia · ningún aceite esencial |

**Por qué niacinamida al 5% y no al 10%.** Sobre 5% no hay evidencia de más
beneficio y sí más reportes de rubor; el panel del Cosmetic Ingredient Review no
encuentra irritación hasta 5% y sí potencial "marginal a leve" por encima. Ver
`INGREDIENTES.md` §3.1. Los tres séruns de niacinamida al 10% que estaban
marcados aptos dejaron de estarlo el 9/9 por eso mismo.

**El "ningún aceite esencial" es nuevo y es literal.** El 12/9 se encontraron dos
productos marcados aptos para piel sensible que declaraban aceite de tea tree, y
uno de ellos el motor lo servía. Hoy `apto-sensible.test.ts` lo impide, pero eso
sólo sirve para lo que ya está cargado: al comprar hay que leer el INCI.

---

## Lo que NO hay que comprar

Cuatro cosas que parecen huecos y no lo son:

- **Otro sérum de niacinamida.** La traen 14 de los 57 productos que el motor
  sirve. Es el activo más repetido del catálogo y el que genera la acumulación
  más frecuente.
- **Otro exfoliante.** `config.ts` sacó el exfoliante químico de los tiers por
  decisión de producto: suma costo, riesgo de irritación y un paso más, para un
  beneficio que no justifica la fricción.
- **Otro tónico.** Mismo criterio, y está escrito: un tónico no hace nada que la
  crema no haga.
- **Otro limpiador para acné.** Ver abajo: el hueco que lo justificaba se cerró.

---

## Lo que se cerró

Las dos compras que pedía el corte del 9/9 y ya no hacen falta. Quedan acá
escritas para que no vuelvan a entrar a la lista por inercia.

### ~~Limpiador sin ácidos para acné y textura~~ · cerrado sin comprar

Pedía un limpiador limpio porque *"hay 3 candidatos para ese paso y los tres
chocan"* — traían tea tree, mandélico, salicílico y fragancia. **Destrababa 16
conflictos y era el hueco más grande.**

Se cerró etiquetando dos limpiadores limpios que ya estaban en el catálogo. La
causa no era falta de producto: `candidatosDe` devuelve el nivel de match en
exclusiva, y los limpiadores etiquetados para acné eran justo los que traían
ácidos. Hoy el paso tiene, entre otros, el Skin1004 Centella Ampoule Foam
(centella, hialurónico), el Round Lab Dokdo (hialurónico, pantenol, alantoína,
ceramidas) y el Haruharu Wonder Black Rice (arroz fermentado, ginseng).

**Queda un resto, mucho más chico:** 4 conflictos de `pila-irritante` con
severidad "cuidado" en piel grasa y mixta con objetivo acné, donde el único
candidato de ese escalón choca por `alcohol_denat`. Es un aviso manejable, no un
paso degradado, y no justifica una compra por sí solo. Si igual se compra un
limpiador, que no traiga **ningún** irritante: ni alcohol denat, ni fragancia, ni
aceite esencial, ni AHA/BHA — un limpiador se enjuaga en segundos y ahí el ácido
aporta poco, mientras suma a la cuenta que después le limita el sérum.

### ~~Protector solar para piel sensible en banda accesible~~ · dejó de ser un hueco

Pedía uno porque *"el único protector de banda accesible no es apto para piel
sensible, así que el motor se lo ofrece igual con un aviso"*. **Destrababa 16
pasos flojos.**

El dato de partida sigue siendo cierto: de los protectores en banda 1, el único
que el motor sirve es el NIVEA Anti-Brillo, y no es apto para sensible. (El otro
de banda 1 es la Dermaglós Crema de Día FPS30, que salió del motor en la
auditoría: trae palmitato de retinilo y fragancia y estaba usándose como paso de
protector solar.) Lo que cambió es qué hace el motor con eso. Desde que **el presupuesto cede ante la piel y el objetivo**, a quien
declara piel sensible ya no se le ofrece un protector no apto: se le ofrece uno
apto de banda 2 con el cartel de que se fue de su banda. `npm run cobertura` lo
muestra: **0 pasos por "no apto sensible"**, donde antes había 16.

O sea que pasó de ser un problema de seguridad a ser un problema de precio, y por
eso sale de la lista de compras. Si aparece un protector mineral o híbrido FPS 50
apto para sensible en banda 1, sigue siendo una buena compra —hay 5 aptos en el
motor y ninguno accesible— pero ya no está tapando nada.

---

## Cómo se verifica que una compra sirvió

```bash
npm run huecos      # los conflictos irresolubles tienen que bajar
npm run auditar     # las rutinas sin conflicto tienen que subir
npm run cobertura   # los pasos flojos tienen que bajar
```

Punto de partida del 12/9/2026, para comparar contra esto:

| | 9/9 | 12/9 |
|---|---|---|
| Rutinas sin ningún conflicto | 308 / 360 (85,6 %) | **344 / 360 (95,6 %)** |
| Conflictos que el motor no puede evitar | 36 | **10** |
| De esos, por falta de producto | — | **10** (los 10) |
| De esos, por política de desempate | — | **0** |
| Pasos flojos por no apto sensible | 16 | **0** |
| Pasos fuera de banda | — | **72** |
| Conflictos de severidad "separar" | 0 | **0** |

Que los 10 que quedan sean **todos** por falta de producto y ninguno por política
de desempate es lo que dice que esta lista es una lista de compras y no un
problema de código: no hay nada que ajustar en el motor para cerrarlos.
