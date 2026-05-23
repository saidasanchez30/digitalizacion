# Proyecto: Plataforma Web de Digitalización Documental

## Descripción general

Este proyecto consiste en el desarrollo de una aplicación web orientada a empresas que aún conservan documentación física y desean migrar sus archivos a formato digital.

La plataforma permitirá consultar planes de servicio, cotizar la digitalización de documentos por volumen, seleccionar servicios adicionales, agendar la recolección de documentos físicos, simular el proceso de compra y dar seguimiento al estado del servicio contratado.

El sistema está pensado como un prototipo funcional para representar una solución de negocio enfocada en la digitalización documental empresarial.

---

## Objetivo del proyecto

Desarrollar una aplicación web que permita ofrecer, cotizar y contratar servicios de digitalización documental para empresas, integrando una propuesta de valor basada en la entrega flexible de documentos digitalizados y, en el caso del plan premium, una bóveda digital segura simulada para la gestión documental.

---

## Propuesta de negocio

La solución busca apoyar a empresas que cuentan con grandes cantidades de documentos físicos y necesitan transformarlos en archivos digitales para mejorar su administración, consulta y conservación.

La propuesta se basa en dos modalidades principales de servicio:

1. **Plan Estándar**, enfocado en digitalizar documentos y entregarlos al cliente mediante diferentes medios.
2. **Plan Premium**, enfocado en digitalizar, almacenar, clasificar y consultar documentos dentro de una bóveda digital segura simulada.

Además, el sistema permitirá agregar servicios extra como entrega física en unidad proporcionada por la empresa, digitalización urgente y OCR simulado.

---

## Planes de servicio

### 1. Plan Estándar

Dirigido a clientes que únicamente desean digitalizar sus documentos físicos y recibir los archivos resultantes sin almacenarlos permanentemente en la plataforma.

#### Incluye:

- Recolección programada.
- Escaneo masivo.
- Entrega documental.

#### Modalidades de entrega documental:

- Unidad física proporcionada por el cliente.
- Enlace temporal a la nube de la empresa.
- Transferencia a la nube del cliente.
- Entrega mediante servidor SFTP.

Este plan está pensado para empresas que desean conservar el control total de sus documentos digitalizados dentro de su propia infraestructura.

---

### 2. Plan Premium

Dirigido a clientes que desean una solución de gestión documental, no solo la digitalización de archivos.

#### Incluye:

- Recolección programada.
- Escaneo masivo.
- Bóveda digital segura simulada.
- Clasificación documental.
- Consulta en línea.
- Descarga de archivos.

Este plan representa el valor agregado principal del sistema, ya que permite al cliente consultar y descargar documentos desde una plataforma web, simulando un entorno seguro de almacenamiento documental.

---

## Servicios extra

Los servicios extra se seleccionan durante el proceso de cotización, antes de confirmar la compra.

### Extras disponibles

- Entrega física en unidad ofrecida por la empresa.
- Digitalización urgente.
- OCR simulado.

### Descripción de extras

#### Entrega física en unidad ofrecida por la empresa

Permite que la empresa prestadora del servicio entregue los documentos digitalizados en una unidad física propia, como USB, disco duro externo o SSD.

#### Digitalización urgente

Permite reducir el tiempo estimado de entrega del servicio mediante un cargo adicional.

#### OCR simulado

Representa la posibilidad de convertir documentos escaneados en archivos buscables mediante reconocimiento óptico de caracteres. En el prototipo, esta función será simulada.

---

## Flujo general de la aplicación

El flujo principal del sistema será el siguiente:

1. El cliente entra a la plataforma.
2. Consulta los planes disponibles.
3. Selecciona el Plan Estándar o el Plan Premium.
4. Ingresa el volumen estimado de documentos.
5. Selecciona los servicios extra, si aplica.
6. Selecciona o propone una fecha de recolección.
7. El sistema calcula el precio estimado.
8. El sistema propone una fecha estimada de entrega.
9. El cliente revisa el resumen de compra.
10. El cliente confirma la compra.
11. El sistema simula el pago.
12. El sistema genera una orden de servicio.
13. El cliente consulta el seguimiento de su servicio.
14. El cliente puede cancelar el servicio antes de la recolección física.

---

## Estados del servicio

Los estados considerados para el seguimiento de una orden son:

- Cotización generada.
- Pago pendiente.
- Pago confirmado.
- Recolección agendada.
- Documentos recolectados.
- En digitalización.
- En revisión de calidad.
- Preparando entrega.
- Entregado.
- Cancelado.
- Disponible en bóveda digital.

El estado **Disponible en bóveda digital** aplica principalmente para el Plan Premium.

---

## Cancelaciones y devoluciones

El sistema deberá incluir una opción de cancelación del servicio.

La regla principal será:

> El cliente puede cancelar el servicio antes de que se realice la recolección física de los documentos.

Una vez que los documentos hayan sido recolectados o el proceso de digitalización haya iniciado, la cancelación quedará sujeta a revisión administrativa.

Para el prototipo, la cancelación se manejará de forma simulada mediante el cambio de estado de la orden.

---

## Pantallas principales del sistema

El prototipo contempla las siguientes interfaces principales:

1. Inicio.
2. Catálogo de planes.
3. Cotizador.
4. Selección de extras.
5. Agendamiento de recolección.
6. Resumen de compra.
7. Pago simulado.
8. Confirmación de orden.
9. Seguimiento del servicio.
10. Cancelación del servicio.
11. Bóveda digital simulada.

---

## Arquitectura tecnológica

La arquitectura definida para el proyecto es:

- **Frontend:** ReactJS.
- **Backend:** FastAPI.
- **Base de datos:** PostgreSQL.
- **ORM:** SQLAlchemy.
- **Administrador de base de datos:** DBeaver.
- **Base de datos remota:** Supabase.
- **Control de versiones:** Git y GitHub.

---

## Arquitectura MVC

El proyecto utilizará una organización basada en el patrón MVC.

En este sistema, el patrón se interpreta de la siguiente forma:

| Elemento MVC | Implementación en el proyecto |
|-------------|-------------------------------|
| Modelo | Modelos SQLAlchemy y tablas en PostgreSQL |
| Vista | Interfaces desarrolladas en ReactJS |
| Controlador | Endpoints y controladores desarrollados con FastAPI |
| Lógica de negocio | Servicios internos del backend |

El flujo de comunicación será:

```text
ReactJS
    ↓
Controladores FastAPI
    ↓
Servicios de negocio
    ↓
Modelos SQLAlchemy
    ↓
PostgreSQL
