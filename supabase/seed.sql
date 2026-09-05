-- Seed de 12 productos de ejemplo. Generado por scripts/gen-seed.ts.
-- No editar a mano: cambiá src/niches/skincare/productos.ts y corré npm run gen-seed.

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, prioridad, comodin, activo)
values ('00000000-0000-4000-8000-000000000001', 'Espuma limpiadora', 'CeraVe', 'limpiador', 1, 'ambos', array['grasa', 'mixta', 'normal', 'seca', 'sensible'], array['acne', 'manchas', 'textura', 'deshidratacion'], 'europeo', true, 1, 8900, null, 'https://www.mercadolibre.com.ar/#REEMPLAZAR-LINK-AFILIADO', null, null, 'Limpia sin resecar y le va bien a casi cualquier piel.', 'Mañana y noche, sobre la cara húmeda, enjuagá con agua.', 1, true, true)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, prioridad, comodin, activo)
values ('00000000-0000-4000-8000-000000000002', 'Crema hidratante', 'CeraVe', 'hidratante', 3, 'ambos', array['grasa', 'mixta', 'normal', 'seca', 'sensible'], array['acne', 'manchas', 'textura', 'deshidratacion'], 'europeo', true, 1, 12500, null, 'https://www.mercadolibre.com.ar/#REEMPLAZAR-LINK-AFILIADO', null, null, 'Hidrata parejo y no deja sensación pesada.', 'Después de limpiar, mañana y noche.', 1, true, true)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, prioridad, comodin, activo)
values ('00000000-0000-4000-8000-000000000003', 'Fusion Water FPS 50', 'ISDIN', 'protector_solar', 5, 'am', array['grasa', 'mixta', 'normal', 'seca', 'sensible'], array['acne', 'manchas', 'textura', 'deshidratacion'], 'europeo', false, 2, 24000, null, 'https://www.mercadolibre.com.ar/#REEMPLAZAR-LINK-AFILIADO', null, null, 'Textura súper liviana, se absorbe rápido y no deja blanco.', 'Último paso de la mañana, todos los días. Reponé cada 3-4 hs.', 1, true, true)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, prioridad, comodin, activo)
values ('00000000-0000-4000-8000-000000000004', 'Niacinamide 10% + Zinc 1%', 'The Ordinary', 'serum_activo', 2, 'ambos', array['grasa', 'mixta', 'normal', 'seca', 'sensible'], array['acne', 'manchas', 'textura', 'deshidratacion'], 'europeo', true, 1, 9500, null, 'https://www.mercadolibre.com.ar/#REEMPLAZAR-LINK-AFILIADO', null, null, 'Equilibra el brillo y ayuda con poros y marcas. Muy versátil.', 'Unas gotas antes de la crema, mañana o noche.', 1, true, true)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, prioridad, comodin, activo)
values ('00000000-0000-4000-8000-000000000005', 'Lactic Acid 5% + HA', 'The Ordinary', 'exfoliante', 4, 'pm', array['grasa', 'mixta', 'normal', 'seca'], array['textura', 'manchas'], 'europeo', false, 1, 11000, null, 'https://www.mercadolibre.com.ar/#REEMPLAZAR-LINK-AFILIADO', null, null, 'Exfoliación suave que empareja la textura sin ser agresiva.', 'De noche, 2-3 veces por semana. No mezclar con otros ácidos.', 1, true, true)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, prioridad, comodin, activo)
values ('00000000-0000-4000-8000-000000000006', 'Effaclar Gel', 'La Roche-Posay', 'limpiador', 1, 'ambos', array['grasa', 'mixta'], array['acne', 'textura'], 'europeo', true, 2, 18000, null, 'https://www.mercadolibre.com.ar/#REEMPLAZAR-LINK-AFILIADO', null, null, 'Pensado para piel grasa con tendencia a granitos.', 'Mañana y noche sobre la cara húmeda.', 5, false, true)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, prioridad, comodin, activo)
values ('00000000-0000-4000-8000-000000000007', 'Vitamina C 10%', 'La Roche-Posay', 'serum_activo', 2, 'ambos', array['grasa', 'mixta', 'normal', 'seca'], array['manchas', 'textura'], 'europeo', false, 3, 42000, null, 'https://www.mercadolibre.com.ar/#REEMPLAZAR-LINK-AFILIADO', null, null, 'Ilumina y ayuda a emparejar manchas con el tiempo.', 'A la mañana, antes del protector.', 5, false, true)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, prioridad, comodin, activo)
values ('00000000-0000-4000-8000-000000000008', 'Crema para piel seca', 'CeraVe', 'hidratante', 3, 'ambos', array['seca', 'sensible'], array['deshidratacion'], 'europeo', true, 1, 9900, null, 'https://www.mercadolibre.com.ar/#REEMPLAZAR-LINK-AFILIADO', null, null, 'Más rica en emolientes para pieles que tiran.', 'Después de limpiar, mañana y noche.', 4, false, true)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, prioridad, comodin, activo)
values ('00000000-0000-4000-8000-000000000009', 'Ácido Hialurónico 2%', 'The Ordinary', 'serum_activo', 2, 'ambos', array['grasa', 'mixta', 'normal', 'seca', 'sensible'], array['deshidratacion'], 'europeo', true, 1, 8500, null, 'https://www.mercadolibre.com.ar/#REEMPLAZAR-LINK-AFILIADO', null, null, 'Suma hidratación sin peso, ideal si la piel tira.', 'Sobre la piel apenas húmeda, antes de la crema.', 4, false, true)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, prioridad, comodin, activo)
values ('00000000-0000-4000-8000-000000000010', 'Fusion Water Oil Control FPS 50', 'ISDIN', 'protector_solar', 5, 'am', array['grasa', 'mixta'], array['acne', 'textura'], 'europeo', false, 2, 25000, null, 'https://www.mercadolibre.com.ar/#REEMPLAZAR-LINK-AFILIADO', null, null, 'Control de brillo para piel grasa, acabado seco.', 'Último paso de la mañana, todos los días.', 4, false, true)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, prioridad, comodin, activo)
values ('00000000-0000-4000-8000-000000000011', 'Salicylic Acid 2%', 'The Ordinary', 'exfoliante', 4, 'pm', array['grasa', 'mixta'], array['acne', 'textura'], 'europeo', false, 2, 16000, null, 'https://www.mercadolibre.com.ar/#REEMPLAZAR-LINK-AFILIADO', null, null, 'Destapa poros y ayuda con los granitos.', 'De noche, empezá 2 veces por semana.', 5, false, true)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, prioridad, comodin, activo)
values ('00000000-0000-4000-8000-000000000012', 'Loción hidratante', 'Cetaphil', 'hidratante', 3, 'ambos', array['sensible', 'seca'], array['deshidratacion', 'textura'], 'europeo', true, 2, 17000, null, 'https://www.mercadolibre.com.ar/#REEMPLAZAR-LINK-AFILIADO', null, null, 'Suave para piel sensible, sin fragancia.', 'Después de limpiar, mañana y noche.', 4, false, true)
on conflict (id) do nothing;
