# PymeTracker – Casos de Prueba

## Unit Tests

### UT-01: Registro – validación de campos obligatorios
- **Prioridad:** Alta
- **Pasos:**
  1. Enviar POST `/api/auth/register` sin body
  2. Verificar respuesta `400` con mensaje de campos requeridos
  3. Enviar POST con email vacío
  4. Verificar respuesta `400`
- **Datos:** `{ nombre: "", email: "", password: "" }`

### UT-02: Registro – email duplicado
- **Prioridad:** Alta
- **Pasos:**
  1. Crear usuario con email `test@test.com`
  2. Enviar POST `/api/auth/register` con el mismo email
  3. Verificar respuesta `409` y que no se crea duplicado
- **Datos:** `{ nombre: "Test", email: "test@test.com", password: "123456" }`

### UT-03: Login – credenciales inválidas
- **Prioridad:** Alta
- **Pasos:**
  1. Enviar POST `/api/auth/login` con email no registrado
  2. Verificar respuesta `401`
  3. Enviar POST con email válido pero password incorrecto
  4. Verificar respuesta `401`
- **Datos:** `{ email: "noexiste@test.com", password: "x" }`

### UT-04: Login – campos vacíos
- **Prioridad:** Media
- **Pasos:**
  1. Enviar POST `/api/auth/login` con email vacío
  2. Verificar mensaje de requeridos
  3. Enviar POST con password vacío
  4. Verificar mensaje de requeridos

### UT-05: Recuperación de contraseña – flujo completo
- **Prioridad:** Alta
- **Pasos:**
  1. Enviar POST `/api/auth/forgot-password` con email registrado
  2. Verificar respuesta `200` y que se genera reset_token
  3. Enviar POST `/api/auth/reset-password` con token válido y nueva password
  4. Verificar respuesta `200`
  5. Iniciar sesión con la nueva contraseña
  6. Verificar que el token expira después de usarse

### UT-06: Suscripción – cancelación de plan activo
- **Prioridad:** Media
- **Pasos:**
  1. Crear suscripción activa para un usuario
  2. Enviar POST `/api/suscripciones/cancelar`
  3. Verificar que estado cambia a `cancelada` y fecha_cancelacion se setea

### UT-07: Tickets – envío con campos obligatorios
- **Prioridad:** Alta
- **Pasos:**
  1. Enviar POST `/api/tickets` sin asunto
  2. Verificar respuesta `400`
  3. Enviar POST sin descripción
  4. Verificar respuesta `400`

---

## Integration Tests

### IT-01: Registro exitoso – solo usuario
- **Prioridad:** Alta
- **Pasos:**
  1. Enviar POST `/api/auth/register` con datos válidos (solo usuario, sin empresa)
  2. Verificar respuesta `201` con token JWT
  3. Verificar que el usuario existe en DB
  4. Verificar que no se creó empresa
- **Datos:** `{ nombre: "Juan", email: "juan@test.com", password: "pass123" }`

### IT-02: Registro exitoso – usuario + empresa
- **Prioridad:** Alta
- **Pasos:**
  1. Enviar POST `/api/auth/register` con datos de usuario y empresa
  2. Verificar respuesta `201` con token JWT
  3. Verificar que se crearon usuario, empresa y relación usuario_empresas
  4. Verificar que se creó una tienda por defecto
- **Datos:** `{ nombre: "María", email: "maria@test.com", password: "pass123", empresa: { nombre: "Mi Empresa", rubro: "tecnologia" } }`

### IT-03: Login exitoso
- **Prioridad:** Alta
- **Pasos:**
  1. Crear usuario en DB
  2. Enviar POST `/api/auth/login` con credenciales válidas
  3. Verificar respuesta `200` con token JWT
  4. Verificar que el token contiene `id`, `email`, `rol`, `planActivo`
- **Datos:** `{ email: "test@test.com", password: "pass123" }`

### IT-04: Perfiles de empresa – CRUD
- **Prioridad:** Alta
- **Pasos:**
  1. Autenticarse y obtener token
  2. GET `/api/empresas` → listar perfiles
  3. POST `/api/empresas` con body `{ nombre, rubro }` → crear
  4. PUT `/api/empresas/:id` con `{ nombre: "Nuevo nombre" }` → actualizar
  5. Verificar cambios en DB

### IT-05: Perfiles – cambio de perfil activo
- **Prioridad:** Media
- **Pasos:**
  1. Crear dos empresas para el mismo usuario
  2. POST `/api/empresas/:id/seleccionar` para cambiar perfil activo
  3. GET `/api/perfil` → verificar que devuelve la empresa activa correcta
  4. Verificar que no se requiere recargar sesión

### IT-06: Análisis – ejecución exitosa
- **Prioridad:** Alta
- **Pasos:**
  1. Tener empresa con rubro, tienda activa con dirección
  2. POST `/api/analisis` con `{ nResults: 5 }`
  3. Verificar respuesta `201`
  4. Verificar que se creó registro en tabla `analisis` con status `pending`
  5. Verificar que se llamó al worker externo con los datos correctos (topic, location)

### IT-07: Análisis – validación sin rubro
- **Prioridad:** Alta
- **Pasos:**
  1. Tener empresa sin rubro definido
  2. POST `/api/analisis`
  3. Verificar respuesta `400` con mensaje "Debes completar el rubro"

