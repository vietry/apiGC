# Implementación de Sincronización Offline

## Resumen

Se ha implementado la funcionalidad de sincronización offline para la aplicación de visitas comerciales. Esto permite que los usuarios trabajen sin conexión a internet, creando y actualizando visitas localmente, y luego sincronizando los datos con el servidor cuando se recupera la conexión.

## Cambios Implementados en el Servidor

### 1. Nuevos Archivos Creados

#### `src/visitas_gc/services/sync.service.ts`

Servicio principal que maneja la sincronización batch de datos offline:

-   **`processBatchSync(actions: SyncAction[])`**: Procesa un lote de acciones (crear, actualizar, eliminar) en una transacción.
-   **`processVisitaAction()`**: Maneja acciones relacionadas con visitas.
-   **`processLaborAction()`**: Maneja acciones relacionadas con labores.
-   **`processProductoAction()`**: Maneja acciones relacionadas con productos.
-   **`getReferenceData(idColaborador?)`**: Obtiene todos los datos de referencia necesarios para trabajar offline (clientes, contactos, cultivos, etc.).

**Características clave:**

-   Transacciones atómicas para garantizar consistencia
-   Detección de conflictos basada en timestamps
-   Manejo de errores individual por acción
-   Soporte para IDs locales (UUIDs) y conversión a IDs del servidor

#### `src/visitas_gc/controllers/sync.controller.ts`

Controlador REST para los endpoints de sincronización:

-   **POST `/api/sync/batch`**: Recibe un array de acciones y las procesa.
-   **GET `/api/sync/reference-data`**: Devuelve datos de referencia para uso offline.

#### `src/visitas_gc/routes/sync.routes.ts`

Define las rutas para la sincronización.

### 2. Modificaciones en Archivos Existentes

#### `src/visitas_gc/dtos/create-visita.dto.ts`

-   ✅ Agregados campos opcionales `createdAt` y `updatedAt`
-   ✅ Validación de fechas del cliente
-   ✅ Fallback a fecha del servidor si no se proporcionan

#### `src/visitas_gc/dtos/update-visita.dto.ts`

-   ✅ Agregado campo opcional `updatedAt`
-   ✅ Incluido en el método `values` para la actualización
-   ✅ Validación de fecha del cliente

#### `src/visitas_gc/services/visita.service.ts`

Modificado en tres métodos principales:

**`createVisita()`:**

```typescript
// Usar fechas del cliente si están disponibles, sino usar la del servidor
const currentDate = getCurrentDate();
const createdAt = createVisitaDto.createdAt || currentDate;
const updatedAt = createVisitaDto.updatedAt || currentDate;
```

**`updateVisita()`:**

```typescript
// Usar updatedAt del cliente si está disponible
const currentDate = getCurrentDate();
const updatedAt = updateVisitaDto.updatedAt || currentDate;
```

**`createMultipleVisitas()`:**

```typescript
const createdAt = dto.createdAt || currentDate;
const updatedAt = dto.updatedAt || currentDate;
```

#### `src/presentation/routes.ts`

-   ✅ Importado `SyncRoutes`
-   ✅ Registrada ruta `/api/sync`

## Endpoints Disponibles

### 1. Sincronización Batch

```http
POST /api/sync/batch
Content-Type: application/json

{
  "actions": [
    {
      "action": "create",
      "entityType": "visita",
      "localId": "uuid-local-123",
      "data": {
        "programacion": "2024-11-07T10:00:00Z",
        "idColaborador": 1,
        "estado": "programada",
        "createdAt": "2024-11-07T09:30:00Z",
        "updatedAt": "2024-11-07T09:30:00Z",
        ...
      },
      "timestamp": "2024-11-07T09:30:00Z"
    },
    {
      "action": "update",
      "entityType": "visita",
      "entityId": 123,
      "data": {
        "estado": "completada",
        "finalizacion": "2024-11-07T11:00:00Z",
        "updatedAt": "2024-11-07T11:00:00Z"
      },
      "timestamp": "2024-11-07T11:00:00Z"
    }
  ]
}
```

**Respuesta exitosa:**

```json
{
    "success": true,
    "results": [
        {
            "localId": "uuid-local-123",
            "serverId": 456,
            "status": "success"
        },
        {
            "entityId": 123,
            "status": "success"
        }
    ],
    "totalActions": 2,
    "successCount": 2,
    "errorCount": 0,
    "conflictCount": 0
}
```

**Respuesta con conflicto:**

```json
{
  "success": true,
  "results": [
    {
      "entityId": 123,
      "status": "conflict",
      "serverData": { ... },
      "conflictResolution": "server-wins",
      "error": "La visita fue modificada en el servidor"
    }
  ],
  "totalActions": 1,
  "successCount": 0,
  "errorCount": 0,
  "conflictCount": 1
}
```

### 2. Obtener Datos de Referencia

