# Guía de Endpoints - Dashboard de Asesores de Cultivos

Guía para implementar el dashboard de asesores en la app web Vue.js. Los 4 endpoints comparten los mismos filtros por query params.

---

## Base URL

```
/api/dashboards/asesores
```

---

## 📋 1. Lista paginada de asesores

**`GET /api/dashboards/asesores`**

Retorna la lista paginada de cultivos que tienen asesor, con toda la información enriquecida (cultivo, fundo, ubigeo, colaborador, empresa, negocio).

### Query Params

| Parámetro         | Tipo   | Requerido | Descripción                                        |
| ----------------- | ------ | --------- | -------------------------------------------------- |
| `page`            | number | No        | Página actual (default: 1)                         |
| `limit`           | number | No        | Registros por página (default: 20)                 |
| `nomAsesor`       | string | No        | Buscar por nombre del asesor (parcial)             |
| `cargoAsesor`     | string | No        | Buscar por cargo del asesor (parcial)              |
| `idVegetacion`    | number | No        | Filtrar por tipo de vegetación                     |
| `vegetacion`      | string | No        | Buscar por nombre de vegetación (parcial)          |
| `idVariedad`      | number | No        | Filtrar por variedad del cultivo                   |
| `idPuntoContacto` | number | No        | Filtrar por punto de contacto (cliente)            |
| `idContactoPunto` | number | No        | Filtrar por contacto del punto                     |
| `codCliente`      | string | No        | Buscar por código de cliente (parcial)             |
| `idColaborador`   | number | No        | Filtrar por colaborador (ligado al GTE)            |
| `idGte`           | number | No        | Filtrar por GTE específico                         |
| `idEmpresa`       | number | No        | Filtrar por empresa (vía ColaboradorJefe)          |
| `negocio`         | string | No        | Filtrar por negocio (vía ColaboradorJefe, parcial) |
| `departamento`    | string | No        | Filtrar por departamento (parcial)                 |
| `provincia`       | string | No        | Filtrar por provincia (parcial)                    |
| `distrito`        | string | No        | Filtrar por distrito (parcial)                     |

### Ejemplo de petición

```ts
// Vue.js con axios
const { data } = await api.get('/api/dashboards/asesores', {
    params: {
        page: 1,
        limit: 20,
        idEmpresa: 3,
        negocio: 'Agro',
        departamento: 'Lima',
    },
});
```

### Respuesta exitosa (200)

```json
{
    "page": 1,
    "pages": 5,
    "limit": 20,
    "total": 98,
    "asesores": [
        {
            "idCultivo": 142,
            "nomAsesor": "Juan Pérez",
            "numAsesor": "987654321",
            "cargoAsesor": "Ingeniero Agrónomo",
            "certificacion": "Orgánico",
            "hectareas": 12.5,
            "poblacion": 5000,
            "mesInicio": "Marzo",
            "mesFinal": "Diciembre",
            "observacion": "Zona con riego tecnificado",
            "idVariedad": 10,
            "variedad": "Hass",
            "idVegetacion": 3,
            "vegetacion": "Palto",
            "idFundo": 45,
            "fundo": "Fundo San José",
            "centroPoblado": "San Bartolo",
            "idPuntoContacto": 12,
            "puntoContacto": "Agro Sur S.A.C.",
            "idContactoPunto": 8,
            "contactoPunto": "María García",
            "idGte": 25,
            "idColaborador": 15,
            "colaborador": "Carlos López Martínez",
            "idEmpresa": 3,
            "empresa": "HORTUS",
            "negocio": "Agro",
            "macrozona": "ZONA SUR",
            "idDistrito": "150101",
            "distrito": "Lima",
            "idProvincia": "1501",
            "provincia": "Lima",
            "idDepartamento": "15",
            "departamento": "Lima"
        }
    ]
}
```

### Interfaz TypeScript para Vue.js

