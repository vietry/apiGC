# API Endpoints - Contactos

Esta guía documenta los endpoints disponibles para la gestión de contactos en el sistema.

## Base URL

```
/contacto
```

## Endpoints Disponibles

### 1. Obtener Todos los Contactos

**GET** `/contacto`

Obtiene una lista paginada de contactos con filtros opcionales.

#### Query Parameters

| Parámetro           | Tipo    | Requerido | Default | Descripción                               |
| ------------------- | ------- | --------- | ------- | ----------------------------------------- |
| `page`              | number  | No        | 1       | Número de página                          |
| `limit`             | number  | No        | 10      | Cantidad de elementos por página          |
| `nombre`            | string  | No        | -       | Filtro por nombre (búsqueda parcial)      |
| `apellido`          | string  | No        | -       | Filtro por apellido (búsqueda parcial)    |
| `cargo`             | string  | No        | -       | Filtro por cargo (búsqueda parcial)       |
| `email`             | string  | No        | -       | Filtro por email (búsqueda parcial)       |
| `celularA`          | string  | No        | -       | Filtro por celular A (búsqueda parcial)   |
| `celularB`          | string  | No        | -       | Filtro por celular B (búsqueda parcial)   |
| `activo`            | boolean | No        | -       | Filtro por estado activo (true/false/1/0) |
| `clienteExactusId`  | number  | No        | -       | Filtro por ID de cliente Exactus          |
| `clienteGestionCId` | number  | No        | -       | Filtro por ID de cliente GestionC         |
| `tipo`              | string  | No        | -       | Filtro por tipo (búsqueda parcial)        |
| `createdBy`         | number  | No        | -       | Filtro por ID del usuario creador         |

Nota: `clienteExactusId` y `clienteGestionCId` son mutuamente excluyentes a nivel de entidad. Como filtros, si envías ambos simultáneamente, se aplicará un AND que normalmente retornará 0 resultados.

#### Ejemplo de Request

```http
GET /contacto?page=1&limit=10&nombre=Juan&activo=true
```

#### Response

```json
{
    "page": 1,
    "pages": 5,
    "limit": 10,
    "total": 45,
    "items": [
        {
            "id": 1,
            "nombre": "Juan",
            "apellido": "Pérez",
            "cargo": "Gerente",
            "email": "juan.perez@email.com",
            "celularA": "88887777",
            "celularB": null,
            "activo": true,
            "clienteExactusId": null,
            "clienteGestionCId": 456,
            "tipo": "Principal",
            "createdBy": 1,
            "createdAt": "2024-01-15T10:30:00Z",
            "updatedAt": "2024-01-15T10:30:00Z",
            "ClienteVendedorExactus": null,
            "ClienteVendedorGC": {
                "Empresa": {
                    /* datos de la empresa */
                }
            },
            "Colaborador": {
                "Usuario": {
                    /* datos del usuario */
                }
            }
        }
    ]
}
```

---

### 2. Obtener Contacto por ID

**GET** `/contacto/:id`

Obtiene un contacto específico por su ID.

#### Path Parameters

| Parámetro | Tipo   | Requerido | Descripción     |
| --------- | ------ | --------- | --------------- |
| `id`      | number | Sí        | ID del contacto |

#### Ejemplo de Request

```http
GET /contacto/123
```

#### Response

```json
{
    "id": 123,
    "nombre": "María",
    "apellido": "García",
    "cargo": "Asistente",
    "email": "maria.garcia@email.com",
    "celularA": "99998888",
    "celularB": "77776666",
    "activo": true,
    "clienteExactusId": 789,
    "clienteGestionCId": null,
    "tipo": "Secundario",
    "createdBy": 2,
    "createdAt": "2024-01-20T14:45:00Z",
    "updatedAt": "2024-01-22T09:15:00Z",
    "ClienteVendedorExactus": {
        /* datos del cliente exactus */
    },
    "ClienteVendedorGC": null,
    "Colaborador": {
        "Usuario": {
            /* datos del usuario */
        }
    }
}
```

