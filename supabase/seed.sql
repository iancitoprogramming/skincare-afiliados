-- Seed de 71 productos de ejemplo. Generado por scripts/gen-seed.ts.
-- No editar a mano: cambiá src/niches/skincare/productos.ts y corré npm run gen-seed.

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('5d221906-39be-54cf-8a4b-a8451c1bc147', 'Espuma Facial Extra Suave Mousse Cleanser', 'Idraet', 'limpiador', 2, 'ambos', array['grasa', 'mixta', 'normal', 'seca', 'sensible'], array['textura', 'deshidratacion'], 'nacional', true, 1, 23200, 'https://http2.mlstatic.com/D_Q_NP_2X_832048-MLA104005799796_012026-V.webp', 'https://meli.la/11EmxSu', 'https://www.mercadolibre.com.ar/p/MLA21801426', 'MLA21801426', 'Mousse de limpieza suave: saca la mugre del día sin dejar la piel tirante.', 'Mañana y noche, sobre la cara húmeda.', '2026-09-05', 3, true, true)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('177a52d8-37db-52eb-91a0-588b515f3170', 'Gel Limpiador Facial Espumoso 236 ml', 'CeraVe', 'limpiador', 2, 'ambos', array['grasa', 'mixta', 'normal'], array['acne', 'textura'], 'europeo', true, 3, 55620, 'https://http2.mlstatic.com/D_Q_NP_2X_831598-MLA48269275817_112021-V.webp', 'https://meli.la/2Y8r46h', 'https://www.mercadolibre.com.ar/p/MLAU140993030', 'MLAU140993030', 'Gel espumoso para piel grasa o mixta, con ceramidas para no romper la barrera.', 'Mañana y noche. Si te reseca, dejalo solo de noche.', '2026-09-05', 4, false, true)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('df632bf0-55e0-5fa8-8515-a863341156e3', 'Low pH Good Morning Gel Cleanser 150 ml', 'COSRX', 'limpiador', 2, 'ambos', array['grasa', 'mixta', 'normal', 'seca', 'sensible'], array['acne', 'textura', 'deshidratacion'], 'coreano', true, 2, 37504, 'https://http2.mlstatic.com/D_Q_NP_2X_865672-MLU75328154403_032024-V.webp', 'https://meli.la/2m5jdnL', 'https://www.mercadolibre.com.ar/p/MLA11139349', 'MLA11139349', 'Limpiador de pH bajo: respeta el manto ácido de la piel, por eso cae bien a la mañana.', 'Mañana y noche sobre la cara húmeda, poca cantidad.', '2026-09-05', 3, false, true)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('9f11e96c-a0d6-595c-836b-e2b01e5777d3', 'Centella Cleansing Foam 150 ml', 'Mixsoon', 'limpiador', 2, 'ambos', array['grasa', 'mixta', 'normal', 'seca', 'sensible'], array['acne', 'textura', 'deshidratacion'], 'coreano', true, 2, 38399, 'https://http2.mlstatic.com/D_Q_NP_2X_838019-MLA93483193946_102025-V.webp', 'https://meli.la/2s4tZod', 'https://www.mercadolibre.com.ar/p/MLAU3453545171', 'MLAU3453545171', 'Espuma con centella, pensada para limpiar sin dejar la piel chirriando.', 'Mañana y noche sobre la cara húmeda.', '2026-09-05', 3, false, true)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('b944b75b-d195-5887-8c4a-ec6997fd2679', 'Centella Ampoule Foam 125 ml', 'Skin1004', 'limpiador', 2, 'ambos', array['grasa', 'mixta', 'normal', 'seca', 'sensible'], array['acne', 'textura', 'deshidratacion'], 'coreano', true, 2, 36719, 'https://http2.mlstatic.com/D_Q_NP_2X_743990-MLA108176636618_032026-V.webp', 'https://meli.la/1sdkRtd', 'https://www.mercadolibre.com.ar/p/MLAU3856054670', 'MLAU3856054670', 'Espuma de centella asiática. Limpia parejo y le va bien a casi cualquier piel.', 'Mañana y noche sobre la cara húmeda, enjuagá con agua.', '2026-09-05', 3, true, true)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('5287ad8a-fb88-5094-a48f-51c710cd96ce', 'Cleanex Free Gel Limpiador 150 g', 'Cleanex', 'limpiador', 2, 'ambos', array['grasa', 'mixta', 'sensible'], array['acne', 'textura'], 'nacional', true, 2, 40162, 'https://http2.mlstatic.com/D_Q_NP_2X_716982-MLU72122769372_102023-V.webp', 'https://meli.la/1sBpdZ3', 'https://www.mercadolibre.com.ar/p/MLA27603374', 'MLA27603374', 'Gel de limpieza sin jabón, formulado para piel sensible que además hace grasitud.', 'Mañana y noche. Enjuagá bien.', '2026-09-05', 4, false, true)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('faafd241-6fe8-56a8-a766-ccdb6164db56', 'Ginseng Cleansing Oil Desmaquillante', 'Beauty of Joseon', 'limpiador_oleoso', 1, 'pm', array['grasa', 'mixta', 'normal', 'seca', 'sensible'], array['acne', 'textura', 'deshidratacion'], 'coreano', true, 2, 54739, 'https://http2.mlstatic.com/D_Q_NP_2X_965384-MLU78057625931_072024-V.webp', 'https://meli.la/1yridAk', 'https://www.mercadolibre.com.ar/p/MLA37240248', 'MLA37240248', 'Primer paso de la doble limpieza: el aceite saca protector solar y maquillaje que el agua sola no levanta.', 'De noche, sobre la cara SECA. Masajeá, mojate las manos para emulsionar y enjuagá. Después va el limpiador.', '2026-09-05', 3, true, true)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('1f69f11c-96bc-5e0d-b79b-684a56278a28', 'Revitalift Glass Skin Crema 50 g', 'L''Oreal Paris', 'hidratante', 7, 'ambos', array['mixta', 'normal', 'seca'], array['textura', 'deshidratacion'], 'europeo', false, 2, 46477, 'https://http2.mlstatic.com/D_Q_NP_2X_678886-MLA106918493109_022026-V.webp', 'https://meli.la/2hbp4z9', 'https://www.mercadolibre.com.ar/p/MLA65451035', 'MLA65451035', 'Hidratante de textura liviana que deja la piel con aspecto pulido.', 'Después de limpiar, mañana y noche.', '2026-09-05', 4, false, true)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('599f5ffc-515b-53e3-b1a9-6fa7f105cc0c', 'Tea-trica B5 Crema Facial 75 ml', 'Skin1004', 'hidratante', 7, 'ambos', array['grasa', 'mixta'], array['acne', 'textura'], 'coreano', true, 2, 45475, 'https://http2.mlstatic.com/D_Q_NP_2X_994827-MLU76998762803_062024-V.webp', 'https://meli.la/2HagYva', 'https://www.mercadolibre.com.ar/p/MLA37722163', 'MLA37722163', 'Hidratante con B5 pensada para piel oleosa y acneica: hidrata sin sensación pesada.', 'Después de limpiar, mañana y noche.', '2026-09-05', 5, false, true)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('6b7300c1-a37c-5810-a06b-a114171cc45f', 'Toleriane Dermallergo Crema 40 ml', 'La Roche-Posay', 'hidratante', 7, 'ambos', array['seca', 'sensible'], array['deshidratacion', 'textura'], 'europeo', true, 3, 114414, 'https://http2.mlstatic.com/D_Q_NP_2X_785042-MLU75601430788_042024-V.webp', 'https://meli.la/1gTzEb6', 'https://www.mercadolibre.com.ar/p/MLA19866311', 'MLA19866311', 'Formulada para piel reactiva: mínimo de ingredientes, sin fragancia.', 'Después de limpiar, mañana y noche.', '2026-09-05', 5, false, true)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('0385d1a3-9ab2-5343-9184-2abbd7a5502e', 'Dynasty Cream 50 ml', 'Beauty of Joseon', 'hidratante', 7, 'ambos', array['normal', 'seca'], array['deshidratacion', 'textura'], 'coreano', true, 3, 77299, 'https://http2.mlstatic.com/D_Q_NP_2X_914805-MLU75324226927_032024-V.webp', 'https://meli.la/1knxxHr', 'https://www.mercadolibre.com.ar/p/MLA21179266', 'MLA21179266', 'Crema nutritiva para piel que tira. Más rica que una gel-crema.', 'Después de limpiar, mañana y noche.', '2026-09-05', 5, false, true)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('cae68c7d-d0d5-569c-97c1-dc7685e0fc83', 'Hyaluronic 4D Face Cream', 'Lidherma', 'hidratante', 7, 'ambos', array['mixta', 'normal', 'seca'], array['deshidratacion'], 'nacional', true, 1, 31573, 'https://http2.mlstatic.com/D_Q_NP_2X_751116-MLA51443088672_092022-V.webp', 'https://meli.la/2KUmRn1', 'https://www.mercadolibre.com.ar/p/MLA19474747', 'MLA19474747', 'Hidratación con hialurónico a precio nacional. Textura liviana.', 'Después de limpiar, mañana y noche.', '2026-09-05', 4, false, true)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('fb6c8719-ae28-51c3-a2b7-185729019a95', 'Advanced Snail All In One Cream 50 ml', 'COSRX', 'hidratante', 7, 'ambos', array['grasa', 'mixta', 'normal', 'seca', 'sensible'], array['acne', 'manchas', 'textura', 'deshidratacion'], 'coreano', true, 1, 32999, 'https://http2.mlstatic.com/D_Q_NP_2X_843019-MLA115354367281_072026-V.webp', 'https://meli.la/1VZ7wAp', 'https://www.mercadolibre.com.ar/p/MLA45253335', 'MLA45253335', 'Mucina de caracol: hidrata y ayuda a que las marcas se vayan emparejando. Muy versátil.', 'Después de limpiar, mañana y noche.', '2026-09-05', 3, true, true)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('3043ace8-c198-5554-a4ef-4b3e0248ff31', 'Crema Hidratante de Dia FPS 30 50 g', 'Dermaglos', 'protector_solar', 4, 'am', array['mixta', 'normal', 'seca'], array['deshidratacion', 'manchas'], 'nacional', false, 1, 32661, 'https://http2.mlstatic.com/D_Q_NP_2X_695563-MLU72756171168_112023-V.webp', 'https://meli.la/2kbgQEt', 'https://www.mercadolibre.com.ar/p/MLA24692733', 'MLA24692733', 'Hidrata y protege en un solo paso. La opción para el que no va a hacer dos.', 'A la mañana, como último paso. Es FPS 30: alcanza para el día a día, pero si vas a estar horas al sol conviene uno de 50.', '2026-09-05', 2, false, true)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('ef88803e-f240-5ac9-a0c7-6dc45023f5cb', 'Protector Solar Rice + Probioticos SPF50+', 'Beauty of Joseon', 'protector_solar', 8, 'am', array['mixta', 'normal', 'seca', 'sensible'], array['manchas', 'textura', 'deshidratacion'], 'coreano', true, 2, 51999, 'https://http2.mlstatic.com/D_Q_NP_2X_957567-MLA94539763645_102025-V.webp', 'https://meli.la/1B2LZaE', 'https://www.mercadolibre.com.ar/p/MLAU3480823224', 'MLAU3480823224', 'Filtro coreano de textura liviana, no deja blanco ni sensación pegajosa.', 'Último paso de la mañana, todos los días.', '2026-09-05', 4, false, true)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('2b09ab2e-48f4-5490-860e-b01d8e980e4f', 'Fusion Water Magic SPF 50', 'ISDIN', 'protector_solar', 8, 'am', array['grasa', 'mixta', 'normal'], array['acne', 'manchas'], 'europeo', false, 3, 55904, 'https://http2.mlstatic.com/D_Q_NP_2X_711953-MLA99930410153_112025-V.webp', 'https://meli.la/2SdyX9m', 'https://www.mercadolibre.com.ar/p/MLA26916726', 'MLA26916726', 'Textura agua, se absorbe rápido. Un clásico para piel que brilla.', 'Último paso de la mañana. Reponé cada 3-4 hs si estás al sol.', '2026-09-05', 4, false, true)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('243c3ca9-7456-5c5f-adae-56bc432fdc4c', 'Ultra-light Invisible Sunscreen SPF 50 PA++++ 50 ml', 'COSRX', 'protector_solar', 8, 'am', array['grasa', 'mixta', 'normal', 'seca', 'sensible'], array['acne', 'manchas', 'textura', 'deshidratacion'], 'coreano', true, 2, 42299, 'https://http2.mlstatic.com/D_Q_NP_2X_729825-MLA107254048819_022026-V.webp', 'https://meli.la/1mZvXGj', 'https://www.mercadolibre.com.ar/p/MLA2097460920', 'MLA2097460920', 'Muy liviano e invisible. Es el más fácil de usar todos los días sin renegar.', 'Último paso de la mañana, todos los días.', '2026-09-05', 3, true, true)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('ee65576a-883b-5b68-82d9-b06c4540f9cc', 'Sun Oil Control Toque Seco FPS 50 50 ml', 'Eucerin', 'protector_solar', 8, 'am', array['grasa', 'mixta'], array['acne'], 'europeo', false, 2, 53206, 'https://http2.mlstatic.com/D_Q_NP_2X_967739-MLA117137014457_092026-V.webp', 'https://meli.la/1j7eFWb', 'https://www.mercadolibre.com.ar/p/MLA16048275', 'MLA16048275', 'Acabado seco de verdad: control de brillo para piel muy oleosa.', 'Último paso de la mañana.', '2026-09-05', 5, false, true)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('49a08f9d-4ffe-54a6-ae25-cb54ece5198f', 'Hyalu-Cica Water-Fit Sun Serum SPF50+ 50 ml', 'Skin1004', 'protector_solar', 8, 'am', array['grasa', 'mixta', 'normal', 'seca', 'sensible'], array['acne', 'textura', 'deshidratacion'], 'coreano', true, 2, 54000, 'https://http2.mlstatic.com/D_Q_NP_2X_614355-MLA99834144935_112025-V.webp', 'https://meli.la/2ME4rDC', 'https://www.mercadolibre.com.ar/p/MLA24454808', 'MLA24454808', 'Protector con textura de serum. Se siente como un paso de skincare, no como pantalla solar.', 'Último paso de la mañana, todos los días.', '2026-09-05', 3, false, true)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('1782a74e-046f-572d-b361-27dacdf2b3ea', 'Fusion Water Magic Color Light SPF 50 50 ml', 'ISDIN', 'protector_solar', 8, 'am', array['grasa', 'mixta', 'normal'], array['manchas', 'textura'], 'europeo', false, 2, 52980, 'https://http2.mlstatic.com/D_Q_NP_2X_611145-MLA99918803569_112025-V.webp', 'https://meli.la/1YCbeGw', 'https://www.mercadolibre.com.ar/p/MLA20067103', 'MLA20067103', 'Igual que el Fusion Water pero con color: empareja el tono y reemplaza la base liviana.', 'Último paso de la mañana.', '2026-09-05', 4, false, true)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('5540f526-7bbb-587e-9340-4c367d3fecb5', 'Protector Solar Facial Control Anti-Brillo FPS 50 50 ml', 'NIVEA', 'protector_solar', 8, 'am', array['grasa', 'mixta'], array['acne'], 'europeo', false, 1, 15488, 'https://http2.mlstatic.com/D_Q_NP_2X_788259-MLA117198265649_092026-V.webp', 'https://meli.la/2DuYPWN', 'https://www.mercadolibre.com.ar/p/MLA16189493', 'MLA16189493', 'La opción más barata de la lista para cumplir con el paso que más importa.', 'Último paso de la mañana, todos los días.', '2026-09-05', 5, false, true)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('eca1e945-2ceb-5a4b-8d53-5afe77870730', 'Serum Anti Manchas Vitamina C 30 ml', 'Garnier', 'serum_activo', 2, 'ambos', array['grasa', 'mixta', 'normal', 'seca'], array['manchas', 'textura'], 'europeo', false, 1, 24693, 'https://http2.mlstatic.com/D_Q_NP_2X_984767-MLA114537078502_082026-V.webp', 'https://meli.la/2cvShSS', 'https://www.mercadolibre.com.ar/p/MLA18957818', 'MLA18957818', 'Vitamina C accesible para trabajar sobre manchas y marcas.', 'Después de limpiar y antes de la crema. Rinde más a la mañana, bajo el protector. Empezá día por medio.', '2026-09-05', 4, false, true)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('2e00ac05-c649-5f6d-bfd2-cce864f2e80e', 'Niacinamida 10% + Zinc 1% 30 ml', 'The Ordinary', 'serum_activo', 4, 'ambos', array['grasa', 'mixta', 'normal', 'seca', 'sensible'], array['acne', 'manchas', 'textura'], 'europeo', true, 2, 39999, 'https://http2.mlstatic.com/D_Q_NP_2X_670477-MLU69223240175_052023-V.webp', 'https://meli.la/1Fophba', 'https://www.mercadolibre.com.ar/p/MLA23033385', 'MLA23033385', 'Equilibra el brillo y ayuda con poros y marcas. El activo más fácil para arrancar.', 'Unas gotas antes de la crema, mañana o noche.', '2026-09-05', 3, true, true)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('9f280ac4-84cb-5eca-b3cd-583eceef3219', 'Mineral 89 Contorno de Ojos 15 ml', 'Vichy', 'contorno', 6, 'ambos', array['grasa', 'mixta', 'normal', 'seca', 'sensible'], array['deshidratacion', 'textura'], 'europeo', true, 2, 47977, 'https://http2.mlstatic.com/D_Q_NP_2X_623415-MLU78028761401_072024-V.webp', 'https://meli.la/1d7iet1', 'https://www.mercadolibre.com.ar/p/MLA18956630', 'MLA18956630', 'Contorno liviano con ácido hialurónico. Apto para todo tipo de piel.', 'Golpecitos suaves alrededor del ojo, mañana y noche.', '2026-09-05', 3, true, true)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('360306d6-7439-53f6-80d0-9d8644884868', 'Milk Skin Toner 150 ml', 'TIRTIR', 'tonico', 3, 'ambos', array['grasa', 'mixta', 'normal', 'seca', 'sensible'], array['deshidratacion', 'textura'], 'coreano', true, 3, 65999, 'https://http2.mlstatic.com/D_Q_NP_2X_909856-MLA94560758043_102025-V.webp', 'https://meli.la/27hmLZT', 'https://www.mercadolibre.com.ar/up/MLAU3481553718', 'MLAU3481553718', 'Tónico de textura lechosa. Suma humedad sin peso y deja la piel lista para lo que viene después.', 'Después de limpiar, con las manos o un algodón. Mañana y noche.', '2026-09-05', 3, true, true)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('ed3e0a91-2640-59fc-80d5-5008a15d65a5', 'Tónico Exfoliante de Ácido Glicólico 7 por ciento 100 ml', 'The Ordinary', 'exfoliante', 9, 'pm', array['grasa', 'mixta', 'normal'], array['textura', 'manchas'], 'europeo', false, 3, 57170, 'https://http2.mlstatic.com/D_Q_NP_2X_641467-MLU74154671501_012024-V.webp', 'https://meli.la/16akSDT', 'https://www.mercadolibre.com.ar/p/MLA29493655', 'MLA29493655', 'Ácido glicólico al 7 por ciento: empareja la textura y ayuda a que las marcas se aclaren.', 'De noche, sobre la piel seca, 2 o 3 veces por semana. Nunca el mismo día que otro ácido.', '2026-09-05', 4, true, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('d47c5c7f-88f8-5547-8ee2-440abda55985', 'Avene Hydrance Spf30 Crema Facial Hidratante Piel Sensible', 'Avène', 'hidratante', 0, 'ambos', array['grasa', 'mixta', 'normal', 'seca', 'sensible'], array[], 'europeo', true, 3, null, null, 'https://meli.la/2vucCrR', 'https://www.mercadolibre.com.ar/p/MLA67629151', 'MLA67629151', null, null, '2026-09-06', 4, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('6fe42157-e35e-5446-a929-217b76a0eb49', 'Avene Tolerance Control Crema Apaisante Restauradora X 40 Tipo de piel Sensible', 'Avène', 'hidratante', 0, 'ambos', array['mixta', 'normal', 'seca', 'sensible'], array['deshidratacion'], 'europeo', true, 3, null, null, 'https://meli.la/1LRTaMn', 'https://www.mercadolibre.com.ar/p/MLA23143346', 'MLA23143346', null, null, '2026-09-06', 5, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('0dd6a780-c079-5225-a8ba-abf771937d09', 'Crema Facial Isdin Ureadin Fusion Melting Cream 50ml - Piel Normal', 'ISDIN', 'hidratante', 0, 'ambos', array['grasa', 'mixta', 'normal', 'seca'], array['textura', 'deshidratacion', 'manchas'], 'europeo', false, 2, null, null, 'https://meli.la/1D8LvKN', 'https://www.mercadolibre.com.ar/p/MLA21174873', 'MLA21174873', null, null, '2026-09-06', 4, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('786825f8-fa3a-5ae3-9a12-3514acff04d9', 'Crema Gel Hidratante Anti-imperfecciones Garnier 50ml', 'Garnier', 'hidratante', 0, 'ambos', array['grasa', 'mixta', 'normal'], array['manchas', 'deshidratacion', 'acne', 'textura'], 'europeo', false, 1, null, null, 'https://meli.la/2tBuQVW', 'https://www.mercadolibre.com.ar/p/MLA35115621', 'MLA35115621', null, null, '2026-09-06', 4, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('808e43ee-9a93-5cf2-ae71-8210102219b0', 'Crema Hidratante Eucerin Aquaporin Active para piel mixta-normal de 50mL', 'Eucerin', 'hidratante', 0, 'ambos', array['grasa', 'mixta', 'normal', 'seca'], array['deshidratacion'], 'europeo', false, 2, null, null, 'https://meli.la/1BRdsTo', 'https://www.mercadolibre.com.ar/p/MLA9210936', 'MLA9210936', null, null, '2026-09-06', 4, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('e8a48fe9-e89b-5f22-ae91-e6aba34acf8a', 'Crema Hidratante facial Neutrogena Hydro Boost water gel 50 GR - Todo tipo de Piel', 'Neutrogena', 'hidratante', 0, 'ambos', array['grasa', 'mixta', 'normal', 'seca'], array['deshidratacion'], 'europeo', false, 1, null, null, '', 'https://www.mercadolibre.com.ar/p/MLA19899495', 'MLA19899495', null, null, '2026-09-06', 3, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('d0d3332a-fc59-5b58-96c8-77f6fb8eabde', 'Eucerin Hyaluron - Filler Día Piel Normal a Mixta Fps15 X 50m', 'Eucerin', 'hidratante', 0, 'ambos', array['grasa', 'mixta', 'normal', 'seca'], array['manchas', 'deshidratacion'], 'europeo', false, 3, null, null, 'https://meli.la/22Mh3Rb', 'https://www.mercadolibre.com.ar/p/MLA9855881', 'MLA9855881', null, null, '2026-09-06', 3, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('9e56836d-95e8-5f74-b707-65927d4d01c0', 'Gel Crema Hidratante Facial Piel Sensible Seca - Mixta Aveno 50g', 'Aveno', 'hidratante', 0, 'ambos', array['grasa', 'mixta', 'normal', 'seca', 'sensible'], array['deshidratacion'], 'nacional', true, 1, null, null, 'https://meli.la/31jBrGU', 'https://www.mercadolibre.com.ar/p/MLA22990183', 'MLA22990183', null, null, '2026-09-06', 4, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('353d07b5-d81e-5866-8a98-4e8801e5fd0a', 'La Roche-Posay Effaclar Mat 40 mL', 'La Roche-Posay', 'hidratante', 0, 'ambos', array['grasa', 'mixta', 'normal'], array['acne', 'textura'], 'europeo', false, 2, null, null, 'https://meli.la/2PQYHsi', 'https://www.mercadolibre.com.ar/p/MLA9196384', 'MLA9196384', null, null, '2026-09-06', 4, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('3b6b8c59-405a-5357-b92f-37f1e9ee58bc', 'Agua Micelar Anti-imperfecciones Con Ácido Salicílico Garnier 400ml', 'Garnier', 'limpiador', 0, 'ambos', array['grasa', 'mixta', 'normal'], array['acne', 'textura', 'manchas'], 'europeo', false, 1, null, null, 'https://meli.la/2FJaxYb', 'https://www.mercadolibre.com.ar/p/MLA24300545', 'MLA24300545', null, null, '2026-09-06', 3, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('8fe63985-3796-5e78-9de6-de0a82281a49', 'Agua Micelar Todo en 1 Garnier 400ml', 'Garnier', 'limpiador', 0, 'ambos', array['grasa', 'mixta', 'normal', 'seca', 'sensible'], array[], 'europeo', true, 1, null, null, 'https://meli.la/2EeBV4a', 'https://www.mercadolibre.com.ar/p/MLA20546060', 'MLA20546060', null, null, '2026-09-06', 3, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('52747e64-8f8a-5be8-b935-6ef7e5ad517b', 'Cerave Gel Limpiador Espumoso', 'CeraVe', 'limpiador', 0, 'ambos', array['grasa', 'mixta', 'normal', 'sensible'], array['deshidratacion', 'manchas'], 'europeo', true, 2, null, null, 'https://meli.la/1rfMXV1', 'https://www.mercadolibre.com.ar/up/MLAU141343879', 'MLAU141343879', null, null, '2026-09-06', 4, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('2de5e9f9-c212-5e1d-9828-d90c7aff3de9', 'Eucerin Dermopure Oil Control Gel Limpiador Facial 400ml', 'Eucerin', 'limpiador', 0, 'ambos', array['grasa', 'mixta', 'normal'], array['acne', 'textura'], 'europeo', false, 2, null, null, 'https://meli.la/2mjSuZ3', 'https://www.mercadolibre.com.ar/p/MLA37349507', 'MLA37349507', null, null, '2026-09-06', 4, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('069e085b-93f0-5e5e-a907-a409f3e4f8d9', 'Gel Limpiador Crema Hidratante Anti Imperfecciones Garnier 250ml', 'Garnier', 'limpiador', 0, 'ambos', array['grasa', 'mixta', 'normal'], array['manchas', 'deshidratacion', 'acne', 'textura'], 'europeo', false, 1, null, null, 'https://meli.la/2hh95rn', 'https://www.mercadolibre.com.ar/p/MLA47671534', 'MLA47671534', null, null, '2026-09-06', 3, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('7787bab2-6a2e-5aae-be68-d587cba8588e', 'Gel limpiador hidratante Neutrogena Hydro Boost, 150 ml, para todo tipo de piel', 'Neutrogena', 'limpiador', 0, 'ambos', array['grasa', 'mixta', 'normal', 'seca', 'sensible'], array['deshidratacion'], 'europeo', true, 1, null, null, 'https://meli.la/1a13fk3', 'https://www.mercadolibre.com.ar/p/MLA53897352', 'MLA53897352', null, null, '2026-09-06', 3, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('5c1c9584-f216-5825-abea-fdcaca926992', 'La Roche-Posay Lipikar Syndet Ap+ Gel Limpiador X 200 Ml', 'La Roche-Posay', 'limpiador', 0, 'ambos', array['mixta', 'normal', 'seca', 'sensible'], array['manchas', 'deshidratacion'], 'europeo', true, 2, null, null, 'https://meli.la/1RixJw8', 'https://www.mercadolibre.com.ar/up/MLAU376385300', 'MLAU376385300', null, null, '2026-09-06', 5, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('677a05dc-1afc-5840-8b42-4a09c03ee1cd', 'Limpiador en Gel Beauty Of Joseon Ciruela Verde 100ml Piel Grasa', 'Beauty of Joseon', 'limpiador', 0, 'ambos', array['grasa', 'mixta', 'normal', 'seca', 'sensible'], array[], 'coreano', true, 2, null, null, 'https://meli.la/2enTXSc', 'https://www.mercadolibre.com.ar/p/MLA35427636', 'MLA35427636', null, null, '2026-09-06', 4, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('4be59db9-22f1-56c6-9ffe-21301474f42c', 'Limpiador Facial y Corporal Restaurador de la Piel Cetaphil Pro Ad Restoraderm para Pieles Atópicas', 'Cetaphil', 'limpiador', 0, 'ambos', array['mixta', 'normal', 'seca', 'sensible'], array['manchas', 'deshidratacion'], 'europeo', true, 3, null, null, 'https://meli.la/2XbQBQ8', 'https://www.mercadolibre.com.ar/p/MLA20030752', 'MLA20030752', null, null, '2026-09-06', 5, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('8293ef2d-878f-5dc7-85df-5254c10d8812', 'Limpiador Hidratante Cerave Piel Normal A Seca X 236ml', 'CeraVe', 'limpiador', 0, 'ambos', array['mixta', 'normal', 'seca', 'sensible'], array['deshidratacion'], 'europeo', true, 2, null, null, 'https://meli.la/1HXhaNM', 'https://www.mercadolibre.com.ar/p/MLA37598876', 'MLA37598876', null, null, '2026-09-06', 5, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('0cd46bf5-012f-5327-a946-2f0f6fdce296', 'Eucerin Sun Oil Control Protector Solar Facial Tono medio FPS 50 x 50 ml', 'Eucerin', 'protector_solar', 0, 'am', array['grasa', 'mixta', 'normal'], array['manchas', 'deshidratacion'], 'europeo', false, 2, null, null, 'https://meli.la/1xyAzGu', 'https://www.mercadolibre.com.ar/p/MLA19504960', 'MLA19504960', null, null, '2026-09-06', 4, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('093dc761-466b-5ac6-a91d-00f5fe2a9e32', 'Protector Solar Anthelios Oil Control Fps50+ 50 Ml', 'La Roche-Posay', 'protector_solar', 0, 'am', array['grasa', 'mixta', 'normal'], array['manchas'], 'europeo', false, 3, null, null, 'https://meli.la/1pVjW5o', 'https://www.mercadolibre.com.ar/up/MLAU3133622625', 'MLAU3133622625', null, null, '2026-09-06', 5, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('f2c98169-24cf-59e5-8ceb-eebd40f7720c', 'La Roche-Posay Anthelios Fps50 Ultra Fluido Con Color X 50 Ml', 'La Roche-Posay', 'protector_solar', 0, 'am', array['grasa', 'mixta', 'normal'], array['manchas', 'acne'], 'europeo', false, 3, null, null, 'https://meli.la/1Z5wwA4', 'https://www.mercadolibre.com.ar/p/MLA16048263', 'MLA16048263', null, null, '2026-09-06', 4, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('5d60fad9-e033-5346-8f50-790dc29d6f3a', 'Protector solar La Roche-Posay Anthelios UVMUNE 400 50FPS en crema 50mL con COLOR', 'La Roche-Posay', 'protector_solar', 0, 'am', array['grasa', 'mixta', 'normal', 'seca'], array['manchas'], 'europeo', false, 3, null, null, 'https://meli.la/2AgbA84', 'https://www.mercadolibre.com.ar/p/MLA58897902', 'MLA58897902', null, null, '2026-09-06', 5, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('d56c81d0-185e-5694-8352-fb09eaf5cd27', 'Garnier Protector Solar Super Uv Fluido Invisible Fps50 40 Ml', null, 'protector_solar', 0, 'am', array['grasa', 'mixta', 'normal'], array['manchas', 'deshidratacion', 'acne', 'textura'], 'europeo', false, 2, null, null, 'https://meli.la/12kE7AR', 'https://www.mercadolibre.com.ar/p/MLA38098313', 'MLA38098313', null, null, '2026-09-06', 4, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('463f3803-17e2-566e-8226-254fe7546889', 'Crema Retinol Boost Anti-arrugas Neutrogena 30ml Todo Tipo De Piel Día-noche', 'Neutrogena', 'retinoide', 0, 'pm', array['grasa', 'mixta', 'normal', 'seca'], array['textura', 'deshidratacion'], 'europeo', false, 2, null, null, 'https://meli.la/2zvq95Y', 'https://www.mercadolibre.com.ar/p/MLA58622882', 'MLA58622882', null, null, '2026-09-06', 4, true, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('07628bc3-918c-5cca-a643-60ef9be1a864', 'Eximia Hyalu-r Concentre Serum Antiedad X 15 Ml', 'Eximia', 'retinoide', 0, 'pm', array['grasa', 'mixta', 'normal', 'seca'], array['textura', 'manchas', 'deshidratacion'], 'nacional', false, 2, null, null, 'https://meli.la/2XtPwss', 'https://www.mercadolibre.com.ar/p/MLA20021768', 'MLA20021768', null, null, '2026-09-06', 3, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('24fe4638-63d5-5fd1-8e2d-07c15ffabda3', 'La Roche Posay Retinol B3 Sérum Regenerador X 30 Ml Todo Tipo De Piel, Incluso Sensible.', 'La Roche-Posay', 'retinoide', 0, 'pm', array['grasa', 'mixta', 'normal', 'seca'], array['textura', 'manchas', 'deshidratacion'], 'europeo', false, 3, null, null, 'https://meli.la/1cLRPsP', 'https://www.mercadolibre.com.ar/up/MLAU244146565', 'MLAU244146565', null, null, '2026-09-06', 5, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('826faa38-3298-5428-927d-639265ebb5e6', 'Dermaglós Serum Facial Niacinamida X 30 Ml Todo Tipo De Piel Día-noche', 'Dermaglós', 'serum_activo', 0, 'ambos', array['grasa', 'mixta', 'normal', 'seca'], array['manchas', 'deshidratacion', 'acne'], 'nacional', false, 1, null, null, 'https://meli.la/1QPrueC', 'https://www.mercadolibre.com.ar/up/MLAU209241342', 'MLAU209241342', null, null, '2026-09-06', 3, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('31342eb5-4fb3-5bb8-949f-68065a203409', 'Detenage N 10% Niacinamida Serum Facial Antiedad 30ml', 'Detenage', 'serum_activo', 0, 'ambos', array['grasa', 'mixta', 'normal', 'seca', 'sensible'], array['manchas', 'deshidratacion'], 'nacional', true, 2, null, null, 'https://meli.la/1Sgtcvw', 'https://www.mercadolibre.com.ar/up/MLAU1655818860', 'MLAU1655818860', null, null, '2026-09-06', 4, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('4bc1f9e9-cd68-5e76-9a87-6187919f6287', 'Eximia Hyalu-n Concentre X 15 Ml Tipo de piel Todo tipo de piel', 'Eximia', 'serum_activo', 0, 'ambos', array['grasa', 'mixta', 'normal', 'seca'], array['manchas', 'deshidratacion', 'textura'], 'nacional', false, 2, null, null, 'https://meli.la/2Z3JW7S', 'https://www.mercadolibre.com.ar/p/MLA29882074', 'MLA29882074', null, null, '2026-09-06', 3, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('f9972d79-114b-5a31-b8e5-3b4b3ab140a6', 'La Roche Posay Pure Vitamin C12 Serum', 'La Roche-Posay', 'serum_activo', 0, 'ambos', array['grasa', 'mixta', 'normal', 'seca'], array['manchas', 'acne', 'textura', 'deshidratacion'], 'europeo', false, 3, null, null, 'https://meli.la/1XJg8Nt', 'https://www.mercadolibre.com.ar/p/MLA47223033', 'MLA47223033', null, null, '2026-09-06', 4, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('f97e6ed9-4133-50a5-b4fe-4f5780557aab', 'Liftactiv Supreme Vitamina C Serum 20ml Vichy', 'Vichy', 'serum_activo', 0, 'ambos', array['grasa', 'mixta', 'normal', 'seca'], array['manchas', 'deshidratacion'], 'europeo', false, 3, null, null, 'https://meli.la/2RZ82c3', 'https://www.mercadolibre.com.ar/p/MLA19710676', 'MLA19710676', null, null, '2026-09-06', 4, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('e7bb0026-7146-514d-8ac0-056f82a5f465', 'Sérum Anti-imperfecciones con Ácido Salicílico de Garnier 30ml', 'Garnier', 'serum_activo', 0, 'ambos', array['grasa', 'mixta', 'normal'], array['manchas', 'deshidratacion', 'acne', 'textura'], 'europeo', false, 1, null, null, 'https://meli.la/1DCQJzi', 'https://www.mercadolibre.com.ar/p/MLA22843182', 'MLA22843182', null, null, '2026-09-06', 4, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('72651e35-bd63-5f51-880b-30cbc19cb5c4', 'Sérum Brightening Kosmos Vitamina C Pura', 'Kosmos', 'serum_activo', 0, 'ambos', array['grasa', 'mixta', 'normal', 'seca'], array['manchas', 'deshidratacion'], 'nacional', false, 2, null, null, 'https://meli.la/1Cxs4p7', 'https://www.mercadolibre.com.ar/p/MLA45672941', 'MLA45672941', null, null, '2026-09-06', 5, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('bd3180fa-aaaf-5bf7-a6ac-dd0e6cfd92da', 'Sérum La Roche-Posay Mela B3 Antimanchas con Niacinamida 30ml', 'La Roche-Posay', 'serum_activo', 0, 'ambos', array['grasa', 'mixta', 'normal', 'seca'], array['manchas', 'deshidratacion', 'textura', 'acne'], 'europeo', false, 3, null, null, '', 'https://www.mercadolibre.com.ar/p/MLA34459961', 'MLA34459961', null, null, '2026-09-06', 5, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('ecd8932e-d99a-5c53-ad94-edcbeba21fb4', 'Sérum La Roche-Posay Mela B3 Antimanchas con Niacinamida 30ml Opcion 2', 'La Roche-Posay', 'serum_activo', 0, 'ambos', array['grasa', 'mixta', 'normal', 'seca'], array['manchas', 'deshidratacion', 'textura', 'acne'], 'europeo', false, 3, null, null, 'https://meli.la/2rXvDa4', 'https://www.mercadolibre.com.ar/p/MLA26197969', 'MLA26197969', null, null, '2026-09-06', 4, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('f0b2811c-90dc-544d-b3db-3d7711faf69f', 'Skinceuticals C E Ferulic Sérum De Ácido Ferúlico 30ml Todo Tipo De Piel Día-noche', 'SkinCeuticals', 'serum_activo', 0, 'ambos', array['grasa', 'mixta', 'normal', 'seca'], array['manchas', 'deshidratacion'], 'europeo', false, 3, null, null, 'https://meli.la/1V91gHN', 'https://www.mercadolibre.com.ar/p/MLA24840827', 'MLA24840827', null, null, '2026-09-06', 5, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('04b77f59-3bf6-5b04-9a5e-e7662616f848', 'Celimax The Real Noni Energy Ampoule Serum', 'Celimax', 'serum_secundario', 0, 'ambos', array['grasa', 'mixta', 'normal', 'seca'], array['deshidratacion'], 'coreano', false, 2, null, null, 'https://meli.la/1wqWqrz', 'https://www.mercadolibre.com.ar/p/MLA45338822', 'MLA45338822', null, null, '2026-09-06', 4, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('dd122b0b-ead4-5bef-a516-ce238f45ae57', 'Eximia Hyalu B Concentré Serum Antiedad X 30ml', 'Eximia', 'serum_secundario', 0, 'ambos', array['grasa', 'mixta', 'normal', 'seca'], array['deshidratacion', 'manchas', 'acne'], 'nacional', false, 2, null, null, 'https://meli.la/1KU9QZY', 'https://www.mercadolibre.com.ar/p/MLA45991792', 'MLA45991792', null, null, '2026-09-06', 3, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('0547f1a8-4a58-521a-8f70-b5d8621b4a1d', 'La Roche-Posay Hyalu B5 Suractivated Serum 30 Ml', 'La Roche-Posay', 'serum_secundario', 0, 'ambos', array['grasa', 'mixta', 'normal', 'seca'], array['deshidratacion'], 'europeo', false, 3, null, null, 'https://meli.la/1CyrL3C', 'https://www.mercadolibre.com.ar/p/MLA59802317', 'MLA59802317', null, null, '2026-09-06', 4, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('5603d4f7-3e32-586b-8655-8e6acffe2468', 'Sérum Ácido Hialurónico Vichy Minéral 89 Booster Hidratante Gel 50ml', 'Vichy', 'serum_secundario', 0, 'ambos', array['grasa', 'mixta', 'normal', 'seca', 'sensible'], array['deshidratacion'], 'europeo', true, 2, null, null, 'https://meli.la/2iXjeCp', 'https://www.mercadolibre.com.ar/p/MLA18964459', 'MLA18964459', null, null, '2026-09-06', 4, true, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('914fa2b9-679c-50cb-a01e-e7713bfcbba3', 'Serum Hidratante Concentrado Neutrogena® Hydro Boost 30 Ml', 'Neutrogena', 'serum_secundario', 0, 'ambos', array['grasa', 'mixta', 'normal', 'seca'], array['deshidratacion'], 'europeo', false, 1, null, null, 'https://meli.la/17ssJ5t', 'https://www.mercadolibre.com.ar/p/MLA22655637', 'MLA22655637', null, null, '2026-09-06', 3, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('ace75d88-f5d6-5ec8-9ec2-02fe2525dc3b', 'Sérum Rostro Revitalift Ácido Hialurónico L''Oréal Paris 30ml', null, 'serum_secundario', 0, 'ambos', array['grasa', 'mixta', 'normal', 'seca', 'sensible'], array['deshidratacion', 'manchas'], 'europeo', true, 1, null, null, 'https://meli.la/2af2zRS', 'https://www.mercadolibre.com.ar/p/MLA18956615', 'MLA18956615', null, null, '2026-09-06', 3, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('2fc14288-5884-5849-ba10-f35d48b14a74', 'Skin1004 Ampolla Serum Anti-acné Tea-trica Relief', 'Skin1004', 'serum_secundario', 0, 'ambos', array['grasa', 'mixta', 'normal'], array['deshidratacion', 'acne'], 'coreano', false, 2, null, null, 'https://meli.la/2xDfY4m', 'https://www.mercadolibre.com.ar/p/MLA38719413', 'MLA38719413', null, null, '2026-09-06', 4, false, false)
on conflict (id) do nothing;

insert into productos (id, nombre, marca, categoria, paso, momento, tipos_piel, preocupaciones, origen, apto_sensible, rango_precio, precio_ars, imagen_url, link_afiliado, url_referencia, ml_id, por_que, como_usar, relevado, prioridad, comodin, activo)
values ('c88d5ad8-e7da-51ac-96c9-0f015dddfed2', 'Skin1004 Poremizing Fresh Ampoule', 'Skin1004', 'serum_secundario', 0, 'ambos', array['grasa', 'mixta', 'normal', 'sensible'], array['deshidratacion'], 'coreano', true, 2, null, null, 'https://meli.la/31D3Hmf', 'https://www.mercadolibre.com.ar/p/MLA43183566', 'MLA43183566', null, null, '2026-09-06', 3, false, false)
on conflict (id) do nothing;
