# Ejemplos de Uso del Filtro de Búsqueda

## Nuevas Funcionalidades Agregadas

Se ha agregado un filtro de búsqueda que permite buscar direcciones de entrega por:

-   **CLIENTE**: Código del cliente
-   **NOMBRE**: Nombre del cliente

### Ejemplos de Uso

#### 1. Búsqueda en un esquema específico

```bash
# Buscar direcciones que contengan "AGRO" en el código del cliente o nombre
curl -X GET "http://localhost:3000/api/direcciones-entrega/tqc?search=AGRO"

# Buscar direcciones que contengan "SAC" en el código del cliente o nombre
curl -X GET "http://localhost:3000/api/direcciones-entrega/TALEX?search=SAC"

# Buscar direcciones que contengan "LIMA" en el código del cliente o nombre
curl -X GET "http://localhost:3000/api/direcciones-entrega/BIOGEN?search=LIMA"
```

#### 2. Búsqueda en todos los esquemas

```bash
# Buscar "AGRO" en todos los esquemas
curl -X GET "http://localhost:3000/api/direcciones-entrega/all?search=AGRO"

# Combinar búsqueda con filtro de cliente específico
curl -X GET "http://localhost:3000/api/direcciones-entrega/all?cliente=CLI001&search=SAC"
```

### Respuestas de Ejemplo

#### Con resultados encontrados:

```json
{
    "success": true,
    "data": [
        {
            "DETALLE_DIRECCION": "DIR001",
            "CLIENTE": "AGRO001",
            "NOMBRE": "Empresa Agroindustrial SAC",
            "CAMPO_5": "Av. Principal 123",
            "CAMPO_6": "Lima",
            "CAMPO_7": "Perú",
            "CAMPO_8": "001",
            "CAMPO_1": "Principal",
            "CAMPO_2": "Oficina"
        }
    ],
    "message": "3 direcciones de entrega encontradas del esquema tqc con búsqueda: \"AGRO\""
}
```

#### Sin resultados:

```json
{
    "success": false,
    "message": "No se encontraron direcciones con la búsqueda \"INEXISTENTE\" en ningún esquema"
}
```

### Características del Filtro

1. **Búsqueda parcial**: Usa `LIKE %término%` para encontrar coincidencias parciales
2. **Insensible a mayúsculas/minúsculas**: El SQL Server maneja esto automáticamente
3. **Búsqueda en ambos campos**: Busca tanto en CLIENTE como en NOMBRE
4. **Combinable**: Se puede usar junto con otros filtros como `cliente`
5. **Spaces handling**: Se eliminan espacios en blanco al inicio y final del término

### Casos de Uso Típicos

-   Buscar todas las direcciones de empresas que contengan "SAC" en el nombre
-   Encontrar clientes que tengan "AGRO" en su código o nombre
-   Buscar direcciones en una ciudad específica (si está en el nombre)
-   Filtrar por tipo de empresa (si está incluido en el nombre)

### Parámetros de Query Disponibles

| Parámetro | Descripción                          | Ejemplo           |
| --------- | ------------------------------------ | ----------------- |
| `search`  | Término a buscar en CLIENTE y NOMBRE | `?search=AGRO`    |
| `cliente` | Código específico del cliente        | `?cliente=CLI001` |

### Combinaciones Válidas

-   Solo `search`: `?search=AGRO`
-   Solo `cliente`: `?cliente=CLI001`
-   Ambos: `?cliente=CLI001&search=SAC`

### Performance

-   El filtro usa índices existentes en las columnas CLIENTE y NOMBRE
-   Para búsquedas muy generales, considera limitar el número de resultados
-   La búsqueda es eficiente para términos específicos
