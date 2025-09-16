# Guía de Endpoints – ClienteVendedor y TiendaCliente

Esta guía documenta los endpoints creados bajo el dominio visitas_gc:

-   Base ClienteVendedor: `/api/visitas-gc/cliente-vendedor`
-   Base TiendaCliente: `/api/visitas-gc/tiendas-cliente`

Incluye rutas, parámetros de consulta, cuerpos de solicitud, forma de respuesta, códigos de estado y ejemplos listos para usar en PowerShell/curl.

Notas generales:

-   Paginación estándar: `page` (por defecto 1), `limit` (por defecto 10).
-   Respuesta de listados: `{ page, pages, limit, total, items }`.
-   Errores: 400 (validación/datos no existentes), 500 (error interno). Creación responde 201.

---

## ClienteVendedor

Base: `/api/visitas-gc/cliente-vendedor`

Modelos fuente:

-   Exactus: solo lectura.
-   GC: lectura + creación + actualización.
-   Combinado: unión de Exactus y GC (solo lectura) con filtros comunes.

### GET /exactus

Lista ClienteVendedorExactus (solo lectura).

Query params:

-   `page`, `limit` – paginación.
-   Filtros comunes (coincidencia parcial): `codcli`, `nomcli`, `codven`, `nomvende`, `email`.
-   `activo` (booleano): true/false o 1/0.

Respuesta 200:

-   `{ page, pages, limit, total, items: ClienteVendedorExactus[] }`

Ejemplo (PowerShell):

```powershell
curl "http://localhost:3000/api/visitas-gc/cliente-vendedor/exactus?page=1&limit=10&codcli=ACME&activo=true"
```

### GET /exactus/:id

Obtiene un ClienteVendedorExactus por id.

Respuesta 200:

-   `ClienteVendedorExactus`

Errores:

-   400 si el id es inválido o el registro no existe.

Ejemplo:

```powershell
curl "http://localhost:3000/api/visitas-gc/cliente-vendedor/exactus/123"
```

### GET /gc

Lista ClienteVendedorGC.

Query params:

-   `page`, `limit` – paginación.
-   Filtros comunes (coincidencia parcial): `codcli`, `nomcli`, `codven`, `nomvende`, `email`.
-   `activo` (booleano).
-   `empresaId` (number) – igualdad exacta.

Respuesta 200:

-   `{ page, pages, limit, total, items: (ClienteVendedorGC & { Empresa })[] }`

Ejemplo:

```powershell
curl "http://localhost:3000/api/visitas-gc/cliente-vendedor/gc?page=1&limit=10&empresaId=1&codven=V001"
```

### GET /gc/:id

Obtiene un ClienteVendedorGC por id (incluye `Empresa`).

Respuesta 200: `ClienteVendedorGC` con `Empresa`.
Errores: 400 si no existe.

```powershell
curl "http://localhost:3000/api/visitas-gc/cliente-vendedor/gc/45"
```

### POST /gc

Crea un ClienteVendedorGC.

Body (JSON):

-   `empresaId` (number, requerido)
-   `codcli` (string, requerido)
-   `codven` (string, requerido)
-   `nomcli` (string | null, opcional)
-   `nomvende` (string | null, opcional)
-   `email` (string | null, opcional)
-   `activo` (boolean, opcional, por defecto true)
-   `createdBy` (number, requerido)

Códigos:

-   201 creado – devuelve el registro creado.
-   400 si falta un campo requerido o existe duplicado por (empresaId, codcli, codven).

Ejemplo:

```powershell
curl -X POST "http://localhost:3000/api/visitas-gc/cliente-vendedor/gc" ^
  -H "Content-Type: application/json" ^
  --data '{
    "empresaId": 1,
    "codcli": "ACM001",
    "codven": "V001",
    "nomcli": "ACME SA",
    "nomvende": "Juan Perez",
    "email": "jperez@acme.com",
    "activo": true,
    "createdBy": 10
  }'
```

### PUT /gc/:id

Actualiza un ClienteVendedorGC.

Body (JSON) – todos opcionales:

-   `empresaId` (number)
-   `codcli` (string)
-   `nomcli` (string | null)
-   `codven` (string)
-   `nomvende` (string | null)
-   `email` (string | null)
-   `activo` (boolean)
-   `updatedBy` (number | null)

Códigos:

-   200 actualizado – devuelve el registro actualizado.
-   400 si id inválido o no existe.

Ejemplo:

```powershell
curl -X PUT "http://localhost:3000/api/visitas-gc/cliente-vendedor/gc/45" ^
  -H "Content-Type: application/json" ^
  --data '{
    "nomvende": "Maria Lopez",
    "email": null,
    "activo": false,
    "updatedBy": 11
  }'
```

### GET /combined

Lista combinada de Exactus + GC (solo lectura) con filtros comunes.

Query params:

