# Proyecto: Plataforma Web de Digitalización y Gestión Documental

Aplicación web para la cotización, contratación, seguimiento y gestión de servicios de digitalización documental empresarial. Orientado a empresas que desean convertir sus documentos físicos a formato digital, con opción de administrarlos en una bóveda digital simulada.

---

## 🚀 Características Principales

### Planes de Servicio

| Plan | Descripción |
|------|-------------|
| **Estándar** | Digitalización de documentos físicos y entrega de archivos resultantes |
| **Premium** | Digitalización + Bóveda Digital con Gestión Documental |

### Servicios Extra

- ⚡ Digitalización urgente
- 🔍 OCR simulado
- 📦 Entrega física en unidad proporcionada por la empresa

---

## 🛠️ Tecnologías Utilizadas

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

- **ReactJS** con **Vite** para interfaces de usuario rápidas y componentes reutilizables

### Backend
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

- **FastAPI** (Python) para API REST de alto rendimiento

### Base de Datos
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

- **PostgreSQL** alojado en **Supabase** (base de datos remota)
- **SQLAlchemy** como ORM para gestión de modelos
- **DBeaver** como herramienta de administración visual

---

## 🏗️ Arquitectura del Sistema
Usuario
↓
Frontend (ReactJS + Vite)
↓
API REST (FastAPI)
↓
SQLAlchemy (ORM)
↓
PostgreSQL (Supabase)

text

- **Patrón MVC**: Modelos, Controladores, Servicios y Vistas
- **Cliente-Servidor**: Separación clara entre frontend y backend

---

## 📋 Flujo Principal

1. **Catálogo**: Cliente consulta planes, precios y extras disponibles
2. **Cotizador**: Ingresa datos de empresa, selecciona plan, cantidad de páginas, método de entrega, fecha de recolección y extras
3. **Cálculo Automático**: Backend calcula subtotal, extras, total y fecha estimada de entrega
4. **Compra**: Simulación de pago (tarjeta, transferencia, contra entrega u orden de compra)
5. **Orden de Servicio**: Se genera automáticamente tras confirmar pago
6. **Seguimiento**: Cliente monitorea estado del servicio en tiempo real
7. **Bóveda Digital** (Plan Premium): Acceso a documentos digitalizados con gestión documental

---

## 📊 Fórmula de Cotización
Subtotal = (cantidad de hojas / 1000) × precio del plan
Total = Subtotal + Extras

text

- **Digitalización urgente**: Aplica porcentaje adicional al subtotal y reduce tiempo de entrega
- **OCR / Entrega física**: Costos fijos adicionales

---

## 🔄 Estados del Servicio

| Estado | Descripción |
|--------|-------------|
| 📅 Recolección agendada | Servicio programado, pendiente de inicio |
| 📥 Documentos recolectados | Documentos físicos recibidos |
| 🖨️ En digitalización | Proceso de escaneo en curso |
| ✅ Revisión de calidad | Verificación de archivos digitalizados |
| 📦 Preparando entrega | Archivos listos para envío |
| 🚀 Entregado | Archivos enviados al cliente |
| 🏦 Disponible en bóveda | Documentos accesibles en bóveda digital (Premium) |
| ❌ Cancelado | Orden cancelada (solo en estado inicial) |

### Regla de Cancelación
- Solo permitida en estado **"Recolección agendada"**
- Al cancelar: estado → `Cancelado`, pago → `Devolución pendiente`

---

## 🏦 Bóveda Digital (Plan Premium)

Sistema de gestión documental con metadatos avanzados:

### Metadatos por Documento
- Nombre del archivo
- Tipo documental
- Categoría
- Área / Departamento
- Descripción
- Palabras clave
- Fecha del documento
- Nivel de confidencialidad
- Años de conservación
- Estado OCR
- Estado de seguridad
- URL de almacenamiento

### Funcionalidades
- 🔍 Búsqueda avanzada por filtros (nombre, tipo, categoría, área, confidencialidad, etc.)
- 📂 Clasificación documental
- ⬇️ Descarga de archivos
- 🚫 Bloqueo automático para órdenes de Plan Estándar

---

## 🗄️ Estructura de Base de Datos

| Tabla | Descripción |
|-------|-------------|
| `services` | Planes del sistema |
| `extras` | Servicios adicionales |
| `quotations` | Cotizaciones generadas |
| `quotation_extras` | Relación cotizaciones ↔ extras |
| `orders` | Órdenes de servicio |
| `vault_documents` | Documentos en bóveda digital y metadatos |

---

## ✅ Funcionalidades Implementadas

- [x] Consulta de planes y extras
- [x] Generación de cotizaciones con cálculo automático
- [x] Creación de órdenes desde cotizaciones
- [x] Simulación de pagos (múltiples métodos)
- [x] Seguimiento de órdenes por estados
- [x] Cancelación de órdenes (solo estado inicial)
- [x] Panel de administración para cambio de estados
- [x] Bóveda digital con gestión documental (Plan Premium)
- [x] Búsqueda y filtrado de documentos (Plan Premium)
- [x] Bloqueo de bóveda para Plan Estándar

---
