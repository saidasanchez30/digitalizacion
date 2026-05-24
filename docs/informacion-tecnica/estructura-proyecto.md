# Estructura del proyecto

```
digitalizacion/
│
├── README.md                        ← Punto de entrada y guía rápida
├── CONTRIBUTING.md                  ← Reglas de contribución
├── SECURITY_CONFIG.md               ← Variables de entorno y seguridad
├── .gitignore                       ← Exclusiones de Git
│
├── backend/                         ← Aplicación FastAPI
│   ├── requirements.txt             ← Dependencias Python (producción)
│   ├── requirements-test.txt        ← Dependencias exclusivas de tests
│   ├── pytest.ini                   ← Configuración de pytest
│   ├── run_tests.py                 ← Ejecuta tests y exporta resultados a CSV
│   ├── .env                         ← Variables de entorno (NO en Git)
│   ├── seed.py                      ← Script principal de seeders
│   │
│   ├── tests/                       ← Suite de pruebas automatizadas
│   │   ├── conftest.py              ← Fixtures: BD SQLite en memoria + cliente HTTP
│   │   ├── test_health.py           ← Tests del endpoint raíz
│   │   ├── test_services.py         ← Tests de GET /services/
│   │   ├── test_extras.py           ← Tests de GET /extras/
│   │   ├── test_quotations.py       ← Tests de POST/GET /quotations/
│   │   ├── test_orders.py           ← Tests de órdenes, cancelación y estados
│   │   └── test_vault.py            ← Tests de bóveda digital (plan Premium)
│   │
│   ├── test-results/                ← Salida CSV generada por run_tests.py (NO en Git)
│   │   └── results.csv
│   │
│   └── app/
│       ├── main.py                  ← Punto de entrada ASGI, routers, CORS
│       ├── config.py                ← Carga de variables de entorno
│       ├── database.py              ← Engine, sesión y Base declarativa
│       │
│       ├── models/                  ← Modelos ORM (tablas de BD)
│       │   ├── __init__.py          ← Importa todos los modelos (necesario para create_all)
│       │   ├── service_model.py     ← Tabla services
│       │   ├── extra_model.py       ← Tabla extras
│       │   ├── quotation_model.py   ← Tablas quotations + quotation_extras
│       │   ├── order_model.py       ← Tabla orders
│       │   └── vault_document_model.py ← Tabla vault_documents
│       │
│       ├── schemas/                 ← Esquemas Pydantic (validación I/O)
│       │   ├── __init__.py
│       │   ├── service_schema.py
│       │   ├── extra_schema.py
│       │   ├── quotation_schema.py
│       │   ├── order_schema.py
│       │   └── vault_schema.py
│       │
│       ├── controllers/             ← Endpoints HTTP (routers FastAPI)
│       │   ├── __init__.py
│       │   ├── service_controller.py    ← GET /services/
│       │   ├── extra_controller.py      ← GET /extras/
│       │   ├── quotation_controller.py  ← POST/GET /quotations/
│       │   ├── order_controller.py      ← POST/GET/PUT /orders/
│       │   └── vault_controller.py      ← POST/GET /orders/{id}/vault/
│       │
│       ├── services/                ← Lógica de negocio
│       │   ├── __init__.py
│       │   ├── quotation_service.py ← Cálculo de precios y fechas
│       │   ├── order_service.py     ← Validaciones de estado y cancelación
│       │   └── vault_service.py     ← Validación de plan Premium y documentos
│       │
│       └── seeders/                 ← Datos iniciales para demo
│           ├── __init__.py
│           ├── services_seeder.py   ← Inserta planes Estándar y Premium
│           └── extras_seeder.py     ← Inserta los 3 servicios adicionales
│
├── frontend/                        ← Aplicación React + Vite
│   ├── package.json                 ← Dependencias y scripts npm
│   ├── vite.config.js               ← Configuración de Vite
│   ├── eslint.config.js             ← Reglas ESLint
│   ├── index.html                   ← HTML raíz (monta el bundle)
│   ├── .gitignore
│   │
│   ├── public/                      ← Archivos estáticos (no procesados)
│   │   ├── favicon.svg
│   │   └── icons.svg
│   │
│   └── src/
│       ├── main.jsx                 ← Punto de entrada React (monta App)
│       ├── App.jsx                  ← Árbol de rutas (React Router)
│       ├── index.css                ← Reset global
│       │
│       ├── api/
│       │   └── api.js               ← Instancia Axios con interceptores
│       │
│       ├── context/
│       │   └── AuthContext.jsx      ← Estado de autenticación del admin
│       │
│       ├── hooks/
│       │   └── useApi.js            ← Hook genérico para llamadas HTTP
│       │
│       ├── components/              ← Componentes reutilizables
│       │   ├── Navbar.jsx           ← Barra de navegación con glassmorphism
│       │   ├── ServiceCard.jsx      ← Tarjeta de plan de servicio
│       │   ├── DeliveryMethodSelector.jsx
│       │   ├── ExtraSelector.jsx
│       │   ├── ProtectedRoute.jsx   ← HOC que redirige si no autenticado
│       │   ├── StatusBadge.jsx      ← Etiqueta visual de estado
│       │   ├── StatusTimeline.jsx   ← Línea de tiempo animada del pedido
│       │   ├── Loading.jsx          ← Indicador de carga
│       │   └── ErrorMessage.jsx     ← Mensaje de error del sistema de diseño
│       │
│       ├── pages/                   ← Vistas completas (una por ruta)
│       │   ├── Home.jsx             ← Landing page / página principal
│       │   ├── Catalog.jsx          ← Catálogo de planes y FAQ
│       │   ├── Quotation.jsx        ← Formulario de cotización paso a paso
│       │   ├── Checkout.jsx         ← Simulación de pago y confirmación
│       │   ├── Tracking.jsx         ← Seguimiento de pedido con timeline
│       │   ├── Vault.jsx            ← Bóveda digital (solo Premium)
│       │   ├── AdminLogin.jsx       ← Formulario de inicio de sesión
│       │   └── AdminDemo.jsx        ← Panel de administración (protegido)
│       │
│       ├── styles/
│       │   └── global.css           ← Sistema de diseño: tokens CSS, componentes
│       │
│       ├── utils/
│       │   ├── formatters.js        ← Formato de moneda, fechas
│       │   ├── statusLabels.js      ← Mapeo de claves de estado a etiquetas
│       │   └── validation.js        ← Validaciones de formularios
│       │
│       └── assets/
│           ├── hero.png
│           └── react.svg
│
└── docs/                            ← Documentación técnica del proyecto
    ├── informacion-tecnica/
    ├── instalacion-configuracion-despligue/
    ├── manual-instalacion-multientorno/
    ├── api-solicitudes/
    ├── documentacion-adicional/
    └── control-calidad/             ← Estrategia de pruebas y guiones manuales
```

