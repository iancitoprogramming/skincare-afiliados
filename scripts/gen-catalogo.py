# One-shot: genera productos.ts desde los 26 links de afiliado ya resueltos.
# Datos scrapeados de los perfiles sociales de ML el 2026-09-05.
# Despues de correrlo, productos.ts vuelve a ser la fuente de verdad editable a mano.
# -*- coding: utf-8 -*-
import io, json, uuid

NS = uuid.UUID("6ba7b810-9dad-11d1-80b4-00c04fd430c8")

# n, ml_id, nombre, marca, categoria, momento, origen, apto_sensible, precio, tipos_piel, preocupaciones, prioridad, comodin, por_que, como_usar, vendedor, mas_vendido
P = [
(1,"MLA21801426","Espuma Facial Extra Suave Mousse Cleanser","Idraet","limpiador","ambos","nacional",True,23200,
 ["grasa","mixta","normal","seca","sensible"],["textura","deshidratacion"],3,True,
 "Mousse de limpieza suave: saca la mugre del dia sin dejar la piel tirante.",
 "Manana y noche, sobre la cara humeda.","Idraet",False),
(3,"MLAU140993030","Gel Limpiador Facial Espumoso 236 ml","CeraVe","limpiador","ambos","europeo",True,55620,
 ["grasa","mixta","normal"],["acne","textura"],3,False,
 "Gel espumoso para piel grasa o mixta, con ceramidas para no romper la barrera.",
 "Manana y noche. Si te reseca, dejalo solo de noche.","CeraVe",False),
(4,"MLA11139349","Low pH Good Morning Gel Cleanser 150 ml","COSRX","limpiador","ambos","coreano",True,37504,
 ["grasa","mixta","normal","seca","sensible"],["acne","textura","deshidratacion"],5,False,
 "Limpiador de pH bajo: respeta el manto acido de la piel, por eso cae bien a la manana.",
 "Manana y noche sobre la cara humeda, poca cantidad.","",False),
(6,"MLAU3453545171","Centella Cleansing Foam 150 ml","Mixsoon","limpiador","ambos","coreano",True,38399,
 ["grasa","mixta","normal","seca","sensible"],["acne","textura","deshidratacion"],4,False,
 "Espuma con centella, pensada para limpiar sin dejar la piel chirriando.",
 "Manana y noche sobre la cara humeda.","SKINKO",False),
(13,"MLAU3856054670","Centella Ampoule Foam 125 ml","Skin1004","limpiador","ambos","coreano",True,36719,
 ["grasa","mixta","normal","seca","sensible"],["acne","textura","deshidratacion"],5,True,
 "Espuma de centella asiatica. Limpia parejo y le va bien a casi cualquier piel.",
 "Manana y noche sobre la cara humeda, enjuaga con agua.","Juleriaque",False),
(23,"MLA27603374","Cleanex Free Gel Limpiador 150 g","Cleanex","limpiador","ambos","nacional",True,40162,
 ["grasa","mixta","sensible"],["acne","textura"],3,False,
 "Gel de limpieza sin jabon, formulado para piel sensible que ademas hace grasitud.",
 "Manana y noche. Enjuaga bien.","Mi Farma",False),

(19,"MLA37240248","Ginseng Cleansing Oil Desmaquillante","Beauty of Joseon","limpiador_oleoso","pm","coreano",True,54739,
 ["grasa","mixta","normal","seca","sensible"],["acne","textura","deshidratacion"],5,True,
 "Primer paso de la doble limpieza: el aceite saca protector solar y maquillaje que el agua sola no levanta.",
 "De noche, sobre la cara SECA. Masajea, mojate las manos para emulsionar y enjuaga. Despues va el limpiador.","Juleriaque",False),

(5,"MLA65451035","Revitalift Glass Skin Crema 50 g","L'Oreal Paris","hidratante","ambos","europeo",False,46477,
 ["mixta","normal","seca"],["textura","deshidratacion"],3,False,
 "Hidratante de textura liviana que deja la piel con aspecto pulido.",
 "Despues de limpiar, manana y noche.","L'Oreal",True),
(12,"MLA37722163","Tea-trica B5 Crema Facial 75 ml","Skin1004","hidratante","ambos","coreano",True,45475,
 ["grasa","mixta"],["acne","textura"],5,False,
 "Hidratante con B5 pensada para piel oleosa y acneica: hidrata sin sensacion pesada.",
 "Despues de limpiar, manana y noche.","Juleriaque",False),
(14,"MLA19866311","Toleriane Dermallergo Crema 40 ml","La Roche-Posay","hidratante","ambos","europeo",True,114414,
 ["seca","sensible"],["deshidratacion","textura"],4,False,
 "Formulada para piel reactiva: minimo de ingredientes, sin fragancia.",
 "Despues de limpiar, manana y noche.","",False),
(17,"MLA21179266","Dynasty Cream 50 ml","Beauty of Joseon","hidratante","ambos","coreano",True,77299,
 ["normal","seca"],["deshidratacion","textura"],4,False,
 "Crema nutritiva para piel que tira. Mas rica que una gel-crema.",
 "Despues de limpiar, manana y noche.","La Franco",False),
(20,"MLA19474747","Hyaluronic 4D Face Cream","Lidherma","hidratante","ambos","nacional",True,31573,
 ["mixta","normal","seca"],["deshidratacion"],3,False,
 "Hidratacion con hialuronico a precio nacional. Textura liviana.",
 "Despues de limpiar, manana y noche.","L'ALTRA BELLEZZA",False),
(21,"MLA45253335","Advanced Snail All In One Cream 50 ml","COSRX","hidratante","ambos","coreano",True,32999,
 ["grasa","mixta","normal","seca","sensible"],["acne","manchas","textura","deshidratacion"],5,True,
 "Mucina de caracol: hidrata y ayuda a que las marcas se vayan emparejando. Muy versatil.",
 "Despues de limpiar, manana y noche.","",False),
(26,"MLA24692733","Crema Hidratante de Dia FPS 30 50 g","Dermaglos","hidratante","am","nacional",False,32661,
 ["mixta","normal","seca"],["deshidratacion"],2,False,
 "Hidratante con FPS 30 incorporado. Resuelve dos pasos si vas corriendo.",
 "A la manana. Si vas a estar al sol, sumale un protector aparte.","La Franco",False),

(8,"MLAU3480823224","Protector Solar Rice + Probioticos SPF50+","Beauty of Joseon","protector_solar","am","coreano",True,51999,
 ["mixta","normal","seca","sensible"],["manchas","textura","deshidratacion"],5,False,
 "Filtro coreano de textura liviana, no deja blanco ni sensacion pegajosa.",
 "Ultimo paso de la manana, todos los dias.","SKINKO",False),
(9,"MLA26916726","Fusion Water Magic SPF 50","ISDIN","protector_solar","am","europeo",False,55904,
 ["grasa","mixta","normal"],["acne","manchas"],4,False,
 "Textura agua, se absorbe rapido. Un clasico para piel que brilla.",
 "Ultimo paso de la manana. Repone cada 3-4 hs si estas al sol.","",True),
(10,"MLA2097460920","Ultra-light Invisible Sunscreen SPF 50 PA++++ 50 ml","COSRX","protector_solar","am","coreano",True,42299,
 ["grasa","mixta","normal","seca","sensible"],["acne","manchas","textura","deshidratacion"],5,True,
 "Muy liviano e invisible. Es el mas facil de usar todos los dias sin renegar.",
 "Ultimo paso de la manana, todos los dias.","",False),
(11,"MLA16048275","Sun Oil Control Toque Seco FPS 50 50 ml","Eucerin","protector_solar","am","europeo",False,53206,
 ["grasa","mixta"],["acne"],4,False,
 "Acabado seco de verdad: control de brillo para piel muy oleosa.",
 "Ultimo paso de la manana.","Eucerin",True),
(15,"MLA24454808","Hyalu-Cica Water-Fit Sun Serum SPF50+ 50 ml","Skin1004","protector_solar","am","coreano",True,54000,
 ["grasa","mixta","normal","seca","sensible"],["acne","textura","deshidratacion"],5,False,
 "Protector con textura de serum. Se siente como un paso de skincare, no como pantalla solar.",
 "Ultimo paso de la manana, todos los dias.","",False),
(16,"MLA20067103","Fusion Water Magic Color Light SPF 50 50 ml","ISDIN","protector_solar","am","europeo",False,52980,
 ["grasa","mixta","normal"],["manchas","textura"],3,False,
 "Igual que el Fusion Water pero con color: empareja el tono y reemplaza la base liviana.",
 "Ultimo paso de la manana.","Isdin",True),
(24,"MLA16189493","Protector Solar Facial Control Anti-Brillo FPS 50 50 ml","NIVEA","protector_solar","am","europeo",False,15488,
 ["grasa","mixta"],["acne"],3,False,
 "La opcion mas barata de la lista para cumplir con el paso que mas importa.",
 "Ultimo paso de la manana, todos los dias.","Nivea",True),

(18,"MLA18957818","Serum Anti Manchas Vitamina C 30 ml","Garnier","serum_activo","am","europeo",False,24693,
 ["grasa","mixta","normal","seca"],["manchas","textura"],3,False,
 "Vitamina C accesible para trabajar sobre manchas y marcas.",
 "A la manana, antes del protector. Empeza dia por medio.","Garnier",True),
(25,"MLA23033385","Niacinamida 10% + Zinc 1% 30 ml","The Ordinary","serum_activo","ambos","europeo",True,39999,
 ["grasa","mixta","normal","seca","sensible"],["acne","manchas","textura"],5,True,
 "Equilibra el brillo y ayuda con poros y marcas. El activo mas facil para arrancar.",
 "Unas gotas antes de la crema, manana o noche.","",False),

(7,"MLA18956630","Mineral 89 Contorno de Ojos 15 ml","Vichy","contorno","ambos","europeo",True,47977,
 ["grasa","mixta","normal","seca","sensible"],["deshidratacion","textura"],4,True,
 "Contorno liviano con acido hialuronico. Apto para todo tipo de piel.",
 "Golpecitos suaves alrededor del ojo, manana y noche.","",False),
]

