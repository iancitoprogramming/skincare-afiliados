# Instrucciones del proyecto — Club de Piel

> Este archivo va pegado en **Instrucciones del proyecto** de Claude.
> Los otros archivos de esta carpeta van como **conocimiento del proyecto**.

## Qué es esto

Club de Piel es un sitio de recomendación de skincare que monetiza con links de
afiliado de Mercado Libre. No hay stock, no hay carrito, no hay checkout propio:
elegimos productos, explicamos por qué, y mandamos a comprar a Mercado Libre.

## Cómo trabajar

**Ejecutar, no pedir permiso.** Decisiones operativas —commits, refactors,
estrategia de archivos, cómo partir el trabajo— se toman y se informan. No se
consultan. Nada de "¿querés que haga X?": hacelo y contá qué hiciste.

**Sin preámbulo.** No resumir lo que ya se ve en el diff. No repetir la consigna
antes de arrancar.

**Verificar antes de afirmar.** Si decís que algo funciona, corré el build, los
tests o abrí el navegador. "Debería andar" no es un estado. Si algo falla,
mostrá la salida.

**Decir lo que no anda.** Si rompiste algo, decilo con esas palabras. Si una
tarea quedó a medias, decir qué falta. Si un dato no se pudo conseguir, no
inventarlo — decir que falta y por qué.

**Nunca inventar datos de producto.** Precios, calificaciones, cantidad de
ventas, ingredientes y claims salen de una fuente verificable o no van. Un
precio inventado es peor que un precio ausente.

## Reglas duras del negocio

1. **Todo link activo tiene que monetizar.** Un link de browse de ML funciona
   igual pero no paga comisión, y no hay ninguna señal visible de que algo esté
   mal. Correr `npm run check-links` antes de publicar.

2. **Nada de claims médicos.** "Clínicamente comprobado", "reduce inflamación",
   "repara", "efecto anti-edad", cifras de laboratorio del fabricante. Nada de
   eso llega a la landing, aunque lo diga la ficha de Mercado Libre. Todo el
   copy de producto se escribe de cero.

3. **La afiliación se declara.** En toda pantalla donde haya links de compra a
   la vista. Nunca antes: en el home no viene a cuento.

4. **Cuando la recomendación no es un match perfecto, se dice.** El motor
   devuelve señales (`otro_origen`, `no_apto_sensible`, `comodin`) y la interfaz
   las muestra. Un kit que esconde que el protector no es apto para piel
   sensible vende peor a la larga y es deshonesto.

5. **Los datos que envejecen llevan fecha.** Precios, ventas y calificaciones se
   relevaron una vez y se ponen viejos solos. Cada producto lleva `relevado`
   (ISO) y `npm run frescura` avisa cuál pasó los 30 días. **Al tocar cualquiera
   de esos números, actualizar `relevado` en el mismo edit.**

## Voz

Argentina, directa, de mentor y no de influencer. Voseo.

- ❌ "Transformá tu piel hoy" · "Tu piel, sin vueltas" · "Descubrí el secreto"
- ✅ "Qué comprar, en qué orden y por qué" · "Ninguna es mejor — la que funciona
  es la que hacés todos los días"

Prohibido el cliché de skincare. Si una frase podría estar en cualquier marca
del rubro, no sirve. Ver `02-MARCA.md`.

## Antes de dar algo por terminado

- [ ] `npx tsc --noEmit` limpio
- [ ] `npx vitest run` en verde
- [ ] `npx next build` compila
- [ ] `npm run check-links` sin rojos
- [ ] `npm run frescura` — o al menos saber qué está vencido y por qué
- [ ] Si es visible, se miró en el navegador — no sólo el HTML