```ts
export interface AsesorItem {
    idCultivo: number;
    // Asesor
    nomAsesor: string | null;
    numAsesor: string | null;
    cargoAsesor: string | null;
    // Cultivo
    certificacion: string | null;
    hectareas: number | null;
    poblacion: number | null;
    mesInicio: string | null;
    mesFinal: string | null;
    observacion: string | null;
    // Variedad
    idVariedad: number;
    variedad: string | null;
    idVegetacion: number | null;
    vegetacion: string | null;
    // Fundo
    idFundo: number;
    fundo: string | null;
    centroPoblado: string | null;
    // Punto/Contacto
    idPuntoContacto: number | null;
    puntoContacto: string | null;
    idContactoPunto: number | null;
    contactoPunto: string | null;
    // Gte/Colaborador
    idGte: number | null;
    idColaborador: number | null;
    colaborador: string | null;
    // Empresa/Negocio (ColaboradorJefe)
    idEmpresa: number | null;
    empresa: string | null;
    negocio: string | null;
    macrozona: string | null;
    // Ubigeo
    idDistrito: string | null;
    distrito: string | null;
    idProvincia: string | null;
    provincia: string | null;
    idDepartamento: string | null;
    departamento: string | null;
}

export interface AsesoresListResponse {
    page: number;
    pages: number;
    limit: number;
    total: number;
    asesores: AsesorItem[];
}
```

---

## 📊 2. Estadísticas para gráficas

**`GET /api/dashboards/asesores/stats`**

Retorna datos agrupados listos para gráficas (barras, donut, pie). Acepta los mismos filtros que el endpoint de lista (excepto `page` y `limit`).

### Ejemplo de petición

```ts
const { data } = await api.get('/api/dashboards/asesores/stats', {
    params: {
        idEmpresa: 3,
        negocio: 'Agro',
    },
});
```

### Respuesta exitosa (200)

```json
{
    "totalCultivos": 98,
    "totalHectareas": 1250.75,
    "asesoresUnicos": 24,
    "porDepartamento": [
        { "nombre": "Lima", "cantidad": 35 },
        { "nombre": "Ica", "cantidad": 22 },
        { "nombre": "La Libertad", "cantidad": 18 }
    ],
    "porVegetacion": [
        { "nombre": "Palto", "cantidad": 40 },
        { "nombre": "Uva", "cantidad": 30 },
        { "nombre": "Mango", "cantidad": 28 }
    ],
    "porEmpresa": [
        { "nombre": "HORTUS", "cantidad": 55 },
        { "nombre": "FARMEX", "cantidad": 43 }
    ],
    "porNegocio": [
        { "nombre": "Agro", "cantidad": 60 },
        { "nombre": "Especialidades", "cantidad": 38 }
    ],
    "porCargoAsesor": [
        { "nombre": "Ingeniero Agrónomo", "cantidad": 50 },
        { "nombre": "Técnico Agrícola", "cantidad": 30 },
        { "nombre": "Asesor Comercial", "cantidad": 18 }
    ],
    "porAsesor": [
        { "nombre": "Juan Pérez", "cantidad": 12 },
        { "nombre": "Ana Torres", "cantidad": 10 },
        { "nombre": "Luis Ríos", "cantidad": 8 }
    ],
    "rankingDemoplots": {
        "totalAsesoresConDemoplots": 18,
        "ranking": [
            {
                "posicion": 1,
                "nomAsesor": "Juan Pérez",
                "numAsesor": "987654321",
                "totalDemoplots": 15,
                "totalCultivos": 8
            },
            {
                "posicion": 2,
                "nomAsesor": "Ana Torres",
                "numAsesor": "912345678",
                "totalDemoplots": 12,
                "totalCultivos": 5
            },
            {
                "posicion": 3,
                "nomAsesor": "Luis Ríos",
                "numAsesor": "945678123",
                "totalDemoplots": 9,
                "totalCultivos": 6
            }
        ]
    }
}
```

### Interfaz TypeScript

```ts
export interface GroupCount {
    nombre: string;
    cantidad: number;
}

export interface RankingDemoplotItem {
    posicion: number;
    nomAsesor: string;
    numAsesor: string | null;
    totalDemoplots: number;
    totalCultivos: number;
}

export interface RankingDemoplots {
    totalAsesoresConDemoplots: number;
    ranking: RankingDemoplotItem[];
}

export interface AsesoresStatsResponse {
    totalCultivos: number;
    totalHectareas: number;
    asesoresUnicos: number;
    porDepartamento: GroupCount[];
    porVegetacion: GroupCount[];
    porEmpresa: GroupCount[];
    porNegocio: GroupCount[];
    porCargoAsesor: GroupCount[];
    porAsesor: GroupCount[];
    rankingDemoplots: RankingDemoplots;
}
```

### Ejemplo de uso con Chart.js / ApexCharts

