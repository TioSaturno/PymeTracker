-- =====================================================
-- DATOS DE PRUEBA ADICIONALES — PymeTracker
-- 3 ejecuciones del scraper con datos realistas
-- =====================================================

-- Ejecución 3: Scout en Santiago Centro
INSERT INTO analisis (id, tienda_id, usuario_id, status, payload_data, fecha_ejecucion)
VALUES (
  3, 1, 1, 'completed',
  '{
    "empresas": [
      {
        "id": 201,
        "nombre": "Sushi Bamboo",
        "calificaciones": { "rating": 4.4, "total_resenas": 81 },
        "precios": null,
        "sitio_web": null,
        "google_maps_url": "https://maps.google.com/?cid=7706111561290093484",
        "ubicacion": "Av. España 184, Santiago"
      },
      {
        "id": 202,
        "nombre": "Kamisushi MARCOLETA",
        "calificaciones": { "rating": 4.7, "total_resenas": 1567 },
        "precios": [
          { "producto": "BEBIDAS 350 CC LATA", "precio": 1800 },
          { "producto": "BEbida 1.5 LTS", "precio": 3500 },
          { "producto": "AGUA PCM 500ML", "precio": 990 },
          { "producto": "20 PIEZAS TWINS", "precio": 8700 },
          { "producto": "40 PIEZAS LUX", "precio": 15500 },
          { "producto": "HAND ROLL", "precio": 3500 },
          { "producto": "KAMINEITOR", "precio": 6500 },
          { "producto": "40 PIEZAS ESTUDIANTE", "precio": 11000 },
          { "producto": "100 PIEZAS LUX", "precio": 30000 },
          { "producto": "40 PIEZAS FURAY", "precio": 15000 },
          { "producto": "40 PIEZAS SUMMER", "precio": 15500 },
          { "producto": "50 PIEZAS GOLOSOS", "precio": 19400 }
        ],
        "sitio_web": "https://www.kamisushi.cl/",
        "google_maps_url": "https://maps.google.com/?cid=4856371402518782259",
        "ubicacion": "Marcoleta 558, Santiago"
      },
      {
        "id": 203,
        "nombre": "Aomori Nikkei & Sushi",
        "calificaciones": { "rating": 4.4, "total_resenas": 1408 },
        "precios": [
          { "producto": "Lomo Salteado (Filete)", "precio": 14900 },
          { "producto": "Limonadas", "precio": 4200 },
          { "producto": "Jugos Pulpa De Fruta", "precio": 5200 },
          { "producto": "Sour Clasicos 2X", "precio": 9800 },
          { "producto": "Ceviche De Pescado", "precio": 13900 },
          { "producto": "Ceviche Mixto", "precio": 15900 },
          { "producto": "Triologia De Ceviches", "precio": 15900 },
          { "producto": "Ceviche Carretillero", "precio": 16900 },
          { "producto": "Ceviche Aomori", "precio": 16900 },
          { "producto": "Sugerencia 1 (18 Pzas)", "precio": 16900 },
          { "producto": "Sugerencia 2 (32 Pzas)", "precio": 26900 },
          { "producto": "Sugerencia 3 (48 Pzas)", "precio": 36900 },
          { "producto": "Sugerencia 4 (64 Pzas)", "precio": 46900 },
          { "producto": "Camarones Tempura 8 Uds.", "precio": 9800 },
          { "producto": "Gyozas 5 Uds.", "precio": 5600 },
          { "producto": "Yakitori", "precio": 11200 },
          { "producto": "Chirashi Ebi", "precio": 9800 },
          { "producto": "Chirashi Tory", "precio": 9800 },
          { "producto": "Chirashi Aomori", "precio": 10200 },
          { "producto": "Sopa Ramen", "precio": 9800 }
        ],
        "sitio_web": "https://aomoritoesca.cl/",
        "google_maps_url": "https://maps.google.com/?cid=1454916012582908605",
        "ubicacion": "Toesca 1920, Santiago"
      },
      {
        "id": 204,
        "nombre": "KAMISUSHI",
        "calificaciones": { "rating": 4.3, "total_resenas": 493 },
        "precios": [
          { "producto": "BEBESTIBLES BEBIDAS 350 CC LATA", "precio": 1800 },
          { "producto": "BEbida 1.5 LTS", "precio": 3500 },
          { "producto": "AGUA PCM 500ML", "precio": 990 },
          { "producto": "20 PIEZAS TWINS", "precio": 8700 },
          { "producto": "40 PIEZAS LUX", "precio": 15500 },
          { "producto": "HAND ROLL", "precio": 3500 },
          { "producto": "KAMINEITOR", "precio": 6500 },
          { "producto": "40 PIEZAS ESTUDIANTE", "precio": 11000 },
          { "producto": "100 PIEZAS LUX", "precio": 30000 },
          { "producto": "40 PIEZAS FURAY", "precio": 15000 },
          { "producto": "40 PIEZAS SUMMER", "precio": 15500 },
          { "producto": "50 PIEZAS GOLOSOS", "precio": 19400 }
        ],
        "sitio_web": "http://www.sushikamisushi.cl/",
        "google_maps_url": "https://maps.google.com/?cid=7584235976356684197",
        "ubicacion": "San Pablo 2206, Santiago"
      }
    ],
    "busqueda": { "tema": "Sushi", "ubicacion": "Santiago Centro" },
    "fecha": "2025-06-10",
    "total_empresas": 4
  }'::jsonb,
  NOW() - INTERVAL '6 days'
);

