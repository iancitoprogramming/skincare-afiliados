import type { Producto } from "@/engine/recomendacion";

// GENERADO por scripts/importar-organize.ts desde el vault "Club de Piel / Organize".
// No editar a mano: se regenera. Lo editorial va en catalogo-overlay / activos.ts.
//
// TODOS salen con activo:false porque el vault NO trae link de afiliado ni precio.
// Para activar uno: pegar link_afiliado, precio_ars, por_que y como_usar, y poner
// activo:true. Mientras tanto no se le muestran a nadie, que es lo correcto.

export const productosOrganize: Producto[] = [
  {
    // ORIENTADOS A PIEL SECA
    // FPS 30 en un hidratante, no reemplaza al protector · Sin INCI verificado: no se le mapean activos y el motor no opina sobre su fórmula.
    id: "d47c5c7f-88f8-5547-8ee2-440abda55985",
    ml_id: "MLA67629151",
    nombre: "Avene Hydrance Spf30 Crema Facial Hidratante Piel Sensible",
    marca: "Avène",
    categoria: "hidratante",
    paso: 0,
    momento: "ambos",
    tipos_piel: ["grasa","mixta","normal","seca","sensible"],
    preocupaciones: [],
    origen: "europeo",
    apto_sensible: true,
    rango_precio: 3, // provisional, por marca
    link_afiliado: "", // TODO: sin esto el producto NO monetiza
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA67629151",
    relevado: "2026-09-06",
    prioridad: 4,
    comodin: false,
    activo: false,
  },
  {
    // ORIENTADOS A PIEL SECA
    // 14 ingredientes, sin fragancia. La fórmula más corta del catálogo y esa es su propuesta.
    // no va a → grasa: textura rica
    id: "6fe42157-e35e-5446-a929-217b76a0eb49",
    ml_id: "MLA23143346",
    nombre: "Avene Tolerance Control Crema Apaisante Restauradora X 40 Tipo de piel Sensible",
    marca: "Avène",
    categoria: "hidratante",
    paso: 0,
    momento: "ambos",
    tipos_piel: ["mixta","normal","seca","sensible"],
    preocupaciones: ["deshidratacion"],
    origen: "europeo",
    apto_sensible: true,
    rango_precio: 3, // provisional, por marca
    link_afiliado: "https://meli.la/1LRTaMn",
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA23143346",
    relevado: "2026-09-06",
    prioridad: 5,
    comodin: false,
    activo: false,
  },
  {
    // (raíz)
    // no va a → sensible: Ácido láctico (AHA/BHA), vitamina C pura, Fragancia
    id: "0dd6a780-c079-5225-a8ba-abf771937d09",
    ml_id: "MLA21174873",
    nombre: "Crema Facial Isdin Ureadin Fusion Melting Cream 50ml - Piel Normal",
    marca: "ISDIN",
    categoria: "hidratante",
    paso: 0,
    momento: "ambos",
    tipos_piel: ["grasa","mixta","normal","seca"],
    preocupaciones: ["textura","deshidratacion","manchas"],
    origen: "europeo",
    apto_sensible: false,
    rango_precio: 2, // provisional, por marca
    link_afiliado: "https://meli.la/1D8LvKN",
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA21174873",
    relevado: "2026-09-06",
    prioridad: 4,
    comodin: false,
    activo: false,
  },
  {
    // (raíz)
    // no va a → sensible: Ácido salicílico (AHA/BHA), Alcohol denat, Fragancia
    // no va a → seca: gel anti-imperfecciones con salicílico y alcohol: le saca a una piel seca lo poco que le queda
    id: "786825f8-fa3a-5ae3-9a12-3514acff04d9",
    ml_id: "MLA35115621",
    nombre: "Crema Gel Hidratante Anti-imperfecciones Garnier 50ml",
    marca: "Garnier",
    categoria: "hidratante",
    paso: 0,
    momento: "ambos",
    tipos_piel: ["grasa","mixta","normal"],
    preocupaciones: ["manchas","deshidratacion","acne","textura"],
    origen: "europeo",
    apto_sensible: false,
    rango_precio: 1, // provisional, por marca
    link_afiliado: "https://meli.la/2tBuQVW",
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA35115621",
    relevado: "2026-09-06",
    prioridad: 4,
    comodin: false,
    activo: false,
  },
  {
    // ORIENTADOS A PIEL SECA
    // no va a → sensible: Alcohol denat
    id: "808e43ee-9a93-5cf2-ae71-8210102219b0",
    ml_id: "MLA9210936",
    nombre: "Crema Hidratante Eucerin Aquaporin Active para piel mixta-normal de 50mL",
    marca: "Eucerin",
    categoria: "hidratante",
    paso: 0,
    momento: "ambos",
    tipos_piel: ["grasa","mixta","normal","seca"],
    preocupaciones: ["deshidratacion"],
    origen: "europeo",
    apto_sensible: false,
    rango_precio: 2, // provisional, por marca
    link_afiliado: "https://meli.la/1BRdsTo",
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA9210936",
    relevado: "2026-09-06",
    prioridad: 4,
    comodin: false,
    activo: false,
  },
  {
    // (raíz)
    // no va a → sensible: Fragancia
    id: "e8a48fe9-e89b-5f22-ae91-e6aba34acf8a",
    ml_id: "MLA19899495",
    nombre: "Crema Hidratante facial Neutrogena Hydro Boost water gel 50 GR - Todo tipo de Piel",
    marca: "Neutrogena",
    categoria: "hidratante",
    paso: 0,
    momento: "ambos",
    tipos_piel: ["grasa","mixta","normal","seca"],
    preocupaciones: ["deshidratacion"],
    origen: "europeo",
    apto_sensible: false,
    rango_precio: 1, // provisional, por marca
    link_afiliado: "", // TODO: sin esto el producto NO monetiza
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA19899495",
    relevado: "2026-09-06",
    prioridad: 3,
    comodin: false,
    activo: false,
  },
  {
    // ORIENTADOS A PIEL GRASA
    // FPS 15: insuficiente como protector solar · Lleva FPS 15: no alcanza como protección diaria, por eso está como hidratante.
    // no va a → sensible: filtro solar químico, Alcohol denat, Fragancia
    id: "d0d3332a-fc59-5b58-96c8-77f6fb8eabde",
    ml_id: "MLA9855881",
    nombre: "Eucerin Hyaluron - Filler Día Piel Normal a Mixta Fps15 X 50m",
    marca: "Eucerin",
    categoria: "hidratante",
    paso: 0,
    momento: "ambos",
    tipos_piel: ["grasa","mixta","normal","seca"],
    preocupaciones: ["manchas","deshidratacion"],
    origen: "europeo",
    apto_sensible: false,
    rango_precio: 3, // provisional, por marca
    link_afiliado: "https://meli.la/22Mh3Rb",
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA9855881",
    relevado: "2026-09-06",
    prioridad: 3,
    comodin: false,
    activo: false,
  },
  {
    // ORIENTADOS A PIEL SECA
    id: "9e56836d-95e8-5f74-b707-65927d4d01c0",
    ml_id: "MLA22990183",
    nombre: "Gel Crema Hidratante Facial Piel Sensible Seca - Mixta Aveno 50g",
    marca: "Aveno",
    categoria: "hidratante",
    paso: 0,
    momento: "ambos",
    tipos_piel: ["grasa","mixta","normal","seca","sensible"],
    preocupaciones: ["deshidratacion"],
    origen: "nacional",
    apto_sensible: true,
    rango_precio: 1, // provisional, por marca
    link_afiliado: "https://meli.la/31jBrGU",
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA22990183",
    relevado: "2026-09-06",
    prioridad: 4,
    comodin: false,
    activo: false,
  },
  {
    // ORIENTADOS A PIEL GRASA
    // hidratante matificante, no es un sérum
    // no va a → sensible: LHA (capriloil salicílico) (AHA/BHA), Ácido salicílico (AHA/BHA), Alcohol denat, Fragancia
    // no va a → seca: matificante con LHA y alcohol: le saca a una piel seca lo poco que le queda
    id: "353d07b5-d81e-5866-8a98-4e8801e5fd0a",
    ml_id: "MLA9196384",
    nombre: "La Roche-Posay Effaclar Mat 40 mL",
    marca: "La Roche-Posay",
    categoria: "hidratante",
    paso: 0,
    momento: "ambos",
    tipos_piel: ["grasa","mixta","normal"],
    preocupaciones: ["acne","textura"],
    origen: "europeo",
    apto_sensible: false,
    rango_precio: 2, // provisional, por marca
    link_afiliado: "https://meli.la/2PQYHsi",
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA9196384",
    relevado: "2026-09-06",
    prioridad: 4,
    comodin: false,
    activo: false,
  },
  {
    // (raíz)
    // no va a → sensible: Ácido salicílico (AHA/BHA), LHA (capriloil salicílico) (AHA/BHA), Fragancia
    // no va a → seca: agua micelar con salicílico: le saca a una piel seca lo poco que le queda
    id: "3b6b8c59-405a-5357-b92f-37f1e9ee58bc",
    ml_id: "MLA24300545",
    nombre: "Agua Micelar Anti-imperfecciones Con Ácido Salicílico Garnier 400ml",
    marca: "Garnier",
    categoria: "limpiador",
    paso: 0,
    momento: "ambos",
    tipos_piel: ["grasa","mixta","normal"],
    preocupaciones: ["acne","textura","manchas"],
    origen: "europeo",
    apto_sensible: false,
    rango_precio: 1, // provisional, por marca
    link_afiliado: "https://meli.la/2FJaxYb",
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA24300545",
    relevado: "2026-09-06",
    prioridad: 3,
    comodin: false,
    activo: false,
  },
  {
    // (raíz)
    // Sin INCI verificado.
    id: "8fe63985-3796-5e78-9de6-de0a82281a49",
    ml_id: "MLA20546060",
    nombre: "Agua Micelar Todo en 1 Garnier 400ml",
    marca: "Garnier",
    categoria: "limpiador",
    paso: 0,
    momento: "ambos",
    tipos_piel: ["grasa","mixta","normal","seca","sensible"],
    preocupaciones: [],
    origen: "europeo",
    apto_sensible: true,
    rango_precio: 1, // provisional, por marca
    link_afiliado: "https://meli.la/2EeBV4a",
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA20546060",
    relevado: "2026-09-06",
    prioridad: 3,
    comodin: false,
    activo: false,
  },
  {
    // Orientados a piel mixta
    // no va a → seca: gel espumoso, formulado para piel normal a grasa: le saca a una piel seca lo poco que le queda
    id: "52747e64-8f8a-5be8-b935-6ef7e5ad517b",
    ml_id: "MLAU141343879",
    nombre: "Cerave Gel Limpiador Espumoso",
    marca: "CeraVe",
    categoria: "limpiador",
    paso: 0,
    momento: "ambos",
    tipos_piel: ["grasa","mixta","normal","sensible"],
    preocupaciones: ["deshidratacion","manchas"],
    origen: "europeo",
    apto_sensible: true,
    rango_precio: 2, // provisional, por marca
    link_afiliado: "https://meli.la/1rfMXV1",
    url_referencia: "https://www.mercadolibre.com.ar/up/MLAU141343879",
    relevado: "2026-09-06",
    prioridad: 4,
    comodin: false,
    activo: false,
  },
  {
    // ORIENTADOS A PIEL GRASA
    // no va a → sensible: Ácido salicílico (AHA/BHA)
    // no va a → seca: control de sebo: le saca a una piel seca lo poco que le queda
    id: "2de5e9f9-c212-5e1d-9828-d90c7aff3de9",
    ml_id: "MLA37349507",
    nombre: "Eucerin Dermopure Oil Control Gel Limpiador Facial 400ml",
    marca: "Eucerin",
    categoria: "limpiador",
    paso: 0,
    momento: "ambos",
    tipos_piel: ["grasa","mixta","normal"],
    preocupaciones: ["acne","textura"],
    origen: "europeo",
    apto_sensible: false,
    rango_precio: 2, // provisional, por marca
    link_afiliado: "https://meli.la/2mjSuZ3",
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA37349507",
    relevado: "2026-09-06",
    prioridad: 4,
    comodin: false,
    activo: false,
  },
  {
    // (raíz)
    // no va a → sensible: Ácido salicílico (AHA/BHA)
    // no va a → seca: gel anti-imperfecciones con salicílico: le saca a una piel seca lo poco que le queda
    id: "069e085b-93f0-5e5e-a907-a409f3e4f8d9",
    ml_id: "MLA47671534",
    nombre: "Gel Limpiador Crema Hidratante Anti Imperfecciones Garnier 250ml",
    marca: "Garnier",
    categoria: "limpiador",
    paso: 0,
    momento: "ambos",
    tipos_piel: ["grasa","mixta","normal"],
    preocupaciones: ["manchas","deshidratacion","acne","textura"],
    origen: "europeo",
    apto_sensible: false,
    rango_precio: 1, // provisional, por marca
    link_afiliado: "https://meli.la/2hh95rn",
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA47671534",
    relevado: "2026-09-06",
    prioridad: 3,
    comodin: false,
    activo: false,
  },
  {
    // ORIENTADOS A PIEL SECA
    id: "7787bab2-6a2e-5aae-be68-d587cba8588e",
    ml_id: "MLA53897352",
    nombre: "Gel limpiador hidratante Neutrogena Hydro Boost, 150 ml, para todo tipo de piel",
    marca: "Neutrogena",
    categoria: "limpiador",
    paso: 0,
    momento: "ambos",
    tipos_piel: ["grasa","mixta","normal","seca","sensible"],
    preocupaciones: ["deshidratacion"],
    origen: "europeo",
    apto_sensible: true,
    rango_precio: 1, // provisional, por marca
    link_afiliado: "", // TODO: sin esto el producto NO monetiza
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA53897352",
    relevado: "2026-09-06",
    prioridad: 3,
    comodin: false,
    activo: false,
  },
  {
    // ORIENTADOS A PIEL SECA
    // Syndet sin jabón, pensado para piel atópica. Sin fragancia.
    // no va a → grasa: textura rica
    id: "85bb5010-01e6-51c2-a42b-ff7b6309d590",
    ml_id: "MLA16135276",
    nombre: "La Roche-posay Lipikar Syndet Ap+ 200 Ml",
    marca: "La Roche-Posay",
    categoria: "limpiador",
    paso: 0,
    momento: "ambos",
    tipos_piel: ["mixta","normal","seca","sensible"],
    preocupaciones: ["manchas","deshidratacion"],
    origen: "europeo",
    apto_sensible: true,
    rango_precio: 2, // provisional, por marca
    link_afiliado: "", // TODO: sin esto el producto NO monetiza
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA16135276",
    relevado: "2026-09-06",
    prioridad: 5,
    comodin: false,
    activo: false,
  },
  {
    // ORIENTADOS A PIEL GRASA
    id: "677a05dc-1afc-5840-8b42-4a09c03ee1cd",
    ml_id: "MLA35427636",
    nombre: "Limpiador en Gel Beauty Of Joseon Ciruela Verde 100ml Piel Grasa",
    marca: "Beauty of Joseon",
    categoria: "limpiador",
    paso: 0,
    momento: "ambos",
    tipos_piel: ["grasa","mixta","normal","seca","sensible"],
    preocupaciones: [],
    origen: "coreano",
    apto_sensible: true,
    rango_precio: 2, // provisional, por marca
    link_afiliado: "https://meli.la/2enTXSc",
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA35427636",
    relevado: "2026-09-06",
    prioridad: 4,
    comodin: false,
    activo: false,
  },
  {
    // ORIENTADOS A PIEL SECA
    // Para piel atópica. Sin fragancia.
    // no va a → grasa: textura rica
    id: "4be59db9-22f1-56c6-9ffe-21301474f42c",
    ml_id: "MLA20030752",
    nombre: "Limpiador Facial y Corporal Restaurador de la Piel Cetaphil Pro Ad Restoraderm para Pieles Atópicas",
    marca: "Cetaphil",
    categoria: "limpiador",
    paso: 0,
    momento: "ambos",
    tipos_piel: ["mixta","normal","seca","sensible"],
    preocupaciones: ["manchas","deshidratacion"],
    origen: "europeo",
    apto_sensible: true,
    rango_precio: 3, // provisional, por marca
    link_afiliado: "https://meli.la/2XbQBQ8",
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA20030752",
    relevado: "2026-09-06",
    prioridad: 5,
    comodin: false,
    activo: false,
  },
  {
    // ORIENTADOS A PIEL SECA
    // no va a → grasa: textura rica
    id: "8293ef2d-878f-5dc7-85df-5254c10d8812",
    ml_id: "MLA37598876",
    nombre: "Limpiador Hidratante Cerave Piel Normal A Seca X 236ml",
    marca: "CeraVe",
    categoria: "limpiador",
    paso: 0,
    momento: "ambos",
    tipos_piel: ["mixta","normal","seca","sensible"],
    preocupaciones: ["deshidratacion"],
    origen: "europeo",
    apto_sensible: true,
    rango_precio: 2, // provisional, por marca
    link_afiliado: "https://meli.la/1HXhaNM",
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA37598876",
    relevado: "2026-09-06",
    prioridad: 5,
    comodin: false,
    activo: false,
  },
  {
    // ORIENTADOS A PIEL GRASA
    // no va a → sensible: filtro solar químico, Alcohol denat
    // no va a → seca: oil control: le saca a una piel seca lo poco que le queda
    id: "0cd46bf5-012f-5327-a946-2f0f6fdce296",
    ml_id: "MLA19504960",
    nombre: "Eucerin Sun Oil Control Protector Solar Facial Tono medio FPS 50 x 50 ml",
    marca: "Eucerin",
    categoria: "protector_solar",
    paso: 0,
    momento: "am",
    tipos_piel: ["grasa","mixta","normal"],
    preocupaciones: ["manchas","deshidratacion"],
    origen: "europeo",
    apto_sensible: false,
    rango_precio: 2, // provisional, por marca
    link_afiliado: "https://meli.la/1xyAzGu",
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA19504960",
    relevado: "2026-09-06",
    prioridad: 4,
    comodin: false,
    activo: false,
  },
  {
    // ORIENTADOS A PIEL GRASA
    // no va a → sensible: filtro solar químico, Alcohol denat
    // no va a → seca: oil control: le saca a una piel seca lo poco que le queda
    id: "093dc761-466b-5ac6-a91d-00f5fe2a9e32",
    ml_id: "MLAU3133622625",
    nombre: "Protector Solar Anthelios Oil Control Fps50+ 50 Ml",
    marca: "La Roche-Posay",
    categoria: "protector_solar",
    paso: 0,
    momento: "am",
    tipos_piel: ["grasa","mixta","normal"],
    preocupaciones: ["manchas"],
    origen: "europeo",
    apto_sensible: false,
    rango_precio: 3, // provisional, por marca
    link_afiliado: "https://meli.la/1pVjW5o",
    url_referencia: "https://www.mercadolibre.com.ar/up/MLAU3133622625",
    relevado: "2026-09-06",
    prioridad: 5,
    comodin: false,
    activo: false,
  },
  {
    // ORIENTADOS A PIEL GRASA
    // no va a → sensible: filtro solar químico, Alcohol denat
    // no va a → seca: efecto mate: le saca a una piel seca lo poco que le queda
    id: "8fc7d68c-575a-5d51-b26a-a8d4f6910871",
    ml_id: "MLA16048424",
    nombre: "Protector Solar Color Efecto Mate Anthelios Fps 50+ La Roche",
    marca: "La Roche-Posay",
    categoria: "protector_solar",
    paso: 0,
    momento: "am",
    tipos_piel: ["grasa","mixta","normal"],
    preocupaciones: ["manchas","acne"],
    origen: "europeo",
    apto_sensible: false,
    rango_precio: 3, // provisional, por marca
    link_afiliado: "", // TODO: sin esto el producto NO monetiza
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA16048424",
    relevado: "2026-09-06",
    prioridad: 4,
    comodin: false,
    activo: false,
  },
  {
    // ORIENTADOS A PIEL GRASA
    // Filtro de UVA hasta 400 nm + óxidos de hierro. Es el mejor del catálogo para manchas.
    // no va a → sensible: filtro solar químico, Alcohol denat
    id: "5d60fad9-e033-5346-8f50-790dc29d6f3a",
    ml_id: "MLA58897902",
    nombre: "Protector solar La Roche-Posay Anthelios UVMUNE 400 50FPS en crema 50mL con COLOR",
    marca: "La Roche-Posay",
    categoria: "protector_solar",
    paso: 0,
    momento: "am",
    tipos_piel: ["grasa","mixta","normal","seca"],
    preocupaciones: ["manchas"],
    origen: "europeo",
    apto_sensible: false,
    rango_precio: 3, // provisional, por marca
    link_afiliado: "https://meli.la/2AgbA84",
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA58897902",
    relevado: "2026-09-06",
    prioridad: 5,
    comodin: false,
    activo: false,
  },
  {
    // (raíz)
    // FPS 50+, protector en textura sérum
    // no va a → sensible: filtro solar químico, Ácido salicílico (AHA/BHA), Alcohol denat, Fragancia
    // no va a → seca: anti-imperfecciones con salicílico: le saca a una piel seca lo poco que le queda
    id: "a4929a81-b3b1-5990-93dd-26929da26278",
    ml_id: "MLA63460365",
    nombre: "Sérum Protector Solar Anti Imperfecciones Fps50+ Garnie",
    categoria: "protector_solar",
    paso: 0,
    momento: "am",
    tipos_piel: ["grasa","mixta","normal"],
    preocupaciones: ["manchas","deshidratacion","acne","textura"],
    origen: "europeo",
    apto_sensible: false,
    rango_precio: 2, // provisional, por marca
    link_afiliado: "", // TODO: sin esto el producto NO monetiza
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA63460365",
    relevado: "2026-09-06",
    prioridad: 4,
    comodin: false,
    activo: false,
  },
  {
    // Retinoles
    // Comodín de la categoría: sin uno, el motor revienta cuando se abre el Tier 4.
    // no va a → sensible: Retinol, Fragancia
    id: "463f3803-17e2-566e-8226-254fe7546889",
    ml_id: "MLA58622882",
    nombre: "Crema Retinol Boost Anti-arrugas Neutrogena 30ml Todo Tipo De Piel Día-noche",
    marca: "Neutrogena",
    categoria: "retinoide",
    paso: 0,
    momento: "pm",
    tipos_piel: ["grasa","mixta","normal","seca"],
    preocupaciones: ["textura","deshidratacion"],
    origen: "europeo",
    apto_sensible: false,
    rango_precio: 2, // provisional, por marca
    link_afiliado: "https://meli.la/2zvq95Y",
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA58622882",
    relevado: "2026-09-06",
    prioridad: 4,
    comodin: true,
    activo: false,
  },
  {
    // Retinoles
    // no va a → sensible: Retinol, Retinil palmitato, Fragancia
    id: "07628bc3-918c-5cca-a643-60ef9be1a864",
    ml_id: "MLA20021768",
    nombre: "Eximia Hyalu-r Concentre Serum Antiedad X 15 Ml",
    marca: "Eximia",
    categoria: "retinoide",
    paso: 0,
    momento: "pm",
    tipos_piel: ["grasa","mixta","normal","seca"],
    preocupaciones: ["textura","manchas","deshidratacion"],
    origen: "nacional",
    apto_sensible: false,
    rango_precio: 2, // provisional, por marca
    link_afiliado: "https://meli.la/2XtPwss",
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA20021768",
    relevado: "2026-09-06",
    prioridad: 3,
    comodin: false,
    activo: false,
  },
  {
    // Retinoles
    // Se anuncia 'incluso piel sensible' y lleva alcohol denat y fragancia. Manda el INCI.
    // no va a → sensible: Retinol, Retinil palmitato, Alcohol denat, Fragancia
    id: "24fe4638-63d5-5fd1-8e2d-07c15ffabda3",
    ml_id: "MLAU244146565",
    nombre: "La Roche Posay Retinol B3 Sérum Regenerador X 30 Ml Todo Tipo De Piel, Incluso Sensible.",
    marca: "La Roche-Posay",
    categoria: "retinoide",
    paso: 0,
    momento: "pm",
    tipos_piel: ["grasa","mixta","normal","seca"],
    preocupaciones: ["textura","manchas","deshidratacion"],
    origen: "europeo",
    apto_sensible: false,
    rango_precio: 3, // provisional, por marca
    link_afiliado: "", // TODO: sin esto el producto NO monetiza
    url_referencia: "https://www.mercadolibre.com.ar/up/MLAU244146565",
    relevado: "2026-09-06",
    prioridad: 5,
    comodin: false,
    activo: false,
  },
  {
    // Orientados a piel mixta
    // no va a → sensible: Fragancia
    id: "826faa38-3298-5428-927d-639265ebb5e6",
    ml_id: "MLAU209241342",
    nombre: "Dermaglós Serum Facial Niacinamida X 30 Ml Todo Tipo De Piel Día-noche",
    marca: "Dermaglós",
    categoria: "serum_activo",
    paso: 0,
    momento: "ambos",
    tipos_piel: ["grasa","mixta","normal","seca"],
    preocupaciones: ["manchas","deshidratacion","acne"],
    origen: "nacional",
    apto_sensible: false,
    rango_precio: 1, // provisional, por marca
    link_afiliado: "https://meli.la/1QPrueC",
    url_referencia: "https://www.mercadolibre.com.ar/up/MLAU209241342",
    relevado: "2026-09-06",
    prioridad: 3,
    comodin: false,
    activo: false,
  },
  {
    // Niacinamidas
    id: "31342eb5-4fb3-5bb8-949f-68065a203409",
    ml_id: "MLAU1655818860",
    nombre: "Detenage N 10% Niacinamida Serum Facial Antiedad 30ml",
    marca: "Detenage",
    categoria: "serum_activo",
    paso: 0,
    momento: "ambos",
    tipos_piel: ["grasa","mixta","normal","seca","sensible"],
    preocupaciones: ["manchas","deshidratacion"],
    origen: "nacional",
    apto_sensible: true,
    rango_precio: 2, // provisional, por marca
    link_afiliado: "https://meli.la/1Sgtcvw",
    url_referencia: "https://www.mercadolibre.com.ar/up/MLAU1655818860",
    relevado: "2026-09-06",
    prioridad: 4,
    comodin: false,
    activo: false,
  },
  {
    // Niacinamidas
    // Se vende como sérum de niacinamida y trae tranexámico más un complejo de AHA.
    // no va a → sensible: Ácido glicólico (AHA/BHA), Ácido láctico (AHA/BHA), Ácido málico (AHA/BHA), Ácido tartárico (AHA/BHA), Alcohol denat, Fragancia
    id: "4bc1f9e9-cd68-5e76-9a87-6187919f6287",
    ml_id: "MLA29882074",
    nombre: "Eximia Hyalu-n Concentre X 15 Ml Tipo de piel Todo tipo de piel",
    marca: "Eximia",
    categoria: "serum_activo",
    paso: 0,
    momento: "ambos",
    tipos_piel: ["grasa","mixta","normal","seca"],
    preocupaciones: ["manchas","deshidratacion","textura"],
    origen: "nacional",
    apto_sensible: false,
    rango_precio: 2, // provisional, por marca
    link_afiliado: "https://meli.la/2Z3JW7S",
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA29882074",
    relevado: "2026-09-06",
    prioridad: 3,
    comodin: false,
    activo: false,
  },
  {
    // Vitamina C
    // 12% de ascórbico, pero también salicílico, alcohol y fragancia.
    // no va a → sensible: vitamina C pura, Ácido salicílico (AHA/BHA), Alcohol denat, Fragancia
    id: "f9972d79-114b-5a31-b8e5-3b4b3ab140a6",
    ml_id: "MLA47223033",
    nombre: "La Roche Posay Pure Vitamin C12 Serum",
    marca: "La Roche-Posay",
    categoria: "serum_activo",
    paso: 0,
    momento: "ambos",
    tipos_piel: ["grasa","mixta","normal","seca"],
    preocupaciones: ["manchas","acne","textura","deshidratacion"],
    origen: "europeo",
    apto_sensible: false,
    rango_precio: 3, // provisional, por marca
    link_afiliado: "https://meli.la/1XJg8Nt",
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA47223033",
    relevado: "2026-09-06",
    prioridad: 4,
    comodin: false,
    activo: false,
  },
  {
    // Vitamina C
    // no va a → sensible: vitamina C pura
    id: "f97e6ed9-4133-50a5-b4fe-4f5780557aab",
    ml_id: "MLA19710676",
    nombre: "Liftactiv Supreme Vitamina C Serum 20ml Vichy",
    marca: "Vichy",
    categoria: "serum_activo",
    paso: 0,
    momento: "ambos",
    tipos_piel: ["grasa","mixta","normal","seca"],
    preocupaciones: ["manchas","deshidratacion"],
    origen: "europeo",
    apto_sensible: false,
    rango_precio: 3, // provisional, por marca
    link_afiliado: "https://meli.la/2RZ82c3",
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA19710676",
    relevado: "2026-09-06",
    prioridad: 4,
    comodin: false,
    activo: false,
  },
  {
    // ORIENTADOS A PIEL GRASA
    // no va a → sensible: Ácido salicílico (AHA/BHA), Ácido láctico (AHA/BHA), Ácido fítico (AHA/BHA), Alcohol denat, Fragancia
    // no va a → seca: apila BHA, AHA y alcohol: le saca a una piel seca lo poco que le queda
    id: "e7bb0026-7146-514d-8ac0-056f82a5f465",
    ml_id: "MLA22843182",
    nombre: "Sérum Anti-imperfecciones con Ácido Salicílico de Garnier 30ml",
    marca: "Garnier",
    categoria: "serum_activo",
    paso: 0,
    momento: "ambos",
    tipos_piel: ["grasa","mixta","normal"],
    preocupaciones: ["manchas","deshidratacion","acne","textura"],
    origen: "europeo",
    apto_sensible: false,
    rango_precio: 1, // provisional, por marca
    link_afiliado: "https://meli.la/1DCQJzi",
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA22843182",
    relevado: "2026-09-06",
    prioridad: 4,
    comodin: false,
    activo: false,
  },
  {
    // Vitamina C
    // no va a → sensible: vitamina C pura
    id: "72651e35-bd63-5f51-880b-30cbc19cb5c4",
    ml_id: "MLA45672941",
    nombre: "Sérum Brightening Kosmos Vitamina C Pura",
    marca: "Kosmos",
    categoria: "serum_activo",
    paso: 0,
    momento: "ambos",
    tipos_piel: ["grasa","mixta","normal","seca"],
    preocupaciones: ["manchas","deshidratacion"],
    origen: "nacional",
    apto_sensible: false,
    rango_precio: 2, // provisional, por marca
    link_afiliado: "https://meli.la/1Cxs4p7",
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA45672941",
    relevado: "2026-09-06",
    prioridad: 5,
    comodin: false,
    activo: false,
  },
  {
    // Niacinamidas
    // Melasyl tiene un ECA contra hidroquinona 4%. Ojo: trae retinil palmitato.
    // no va a → sensible: Retinil palmitato, LHA (capriloil salicílico) (AHA/BHA), Fragancia
    id: "bd3180fa-aaaf-5bf7-a6ac-dd0e6cfd92da",
    ml_id: "MLA34459961",
    nombre: "Sérum La Roche-Posay Mela B3 Antimanchas con Niacinamida 30ml",
    marca: "La Roche-Posay",
    categoria: "serum_activo",
    paso: 0,
    momento: "ambos",
    tipos_piel: ["grasa","mixta","normal","seca"],
    preocupaciones: ["manchas","deshidratacion","textura","acne"],
    origen: "europeo",
    apto_sensible: false,
    rango_precio: 3, // provisional, por marca
    link_afiliado: "", // TODO: sin esto el producto NO monetiza
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA34459961",
    relevado: "2026-09-06",
    prioridad: 5,
    comodin: false,
    activo: false,
  },
  {
    // Niacinamidas
    // Segunda publicación del mismo producto que MLA34459961. Prioridad menor para no repetirlo.
    // no va a → sensible: Retinil palmitato, LHA (capriloil salicílico) (AHA/BHA), Fragancia
    id: "ecd8932e-d99a-5c53-ad94-edcbeba21fb4",
    ml_id: "MLA26197969",
    nombre: "Sérum La Roche-Posay Mela B3 Antimanchas con Niacinamida 30ml Opcion 2",
    marca: "La Roche-Posay",
    categoria: "serum_activo",
    paso: 0,
    momento: "ambos",
    tipos_piel: ["grasa","mixta","normal","seca"],
    preocupaciones: ["manchas","deshidratacion","textura","acne"],
    origen: "europeo",
    apto_sensible: false,
    rango_precio: 3, // provisional, por marca
    link_afiliado: "https://meli.la/2rXvDa4",
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA26197969",
    relevado: "2026-09-06",
    prioridad: 4,
    comodin: false,
    activo: false,
  },
  {
    // Vitamina C
    // Es la fórmula del paper de Duke: 15% ascórbico + 1% tocoferol + 0,5% ferúlico.
    // no va a → sensible: vitamina C pura
    id: "f0b2811c-90dc-544d-b3db-3d7711faf69f",
    ml_id: "MLA24840827",
    nombre: "Skinceuticals C E Ferulic Sérum De Ácido Ferúlico 30ml Todo Tipo De Piel Día-noche",
    marca: "SkinCeuticals",
    categoria: "serum_activo",
    paso: 0,
    momento: "ambos",
    tipos_piel: ["grasa","mixta","normal","seca"],
    preocupaciones: ["manchas","deshidratacion"],
    origen: "europeo",
    apto_sensible: false,
    rango_precio: 3, // provisional, por marca
    link_afiliado: "https://meli.la/1V91gHN",
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA24840827",
    relevado: "2026-09-06",
    prioridad: 5,
    comodin: false,
    activo: false,
  },
  {
    // Ampoules
    // no va a → sensible: Aceite esencial de romero
    id: "04b77f59-3bf6-5b04-9a5e-e7662616f848",
    ml_id: "MLA45338822",
    nombre: "Celimax The Real Noni Energy Ampoule Serum",
    marca: "Celimax",
    categoria: "serum_secundario",
    paso: 0,
    momento: "ambos",
    tipos_piel: ["grasa","mixta","normal","seca"],
    preocupaciones: ["deshidratacion"],
    origen: "coreano",
    apto_sensible: false,
    rango_precio: 2, // provisional, por marca
    link_afiliado: "https://meli.la/1wqWqrz",
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA45338822",
    relevado: "2026-09-06",
    prioridad: 4,
    comodin: false,
    activo: false,
  },
  {
    // Acido Hialuronico
    // sérum de hialurónico · Trae gluconato de cobre: el motor lo va a separar de la vitamina C pura.
    // no va a → sensible: Fragancia
    id: "dd122b0b-ead4-5bef-a516-ce238f45ae57",
    ml_id: "MLA45991792",
    nombre: "Eximia Hyalu B Concentré Serum Antiedad X 30ml",
    marca: "Eximia",
    categoria: "serum_secundario",
    paso: 0,
    momento: "ambos",
    tipos_piel: ["grasa","mixta","normal","seca"],
    preocupaciones: ["deshidratacion","manchas","acne"],
    origen: "nacional",
    apto_sensible: false,
    rango_precio: 2, // provisional, por marca
    link_afiliado: "https://meli.la/1KU9QZY",
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA45991792",
    relevado: "2026-09-06",
    prioridad: 3,
    comodin: false,
    activo: false,
  },
  {
    // Acido Hialuronico
    // sérum de hialurónico
    // no va a → sensible: Alcohol denat, Fragancia
    id: "bad3b1e1-4cdb-55e8-87b8-3b8d81c16579",
    ml_id: "MLA12754368",
    nombre: "La Roche Posay Hyalu B5 Serum 30 ml",
    marca: "La Roche-Posay",
    categoria: "serum_secundario",
    paso: 0,
    momento: "ambos",
    tipos_piel: ["grasa","mixta","normal","seca"],
    preocupaciones: ["deshidratacion"],
    origen: "europeo",
    apto_sensible: false,
    rango_precio: 3, // provisional, por marca
    link_afiliado: "", // TODO: sin esto el producto NO monetiza
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA12754368",
    relevado: "2026-09-06",
    prioridad: 4,
    comodin: false,
    activo: false,
  },
  {
    // ORIENTADOS A PIEL GRASA
    // booster hidratante, no lleva activo dirigido · Comodín de la categoría: lista corta, sin fragancia, le sirve a cualquier piel.
    id: "5603d4f7-3e32-586b-8655-8e6acffe2468",
    ml_id: "MLA18964459",
    nombre: "Sérum Ácido Hialurónico Vichy Minéral 89 Booster Hidratante Gel 50ml",
    marca: "Vichy",
    categoria: "serum_secundario",
    paso: 0,
    momento: "ambos",
    tipos_piel: ["grasa","mixta","normal","seca","sensible"],
    preocupaciones: ["deshidratacion"],
    origen: "europeo",
    apto_sensible: true,
    rango_precio: 2, // provisional, por marca
    link_afiliado: "https://meli.la/2iXjeCp",
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA18964459",
    relevado: "2026-09-06",
    prioridad: 4,
    comodin: true,
    activo: false,
  },
  {
    // Acido Hialuronico
    // sérum de hialurónico
    // no va a → sensible: Fragancia
    id: "914fa2b9-679c-50cb-a01e-e7713bfcbba3",
    ml_id: "MLA22655637",
    nombre: "Serum Hidratante Concentrado Neutrogena® Hydro Boost 30 Ml",
    marca: "Neutrogena",
    categoria: "serum_secundario",
    paso: 0,
    momento: "ambos",
    tipos_piel: ["grasa","mixta","normal","seca"],
    preocupaciones: ["deshidratacion"],
    origen: "europeo",
    apto_sensible: false,
    rango_precio: 1, // provisional, por marca
    link_afiliado: "https://meli.la/17ssJ5t",
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA22655637",
    relevado: "2026-09-06",
    prioridad: 3,
    comodin: false,
    activo: false,
  },
  {
    // Acido Hialuronico
    // sérum de hialurónico
    id: "ace75d88-f5d6-5ec8-9ec2-02fe2525dc3b",
    ml_id: "MLA18956615",
    nombre: "Sérum Rostro Revitalift Ácido Hialurónico L'Oréal Paris 30ml",
    categoria: "serum_secundario",
    paso: 0,
    momento: "ambos",
    tipos_piel: ["grasa","mixta","normal","seca","sensible"],
    preocupaciones: ["deshidratacion","manchas"],
    origen: "europeo",
    apto_sensible: true,
    rango_precio: 1, // provisional, por marca
    link_afiliado: "https://meli.la/2af2zRS",
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA18956615",
    relevado: "2026-09-06",
    prioridad: 3,
    comodin: false,
    activo: false,
  },
  {
    // Ampoules
    // no va a → sensible: Aceite esencial de árbol de té
    // no va a → seca: anti-sebo, con árbol de té: le saca a una piel seca lo poco que le queda
    id: "2fc14288-5884-5849-ba10-f35d48b14a74",
    ml_id: "MLA38719413",
    nombre: "Skin1004 Ampolla Serum Anti-acné Tea-trica Relief",
    marca: "Skin1004",
    categoria: "serum_secundario",
    paso: 0,
    momento: "ambos",
    tipos_piel: ["grasa","mixta","normal"],
    preocupaciones: ["deshidratacion","acne"],
    origen: "coreano",
    apto_sensible: false,
    rango_precio: 2, // provisional, por marca
    link_afiliado: "https://meli.la/2xDfY4m",
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA38719413",
    relevado: "2026-09-06",
    prioridad: 4,
    comodin: false,
    activo: false,
  },
  {
    // Ampoules
    // no va a → seca: minimiza poros, control de aceite: le saca a una piel seca lo poco que le queda
    id: "c88d5ad8-e7da-51ac-96c9-0f015dddfed2",
    ml_id: "MLA43183566",
    nombre: "Skin1004 Poremizing Fresh Ampoule",
    marca: "Skin1004",
    categoria: "serum_secundario",
    paso: 0,
    momento: "ambos",
    tipos_piel: ["grasa","mixta","normal","sensible"],
    preocupaciones: ["deshidratacion"],
    origen: "coreano",
    apto_sensible: true,
    rango_precio: 2, // provisional, por marca
    link_afiliado: "https://meli.la/31D3Hmf",
    url_referencia: "https://www.mercadolibre.com.ar/p/MLA43183566",
    relevado: "2026-09-06",
    prioridad: 3,
    comodin: false,
    activo: false,
  },
];
