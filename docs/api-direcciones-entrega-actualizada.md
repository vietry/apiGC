# API de Direcciones de Entrega - Guía Actualizada

## 📋 Resumen

La API de direcciones de entrega proporciona endpoints para consultar direcciones de entrega desde múltiples esquemas de base de datos (tqc, TALEX, BIOGEN, AGRAVENT). Con las últimas actualizaciones, los campos han sido renombrados para mayor claridad semántica.

## 🔄 Actualizaciones Recientes

### Cambios en la Estructura de Datos

Los siguientes campos han sido actualizados para mayor claridad:

| Campo Anterior | Campo Nuevo    | Descripción             |
| -------------- | -------------- | ----------------------- |
| `CAMPO_1`      | `direccion`    | Dirección completa      |
| `CAMPO_5`      | `ubigeoId`     | Código de ubigeo        |
| `CAMPO_6`      | `departamento` | Nombre del departamento |
| `CAMPO_7`      | `provincia`    | Nombre de la provincia  |
| `CAMPO_8`      | `distrito`     | Nombre del distrito     |

### Estructura de Respuesta Actualizada

```json
{
    "success": true,
    "data": [
        {
            "DETALLE_DIRECCION": "DIR001",
            "CLIENTE": "CLI001",
            "NOMBRE": "Empresa XYZ S.A.C.",
            "ubigeoId": "150101",
            "departamento": "Lima",
            "provincia": "Lima",
            "distrito": "Lima",
            "direccion": "Av. Javier Prado Este 123",
            "CAMPO_2": "Referencia adicional",
            "schema": "tqc"
        }
    ],
    "message": "10 direcciones de entrega obtenidas del esquema tqc"
}
```

## 🚀 Endpoints Disponibles

### 1. Obtener Direcciones por Esquema

**GET** `/api/direcciones-entrega/:schema`

Obtiene todas las direcciones de entrega de un esquema específico.

#### Parámetros

-   `schema` (path): Esquema de la base de datos
    -   Valores válidos: `tqc`, `TALEX`, `BIOGEN`, `AGRAVENT`
    -   No sensible a mayúsculas/minúsculas

#### Query Parameters (Opcionales)

-   `search` (string): Término de búsqueda para filtrar por código de cliente o nombre

#### Ejemplos

```bash
# Obtener todas las direcciones del esquema TQC
GET /api/direcciones-entrega/tqc

# Buscar direcciones que contengan "ACME" en el esquema TALEX
GET /api/direcciones-entrega/talex?search=ACME
```

#### Respuesta de Éxito (200)

```json
{
    "success": true,
    "data": [
        {
            "DETALLE_DIRECCION": "DIR001",
            "CLIENTE": "CLI001",
            "NOMBRE": "ACME Corporation",
            "ubigeoId": "150101",
            "departamento": "Lima",
            "provincia": "Lima",
            "distrito": "Lima",
            "direccion": "Av. Javier Prado Este 123",
            "CAMPO_2": "Oficina principal"
        }
    ],
    "message": "15 direcciones de entrega obtenidas del esquema tqc"
}
```

---

### 2. Obtener Direcciones por Cliente

**GET** `/api/direcciones-entrega/:schema/cliente/:clienteCode`

Obtiene todas las direcciones de entrega de un cliente específico en un esquema.

#### Parámetros

-   `schema` (path): Esquema de la base de datos
-   `clienteCode` (path): Código del cliente

#### Ejemplo

```bash
GET /api/direcciones-entrega/tqc/cliente/CLI001
```

#### Respuesta de Éxito (200)

```json
{
    "success": true,
    "data": [
        {
            "DETALLE_DIRECCION": 7698,
            "CLIENTE": "20104860762",
            "NOMBRE": "AUTOSERVICIO SAN ISIDRO S.A.",
            "ubigeoId": "110201",
            "departamento": "Ica",
            "provincia": "Chincha",
            "distrito": "Chincha Alta",
            "direccion": "AV.MARISCAL CASTILLA 450 CHINCHA",
            "CAMPO_2": "ICA"
        },
        {
            "DETALLE_DIRECCION": 7699,
            "CLIENTE": "20104860762",
            "NOMBRE": "AUTOSERVICIO SAN ISIDRO S.A.",
            "ubigeoId": "110201",
            "departamento": "Ica",
            "provincia": "Chincha",
            "distrito": "Chincha Alta",
            "direccion": "AV. MARISCAL RAMON CASTILLA Nº 450 CHINCHA",
            "CAMPO_2": null
        }
    ],
    "message": "2 direcciones de entrega encontradas para el cliente CLI001"
}
```

