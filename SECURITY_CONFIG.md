# Seguridad y configuración de variables de entorno

Este documento describe las variables de entorno, credenciales y buenas prácticas de seguridad del proyecto.

---

## Variables de entorno

### Backend (`backend/.env`)

| Variable       | Requerida | Descripción                                        | Ejemplo                                                     |
|----------------|-----------|----------------------------------------------------|-------------------------------------------------------------|
| `DATABASE_URL` | Sí        | Cadena de conexión completa a PostgreSQL           | `postgresql://usuario:contraseña@host:5432/nombre_bd`       |

#### Formato de DATABASE_URL

```
postgresql://<usuario>:<contraseña>@<host>:<puerto>/<nombre_base_de_datos>
```

**Entorno local:**
```
DATABASE_URL=postgresql://postgres:mi_password@localhost:5432/digitalizacion_db
```

**Supabase (producción):**
```
DATABASE_URL=postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres
```

---

## Creación del archivo .env

El repositorio **no incluye** el archivo `.env` (está en `.gitignore`). Se debe crear manualmente:

```bash
cd backend
cp .env.example .env
# Editar .env con las credenciales reales
```

Si el archivo `.env.example` no existe, crear `backend/.env` con el contenido mínimo:

```env
DATABASE_URL=postgresql://postgres:contraseña@localhost:5432/digitalizacion_db
```

---

## Reglas de seguridad obligatorias

### Control de versiones

- **Nunca** agregar `.env` al repositorio Git.
- **Nunca** hardcodear contraseñas, tokens o URLs de base de datos en el código fuente.
- Verificar que `.gitignore` incluya los siguientes patrones:

```
.env
.env.*
!.env.example
```

### Credenciales de base de datos

- Usar contraseñas de al menos 16 caracteres con combinación de mayúsculas, minúsculas, números y símbolos.
- En producción (Supabase), usar contraseñas generadas automáticamente por la plataforma.
- Rotar las credenciales ante cualquier sospecha de exposición.

### CORS

El backend está configurado para aceptar solicitudes únicamente desde el origen del frontend. Editar en `backend/app/main.py` antes de desplegar a producción:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://tu-dominio-de-produccion.com"],  # reemplazar localhost
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Autenticación del panel de administración

El panel de administración (`/admin/login`) usa autenticación gestionada desde el frontend mediante `AuthContext`. Para producción se recomienda:

- Reemplazar la autenticación simulada por un flujo real con JWT o sesiones del servidor.
- Agregar rate limiting al endpoint de login.
- Implementar HTTPS obligatorio.

---

## Acceso a Supabase

El proyecto puede usar Supabase como proveedor de PostgreSQL en la nube.

**Pasos para obtener la DATABASE_URL en Supabase:**

1. Iniciar sesión en [https://supabase.com](https://supabase.com).
2. Seleccionar el proyecto.
3. Ir a **Settings → Database → Connection string → URI**.
4. Copiar la URI y reemplazar `[YOUR-PASSWORD]` con la contraseña real.

**Importante**: Supabase expone el puerto 5432 (directo) y 6543 (pooler). Para SQLAlchemy sin pooling usar el puerto 5432.

---

## Entornos y niveles de acceso

| Entorno     | Base de datos             | CORS                    | Notas                              |
|-------------|---------------------------|-------------------------|------------------------------------|
| Desarrollo  | PostgreSQL local          | `http://localhost:5173` | Credenciales de desarrollo         |
| Staging     | Supabase (proyecto test)  | URL de staging          | Datos de prueba, no reales         |
| Producción  | Supabase (proyecto prod)  | Dominio real HTTPS      | Credenciales con rotación periódica|

---

## Checklist de seguridad antes de desplegar

- [ ] El archivo `.env` no está en el repositorio.
- [ ] `DATABASE_URL` apunta a la base de datos de producción correcta.
- [ ] CORS configurado con el dominio de producción (sin `localhost`).
- [ ] La conexión a la base de datos usa SSL (Supabase lo activa por defecto).
- [ ] El panel de administración tiene autenticación robusta.
- [ ] No hay logs que impriman credenciales o datos sensibles.
- [ ] `requirements.txt` y `package.json` no incluyen paquetes con vulnerabilidades conocidas.
