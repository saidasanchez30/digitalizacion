# Arquitectura del sistema

---

## Diagrama de capas

```
┌─────────────────────────────────────────────────────────┐
│                      USUARIO FINAL                      │
│              Navegador web (Chrome, Firefox…)           │
└─────────────────────────┬───────────────────────────────┘
                          │ HTTP / HTTPS
┌─────────────────────────▼───────────────────────────────┐
│                 FRONTEND — React 19 + Vite              │
│                                                         │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────┐ │
│  │    Pages     │  │  Components   │  │    Hooks     │ │
│  │  (vistas)    │  │ (reutilizable)│  │  (lógica UI) │ │
│  └──────────────┘  └───────────────┘  └──────────────┘ │
│                                                         │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────┐ │
│  │   api/api.js │  │  AuthContext  │  │    Utils     │ │
│  │ (Axios client│  │ (sesión admin)│  │ (formatters) │ │
│  └──────────────┘  └───────────────┘  └──────────────┘ │
└─────────────────────────┬───────────────────────────────┘
                          │ REST JSON (puerto 8001)
┌─────────────────────────▼───────────────────────────────┐
│             BACKEND — FastAPI + Uvicorn                 │
│                                                         │
│  ┌────────────────────────────────────────────────────┐ │
│  │                   Controllers                      │ │
│  │  /services  /extras  /quotations  /orders  /vault  │ │
│  └───────────────────────┬────────────────────────────┘ │
│                          │                              │
│  ┌────────────────────────────────────────────────────┐ │
│  │                    Services                        │ │
│  │  QuotationService  OrderService  VaultService      │ │
│  └───────────────────────┬────────────────────────────┘ │
│                          │                              │
│  ┌────────────────────────────────────────────────────┐ │
│  │                     Models                         │ │
│  │  Service  Extra  Quotation  Order  VaultDocument   │ │
│  └───────────────────────┬────────────────────────────┘ │
│                          │ SQLAlchemy ORM               │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│              BASE DE DATOS — PostgreSQL                 │
│         (local en desarrollo / Supabase en prod)        │
│                                                         │
│  services  extras  quotations  quotation_extras         │
│  orders    vault_documents                              │
└─────────────────────────────────────────────────────────┘
```

---

## Patrón de capas del backend

El backend sigue un patrón de responsabilidades en cuatro capas:

| Capa        | Carpeta        | Responsabilidad                                              |
|-------------|----------------|--------------------------------------------------------------|
| Modelos     | `models/`      | Definición de tablas ORM (SQLAlchemy). No contienen lógica. |
| Esquemas    | `schemas/`     | Validación de entrada/salida con Pydantic.                  |
| Servicios   | `services/`    | Lógica de negocio (cálculos, validaciones de dominio).      |
| Controladores | `controllers/` | Endpoints HTTP: reciben request, llaman al servicio, devuelven response. |

### Flujo de una solicitud

```
Request HTTP
    → Controller  (valida esquema, extrae parámetros)
    → Service     (ejecuta la lógica de negocio)
    → Model       (consulta / escritura en BD via SQLAlchemy)
    → Response    (serialización con esquema Pydantic)
```

---

## Patrón del frontend

| Capa        | Carpeta        | Responsabilidad                                              |
|-------------|----------------|--------------------------------------------------------------|
| Páginas     | `pages/`       | Vistas completas asociadas a rutas de React Router.         |
| Componentes | `components/`  | Elementos reutilizables sin lógica de negocio propia.       |
| Hooks       | `hooks/`       | Abstracción de llamadas HTTP (`useApi`) y estado reactivo.  |
| API client  | `api/api.js`   | Instancia Axios con interceptores de normalización.         |
| Contextos   | `context/`     | Estado global compartido (`AuthContext`).                   |
| Utilidades  | `utils/`       | Funciones puras: formato de moneda, etiquetas de estado.    |

---

## Comunicación entre capas

### Frontend → Backend

- Todas las solicitudes HTTP pasan por `src/api/api.js`.
- El cliente Axios normaliza automáticamente las respuestas (`response.data`).
- Los componentes y páginas consumen datos a través del hook `useApi`, que gestiona los estados `loading` y `error`.

### Backend → Base de datos

- SQLAlchemy crea las tablas automáticamente al iniciar (`Base.metadata.create_all()`).
- Las sesiones de base de datos se gestionan mediante la dependencia `get_db()` inyectada en cada endpoint.
- No se usa Alembic en este proyecto; los cambios de esquema requieren recrear las tablas manualmente.

---

## CORS

El backend permite solicitudes únicamente desde el origen del frontend:

```python
allow_origins=["http://localhost:5173"]
```

En producción este valor debe actualizarse con el dominio real. Ver [SECURITY_CONFIG.md](../../SECURITY_CONFIG.md).

---

## Control de acceso

| Ruta frontend        | Acceso      | Mecanismo                         |
|----------------------|-------------|-----------------------------------|
| `/admin-demo`        | Restringido | `ProtectedRoute` + `AuthContext`  |
| `/vault`             | Plan Premium| Validación en backend (controller)|
| Resto de rutas       | Público     | Sin restricción                   |

---

## Estados del pedido

El ciclo de vida de un pedido sigue una máquina de estados lineal con una única transición no lineal (cancelación):

```
pickup_scheduled
    → documents_collected
        → digitizing
            → quality_review
                → preparing_delivery
                    → delivered
                        → available_in_vault  (solo Premium)

pickup_scheduled → cancelled  (única cancelación posible)
```
