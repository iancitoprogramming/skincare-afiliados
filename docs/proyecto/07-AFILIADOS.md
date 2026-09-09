# Reglas del Programa de Afiliados

> Qué se puede y qué no, según los Términos del Programa de Afiliados de Mercado
> Libre y las Obligaciones Complementarias, más dos respuestas de soporte pedidas
> por escrito el 6 de septiembre de 2026.
>
> Existe porque estas reglas no se deducen del código y romperlas no da error: el
> sitio sigue andando y las comisiones dejan de pagarse. Es la misma clase de
> problema que el `og:image` roto, con plata adelante.

---

## 0 · Lo que hay que resolver

**Todos los links tienen que salir de una sola cuenta.** Hoy salen de dos:
`maurobilat` (Alex) 38 y `goldenvalhalla` (Ian) 35, sobre el mismo sitio.

Soporte del Programa, consultado el 6/9/2026:

> Cada afiliado solo cobra comisiones por ventas generadas en los canales que
> tenga declarados en su propia cuenta, y los perfiles/cuentas usados para
> difusión deben ser propios y estar registrados allí. […] No tengo una regla
> verificada que autorice que dos afiliados declaren exactamente el mismo sitio
> y los mismos perfiles para publicar links de ambas cuentas en paralelo. […] Lo
> más seguro es que un mismo medio/proyecto opere con una sola cuenta afiliada
> para todos los links.

Es una recomendación de cumplimiento, no una cláusula citada — el agente dice
explícitamente que no tiene una regla verificada. Pero lo que sí afirma con
firmeza es que cada afiliado cobra sólo por **sus** canales declarados, y con dos
cuentas sobre un mismo sitio la mitad de las ventas queda expuesta a no pagarse.
El riesgo es asimétrico: no se pierde una funcionalidad, se pierden comisiones ya
generadas.

**Decidido el 8/9/2026: queda `maurobilat`.** Es la cuenta cuyo perfil social de
ML ya está branded "Club de Piel", y su titular es monotributista, que lo exige
la cláusula 2.1. `goldenvalhalla` sale del proyecto.

Consecuencia a tener presente: las comisiones se acreditan en el Mercado Pago de
`maurobilat` y factura su titular. El reparto entre los dos socios pasa a ser un
acuerdo por fuera del Programa — el Programa ya no lo modela.

Los pasos:

1. Regenerar a mano, en el panel de Afiliados de `maurobilat`, los 35 links de
   `goldenvalhalla`. `npm run links-pendientes` arma la lista y `npm run links-aplicar`
   los escribe.
2. Confirmar que el perfil social de ML de `maurobilat` siga branded "Club de
   Piel". La cláusula 3.3 permite configurarlo y aclara que no da derechos
   exclusivos.
3. `npm run cuentas` cambia de trabajo: deja de medir equidad entre dos cuentas y
   pasa a auditar que los 73 resuelvan a la misma. Un link que se cuele de la
   otra es exactamente el error invisible que ese script sabe encontrar.

Consecuencia: **el reparto parejo deja de existir como problema.** Todo lo que se
midió sobre 37/36 y 38/35 queda sin objeto.

---

## 1 · Declarar los Medios

Cláusula 3.2:

> Serán considerados "Medios" […] las redes sociales, medios, sitios y blogs
> personales y públicos **informados por el Afiliado** […] La divulgación de
> Contenidos en sitios distintos a los Medios no será considerada para fines de
> participación en el Programa.

Hay que declarar en la cuenta, antes de publicar:

| Medio | |
|---|---|
| Sitio | `https://clubdepiel.store` |
| Pinterest | `pinterest.com/ClubDePiel` |
| Instagram | `@clubdepielok` |
| TikTok | `@clubdepielok` |
| YouTube | `@clubdepiel` |

No declararlos no rompe nada visible: los links funcionan, la gente compra, y la
comisión puede no contarse como Transacción Válida.

---

## 2 · La marca "Mercado Libre" en el sitio: resuelto

El CTA "Ver en Mercado Libre" está autorizado por la cláusula 8.2, que concede
uso no exclusivo de la marca para publicidad y divulgación del Programa, según el
Legal Brandbook.

Había una duda razonable sobre si registrar una app para la API nos metía en la
restricción de los Términos de Desarrolladores, que limitan el uso de las
palabras "mercado", "libre", "pago" y "envíos". Soporte de Desarrolladores,
6/9/2026:

> Las restricciones […] aplican únicamente al nombre y diseño de la aplicación
> registrada para la API. Por lo tanto, no es necesario quitar el texto "Ver en
> Mercado Libre" de tu sitio web mientras participes en el Programa de Afiliados,
> ya que este uso está autorizado bajo los Términos del Programa.

**La integración con la API no obliga a tocar el CTA.** Guardar ese mail: es lo
que justifica el botón si alguna vez se cuestiona.

---

## 3 · Lo que no se puede hacer con los links

Obligación (i): está prohibido usar **shorteners** o cualquier herramienta que
modifique o distorsione la Herramienta de Monetización. Cláusula 2.4: se
considera fraude interceptar clicks o alterar la atribución.

- `meli.la` es el shortener **de Mercado Libre**, generado en el panel. Es la
  Herramienta de Monetización, no algo puesto encima. Está bien.
- El `href` del botón tiene que ser el `meli.la` **directo**. Hoy lo es:
  `BotonComprar` lo renderiza tal cual y `/api/clicks` es un `sendBeacon` que
  registra aparte, sin intermediar la navegación.