```ts
// Gráfica de barras por departamento
const chartData = computed(() => ({
    labels: stats.value.porDepartamento.map((d) => d.nombre),
    datasets: [
        {
            label: 'Cultivos por Departamento',
            data: stats.value.porDepartamento.map((d) => d.cantidad),
        },
    ],
}));

// Gráfica donut por empresa
const donutData = computed(() => ({
    labels: stats.value.porEmpresa.map((e) => e.nombre),
    series: stats.value.porEmpresa.map((e) => e.cantidad),
}));
```

### Ejemplo de ranking de DemoPlots

```vue
<template>
    <div>
        <h3>Ranking de Participación en DemoPlots</h3>
        <p>
            Asesores con DemoPlots:
            {{ stats?.rankingDemoplots.totalAsesoresConDemoplots ?? 0 }}
        </p>
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Asesor</th>
                    <th>Celular</th>
                    <th>DemoPlots</th>
                    <th>Cultivos</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="item in stats?.rankingDemoplots.ranking"
                    :key="item.posicion"
                >
                    <td>{{ item.posicion }}</td>
                    <td>{{ item.nomAsesor }}</td>
                    <td>{{ item.numAsesor ?? '-' }}</td>
                    <td>{{ item.totalDemoplots }}</td>
                    <td>{{ item.totalCultivos }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
```

> **Nota sobre deduplicación:** El ranking identifica asesores únicos comparando `nomAsesor` en **minúsculas** (case-insensitive) + `numAsesor` (celular). Así, "JUAN PEREZ" y "Juan Perez" con el mismo número se cuentan como el mismo asesor. El nombre mostrado es la variante que aparece con mayor frecuencia.

---

## 🗺️ 3. Datos para mapa

**`GET /api/dashboards/asesores/map`**

Retorna cultivos agrupados por distrito con detalle, ideal para renderizar marcadores en un mapa de Perú (Leaflet, Google Maps, Mapbox). Acepta los mismos filtros.

### Ejemplo de petición

```ts
const { data } = await api.get('/api/dashboards/asesores/map', {
    params: {
        idEmpresa: 3,
        departamento: 'Lima',
    },
});
```

### Respuesta exitosa (200)

```json
{
    "totalUbicaciones": 12,
    "ubicaciones": [
        {
            "idDistrito": "150101",
            "distrito": "Lima",
            "idProvincia": "1501",
            "provincia": "Lima",
            "idDepartamento": "15",
            "departamento": "Lima",
            "totalCultivos": 8,
            "totalHectareas": 95.5,
            "totalAsesores": 3,
            "detalle": [
                {
                    "idCultivo": 142,
                    "nomAsesor": "Juan Pérez",
                    "numAsesor": "987654321",
                    "cargoAsesor": "Ingeniero Agrónomo",
                    "vegetacion": "Palto",
                    "variedad": "Hass",
                    "fundo": "Fundo San José",
                    "hectareas": 12.5,
                    "empresa": "HORTUS",
                    "negocio": "Agro"
                }
            ]
        }
    ]
}
```

### Interfaz TypeScript

```ts
export interface MapDetalleItem {
    idCultivo: number;
    nomAsesor: string | null;
    numAsesor: string | null;
    cargoAsesor: string | null;
    vegetacion: string | null;
    variedad: string | null;
    fundo: string | null;
    hectareas: number | null;
    empresa: string | null;
    negocio: string | null;
}

export interface MapUbicacion {
    idDistrito: string | null;
    distrito: string | null;
    idProvincia: string | null;
    provincia: string | null;
    idDepartamento: string | null;
    departamento: string | null;
    totalCultivos: number;
    totalHectareas: number;
    totalAsesores: number;
    detalle: MapDetalleItem[];
}

export interface AsesoresMapResponse {
    totalUbicaciones: number;
    ubicaciones: MapUbicacion[];
}
```

### Ejemplo con Leaflet

