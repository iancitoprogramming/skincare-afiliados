# One-shot: mete rating, opiniones, ventas y reputacion en el catalogo.
# Relevado de Mercado Libre el 2026-09-05 con la sesion de Ian en Chrome.
# -*- coding: utf-8 -*-
import io, re

# ml_id: (rating, opiniones, etiqueta_vendidos, reputacion)
D = {
"MLA21801426":    (4.9,   650, "+5 mil",   "MercadoLider"),
"MLAU140993030":  (4.8,  3207, "+10 mil",  "Tienda oficial"),
"MLA11139349":    (4.8,   141, "+100",     None),
"MLAU3453545171": (4.8,    40, "+100",     "Tienda oficial"),
"MLAU3856054670": (5.0,     1, "+100",     "Tienda oficial"),
"MLA27603374":    (4.9,   657, "+1000",    "Tienda oficial"),
"MLA37240248":    (5.0,    15, "+25",      "Tienda oficial"),
"MLA65451035":    (4.8,  3019, "+10 mil",  "Tienda oficial"),
"MLA19866311":    (4.9,  3197, "+10 mil",  "Tienda oficial"),
"MLA21179266":    (4.8,    29, "+100",     "Tienda oficial"),
"MLA19474747":    (4.8,  5079, "+10 mil",  "Tienda oficial"),
"MLA24692733":    (4.8,   767, "+1000",    "Tienda oficial"),
"MLA26916726":    (4.9, 11410, "+10 mil",  "Tienda oficial"),
"MLA2097460920":  (5.0,     1, "+5",       "MercadoLider"),
"MLA16048275":    (4.9, 16628, "+100 mil", "Tienda oficial"),
"MLA24454808":    (4.8,  3995, "+1000",    "MercadoLider"),
"MLA20067103":    (4.9,  6403, "+10 mil",  "Tienda oficial"),
"MLA16189493":    (4.7,  5471, "+50 mil",  "Tienda oficial"),
"MLA18957818":    (4.8, 66616, "+100 mil", "Tienda oficial"),
"MLA23033385":    (4.9,   120, "+500",     "MercadoLider"),
"MLA18956630":    (4.8,  8750, "+10 mil",  "Tienda oficial"),
"MLA45253335":    (4.8,    53, "+100",     "Tienda oficial"),
"MLAU3480823224": (5.0,     1, "+50",      "Tienda oficial"),
"MLA37722163":    (4.7,   330, "+500",     "Tienda oficial"),
# kits
"MLAU560830924":  (4.7,   281, "+1000",    "Tienda oficial"),
"MLAU3408127149": (4.8,   442, "+1000",    "Tienda oficial"),
}

def aprox(etiqueta):
    n = re.sub(r"[^\d]", "", etiqueta.replace(" mil", "000"))
    return int(n) if n else 0

def inyectar(path, ancla):
    s = io.open(path, encoding="utf8").read()
    hechos = 0
    for ml, (r, o, v, rep) in D.items():
        pat = '    ml_id: "%s",' % ml
        if pat not in s:
            continue
        extra = (
            '\n    rating: %s,'
            '\n    opiniones: %d,'
            '\n    vendidos: "%s",'
            '\n    vendidos_aprox: %d,' % (r, o, v, aprox(v))
        )
        if rep:
            extra += '\n    reputacion: "%s",' % rep.replace("MercadoLider", "MercadoLíder")
        s = s.replace(pat, pat + extra)
        hechos += 1
    io.open(path, "w", encoding="utf8", newline="\n").write(s)
    print(path, hechos)

inyectar("src/niches/skincare/productos.ts", "ml_id")
inyectar("src/niches/skincare/kits.ts", "ml_id")