```http
GET /api/sync/reference-data?idColaborador=1
```

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "clientes": [...],
    "contactos": [...],
    "cultivos": [...],
    "colaboradores": [...],
    "familias": [...],
    "labores": [...],
    "sublabores": [...],
    "representadas": [...]
  }
}
```

## Flujo de Sincronización

### Creación de Visita Offline → Online

1. **Cliente (Offline):**

    - Usuario crea una visita
    - Se genera un `localId` (UUID)
    - Se guardan fechas `createdAt` y `updatedAt` del momento de creación
    - Acción se almacena en IndexedDB

2. **Cliente (Online):**

    - Detecta conexión
    - Envía array de acciones pendientes a `/api/sync/batch`
    - Incluye `localId`, `data` con fechas del cliente

3. **Servidor:**

    - Recibe la acción
    - Crea la visita con las fechas del cliente
    - Devuelve el `serverId` generado

4. **Cliente:**
    - Actualiza el registro local con el `serverId`
    - Marca como sincronizado

### Actualización de Visita con Detección de Conflictos

1. **Cliente:**

    - Actualiza visita offline
    - Guarda `updatedAt` del momento de la modificación

2. **Servidor:**
    - Compara `updatedAt` del servidor con el timestamp del cliente
    - Si servidor es más reciente → **CONFLICTO**
    - Si cliente es más reciente → Procede con actualización

## Manejo de Conflictos

Cuando se detecta un conflicto (el servidor tiene una versión más reciente):

```typescript
if (serverVisita.updatedAt > clientTimestamp) {
    return {
        entityId: action.entityId,
        status: 'conflict',
        serverData: serverVisita,
        conflictResolution: 'server-wins',
        error: 'La visita fue modificada en el servidor',
    };
}
```

El cliente debe:

1. Mostrar el conflicto al usuario
2. Permitir elegir qué versión mantener
3. Reintentar la sincronización con la decisión del usuario

## Ventajas de la Implementación

✅ **Timestamps del Cliente**: Las fechas reflejan cuándo el usuario realmente realizó la acción, no cuándo se sincronizó  
✅ **Transacciones Atómicas**: Todo el batch se ejecuta o falla completo  
✅ **Detección de Conflictos**: Previene sobrescrituras accidentales  
✅ **IDs Locales**: Permite crear registros sin esperar al servidor  
✅ **Datos de Referencia**: El cliente puede trabajar completamente offline  
✅ **Retrocompatibilidad**: Si no se envían fechas, usa las del servidor

## Próximos Pasos para el Cliente (Frontend)

1. **Implementar IndexedDB** con Dexie.js
2. **Crear Service Worker** para caché de assets
3. **Desarrollar composable `useOfflineVisitas`** con:
    - `createVisitaOffline()`
    - `updateVisitaOffline()`
    - `syncData()`
    - `downloadReferenceData()`
4. **Agregar indicador de estado de conexión**
5. **Implementar cola de sincronización**
6. **Manejar conflictos en UI**

## Consideraciones de Seguridad

-   ✅ Validación de timestamps para prevenir manipulación
-   ✅ Transacciones para evitar inconsistencias
-   ⚠️ TODO: Agregar autenticación/autorización en endpoints de sync
-   ⚠️ TODO: Limitar cantidad de acciones por batch
-   ⚠️ TODO: Implementar rate limiting

## Ejemplos de Uso

### Crear Visita con Fechas del Cliente

```typescript
// En el cliente
const visitaData = {
    programacion: new Date('2024-11-08T10:00:00'),
    idColaborador: 1,
    idContacto: 5,
    estado: 'programada',
    createdAt: new Date(), // Fecha actual del cliente
    updatedAt: new Date(),
};

// POST /api/visitas
const response = await fetch('/api/visitas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(visitaData),
});
```

### Actualizar Visita con Fecha del Cliente

```typescript
// En el cliente
const updateData = {
    id: 123,
    estado: 'completada',
    finalizacion: new Date(),
    updatedAt: new Date(), // Fecha actual del cliente
};

// PATCH /api/visitas/123
const response = await fetch('/api/visitas/123', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData),
});
```

## Pruebas Recomendadas

1. ✅ Crear visita sin fechas (debe usar fecha del servidor)
2. ✅ Crear visita con fechas del cliente
3. ✅ Actualizar visita sin conflictos
4. ✅ Actualizar visita con conflicto (servidor más reciente)
5. ✅ Sincronización batch con múltiples acciones
6. ✅ Sincronización batch con una acción fallida
7. ✅ Obtener datos de referencia
8. ✅ Crear labor y producto asociado a visita offline

## Notas Técnicas

-   Los timestamps se comparan usando objetos `Date` de JavaScript
-   Las transacciones tienen timeout de 30 segundos
-   Se usa `getCurrentDate()` del servidor como fallback
-   Los IDs locales (UUIDs) se convierten a IDs numéricos del servidor
-   La sincronización es idempotente (se puede reintentar sin duplicar datos)

---

**Fecha de implementación**: 7 de noviembre de 2025  
**Versión**: 1.0  
**Autor**: Sistema de Sincronización Offline