#### Errores Posibles

-   **400 Bad Request**: ID inválido o contacto no existe
-   **500 Internal Server Error**: Error interno del servidor

---

### 3. Crear Nuevo Contacto

**POST** `/contacto`

Crea un nuevo contacto en el sistema.

#### Request Body

| Campo               | Tipo    | Requerido | Descripción                                                            |
| ------------------- | ------- | --------- | ---------------------------------------------------------------------- |
| `nombre`            | string  | Sí        | Nombre del contacto                                                    |
| `apellido`          | string  | Sí        | Apellido del contacto                                                  |
| `cargo`             | string  | Sí        | Cargo del contacto                                                     |
| `email`             | string  | No        | Email del contacto                                                     |
| `celularA`          | string  | No        | Teléfono celular principal                                             |
| `celularB`          | string  | No        | Teléfono celular secundario                                            |
| `activo`            | boolean | No        | Estado activo (default: true)                                          |
| `clienteExactusId`  | number  | Cond.     | Obligatorio si NO se envía `clienteGestionCId` (mutuamente excluyente) |
| `clienteGestionCId` | number  | Cond.     | Obligatorio si NO se envía `clienteExactusId` (mutuamente excluyente)  |
| `tipo`              | string  | No        | Tipo de contacto                                                       |
| `createdBy`         | number  | No        | ID del usuario creador                                                 |

#### Ejemplo de Request

```http
POST /contacto
Content-Type: application/json

{
    "nombre": "Carlos",
    "apellido": "López",
    "cargo": "Director",
    "email": "carlos.lopez@empresa.com",
    "celularA": "88889999",
    "celularB": "77778888",
    "activo": true,
    "clienteGestionCId": 666,
    "tipo": "Principal",
    "createdBy": 3
}
```

#### Response

```json
{
    "id": 124,
    "nombre": "Carlos",
    "apellido": "López",
    "cargo": "Director",
    "email": "carlos.lopez@empresa.com",
    "celularA": "88889999",
    "celularB": "77778888",
    "activo": true,
    "clienteExactusId": null,
    "clienteGestionCId": 666,
    "tipo": "Principal",
    "createdBy": 3,
    "createdAt": "2024-01-25T16:20:00Z",
    "updatedAt": "2024-01-25T16:20:00Z"
}
```

#### Errores de Validación

-   **400 Bad Request**:
    -   "nombre es requerido"
    -   "apellido es requerido"
    -   "cargo es requerido"
    -   "Debe enviar únicamente uno de 'clienteExactusId' o 'clienteGestionCId'"
    -   "clienteExactusId debe ser numérico cuando se envía"
    -   "clienteGestionCId debe ser numérico cuando se envía"
    -   "createdBy debe ser numérico si se envía"

---

### 4. Actualizar Contacto

**PUT** `/contacto/:id`

Actualiza un contacto existente.

#### Path Parameters

| Parámetro | Tipo   | Requerido | Descripción                  |
| --------- | ------ | --------- | ---------------------------- |
| `id`      | number | Sí        | ID del contacto a actualizar |

#### Request Body

Todos los campos son opcionales en la actualización:

| Campo               | Tipo         | Descripción                                                                                                                |
| ------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `nombre`            | string       | Nombre del contacto                                                                                                        |
| `apellido`          | string       | Apellido del contacto                                                                                                      |
| `cargo`             | string       | Cargo del contacto                                                                                                         |
| `email`             | string\|null | Email del contacto                                                                                                         |
| `celularA`          | string\|null | Teléfono celular principal                                                                                                 |
| `celularB`          | string\|null | Teléfono celular secundario                                                                                                |
| `activo`            | boolean      | Estado activo                                                                                                              |
| `clienteExactusId`  | number       | ID del cliente en Exactus                                                                                                  |
| `clienteGestionCId` | number       | ID del cliente en GestionC. Mutuamente excluyente con `clienteExactusId`. Si se establece uno, el otro debe quedar `null`. |
| `tipo`              | string\|null | Tipo de contacto                                                                                                           |
| `createdBy`         | number\|null | ID del usuario creador                                                                                                     |

