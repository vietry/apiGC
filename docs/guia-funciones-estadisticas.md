# Guía de Funciones de Estadísticas - API GC

Esta guía detalla las funciones de estadísticas disponibles en el sistema de visitas, incluyendo parámetros de consulta, tipos de respuesta y ejemplos de uso.

## 1. getVisitasEstadisticas (VisitaService)

### Descripción

Obtiene estadísticas comparativas de visitas entre dos períodos de tiempo, con diversos filtros aplicables.

### Endpoint

```
GET /api/visitas/estadisticas
```

### Parámetros Query

#### Período Actual

-   **`periodoActualTipo`** (string, requerido): Tipo de período para las estadísticas principales
    -   Valores válidos: `'dia'`, `'semana'`, `'mes'`, `'año'`, `'personalizado'`
-   **`periodoActualDesde`** (string, opcional): Fecha de inicio para período personalizado (formato ISO)
-   **`periodoActualHasta`** (string, opcional): Fecha de fin para período personalizado (formato ISO)

#### Período Comparativo

-   **`periodoComparativoTipo`** (string, requerido): Tipo de período para comparación
    -   Valores válidos: `'anterior'`, `'anioAnterior'`, `'ultimoTrimestre'`, `'personalizado'`
-   **`periodoComparativoDesde`** (string, opcional): Fecha de inicio para período comparativo personalizado
-   **`periodoComparativoHasta`** (string, opcional): Fecha de fin para período comparativo personalizado

#### Filtros de Visitas

-   **`idColaborador`** (number, opcional): ID del colaborador
-   **`estado`** (string, opcional): Estado de la visita (ej: 'Completado', 'Pendiente', etc.)
-   **`semana`** (number, opcional): Número de semana
-   **`idVegetacion`** (number, opcional): ID de la vegetación
-   **`idFamilia`** (number, opcional): ID de la familia de productos
-   **`idPuntoContacto`** (number, opcional): ID del punto de contacto
-   **`idContacto`** (number, opcional): ID del contacto
-   **`idRepresentada`** (number, opcional): ID de la empresa representada
-   **`idSubLabor1`** (number, opcional): ID de la primera sublabor
-   **`idSubLabor2`** (number, opcional): ID de la segunda sublabor
-   **`programada`** (boolean, opcional): Si la visita fue programada o no

### Ejemplos de Uso

#### Estadísticas del mes actual vs mes anterior

```
GET /api/visitas/estadisticas?periodoActualTipo=mes&periodoComparativoTipo=anterior
```

#### Estadísticas personalizadas con filtros

```
GET /api/visitas/estadisticas?periodoActualTipo=personalizado&periodoActualDesde=2024-01-01&periodoActualHasta=2024-01-31&periodoComparativoTipo=anioAnterior&idColaborador=123&estado=Completado
```

#### Estadísticas del año actual vs año anterior

```
GET /api/visitas/estadisticas?periodoActualTipo=año&periodoComparativoTipo=anioAnterior&idFamilia=5
```

### Tipos de Período

#### Período Actual

-   **`dia`**: Día actual (desde 00:00 hasta 23:59)
-   **`semana`**: Semana actual (domingo a sábado)
-   **`mes`**: Mes actual completo
-   **`año`**: Año actual completo
-   **`personalizado`**: Rango de fechas específico (requiere `periodoActualDesde` y `periodoActualHasta`)

#### Período Comparativo

-   **`anterior`**: Período inmediatamente anterior al actual (misma duración)
-   **`anioAnterior`**: Mismo período pero del año anterior
-   **`ultimoTrimestre`**: Últimos 3 meses desde la fecha actual
-   **`personalizado`**: Rango de fechas específico (requiere `periodoComparativoDesde` y `periodoComparativoHasta`)

### Estructura de Respuesta

```typescript
{
  periodoActual: {
    desde: Date,
    hasta: Date,
    total: number,
    porEstado: { [estado: string]: number },
    porColaborador: Array<{
      nombre: string,
      cargo: string | null,
      cantidad: number,
      completadas: number,
      porcentajeCompletadas: number
    }>,
    porPuntoContacto: Array<{
      nombre: string,
      cantidad: number
    }>,
    totalCompra: number,
    porUbigeo: Array<{
      id: number,
      nombre: string,
      cantidad: number,
      provincias: Array<{
        id: number,
        nombre: string,
        cantidad: number,
        distritos: Array<{
          id: number,
          nombre: string,
          cantidad: number
        }>
      }>
    }>
  },
  periodoComparativo: {
    // Misma estructura que periodoActual
  }
}
```

---

