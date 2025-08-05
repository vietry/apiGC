# Guía de Endpoints - API Planificación

## Información General

-   **Base URL**: `/api/planificacion`
-   **Formato de respuesta**: JSON
-   **Autenticación**: Requerida (según configuración del sistema)

---

## 📋 Endpoints Principales

### 1. Obtener Todas las Planificaciones

```http
GET /api/planificacion
```

**Parámetros de consulta (query params):**

-   `page` (number, opcional): Número de página (default: 1)
-   `limit` (number, opcional): Elementos por página (default: 10)
-   `mes` (number, opcional): Filtrar por mes (1-12)
-   `estado` (string, opcional): Filtrar por estado ('Programado', 'Completado', 'Cancelado')
-   `idColaborador` (number, opcional): Filtrar por colaborador

**Respuesta exitosa (200):**

```json
{
    "planificaciones": [
        {
            "id": 1,
            "idColaborador": 123,
            "mes": 8,
            "cantDemos": 15,
            "dosisCil": 2.5,
            "dosisMoc": 1.8,
            "muestraTotal": 100,
            "estado": "Programado",
            "checkJefe": false,
            "comentarios": "Planificación para agosto",
            "activo": true,
            "createdAt": "2025-08-01T10:00:00Z",
            "updatedAt": "2025-08-01T10:00:00Z",
            "gtes": [1, 2, 3],
            "tiendas": [10, 11, 12],
            "productos": [100, 101],
            "cultivos": [20, 21],
            "blancos": [30, 31],
            "momentosAplicacion": [
                {
                    "momentoAplicaId": 1,
                    "paramEvaAntes": "Parámetro antes",
                    "paramEvaDespues": "Parámetro después"
                }
            ]
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 25,
        "totalPages": 3
    }
}
```

### 2. Obtener Planificación por ID

```http
GET /api/planificacion/:id
```

**Parámetros de ruta:**

-   `id` (number): ID de la planificación

**Respuesta exitosa (200):**

```json
{
    "id": 1,
    "idColaborador": 123,
    "mes": 8,
    "cantDemos": 15
    // ... resto de campos como en el ejemplo anterior
}
```

### 3. Crear Nueva Planificación

```http
POST /api/planificacion
```

**Cuerpo de la petición:**

```json
{
    "idColaborador": 123,
    "mes": 8,
    "cantDemos": 15,
    "dosisCil": 2.5,
    "dosisMoc": 1.8,
    "muestraTotal": 100,
    "estado": "Programado",
    "checkJefe": false,
    "comentarios": "Nueva planificación",
    "createdBy": 456,
    "gtes": [1, 2, 3],
    "tiendas": [10, 11, 12],
    "productos": [100, 101],
    "cultivos": [20, 21],
    "blancos": [30, 31],
    "momentosAplicacion": [
        {
            "momentoAplicaId": 1,
            "paramEvaAntes": "Evaluación previa",
            "paramEvaDespues": "Evaluación posterior"
        }
    ]
}
```

**Campos requeridos:**

-   `idColaborador` (number)
-   `mes` (number, 1-12)
-   `cantDemos` (number, ≥ 0)
-   `estado` (string: 'Programado', 'Completado', 'Cancelado')

**Respuesta exitosa (201):**

```json
{
    "message": "Planificación creada exitosamente",
    "planificacion": {
        "id": 26
        // ... datos de la planificación creada
    }
}
```

### 4. Actualizar Planificación

```http
PUT /api/planificacion/:id
```

**Parámetros de ruta:**

-   `id` (number): ID de la planificación

**Cuerpo de la petición:**

```json
{
    "mes": 9,
    "cantDemos": 20,
    "estado": "Completado",
    "comentarios": "Planificación actualizada",
    "updatedBy": 456,
    "gtes": [1, 2, 4],
    "productos": [100, 102, 103]
}
```

**Nota:** Todos los campos son opcionales en la actualización.

**Respuesta exitosa (200):**

```json
{
    "message": "Planificación actualizada exitosamente",
    "planificacion": {
        // ... datos actualizados
    }
}
```

### 5. Eliminar Planificación

```http
DELETE /api/planificacion/:id
```

**Parámetros de ruta:**

-   `id` (number): ID de la planificación

**Respuesta exitosa (200):**

```json
{
    "message": "Planificación eliminada exitosamente"
}
```

---

## 🔄 Endpoints de Estado

### 6. Desactivar Planificación

