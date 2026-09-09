# Qué comprar, y por qué exactamente eso

> Lista de compras derivada de `npm run huecos` y `npm run cobertura`, cruzada
> con `INGREDIENTES.md` y `COMPATIBILIDAD.md`. Corte: 9 de septiembre de 2026,
> sobre 79 productos y 360 rutinas posibles.
>
> No es una lista de deseos. Cada ítem sale de un conflicto que el motor **no
> puede evitar hoy** porque no hay alternativa limpia en ese paso, y trae la
> especificación de qué activos tiene que traer y —más importante— cuáles no.

---

## El criterio que ordena todo

Un producto nuevo sirve si **agrega cobertura sin agregar carga**. Los conflictos
que quedan son casi todos de acumulación, así que sumar otro producto con los
mismos activos empeora en vez de mejorar.

La pregunta operativa es: *¿qué activos tienen evidencia buena y no suman a
ninguna pila?* La respuesta sale de cruzar `ACTIVOS` con el grupo `exfoliante`,
que junta AHA, BHA **y retinoides** en una sola cuenta:

| Para qué | Activos que sirven y **no** suman carga exfoliante |
|---|---|
| Manchas | **Ácido azelaico (A)** · Niacinamida (A) · Tranexámico (B) · Alfa-arbutina (B) · Melasyl (B) · Fenetil resorcinol (B) |
| Acné | **Ácido azelaico (A)** · Niacinamida (A) · Peróxido de benzoilo (A, con reservas) |
| Barrera | Ceramidas (A) · Urea (A) · Fitoesfingosina (A) · Colesterol (A) · Avena coloidal (A) · Centella (B) · Pantenol (B) · Madecasósido (B) |
| Textura | Bakuchiol (B) · PHA (B) · Urea (A) |

**El ácido azelaico es la pieza que más destraba de todo el catálogo.** Tiene
evidencia A para pigmento y para acné al mismo tiempo, y no pertenece al grupo
`exfoliante`: se puede apilar con retinoides y con vitamina C sin disparar nada.
Hoy no hay un solo producto con azelaico en el catálogo.

Del peróxido de benzoilo, en cambio, conviene desconfiar: tiene evidencia A pero
es un oxidante, y `COMPATIBILIDAD.md` lo pone como el ejemplo canónico de
conflicto de **degradación** contra la tretinoína — el que no se arregla
separando por horario.

---

## 1 · Limpiador sin ácidos para acné y textura

**Destraba 16 conflictos.** Es el hueco más grande.

Hoy hay 3 candidatos para ese paso y **los tres chocan**: traen
`aceite_esencial_tea_tree`, `aha_mandelico`, `bha_salicilico` y `fragancia`.
Cuando alguien con piel grasa pide algo para el acné, el motor tiene que elegir
uno igual, y el aviso de acumulación aparece antes de que empiece la rutina.

| | |
|---|---|
| **Categoría** | `limpiador` |
| **Para** | grasa · mixta · normal · seca |
| **Objetivo** | acné · textura |
| **Tiene que traer** | tensioactivos suaves — coco-glucoside, sodium cocoyl glycinate, aminoácidos. pH 5–5,5 |
| **Puede traer** | niacinamida · centella · pantenol · avena coloidal |
| **NO puede traer** | ácido salicílico · cualquier AHA · aceite esencial de té · fragancia · alcohol denat |

**Por qué sin salicílico, si es el activo del acné.** Porque un limpiador está en
contacto con la piel unos segundos y se enjuaga: el salicílico ahí aporta poco y
sin embargo suma a la cuenta exfoliante que después le limita el sérum, que es el
paso donde ese activo sí trabaja. La exfoliación conviene en lo que se queda
puesto, no en lo que se va por el desagüe.

---

## 2 · Hidratante con despigmentante que no sea ácido

**Destraba 18 conflictos** (13 de irritación + 5 de vitamina C).

Es el hueco más urgente por otra razón: en ese paso queda **un solo candidato**,
y choca. No hay a dónde ir.

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
solo producto tapa dos huecos.

Si no aparece uno bueno en Mercado Libre, la segunda opción es **tranexámico +
alfa-arbutina**: menos evidencia (B), pero el mismo comportamiento en el motor —
despigmentan sin exfoliar.

---

## 3 · Protector solar para piel sensible, en banda accesible

**Destraba 16 pasos flojos**, todos de piel sensible.

El único protector de banda accesible que hay no es apto para piel sensible, así
que el motor se lo ofrece igual con un aviso — que es honesto, pero es una
recomendación degradada en el paso más importante de la rutina.

| | |
|---|---|
| **Categoría** | `protector_solar` |
| **Para** | sensible, y que sirva también al resto |
| **Banda** | 1 — accesible. Ya hay opciones en banda 2 |
| **Tiene que traer** | filtro mineral (óxido de zinc) o híbrido. FPS 50 |
| **Puede traer** | avena coloidal · centella · niacinamida · pantenol |
| **NO puede traer** | fragancia · alcohol denat · filtro químico solo, sin respaldo para sensible |

El protector es el paso que más se abandona por textura, así que acá el criterio
no es sólo la fórmula: si deja velo blanco o pesa, no se usa, y un protector que
no se usa protege cero.

---

## 4 · Sérum activo suave para piel sensible

**Destraba 2 conflictos** y, sobre todo, tapa un agujero de criterio.

Los tres séruns que estaban marcados aptos para sensible eran de niacinamida al
10% y de vitamina C. Los primeros dejaron de estarlo el 9/9 —sobre 5% no hay más
beneficio y sí más rubor, ver `INGREDIENTES.md` §3.1— así que hoy piel sensible
tiene poco para elegir en el paso de tratamiento.

| | |
|---|---|
| **Categoría** | `serum_activo` |
| **Para** | sensible |
| **Tiene que traer** | alfa-arbutina · tranexámico · azelaico · o niacinamida **al 5%** |
| **Puede traer** | centella · madecasósido · pantenol · ceramidas |
| **NO puede traer** | vitamina C pura · ningún AHA/BHA · retinoide · fragancia |

---

## Lo que NO hay que comprar

Tres cosas que parecen huecos y no lo son:

- **Otro sérum de niacinamida.** Hay 20 productos que la traen. Es el activo más
  repetido del catálogo y el que genera la acumulación más frecuente.
- **Otro exfoliante.** `config.ts` sacó el exfoliante químico de los tiers por
  decisión de producto: suma costo, riesgo de irritación y un paso más, para un
  beneficio que no justifica la fricción.
- **Otro tónico.** Mismo criterio, y está escrito: un tónico no hace nada que la
  crema no haga.

---

## Cómo se verifica que una compra sirvió

```bash
npm run huecos      # los conflictos irresolubles tienen que bajar
npm run auditar     # las rutinas sin conflicto tienen que subir
npm run cobertura   # los pasos flojos tienen que bajar
```

Punto de partida del 9/9/2026, para comparar contra esto:

| | |
|---|---|
| Rutinas sin ningún conflicto | 308 / 360 (85,6 %) |
| Conflictos que el motor no puede evitar | 36 |
| Pasos flojos por no apto sensible | 16 |
| Conflictos de severidad "separar" | 0 |