- **Nunca construir un redirect propio** tipo `/go/{id}` para medir mejor. Es la
  tentación obvia de cualquiera que quiera analítica, y es exactamente lo
  prohibido.

## 4 · Lo que no se puede hacer con los datos

Obligación (e): prohibida

> cualquier medio o forma automatizada de desarticulación u otros métodos de
> extracción de datos para acceder, consultar, recopilar o utilizar la propiedad
> intelectual y/o información de Mercado Libre, incluyendo […] **web scraping**

`scripts/cuentas.ts` resolvía la cuenta de cada link siguiendo el redirect del
shortlink `meli.la` hasta `/social/<cuenta>`, con un User-Agent de navegador
puesto a mano porque sin él el `Location` no llegaba. **Retirado el 8/9/2026.**

Precisión sobre lo que hacía, porque la versión anterior de este documento lo
describía mal: no parseaba HTML ni sacaba el `polycards` — leía el header de la
redirección. Los `polycard_client` que aparecen en el repo son URLs guardadas en
`productos.importados.ts` y una regex en `src/lib/links.ts` que clasifica una URL
ya almacenada; ninguna de las dos cosas toca la red. Igual cae bajo esta
obligación: era acceso automatizado para extraer información de Mercado Libre, y
que hiciera falta falsear el User-Agent para obtener la respuesta era la señal más
clara de que el camino no estaba sancionado.

**Qué lo reemplaza.** La cuenta pasa de descubrirse a declararse:
`npm run links-aplicar` escribe `cuenta` en el mismo momento en que escribe el
link, que es cuando de verdad se sabe de qué panel salió. `npm run cuentas` deja
de resolver y pasa a auditar lo declarado contra `CUENTA_PRINCIPAL`, sin red, y
devuelve exit 1 cuando encuentra links de otra cuenta.

**Qué se pierde, dicho sin vueltas.** Ya no se detecta que un link cambió de
cuenta *en Mercado Libre* sin que nadie tocara el repo — que es exactamente el
caso que motivó el script, cuando 8 productos se movieron solos al recargar los
links. Hoy la defensa es otra: un solo panel, y constancia escrita al aplicar. Si
alguna vez hace falta verificar contra ML, el camino es la API oficial con OAuth.

`src/lib/sin-scraping.test.ts` falla si vuelve a aparecer una llamada de red a un
dominio de Mercado Libre o un User-Agent falseado. La única excepción declarada es
la descarga de la foto del producto para la imagen de Open Graph, que es un asset
que ya mostramos y no extracción de datos.

Es una de las razones para preferir la API oficial: acceso autorizado por otro
acuerdo, en vez de extracción no autorizada por ninguno.

## 5 · Lo que no se puede hacer en redes

Publicidad **paga** sólo en **Instagram, TikTok, Facebook y Pinterest**, y desde
la cuenta declarada por el Afiliado.

Prohibido, por la obligación (b): anuncios de search o shopping, incluyendo
Google Ads, Google Shopping, Bing Ads y **YouTube Ads**. El SEO orgánico no está
prohibido — lo que se prohíbe es el anuncio pago en buscadores.

Otras que aplican a nuestro contenido:

- (d) No ofrecer recompensas ni beneficios a seguidores por comprar.
- (h) No presentarse como embajador ni representante oficial de Mercado Libre.
- (a) Nada de email marketing sin permiso escrito. **Afecta al plan de captación
  de emails**: juntar direcciones está bien, mandarles links de afiliado no.

## 6 · Qué se puede promocionar

Cláusula 3.1: sólo productos **nuevos** disponibles en el Sitio. Excluidos usados,
clasificados (VIS) y **medicamentos**.

> El Afiliado sólo podrá promocionar los productos según su uso original y para
> los fines establecidos por el fabricante, evitando cualquier afirmación que sea
> engañosa respecto al uso, funciones o efectos de los productos.

Nos toca de lleno: todo el contenido afirma qué hace cada activo.
`INGREDIENTES.md` y `COMPATIBILIDAD.md` son la defensa — dicen qué evidencia
respalda cada afirmación. Mantenerlos honestos no es prolijidad, es cumplimiento.

Ojo con los retinoides: el retinol cosmético va, la tretinoína es medicamento.

## 7 · Cobro

- Ventana de atribución: **24 horas** desde el primer clic (4.1). Es lo que dice
  el sitio, y es correcto.
- Mínimo de pago **persona física**: $30.000 y al menos 3 Transacciones Válidas
  de 3 compradores distintos. **Persona jurídica**: $1.000.000.
- Constituir una sociedad multiplica por 33 el mínimo acumulado antes de cobrar
  el primer peso. Tenerlo en cuenta si alguna vez se evalúa formalizar.
- Requisito 2.1: hay que ser **monotributista**. Si alguno de los dos no lo es,
  no participa.

---

## Pendientes

- [x] Decidir la cuenta única: `maurobilat`.
- [x] Confirmar que el titular sea monotributista.
- [ ] **Regenerar 13 links activos** desde `maurobilat`. Son los que hoy están
      publicados cobrando a la cuenta equivocada. `npm run links-pendientes` los
      lista arriba de todo.
- [ ] Regenerar los 22 restantes, de productos inactivos. Sin apuro: no se le
      muestran a nadie hasta que se activen.
- [ ] Declarar los cinco Medios en `maurobilat`.
- [x] Retirar el scraping de `scripts/cuentas.ts`.
- [ ] ~~Crear Facebook~~ — descartado por ahora.
