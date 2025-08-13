# 📋 Guía de Endpoints - Nueva Planificación API

## 🌐 Base URL

```
/api/nueva-planificacion
```

---

## 📌 Endpoints Disponibles

### 1. **GET** `/` - Obtener todas las planificaciones

Obtiene una lista paginada de planificaciones con filtros opcionales.

#### **Query Parameters:**

| Parámetro         | Tipo    | Descripción                                                  | Ejemplo                |
| ----------------- | ------- | ------------------------------------------------------------ | ---------------------- |
| `activo`          | string  | Filtrar por estado activo (`true`, `false`, `all`)           | `?activo=true`         |
| `search`          | string  | Búsqueda en texto libre                                      | `?search=demo`         |
| `idColaborador`   | number  | Filtrar por colaborador                                      | `?idColaborador=123`   |
| `mes`             | number  | Filtrar por mes (1-12)                                       | `?mes=6`               |
| `gteId`           | number  | Filtrar por GTE                                              | `?gteId=456`           |
| `tiendaId`        | number  | Filtrar por tienda/punto de contacto                         | `?tiendaId=789`        |
| `vegetacionId`    | number  | Filtrar por vegetación                                       | `?vegetacionId=101`    |
| `momentoAplicaId` | number  | Filtrar por momento de aplicación                            | `?momentoAplicaId=202` |
| `productoId`      | number  | Filtrar por producto/familia                                 | `?productoId=303`      |
| `blancoId`        | number  | Filtrar por blanco biológico                                 | `?blancoId=404`        |
| `estado`          | string  | Filtrar por estado (`Programado`, `Completado`, `Cancelado`) | `?estado=Programado`   |
| `checkJefe`       | boolean | Filtrar por aprobación del jefe (`true`, `false`)            | `?checkJefe=true`      |
| `year`            | number  | Filtrar por año                                              | `?year=2025`           |
| `month`           | number  | Filtrar por mes específico                                   | `?month=8`             |
| `limit`           | number  | Límite de resultados por página (default: 10)                | `?limit=20`            |
| `page`            | number  | Número de página (default: 1)                                | `?page=2`              |

#### **Ejemplo de Request:**

```http
GET /api/nueva-planificacion?activo=true&mes=6&limit=20&page=1
```

#### **Ejemplo de Response:**

```json
{
    "ok": true,
    "data": [
        {
            "id": 1,
            "idColaborador": 123,
            "mes": 6,
            "gteId": 456,
            "tiendaId": 789,
            "vegetacionId": 101,
            "momentoAplicaId": 202,
            "paramEvaAntes": "Parámetros antes",
            "paramEvaDespues": "Parámetros después",
            "productoId": 303,
            "blancoId": 404,
            "dosisMoc": 2.5,
            "cantDemos": 10,
            "muestraTotal": 100.5,
            "estado": "Programado",
            "checkJefe": null,
            "comentariosJefe": null,
            "comentarios": "Comentarios adicionales",
            "activo": true,
            "approvedAt": null,
            "createdAt": "2025-08-07T10:00:00Z",
            "updatedAt": "2025-08-07T10:00:00Z",
            "createdBy": 1,
            "updatedBy": null,
            "Colaborador": { "id": 123, "nombre": "Juan Pérez" },
            "Gte": { "id": 456, "nombre": "GTE Norte" },
            "PuntoContacto": { "id": 789, "nombre": "Tienda Central" },
            "Vegetacion": { "id": 101, "nombre": "Maíz" },
            "MomentoAplicacion": { "id": 202, "nombre": "Pre-siembra" },
            "Familia": { "id": 303, "nombre": "Herbicida" },
            "BlancoBiologico": { "id": 404, "nombre": "Maleza" }
        }
    ],
    "pagination": {
        "total": 50,
        "limit": 20,
        "page": 1,
        "totalPages": 3
    },
    "statistics": {
        "total": 50,
        "activos": 45,
        "inactivos": 5
    },
    "planificacionStats": {
        "programados": 30,
        "completados": 15,
        "cancelados": 5,
        "aprobados": 20,
        "rechazados": 5,
        "pendientesAprobacion": 25
    }
}
```

---

### 2. **GET** `/:id` - Obtener planificación por ID

Obtiene una planificación específica por su ID.

#### **Path Parameters:**

| Parámetro | Tipo   | Descripción            |
| --------- | ------ | ---------------------- |
| `id`      | number | ID de la planificación |

#### **Ejemplo de Request:**

```http
GET /api/nueva-planificacion/123
```

#### **Ejemplo de Response:**

```json
{
    "ok": true,
    "data": {
        "id": 123,
        "idColaborador": 456,
        "mes": 7
        // ... resto de campos con relaciones incluidas
    }
}
```

---

### 3. **POST** `/` - Crear nueva planificación

Crea una nueva planificación.

#### **Request Body:**

```json
{
    "idColaborador": 123,
    "mes": 6,
    "gteId": 456,
    "tiendaId": 789,
    "vegetacionId": 101,
    "momentoAplicaId": 202,
    "paramEvaAntes": "Parámetros de evaluación antes",
    "paramEvaDespues": "Parámetros de evaluación después",
    "productoId": 303,
    "blancoId": 404,
    "dosisMoc": 2.5,
    "cantDemos": 10,
    "muestraTotal": 100.5,
    "estado": "Programado",
    "checkJefe": null,
    "comentariosJefe": null,
    "comentarios": "Comentarios adicionales",
    "createdBy": 1
}
```