#### Ejemplo de Request

```http
PUT /contacto/124
Content-Type: application/json

{
  "cargo": "Director General",
  "email": "carlos.lopez.director@empresa.com",
  "activo": true
}
```

#### Response

```json
{
    "id": 124,
    "nombre": "Carlos",
    "apellido": "López",
    "cargo": "Director General",
    "email": "carlos.lopez.director@empresa.com",
    "celularA": "88889999",
    "celularB": "77778888",
    "activo": true,
    "clienteExactusId": 555,
    "clienteGestionCId": null,
    "tipo": "Principal",
    "createdBy": 3,
    "createdAt": "2024-01-25T16:20:00Z",
    "updatedAt": "2024-01-25T18:30:00Z"
}
```

#### Errores Posibles

-   **400 Bad Request**:
    -   "id inválido"
    -   "Contacto {id} no existe"
    -   "No puede establecer a la vez 'clienteExactusId' y 'clienteGestionCId'"
-   **500 Internal Server Error**: Error interno del servidor

---

## Códigos de Estado HTTP

| Código | Descripción                                        |
| ------ | -------------------------------------------------- |
| 200    | OK - Solicitud exitosa                             |
| 201    | Created - Recurso creado exitosamente              |
| 400    | Bad Request - Error en los datos enviados          |
| 500    | Internal Server Error - Error interno del servidor |

## Relaciones Incluidas

Todos los endpoints que retornan contactos incluyen las siguientes relaciones:

-   **ClienteVendedorExactus**: Datos del cliente asociado en el sistema Exactus
-   **ClienteVendedorGC**: Datos del cliente asociado en GestionC
    -   **Empresa**: Datos de la empresa del cliente
    -   Nota: Solo una de las dos relaciones de cliente estará presente; la otra será `null`.
-   **Colaborador**: Datos del colaborador asociado
    -   **Usuario**: Datos del usuario del colaborador

## Notas Importantes

1. **Filtros de Búsqueda**: Los filtros de texto (`nombre`, `apellido`, `cargo`, etc.) realizan búsquedas parciales usando `contains`.

2. **Paginación**: La respuesta incluye metadatos de paginación (`page`, `pages`, `limit`, `total`).

3. **Ordenamiento**: Los resultados se ordenan por `updatedAt` en orden descendente (más recientes primero).

4. **Validación**: Todos los campos requeridos deben enviarse en la creación, pero en la actualización todos los campos son opcionales.

5. **Tipos de Datos**:

    - Los valores `null` son aceptados para campos opcionales
    - Los valores booleanos pueden enviarse como `true/false` o `1/0`
    - Los números deben ser valores numéricos válidos

6. **Regla de Exclusividad de Cliente**:
    - Un contacto debe pertenecer a exactamente un origen de cliente: Exactus o GestionC.
    - En creación/actualización, debe enviarse solo uno de `clienteExactusId` o `clienteGestionCId`. Si se intenta establecer ambos, la solicitud será rechazada.
    - En las respuestas, solo una de las relaciones `ClienteVendedorExactus` o `ClienteVendedorGC` contendrá datos; la otra será `null`.

## Ejemplos de Uso

### Buscar contactos activos de un cliente específico

```http
GET /contacto?clienteGestionCId=456&activo=true&page=1&limit=20
```

### Buscar contactos por nombre y apellido

```http
GET /contacto?nombre=Juan&apellido=Pérez
```

### Crear un contacto mínimo

```http
POST /contacto
{
    "nombre": "Ana",
    "apellido": "Martínez",
    "cargo": "Secretaria",
    "clienteExactusId": 789
}
```

### Desactivar un contacto

```http
PUT /contacto/124
{
  "activo": false
}
```