-   `page`, `limit` – paginación (se aplica tras combinar y ordenar en memoria).
-   Filtros comunes: `codcli`, `nomcli`, `codven`, `nomvende`, `email`, `activo`.

Respuesta 200:

-   `{ page, pages, limit, total, items }`, donde `items` tiene forma común:
    -   `source`: "exactus" | "gc"
    -   `id`: number
    -   `empresa`: string (para GC usa `Empresa.nomEmpresa` si existe)
    -   `codcli`, `nomcli`, `codven`, `nomvende`, `email`, `activo`
    -   `updatedAt`: fecha de última actualización

Ejemplo:

```powershell
curl "http://localhost:3000/api/visitas-gc/cliente-vendedor/combined?codcli=ACM&activo=1&limit=20"
```

---

## TiendaCliente

Base: `/api/visitas-gc/tiendas-cliente`

### GET /

Lista de TiendaCliente con filtros y paginación.

Query params:

-   `page`, `limit` – paginación.
-   `codcli` (string, contains)
-   `id_tda` (number, igualdad exacta)
-   `descrip` (string, contains)
-   `codsbz` (string, contains)
-   `direccion` (string, contains)
-   `debaja` (number, igualdad exacta)
-   `ubigeo` (string, contains)
-   `vigente` (booleano)
-   `editable` (booleano)

Orden: `updated_at` desc.

Incluye relaciones en `items`:

-   `ClienteVendedorGC` (con `Empresa`)
-   `Colaborador` (con `Usuario`)

Respuesta 200:

-   `{ page, pages, limit, total, items: (TiendaCliente & relaciones)[] }`

Ejemplo:

```powershell
curl "http://localhost:3000/api/visitas-gc/tiendas-cliente?page=1&limit=10&codcli=ACM&id_tda=100"
```

### GET /:id

Obtiene un TiendaCliente por id, incluyendo relaciones.

Códigos:

-   200 correcto.
-   400 si no existe.

```powershell
curl "http://localhost:3000/api/visitas-gc/tiendas-cliente/77"
```

### POST /

Crea un TiendaCliente.

Body (JSON):

-   `codcli` (string, requerido)
-   `id_tda` (number | null, opcional)
-   `descrip` (string | null, opcional)
-   `codsbz` (string | null, opcional)
-   `direccion` (string | null, opcional)
-   `debaja` (number | null, opcional)
-   `ubigeo` (string | null, opcional)
-   `observ` (string | null, opcional)
-   `vigente` (boolean, opcional, por defecto true)
-   `editable` (boolean, opcional, por defecto false)
-   `createdBy` (number | null, opcional)
-   `clienteVendedorId` (number | null, opcional)

Códigos:

-   201 creado.
-   400 si `codcli` no es válido.

Ejemplo:

```powershell
curl -X POST "http://localhost:3000/api/visitas-gc/tiendas-cliente" ^
  -H "Content-Type: application/json" ^
  --data '{
    "codcli": "ACM001",
    "id_tda": 100,
    "descrip": "Tienda Miraflores",
    "codsbz": "SBZ01",
    "direccion": "Av. Siempre Viva 123",
    "ubigeo": "150122",
    "vigente": true,
    "editable": false,
    "createdBy": 10,
    "clienteVendedorId": 45
  }'
```

### PUT /:id

Actualiza un TiendaCliente. Todos los campos son opcionales y los campos `string` aceptan `null` para limpiar el valor. Numéricos aceptan `null`.

Body (JSON) – opcionales:

-   `codcli` (string)
-   `id_tda` (number | null)
-   `descrip` (string | null)
-   `codsbz` (string | null)
-   `direccion` (string | null)
-   `debaja` (number | null)
-   `ubigeo` (string | null)
-   `observ` (string | null)
-   `vigente` (boolean)
-   `editable` (boolean)
-   `createdBy` (number | null)
-   `clienteVendedorId` (number | null)

Códigos:

-   200 actualizado.
-   400 si id inválido o no existe.

Ejemplo:

```powershell
curl -X PUT "http://localhost:3000/api/visitas-gc/tiendas-cliente/77" ^
  -H "Content-Type: application/json" ^
  --data '{
    "descrip": "Tienda San Isidro",
    "direccion": null,
    "vigente": false,
    "editable": true
  }'
```

---

## Ejemplo de respuesta de listado

```json
{
    "page": 1,
    "pages": 3,
    "limit": 10,
    "total": 25,
    "items": [{ "id": 1, "codcli": "ACM001", "...": "..." }]
}
```

## Consideraciones adicionales

-   Los filtros tipo texto usan coincidencia parcial (contains) salvo que se indique lo contrario.
-   En `/combined`, la paginación se aplica después de combinar y ordenar por `updatedAt` desc.
-   En `POST /gc`, se valida unicidad por `(empresaId, codcli, codven)`.
-   Las fechas y nombres de campos exactos de los modelos pueden variar según el esquema Prisma; la guía lista los campos utilizados por el servicio/controlador.