-- Ejecución 4: Mismas empresas, datos actualizados
INSERT INTO analisis (id, tienda_id, usuario_id, status, payload_data, fecha_ejecucion)
VALUES (
  4, 1, 1, 'completed',
  '{
    "empresas": [
      {
        "id": 201,
        "nombre": "Sushi Bamboo",
        "calificaciones": { "rating": 4.5, "total_resenas": 95 },
        "precios": [
          { "producto": "Roll Clásico", "precio": 8900 },
          { "producto": "Roll Especial", "precio": 13900 },
          { "producto": "Roll Tempura", "precio": 9900 },
          { "producto": "Gohan de Pollo", "precio": 4500 },
          { "producto": "Gohan Salmón", "precio": 6200 },
          { "producto": "Sopa Miso", "precio": 3500 }
        ],
        "sitio_web": null,
        "google_maps_url": "https://maps.google.com/?cid=7706111561290093484",
        "ubicacion": "Av. España 184, Santiago"
      },
      {
        "id": 202,
        "nombre": "Kamisushi MARCOLETA",
        "calificaciones": { "rating": 4.7, "total_resenas": 1567 },
        "precios": [
          { "producto": "BEBIDAS 350 CC LATA", "precio": 1900 },
          { "producto": "BEbida 1.5 LTS", "precio": 3600 },
          { "producto": "AGUA PCM 500ML", "precio": 1050 },
          { "producto": "20 PIEZAS TWINS", "precio": 9200 },
          { "producto": "40 PIEZAS LUX", "precio": 16200 },
          { "producto": "HAND ROLL", "precio": 3700 },
          { "producto": "KAMINEITOR", "precio": 6900 },
          { "producto": "40 PIEZAS ESTUDIANTE", "precio": 11500 },
          { "producto": "100 PIEZAS LUX", "precio": 31000 },
          { "producto": "40 PIEZAS FURAY", "precio": 15800 },
          { "producto": "40 PIEZAS SUMMER", "precio": 16200 },
          { "producto": "50 PIEZAS GOLOSOS", "precio": 19900 }
        ],
        "sitio_web": "https://www.kamisushi.cl/",
        "google_maps_url": "https://maps.google.com/?cid=4856371402518782259",
        "ubicacion": "Marcoleta 558, Santiago"
      },
      {
        "id": 203,
        "nombre": "Aomori Nikkei & Sushi",
        "calificaciones": { "rating": 4.5, "total_resenas": 1420 },
        "precios": [
          { "producto": "Lomo Salteado (Filete)", "precio": 15200 },
          { "producto": "Limonadas", "precio": 4400 },
          { "producto": "Jugos Pulpa De Fruta", "precio": 5400 },
          { "producto": "Ceviche De Pescado", "precio": 14200 },
          { "producto": "Ceviche Mixto", "precio": 16200 },
          { "producto": "Triologia De Ceviches", "precio": 16200 },
          { "producto": "Ceviche Aomori", "precio": 17200 },
          { "producto": "Sugerencia 1 (18 Pzas)", "precio": 17200 },
          { "producto": "Sugerencia 2 (32 Pzas)", "precio": 27200 },
          { "producto": "Camarones Tempura 8 Uds.", "precio": 10100 },
          { "producto": "Camarones Nikkei 8 Uds.", "precio": 10100 },
          { "producto": "Gyozas 5 Uds.", "precio": 5800 },
          { "producto": "Yakitori", "precio": 11500 },
          { "producto": "Chirashi Ebi", "precio": 10100 },
          { "producto": "Chirashi Aomori", "precio": 10500 },
          { "producto": "Sopa Ramen", "precio": 10100 }
        ],
        "sitio_web": "https://aomoritoesca.cl/",
        "google_maps_url": "https://maps.google.com/?cid=1454916012582908605",
        "ubicacion": "Toesca 1920, Santiago"
      },
      {
        "id": 204,
        "nombre": "KAMISUSHI",
        "calificaciones": { "rating": 4.3, "total_resenas": 493 },
        "precios": [
          { "producto": "BEBESTIBLES BEBIDAS 350 CC LATA", "precio": 1900 },
          { "producto": "BEbida 1.5 LTS", "precio": 3600 },
          { "producto": "AGUA PCM 500ML", "precio": 1050 },
          { "producto": "20 PIEZAS TWINS", "precio": 9200 },
          { "producto": "40 PIEZAS LUX", "precio": 16200 },
          { "producto": "HAND ROLL", "precio": 3700 },
          { "producto": "KAMINEITOR", "precio": 6900 },
          { "producto": "40 PIEZAS ESTUDIANTE", "precio": 11500 },
          { "producto": "40 PIEZAS FURAY", "precio": 15800 },
          { "producto": "40 PIEZAS SUMMER", "precio": 16200 },
          { "producto": "50 PIEZAS GOLOSOS", "precio": 19900 }
        ],
        "sitio_web": "http://www.sushikamisushi.cl/",
        "google_maps_url": "https://maps.google.com/?cid=7584235976356684197",
        "ubicacion": "San Pablo 2206, Santiago"
      }
    ],
    "busqueda": { "tema": "Sushi", "ubicacion": "Santiago Centro" },
    "fecha": "2025-06-14",
    "total_empresas": 4
  }'::jsonb,
  NOW() - INTERVAL '2 days'
);

