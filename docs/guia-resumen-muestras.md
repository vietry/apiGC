# Guía de endpoint: Resumen de Muestras

## Ruta y método

-   Método: GET
-   Ruta: `/familias/resumen-muestras`

Este endpoint devuelve un resumen de muestras entregadas y consumidas, agrupado jerárquicamente por:
Empresa → Negocio → Macrozona → Colaborador (jefe del GTE) → GTE → Familia.

Se excluyen automáticamente las familias con `clase = "VETSAN"`.

## Parámetros de consulta (query)

-   `idGte` (number, opcional): filtra por el ID del GTE.
-   `idFamilia` (number, opcional): filtra por el ID de la familia.
-   `idColaborador` (number, opcional): filtra por el ID del colaborador jefe asociado al GTE.
-   `empresa` (string, opcional): nombre parcial de la empresa (coincidencia `contains`).
-   `negocio` (string, opcional): nombre parcial del negocio (coincidencia `contains`).
-   `macrozona` (number, opcional): ID de la SuperZona (macrozona) del colaborador.
-   `activo` (boolean, opcional): estado del GTE. Acepta `true|false|1|0`.

Notas:

-   Todos los filtros se combinan con lógica AND (intersección). Es decir, al enviar varios, se aplican todos simultáneamente.
-   `empresa` y `negocio` usan coincidencia parcial (contains).

## Ejemplos de uso

-   Sin filtros (todo):
    -   `GET /familias/resumen-muestras`
-   Por macrozona:
    -   `GET /familias/resumen-muestras?macrozona=4`
-   Por colaborador jefe (idColaborador):
    -   `GET /familias/resumen-muestras?idColaborador=6`
-   Encadenado macrozona + idColaborador:
    -   `GET /familias/resumen-muestras?macrozona=4&idColaborador=6`
-   Empresa parcial + activo:
    -   `GET /familias/resumen-muestras?empresa=AGRO&activo=true`

## Estructura de respuesta

Respuesta `200 OK`: arreglo de empresas con la siguiente estructura resumida:

```json
[
    {
        "empresaId": 1,
        "empresaNombre": "Empresa X",
        "negocios": [
            {
                "negocio": "Cultivos",
                "macrozonas": [
                    {
                        "macrozonaId": 4,
                        "macrozonaNombre": "Norte",
                        "colaboradores": [
                            {
                                "colaboradorId": 6,
                                "colaboradorNombre": "Juan Pérez",
                                "gtes": [
                                    {
                                        "gteId": 101,
                                        "gteNombre": "María López",
                                        "familias": [
                                            {
                                                "familiaId": 23,
                                                "familiaNombre": "Fungicidas",
                                                "familiaCodigo": "FNG-01",
                                                "entregadoUnidades": 120.5,
                                                "entregadoTotal": 3400.0,
                                                "consumido": 85.25
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
]
```

Campos numéricos se devuelven con dos decimales en: `entregadoUnidades`, `entregadoTotal`, `consumido`.

## Consideraciones de filtros

-   Los filtros aplican tanto a las entregas como a los consumos a través de un único objeto de criterios de GTE/Colaborador (AND), por lo que combinaciones como `macrozona` + `idColaborador` funcionan correctamente.
-   Si envías `idFamilia`, además del filtro en la consulta, la agregación también filtra la lista de familias mostradas.

## Códigos de respuesta

-   `200 OK`: respuesta con datos.
-   `500 Internal Server Error`: error inesperado (ver logs del servidor).

## Cambios recientes

-   Se unificaron criterios de filtrado del GTE y del Colaborador para evitar sobrescrituras entre filtros (por ejemplo, `macrozona` + `idColaborador`).
