# Documentación de la API

**Base URL (desarrollo):** `http://localhost:8001`

**Documentación interactiva:** [http://localhost:8001/docs](http://localhost:8001/docs) (Swagger UI)

Todos los endpoints retornan y aceptan JSON. Las fechas usan formato `YYYY-MM-DD`.

---

## Índice de endpoints

| Método | Ruta                                     | Descripción                              |
|--------|------------------------------------------|------------------------------------------|
| GET    | `/`                                      | Verificación de estado del servidor      |
| GET    | `/services/`                             | Listar planes de servicio                |
| GET    | `/extras/`                               | Listar servicios adicionales             |
| POST   | `/quotations/`                           | Crear cotización                         |
| GET    | `/quotations/`                           | Listar cotizaciones                      |
| GET    | `/quotations/{quotation_id}`             | Obtener cotización por ID                |
| POST   | `/orders/`                               | Crear orden desde cotización             |
| GET    | `/orders/`                               | Listar órdenes                           |
| GET    | `/orders/{order_id}`                     | Obtener orden por ID                     |
| POST   | `/orders/{order_id}/cancel`              | Cancelar orden                           |
| PUT    | `/orders/{order_id}/status`              | Actualizar estado de orden (admin)       |
| GET    | `/orders/{order_id}/vault`               | Listar documentos de bóveda (Premium)    |
| POST   | `/orders/{order_id}/vault/documents`     | Agregar documento a bóveda (Premium)     |

---

## Servicios — `/services/`

### `GET /services/`

Retorna todos los planes de servicio disponibles.

**Response `200`:**

```json
[
  {
    "id": 1,
    "name": "Estándar",
    "description": "Digitalización de documentos físicos y entrega de archivos resultantes.",
    "price_per_1000_pages": 15.0,
    "estimated_days": 10,
    "is_premium": false
  },
  {
    "id": 2,
    "name": "Premium",
    "description": "Digitalización + Bóveda Digital con Gestión Documental.",
    "price_per_1000_pages": 25.0,
    "estimated_days": 7,
    "is_premium": true
  }
]
```

---

## Extras — `/extras/`

### `GET /extras/`

Retorna todos los servicios adicionales disponibles.

**Response `200`:**

```json
[
  {
    "id": 1,
    "name": "Digitalización urgente",
    "description": "Servicio prioritario con reducción del plazo de entrega.",
    "price": 0.0,
    "percentage": 30.0,
    "reduces_delivery_days": true
  },
  {
    "id": 2,
    "name": "OCR simulado",
    "description": "Reconocimiento óptico de caracteres para búsqueda de texto.",
    "price": 50.0,
    "percentage": 0.0,
    "reduces_delivery_days": false
  },
  {
    "id": 3,
    "name": "Entrega física",
    "description": "Entrega de archivos en unidad de almacenamiento física.",
    "price": 30.0,
    "percentage": 0.0,
    "reduces_delivery_days": false
  }
]
```

---

## Cotizaciones — `/quotations/`

### `POST /quotations/`

Crea una nueva cotización. El backend calcula automáticamente el subtotal, extras y total.

**Request body:**

```json
{
  "company_name": "Empresa Ejemplo S.A.",
  "contact_name": "Juan Pérez",
  "email": "juan@empresa.com",
  "phone": "+57 300 123 4567",
  "service_id": 1,
  "estimated_pages": 5000,
  "delivery_method": "digital",
  "pickup_date": "2026-06-01",
  "extra_ids": [1, 2]
}
```

**Campos del request:**

| Campo            | Tipo        | Requerido | Descripción                                    |
|------------------|-------------|-----------|------------------------------------------------|
| `company_name`   | string      | Sí        | Nombre de la empresa cliente                   |
| `contact_name`   | string      | Sí        | Nombre del contacto                            |
| `email`          | string      | Sí        | Email de contacto (validado)                   |
| `phone`          | string      | No        | Teléfono de contacto                           |
| `service_id`     | integer     | Sí        | ID del plan elegido                            |
| `estimated_pages`| integer     | Sí        | Número estimado de páginas a digitalizar       |
| `delivery_method`| string      | Sí        | `"digital"` o `"physical"`                     |
| `pickup_date`    | date        | Sí        | Fecha de recolección de documentos (YYYY-MM-DD)|
| `extra_ids`      | integer[]   | No        | Lista de IDs de extras a incluir               |

**Response `201`:**

```json
{
  "id": 1,
  "company_name": "Empresa Ejemplo S.A.",
  "contact_name": "Juan Pérez",
  "email": "juan@empresa.com",
  "phone": "+57 300 123 4567",
  "service_id": 1,
  "estimated_pages": 5000,
  "delivery_method": "digital",
  "pickup_date": "2026-06-01",
  "estimated_delivery_date": "2026-06-11",
  "subtotal": 75.0,
  "extras_total": 72.5,
  "total": 147.5,
  "status": "quotation_generated",
  "created_at": "2026-05-23T10:30:00",
  "extras": [...]
}
```

**Fórmula de cálculo:**

```
subtotal       = (estimated_pages / 1000) × price_per_1000_pages
urgente_extra  = subtotal × (percentage / 100)   [si aplica]
extras_total   = urgente_extra + Σ price extras fijos
total          = subtotal + extras_total
```

---

### `GET /quotations/`

Lista todas las cotizaciones.

**Response `200`:** Array de objetos cotización.

---

### `GET /quotations/{quotation_id}`

Obtiene una cotización por ID, incluyendo los extras asociados.

**Parámetros de ruta:**

| Parámetro      | Tipo    | Descripción                  |
|----------------|---------|------------------------------|
| `quotation_id` | integer | ID de la cotización          |

**Response `200`:** Objeto cotización con campo `extras` poblado.

**Response `404`:**

```json
{"detail": "Cotización no encontrada"}
```

---

## Órdenes — `/orders/`

### `POST /orders/`

Crea una orden de servicio a partir de una cotización existente. Solo se puede crear una orden por cotización.

**Request body:**

```json
{
  "quotation_id": 1,
  "payment_method": "credit_card"
}
```

**Valores válidos para `payment_method`:**

| Valor             | Descripción                  |
|-------------------|------------------------------|
| `credit_card`     | Tarjeta de crédito/débito     |
| `bank_transfer`   | Transferencia bancaria        |
| `cash_on_delivery`| Contra entrega               |
| `purchase_order`  | Orden de compra empresarial  |

**Response `201`:**

```json
{
  "id": 1,
  "quotation_id": 1,
  "payment_method": "credit_card",
  "payment_status": "payment_confirmed",
  "order_status": "pickup_scheduled",
  "created_at": "2026-05-23T10:35:00"
}
```

**Response `400` — cotización ya tiene orden:**

```json
{"detail": "Esta cotización ya tiene una orden asociada"}
```

---

### `GET /orders/`

Lista todas las órdenes con información básica de la cotización.

**Response `200`:** Array de objetos orden.

---

### `GET /orders/{order_id}`

Obtiene una orden por ID con detalle completo de la cotización.

**Response `404`:**

```json
{"detail": "Orden no encontrada"}
```

---

### `POST /orders/{order_id}/cancel`

Cancela una orden. Solo es posible si `order_status` es `pickup_scheduled`.

**Sin body requerido.**

**Response `200`:**

```json
{
  "id": 1,
  "order_status": "cancelled",
  "payment_status": "refund_pending",
  ...
}
```

**Response `400` — estado no permite cancelación:**

```json
{"detail": "Solo se puede cancelar una orden en estado 'pickup_scheduled'"}
```

---

### `PUT /orders/{order_id}/status`

Actualiza el estado de una orden (uso exclusivo del panel de administración).

**Request body:**

```json
{
  "order_status": "documents_collected"
}
```

**Estados válidos y transiciones:**

| Estado actual          | Estados siguientes válidos               |
|------------------------|------------------------------------------|
| `pickup_scheduled`     | `documents_collected`, `cancelled`       |
| `documents_collected`  | `digitizing`                             |
| `digitizing`           | `quality_review`                         |
| `quality_review`       | `preparing_delivery`                     |
| `preparing_delivery`   | `delivered`                              |
| `delivered`            | `available_in_vault` (solo Premium)      |
| `available_in_vault`   | — (estado final)                         |
| `cancelled`            | — (estado final)                         |

**Todos los valores de `order_status`:**

```
pickup_scheduled | documents_collected | digitizing | quality_review
preparing_delivery | delivered | available_in_vault | cancelled
```

---

## Bóveda Digital — `/orders/{order_id}/vault/`

Disponible únicamente para órdenes cuya cotización usa el plan Premium (`is_premium: true`). Las solicitudes a estos endpoints con plan Estándar retornan `403`.

---

### `GET /orders/{order_id}/vault`

Lista todos los documentos de la bóveda de una orden.

**Response `200`:**

```json
[
  {
    "id": 1,
    "order_id": 1,
    "file_name": "contrato_2026.pdf",
    "document_type": "Contrato",
    "category": "Legal",
    "department": "Jurídico",
    "description": "Contrato de arrendamiento",
    "keywords": "arrendamiento, contrato, 2026",
    "document_date": "2026-01-15",
    "confidentiality_level": "confidential",
    "retention_years": 10,
    "security_status": "encrypted",
    "ocr_status": "completed",
    "storage_url": "https://storage.ejemplo.com/doc1.pdf",
    "created_at": "2026-05-23T11:00:00"
  }
]
```

**Response `403` — plan Estándar:**

```json
{"detail": "La bóveda digital solo está disponible para el plan Premium"}
```

---

### `POST /orders/{order_id}/vault/documents`

Agrega un documento a la bóveda digital de una orden Premium.

**Request body:**

```json
{
  "file_name": "factura_mayo.pdf",
  "document_type": "Factura",
  "category": "Contabilidad",
  "department": "Finanzas",
  "description": "Factura de servicios mayo 2026",
  "keywords": "factura, mayo, servicios",
  "document_date": "2026-05-01",
  "confidentiality_level": "internal",
  "retention_years": 5,
  "security_status": "encrypted",
  "ocr_status": "pending",
  "storage_url": "https://storage.ejemplo.com/factura.pdf"
}
```

**Campos del request:**

| Campo                  | Tipo    | Requerido | Descripción                                     |
|------------------------|---------|-----------|-------------------------------------------------|
| `file_name`            | string  | Sí        | Nombre del archivo                              |
| `document_type`        | string  | Sí        | Tipo de documento (Contrato, Factura, etc.)     |
| `category`             | string  | Sí        | Categoría documental                            |
| `department`           | string  | No        | Área o departamento                             |
| `description`          | string  | No        | Descripción libre del documento                 |
| `keywords`             | string  | No        | Palabras clave separadas por comas              |
| `document_date`        | date    | No        | Fecha del documento (YYYY-MM-DD)                |
| `confidentiality_level`| string  | Sí        | `public`, `internal`, `confidential`, `secret`  |
| `retention_years`      | integer | Sí        | Años de conservación del documento              |
| `security_status`      | string  | Sí        | `encrypted`, `pending_encryption`               |
| `ocr_status`           | string  | Sí        | `pending`, `processing`, `completed`, `failed`  |
| `storage_url`          | string  | Sí        | URL del archivo almacenado                      |

**Response `201`:** Objeto documento creado.

---

## Códigos de respuesta HTTP

| Código | Significado                                          |
|--------|------------------------------------------------------|
| 200    | Operación exitosa                                    |
| 201    | Recurso creado correctamente                         |
| 400    | Datos inválidos o regla de negocio incumplida        |
| 403    | Operación no permitida (plan Estándar en bóveda)     |
| 404    | Recurso no encontrado                                |
| 422    | Error de validación de esquema (Pydantic)            |
| 500    | Error interno del servidor                           |