#### **Campos Requeridos:**

-   `idColaborador` (number)
-   `mes` (number)
-   `gteId` (number)
-   `tiendaId` (number)
-   `vegetacionId` (number)
-   `momentoAplicaId` (number)
-   `productoId` (number)
-   `blancoId` (number)
-   `cantDemos` (number)
-   `estado` (string)

#### **Ejemplo de Response:**

```json
{
    "ok": true,
    "data": {
        "id": 124
        // ... planificación creada con relaciones
    },
    "message": "Planificación creada exitosamente"
}
```

---

### 4. **PUT** `/:id` - Actualizar planificación

Actualiza una planificación existente.

#### **Path Parameters:**

| Parámetro | Tipo   | Descripción            |
| --------- | ------ | ---------------------- |
| `id`      | number | ID de la planificación |

#### **Request Body:**

```json
{
    "mes": 7,
    "estado": "Completado",
    "comentarios": "Planificación completada exitosamente",
    "updatedBy": 1
}
```

#### **Ejemplo de Response:**

```json
{
    "ok": true,
    "data": {
        // ... planificación actualizada
    },
    "message": "Planificación actualizada exitosamente"
}
```

---

### 5. **PATCH** `/:id/deactivate` - Desactivar planificación

Marca una planificación como inactiva.

#### **Request Body:**

```json
{
    "updatedBy": 1
}
```

#### **Ejemplo de Response:**

```json
{
    "ok": true,
    "data": {
        // ... planificación con activo: false
    },
    "message": "Planificación desactivada exitosamente"
}
```

---

### 6. **PATCH** `/:id/activate` - Activar planificación

Marca una planificación como activa.

#### **Request Body:**

```json
{
    "updatedBy": 1
}
```

#### **Ejemplo de Response:**

```json
{
    "ok": true,
    "data": {
        // ... planificación con activo: true
    },
    "message": "Planificación activada exitosamente"
}
```

---

### 7. **PATCH** `/:id/approve` - Aprobar planificación

Aprueba una planificación (checkJefe = true).

#### **Request Body:**

```json
{
    "approvedBy": 1,
    "comentariosJefe": "Planificación aprobada sin observaciones"
}
```

#### **Campos Requeridos:**

-   `approvedBy` (number)

#### **Ejemplo de Response:**

```json
{
    "ok": true,
    "data": {
        // ... planificación con checkJefe: true, approvedAt: fecha
    },
    "message": "Planificación aprobada exitosamente"
}
```

---

### 8. **PATCH** `/:id/reject` - Rechazar planificación

Rechaza una planificación (checkJefe = false).

#### **Request Body:**

```json
{
    "rejectedBy": 1,
    "comentariosJefe": "Necesita más información sobre dosificación"
}
```

#### **Campos Requeridos:**

-   `rejectedBy` (number)
-   `comentariosJefe` (string) - No puede estar vacío

#### **Ejemplo de Response:**

```json
{
    "ok": true,
    "data": {
        // ... planificación con checkJefe: false, approvedAt: null
    },
    "message": "Planificación rechazada exitosamente"
}
```

---

### 9. **PATCH** `/:id/estado` - Cambiar estado de planificación

Cambia el estado de una planificación.

#### **Request Body:**

```json
{
    "estado": "Completado",
    "updatedBy": 1
}
```

#### **Estados Válidos:**

-   `Programado`
-   `Completado`
-   `Cancelado`

#### **Campos Requeridos:**

-   `estado` (string)

#### **Ejemplo de Response:**

```json
{
    "ok": true,
    "data": {
        // ... planificación con nuevo estado
    },
    "message": "Estado de planificación actualizado exitosamente"
}
```

---

## 🔍 Estados del Sistema

### **Estado de Aprobación (checkJefe):**

-   `null` - Pendiente de revisión
-   `true` - ✅ Aprobado (con fecha en `approvedAt`)
-   `false` - ❌ Rechazado (con comentarios obligatorios)

### **Estados de Planificación:**

-   `Programado` - Planificación programada
-   `Completado` - Planificación completada
-   `Cancelado` - Planificación cancelada

### **Estado de Actividad:**

-   `activo: true` - Registro activo
-   `activo: false` - Registro inactivo

---

## 🚨 Códigos de Error Comunes

| Código | Descripción                             |
| ------ | --------------------------------------- |
| `400`  | Campos requeridos faltantes o inválidos |
| `404`  | Planificación no encontrada             |
| `500`  | Error interno del servidor              |

---

## 📝 Ejemplos de Uso

### Obtener planificaciones de un colaborador específico:

```http
GET /api/nueva-planificacion?idColaborador=123&activo=true
```

### Buscar planificaciones por texto:

```http
GET /api/nueva-planificacion?search=maíz&limit=50
```

### Obtener planificaciones pendientes de aprobación:

```http
GET /api/nueva-planificacion?checkJefe=null
```

### Obtener planificaciones completadas en junio 2025:

```http
GET /api/nueva-planificacion?estado=Completado&year=2025&month=6
```

---

## 🔗 Relaciones Incluidas

Todas las respuestas incluyen las siguientes relaciones:

-   **Colaborador** - Información del colaborador
-   **Gte** - Información del GTE
-   **PuntoContacto** - Información de la tienda/punto de contacto
-   **Vegetacion** - Información de la vegetación
-   **MomentoAplicacion** - Información del momento de aplicación
-   **Familia** - Información del producto/familia
-   **BlancoBiologico** - Información del blanco biológico