---

### 3. Buscar en Todos los Esquemas

**GET** `/api/direcciones-entrega/all`

Busca direcciones de entrega en todos los esquemas disponibles.

#### Query Parameters (Opcionales)

-   `cliente` (string): Código del cliente específico
-   `search` (string): Término de búsqueda para filtrar por código de cliente o nombre

#### Ejemplos

```bash
# Obtener todas las direcciones de todos los esquemas
GET /api/direcciones-entrega/all

# Buscar por cliente específico en todos los esquemas
GET /api/direcciones-entrega/all?cliente=CLI001

# Buscar por término en todos los esquemas
GET /api/direcciones-entrega/all?search=ACME

# Combinar cliente y búsqueda
GET /api/direcciones-entrega/all?cliente=CLI001&search=principal
```

#### Respuesta de Éxito (200)

```json
{
    "success": true,
    "data": [
        {
            "DETALLE_DIRECCION": "DIR001",
            "CLIENTE": "CLI001",
            "NOMBRE": "ACME Corporation",
            "ubigeoId": "150101",
            "departamento": "Lima",
            "provincia": "Lima",
            "distrito": "Lima",
            "direccion": "Av. Javier Prado Este 123",
            "CAMPO_2": "Sede principal",
            "schema": "tqc"
        },
        {
            "DETALLE_DIRECCION": "DIR003",
            "CLIENTE": "CLI001",
            "NOMBRE": "ACME Corporation",
            "ubigeoId": "070101",
            "departamento": "Callao",
            "provincia": "Callao",
            "distrito": "Callao",
            "direccion": "Av. Colonial 789",
            "CAMPO_2": "Almacén",
            "schema": "TALEX"
        }
    ],
    "message": "25 direcciones de entrega encontradas en 4 esquemas"
}
```

---

### 4. Obtener Dirección por ID

**GET** `/api/direcciones-entrega/:schema/detalle/:detalleId`

Obtiene una dirección de entrega específica por su ID de detalle.

#### Parámetros

-   `schema` (path): Esquema de la base de datos
-   `detalleId` (path): ID del detalle de dirección

#### Ejemplo

```bash
GET /api/direcciones-entrega/tqc/detalle/DIR001
```

#### Respuesta de Éxito (200)

```json
{
    "success": true,
    "data": {
        "DETALLE_DIRECCION": "DIR001",
        "CLIENTE": "CLI001",
        "NOMBRE": "ACME Corporation",
        "ubigeoId": "150101",
        "departamento": "Lima",
        "provincia": "Lima",
        "distrito": "Lima",
        "direccion": "Av. Javier Prado Este 123",
        "CAMPO_2": "Oficina principal"
    },
    "message": "Dirección de entrega DIR001 obtenida exitosamente"
}
```

---

### 5. Estadísticas por Esquema

**GET** `/api/direcciones-entrega/:schema/estadisticas`

Obtiene estadísticas de direcciones de entrega para un esquema específico.

#### Parámetros

-   `schema` (path): Esquema de la base de datos

#### Ejemplo

```bash
GET /api/direcciones-entrega/tqc/estadisticas
```

#### Respuesta de Éxito (200)

```json
{
    "success": true,
    "data": {
        "totalDirecciones": 150,
        "totalClientes": 45,
        "promedioClienteDirecciones": 3.33
    },
    "message": "Estadísticas obtenidas exitosamente para el esquema tqc"
}
```

---

### 6. Estadísticas Consolidadas

**GET** `/api/direcciones-entrega/estadisticas/consolidadas`

Obtiene estadísticas consolidadas de todos los esquemas.

