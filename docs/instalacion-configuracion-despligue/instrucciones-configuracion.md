# Instrucciones de configuración

Este documento describe todas las variables de entorno y ajustes necesarios para configurar el sistema en cada entorno.

---

## Backend — Variables de entorno

El backend lee su configuración desde el archivo `backend/.env`. Este archivo **no se incluye en el repositorio**; debe crearse manualmente.

### Crear el archivo `.env`

```bash
cd backend
cp .env.example .env    # Si existe el ejemplo
# o crear manualmente:
touch .env
```

### Variables disponibles

| Variable       | Requerida | Valor por defecto | Descripción                              |
|----------------|-----------|-------------------|------------------------------------------|
| `DATABASE_URL` | Sí        | —                 | Cadena de conexión completa a PostgreSQL |

### Formato de `DATABASE_URL`

```
postgresql://<usuario>:<contraseña>@<host>:<puerto>/<nombre_bd>
```

#### Ejemplos por entorno

**Desarrollo local:**
```env
DATABASE_URL=postgresql://postgres:mi_password@localhost:5432/digitalizacion_db
```

**Supabase (staging o producción):**
```env
DATABASE_URL=postgresql://postgres:PASSWORD@db.PROYECTO_REF.supabase.co:5432/postgres
```

> Obtener la URL desde Supabase: **Dashboard → Settings → Database → Connection string → URI**

---

## Configuración de CORS

El CORS se configura en `backend/app/main.py`. Debe actualizarse para cada entorno:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # ← cambiar en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

| Entorno     | Valor de `allow_origins`                          |
|-------------|---------------------------------------------------|
| Desarrollo  | `["http://localhost:5173"]`                       |
| Producción  | `["https://tu-dominio.com"]`                      |

---

## Configuración del frontend

El frontend no tiene variables de entorno en archivos `.env` actualmente. La URL base de la API está definida directamente en `frontend/src/api/api.js`:

```javascript
const BASE_URL = 'http://localhost:8001';
```

Para cambiar el servidor de API en producción, actualizar este valor o configurar un proxy en Vite (`vite.config.js`).

### Configuración de proxy en Vite (alternativa)

Para evitar problemas de CORS en desarrollo, se puede agregar un proxy en `vite.config.js`:

```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

---

## Configuración del puerto del backend

Por defecto el backend corre en el puerto `8001`. Para cambiar el puerto:

```bash
uvicorn app.main:app --reload --port <NUEVO_PUERTO>
```

Si se cambia el puerto, actualizar también la URL base en `frontend/src/api/api.js`.

---

## Configuración de la base de datos

### Creación automática de tablas

SQLAlchemy crea las tablas automáticamente al iniciar el backend mediante:

```python
Base.metadata.create_all(bind=engine)  # en app/main.py
```

No es necesario ejecutar scripts SQL manuales para crear el esquema.

### Precaución

`create_all()` **no modifica** tablas existentes. Si se cambia un modelo SQLAlchemy, hay que eliminar las tablas manualmente y reiniciar para que se recreen con el nuevo esquema.

---

## Seeders — Datos iniciales

Los seeders insertan los datos mínimos necesarios para que el sistema funcione como demo:

```bash
cd backend
source venv/bin/activate
python seed.py
```

**¿Qué inserta?**

| Seeder              | Registros                                         |
|---------------------|---------------------------------------------------|
| `services_seeder`   | Plan Estándar ($15/1000p) y Plan Premium ($25/1000p) |
| `extras_seeder`     | Digitalización urgente, OCR simulado, Entrega física |

Los seeders verifican si los registros ya existen antes de insertar (idempotentes).

---

## Checklist de configuración inicial

- [ ] Archivo `backend/.env` creado con `DATABASE_URL` válida.
- [ ] Base de datos PostgreSQL accesible desde el servidor.
- [ ] Entorno virtual Python creado e instalado (`pip install -r requirements.txt`).
- [ ] Backend inicia sin errores (`uvicorn app.main:app --port 8001`).
- [ ] Tablas creadas correctamente (verificar en DBeaver o psql: `\dt`).
- [ ] Seeders ejecutados (`python seed.py`).
- [ ] Frontend instalado (`npm install`).
- [ ] CORS configurado con el origen correcto del frontend.
