# Guía de contribución

Este documento describe las reglas y el flujo de trabajo para contribuir al proyecto de Digitalización Documental.

---

## Requisitos previos

Antes de contribuir, asegúrate de haber completado la instalación del entorno de desarrollo según las instrucciones del [Manual de instalación](docs/manual-instalacion-multientorno/index.md).

---

## Flujo de trabajo con Git

### Modelo de ramas

```
main          ← rama estable de producción
develop       ← integración continua (base para PRs)
feature/<nombre>  ← nuevas funcionalidades
fix/<nombre>      ← correcciones de errores
refactor/<nombre> ← refactorizaciones sin cambio de comportamiento
docs/<nombre>     ← cambios exclusivos de documentación
```

### Pasos para contribuir

```bash
# 1. Crear una rama desde develop
git checkout develop
git pull origin develop
git checkout -b feature/nombre-de-la-funcionalidad

# 2. Realizar los cambios y hacer commits frecuentes

# 3. Subir la rama
git push origin feature/nombre-de-la-funcionalidad

# 4. Abrir un Pull Request hacia develop
```

---

## Convención de mensajes de commit

Se sigue el estándar **Conventional Commits**:

```
<tipo>(<alcance>): <descripción corta en imperativo>
```

### Tipos permitidos

| Tipo       | Cuándo usarlo                                         |
|------------|-------------------------------------------------------|
| `feat`     | Nueva funcionalidad                                   |
| `fix`      | Corrección de un error                                |
| `refactor` | Cambio de código sin modificar comportamiento externo |
| `docs`     | Cambios solo en documentación                         |
| `style`    | Formato, espacios, puntos y coma (sin lógica)         |
| `test`     | Agregar o corregir pruebas                            |
| `chore`    | Tareas de mantenimiento (CI, dependencias, scripts)   |
| `git`      | Operaciones de control de versiones (seeders, etc.)   |

### Ejemplos válidos

```
feat(vault): agregar filtro por nivel de confidencialidad
fix(quotation): corregir cálculo de total con extras en cero
refactor(api): normalizar respuestas HTTP con interceptor Axios
docs(readme): actualizar instrucciones de instalación
```

---

## Estándares de código

### Backend (Python / FastAPI)

- **Estilo**: seguir [PEP 8](https://pep8.org/).
- **Tipos**: usar anotaciones de tipo en todas las funciones de servicios y controladores.
- **Capas**: respetar la separación `modelos → esquemas → servicios → controladores`.
- **Validación**: definir todos los esquemas de entrada y salida en `schemas/` usando Pydantic.
- **Dependencias**: no agregar paquetes sin actualizar `requirements.txt`.
- **Variables de entorno**: nunca hardcodear credenciales; usar `python-dotenv` y el archivo `.env`.

### Frontend (React / JavaScript)

- **Componentes**: usar componentes funcionales con hooks; no usar clases.
- **Nombres de archivos**: `PascalCase` para componentes (`.jsx`), `camelCase` para utilidades (`.js`).
- **Llamadas HTTP**: centralizar en `src/api/api.js`; usar el hook `useApi` para consumir datos.
- **Estado global**: usar `AuthContext` para autenticación; no crear contextos nuevos sin discutirlo primero.
- **Estilos**: usar las variables CSS del sistema de diseño definidas en `src/styles/global.css`; evitar valores inline.
- **Linter**: el código debe pasar `npm run lint` sin errores antes de hacer push.

---

## Revisión de Pull Requests

### Criterios de aprobación

Un PR debe cumplir todos los siguientes puntos para ser aprobado:

- [ ] El título del PR describe claramente el cambio.
- [ ] La descripción explica el *por qué* del cambio, no solo el *qué*.
- [ ] El código sigue las convenciones de estilo del proyecto.
- [ ] No se incluyen archivos de entorno (`.env`) ni secretos.
- [ ] Si se agrega un endpoint, está documentado en `docs/api-solicitudes/index.md`.
- [ ] Si se modifica el esquema de base de datos, se actualiza `docs/documentacion-adicional/diccionario-datos.md`.
- [ ] El frontend pasa `npm run lint` sin errores.
- [ ] `pytest` pasa sin errores (`61 passed` o más si se añaden tests nuevos).
- [ ] Si se añade o modifica un endpoint, se incluyen tests automatizados para ese endpoint.
- [ ] El comportamiento fue verificado manualmente en el navegador.

### Tamaño recomendado

Los PRs deben ser pequeños y enfocados: máximo 400 líneas de cambio neto. Los PRs grandes deben dividirse en partes independientes.

---

## Pruebas

### Suite automatizada (backend)

El proyecto cuenta con 61 tests de integración en `backend/tests/`. Usan una base de datos SQLite en memoria: **no requieren el servidor ni PostgreSQL activos**.

```bash
cd backend
source venv/bin/activate
pip install -r requirements-test.txt   # Solo la primera vez
pytest
```

Antes de abrir un PR, todos los tests deben pasar:

```
======================= 61 passed in 1.6s ========================
```

Para exportar los resultados a CSV (útil para incluir en el PR):

```bash
python run_tests.py
# Genera: backend/test-results/results.csv
```

Ver la referencia completa de comandos en [docs/informacion-tecnica/comandos-utiles.md](docs/informacion-tecnica/comandos-utiles.md#tests).

### Al agregar una nueva funcionalidad

Si el PR añade o modifica un endpoint, debe incluir los tests correspondientes en `backend/tests/`. Seguir el patrón existente:

- Un archivo por módulo (`test_<nombre>.py`).
- Tests agrupados en clases (`class Test<Escenario>`).
- Nombres de test en español que describan el escenario (`test_falla_con_cotizacion_cancelada`).
- Usar las fixtures de `conftest.py` para crear datos; no insertar directamente con SQL.

### Verificación manual (frontend)

```bash
# Lint
cd frontend && npm run lint

# Verificar el build de producción
npm run build && npm run preview
```

---

## Dependencias

- **No agregar** dependencias innecesarias.
- **Backend**: agregar el paquete con `pip install <paquete>` y luego actualizar `requirements.txt` con `pip freeze > requirements.txt`.
- **Frontend**: usar `npm install <paquete>` (o `--save-dev` para devDependencies).
- Justificar en el PR por qué se necesita la nueva dependencia.

---

## Documentación

Cualquier cambio que afecte comportamiento externo debe acompañarse de la actualización de la documentación correspondiente:

| Si cambias...          | Actualiza también...                                         |
|------------------------|--------------------------------------------------------------|
| Un endpoint de la API  | `docs/api-solicitudes/index.md` + tests en `backend/tests/` |
| El esquema de BD       | `docs/documentacion-adicional/diccionario-datos.md`          |
| Variables de entorno   | `SECURITY_CONFIG.md` y `docs/instalacion-configuracion-despligue/instrucciones-configuracion.md` |
| Pasos de instalación   | `docs/manual-instalacion-multientorno/index.md`              |
| Los tests o su estructura | `docs/control-calidad/index.md`                           |

---

## Reportar errores

Abrir un issue con la siguiente información:

1. **Descripción**: qué ocurre y qué se esperaba.
2. **Pasos para reproducir**: lista numerada.
3. **Entorno**: sistema operativo, versión de Python, versión de Node.
4. **Logs relevantes**: fragmento del error del terminal o consola del navegador.