### IT-08: Análisis – validación sin tienda activa
- **Prioridad:** Alta
- **Pasos:**
  1. Tener usuario sin `tiendaActivaId`
  2. POST `/api/analisis`
  3. Verificar respuesta `400` con mensaje "No hay una tienda/sucursal activa"

### IT-09: Análisis – validación sin dirección
- **Prioridad:** Alta
- **Pasos:**
  1. Tener tienda activa sin dirección y empresa sin dirección/comuna
  2. POST `/api/analisis`
  3. Verificar respuesta `400` con mensaje "Debes completar la dirección de la sucursal o de tu empresa"

### IT-10: Competencia – listado con tienda activa
- **Prioridad:** Alta
- **Pasos:**
  1. Tener análisis completado para la tienda activa
  2. GET `/api/competencia`
  3. Verificar respuesta `200` con listado de competidores
  4. Verificar que no incluye el nombre de la propia empresa

### IT-11: Competencia – error sin tienda activa
- **Prioridad:** Alta
- **Pasos:**
  1. Usuario sin `tiendaActivaId`
  2. GET `/api/competencia`
  3. Verificar respuesta `400`

### IT-12: Valoración – GET con tienda activa
- **Prioridad:** Alta
- **Pasos:**
  1. Tener análisis completado con datos de valoraciones
  2. GET `/api/valoracion?competidorNombre=...`
  3. Verificar respuesta `200` con datos de valoración

### IT-13: Valoración – error sin tienda activa
- **Prioridad:** Alta
- **Pasos:**
  1. Usuario sin `tiendaActivaId`
  2. GET `/api/valoracion`
  3. Verificar respuesta `400`

### IT-14: Dashboard – datos de métricas
- **Prioridad:** Media
- **Pasos:**
  1. Tener análisis completado con precioPromedio y competidores
  2. GET `/api/dashboard/metricas`
  3. Verificar que devuelve `precioPromedioMercado`, `totalCompetidores`, `ultimoAnalisis`

### IT-15: Dashboard – historial de análisis
- **Prioridad:** Media
- **Pasos:**
  1. Tener varios análisis ejecutados
  2. GET `/api/dashboard/historial`
  3. Verificar listado ordenado por fecha descendente

### IT-16: Suscripción – contratación con Flow
- **Prioridad:** Alta
- **Pasos:**
  1. Usuario sin suscripción activa
  2. POST `/api/suscripciones/contratar` con `{ plan: "premium" }`
  3. Verificar redirección a Flow o respuesta con URL de pago
  4. Simular webhook de Flow con pago exitoso
  5. Verificar que suscripción queda `activa` con fecha_fin correcta

### IT-17: Tickets – envío y respuesta admin
- **Prioridad:** Alta
- **Pasos:**
  1. Usuario autenticado envía POST `/api/tickets` con asunto y descripción
  2. Verificar respuesta `201` y ticket en DB
  3. Admin responde: PUT `/api/tickets/:id` con estado `respondido` y mensaje
  4. Usuario obtiene GET `/api/tickets` → ver el ticket y la respuesta

### IT-18: Admin – historial global con filtros
- **Prioridad:** Media
- **Pasos:**
  1. Autenticarse como admin
  2. GET `/api/admin/analisis` → listar todas las ejecuciones
  3. GET `/api/admin/analisis?fechaDesde=...&fechaHasta=...&usuarioId=...&rubro=...`
  4. Verificar filtros aplicados correctamente

---

## E2E Tests

### E2E-01: Flujo completo – registro, login, dashboard
- **Prioridad:** Alta
- **Pasos:**
  1. Visitar `/register` y completar formulario (usuario + empresa)
  2. Ver redirección a `/dashboard`
  3. Ver métricas y cards del dashboard
  4. Cerrar sesión
  5. Visitar `/login` e ingresar credenciales
  6. Ver redirección a `/dashboard` con datos correctos
- **Datos:** Usuario: nombre, email, password | Empresa: nombre, rubro

### E2E-02: Ejecutar análisis y ver competencia
- **Prioridad:** Alta
- **Pasos:**
  1. Iniciar sesión con empresa que tiene rubro, tienda y dirección
  2. Navegar a página de análisis
  3. Configurar `nResults` y ejecutar
  4. Esperar procesamiento (o ver estado pendiente)
  5. Navegar a `/competencia`
  6. Ver listado de competidores, gráfico y reseñas

### E2E-03: Suscripción – contratar y cancelar
- **Prioridad:** Alta
- **Pasos:**
  1. Usuario sin plan activo visita dashboard
  2. Ver redirección a `/plan`
  3. Seleccionar plan y pagar con Flow (simular éxito)
  4. Ver redirección a dashboard
  5. Ir a settings y cancelar suscripción
  6. Confirmar cancelación
  7. Ver que el plan aparece como cancelado

### E2E-04: Soporte – crear y dar seguimiento a ticket
- **Prioridad:** Media
- **Pasos:**
  1. Ir a `/soporte`
  2. Crear ticket con asunto y descripción
  3. Ver confirmación y ticket en listado
  4. (Admin) Ir a admin/tickets y responder
  5. (Usuario) Recargar y ver respuesta

### E2E-05: Recuperación de contraseña
- **Prioridad:** Media
- **Pasos:**
  1. Ir a `/login` y click en "Olvidaste tu contraseña"
  2. Ingresar email registrado
  3. Ver mensaje de éxito
  4. Acceder al enlace del correo (simulado)
  5. Ingresar nueva contraseña
  6. Iniciar sesión con la nueva contraseña
