// Copy de los productos importados del vault: por qué está en el catálogo y
// cómo se usa.
//
// ─────────────────────────────────────────────────────────────────────────────
// POR QUÉ VIVE ACÁ Y NO EN productos.organize.ts
//
// Ese archivo es generado. Este es contenido escrito a mano, y el contenido no
// se pierde porque alguien reimporte el vault. `npm run copy-aplicar` lo inyecta
// donde tiene que estar.
//
// ─────────────────────────────────────────────────────────────────────────────
// LAS REGLAS AL ESCRIBIRLO
//
// 1. Ningún claim médico. Ningún producto de venta libre "trata", "cura",
//    "repara" ni "elimina" nada. Se habla de apariencia y de qué hace la
//    fórmula. Está documentado en ISSUES.md §I8 y no es una convención de
//    estilo: es lo que se puede sostener.
//
// 2. Se dice lo que el INCI dice, aunque incomode. Si un producto se anuncia
//    para piel sensible y lleva alcohol y fragancia, el copy lo menciona. Si un
//    sérum de niacinamida esconde un retinoide, el copy lo menciona. Es
//    exactamente lo que alguien querría saber antes de comprar, y es lo que
//    nadie más le va a decir.
//
// 3. `como_usar` termina en algo accionable. "Usar según necesidad" no ayuda a
//    nadie: cuántas veces, en qué momento, sobre piel seca o húmeda, y qué
//    hacer si molesta.
// ─────────────────────────────────────────────────────────────────────────────

export interface CopyProducto {
  porQue: string;
  comoUsar: string;
}

