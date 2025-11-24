# API Endpoints - Cultivo Agricultor y Visita Cultivo Agricultor

Esta guía documenta los endpoints disponibles para gestionar los cultivos de agricultores y sus visitas asociadas.

## 📋 Tabla de Contenidos

-   [Cultivo Agricultor](#cultivo-agricultor)
-   [Visita Cultivo Agricultor](#visita-cultivo-agricultor)

---

## 🌱 Cultivo Agricultor

Los endpoints de Cultivo Agricultor permiten gestionar la relación entre contactos (agricultores) y las vegetaciones que cultivan.

### Base URL

```
/api/cultivos-agricultor
```

### Endpoints Disponibles

#### 1. Listar Cultivos Agricultor

Obtiene una lista de cultivos agricultor con soporte para paginación y filtros opcionales.

**Endpoint:** `GET /api/cultivos-agricultor/`

**Query Parameters:**
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `page` | number | No | Número de página (default: 1) |
| `limit` | number | No | Cantidad de registros por página (default: 10) |
| `contactoId` | number | No | Filtrar por ID de contacto |
| `vegetacionId` | number | No | Filtrar por ID de vegetación |

**Ejemplos de uso:**

```bash
# Listar todos los cultivos (sin paginación)
GET /api/cultivos-agricultor/

# Listar con paginación
GET /api/cultivos-agricultor/?page=1&limit=10

# Filtrar por contacto específico
GET /api/cultivos-agricultor/?contactoId=5

# Filtrar por vegetación específica
GET /api/cultivos-agricultor/?vegetacionId=3

# Combinar filtros con paginación
GET /api/cultivos-agricultor/?page=1&limit=10&contactoId=5&vegetacionId=3
```

**Respuesta exitosa (sin paginación):**

```json
{
    "cultivosAgricultor": [
        {
            "id": 1,
            "contactoId": 5,
            "contactoNombre": "Juan Pérez",
            "vegetacionId": 3,
            "vegetacionNombre": "Maíz",
            "createdAt": "2024-01-15T10:30:00.000Z",
            "updatedAt": "2024-01-15T10:30:00.000Z"
        }
    ]
}
```

**Respuesta exitosa (con paginación):**

```json
{
    "page": 1,
    "pages": 5,
    "limit": 10,
    "total": 45,
    "cultivosAgricultor": [
        {
            "id": 1,
            "contactoId": 5,
            "contactoNombre": "Juan Pérez",
            "vegetacionId": 3,
            "vegetacionNombre": "Maíz",
            "createdAt": "2024-01-15T10:30:00.000Z",
            "updatedAt": "2024-01-15T10:30:00.000Z"
        }
    ]
}
```

---

#### 2. Obtener Cultivo Agricultor por ID

Obtiene los detalles de un cultivo agricultor específico.

**Endpoint:** `GET /api/cultivos-agricultor/:id`

**Path Parameters:**
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `id` | number | Sí | ID del cultivo agricultor |

**Ejemplo de uso:**

```bash
GET /api/cultivos-agricultor/1
```

**Respuesta exitosa:**

```json
{
    "id": 1,
    "contactoId": 5,
    "contactoNombre": "Juan Pérez",
    "vegetacionId": 3,
    "vegetacionNombre": "Maíz",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Respuesta de error:**

```json
{
    "error": "CultivoAgricultor con id 999 no existe"
}
```

---

#### 3. Crear Cultivo Agricultor

Crea un nuevo registro de cultivo agricultor.

**Endpoint:** `POST /api/cultivos-agricultor/`

**Body Parameters:**
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `contactoId` | number | Sí | ID del contacto (agricultor) |
| `vegetacionId` | number | Sí | ID de la vegetación |
| `createdBy` | number | Sí | ID del usuario que crea el registro |

**Validaciones:**

-   ✅ Verifica que el `Contacto` exista antes de crear
-   ✅ Verifica que la `Vegetacion` exista antes de crear

**Ejemplo de uso:**

```bash
POST /api/cultivos-agricultor/
Content-Type: application/json

{
  "contactoId": 5,
  "vegetacionId": 3,
  "createdBy": 1
}
```

**Respuesta exitosa:**

```json
{
    "id": 1,
    "contactoId": 5,
    "vegetacionId": 3,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "createdBy": 1
}
```

**Respuestas de error:**

```json
// Si el contacto no existe
{
  "error": "Contacto con id 999 no existe"
}

// Si la vegetación no existe
{
  "error": "Vegetacion con id 999 no existe"
}

// Si faltan campos requeridos
{
  "error": "contactoId property is required"
}
```

---

#### 4. Actualizar Cultivo Agricultor

Actualiza un cultivo agricultor existente.

**Endpoint:** `PUT /api/cultivos-agricultor/:id`

**Path Parameters:**
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `id` | number | Sí | ID del cultivo agricultor |

**Body Parameters:**
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `contactoId` | number | No | ID del contacto |
| `vegetacionId` | number | No | ID de la vegetación |

**Ejemplo de uso:**

```bash
PUT /api/cultivos-agricultor/1
Content-Type: application/json

{
  "vegetacionId": 5
}
```

**Respuesta exitosa:**

```json
{
    "id": 1,
    "contactoId": 5,
    "vegetacionId": 5,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-16T14:20:00.000Z",
    "createdBy": 1
}
```

**Respuesta de error:**

```json
{
    "error": "CultivoAgricultor con id 999 no existe"
}
```

---

#### 5. Eliminar Cultivo Agricultor

Elimina un cultivo agricultor.

**Endpoint:** `DELETE /api/cultivos-agricultor/:id`

**Path Parameters:**
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `id` | number | Sí | ID del cultivo agricultor |

**Ejemplo de uso:**

```bash
DELETE /api/cultivos-agricultor/1
```

**Respuesta exitosa:**

```json
{
    "message": "CultivoAgricultor eliminado correctamente"
}
```

**Respuesta de error:**

```json
{
    "error": "CultivoAgricultor con id 999 no existe"
}
```

---

## 🚜 Visita Cultivo Agricultor

Los endpoints de Visita Cultivo Agricultor permiten gestionar la relación entre visitas y los cultivos de agricultores visitados.

### Base URL

```
/api/visitas-cultivo-agricultor
```

### Endpoints Disponibles

#### 1. Listar Visitas Cultivo Agricultor

Obtiene una lista de visitas a cultivos agricultor con soporte para paginación y filtros opcionales.

**Endpoint:** `GET /api/visitas-cultivo-agricultor/`

**Query Parameters:**
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `page` | number | No | Número de página (default: 1) |
| `limit` | number | No | Cantidad de registros por página (default: 10) |
| `visitaId` | number | No | Filtrar por ID de visita |
| `cultivoAgricultorId` | number | No | Filtrar por ID de cultivo agricultor |

**Ejemplos de uso:**

```bash
# Listar todas las visitas (sin paginación)
GET /api/visitas-cultivo-agricultor/

# Listar con paginación
GET /api/visitas-cultivo-agricultor/?page=1&limit=10

# Filtrar por visita específica
GET /api/visitas-cultivo-agricultor/?visitaId=10

# Filtrar por cultivo agricultor específico
GET /api/visitas-cultivo-agricultor/?cultivoAgricultorId=15

# Combinar filtros con paginación
GET /api/visitas-cultivo-agricultor/?page=1&limit=10&visitaId=10&cultivoAgricultorId=15
```

**Respuesta exitosa (sin paginación):**

```json
{
    "visitasCultivoAgricultor": [
        {
            "id": 1,
            "visitaId": 10,
            "visitaObjetivo": "Inspección de cultivo",
            "visitaProgramacion": "2024-01-20T08:00:00.000Z",
            "visitaInicio": "2024-01-20T08:15:00.000Z",
            "cultivoAgricultorId": 15,
            "contactoNombre": "Juan Pérez",
            "vegetacionNombre": "Maíz",
            "createdAt": "2024-01-15T10:30:00.000Z",
            "updatedAt": "2024-01-15T10:30:00.000Z"
        }
    ]
}
```

**Respuesta exitosa (con paginación):**

```json
{
    "page": 1,
    "pages": 3,
    "limit": 10,
    "total": 28,
    "visitasCultivoAgricultor": [
        {
            "id": 1,
            "visitaId": 10,
            "visitaObjetivo": "Inspección de cultivo",
            "visitaProgramacion": "2024-01-20T08:00:00.000Z",
            "visitaInicio": "2024-01-20T08:15:00.000Z",
            "cultivoAgricultorId": 15,
            "contactoNombre": "Juan Pérez",
            "vegetacionNombre": "Maíz",
            "createdAt": "2024-01-15T10:30:00.000Z",
            "updatedAt": "2024-01-15T10:30:00.000Z"
        }
    ]
}
```

---

#### 2. Obtener Visita Cultivo Agricultor por ID

Obtiene los detalles de una visita cultivo agricultor específica.

**Endpoint:** `GET /api/visitas-cultivo-agricultor/:id`

**Path Parameters:**
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `id` | number | Sí | ID de la visita cultivo agricultor |

**Ejemplo de uso:**

```bash
GET /api/visitas-cultivo-agricultor/1
```

**Respuesta exitosa:**

```json
{
    "id": 1,
    "visitaId": 10,
    "visitaObjetivo": "Inspección de cultivo",
    "visitaProgramacion": "2024-01-20T08:00:00.000Z",
    "visitaInicio": "2024-01-20T08:15:00.000Z",
    "cultivoAgricultorId": 15,
    "contactoNombre": "Juan Pérez",
    "vegetacionNombre": "Maíz",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Respuesta de error:**

```json
{
    "error": "VisitaCultivoAgricultor con id 999 no existe"
}
```

---

#### 3. Crear Visita Cultivo Agricultor

Crea un nuevo registro de visita a cultivo agricultor.

**Endpoint:** `POST /api/visitas-cultivo-agricultor/`

**Body Parameters:**
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `visitaId` | number | Sí | ID de la visita |
| `cultivoAgricultorId` | number | Sí | ID del cultivo agricultor |
| `createdBy` | number | Sí | ID del usuario que crea el registro |

**Validaciones:**

-   ✅ Verifica que la `Visita` exista antes de crear
-   ✅ Verifica que el `CultivoAgricultor` exista antes de crear

**Ejemplo de uso:**

```bash
POST /api/visitas-cultivo-agricultor/
Content-Type: application/json

{
  "visitaId": 10,
  "cultivoAgricultorId": 15,
  "createdBy": 1
}
```

**Respuesta exitosa:**

```json
{
    "id": 1,
    "visitaId": 10,
    "cultivoAgricultorId": 15,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "createdBy": 1
}
```

**Respuestas de error:**

```json
// Si la visita no existe
{
  "error": "Visita con id 999 no existe"
}

// Si el cultivo agricultor no existe
{
  "error": "CultivoAgricultor con id 999 no existe"
}

// Si faltan campos requeridos
{
  "error": "visitaId property is required"
}
```

---

#### 4. Actualizar Visita Cultivo Agricultor

Actualiza una visita cultivo agricultor existente.

**Endpoint:** `PUT /api/visitas-cultivo-agricultor/:id`

**Path Parameters:**
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `id` | number | Sí | ID de la visita cultivo agricultor |

**Body Parameters:**
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `visitaId` | number | No | ID de la visita |
| `cultivoAgricultorId` | number | No | ID del cultivo agricultor |

**Ejemplo de uso:**

```bash
PUT /api/visitas-cultivo-agricultor/1
Content-Type: application/json

{
  "cultivoAgricultorId": 20
}
```

**Respuesta exitosa:**

```json
{
    "id": 1,
    "visitaId": 10,
    "cultivoAgricultorId": 20,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-16T14:20:00.000Z",
    "createdBy": 1
}
```

**Respuesta de error:**

```json
{
    "error": "VisitaCultivoAgricultor con id 999 no existe"
}
```

---

#### 5. Eliminar Visita Cultivo Agricultor

Elimina una visita cultivo agricultor.

**Endpoint:** `DELETE /api/visitas-cultivo-agricultor/:id`

**Path Parameters:**
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `id` | number | Sí | ID de la visita cultivo agricultor |

**Ejemplo de uso:**

```bash
DELETE /api/visitas-cultivo-agricultor/1
```

**Respuesta exitosa:**

```json
{
    "message": "VisitaCultivoAgricultor eliminado correctamente"
}
```

**Respuesta de error:**

```json
{
    "error": "VisitaCultivoAgricultor con id 999 no existe"
}
```

---

## 🔄 Flujo de Trabajo Recomendado

### Crear una Visita a Cultivo de Agricultor

1. **Verificar que existe el Contacto (Agricultor)**

    ```bash
    GET /api/contactos/:id
    ```

2. **Verificar que existe la Vegetación**

    ```bash
    GET /api/vegetacion/:id
    ```

3. **Crear el Cultivo Agricultor**

    ```bash
    POST /api/cultivos-agricultor/
    {
      "contactoId": 5,
      "vegetacionId": 3,
      "createdBy": 1
    }
    ```

4. **Crear o verificar la Visita**

    ```bash
    POST /api/visitas/ # (endpoint existente)
    ```

5. **Asociar la Visita con el Cultivo Agricultor**
    ```bash
    POST /api/visitas-cultivo-agricultor/
    {
      "visitaId": 10,
      "cultivoAgricultorId": 1,
      "createdBy": 1
    }
    ```

### Consultar Visitas de un Agricultor Específico

1. **Obtener los cultivos del agricultor**

    ```bash
    GET /api/cultivos-agricultor/?contactoId=5
    ```

2. **Para cada cultivo, obtener sus visitas**
    ```bash
    GET /api/visitas-cultivo-agricultor/?cultivoAgricultorId=1
    ```

### Consultar Cultivos Visitados en una Visita

```bash
GET /api/visitas-cultivo-agricultor/?visitaId=10
```

---

## 📊 Códigos de Estado HTTP

| Código | Descripción                                  |
| ------ | -------------------------------------------- |
| `200`  | OK - Operación exitosa (GET, PUT, DELETE)    |
| `201`  | Created - Recurso creado exitosamente (POST) |
| `400`  | Bad Request - Datos inválidos o faltantes    |
| `404`  | Not Found - Recurso no encontrado            |
| `500`  | Internal Server Error - Error del servidor   |

---

## 🔒 Notas de Seguridad

-   Todos los endpoints validan la existencia de las entidades relacionadas antes de crear registros
-   Los IDs deben ser números válidos
-   Se recomienda implementar autenticación y autorización según los requisitos del proyecto
-   El campo `createdBy` debe corresponder a un usuario válido del sistema

---

## 🧪 Testing con cURL

### Crear un Cultivo Agricultor

```bash
curl -X POST http://localhost:3000/api/cultivos-agricultor/ \
  -H "Content-Type: application/json" \
  -d '{
    "contactoId": 5,
    "vegetacionId": 3,
    "createdBy": 1
  }'
```

### Crear una Visita Cultivo Agricultor

```bash
curl -X POST http://localhost:3000/api/visitas-cultivo-agricultor/ \
  -H "Content-Type: application/json" \
  -d '{
    "visitaId": 10,
    "cultivoAgricultorId": 1,
    "createdBy": 1
  }'
```

### Listar con Filtros

```bash
curl -X GET "http://localhost:3000/api/cultivos-agricultor/?page=1&limit=10&contactoId=5"
```

---

## 📝 Changelog

-   **v1.0.0** (2024-01-15)
    -   Creación inicial de endpoints
    -   Implementación de validaciones de existencia
    -   Soporte para paginación y filtros flexibles
    -   Unificación de endpoints de listado con y sin paginación
