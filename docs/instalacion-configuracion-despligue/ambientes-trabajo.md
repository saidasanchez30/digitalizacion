# Ambientes de trabajo

Este documento describe las diferencias de configuración entre los entornos de desarrollo, staging y producción.

---

## Resumen de entornos

| Aspecto              | Desarrollo (local)              | Staging                          | Producción                        |
|----------------------|---------------------------------|----------------------------------|-----------------------------------|
| Base de datos        | PostgreSQL local                | Supabase (proyecto de pruebas)   | Supabase (proyecto de producción) |
| URL del backend      | `http://localhost:8001`         | `https://api-staging.dominio.com`| `https://api.dominio.com`         |
| URL del frontend     | `http://localhost:5173`         | `https://staging.dominio.com`    | `https://dominio.com`             |
| CORS                 | `http://localhost:5173`         | URL de staging                   | URL de producción (HTTPS)         |
| Datos                | Seeders de demo                 | Datos de prueba reales           | Datos reales de clientes          |
| Recarga automática   | `--reload` activado             | No                               | No                                |
| Workers Uvicorn      | 1 (por defecto)                 | 2–4                              | 4+ (según carga)                  |
| SSL/TLS              | No                              | Recomendado                      | Obligatorio                       |

---

## Entorno de desarrollo

### Propósito

Desarrollo activo de funcionalidades con recarga automática de cambios y datos de demo.

### Configuración `backend/.env`

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/digitalizacion_db
```

### Arranque

```bash
# Terminal 1
cd backend && source venv/bin/activate
uvicorn app.main:app --reload --port 8001

# Terminal 2
cd frontend && npm run dev
```

### Particularidades

- Las tablas se recrean automáticamente si se eliminan.
- Los seeders se pueden ejecutar repetidamente.
- El frontend se sirve desde el servidor de Vite con HMR (Hot Module Replacement).
- No se requiere HTTPS.

---

## Entorno de staging

### Propósito

Verificación de funcionalidades antes de pasar a producción. Usa datos de prueba y configuración similar a producción.

### Configuración `backend/.env`

```env
DATABASE_URL=postgresql://postgres:PASSWORD@db.STAGING_REF.supabase.co:5432/postgres
```

### Arranque del backend

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8001 --workers 2
```

### Frontend

Compilar y servir el build estático:

```bash
cd frontend
npm run build
# Servir dist/ con un servidor estático (nginx, serve, etc.)
```

### Particularidades

- CORS configurado con la URL de staging (no localhost).
- No ejecutar seeders si ya hay datos de prueba con registros reales.
- Verificar SSL si el entorno usa HTTPS.

---

## Entorno de producción

### Propósito

Sistema en funcionamiento real con clientes. Requiere configuración robusta de seguridad y rendimiento.

### Configuración `backend/.env`

```env
DATABASE_URL=postgresql://postgres:PASSWORD_SEGURA@db.PROD_REF.supabase.co:5432/postgres
```

### Arranque del backend (con Uvicorn)

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8001 --workers 4
```

Para producción de alta disponibilidad, considerar usar **Gunicorn** como gestor de procesos:

```bash
gunicorn app.main:app \
  -w 4 \
  -k uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8001
```

### Frontend

```bash
cd frontend
npm run build
# Servir dist/ desde nginx o un CDN
```

### Configuración de nginx (referencia)

```nginx
server {
    listen 80;
    server_name dominio.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name dominio.com;

    # Certificados SSL (Let's Encrypt u otro)
    ssl_certificate /etc/letsencrypt/live/dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dominio.com/privkey.pem;

    # Servir frontend (archivos estáticos)
    root /var/www/digitalizacion/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy al backend FastAPI
    location /api/ {
        proxy_pass http://127.0.0.1:8001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Checklist de producción

- [ ] `DATABASE_URL` apunta al proyecto de producción de Supabase.
- [ ] CORS configurado con el dominio real (HTTPS, sin localhost).
- [ ] El archivo `.env` tiene permisos restringidos (`chmod 600 .env`).
- [ ] SSL/TLS habilitado en el dominio.
- [ ] Logs del servidor monitorizados.
- [ ] Backups automáticos de la base de datos activados (Supabase los incluye).
- [ ] **No** se ejecutan seeders en producción (solo en la configuración inicial).

---

## Diferencias clave entre entornos

### Base de datos

| Entorno    | Host                                     | ¿Seeders? |
|------------|------------------------------------------|-----------|
| Desarrollo | `localhost:5432`                         | Sí        |
| Staging    | `db.<staging-ref>.supabase.co:5432`      | Solo inicial |
| Producción | `db.<prod-ref>.supabase.co:5432`         | No        |

### Seguridad

- **Desarrollo**: sin SSL, CORS abierto a localhost.
- **Staging**: SSL recomendado, CORS restringido a dominio de staging.
- **Producción**: SSL obligatorio, CORS solo al dominio de producción, contraseñas rotadas periódicamente.
