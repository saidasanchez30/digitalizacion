# Tecnologías utilizadas

---

## Backend

### Python 3.11+

Lenguaje principal del backend. Se requiere la versión 3.11 o superior para compatibilidad con FastAPI y las últimas versiones de Pydantic.

### FastAPI 0.136.1

Framework web moderno y de alto rendimiento para construir APIs REST en Python. Genera automáticamente la documentación interactiva Swagger UI en `/docs` y ReDoc en `/redoc`. Soporta validación de tipos nativa mediante Pydantic.

### Uvicorn 0.47.0

Servidor ASGI (Asynchronous Server Gateway Interface) que ejecuta la aplicación FastAPI. En desarrollo se usa con el flag `--reload` para recarga automática al detectar cambios en los archivos.

### SQLAlchemy 2.0.49

ORM (Object-Relational Mapper) para Python. Define los modelos de base de datos como clases Python y genera el SQL correspondiente. Se usa el estilo declarativo moderno (`declarative_base`).

### Pydantic 2.13.4

Librería de validación de datos basada en anotaciones de tipo Python. Se usa para definir los esquemas de entrada (request body) y salida (response) de la API. Garantiza que los datos sean válidos antes de procesar cualquier solicitud.

### psycopg2-binary 2.9.12

Driver nativo de Python para conectarse a bases de datos PostgreSQL. La versión `binary` incluye las dependencias compiladas, simplificando la instalación sin necesidad de bibliotecas del sistema.

### python-dotenv 1.2.2

Permite cargar variables de entorno desde el archivo `.env` en el directorio de trabajo. Facilita la gestión de configuraciones sensibles (credenciales de BD) sin hardcodearlas en el código.

---

## Frontend

### React 19.2.6

Librería JavaScript para construir interfaces de usuario mediante componentes funcionales y hooks. Se usa en modo estricto (`StrictMode`) para detectar efectos secundarios inesperados durante el desarrollo.

### Vite 8.0.12

Herramienta de build y servidor de desarrollo para proyectos frontend modernos. Ofrece recarga instantánea (HMR), compilación optimizada con Rollup para producción y soporte nativo para módulos ES.

### React Router DOM 7.15.1

Librería de enrutamiento para aplicaciones React de una sola página (SPA). Gestiona la navegación entre las diferentes vistas sin recargar la página. Soporta rutas protegidas y parámetros de URL.

### Axios 1.16.1

Cliente HTTP para el navegador. Simplifica las solicitudes a la API REST con interceptores, transformación automática de JSON y manejo centralizado de errores. El proyecto usa un interceptor de respuesta para normalizar la estructura `response.data`.

---

## Base de datos

### PostgreSQL 14+

Sistema de gestión de bases de datos relacional de código abierto. Almacena todos los datos del sistema: planes, cotizaciones, órdenes y documentos de la bóveda digital.

**Puede ejecutarse en dos modos:**

| Modo        | Descripción                                           |
|-------------|-------------------------------------------------------|
| Local       | Instancia de PostgreSQL instalada en la máquina       |
| Supabase    | PostgreSQL gestionado en la nube (recomendado en prod)|

### Supabase

Plataforma BaaS (Backend as a Service) que provee PostgreSQL gestionado con panel de administración, backups automáticos y soporte SSL. Se usa como base de datos en entornos de producción/staging.

---

## Herramientas de desarrollo

### ESLint 10.3.0

Linter de JavaScript/JSX para el frontend. Detecta errores de sintaxis, problemas de estilo y malas prácticas. Configurado con las reglas para React Hooks (`eslint-plugin-react-hooks`) y React Refresh.

### DBeaver (opcional)

Cliente GUI para administración visual de la base de datos PostgreSQL. Útil para inspeccionar tablas, ejecutar consultas manuales y verificar el resultado de los seeders.

---

## Resumen del stack

```
┌─────────────────────────────────────────┐
│  Frontend                               │
│  React 19 + Vite 8 + React Router 7    │
│  Axios 1.16                             │
├─────────────────────────────────────────┤
│  Backend                                │
│  FastAPI 0.136 + Uvicorn 0.47          │
│  SQLAlchemy 2 + Pydantic 2             │
│  psycopg2-binary + python-dotenv       │
├─────────────────────────────────────────┤
│  Base de datos                          │
│  PostgreSQL 14+ (local o Supabase)     │
└─────────────────────────────────────────┘
```