```ts
import L from 'leaflet';

// Mapa centrado en Perú
const map = L.map('map').setView([-9.19, -75.0152], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Para cada ubicación, usar GeoJSON de distritos del Perú
// o un diccionario de coordenadas por idDistrito
const coordsDistrito: Record<string, [number, number]> = {
    '150101': [-12.0464, -77.0428], // Lima
    '110101': [-14.0639, -75.7249], // Ica
    // ...cargar desde un JSON con todos los distritos
};

mapData.value.ubicaciones.forEach((ub) => {
    const coords = coordsDistrito[ub.idDistrito ?? ''];
    if (!coords) return;

    L.circleMarker(coords, {
        radius: Math.min(ub.totalCultivos * 2, 20),
        color: '#3b82f6',
        fillOpacity: 0.6,
    })
        .bindPopup(
            `<b>${ub.distrito}</b><br/>
       ${ub.provincia}, ${ub.departamento}<br/>
       Cultivos: ${ub.totalCultivos}<br/>
       Hectáreas: ${ub.totalHectareas}<br/>
       Asesores: ${ub.totalAsesores}`
        )
        .addTo(map);
});
```

---

## � 4. Exportar a Excel

**`GET /api/dashboards/asesores/export`**

Descarga un archivo Excel (.xlsx) con toda la información del dashboard. Acepta los mismos filtros que los demás endpoints. Si no se envían filtros, exporta todo.

El archivo contiene **3 hojas**:

| Hoja                    | Contenido                                                                                                 |
| ----------------------- | --------------------------------------------------------------------------------------------------------- |
| **Detalle Asesores**    | Listado completo con 23 columnas (asesor, cultivo, fundo, ubigeo, empresa, negocio, etc.) con autofiltro  |
| **Resumen Estadístico** | Totales generales + tablas de distribución por departamento, vegetación, empresa, negocio, cargo y asesor |
| **Ranking DemoPlots**   | Ranking de participación de asesores en DemoPlots (posición, nombre, celular, cantidad)                   |

### Ejemplo de petición

```ts
// Exportar con filtros (o sin filtros para exportar todo)
const exportarExcel = async (filtros: Record<string, any> = {}) => {
    const params = new URLSearchParams(
        Object.fromEntries(
            Object.entries(filtros).filter(
                ([, v]) => v !== undefined && v !== null && v !== ''
            )
        )
    ).toString();

    const url = `/api/dashboards/asesores/export${params ? `?${params}` : ''}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Error al exportar');

    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `asesores_dashboard_${new Date().toISOString().slice(0, 10)}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
};
```

### Ejemplo con axios (responseType blob)

```ts
const exportarExcelAxios = async (filtros: Record<string, any> = {}) => {
    const { data } = await api.get('/api/dashboards/asesores/export', {
        params: filtros,
        responseType: 'blob',
    });

    const url = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = `asesores_dashboard_${new Date().toISOString().slice(0, 10)}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
```

### Ejemplo de botón en Vue.js

```vue
<template>
    <button @click="handleExport" :disabled="exportando" class="btn-export">
        <span v-if="exportando">Exportando...</span>
        <span v-else>📥 Exportar Excel</span>
    </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAsesorDashboard } from '@/composables/useAsesorDashboard';

const { filters, exportExcel } = useAsesorDashboard();
const exportando = ref(false);

const handleExport = async () => {
    exportando.value = true;
    try {
        await exportExcel();
    } catch (e) {
        console.error('Error al exportar:', e);
    } finally {
        exportando.value = false;
    }
};
</script>
```

---

## �🔗 Cadena de relaciones (referencia)

```
Cultivo (nomAsesor, numAsesor, cargoAsesor)
  ├─ Variedad → Vegetacion
  ├─ DemoPlot[]                                    ← Ranking de participación
  └─ Fundo
      ├─ Distrito → Provincia → Departamento       ← Ubigeo para mapa
      ├─ PuntoContacto → Gte → Colaborador
      │   └─ ColaboradorJefe                        ← idEmpresa, negocio
      │       ├─ Empresa (nomEmpresa)
      │       └─ SuperZona (macrozona)
      ├─ ContactoPunto → Gte → Colaborador          ← Ruta alternativa
      │   └─ ColaboradorJefe
      └─ UbicacionCliente (codCliente)
```

---

## 🧩 Composable sugerido para Vue.js

```ts
// composables/useAsesorDashboard.ts
import { ref, reactive } from 'vue';
import api from '@/api'; // tu instancia de axios
import type {
    AsesorItem,
    AsesoresListResponse,
    AsesoresStatsResponse,
    AsesoresMapResponse,
    AsesorDashboardFilters,
} from '@/interfaces/asesor-dashboard';

