import { QueryTypes } from 'sequelize';
import { sequelizeExactus } from '../../config';

export type SchemaType = 'tqc' | 'TALEX' | 'BIOGEN' | 'AGRAVENT';

/**
 * Valida si un esquema es válido (sin importar mayúsculas/minúsculas)
 * @param schema - Esquema a validar
 * @returns true si es válido, false si no
 */
export function isValidSchema(schema: string): boolean {
    return normalizeSchema(schema) !== null;
}

/**
 * Normaliza el nombre del esquema al formato correcto para las consultas SQL
 * @param schema - Esquema en cualquier formato de mayúsculas/minúsculas
 * @returns Esquema normalizado al formato correcto
 */
export function normalizeSchema(schema: string): SchemaType | null {
    const normalizedInput = schema.toLowerCase().trim();

    switch (normalizedInput) {
        case 'tqc':
            return 'tqc';
        case 'talex':
            return 'TALEX';
        case 'biogen':
            return 'BIOGEN';
        case 'agravent':
            return 'AGRAVENT';
        default:
            return null;
    }
}

interface DireccionEntrega {
    DETALLE_DIRECCION: string;
    CLIENTE: string;
    NOMBRE: string;
    ubigeoId: string;
    departamento: string;
    provincia: string;
    distrito: string;
    direccion: string;
    CAMPO_2: string;
}

interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export class DireccionEntregaSequelizeService {
    /**
     * Obtiene todas las direcciones de entrega por esquema
     * @param schema - Esquema de la base de datos (tqc, TALEX, BIOGEN, AGRAVENT)
     * @param search - Término de búsqueda para filtrar por CLIENTE o NOMBRE (opcional)
     * @returns Lista de direcciones de entrega con información del cliente
     */
    static async getDireccionesEntregaBySchema(
        schema: SchemaType,
        search?: string
    ): Promise<ServiceResponse<DireccionEntrega[]>> {
        try {
            // Normalizar y validar el esquema
            const normalizedSchema = normalizeSchema(schema);
            if (!normalizedSchema) {
                return {
                    success: false,
                    message:
                        'Schema no válido. Debe ser: tqc, TALEX, BIOGEN o AGRAVENT (no sensible a mayúsculas)',
                };
            }

            // Construir la cláusula WHERE con filtro de búsqueda opcional
            let whereClause = "WHERE C.ACTIVO = 'S'";
            const replacements: any = {};

            if (search && search.trim()) {
                whereClause +=
                    ' AND (C.CLIENTE LIKE :searchTerm OR C.NOMBRE LIKE :searchTerm)';
                replacements.searchTerm = `%${search.trim()}%`;
            }

            // Consulta SQL específica con reemplazo del esquema normalizado
            const query = `
        SELECT 
          DD.DETALLE_DIRECCION,
          DE.CLIENTE,
          C.NOMBRE,
          DD.CAMPO_5 AS ubigeoId,
          DD.CAMPO_6 AS departamento,
          DD.CAMPO_7 AS provincia,
          DD.CAMPO_8 AS distrito,
          DD.CAMPO_1 AS direccion,
          DD.CAMPO_2 
        FROM ${normalizedSchema}.DETALLE_DIRECCION DD
        INNER JOIN ${normalizedSchema}.DIRECC_EMBARQUE DE ON DE.DETALLE_DIRECCION = DD.DETALLE_DIRECCION
        INNER JOIN ${normalizedSchema}.CLIENTE C ON C.CLIENTE = DE.CLIENTE
        ${whereClause}
        ORDER BY C.NOMBRE, DD.DETALLE_DIRECCION
      `;

            const result = await sequelizeExactus.query<DireccionEntrega>(
                query,
                {
                    type: QueryTypes.SELECT,
                    replacements,
                }
            );

            return {
                success: true,
                data: result,
                message: search
                    ? `${result.length} direcciones de entrega encontradas del esquema ${normalizedSchema} con búsqueda: "${search}"`
                    : `${result.length} direcciones de entrega obtenidas del esquema ${normalizedSchema}`,
            };
        } catch (error) {
            console.error(
                'Error en DireccionEntregaSequelizeService.getDireccionesEntregaBySchema:',
                error
            );
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : 'Error desconocido',
            };
        }
    }

    /**
     * Obtiene direcciones de entrega filtradas por cliente específico
     * @param schema - Esquema de la base de datos
     * @param clienteCode - Código del cliente
     * @returns Lista de direcciones de entrega del cliente
     */
    static async getDireccionesEntregaByCliente(
        schema: SchemaType,
        clienteCode: string
    ): Promise<ServiceResponse<DireccionEntrega[]>> {
        try {
            // Normalizar y validar el esquema
            const normalizedSchema = normalizeSchema(schema);
            if (!normalizedSchema) {
                return {
                    success: false,
                    message:
                        'Schema no válido. Debe ser: tqc, TALEX, BIOGEN o AGRAVENT (no sensible a mayúsculas)',
                };
            }

            const query = `
        SELECT 
          DD.DETALLE_DIRECCION,
          DE.CLIENTE,
          C.NOMBRE,
          DD.CAMPO_5 AS ubigeoId,
          DD.CAMPO_6 AS departamento,
          DD.CAMPO_7 AS provincia,
          DD.CAMPO_8 AS distrito,
          DD.CAMPO_1 AS direccion,
          DD.CAMPO_2 
        FROM ${normalizedSchema}.DETALLE_DIRECCION DD
        INNER JOIN ${normalizedSchema}.DIRECC_EMBARQUE DE ON DE.DETALLE_DIRECCION = DD.DETALLE_DIRECCION
        INNER JOIN ${normalizedSchema}.CLIENTE C ON C.CLIENTE = DE.CLIENTE
        WHERE C.ACTIVO = 'S' AND C.CLIENTE = :cliente
        ORDER BY DD.DETALLE_DIRECCION
      `;

            const result = await sequelizeExactus.query<DireccionEntrega>(
                query,
                {
                    type: QueryTypes.SELECT,
                    replacements: { cliente: clienteCode },
                }
            );

            if (result.length === 0) {
                return {
                    success: false,
                    message: `No se encontraron direcciones de entrega para el cliente ${clienteCode} en el esquema ${normalizedSchema}`,
                };
            }

            return {
                success: true,
                data: result,
                message: `${result.length} direcciones de entrega encontradas para el cliente ${clienteCode}`,
            };
        } catch (error) {
            console.error(
                'Error en DireccionEntregaSequelizeService.getDireccionesEntregaByCliente:',
                error
            );
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : 'Error desconocido',
            };
        }
    }

    /**
     * Busca direcciones de entrega en todos los esquemas disponibles
     * @param clienteCode - Código del cliente (opcional)
     * @param search - Término de búsqueda para filtrar por CLIENTE o NOMBRE (opcional)
     * @returns Direcciones encontradas con el esquema correspondiente
     */
    static async findDireccionesInAllSchemas(
        clienteCode?: string,
        search?: string
    ): Promise<ServiceResponse<(DireccionEntrega & { schema: SchemaType })[]>> {
        try {
            const schemas: SchemaType[] = [
                'tqc',
                'TALEX',
                'BIOGEN',
                'AGRAVENT',
            ];
            const allDirecciones: (DireccionEntrega & {
                schema: SchemaType;
            })[] = [];

            for (const schema of schemas) {
                try {
                    let result: ServiceResponse<DireccionEntrega[]>;

                    if (clienteCode) {
                        result = await this.getDireccionesEntregaByCliente(
                            schema,
                            clienteCode
                        );
                    } else {
                        result = await this.getDireccionesEntregaBySchema(
                            schema,
                            search
                        );
                    }

                    if (result.success && result.data) {
                        const direccionesWithSchema = result.data.map(
                            (direccion) => ({
                                ...direccion,
                                schema,
                            })
                        );
                        allDirecciones.push(...direccionesWithSchema);
                    }
                } catch (error) {
                    console.warn(`Error consultando esquema ${schema}:`, error);
                    // Continúa con el siguiente esquema
                }
            }

            if (allDirecciones.length === 0) {
                let message =
                    'No se encontraron direcciones de entrega en ningún esquema';
                if (clienteCode) {
                    message = `No se encontraron direcciones para el cliente ${clienteCode} en ningún esquema`;
                } else if (search) {
                    message = `No se encontraron direcciones con la búsqueda "${search}" en ningún esquema`;
                }

                return {
                    success: false,
                    message,
                };
            }

            let message = `${allDirecciones.length} direcciones de entrega encontradas en ${schemas.length} esquemas`;
            if (clienteCode) {
                message = `${allDirecciones.length} direcciones encontradas para el cliente ${clienteCode}`;
            } else if (search) {
                message = `${allDirecciones.length} direcciones encontradas con la búsqueda "${search}"`;
            }

            return {
                success: true,
                data: allDirecciones,
                message,
            };
        } catch (error) {
            console.error(
                'Error en DireccionEntregaSequelizeService.findDireccionesInAllSchemas:',
                error
            );
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : 'Error desconocido',
            };
        }
    }

    /**
     * Obtiene una dirección de entrega específica por su ID
     * @param schema - Esquema de la base de datos
     * @param detalleId - ID del detalle de dirección
     * @returns Dirección de entrega específica
     */
    static async getDireccionEntregaById(
        schema: SchemaType,
        detalleId: string
    ): Promise<ServiceResponse<DireccionEntrega>> {
        try {
            // Normalizar y validar el esquema
            const normalizedSchema = normalizeSchema(schema);
            if (!normalizedSchema) {
                return {
                    success: false,
                    message:
                        'Schema no válido. Debe ser: tqc, TALEX, BIOGEN o AGRAVENT (no sensible a mayúsculas)',
                };
            }

            const query = `
        SELECT 
          DD.DETALLE_DIRECCION,
          DE.CLIENTE,
          C.NOMBRE,
          DD.CAMPO_5 AS ubigeoId,
          DD.CAMPO_6 AS departamento,
          DD.CAMPO_7 AS provincia,
          DD.CAMPO_8 AS distrito,
          DD.CAMPO_1 AS direccion,
          DD.CAMPO_2 
        FROM ${normalizedSchema}.DETALLE_DIRECCION DD
        INNER JOIN ${normalizedSchema}.DIRECC_EMBARQUE DE ON DE.DETALLE_DIRECCION = DD.DETALLE_DIRECCION
        INNER JOIN ${normalizedSchema}.CLIENTE C ON C.CLIENTE = DE.CLIENTE
        WHERE C.ACTIVO = 'S' AND DD.DETALLE_DIRECCION = :detalleId
      `;

            const result = await sequelizeExactus.query<DireccionEntrega>(
                query,
                {
                    type: QueryTypes.SELECT,
                    replacements: { detalleId },
                }
            );

            if (result.length === 0) {
                return {
                    success: false,
                    message: `Dirección de entrega ${detalleId} no encontrada en el esquema ${normalizedSchema}`,
                };
            }

            return {
                success: true,
                data: result[0],
                message: `Dirección de entrega ${detalleId} obtenida exitosamente`,
            };
        } catch (error) {
            console.error(
                'Error en DireccionEntregaSequelizeService.getDireccionEntregaById:',
                error
            );
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : 'Error desconocido',
            };
        }
    }

    /**
     * Obtiene estadísticas de direcciones de entrega por esquema
     * @param schema - Esquema de la base de datos
     * @returns Estadísticas del esquema
     */
    static async getEstadisticasDirecciones(schema: SchemaType): Promise<
        ServiceResponse<{
            totalDirecciones: number;
            totalClientes: number;
            promedioClienteDirecciones: number;
        }>
    > {
        try {
            // Normalizar y validar el esquema
            const normalizedSchema = normalizeSchema(schema);
            if (!normalizedSchema) {
                return {
                    success: false,
                    message:
                        'Schema no válido. Debe ser: tqc, TALEX, BIOGEN o AGRAVENT (no sensible a mayúsculas)',
                };
            }

            const query = `
        SELECT 
          COUNT(DD.DETALLE_DIRECCION) as totalDirecciones,
          COUNT(DISTINCT DE.CLIENTE) as totalClientes,
          CASE 
            WHEN COUNT(DISTINCT DE.CLIENTE) > 0 
            THEN CAST(COUNT(DD.DETALLE_DIRECCION) AS FLOAT) / COUNT(DISTINCT DE.CLIENTE)
            ELSE 0 
          END as promedioClienteDirecciones
        FROM ${normalizedSchema}.DETALLE_DIRECCION DD
        INNER JOIN ${normalizedSchema}.DIRECC_EMBARQUE DE ON DE.DETALLE_DIRECCION = DD.DETALLE_DIRECCION
        INNER JOIN ${normalizedSchema}.CLIENTE C ON C.CLIENTE = DE.CLIENTE
        WHERE C.ACTIVO = 'S'
      `;

            const result = await sequelizeExactus.query<any>(query, {
                type: QueryTypes.SELECT,
            });

            if (result.length === 0) {
                return {
                    success: false,
                    message: `No se pudieron obtener estadísticas del esquema ${normalizedSchema}`,
                };
            }

            const stats = result[0];

            return {
                success: true,
                data: {
                    totalDirecciones: parseInt(stats.totalDirecciones) || 0,
                    totalClientes: parseInt(stats.totalClientes) || 0,
                    promedioClienteDirecciones:
                        parseFloat(stats.promedioClienteDirecciones) || 0,
                },
                message: `Estadísticas obtenidas exitosamente para el esquema ${normalizedSchema}`,
            };
        } catch (error) {
            console.error(
                'Error en DireccionEntregaSequelizeService.getEstadisticasDirecciones:',
                error
            );
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : 'Error desconocido',
            };
        }
    }
}
