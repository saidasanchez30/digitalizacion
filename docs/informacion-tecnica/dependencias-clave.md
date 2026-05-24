# Dependencias clave

Este documento explica por qué se eligió cada dependencia principal y cuándo actualizarla.

---

## Backend — `backend/requirements.txt`

### fastapi `0.136.1`

**Por qué**: Framework moderno con validación automática de tipos vía Pydantic, generación de docs Swagger/ReDoc integrada y rendimiento comparable a Node.js. Permite definir endpoints y esquemas en un solo lugar.

**Cuándo actualizar**: Al necesitar soporte para nuevas características de Pydantic v2, o correcciones de seguridad. Revisar changelog antes de actualizar por posibles cambios en la API pública.

---

### uvicorn `0.47.0`

**Por qué**: Único servidor ASGI oficialmente recomendado por FastAPI. Soporte de WebSockets y HTTP/2, bajo consumo de memoria.

**Cuándo actualizar**: Junto con FastAPI para mantener compatibilidad. En producción considerar `uvicorn[standard]` para incluir `uvloop` y `httptools` (mayor rendimiento).

---

### sqlalchemy `2.0.49`

**Por qué**: ORM maduro y ampliamente adoptado. La versión 2.x introduce una API más clara y consistente con el estilo `select()` en lugar del legacy `query()`. Permite abstraer las diferencias entre motores de BD.

**Cuándo actualizar**: Parches de seguridad o soporte para nuevas versiones de PostgreSQL. Los cambios breaking entre 2.x minor son raros.

---

### pydantic `2.13.4`

**Por qué**: FastAPI lo usa internamente para la validación. La versión 2.x es significativamente más rápida que la 1.x gracias a su núcleo escrito en Rust (`pydantic-core`). Define la forma de todos los datos de entrada y salida de la API.

**Cuándo actualizar**: Al actualizar FastAPI (suelen sincronizarse). Verificar que los esquemas sigan siendo compatibles.

---

### psycopg2-binary `2.9.12`

**Por qué**: Driver nativo y estable para PostgreSQL en Python. La variante `-binary` elimina la necesidad de compilar extensiones C o tener `libpq-dev` instalado.

**Nota**: En producción con dependencias del sistema ya disponibles, considerar `psycopg2` (sin binary) para mejor rendimiento. La variante binary tiene limitaciones en algunos sistemas Alpine Linux.

**Cuándo actualizar**: Ante vulnerabilidades conocidas o cuando PostgreSQL actualice su protocolo.

---

### python-dotenv `1.2.2`

**Por qué**: Estándar de facto para cargar archivos `.env` en Python. Permite separar la configuración del código y funciona en todos los entornos sin modificaciones al código.

**Cuándo actualizar**: Rara vez necesita actualización; es una dependencia muy estable.

---

## Frontend — `frontend/package.json`

### react `19.2.6`

**Por qué**: Versión más reciente con mejoras de rendimiento (compilador React, concurrent features). Ecosistema más grande del frontend.

**Cuándo actualizar**: Verificar compatibilidad de `react-router-dom` antes de actualizar a cualquier versión mayor.

---

### react-router-dom `7.15.1`

**Por qué**: Solución estándar de enrutamiento para SPAs en React. La versión 7.x introduce mejoras en el manejo de loaders y acciones, aunque el proyecto usa el modo tradicional de componentes.

**Cuándo actualizar**: Revisar si hay cambios en la API de `useNavigate`, `useParams` o `useSearchParams` antes de actualizar.

---

### axios `1.16.1`

**Por qué**: Más ergonómico que el `fetch` nativo para este tipo de proyecto: interceptores de request/response, transformación automática de JSON, manejo consistente de errores. El proyecto usa interceptores para normalizar la estructura de respuesta.

**Cuándo actualizar**: Solo ante vulnerabilidades de seguridad reportadas. La API es muy estable.

---

### vite `8.0.12`

**Por qué**: Servidor de desarrollo con recarga instantánea (HMR nativo), build optimizado con Rollup y soporte completo para React (via `@vitejs/plugin-react`). Significativamente más rápido que webpack para proyectos de este tamaño.

**Cuándo actualizar**: Actualizaciones menores son seguras. Las mayores pueden requerir ajustes en `vite.config.js`.

---

## Dependencias que NO están en el proyecto (y por qué)

| Dependencia  | Por qué no se usa                                                            |
|--------------|------------------------------------------------------------------------------|
| Alembic      | Las migraciones de esquema se gestionan con `create_all()`. No hay migraciones incrementales. |
| Redux / Zustand | El estado global es mínimo (solo autenticación). `AuthContext` es suficiente. |
| Tailwind CSS | El proyecto usa un sistema de diseño propio con variables CSS personalizadas.   |
| JWT / OAuth  | La autenticación del admin es simulada (demo). No requiere tokens reales.       |
| pytest       | No hay suite de pruebas automatizadas en el estado actual del proyecto.        |
