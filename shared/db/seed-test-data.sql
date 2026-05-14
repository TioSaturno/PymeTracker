-- =====================================================
-- DATOS DE PRUEBA PARA Pymetracker
-- Ejecutar en pgAdmin contra la BD IngSoft
-- =====================================================

-- 1. Empresa (restaurante de sushi)
INSERT INTO empresas (id, nombre, rubro, fecha_registro)
VALUES (1, 'SushiExpress SpA', 'Gastronomía', NOW())
ON CONFLICT (id) DO NOTHING;

-- 2. Ciudad
INSERT INTO ciudades (id, nombre, region)
VALUES (1, 'Rancagua', 'O''Higgins')
ON CONFLICT (id) DO NOTHING;

-- 3. Tienda (sucursal)
INSERT INTO tiendas (id, empresa_id, ciudad_id, nombre, direccion, fecha_creacion)
VALUES (1, 1, 1, 'SushiExpress Rancagua', 'Av. Brasil 450', NOW())
ON CONFLICT (id) DO NOTHING;

-- 4. Usuario
INSERT INTO usuarios (id, empresa_id, nombre, email, password_hash, rol, fecha_creacion)
VALUES (1, 1, 'Admin SushiExpress', 'admin@sushiexpress.cl', 'hash_placeholder', 'admin', NOW())
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 5. Análisis — Ejecución 1 del scraper
-- =====================================================
INSERT INTO analisis (id, tienda_id, usuario_id, status, payload_data, fecha_ejecucion)
VALUES (
  1, 1, 1, 'completed',
  '{
    "empresas": [
      {
        "id": 101,
        "nombre": "Sushi sake",
        "calificaciones": { "rating": 4.8, "total_resenas": 498 },
        "precios": [
          { "producto": "Roll Sake", "precio": 8990 },
          { "producto": "Gohan de Pollo", "precio": 5990 },
          { "producto": "Roll Tempura", "precio": 7990 },
          { "producto": "Gohan Camarón", "precio": 6990 },
          { "producto": "Agua Mineral 500ml", "precio": 800 }
        ]
      },
      {
        "id": 102,
        "nombre": "Nikkei Sushi Bar",
        "calificaciones": { "rating": 4.5, "total_resenas": 320 },
        "precios": [
          { "producto": "Roll Nikkei", "precio": 9500 },
          { "producto": "Gohan Salmón", "precio": 7500 },
          { "producto": "Roll Ebi", "precio": 8500 },
          { "producto": "Gohan Mixto", "precio": 6500 },
          { "producto": "Coca Cola 350ml", "precio": 1000 }
        ]
      },
      {
        "id": 103,
        "nombre": "Rancagua Sushi",
        "calificaciones": { "rating": 4.2, "total_resenas": 210 },
        "precios": [
          { "producto": "Roll Clásico", "precio": 6500 },
          { "producto": "Gohan Pollo", "precio": 4500 },
          { "producto": "Roll Especial", "precio": 8900 },
          { "producto": "Gohan Camarón", "precio": 5500 }
        ]
      },
      {
        "id": 104,
        "nombre": "Osaka Sushi",
        "calificaciones": { "rating": 4.6, "total_resenas": 380 },
        "precios": [
          { "producto": "Roll Osaka", "precio": 9900 },
          { "producto": "Gohan Salmón", "precio": 7200 },
          { "producto": "Roll Philadelphia", "precio": 8200 },
          { "producto": "Gohan Pollo", "precio": 4800 },
          { "producto": "Sprite 350ml", "precio": 900 }
        ]
      }
    ],
    "busqueda": { "tema": "Sushi", "ubicacion": "Rancagua" },
    "fecha": "2024-05-17",
    "total_empresas": 4
  }'::jsonb,
  NOW() - INTERVAL '7 days'
);

-- =====================================================
-- 6. Análisis — Ejecución 2 (datos actualizados, misma zona)
-- =====================================================
INSERT INTO analisis (id, tienda_id, usuario_id, status, payload_data, fecha_ejecucion)
VALUES (
  2, 1, 1, 'completed',
  '{
    "empresas": [
      {
        "id": 101,
        "nombre": "Sushi sake",
        "calificaciones": { "rating": 4.9, "total_resenas": 545 },
        "precios": [
          { "producto": "Roll Sake", "precio": 9200 },
          { "producto": "Gohan de Pollo", "precio": 6200 },
          { "producto": "Roll Tempura", "precio": 8200 },
          { "producto": "Gohan Camarón", "precio": 7200 },
          { "producto": "Roll Philadelphia", "precio": 8500 },
          { "producto": "Agua Mineral 500ml", "precio": 900 }
        ]
      },
      {
        "id": 102,
        "nombre": "Nikkei Sushi Bar",
        "calificaciones": { "rating": 4.6, "total_resenas": 340 },
        "precios": [
          { "producto": "Roll Nikkei", "precio": 9900 },
          { "producto": "Gohan Salmón", "precio": 7800 },
          { "producto": "Roll Ebi", "precio": 8900 },
          { "producto": "Gohan Mixto", "precio": 6800 },
          { "producto": "Roll Clásico", "precio": 5500 },
          { "producto": "Cerveza 500ml", "precio": 2500 }
        ]
      },
      {
        "id": 103,
        "nombre": "Rancagua Sushi",
        "calificaciones": { "rating": 4.3, "total_resenas": 240 },
        "precios": [
          { "producto": "Roll Clásico", "precio": 6900 },
          { "producto": "Gohan Pollo", "precio": 4700 },
          { "producto": "Roll Especial", "precio": 9200 },
          { "producto": "Gohan Camarón", "precio": 5700 },
          { "producto": "Roll Sake", "precio": 8100 }
        ]
      },
      {
        "id": 104,
        "nombre": "Osaka Sushi",
        "calificaciones": { "rating": 4.7, "total_resenas": 410 },
        "precios": [
          { "producto": "Roll Osaka", "precio": 10500 },
          { "producto": "Gohan Salmón", "precio": 7500 },
          { "producto": "Roll Philadelphia", "precio": 8500 },
          { "producto": "Gohan Pollo", "precio": 5000 },
          { "producto": "Roll Tempura", "precio": 9000 },
          { "producto": "Fanta 350ml", "precio": 950 }
        ]
      }
    ],
    "busqueda": { "tema": "Sushi", "ubicacion": "Rancagua" },
    "fecha": "2024-05-24",
    "total_empresas": 4
  }'::jsonb,
  NOW() - INTERVAL '1 day'
);

-- Resetear secuencias para que los próximos inserts automáticos no choquen
SELECT setval('empresas_id_seq', (SELECT COALESCE(MAX(id), 0) FROM empresas));
SELECT setval('ciudades_id_seq', (SELECT COALESCE(MAX(id), 0) FROM ciudades));
SELECT setval('tiendas_id_seq', (SELECT COALESCE(MAX(id), 0) FROM tiendas));
SELECT setval('usuarios_id_seq', (SELECT COALESCE(MAX(id), 0) FROM usuarios));
SELECT setval('analisis_id_seq', (SELECT COALESCE(MAX(id), 0) FROM analisis));