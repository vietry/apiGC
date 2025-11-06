# API Endpoints - Cliente Vendedor

## Descripción General

El módulo de Cliente-Vendedor maneja la relación entre clientes y vendedores tanto desde la base de datos Exactus (solo lectura) como desde la base de datos GC (lectura y escritura). También proporciona una vista combinada de ambas fuentes.

**Base URL:** `/api/cliente-vendedor`

## Tipos de Datos

### ClienteVendedorCommonFilters

```typescript
{
  codcli?: string;        // Código del cliente
  nomcli?: string;        // Nombre del cliente
  codven?: string;        // Código del vendedor
  nomvende?: string;      // Nombre del vendedor
  email?: string;         // Email
  activo?: boolean;       // Estado activo/inactivo
}
```

### Respuesta Paginada

```typescript
{
    page: number; // Página actual
    pages: number; // Total de páginas
    limit: number; // Elementos por página
    total: number; // Total de elementos
    items: Array<any>; // Elementos de la página actual
}
```

## Endpoints Exactus (Solo Lectura)

### GET /api/cliente-vendedor/exactus

Obtiene todos los registros de cliente-vendedor desde Exactus con paginación y filtros.

**Query Parameters:**

- `page` (number, default: 1): Número de página
- `limit` (number, default: 10): Elementos por página
- `codcli` (string, opcional): Filtro por código de cliente
- `nomcli` (string, opcional): Filtro por nombre de cliente
- `codven` (string, opcional): Filtro por código de vendedor
- `nomvende` (string, opcional): Filtro por nombre de vendedor
- `email` (string, opcional): Filtro por email
- `activo` (boolean, opcional): Filtro por estado activo (true/false, 1/0)

**Ejemplo de Request:**

```
GET /api/cliente-vendedor/exactus?page=1&limit=20&codcli=CLI001&activo=true
```

**Ejemplo de Response:**

```json
{
    "page": 1,
    "pages": 5,
    "limit": 20,
    "total": 95,
    "items": [
        {
            "id": 1,
            "empresa": "06",
            "codcli": "07246026",
            "nomcli": "HERNANDEZ ZIEGLER JORGE GUILLERMO",
            "codven": "004",
            "nomvende": "Huanuco-Pucallpa/C.Matos",
            "email": "cmatos@talex.com.pe",
            "activo": true,
            "updatedAt": "2025-09-17T10:30:00Z"
        }
    ]
}
```

### GET /api/cliente-vendedor/exactus/:id

Obtiene un registro específico de cliente-vendedor desde Exactus por ID.

**Path Parameters:**

- `id` (number): ID del registro

**Ejemplo de Request:**

```
GET /api/cliente-vendedor/exactus/123
```

**Ejemplo de Response:**

```json
{
    "id": 123,
    "empresa": "01",
    "codcli": "20514298425",
    "nomcli": "ALMAFER & CIA S.A.C",
    "codven": "83",
    "nomvende": "(RT) Lima-Huaral/MGiu",
    "email": "mgiu@tqc.com.pe, recursoshumanos@tqc.com.pe",
    "activo": true,
    "updatedAt": "2025-09-17T10:30:00Z"
}
```

## Endpoints GC (Lectura y Escritura)

### GET /api/cliente-vendedor/gc

Obtiene todos los registros de cliente-vendedor desde GC con paginación y filtros.

**Query Parameters:**

- `page` (number, default: 1): Número de página
- `limit` (number, default: 10): Elementos por página
- `codcli` (string, opcional): Filtro por código de cliente
- `nomcli` (string, opcional): Filtro por nombre de cliente
- `codven` (string, opcional): Filtro por código de vendedor
- `nomvende` (string, opcional): Filtro por nombre de vendedor
- `email` (string, opcional): Filtro por email
- `activo` (boolean, opcional): Filtro por estado activo
- `empresaId` (number, opcional): Filtro por ID de empresa

**Ejemplo de Request:**

```
GET /api/cliente-vendedor/gc?page=1&limit=15&empresaId=5&activo=true
```

**Ejemplo de Response:**

```json
{
    "page": 1,
    "pages": 3,
    "limit": 15,
    "total": 42,
    "items": [
        {
            "id": 1,
            "empresaId": 1,
            "codcli": "20487402355",
            "nomcli": "CORPORACION AGRICOLA RODAS S.A.C.",
            "codven": "102",
            "nomvende": "(RT) Chiclayo-Chepen/Jcornejo",
            "email": "jcornejo@tqc.com.pe",
            "activo": true,
            "createdBy": 1,
            "updatedAt": "2025-09-17T11:00:00Z",
            "Empresa": {
                "id": 1,
                "nomEmpresa": "TQC"
            }
        }
    ]
}
```

### GET /api/cliente-vendedor/gc/:id

Obtiene un registro específico de cliente-vendedor desde GC por ID.

**Path Parameters:**

- `id` (number): ID del registro

**Ejemplo de Request:**

```
GET /api/cliente-vendedor/gc/456
```

**Ejemplo de Response:**

```json
{
    "id": 456,
    "empresaId": 1,
    "codcli": "20487402355",
    "nomcli": "CORPORACION AGRICOLA RODAS S.A.C.",
    "codven": "102",
    "nomvende": "(RT) Chiclayo-Chepen/Jcornejo",
    "email": "jcornejo@tqc.com.pe",
    "activo": true,
    "createdBy": 1,
    "updatedAt": "2025-09-17T11:00:00Z",
    "Empresa": {
        "id": 1,
        "nomEmpresa": "TQC"
    }
}
```

### POST /api/cliente-vendedor/gc

Crea un nuevo registro de cliente-vendedor en GC.

