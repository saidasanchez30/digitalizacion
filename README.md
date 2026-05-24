# Digitalización Documental

Plataforma web full-stack para la cotización, contratación, seguimiento y gestión de servicios de digitalización documental empresarial. Incluye bóveda digital con gestión de metadatos avanzada para clientes del plan Premium.

---

## Descripción general

El sistema permite a las empresas:

1. **Cotizar** servicios de digitalización según volumen de páginas y plan elegido.
2. **Contratar** mediante un flujo de compra con simulación de pago (4 métodos).
3. **Hacer seguimiento** del estado del pedido a lo largo de 8 etapas del proceso.
4. **Acceder a su bóveda digital** (plan Premium) con documentos indexados, metadatos enriquecidos y estado OCR.

El proyecto incluye datos de prueba precargados mediante seeders para funcionar como demo operativo.

---

## Planes de servicio

| Plan      | Precio base         | Plazo estimado | Bóveda digital |
|-----------|---------------------|----------------|----------------|
| Estándar  | $15 / 1.000 páginas | 10 días hábiles | No            |
| Premium   | $25 / 1.000 páginas | 7 días hábiles  | Sí            |

### Servicios adicionales

| Extra                    | Costo                              |
|--------------------------|------------------------------------|
| Digitalización urgente   | +30 % del subtotal (reduce días)   |
| OCR simulado             | $50 fijo                           |
| Entrega física           | $30 fijo                           |

### Fórmula de cotización

```
subtotal = (páginas / 1.000) × precio_plan
total    = subtotal + Σ extras
```

---

## Arquitectura general

```
Usuario
  └── Frontend (React 19 + Vite)
        └── API REST (FastAPI)
              └── ORM (SQLAlchemy)
                    └── PostgreSQL (local o Supabase)
```

Patrón de capas en el backend: **Modelos → Esquemas → Servicios → Controladores**.

---

## Dependencias principales

### Backend

| Paquete           | Versión  | Propósito                       |
|-------------------|----------|---------------------------------|
| fastapi           | 0.136.1  | Framework web ASGI              |
| uvicorn           | 0.47.0   | Servidor ASGI                   |
| sqlalchemy        | 2.0.49   | ORM                             |
| pydantic          | 2.13.4   | Validación de esquemas          |
| psycopg2-binary   | 2.9.12   | Driver PostgreSQL               |
| python-dotenv     | 1.2.2    | Variables de entorno            |

### Frontend

| Paquete           | Versión  | Propósito                       |
|-------------------|----------|---------------------------------|
| react             | 19.2.6   | Librería UI                     |
| react-router-dom  | 7.15.1   | Enrutamiento SPA                |
| axios             | 1.16.1   | Cliente HTTP                    |
| vite              | 8.0.12   | Bundler / servidor de desarrollo|

---

## Requisitos previos

- Python 3.11 o superior
- Node.js 20 o superior
- PostgreSQL 14 o superior (local) **o** cuenta en [Supabase](https://supabase.com)
- `pip` y `npm` disponibles en el PATH del sistema

---

## Instalación rápida

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd digitalizacion

# 2. Configurar backend
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env              # Editar DATABASE_URL con los datos reales

# 3. Poblar la base de datos con datos de demo
python seed.py

# 4. Iniciar el backend
uvicorn app.main:app --reload --port 8001

# 5. En otra terminal — configurar e iniciar el frontend
cd ../frontend
npm install
npm run dev
```

Abrir [http://localhost:5173](http://localhost:5173) en el navegador.

> Para instrucciones detalladas de despliegue ver
> [docs/instalacion-configuracion-despligue/instrucciones-configuracion.md](docs/instalacion-configuracion-despligue/instrucciones-configuracion.md)
> y el [Manual de instalación multientorno](docs/manual-instalacion-multientorno/index.md).

---

## URLs del sistema

| Servicio              | URL                                        |
|-----------------------|--------------------------------------------|
| Frontend (desarrollo) | http://localhost:5173                      |
| API REST              | http://localhost:8001                      |
| Swagger UI            | http://localhost:8001/docs                 |
| ReDoc                 | http://localhost:8001/redoc                |
| Panel de administración | http://localhost:5173/admin/login        |

---

## Ejecución en desarrollo

```bash
# Terminal 1 — Backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8001

# Terminal 2 — Frontend
cd frontend
npm run dev
```

## Build de producción

```bash
cd frontend
npm run build      # Genera la carpeta dist/
npm run preview    # Sirve el build localmente para verificar
```

---

## Mantenimiento

### Actualizar dependencias del backend

```bash
cd backend && source venv/bin/activate
pip install --upgrade -r requirements.txt
```

### Actualizar dependencias del frontend

```bash
cd frontend && npm update
```

### Re-ejecutar seeders

```bash
cd backend && source venv/bin/activate
python seed.py
```

Los seeders verifican si los registros ya existen antes de insertar, por lo que es seguro ejecutarlos repetidamente.

---

## Documentación adicional

| Documento | Descripción |
|-----------|-------------|
| [Arquitectura del sistema](docs/informacion-tecnica/arquitectura-sistema.md) | Diagrama y descripción de capas |
| [Tecnologías utilizadas](docs/informacion-tecnica/tecnologias-utilizadas.md) | Stack tecnológico detallado |
| [Estructura del proyecto](docs/informacion-tecnica/estructura-proyecto.md) | Árbol de directorios comentado |
| [Dependencias clave](docs/informacion-tecnica/dependencias-clave.md) | Justificación de cada dependencia |
| [Comandos útiles](docs/informacion-tecnica/comandos-utiles.md) | Referencia de comandos frecuentes |
| [API — Endpoints y ejemplos](docs/api-solicitudes/index.md) | Documentación completa de la API |
| [Diccionario de datos](docs/documentacion-adicional/diccionario-datos.md) | Tablas, columnas y tipos |
| [Instrucciones de configuración](docs/instalacion-configuracion-despligue/instrucciones-configuracion.md) | Variables de entorno y ajustes |
| [Ambientes de trabajo](docs/instalacion-configuracion-despligue/ambientes-trabajo.md) | Diferencias entre dev / staging / prod |
| [Manual de instalación multientorno](docs/manual-instalacion-multientorno/index.md) | Despliegue completo paso a paso |
| [Guía de contribución](CONTRIBUTING.md) | Flujo de trabajo y estándares de código |
| [Seguridad y configuración](SECURITY_CONFIG.md) | Variables sensibles y buenas prácticas |
