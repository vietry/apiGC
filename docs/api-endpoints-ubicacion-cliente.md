# API Endpoints - Ubicación Cliente

Esta guía documenta todos los endpoints disponibles para gestionar ubicaciones de clientes en el sistema.

## Base URL

```
/api/ubicacion-cliente
```

## Índice

-   [Endpoints CRUD Principales](#endpoints-crud-principales)
-   [Endpoints de Búsqueda y Filtrado](#endpoints-de-búsqueda-y-filtrado)
-   [Endpoints de Estadísticas](#endpoints-de-estadísticas)
-   [Modelos de Datos](#modelos-de-datos)
-   [Códigos de Respuesta](#códigos-de-respuesta)
-   [Ejemplos de Uso](#ejemplos-de-uso)

---

## Endpoints CRUD Principales

### 1. Obtener todas las ubicaciones

```http
GET /api/ubicacion-cliente/
```

**Descripción**: Obtiene todas las ubicaciones de cliente con filtros opcionales.

**⚠️ Importante**: Este endpoint devuelve el **objeto completo** de `Contacto` con todos sus campos.

**Query Parameters**:
| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `cliente` | string | Filtrar por código de cliente | `?cliente=CLI001` |
| `esquema` | string | Filtrar por esquema | `?esquema=tqc` |
| `vigente` | boolean | Filtrar por estado vigente | `?vigente=true` |
| `search` | string | Búsqueda en nombre y direcciones | `?search=Lima` |
| `departamento` | string | Filtrar por departamento | `?departamento=Lima` |
| `provincia` | string | Filtrar por provincia | `?provincia=Lima` |
| `distrito` | string | Filtrar por distrito | `?distrito=Miraflores` |

**Ejemplo de respuesta**:

```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "cliente": "CLI001",
            "detalleDireccion": 123,
            "nombre": "Sede Principal Lima",
            "ubigeoId": "150101",
            "departamento": "Lima",
            "provincia": "Lima",
            "distrito": "Lima",
            "direccion1": "Av. Javier Prado 123",
            "direccion2": "Piso 5, Oficina 501",
            "vigente": true,
            "esquema": "tqc",
            "updatedAt": "2025-09-17T10:30:00.000Z",
            "Contacto": [
                {
                    "id": 1,
                    "nombre": "Juan",
                    "apellido": "Pérez",
                    "cargo": "Gerente",
                    "email": "juan.perez@empresa.com",
                    "celularA": "999888777",
                    "celularB": "111222333",
                    "activo": true,
                    "createdAt": "2025-09-17T08:00:00.000Z",
                    "updatedAt": "2025-09-17T10:00:00.000Z",
                    "clienteExactusId": 123,
                    "clienteGestionCId": 456,
                    "tipo": "Gerencial",
                    "createdBy": 1,
                    "ubicacionId": 1
                }
            ]
        }
    ],
    "message": "1 ubicaciones de cliente encontradas"
}
```

### 2. Obtener ubicación por ID

```http
GET /api/ubicacion-cliente/:id
```

**Descripción**: Obtiene una ubicación específica por su ID.

**⚠️ Importante**: Este endpoint devuelve campos **seleccionados** de `Contacto` (id, nombre, apellido, cargo, email, celularA, celularB, activo).

**Path Parameters**:
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | number | ID de la ubicación |

**Ejemplo**:

```http
GET /api/ubicacion-cliente/1
```

### 3. Crear nueva ubicación

```http
POST /api/ubicacion-cliente/
```

**Descripción**: Crea una nueva ubicación de cliente.

**Body (JSON)**:

```json
{
    "cliente": "CLI002",
    "detalleDireccion": 456,
    "nombre": "Sucursal Arequipa",
    "ubigeoId": "040101",
    "departamento": "Arequipa",
    "provincia": "Arequipa",
    "distrito": "Arequipa",
    "direccion1": "Calle Mercaderes 789",
    "direccion2": "Centro Histórico",
    "vigente": true,
    "esquema": "TALEX"
}
```

**Campos requeridos**: `cliente`, `detalleDireccion`, `esquema`

### 4. Actualizar ubicación

```http
PUT /api/ubicacion-cliente/:id
```

**Descripción**: Actualiza una ubicación existente.

**Path Parameters**:
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | number | ID de la ubicación a actualizar |

**Body (JSON)** - Todos los campos son opcionales:

```json
{
    "nombre": "Sucursal Arequipa - Actualizada",
    "direccion1": "Calle Mercaderes 790",
    "vigente": true
}
```

### 5. Eliminar ubicación

```http
DELETE /api/ubicacion-cliente/:id
```

**Descripción**: Elimina una ubicación (marca como no vigente).

**Path Parameters**:
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | number | ID de la ubicación a eliminar |

---

## Endpoints de Búsqueda y Filtrado

### 6. Obtener ubicaciones por cliente

```http
GET /api/ubicacion-cliente/cliente/:clienteCode
```

**Descripción**: Obtiene todas las ubicaciones de un cliente específico.

**⚠️ Importante**: Este endpoint devuelve campos **seleccionados** de `Contacto` activos (id, nombre, apellido, cargo, email, celularA).

**Path Parameters**:
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `clienteCode` | string | Código del cliente |

**Query Parameters**:
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `esquema` | string | Filtrar por esquema específico |

**Ejemplo**:

```http
GET /api/ubicacion-cliente/cliente/CLI001?esquema=tqc
```

### 7. Obtener ubicaciones por esquema

```http
GET /api/ubicacion-cliente/esquema/:esquema
```

**Descripción**: Obtiene todas las ubicaciones de un esquema específico.

**⚠️ Importante**: Este endpoint devuelve campos **seleccionados** de `Contacto` activos (id, nombre, apellido, cargo).

**Path Parameters**:
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `esquema` | string | Nombre del esquema (tqc, TALEX, BIOGEN, AGRAVENT) |

**Ejemplo**:

```http
GET /api/ubicacion-cliente/esquema/TALEX
```

### 8. Búsqueda flexible

```http
GET /api/ubicacion-cliente/search/:term
```

**Descripción**: Busca ubicaciones usando un término flexible que coincida con cliente, nombre, direcciones o ubicación geográfica.

**⚠️ Importante**: Este endpoint devuelve campos **seleccionados** de `Contacto` activos (id, nombre, apellido, cargo, email, celularA).

**Path Parameters**:
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `term` | string | Término de búsqueda |

**Query Parameters**:
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `esquema` | string | Filtrar por esquema específico |

**Ejemplo**:

```http
GET /api/ubicacion-cliente/search/Lima?esquema=tqc
```

---

## Endpoints de Estadísticas

### 9. Obtener estadísticas

```http
GET /api/ubicacion-cliente/stats/resumen
```

**Descripción**: Obtiene estadísticas generales de las ubicaciones.

**Query Parameters**:
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `esquema` | string | Filtrar estadísticas por esquema |

**Ejemplo de respuesta**:

```json
{
    "success": true,
    "data": {
        "totalUbicaciones": 150,
        "ubicacionesVigentes": 145,
        "totalClientes": 75,
        "promedioUbicacionesPorCliente": 1.93,
        "ubicacionesPorEsquema": [
            {
                "esquema": "tqc",
                "total": 50
            },
            {
                "esquema": "TALEX",
                "total": 40
            },
            {
                "esquema": "BIOGEN",
                "total": 30
            },
            {
                "esquema": "AGRAVENT",
                "total": 25
            }
        ]
    },
    "message": "Estadísticas obtenidas exitosamente"
}
```

---

## Modelos de Datos

### UbicacionCliente

```typescript
interface UbicacionCliente {
    id: number;
    cliente: string;
    detalleDireccion: number;
    nombre?: string;
    ubigeoId?: string;
    departamento?: string;
    provincia?: string;
    distrito?: string;
    direccion1?: string;
    direccion2?: string;
    vigente: boolean;
    updatedAt: Date;
    esquema: string;
    Contacto: Contacto[];
}
```

### Contacto (Relación)

```typescript
interface Contacto {
    id: number;
    nombre: string;
    apellido: string;
    cargo: string;
    email?: string;
    celularA?: string;
    celularB?: string;
    activo: boolean;
    createdAt: Date;
    updatedAt: Date;
    clienteExactusId: number;
    clienteGestionCId: number;
    tipo?: string;
    createdBy?: number;
    ubicacionId?: number;
}
```

### ServiceResponse

```typescript
interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}
```

---

## Códigos de Respuesta

| Código | Descripción                             |
| ------ | --------------------------------------- |
| `200`  | Operación exitosa                       |
| `201`  | Recurso creado exitosamente             |
| `400`  | Error en la solicitud (datos inválidos) |
| `404`  | Recurso no encontrado                   |
| `500`  | Error interno del servidor              |

---

## Ejemplos de Uso

### Ejemplo 1: Obtener todas las ubicaciones activas de un esquema

```bash
curl -X GET "http://localhost:3000/api/ubicacion-cliente/?esquema=tqc&vigente=true"
```

### Ejemplo 2: Crear una nueva ubicación

```bash
curl -X POST "http://localhost:3000/api/ubicacion-cliente/" \
  -H "Content-Type: application/json" \
  -d '{
    "cliente": "CLI003",
    "detalleDireccion": 789,
    "nombre": "Sede Cusco",
    "departamento": "Cusco",
    "provincia": "Cusco",
    "distrito": "Cusco",
    "direccion1": "Plaza de Armas 123",
    "esquema": "BIOGEN"
  }'
```

### Ejemplo 3: Buscar ubicaciones en Lima

```bash
curl -X GET "http://localhost:3000/api/ubicacion-cliente/search/Lima"
```

### Ejemplo 4: Obtener estadísticas por esquema

```bash
curl -X GET "http://localhost:3000/api/ubicacion-cliente/stats/resumen?esquema=TALEX"
```

### Ejemplo 5: Actualizar una ubicación

```bash
curl -X PUT "http://localhost:3000/api/ubicacion-cliente/1" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Sede Principal Lima - Actualizada",
    "direccion2": "Piso 6, Oficina 601"
  }'
```

### Ejemplo 6: Filtros combinados

```bash
curl -X GET "http://localhost:3000/api/ubicacion-cliente/?departamento=Lima&vigente=true&esquema=tqc"
```

---

## Notas Importantes

1. **Soft Delete**: La eliminación no borra el registro, solo marca `vigente: false`
2. **Filtros Case-Insensitive**: Las búsquedas no distinguen entre mayúsculas y minúsculas
3. **Relaciones**: Todas las consultas incluyen el objeto completo de contactos relacionados
4. **Validaciones**: Los campos `cliente`, `detalleDireccion` y `esquema` son requeridos para crear
5. **Esquemas Válidos**: tqc, TALEX, BIOGEN, AGRAVENT
6. **Ordenamiento**: Los resultados se ordenan por cliente y nombre por defecto

### ⚠️ Cambios Recientes en la API

**Objeto Contacto Completo**: A partir de la versión actual, el endpoint devuelve el objeto completo de `Contacto` con todos sus campos, incluyendo:

-   `createdAt` y `updatedAt`: Fechas de creación y actualización
-   `clienteExactusId` y `clienteGestionCId`: IDs de relación con sistemas externos
-   `tipo`: Tipo de contacto
-   `createdBy`: ID del usuario que creó el contacto
-   `ubicacionId`: ID de la ubicación asociada

**Diferencias por Endpoint**:

| Endpoint                | Objeto Contacto  | Filtro Contactos | Campos Devueltos                                               |
| ----------------------- | ---------------- | ---------------- | -------------------------------------------------------------- |
| `GET /`                 | **Completo**     | Todos            | Todos los campos del modelo                                    |
| `GET /:id`              | **Seleccionado** | Todos            | id, nombre, apellido, cargo, email, celularA, celularB, activo |
| `GET /cliente/:code`    | **Seleccionado** | Solo activos     | id, nombre, apellido, cargo, email, celularA                   |
| `GET /esquema/:esquema` | **Seleccionado** | Solo activos     | id, nombre, apellido, cargo                                    |
| `GET /search/:term`     | **Seleccionado** | Solo activos     | id, nombre, apellido, cargo, email, celularA                   |
| `POST /`                | **Seleccionado** | Todos            | id, nombre, apellido, cargo, email, celularA                   |
| `PUT /:id`              | **Seleccionado** | Todos            | id, nombre, apellido, cargo, email, celularA                   |

---

## Orden de Rutas Recomendado

**⚠️ Importante**: En el archivo de rutas, las rutas más específicas deben ir antes que las genéricas para evitar conflictos:

```typescript
// ✅ Orden correcto
router.get('/stats/resumen', controller.getEstadisticas);
router.get('/cliente/:clienteCode', controller.getByCliente);
router.get('/esquema/:esquema', controller.getByEsquema);
router.get('/search/:term', controller.search);
router.get('/:id', controller.getById); // Esta debe ir al final
```

Este orden evita que rutas como `/stats/resumen` sean capturadas por `/:id`.