**Request Body:**

```json
{
    "empresaId": 5,
    "codcli": "CLI003",
    "nomcli": "Nuevo Cliente",
    "codven": "VEN003",
    "nomvende": "Nuevo Vendedor",
    "email": "nuevo@ejemplo.com",
    "activo": true,
    "createdBy": 1
}
```

**Campos Requeridos:**

- `empresaId` (number): ID de la empresa
- `codcli` (string): Código del cliente
- `codven` (string): Código del vendedor
- `activo` (boolean): Estado activo
- `createdBy` (number): ID del usuario que crea el registro

**Campos Opcionales:**

- `nomcli` (string|null): Nombre del cliente
- `nomvende` (string|null): Nombre del vendedor
- `email` (string|null): Email

**Restricciones:**

- La combinación `empresaId + codcli + codven` debe ser única

**Ejemplo de Response (201 Created):**

```json
{
    "id": 789,
    "empresaId": 5,
    "codcli": "CLI003",
    "nomcli": "Nuevo Cliente",
    "codven": "VEN003",
    "nomvende": "Nuevo Vendedor",
    "email": "nuevo@ejemplo.com",
    "activo": true,
    "createdBy": 1,
    "createdAt": "2025-09-17T12:00:00Z",
    "updatedAt": "2025-09-17T12:00:00Z"
}
```

### PUT /api/cliente-vendedor/gc/:id

Actualiza un registro existente de cliente-vendedor en GC.

**Path Parameters:**

- `id` (number): ID del registro a actualizar

**Request Body (campos opcionales):**

```json
{
    "nomcli": "Cliente Actualizado",
    "nomvende": "Vendedor Actualizado",
    "email": "actualizado@ejemplo.com",
    "activo": false
}
```

**Ejemplo de Response:**

```json
{
    "id": 789,
    "empresaId": 5,
    "codcli": "CLI003",
    "nomcli": "Cliente Actualizado",
    "codven": "VEN003",
    "nomvende": "Vendedor Actualizado",
    "email": "actualizado@ejemplo.com",
    "activo": false,
    "createdBy": 1,
    "updatedAt": "2025-09-17T12:30:00Z"
}
```

## Endpoint Combinado (Solo Lectura)

### GET /api/cliente-vendedor/combined

Obtiene registros combinados de cliente-vendedor desde ambas fuentes (Exactus y GC) con paginación y filtros.

**Query Parameters:**

- `page` (number, default: 1): Número de página
- `limit` (number, default: 10): Elementos por página
- `codcli` (string, opcional): Filtro por código de cliente
- `nomcli` (string, opcional): Filtro por nombre de cliente
- `codven` (string, opcional): Filtro por código de vendedor
- `nomvende` (string, opcional): Filtro por nombre de vendedor
- `email` (string, opcional): Filtro por email
- `activo` (boolean, opcional): Filtro por estado activo

**Ejemplo de Request:**

```
GET /api/cliente-vendedor/combined?page=1&limit=25&nomcli=ejemplo
```

**Ejemplo de Response:**

```json
{
    "page": 1,
    "pages": 4,
    "limit": 25,
    "total": 87,
    "items": [
        {
            "source": "exactus",
            "id": 1,
            "empresa": "Empresa ABC",
            "codcli": "CLI001",
            "nomcli": "Cliente Ejemplo",
            "codven": "VEN001",
            "nomvende": "Vendedor Ejemplo",
            "email": "cliente@ejemplo.com",
            "activo": true,
            "updatedAt": "2025-09-17T10:30:00Z"
        },
        {
            "source": "gc",
            "id": 1,
            "empresa": "Empresa GC",
            "codcli": "CLI002",
            "nomcli": "Cliente GC Ejemplo",
            "codven": "VEN002",
            "nomvende": "Vendedor GC",
            "email": "clientegc@ejemplo.com",
            "activo": true,
            "updatedAt": "2025-09-17T11:00:00Z"
        }
    ]
}
```

**Nota:** El campo `source` indica de qué base de datos proviene cada registro (`"exactus"` o `"gc"`).

## Códigos de Error

### 400 Bad Request

- ID inválido
- Parámetros de paginación inválidos
- Datos de entrada inválidos
- Violación de restricción única (al crear)

### 404 Not Found

- Registro no encontrado

### 500 Internal Server Error

- Error interno del servidor
- Error de base de datos

## Ejemplos de Uso

### Buscar clientes por vendedor específico

```bash
GET /api/cliente-vendedor/combined?codven=VEN001&page=1&limit=50
```

### Obtener solo clientes activos de una empresa específica

```bash
GET /api/cliente-vendedor/gc?empresaId=5&activo=true
```

### Crear nueva relación cliente-vendedor

```bash
POST /api/cliente-vendedor/gc
Content-Type: application/json

{
  "empresaId": 3,
  "codcli": "CLI999",
  "nomcli": "Cliente Nuevo",
  "codven": "VEN999",
  "nomvende": "Vendedor Nuevo",
  "email": "contacto@clientenuevo.com",
  "activo": true,
  "createdBy": 1
}
```

### Desactivar una relación cliente-vendedor

```bash
PUT /api/cliente-vendedor/gc/123
Content-Type: application/json

{
  "activo": false
}
```

## Notas Importantes

1. **Exactus** es una fuente de datos de solo lectura
2. **GC** permite operaciones CRUD completas
3. El endpoint **combined** mezcla datos de ambas fuentes y los ordena por fecha de actualización
4. Los filtros se aplican usando `contains` para campos de texto
5. La paginación se realiza en memoria para el endpoint combined
6. Todos los endpoints manejan errores de manera consistente