-- Ejecución 5: Nuevas empresas en Providencia
INSERT INTO analisis (id, tienda_id, usuario_id, status, payload_data, fecha_ejecucion)
VALUES (
  5, 1, 1, 'completed',
  '{
    "empresas": [
      {
        "id": 301,
        "nombre": "Nikkei House",
        "calificaciones": { "rating": 4.7, "total_resenas": 520 },
        "precios": [
          { "producto": "Ceviche Clásico", "precio": 8900 },
          { "producto": "Ceviche Mixto", "precio": 10900 },
          { "producto": "Roll Nikkei", "precio": 11500 },
          { "producto": "Roll Salmón", "precio": 12200 },
          { "producto": "Gohan Salmón", "precio": 6500 },
          { "producto": "Gohan Pollo", "precio": 4800 },
          { "producto": "Lomo Saltado", "precio": 14900 },
          { "producto": "Chirashi Mixto", "precio": 10500 },
          { "producto": "Pisco Sour", "precio": 4500 }
        ],
        "sitio_web": "https://nikkeihouse.cl",
        "google_maps_url": "https://maps.google.com/?cid=301",
        "ubicacion": "Av. Providencia 1234, Providencia"
      },
      {
        "id": 302,
        "nombre": "Osaka Sushi Bar",
        "calificaciones": { "rating": 4.5, "total_resenas": 340 },
        "precios": [
          { "producto": "Roll Osaka", "precio": 13500 },
          { "producto": "Roll Salmón", "precio": 11800 },
          { "producto": "Roll Philadelphia", "precio": 10200 },
          { "producto": "Gohan Salmón", "precio": 5900 },
          { "producto": "Gohan de Pollo", "precio": 4500 },
          { "producto": "Ceviche de Pescado", "precio": 9200 },
          { "producto": "Sopa Miso", "precio": 3800 },
          { "producto": "AGUA MINERAL 500ML", "precio": 900 }
        ],
        "sitio_web": "https://osakasushi.cl",
        "google_maps_url": "https://maps.google.com/?cid=302",
        "ubicacion": "Calle Los Leones 567, Providencia"
      },
      {
        "id": 303,
        "nombre": "Sushi Nori",
        "calificaciones": { "rating": 4.0, "total_resenas": 88 },
        "precios": null,
        "sitio_web": null,
        "google_maps_url": "https://maps.google.com/?cid=303",
        "ubicacion": "Providencia 890, Providencia"
      },
      {
        "id": 304,
        "nombre": "Dragon Sushi",
        "calificaciones": { "rating": 4.6, "total_resenas": 410 },
        "precios": [
          { "producto": "Roll Dragon", "precio": 16900 },
          { "producto": "Roll Salmón", "precio": 11000 },
          { "producto": "Roll Tempura", "precio": 9500 },
          { "producto": "Gohan Salmón", "precio": 6100 },
          { "producto": "Gohan de Pollo", "precio": 4600 },
          { "producto": "Ceviche Mixto", "precio": 11200 },
          { "producto": "Chirashi Salmón", "precio": 9800 },
          { "producto": "Sopa Ramen", "precio": 7500 }
        ],
        "sitio_web": "https://dragonsushi.cl",
        "google_maps_url": "https://maps.google.com/?cid=304",
        "ubicacion": "Nueva Providencia 210, Providencia"
      }
    ],
    "busqueda": { "tema": "Sushi", "ubicacion": "Providencia" },
    "fecha": "2025-07-01",
    "total_empresas": 4
  }'::jsonb,
  NOW() - INTERVAL '1 day'
);

-- Resetear secuencia
SELECT setval('analisis_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM analisis) - 1);