export const COPY_PRODUCTOS: Record<string, CopyProducto> = {
  // ── Hidratantes ────────────────────────────────────────────────────────────
  MLA67629151: {
    porQue:
      "Hidratante con FPS 30 para piel sensible: cubre dos pasos cuando la rutina tiene que ser corta.",
    comoUsar:
      "A la mañana, como último paso. Si vas a estar horas al sol, mejor un protector de 50 aparte.",
  },
  MLA23143346: {
    porQue:
      "Catorce ingredientes y ninguno de más. Es la fórmula más corta del catálogo, pensada para piel que reacciona a casi todo.",
    comoUsar:
      "Mañana y noche. Si tenés la piel irritada, usala sola unos días antes de volver a sumar activos.",
  },
  MLA21174873: {
    porQue:
      "Urea y ácido láctico para suavizar la textura, con ceramidas que reponen lo que la exfoliación se lleva.",
    comoUsar:
      "De noche, sobre la piel limpia. Trae fragancia: si tu piel reacciona, probala primero en el cuello.",
  },
  MLA35115621: {
    porQue:
      "Gel liviano con niacinamida y salicílico: hidrata sin cargar y trabaja sobre los granitos al mismo tiempo.",
    comoUsar: "Mañana y noche. Lleva alcohol, así que si tenés la piel seca o tirante conviene otra.",
  },
  MLA9210936: {
    porQue:
      "Su activo no atrae agua: estimula los canales por los que el agua circula entre las células. Es un mecanismo distinto al del resto del catálogo.",
    comoUsar: "Mañana y noche, sobre la piel limpia.",
  },
  MLA28531465: {
    porQue:
      "El gel de hialurónico de siempre, en formato recarga: mismo producto, menos plástico y menos plata.",
    comoUsar: "Mañana y noche. Sobre la piel todavía húmeda rinde más.",
  },
  MLA9855881: {
    porQue:
      "Hidratante de día con hialurónico. El FPS 15 es un extra, no reemplaza al protector solar.",
    comoUsar: "A la mañana. Si vas a estar al sol, ponete un protector de 50 encima.",
  },
  MLA22990183: {
    porQue:
      "Avena coloidal, que es de los calmantes con más respaldo, en una textura gel que no pesa.",
    comoUsar: "Mañana y noche. Va bien incluso cuando la piel está reactiva.",
  },
  MLA9196384: {
    porQue:
      "Matifica y trabaja el poro con LHA, que es la versión lenta del salicílico: descama de a poco en vez de golpe.",
    comoUsar: "Mañana y noche. Está pensada para piel grasa: si tenés la piel seca te va a tirar.",
  },

  // ── Limpiadores ────────────────────────────────────────────────────────────
  MLA24300545: {
    porQue: "Agua micelar con salicílico: saca el maquillaje y de paso trabaja sobre los granitos.",
    comoUsar: "Con un algodón, antes del limpiador. No hace falta enjuagar, pero si te tira, enjuagá.",
  },
  MLA20546060: {
    porQue: "Agua micelar sin activos: saca maquillaje y protector solar sin frotar.",
    comoUsar: "Con un algodón, como primer paso de la noche. Después, el limpiador.",
  },
  MLAU141343879: {
    porQue:
      "Trae el set completo de la barrera —ceramidas, colesterol y fitoesfingosina—, que es justo lo que un limpiador suele llevarse.",
    comoUsar: "Mañana y noche sobre la cara húmeda. Sin fragancia.",
  },
  MLA37349507: {
    porQue:
      "Gel con salicílico para piel que hace grasitud. Se enjuaga rápido, así que el ácido actúa poco: limpia, y no mucho más.",
    comoUsar: "Mañana y noche. Si te deja la piel chirriando, bajá a una vez por día.",
  },
  MLA47671534: {
    porQue: "Limpia y deja niacinamida y salicílico en el paso donde casi nadie los pone.",
    comoUsar: "Mañana y noche sobre la cara húmeda.",
  },
  MLA53897352: {
    porQue:
      "Limpia sin activos y sin dejar la piel tirante. Cuando la rutina ya tiene bastante, el limpiador es el lugar para no sumar nada.",
    comoUsar: "Mañana y noche sobre la cara húmeda.",
  },
  MLAU376385300: {
    porQue:
      "Syndet sin jabón, con karité y niacinamida. Está formulado para piel atópica, que es el estándar más exigente de suavidad.",
    comoUsar: "Mañana y noche, o sólo de noche si tenés la piel muy seca. Sin fragancia.",
  },
  MLA35427636: {
    porQue:
      "Gel de limpieza coreano con tensioactivos suaves: saca la grasitud del día sin dejar la cara chirriando.",
    comoUsar: "Mañana y noche sobre la cara húmeda.",
  },
  MLA20030752: {
    porQue:
      "Para piel atópica: limpia con muy poco tensioactivo y repone parte de lo que se lleva. Sirve para cara y cuerpo.",
    comoUsar: "Mañana y noche. Sin fragancia.",
  },
  MLA37598876: {
    porQue:
      "Limpiador cremoso con el set completo de ceramidas. Para piel seca, que es donde un gel espumoso suele pasarse.",
    comoUsar: "De noche siempre; a la mañana sólo si tu piel lo pide. Sin fragancia.",
  },

  // ── Protectores solares ────────────────────────────────────────────────────
  MLA19504960: {
    porQue:
      "El color no es sólo estética: los óxidos de hierro son de lo poco que frena la luz visible, y la luz visible dispara las manchas.",
    comoUsar:
      "A la mañana, último paso y en cantidad generosa. Lleva alcohol: si tenés la piel seca, buscá otro.",
  },
  MLAU3133622625: {
    porQue:
      "Cubre hasta 400 nm, la franja de UVA que casi ningún protector alcanza y la que más pigmenta. Y además trae color.",
    comoUsar: "A la mañana, último paso. Dos dedos alcanzan para toda la cara.",
  },
  MLA16048263: {
    porQue:
      "El único del catálogo que suma dióxido de titanio como filtro, no sólo como color. Fórmula mixta, para quien no se lleva bien con los filtros orgánicos solos.",
    comoUsar: "A la mañana, último paso. Lleva alcohol denat, así que no es para piel muy seca.",
  },
  MLA58897902: {
    porQue:
      "Filtro hasta 400 nm más color: para manchas es la combinación más completa que tenemos.",
    comoUsar:
      "A la mañana, último paso y en cantidad generosa. Reponé si vas a estar muchas horas afuera.",
  },
  MLA38098313: {
    porQue:
      "Protector con niacinamida y salicílico adentro. Es poco común, y buena idea si tenés piel grasa y no querés sumar otro frasco.",
    comoUsar:
      "A la mañana, último paso. Si ya usás un sérum con salicílico, con uno de los dos alcanza.",
  },

  // ── Retinoides ─────────────────────────────────────────────────────────────
  MLA58622882: {
    porQue:
      "Retinol en crema, con bisabolol para amortiguar. Es el activo con más respaldo para arrugas y textura.",
    comoUsar:
      "De noche, sobre la piel seca. Dos veces por semana las primeras dos semanas, después subí. Protector solar al día siguiente, sin excepción.",
  },
  MLA20021768: {
    porQue:
      "Retinol acompañado de niacinamida, que es lo que hace que se tolere: menos descamación y más chance de sostenerlo.",
    comoUsar:
      "De noche, sobre la piel seca, empezando dos veces por semana. Nunca la misma noche que un exfoliante.",
  },
  MLAU244146565: {
    porQue:
      "Retinol puro y gradual con vitamina B3. Ojo con la etiqueta: dice apto para piel sensible y lleva alcohol denat y fragancia.",
    comoUsar:
      "De noche, sobre la piel seca, empezando dos veces por semana. Protector solar al día siguiente.",
  },

  // ── Séricos activos ────────────────────────────────────────────────────────
  MLAU209241342: {
    porQue:
      "Niacinamida con zinc, fórmula corta y precio accesible. La niacinamida es el activo que mejor se lleva con todo lo demás.",
    comoUsar: "Mañana y noche, después de limpiar y antes de la crema.",
  },
  MLAU1655818860: {
    porQue:
      "Niacinamida al 10% con hialurónico de dos pesos. Arriba de 5% no hay más beneficio demostrado, pero se tolera bien.",
    comoUsar: "Mañana y noche, después de limpiar. Si te da calor en la cara, bajá a una vez por día.",
  },
  MLA29882074: {
    porQue:
      "Se vende como sérum de niacinamida y además trae tranexámico y un complejo de AHA. Exfolia más de lo que parece.",
    comoUsar: "De noche. No lo uses la misma noche que otro exfoliante ni que un retinoide.",
  },
  MLA47223033: {
    porQue:
      "Vitamina C pura al 12%, la forma con más evidencia. Trae además ácido salicílico, que no es lo que uno espera en un sérum de C.",
    comoUsar:
      "A la mañana, antes del protector. Si el líquido vira a naranja se oxidó: ahí ya no sirve.",
  },
  MLA19710676: {
    porQue: "Vitamina C pura al 16% con vitamina E, que la estabiliza y la potencia.",
    comoUsar: "A la mañana, antes del protector solar. Guardala lejos de la luz.",
  },
  MLA22843182: {
    porQue:
      "Apila salicílico, láctico, fítico y niacinamida. Es el producto con más activos por mililitro del catálogo, y eso corta para los dos lados.",
    comoUsar: "De noche, empezando día por medio. No lo combines con otro exfoliante.",
  },
  MLA45672941: {
    porQue:
      "Repite el trío con más respaldo que existe —vitamina C pura, vitamina E y ácido ferúlico— y suma ceramidas.",
    comoUsar: "A la mañana, antes del protector. Si el color vira a naranja, descartala.",
  },
  MLA34459961: {
    porQue:
      "Melasyl trabaja el pigmento por una vía distinta de la habitual: en vez de frenar la enzima, atrapa el precursor. Tiene un ensayo contra hidroquinona al 4%.",
    comoUsar:
      "Mañana y noche, después de limpiar. Trae retinil palmitato: si ya usás un retinoide, estás usando dos.",
  },
  MLA26197969: {
    porQue:
      "Melasyl trabaja el pigmento por una vía distinta de la habitual: en vez de frenar la enzima, atrapa el precursor. Tiene un ensayo contra hidroquinona al 4%.",
    comoUsar:
      "Mañana y noche, después de limpiar. Trae retinil palmitato: si ya usás un retinoide, estás usando dos.",
  },
  MLA24840827: {
    porQue:
      "Es, literalmente, la fórmula del estudio: 15% de vitamina C pura, 1% de vitamina E y 0,5% de ácido ferúlico. Doce ingredientes y sin fragancia.",
    comoUsar:
      "A la mañana, sobre la piel limpia y seca, antes del protector. Cuatro o cinco gotas alcanzan.",
  },

  // ── Séricos secundarios y ampollas ─────────────────────────────────────────
  MLA45338822: {
    porQue:
      "Casi tres cuartos de extracto de noni, con ceramidas, escualano y colesterol. Trabaja la barrera más que una preocupación puntual.",
    comoUsar:
      "De noche, después del sérum. Trae aceite esencial de romero: si tu piel reacciona, salteala.",
  },
  MLA45991792: {
    porQue:
      "Hialurónico con pantenol y niacinamida. Trae cobre, que conviene no cruzar con vitamina C pura en la misma aplicación.",
    comoUsar: "De noche, si de mañana usás vitamina C. Después de limpiar y antes de la crema.",
  },
  MLA59802317: {
    porQue:
      "Cuatro tipos de hialurónico con pantenol y madecasósido, que es el componente de centella con más respaldo propio.",
    comoUsar: "Mañana y noche, sobre la piel todavía húmeda, y sellá con crema encima.",
  },
  MLA18964459: {
    porQue:
      "Lista corta, sin fragancia y sin activos fuertes: es el que se puede sumar a cualquier rutina sin recalcular nada.",
    comoUsar: "Mañana y noche, sobre la piel húmeda, antes de la crema.",
  },
  MLA22655637: {
    porQue:
      "Hialurónico concentrado y poco más. Cuando la rutina ya tiene activos, este es el paso que suma agua sin sumar problemas.",
    comoUsar:
      "Mañana y noche sobre la piel húmeda. Sellalo con crema: si no, en ambiente seco puede jugarte en contra.",
  },
  MLA18956615: {
    porQue:
      "Hialurónico con un derivado de vitamina C, que es la versión estable y sin ardor de la vitamina C.",
    comoUsar: "Mañana y noche, después de limpiar.",
  },
  MLA38719413: {
    porQue:
      "Centella con árbol de té, orientada a piel que hace granitos. El árbol de té tiene evidencia razonable, pero sigue siendo un aceite esencial.",
    comoUsar:
      "De noche, después de limpiar. Si tu piel reacciona fácil, probala primero en una zona chica.",
  },
  MLA43183566: {
    porQue:
      "Ampolla liviana con centella y péptidos, orientada a la apariencia del poro. Trae cobre, así que mejor no cruzarla con vitamina C pura.",
    comoUsar: "De noche, si de mañana usás vitamina C. Sobre la piel limpia.",
  },
};
