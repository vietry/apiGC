# Conexión Sequelize con Base de Datos Exactus

Este proyecto incluye una implementación completa de Sequelize ORM para conectarse a la base de datos Exactus de SQL Server.

## Archivos Creados

### 1. Configuración Principal

-   **`src/config/sequelize.ts`**: Configuración de Sequelize para Exactus
-   **`src/config/envs.ts`**: Variables de entorno actualizadas
-   **`src/config/index.ts`**: Exportaciones actualizadas

### 2. Clases Helper

-   **`src/data/exactus/exactus-database.ts`**: Clase helper para operaciones con Exactus
-   **`src/data/exactus/index.ts`**: Exportaciones de Exactus
-   **`src/data/index.ts`**: Exportaciones principales actualizadas

### 3. Ejemplos

-   **`src/examples/exactus-examples.ts`**: Ejemplos de uso completos

### 4. Integración con Servidor

-   **`src/presentation/server.ts`**: Servidor actualizado con inicialización de Sequelize

## Variables de Entorno

Las siguientes variables ya están configuradas en tu `.env`:

```properties
SQLSERVER_EXACTUS_USER=tqc
SQLSERVER_EXACTUS_PASSWORD=extqc
SQLSERVER_EXACTUS_SERVER=10.10.10.228
SQLSERVER_EXACTUS_DB_NAME=TQC
```

## Uso Básico

### 1. Importar las clases necesarias

```typescript
import { ExactusDatabase } from '../data';
import { sequelizeExactus } from '../config';
```

### 2. Ejecutar consultas SELECT

```typescript
// Obtener todos los clientes
const clientes = await ExactusDatabase.query(`
    SELECT CLIENTE, NOMBRE, TELEFONO1, EMAIL 
    FROM CLIENTE 
    WHERE ACTIVO = 'S'
`);

// Consulta con parámetros
const cliente = await ExactusDatabase.query(
    `
    SELECT * FROM CLIENTE WHERE CLIENTE = ?
`,
    ['CLI001']
);
```

### 3. Ejecutar comandos INSERT/UPDATE/DELETE

```typescript
// Insertar un nuevo registro
const filasAfectadas = await ExactusDatabase.execute(
    `
    INSERT INTO CLIENTE (CLIENTE, NOMBRE, TELEFONO1) 
    VALUES (?, ?, ?)
`,
    ['CLI002', 'Nuevo Cliente', '123456789']
);

// Actualizar un registro
await ExactusDatabase.execute(
    `
    UPDATE CLIENTE SET TELEFONO1 = ? WHERE CLIENTE = ?
`,
    ['987654321', 'CLI001']
);
```

### 4. Usar transacciones

```typescript
const resultado = await ExactusDatabase.transaction(async (transaction) => {
    // Operaciones dentro de la transacción
    await ExactusDatabase.execute(
        `
        INSERT INTO CLIENTE (CLIENTE, NOMBRE) VALUES (?, ?)
    `,
        ['CLI003', 'Cliente Transacción']
    );

    await ExactusDatabase.execute(
        `
        INSERT INTO CONTACTO (CLIENTE, NOMBRE) VALUES (?, ?)
    `,
        ['CLI003', 'Contacto Principal']
    );

    return { success: true };
});
```

### 5. Health Check

```typescript
// Verificar estado de la conexión
const isHealthy = await ExactusDatabase.healthCheck();
console.log('Exactus DB Status:', isHealthy ? 'OK' : 'ERROR');
```

## Funciones Disponibles

### ExactusDatabase

| Método              | Descripción                        | Parámetros                            |
| ------------------- | ---------------------------------- | ------------------------------------- |
| `query<T>()`        | Ejecuta consultas SELECT           | `query: string, replacements?: any[]` |
| `execute()`         | Ejecuta INSERT/UPDATE/DELETE       | `query: string, replacements?: any[]` |
| `transaction()`     | Ejecuta operaciones en transacción | `callback: Function`                  |
| `healthCheck()`     | Verifica estado de conexión        | -                                     |
| `getDatabaseInfo()` | Obtiene información de la BD       | -                                     |
| `close()`           | Cierra la conexión                 | -                                     |

### Funciones de Configuración

| Función                            | Descripción                   |
| ---------------------------------- | ----------------------------- |
| `initializeSequelizeExactus()`     | Inicializa la conexión        |
| `testSequelizeExactusConnection()` | Prueba la conexión            |
| `sequelizeExactusHealthCheck()`    | Health check para el servidor |

## Integración con el Servidor

El servidor ya está configurado para:

1. **Inicialización automática**: La conexión se inicializa al arrancar el servidor
2. **Health Check mejorado**: El endpoint `/api/health` incluye el estado de Exactus
3. **Manejo de errores**: Logs detallados para problemas de conexión
4. **Cierre graceful**: La conexión se cierra correctamente al apagar el servidor

## Endpoint Health Check

El endpoint `/api/health` ahora incluye información de Exactus:

```json
{
    "status": "ok",
    "timestamp": "2025-09-16T...",
    "database": "connected",
    "exactusDatabase": "connected",
    "version": "2.0.0"
}
```

## Ejemplos Completos

Revisa el archivo `src/examples/exactus-examples.ts` para ver ejemplos completos de:

-   Consultas básicas
-   Búsquedas con parámetros
-   Transacciones
-   Manejo de errores
-   Operaciones CRUD

## Dependencias Instaladas

```json
{
    "sequelize": "^6.x.x",
    "@types/sequelize": "^4.x.x",
    "tedious": "^18.x.x",
    "@types/tedious": "^4.x.x"
}
```

## Notas Importantes

1. **Seguridad**: Siempre usa parámetros preparados (`?`) para evitar inyección SQL
2. **Transacciones**: Usa transacciones para operaciones que requieren consistencia
3. **Manejo de errores**: Siempre maneja los errores apropiadamente
4. **Logging**: Los logs están configurados para mostrar consultas en desarrollo
5. **Pool de conexiones**: Configurado para un máximo de 10 conexiones concurrentes