## 2. obtenerEstadisticasGestionVisitas (DashboardService)

### Descripción

Obtiene estadísticas detalladas de gestión de visitas organizadas por colaboradores, labores y sublabores.

### Endpoint

```
GET /api/dashboard/labores
```

### Parámetros Query

-   **`idColaborador`** (number, opcional): ID específico del colaborador
-   **`idMacrozona`** (number, opcional): ID de la macrozona
-   **`idEmpresa`** (number, opcional): ID de la empresa
-   **`year`** (number, opcional): Año para filtrar las visitas
-   **`month`** (number, opcional): Mes para filtrar las visitas (1-12)
-   **`idLabor`** (number, opcional): ID de la labor específica
-   **`idSubLabor`** (number, opcional): ID de la sublabor específica

### Ejemplos de Uso

#### Estadísticas generales del año 2024

```
GET /api/dashboard/labores?year=2024
```

#### Estadísticas de un colaborador específico en enero 2024

```
GET /api/dashboard/labores?idColaborador=123&year=2024&month=1
```

#### Estadísticas por macrozona y empresa

```
GET /api/dashboard/labores?idMacrozona=5&idEmpresa=2&year=2024
```

#### Estadísticas de una labor específica

```
GET /api/dashboard/labores?idLabor=10&year=2024&month=6
```

### Filtros por Fecha

#### Solo Año

-   Incluye todas las visitas del año especificado (enero 1 a diciembre 31)

#### Año y Mes

-   Incluye solo las visitas del mes específico del año indicado

### Estructura de Respuesta

```typescript
{
  resumen: {
    totalVisitas: number,
    visitasCompletadas: number,
    porcentajeCompletadas: number,
    colaboradores: number,
    labores: number,
    sublabores: number
  },
  colaboradores: Array<{
    idColaborador: number,
    nombreColaborador: string,
    empresa?: string,
    macrozona?: string,
    totalVisitas: number,
    visitasCompletadas: number,
    porcentajeCompletadas: number,
    labores: Array<{
      id: number,
      nombre: string,
      totalVisitas: number,
      visitasCompletadas: number,
      porcentajeCompletadas: number,
      sublabores: Array<{
        id: number,
        nombre: string,
        totalVisitas: number,
        visitasCompletadas: number,
        porcentajeCompletadas: number
      }>
    }>
  }>
}
```

### Jerarquía de Datos

1. **Resumen General**: Totales consolidados de todas las visitas
2. **Colaboradores**: Lista de colaboradores con sus estadísticas individuales
3. **Labores por Colaborador**: Labores realizadas por cada colaborador
4. **Sublabores por Labor**: Sublabores específicas dentro de cada labor

### Ordenamiento

-   **Colaboradores**: Ordenados alfabéticamente por nombre
-   **Labores**: Ordenadas alfabéticamente por nombre
-   **Sublabores**: Ordenadas alfabéticamente por nombre

### Cálculos Automáticos

-   **Porcentajes de Completadas**: Se calculan automáticamente para todos los niveles
-   **Totales por Nivel**: Se consolidan desde el nivel más granular hacia arriba
-   **Conteos Únicos**: Los contadores de labores y sublabores solo cuentan elementos únicos

### Casos Especiales

#### Sin Colaboradores Coincidentes

Si los filtros de `idMacrozona` o `idEmpresa` no coinciden con ningún colaborador, la función retorna:

```typescript
{
  resumen: {
    totalVisitas: 0,
    visitasCompletadas: 0,
    porcentajeCompletadas: 0,
    colaboradores: 0,
    labores: 0,
    sublabores: 0
  },
  colaboradores: []
}
```

#### Filtros de Labor y Sublabor

-   Cuando se especifica `idLabor`, solo se incluyen las sublabores de esa labor
-   Cuando se especifica `idSubLabor`, solo se incluyen las visitas con esa sublabor específica

---

## Notas Importantes

### Zona Horaria

-   Todas las fechas se manejan en la zona horaria local del servidor
-   Los rangos de fecha son inclusivos para el inicio y exclusivos para el final

### Estados de Visita

-   El estado 'Completado' se usa para determinar visitas completadas
-   Los estados son case-sensitive

### Rendimiento

-   Las consultas incluyen múltiples joins, considerar el volumen de datos
-   Se recomienda usar filtros de fecha para optimizar el rendimiento

### Validación de Datos

-   Los filtros numéricos se convierten automáticamente usando el operador `+`
-   Los filtros booleanos se evalúan como `'true'` o `'1'` para `true`
-   Las fechas personalizadas deben estar en formato ISO válido
