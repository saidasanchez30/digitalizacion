# Manual de instalación multientorno

Guía paso a paso para instalar y desplegar el sistema de Digitalización Documental en los diferentes entornos (desarrollo local, staging y producción).

---

## Tabla de contenidos

1. [Requisitos del sistema](#1-requisitos-del-sistema)
2. [Clonar el repositorio](#2-clonar-el-repositorio)
3. [Instalación en desarrollo local](#3-instalación-en-desarrollo-local)
4. [Configuración de la base de datos](#4-configuración-de-la-base-de-datos)
5. [Poblar datos iniciales](#5-poblar-datos-iniciales)
6. [Verificación del sistema](#6-verificación-del-sistema)
7. [Despliegue en staging/producción](#7-despliegue-en-stagingproducción)
8. [Resolución de problemas frecuentes](#8-resolución-de-problemas-frecuentes)

---

## 1. Requisitos del sistema

### Software requerido

| Herramienta   | Versión mínima | Cómo verificar              |
|---------------|----------------|-----------------------------|
| Python        | 3.11           | `python --version`          |
| pip           | 23+            | `pip --version`             |
| Node.js       | 20.0           | `node --version`            |
| npm           | 10+            | `npm --version`             |
| PostgreSQL    | 14.0           | `psql --version`            |
| Git           | 2.x            | `git --version`             |

> PostgreSQL puede reemplazarse por una instancia en Supabase (sin instalación local).

### Puertos utilizados

| Servicio    | Puerto | Configurable |
|-------------|--------|--------------|
| Backend     | 8001   | Sí           |
| Frontend dev| 5173   | Sí (Vite)    |
| PostgreSQL  | 5432   | Sí           |

---

## 2. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd digitalizacion
```

Verificar que la rama principal esté en `main`:

```bash
git branch
# * main
```

---

## 3. Instalación en desarrollo local

### 3.1 Backend

#### Crear el entorno virtual Python

```bash
cd backend
python -m venv venv
```

#### Activar el entorno virtual

```bash
# Linux / macOS
source venv/bin/activate

# Windows (PowerShell)
.\venv\Scripts\Activate.ps1

# Windows (CMD)
.\venv\Scripts\activate.bat
```

El prompt del terminal mostrará `(venv)` cuando esté activo.

#### Instalar dependencias

```bash
pip install -r requirements.txt
```

#### Crear y configurar `.env`

```bash
# Copiar el ejemplo (si existe)
cp .env.example .env

# o crear desde cero
```

Editar `backend/.env` con el editor de preferencia:

```env
DATABASE_URL=postgresql://postgres:TU_PASSWORD@localhost:5432/digitalizacion_db
```

### 3.2 Frontend

```bash
cd ../frontend
npm install
```

---

## 4. Configuración de la base de datos

### Opción A — PostgreSQL local

#### Instalar PostgreSQL

- **Ubuntu/Debian**: `sudo apt install postgresql postgresql-contrib`
- **macOS**: `brew install postgresql@14`
- **Windows**: descargar instalador de [postgresql.org](https://www.postgresql.org/download/windows/)

#### Crear la base de datos

```bash
# Conectarse como superusuario postgres
psql -U postgres

# Dentro de psql:
CREATE DATABASE digitalizacion_db;
\q
```

#### Verificar la conexión

```bash
psql -U postgres -d digitalizacion_db -c "\dt"
# Al inicio no habrá tablas; aparecerán después de iniciar el backend
```

### Opción B — Supabase

1. Crear una cuenta en [supabase.com](https://supabase.com).
2. Crear un nuevo proyecto y establecer una contraseña segura.
3. Esperar a que se aprovisione la base de datos (≈ 2 minutos).
4. Ir a **Settings → Database → Connection string → URI**.
5. Copiar la URI y pegarla en `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:PASSWORD@db.REFERENCIA.supabase.co:5432/postgres
```

---

## 5. Poblar datos iniciales

Los seeders insertan los planes de servicio y extras necesarios para que el sistema funcione:

```bash
cd backend
source venv/bin/activate   # Si no está activo
python seed.py
```

**Salida esperada:**

```
Creando tablas...
Tablas creadas exitosamente.
Insertando servicios...
Servicios insertados: Estándar, Premium
Insertando extras...
Extras insertados: Digitalización urgente, OCR simulado, Entrega física
Proceso completado.
```

Si los datos ya existen, el seeder los omite y continúa sin errores.

---

## 6. Verificación del sistema

### 6.1 Iniciar el backend

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8001
```

**Salida esperada:**

```
INFO:     Will watch for changes in these directories: ['/ruta/backend']
INFO:     Uvicorn running on http://127.0.0.1:8001 (Press CTRL+C to quit)
INFO:     Started reloader process [PID] using WatchFiles
INFO:     Started server process [PID]
INFO:     Application startup complete.
```

Verificar en el navegador o con curl:

```bash
curl http://localhost:8001/
# {"message":"API de Digitalización Documental funcionando correctamente"}

curl http://localhost:8001/services/
# Lista de planes de servicio en JSON
```

### 6.2 Iniciar el frontend

```bash
cd frontend
npm run dev
```

**Salida esperada:**

```
  VITE v8.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Abrir [http://localhost:5173](http://localhost:5173) en el navegador. Debe cargar la página principal del sistema.

### 6.3 Verificar la API documentada

Abrir [http://localhost:8001/docs](http://localhost:8001/docs) para acceder a Swagger UI y probar los endpoints manualmente.

---

## 7. Despliegue en staging/producción

### 7.1 Build del frontend

```bash
cd frontend
npm run build
```

Genera la carpeta `frontend/dist/` con los archivos estáticos optimizados.

### 7.2 Servir el backend con múltiples workers

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8001 --workers 4
```

### 7.3 Configurar nginx

Ver la configuración de referencia en [ambientes-trabajo.md](../instalacion-configuracion-despligue/ambientes-trabajo.md#configuración-de-nginx-referencia).

### 7.4 Variables de entorno en producción

Actualizar `backend/.env` con las credenciales de producción:

```env
DATABASE_URL=postgresql://postgres:PASSWORD_PRODUCCION@db.PROD_REF.supabase.co:5432/postgres
```

Actualizar CORS en `backend/app/main.py`:

```python
allow_origins=["https://tu-dominio.com"]
```

### 7.5 Reiniciar el servicio

Si se usa un gestor de procesos (systemd, supervisor):

```bash
# Ejemplo con systemd
sudo systemctl restart digitalizacion-backend
```

---

## 8. Resolución de problemas frecuentes

### Error: `No se encontró DATABASE_URL en el archivo .env`

```
ValueError: No se encontró DATABASE_URL en el archivo .env
```

**Solución**: El archivo `backend/.env` no existe o no contiene `DATABASE_URL`.

```bash
cat backend/.env   # Verificar que existe y tiene el valor
```

---

### Error de conexión a PostgreSQL

```
sqlalchemy.exc.OperationalError: could not connect to server: Connection refused
```

**Posibles causas:**
- PostgreSQL no está corriendo: `sudo systemctl start postgresql`
- La contraseña en `DATABASE_URL` es incorrecta.
- El nombre de la base de datos no existe: crear con `CREATE DATABASE digitalizacion_db;`

---

### Error de CORS en el navegador

```
Access to XMLHttpRequest at 'http://localhost:8001/...' from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solución**: Verificar que el backend está corriendo en el puerto 8001 y que CORS permite `http://localhost:5173`.

---

### `npm install` falla con errores de permisos

```bash
# Solución en Linux/macOS
sudo chown -R $(whoami) ~/.npm
npm install
```

---

### El seeder no inserta datos

Si `python seed.py` no muestra errores pero la BD está vacía:

```bash
psql -U postgres -d digitalizacion_db -c "SELECT * FROM services;"
```

Si hay registros, el seeder los detectó y los omitió. Si la tabla no existe, el backend no ha iniciado aún (la crea al arrancar).

---

### Puerto 8001 ya en uso

```
ERROR:    [Errno 98] Address already in use
```

```bash
# Encontrar el proceso que usa el puerto
lsof -i :8001

# Terminar el proceso
kill -9 <PID>
```
