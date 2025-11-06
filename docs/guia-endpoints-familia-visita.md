# Guía de endpoints: FamiliaVisita

Esta guía documenta los endpoints GET para consultar el catálogo `FamiliaVisita`.

-   Base path: `/api/familias-visita`
-   Métodos soportados: GET
-   Autenticación: No hay middleware específico en estas rutas (hereda configuración global de la app).

## Listar familias de visita

GET `/api/visitas-gc/familias-visita`

Parámetros de consulta (query):

-   `search` (string, opcional): Búsqueda por nombre, familia, línea, clasificación o proveedor.
-   `vigente` (boolean, opcional): Filtra por vigencia (true/false).
-   `agrupacion` (number, opcional): Filtra por código de agrupación (smallint en DB).
-   `esquema` (string, opcional): Filtra por esquema (por ejemplo: `tqc`, `TALEX`, `BIOGEN`, `AGRAVENT`).
-   `unidadMedida` (string, opcional): Filtra por unidad de medida.
-   `page` (number, opcional): Página (1-based). Si se envía junto con `limit`, se incluye metadato de paginación.
-   `limit` (number, opcional): Tamaño de página.

Notas:

-   La búsqueda (`search`) usa `contains` en SQL Server. La sensibilidad a mayúsculas/minúsculas depende del collation de la base de datos.
-   Si NO se especifican `page` y `limit`, la respuesta devuelve `{ total, data }` sin metadatos de paginación.

Ejemplos:

-   Listado simple: `/api/visitas-gc/familias-visita`
-   Búsqueda: `/api/visitas-gc/familias-visita?search=algarys`
-   Con filtros: `/api/visitas-gc/familias-visita?vigente=true&esquema=tqc&unidadMedida=UND`
-   Con paginación: `/api/visitas-gc/familias-visita?page=1&limit=20&search=algarys`

### Respuestas

Sin paginación:

```json
{
    "total": 123,
    "data": [
        {
            "id": 1,
            "familia": "F001",
            "nombre": "Algarys X",
            "agrupacion": 10,
            "unidadMedida": "UND",
            "linea": "Línea A",
            "clasificacion": "Clase 1",
            "proveedor": "Proveedor Z",
            "vigente": true,
            "esquema": "tqc",
            "createdAt": "2025-09-10T12:34:56.000Z",
            "updatedAt": "2025-09-12T09:10:11.000Z"
        }
    ]
}
```

Con paginación (`page` + `limit`):

```json
{
    "page": 1,
    "pages": 7,
    "limit": 20,
    "total": 130,
    "items": [
        {
            "id": 1,
            "familia": "F001",
            "nombre": "Algarys X",
            "agrupacion": 10,
            "unidadMedida": "UND",
            "linea": "Línea A",
            "clasificacion": "Clase 1",
            "proveedor": "Proveedor Z",
            "vigente": true,
            "esquema": "tqc",
            "createdAt": "2025-09-10T12:34:56.000Z",
            "updatedAt": "2025-09-12T09:10:11.000Z"
        }
    ]
}
```

Códigos de estado:

-   `200 OK`: Operación exitosa.
-   `500 Internal Server Error`: Error inesperado del servidor.

## Obtener familia de visita por ID

GET `/api/visitas-gc/familias-visita/:id`

Parámetros de ruta:

-   `id` (number, requerido): Identificador de `FamiliaVisita`.

Ejemplos:

-   `/api/visitas-gc/familias-visita/15`

### Respuestas

Éxito:

```json
{
    "id": 15,
    "familia": "F015",
    "nombre": "Producto Ejemplo",
    "agrupacion": 10,
    "unidadMedida": "UND",
    "linea": "Línea B",
    "clasificacion": "Clase 2",
    "proveedor": "Proveedor X",
    "vigente": true,
    "esquema": "BIOGEN",
    "createdAt": "2025-09-10T12:34:56.000Z",
    "updatedAt": "2025-09-12T09:10:11.000Z"
}
```

Errores:

-   `400 Bad Request`: ID inválido.
-   `400 Bad Request`: Si el ID no existe, el servicio devuelve error semántico con mensaje `FamiliaVisita with id {id} does not exist`.
-   `500 Internal Server Error`: Error inesperado del servidor.

## Ejemplos (opcional)

PowerShell (Windows):

```powershell
# Listado con búsqueda y paginación
curl -X GET "http://localhost:3000/api/visitas-gc/familias-visita?search=algarys&page=1&limit=20"

# Obtener por ID
curl -X GET "http://localhost:3000/api/visitas-gc/familias-visita/15"
```

## Notas y buenas prácticas

-   Mantener `page` ≥ 1 y `limit` ≥ 1. Si no se envían, no habrá metadatos de paginación.
-   La búsqueda depende del collation de SQL Server para manejar mayúsculas/minúsculas.
-   Orden por defecto: `nombre` ascendente.
-   Campos de filtro disponibles en DB para `FamiliaVisita` (según `schema.prisma`): `familia`, `nombre`, `agrupacion`, `unidadMedida`, `linea`, `clasificacion`, `proveedor`, `vigente`, `esquema`, `createdAt`, `updatedAt`.

## Cambios recientes

-   Se añadió el módulo `visitas_gc` con `service`, `controller` y `routes` para `FamiliaVisita`.
-   Se estandarizó la paginación a `page`/`limit` (convertidos internamente a `skip`/`take`).
-   Se retiró `mode: 'insensitive'` en filtros `contains` por compatibilidad con SQL Server/Prisma.
