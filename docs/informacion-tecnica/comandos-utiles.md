# Comandos útiles

Referencia rápida de los comandos más frecuentes durante el desarrollo y mantenimiento del proyecto.

---

## Backend

### Activar entorno virtual

```bash
# Linux / macOS
source backend/venv/bin/activate

# Windows (PowerShell)
backend\venv\Scripts\Activate.ps1

# Windows (CMD)
backend\venv\Scripts\activate.bat
```

### Instalar dependencias

```bash
cd backend
pip install -r requirements.txt
```

### Iniciar el servidor de desarrollo

```bash
cd backend
uvicorn app.main:app --reload --port 8001
```

El flag `--reload` reinicia el servidor automáticamente al detectar cambios en archivos Python.

### Iniciar en producción (sin recarga automática)

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8001 --workers 4
```

### Poblar la base de datos

```bash
cd backend
python seed.py
```

### Actualizar requirements.txt después de instalar paquetes

```bash
pip freeze > requirements.txt
```

### Verificar que el servidor responde

```bash
curl http://localhost:8001/
# Respuesta esperada: {"message": "API de Digitalización Documental funcionando correctamente"}
```

---

## Frontend

### Instalar dependencias

```bash
cd frontend
npm install
```

### Iniciar el servidor de desarrollo

```bash
cd frontend
npm run dev
# Disponible en http://localhost:5173
```

### Verificar el código (lint)

```bash
cd frontend
npm run lint
```

### Compilar para producción

```bash
cd frontend
npm run build
# Genera la carpeta dist/
```

### Vista previa del build de producción

```bash
cd frontend
npm run preview
```

---

## Base de datos

### Conectarse a PostgreSQL local

```bash
psql -U postgres -d digitalizacion_db
```

### Crear la base de datos (primera vez, local)

```bash
psql -U postgres -c "CREATE DATABASE digitalizacion_db;"
```

### Ver las tablas existentes (desde psql)

```sql
\dt
```

### Listar registros de una tabla

```sql
SELECT * FROM services;
SELECT * FROM extras;
SELECT * FROM orders;
```

### Eliminar y recrear todas las tablas (reset completo)

```sql
-- Ejecutar en psql con precaución: borra todos los datos
DROP TABLE IF EXISTS vault_documents, orders, quotation_extras, quotations, extras, services CASCADE;
```

Luego reiniciar el backend para que `create_all()` recree las tablas, y ejecutar `python seed.py`.

---

## Git

### Flujo estándar para una nueva funcionalidad

```bash
git checkout develop
git pull origin develop
git checkout -b feature/nombre-de-la-funcionalidad

# ... hacer cambios ...

git add archivo1.py archivo2.jsx
git commit -m "feat(modulo): descripción del cambio"
git push origin feature/nombre-de-la-funcionalidad
```

### Ver historial de commits recientes

```bash
git log --oneline -20
```

### Ver cambios no confirmados

```bash
git diff
git status
```

---

## Combinado — Arranque completo del entorno de desarrollo

```bash
# Terminal 1 — Backend
cd /var/www/python/fastAPI/digitalizacion/backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8001

# Terminal 2 — Frontend
cd /var/www/python/fastAPI/digitalizacion/frontend
npm run dev
```

---

## Acceso rápido a las interfaces

| Interfaz              | URL                             |
|-----------------------|---------------------------------|
| Aplicación web        | http://localhost:5173           |
| Swagger UI (API docs) | http://localhost:8001/docs      |
| ReDoc (API docs)      | http://localhost:8001/redoc     |
| Panel de administración | http://localhost:5173/admin/login |
