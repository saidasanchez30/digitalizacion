# Control de Calidad

**Aplicación:** API de Digitalización Documental  
**Base URL (desarrollo):** `http://localhost:8001`  
**Suite de tests:** `backend/tests/`  
**Total de tests:** 61 · **Estado actual:** ✅ 61/61 pasando

---

## Índice

1. [Estrategia de pruebas](#1-estrategia-de-pruebas)
2. [Ejecutar los tests automatizados](#2-ejecutar-los-tests-automatizados)
3. [Guiones de prueba manuales](#3-guiones-de-prueba-manuales)
4. [Cobertura por módulo](#4-cobertura-por-módulo)
5. [Bugs encontrados por los tests](#5-bugs-encontrados-por-los-tests)

---

## 1. Estrategia de pruebas

### Niveles cubiertos

| Nivel | Herramienta | Descripción |
|---|---|---|
| **Integración de API** | `pytest` + `TestClient` | Cada endpoint recibe peticiones HTTP reales contra una base de datos SQLite en memoria |
| **Lógica de negocio** | Implícito en tests de API | El cálculo de precios, fechas y validaciones se verifica en cada caso |
| **Validación de esquemas** | Pydantic + pytest | Se comprueba que los campos obligatorios están presentes y que los errores de formato retornan `422` |

### Principios aplicados

- **Aislamiento total:** cada test levanta sus propias tablas SQLite en memoria y las destruye al finalizar. No hay dependencia entre tests.
- **Nombres descriptivos:** los nombres de los tests describen el escenario en español (`test_falla_cancelar_orden_ya_cancelada`) de forma que el reporte de pytest sirve como documentación viva.
- **Fixtures reutilizables:** los datos de prueba (servicios, extras, cotizaciones, órdenes) se crean mediante fixtures de pytest declaradas en `conftest.py`, evitando código duplicado.
- **Sin mocks de BD:** los tests usan una base de datos real (SQLite) en lugar de mocks, lo que garantiza que las consultas SQL, relaciones y transacciones se comportan igual que en producción.

---

## 2. Ejecutar los tests automatizados

### Requisitos previos

```bash
cd backend
source venv/bin/activate
pip install -r requirements-test.txt
```

### Comando básico

```bash
cd backend
source venv/bin/activate
pytest
```

### Salida esperada

```
============================= test session starts ==============================
collected 61 items

tests/test_extras.py::TestListarExtras::test_retorna_lista_vacia_sin_datos PASSED
tests/test_extras.py::TestListarExtras::test_retorna_extra_de_precio_fijo PASSED
...
tests/test_vault.py::TestListarDocumentosBoveda::test_falla_listar_boveda_de_orden_inexistente PASSED

======================= 61 passed in 1.6s ========================
```

### Opciones útiles

| Comando | Descripción |
|---|---|
| `pytest` | Ejecuta todos los tests |
| `pytest -v` | Salida detallada (por defecto en este proyecto) |
| `pytest tests/test_quotations.py` | Solo el módulo de cotizaciones |
| `pytest -k "cancelar"` | Tests cuyo nombre contenga "cancelar" |
| `pytest --tb=long` | Traza de error completa (útil para depurar) |
| `pytest --cov=app --cov-report=term-missing` | Informe de cobertura de código |

### Informe de cobertura

```bash
pytest --cov=app --cov-report=term-missing
```

---

## 3. Guiones de prueba manuales

Los guiones manuales se ejecutan sobre la API real con la BD de desarrollo activa.  
**Base URL:** `http://localhost:8001` · **Swagger UI:** `http://localhost:8001/docs`

---

### GP-01 · Verificación del servidor

**Objetivo:** confirmar que el servidor está en línea y responde correctamente.

| Paso | Acción | Resultado esperado |
|---|---|---|
| 1 | `GET /` | `200 OK` · body: `{"message": "API de Digitalización Documental funcionando correctamente"}` |
| 2 | `GET /docs` en el navegador | Swagger UI cargado con todos los endpoints visibles |

---

### GP-02 · Listar catálogo

**Objetivo:** verificar que los seeders han poblado servicios y extras correctamente.

| Paso | Acción | Resultado esperado |
|---|---|---|
| 1 | `GET /services/` | Array con al menos 2 servicios: `Estándar` (is_premium: false) y `Premium` (is_premium: true) |
| 2 | `GET /extras/` | Array con al menos 3 extras: precio fijo, porcentaje y urgencia |
| 3 | Verificar campos de servicios | Cada servicio tiene `id`, `name`, `description`, `price_per_1000_pages`, `estimated_days`, `is_premium` |
| 4 | Verificar campos de extras | Cada extra tiene `id`, `name`, `description`, `price`, `percentage`, `reduces_delivery_days` |

---

### GP-03 · Flujo completo de cotización (servicio Estándar, sin extras)

**Objetivo:** crear una cotización y verificar que el precio y la fecha se calculan correctamente.

**Datos de prueba:** servicio Estándar (`id: 1`), 2000 páginas.

| Paso | Acción | Resultado esperado |
|---|---|---|
| 1 | `POST /quotations/` con el cuerpo de abajo | `200 OK` |
| 2 | Verificar `subtotal` | `30.0` (2000/1000 × 15.0) |
| 3 | Verificar `extras_total` | `0.0` |
| 4 | Verificar `total` | `30.0` |
| 5 | Verificar `estimated_delivery_date` | `pickup_date + 10 días` |
| 6 | Verificar `status` | `quotation_generated` |

**Body:**

```json
{
  "company_name": "Empresa Demo S.A.",
  "contact_name": "Luis Martínez",
  "email": "luis@empresa.com",
  "phone": "612000001",
  "service_id": 1,
  "estimated_pages": 2000,
  "delivery_method": "digital",
  "pickup_date": "2026-07-01",
  "extra_ids": []
}
```

---

### GP-04 · Cotización con extras (precio fijo + urgencia)

**Objetivo:** verificar el cálculo combinado de extras y la reducción de plazo.

**Datos de prueba:** servicio Estándar (`id: 1`), 1000 páginas, extra precio fijo 50€ + extra urgencia 30€.

| Paso | Acción | Resultado esperado |
|---|---|---|
| 1 | `POST /quotations/` con extra_ids de precio fijo y urgencia | `200 OK` |
| 2 | Verificar `subtotal` | `15.0` (1000/1000 × 15.0) |
| 3 | Verificar `extras_total` | `80.0` (50 + 30) |
| 4 | Verificar `total` | `95.0` |
| 5 | Verificar `estimated_delivery_date` | `pickup_date + 7 días` (10 − 3 por urgencia) |

---

### GP-05 · Cotización con email inválido

**Objetivo:** verificar que Pydantic valida el formato del email.

| Paso | Acción | Resultado esperado |
|---|---|---|
| 1 | `POST /quotations/` con `"email": "no-es-email"` | `422 Unprocessable Entity` |
| 2 | Verificar body | Array `detail` con descripción del error de validación |

---

### GP-06 · Cotización con servicio inexistente

**Objetivo:** verificar que la capa de negocio rechaza servicios que no existen en BD.

| Paso | Acción | Resultado esperado |
|---|---|---|
| 1 | `POST /quotations/` con `"service_id": 9999` | `400 Bad Request` |
| 2 | Verificar `detail` | Contiene "servicio" |

---

### GP-07 · Creación de orden y compra

**Objetivo:** convertir una cotización en orden confirmada.

**Prerequisito:** cotización creada (ID obtenido en GP-03).

| Paso | Acción | Resultado esperado |
|---|---|---|
| 1 | `POST /orders/` con `quotation_id` de la cotización anterior | `200 OK` |
| 2 | Verificar `order_status` | `pickup_scheduled` |
| 3 | Verificar `payment_status` | `payment_confirmed` |
| 4 | `POST /orders/` con el mismo `quotation_id` (repetir compra) | `400 Bad Request` · "ya existe" |

---

### GP-08 · Seguimiento de estados de orden

**Objetivo:** verificar que el administrador puede avanzar la orden por todos los estados válidos.

**Prerequisito:** orden creada (ID obtenido en GP-07).

| Paso | Estado a aplicar (`PUT /orders/{id}/status`) | Resultado esperado |
|---|---|---|
| 1 | `documents_collected` | `200 OK` · estado actualizado |
| 2 | `digitizing` | `200 OK` · estado actualizado |
| 3 | `quality_review` | `200 OK` · estado actualizado |
| 4 | `preparing_delivery` | `200 OK` · estado actualizado |
| 5 | `delivered` | `200 OK` · estado actualizado |
| 6 | `estado_inventado` (estado inválido) | `400 Bad Request` · "válido" |
| 7 | Cualquier estado sobre orden `delivered` | `400 Bad Request` · "entregada" |

---

### GP-09 · Cancelación de orden

**Objetivo:** verificar que solo se puede cancelar una orden en estado inicial.

**Prerequisito:** nueva orden en estado `pickup_scheduled`.

| Paso | Acción | Resultado esperado |
|---|---|---|
| 1 | `POST /orders/{id}/cancel` | `200 OK` · `order_status: cancelled` · `payment_status: refund_pending` |
| 2 | `POST /orders/{id}/cancel` (repetir cancelación) | `400 Bad Request` · "ya está cancelada" |
| 3 | Crear nueva orden, avanzar a `digitizing`, intentar cancelar | `400 Bad Request` · "ya inició" |

---

### GP-10 · Bóveda digital (solo Plan Premium)

**Objetivo:** verificar que los documentos digitalizados se almacenan y solo en órdenes Premium.

**Prerequisito:** orden creada con el servicio Premium (`id: 2`).

| Paso | Acción | Resultado esperado |
|---|---|---|
| 1 | `POST /orders/{premium_id}/vault/documents` con el documento de prueba | `200 OK` · documento creado |
| 2 | Verificar `security_status` | `encrypted` |
| 3 | Verificar `ocr_status` | `not_applied` |
| 4 | `GET /orders/{premium_id}/vault` | Array con 1 documento |
| 5 | `POST /orders/{estandar_id}/vault/documents` (orden Estándar) | `400 Bad Request` · "premium" |
| 6 | `GET /orders/{estandar_id}/vault` (orden Estándar) | `400 Bad Request` · "premium" |

**Body de documento de prueba:**

```json
{
  "file_name": "factura_2026_001.pdf",
  "document_type": "Factura",
  "category": "Contabilidad",
  "department": "Finanzas",
  "description": "Factura de proveedor enero 2026",
  "keywords": "factura, proveedor, 2026",
  "storage_url": "s3://vault/factura_2026_001.pdf",
  "security_status": "encrypted",
  "ocr_status": "not_applied",
  "confidentiality_level": "internal",
  "retention_years": 7
}
```

---

## 4. Cobertura por módulo

| Archivo de tests | Módulo cubierto | Nº tests | Casos cubiertos |
|---|---|---|---|
| `test_health.py` | `GET /` | 3 | Status 200, mensaje, Content-Type |
| `test_services.py` | `GET /services/` | 6 | Lista vacía, datos, campos, valores |
| `test_extras.py` | `GET /extras/` | 6 | Lista vacía, tipos de extra, campos |
| `test_quotations.py` | `POST /quotations/` · `GET /quotations/` | 14 | Cálculo de precios, fechas, extras, validaciones, errores |
| `test_orders.py` | `POST/GET /orders/` · cancel · status | 21 | Creación, duplicados, cancelación, flujo de estados, errores |
| `test_vault.py` | `POST/GET /orders/{id}/vault` | 11 | Documentos Premium, restricción Estándar, campos, multi-documento |
| **Total** | | **61** | |

---

## 5. Bugs encontrados por los tests

Los tests automatizados descubrieron los siguientes bugs durante su creación:

| ID | Módulo | Descripción | Estado |
|---|---|---|---|
| BUG-01 | `vault_service.py` | El campo `retention_years` no se persistía en BD al crear documentos de bóveda (se recibía en el schema pero no se pasaba al modelo ORM) | ✅ Corregido en `add_vault_document()` |