export function useAsesorDashboard() {
    const loading = ref(false);
    const list = ref<AsesoresListResponse | null>(null);
    const stats = ref<AsesoresStatsResponse | null>(null);
    const mapData = ref<AsesoresMapResponse | null>(null);

    const filters = reactive<AsesorDashboardFilters>({
        idVegetacion: undefined,
        vegetacion: undefined,
        idVariedad: undefined,
        idPuntoContacto: undefined,
        idContactoPunto: undefined,
        codCliente: undefined,
        idColaborador: undefined,
        idGte: undefined,
        idEmpresa: undefined,
        negocio: undefined,
        departamento: undefined,
        provincia: undefined,
        distrito: undefined,
        nomAsesor: undefined,
        cargoAsesor: undefined,
    });

    const pagination = reactive({ page: 1, limit: 20 });

    // Limpiar undefined del objeto de params
    const cleanParams = (obj: Record<string, any>) =>
        Object.fromEntries(
            Object.entries(obj).filter(
                ([, v]) => v !== undefined && v !== null && v !== ''
            )
        );

    const fetchList = async () => {
        loading.value = true;
        try {
            const { data } = await api.get<AsesoresListResponse>(
                '/api/dashboards/asesores',
                { params: cleanParams({ ...filters, ...pagination }) }
            );
            list.value = data;
        } finally {
            loading.value = false;
        }
    };

    const fetchStats = async () => {
        loading.value = true;
        try {
            const { data } = await api.get<AsesoresStatsResponse>(
                '/api/dashboards/asesores/stats',
                { params: cleanParams({ ...filters }) }
            );
            stats.value = data;
        } finally {
            loading.value = false;
        }
    };

    const fetchMap = async () => {
        loading.value = true;
        try {
            const { data } = await api.get<AsesoresMapResponse>(
                '/api/dashboards/asesores/map',
                { params: cleanParams({ ...filters }) }
            );
            mapData.value = data;
        } finally {
            loading.value = false;
        }
    };

    const exportExcel = async () => {
        const { data } = await api.get('/api/dashboards/asesores/export', {
            params: cleanParams({ ...filters }),
            responseType: 'blob',
        });

        const url = URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.download = `asesores_dashboard_${new Date().toISOString().slice(0, 10)}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const fetchAll = async () => {
        loading.value = true;
        try {
            await Promise.all([fetchList(), fetchStats(), fetchMap()]);
        } finally {
            loading.value = false;
        }
    };

    const resetFilters = () => {
        Object.keys(filters).forEach((key) => {
            (filters as any)[key] = undefined;
        });
        pagination.page = 1;
    };

    return {
        loading,
        list,
        stats,
        mapData,
        filters,
        pagination,
        fetchList,
        fetchStats,
        fetchMap,
        exportExcel,
        fetchAll,
        resetFilters,
    };
}
```

### Interfaz de filtros para Vue.js

```ts
// interfaces/asesor-dashboard.ts
export interface AsesorDashboardFilters {
    idVegetacion?: number;
    vegetacion?: string;
    idVariedad?: number;
    idPuntoContacto?: number;
    idContactoPunto?: number;
    codCliente?: string;
    idColaborador?: number;
    idGte?: number;
    idEmpresa?: number;
    negocio?: string;
    departamento?: string;
    provincia?: string;
    distrito?: string;
    nomAsesor?: string;
    cargoAsesor?: string;
}
```

---

## ⚠️ Notas importantes

1. **Todos los filtros son opcionales** — sin filtros retorna todos los cultivos con asesor.
2. **Los filtros de texto** (`nomAsesor`, `vegetacion`, `departamento`, etc.) usan búsqueda parcial (`contains`).
3. **`idEmpresa` y `negocio`** provienen de `ColaboradorJefe` (la tabla que relaciona colaboradores con empresas y negocios), no directamente de la tabla `Colaborador`.
4. **El endpoint de mapa** agrupa por `idDistrito` — para mostrar marcadores/polígonos, necesitarás un archivo GeoJSON o diccionario de coordenadas de distritos del Perú.
5. **Paginación** solo aplica al endpoint de lista (`/`). Los endpoints `/stats`, `/map` y `/export` procesan todos los registros filtrados.
6. **Ranking de DemoPlots** — Identifica asesores únicos con comparación case-insensitive de `nomAsesor` + `numAsesor` como clave compuesta de deduplicación.
7. **Exportación Excel** — El endpoint `/export` retorna un archivo `.xlsx` con content-type `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`. Usar `responseType: 'blob'` en axios.