---

## Convenciones de nombres

| Tipo                  | Convención          | Ejemplo                      |
|-----------------------|---------------------|------------------------------|
| Archivos de modelo    | `<entidad>_model.py`| `order_model.py`             |
| Archivos de esquema   | `<entidad>_schema.py`| `order_schema.py`           |
| Archivos de servicio  | `<entidad>_service.py`| `order_service.py`         |
| Archivos de controlador| `<entidad>_controller.py`| `order_controller.py` |
| Componentes React     | `PascalCase.jsx`    | `StatusTimeline.jsx`         |
| Utilidades JS         | `camelCase.js`      | `formatters.js`              |
| Hooks React           | `use<Nombre>.js`    | `useApi.js`                  |

---

## Archivos de configuración clave

| Archivo                    | Propósito                                           |
|----------------------------|-----------------------------------------------------|
| `backend/.env`             | Variables de entorno (DATABASE_URL). No en Git.     |
| `backend/app/config.py`    | Carga y valida las variables de entorno.            |
| `backend/app/database.py`  | Configura el engine SQLAlchemy y `get_db()`.        |
| `backend/app/main.py`      | Registra routers, middleware CORS y auto-crea tablas.|
| `backend/pytest.ini`       | Configura pytest: directorio de tests y flags por defecto. |
| `backend/run_tests.py`     | Ejecuta la suite y exporta resultados a CSV.        |
| `backend/tests/conftest.py`| BD SQLite en memoria + fixtures reutilizables para tests. |
| `frontend/vite.config.js`  | Configuración del servidor de desarrollo y build.   |
| `frontend/eslint.config.js`| Reglas de linting para el frontend.                |