def rango(p):
    return 1 if p <= 35000 else (2 if p <= 55000 else 3)

FILA = """  {{
    // #{n} · {ml} · {vend}{mv}
    id: "{uid}",
    ml_id: "{ml}",
    nombre: {nombre},
    marca: {marca},
    categoria: "{cat}",
    paso: {paso},
    momento: "{mom}",
    tipos_piel: {piel},
    preocupaciones: {preoc},
    origen: "{origen}",
    apto_sensible: {apto},
    rango_precio: {rango},
    precio_ars: {precio},
    imagen_url: {img},
    link_afiliado: "{link}",
    url_referencia: "https://www.mercadolibre.com.ar/p/{ml}",
    por_que: {porque},
    como_usar: {como},
    prioridad: {prio},
    comodin: {comodin},
    activo: true,
  }},
"""

PASO = {"limpiador_oleoso":1,"limpiador":2,"tonico":3,"serum_activo":4,
        "serum_secundario":5,"contorno":6,"hidratante":7,"protector_solar":8,
        "exfoliante":9,"retinoide":10}

def main():
    links = json.load(io.open("scripts/links-afiliados.json", encoding="utf8"))
    imgs  = json.load(io.open("scripts/imagenes.json", encoding="utf8"))
    out = []
    for (n, ml, nombre, marca, cat, mom, origen, apto, precio, piel, preoc, prio, comodin,
         porque, como, vend, mv) in P:
        out.append(FILA.format(
            n=n, ml=ml, uid=str(uuid.uuid5(NS, ml)),
            vend=(vend or "sin vendedor destacado"),
            mv=(" · MAS VENDIDO" if mv else ""),
            nombre=json.dumps(nombre, ensure_ascii=False),
            marca=json.dumps(marca, ensure_ascii=False),
            cat=cat, paso=PASO[cat], mom=mom,
            piel=json.dumps(piel), preoc=json.dumps(preoc),
            origen=origen, apto=str(apto).lower(),
            rango=rango(precio), precio=precio,
            img=json.dumps(imgs.get(str(n), "")),
            link=links[str(n)],
            porque=json.dumps(porque, ensure_ascii=False),
            como=json.dumps(como, ensure_ascii=False),
            prio=prio, comodin=str(comodin).lower(),
        ))

    cab = (
        'import type { Producto } from "@/engine/recomendacion";\n\n'
        "// CATALOGO — fuente de verdad. Editable a mano.\n"
        "//\n"
        "// Los 26 links de afiliado se resolvieron el 2026-09-05 desde los perfiles\n"
        "// sociales de ML (cuentas goldenvalhalla y Club de Piel). Precios e imagenes\n"
        "// son de esa fecha: corre `npm run refrescar` para actualizarlos.\n"
        "//\n"
        "// Faltan valoraciones, cantidad de ventas y reputacion del vendedor: no salen\n"
        "// del perfil social, hay que ir a cada pagina de producto.\n\n"
        "export const productos: Producto[] = [\n"
    )
    io.open("src/niches/skincare/productos.ts", "w", encoding="utf8", newline="\n").write(
        cab + "".join(out) + "];\n"
    )
    print("productos.ts generado con", len(P), "productos")

main()
