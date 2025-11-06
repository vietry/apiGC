# API de Direcciones de Entrega - Documentación

Este documento describe los endpoints disponibles para consultar direcciones de entrega desde la base de datos Exactus usando Sequelize ORM.

## Esquemas Disponibles

Los siguientes esquemas están disponibles:

-   `tqc`
-   `TALEX`
-   `BIOGEN`
-   `AGRAVENT`

## Endpoints Disponibles

### 1. Obtener todas las direcciones de entrega (todos los esquemas)

```http
GET /api/direcciones-entrega/all
```

**Parámetros de consulta opcionales:**

-   `cliente` - Código del cliente para filtrar direcciones específicas

**Ejemplos:**

```bash
# Todas las direcciones de todos los esquemas
curl -X GET "http://localhost:3000/api/direcciones-entrega/all"

# Direcciones de un cliente específico en todos los esquemas
curl -X GET "http://localhost:3000/api/direcciones-entrega/all?cliente=CLI001"
```

**Respuesta exitosa:**

```json
{
    "success": true,
    "data": [
        {
            "DETALLE_DIRECCION": "DIR001",
            "CLIENTE": "CLI001",
            "NOMBRE": "Cliente Ejemplo S.A.",
            "CAMPO_5": "Dirección Principal",
            "CAMPO_6": "Lima",
            "CAMPO_7": "Perú",
            "CAMPO_8": "001",
            "CAMPO_1": "Principal",
            "CAMPO_2": "Oficina",
            "schema": "tqc"
        }
    ],
    "message": "15 direcciones de entrega encontradas en 4 esquemas"
}
```

### 2. Obtener direcciones por esquema específico

```http
GET /api/direcciones-entrega/:schema
```

**Parámetros:**

-   `schema` - Esquema de la base de datos (tqc, TALEX, BIOGEN, AGRAVENT)

**Ejemplo:**

```bash
curl -X GET "http://localhost:3000/api/direcciones-entrega/tqc"
```

**Respuesta exitosa:**

```json
{
    "success": true,
    "data": [
        {
            "DETALLE_DIRECCION": "DIR001",
            "CLIENTE": "CLI001",
            "NOMBRE": "Cliente Ejemplo S.A.",
            "CAMPO_5": "Dirección Principal",
            "CAMPO_6": "Lima",
            "CAMPO_7": "Perú",
            "CAMPO_8": "001",
            "CAMPO_1": "Principal",
            "CAMPO_2": "Oficina"
        }
    ],
    "message": "8 direcciones de entrega obtenidas del esquema tqc"
}
```

### 3. Obtener direcciones por cliente y esquema

```http
GET /api/direcciones-entrega/:schema/cliente/:clienteCode
```

**Parámetros:**

-   `schema` - Esquema de la base de datos
-   `clienteCode` - Código del cliente

**Ejemplo:**

```bash
curl -X GET "http://localhost:3000/api/direcciones-entrega/tqc/cliente/CLI001"
```

**Respuesta exitosa:**

```json
{
    "success": true,
    "data": [
        {
            "DETALLE_DIRECCION": "DIR001",
            "CLIENTE": "CLI001",
            "NOMBRE": "Cliente Ejemplo S.A.",
            "CAMPO_5": "Dirección Principal",
            "CAMPO_6": "Lima",
            "CAMPO_7": "Perú",
            "CAMPO_8": "001",
            "CAMPO_1": "Principal",
            "CAMPO_2": "Oficina"
        }
    ],
    "message": "2 direcciones de entrega encontradas para el cliente CLI001"
}
```

### 4. Obtener dirección específica por ID

```http
GET /api/direcciones-entrega/:schema/detalle/:detalleId
```

**Parámetros:**

-   `schema` - Esquema de la base de datos
-   `detalleId` - ID del detalle de dirección

**Ejemplo:**

```bash
curl -X GET "http://localhost:3000/api/direcciones-entrega/tqc/detalle/DIR001"
```

**Respuesta exitosa:**

```json
{
    "success": true,
    "data": {
        "DETALLE_DIRECCION": "DIR001",
        "CLIENTE": "CLI001",
        "NOMBRE": "Cliente Ejemplo S.A.",
        "CAMPO_5": "Dirección Principal",
        "CAMPO_6": "Lima",
        "CAMPO_7": "Perú",
        "CAMPO_8": "001",
        "CAMPO_1": "Principal",
        "CAMPO_2": "Oficina"
    },
    "message": "Dirección de entrega DIR001 obtenida exitosamente"
}
```

### 5. Obtener estadísticas por esquema