```http
PATCH /api/planificacion/:id/deactivate
```

**Parámetros de ruta:**

-   `id` (number): ID de la planificación

**Respuesta exitosa (200):**

```json
{
    "message": "Planificación desactivada exitosamente"
}
```

### 7. Activar Planificación

```http
PATCH /api/planificacion/:id/activate
```

**Parámetros de ruta:**

-   `id` (number): ID de la planificación

**Respuesta exitosa (200):**

```json
{
    "message": "Planificación activada exitosamente"
}
```

---

## ✅ Endpoints de Aprobación

### 8. Aprobar Planificación

```http
PATCH /api/planificacion/:id/approve
```

**Parámetros de ruta:**

-   `id` (number): ID de la planificación

**Cuerpo de la petición (opcional):**

```json
{
    "comentarios": "Aprobada por jefe de área",
    "approvedBy": 789
}
```

**Respuesta exitosa (200):**

```json
{
    "message": "Planificación aprobada exitosamente",
    "planificacion": {
        "id": 1,
        "estado": "Completado",
        "checkJefe": true
        // ... resto de datos
    }
}
```

### 9. Rechazar Planificación

```http
PATCH /api/planificacion/:id/reject
```

**Parámetros de ruta:**

-   `id` (number): ID de la planificación

**Cuerpo de la petición:**

```json
{
    "comentarios": "Requiere correcciones en las dosis",
    "rejectedBy": 789
}
```

**Respuesta exitosa (200):**

```json
{
    "message": "Planificación rechazada",
    "planificacion": {
        "id": 1,
        "estado": "Cancelado",
        "checkJefe": false
        // ... resto de datos
    }
}
```

---

## 🔍 Endpoints Auxiliares

### 10. Obtener Momentos de Aplicación

```http
GET /api/planificacion/momentos/aplicacion
```

**Respuesta exitosa (200):**

```json
{
    "momentos": [
        {
            "id": 1,
            "nombre": "Pre-siembra",
            "descripcion": "Aplicación antes de la siembra"
        },
        {
            "id": 2,
            "nombre": "Post-emergencia",
            "descripcion": "Aplicación después de la emergencia"
        }
    ]
}
```

### 11. Obtener Planificaciones por Colaborador

```http
GET /api/planificacion/colaborador/:idColaborador
```

**Parámetros de ruta:**

-   `idColaborador` (number): ID del colaborador

**Parámetros de consulta (opcionales):**

-   `mes` (number): Filtrar por mes
-   `estado` (string): Filtrar por estado
-   `activo` (boolean): Filtrar por estado activo

**Respuesta exitosa (200):**

```json
{
    "colaboradorId": 123,
    "planificaciones": [
        {
            // ... datos de planificaciones del colaborador
        }
    ],
    "totalPlanificaciones": 5
}
```

---

## 🚨 Códigos de Error Comunes

### 400 - Bad Request

```json
{
    "error": "Datos de entrada inválidos",
    "details": "mes debe estar entre 1 y 12"
}
```

### 404 - Not Found

```json
{
    "error": "Planificación no encontrada",
    "id": 999
}
```

### 409 - Conflict

```json
{
    "error": "Ya existe una planificación para este colaborador y mes",
    "conflictingFields": ["idColaborador", "mes"]
}
```

### 500 - Internal Server Error

```json
{
    "error": "Error interno del servidor",
    "message": "Error en la base de datos"
}
```

---

## 📝 Notas de Implementación

### Validaciones

-   **Mes**: Debe estar entre 1 y 12
-   **CantDemos**: Debe ser un número ≥ 0
-   **Estado**: Solo acepta 'Programado', 'Completado', 'Cancelado'
-   **Arrays de relaciones**: Deben contener solo números válidos

### Transacciones

-   Todas las operaciones de creación/actualización se ejecutan dentro de transacciones de base de datos
-   Si falla alguna relación, se revierte toda la operación

### Relaciones Manejadas

-   **GTEs**: Gerentes técnicos asignados
-   **Tiendas**: Tiendas involucradas
-   **Productos**: Productos a utilizar
-   **Cultivos**: Cultivos objetivo
-   **Blancos**: Blancos de aplicación
-   **Momentos de Aplicación**: Momentos específicos con parámetros de evaluación

### Paginación

-   Paginación automática en endpoints de listado
-   Límite máximo: 100 elementos por página
-   Página por defecto: 1

---

_Última actualización: 4 de agosto de 2025_