#### Ejemplo

```bash
GET /api/direcciones-entrega/estadisticas/consolidadas
```

#### Respuesta de Éxito (200)

```json
{
    "success": true,
    "data": {
        "totalGeneral": {
            "direcciones": 584,
            "clientes": 162,
            "promedio": 3.6
        },
        "porEsquema": {
            "tqc": {
                "totalDirecciones": 150,
                "totalClientes": 45,
                "promedioClienteDirecciones": 3.33
            },
            "TALEX": {
                "totalDirecciones": 234,
                "totalClientes": 67,
                "promedioClienteDirecciones": 3.49
            },
            "BIOGEN": {
                "totalDirecciones": 120,
                "totalClientes": 30,
                "promedioClienteDirecciones": 4.0
            },
            "AGRAVENT": {
                "totalDirecciones": 80,
                "totalClientes": 20,
                "promedioClienteDirecciones": 4.0
            }
        }
    },
    "message": "Estadísticas consolidadas obtenidas exitosamente"
}
```

## ❌ Respuestas de Error

### Error 400 - Bad Request

```json
{
    "success": false,
    "message": "Schema no válido. Debe ser: tqc, TALEX, BIOGEN o AGRAVENT (no sensible a mayúsculas)"
}
```

### Error 404 - Not Found

```json
{
    "success": false,
    "message": "No se encontraron direcciones de entrega para el cliente CLI999 en el esquema tqc"
}
```

### Error 500 - Internal Server Error

```json
{
    "success": false,
    "error": "Error interno del servidor",
    "message": "Database connection failed"
}
```

## 🔧 Esquemas Disponibles

| Esquema    | Descripción      | Estado    |
| ---------- | ---------------- | --------- |
| `tqc`      | Sistema TQC      | ✅ Activo |
| `TALEX`    | Sistema TALEX    | ✅ Activo |
| `BIOGEN`   | Sistema BIOGEN   | ✅ Activo |
| `AGRAVENT` | Sistema AGRAVENT | ✅ Activo |

## 📝 Notas Importantes

1. **Sensibilidad a Mayúsculas**: Los nombres de esquemas no son sensibles a mayúsculas/minúsculas en la URL
2. **Filtros de Búsqueda**: El parámetro `search` busca coincidencias parciales en código de cliente y nombre
3. **Clientes Activos**: Solo se devuelven direcciones de clientes con estado `ACTIVO = 'S'`
4. **Paginación**: Actualmente no implementada, se devuelven todos los resultados
5. **Ordenamiento**: Los resultados se ordenan por nombre de cliente y ID de dirección

## 🚀 Casos de Uso Comunes

### Buscar Direcciones de un Cliente en Todos los Sistemas

```bash
GET /api/direcciones-entrega/all?cliente=CLI001
```

### Buscar Direcciones por Ubicación

```bash
GET /api/direcciones-entrega/all?search=Lima
```

### Obtener Estadísticas Generales

```bash
GET /api/direcciones-entrega/estadisticas/consolidadas
```

### Verificar Direcciones de un Esquema Específico

```bash
GET /api/direcciones-entrega/tqc?search=corporacion
```

## 🔍 Campos de Respuesta

| Campo               | Tipo   | Descripción                                        |
| ------------------- | ------ | -------------------------------------------------- |
| `DETALLE_DIRECCION` | string | ID único de la dirección                           |
| `CLIENTE`           | string | Código del cliente                                 |
| `NOMBRE`            | string | Nombre/razón social del cliente                    |
| `ubigeoId`          | string | Código de ubigeo (anteriormente CAMPO_5)           |
| `departamento`      | string | Nombre del departamento (anteriormente CAMPO_6)    |
| `provincia`         | string | Nombre de la provincia (anteriormente CAMPO_7)     |
| `distrito`          | string | Nombre del distrito (anteriormente CAMPO_8)        |
| `direccion`         | string | Dirección completa (anteriormente CAMPO_1)         |
| `CAMPO_2`           | string | Campo adicional de referencia                      |
| `schema`            | string | Esquema de origen (solo en búsquedas consolidadas) |