```http
GET /api/direcciones-entrega/:schema/estadisticas
```

**Parámetros:**

-   `schema` - Esquema de la base de datos

**Ejemplo:**

```bash
curl -X GET "http://localhost:3000/api/direcciones-entrega/tqc/estadisticas"
```

**Respuesta exitosa:**

```json
{
    "success": true,
    "data": {
        "totalDirecciones": 25,
        "totalClientes": 15,
        "promedioClienteDirecciones": 1.67
    },
    "message": "Estadísticas obtenidas exitosamente para el esquema tqc"
}
```

### 6. Obtener estadísticas consolidadas de todos los esquemas

```http
GET /api/direcciones-entrega/estadisticas/consolidadas
```

**Ejemplo:**

```bash
curl -X GET "http://localhost:3000/api/direcciones-entrega/estadisticas/consolidadas"
```

**Respuesta exitosa:**

```json
{
    "success": true,
    "data": {
        "totalGeneral": {
            "direcciones": 98,
            "clientes": 42,
            "promedio": 2.33
        },
        "porEsquema": {
            "tqc": {
                "totalDirecciones": 25,
                "totalClientes": 15,
                "promedioClienteDirecciones": 1.67
            },
            "TALEX": {
                "totalDirecciones": 30,
                "totalClientes": 12,
                "promedioClienteDirecciones": 2.5
            },
            "BIOGEN": {
                "totalDirecciones": 18,
                "totalClientes": 8,
                "promedioClienteDirecciones": 2.25
            },
            "AGRAVENT": {
                "totalDirecciones": 25,
                "totalClientes": 7,
                "promedioClienteDirecciones": 3.57
            }
        }
    },
    "message": "Estadísticas consolidadas obtenidas exitosamente"
}
```

## Estructura de Datos

### DireccionEntrega

```typescript
interface DireccionEntrega {
    DETALLE_DIRECCION: string; // ID único de la dirección
    CLIENTE: string; // Código del cliente
    NOMBRE: string; // Nombre del cliente
    CAMPO_5: string; // Campo personalizable 5
    CAMPO_6: string; // Campo personalizable 6
    CAMPO_7: string; // Campo personalizable 7
    CAMPO_8: string; // Campo personalizable 8
    CAMPO_1: string; // Campo personalizable 1
    CAMPO_2: string; // Campo personalizable 2
}
```

## Códigos de Respuesta

-   **200 OK** - Solicitud exitosa
-   **400 Bad Request** - Parámetros inválidos o faltantes
-   **404 Not Found** - Recurso no encontrado
-   **500 Internal Server Error** - Error interno del servidor

## Manejo de Errores

Todas las respuestas de error siguen el siguiente formato:

```json
{
    "success": false,
    "message": "Descripción del error",
    "error": "Detalles técnicos del error"
}
```

## Validaciones

1. **Schema**: Debe ser uno de los valores válidos (tqc, TALEX, BIOGEN, AGRAVENT)
2. **Cliente Code**: Debe ser una cadena no vacía cuando se requiere
3. **Detalle ID**: Debe ser una cadena no vacía cuando se requiere

## Notas Importantes

1. **Filtrado automático**: Solo se devuelven clientes activos (ACTIVO = 'S')
2. **Ordenamiento**: Los resultados se ordenan por nombre del cliente y luego por ID de dirección
3. **Tolerancia a fallos**: En las consultas consolidadas, si un esquema falla, continúa con los demás
4. **Logging**: Todos los errores se registran en los logs del servidor para debugging

## Ejemplos de Uso con JavaScript/Fetch

```javascript
// Obtener todas las direcciones
async function getAllDirecciones() {
    const response = await fetch('/api/direcciones-entrega/all');
    const data = await response.json();
    return data;
}

// Obtener direcciones por cliente
async function getDireccionesByCliente(schema, clienteCode) {
    const response = await fetch(
        `/api/direcciones-entrega/${schema}/cliente/${clienteCode}`
    );
    const data = await response.json();
    return data;
}

// Obtener estadísticas consolidadas
async function getEstadisticasConsolidadas() {
    const response = await fetch(
        '/api/direcciones-entrega/estadisticas/consolidadas'
    );
    const data = await response.json();
    return data;
}
```

## Testing

Para probar la API, puedes usar herramientas como:

-   **cURL** (ejemplos mostrados arriba)
-   **Postman**
-   **Thunder Client** (extensión de VS Code)
-   **Insomnia**

Asegúrate de que el servidor esté corriendo y la conexión a la base de datos Exactus esté configurada correctamente.
