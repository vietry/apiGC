import { Request, Response } from 'express';
import {
    DireccionEntregaSequelizeService,
    SchemaType,
    isValidSchema,
    normalizeSchema,
} from '../services/direccion-entrega-sequelize.service';

export class DireccionEntregaController {
    /**
     * Obtiene todas las direcciones de entrega por esquema
     * GET /api/direcciones-entrega/:schema
     * GET /api/direcciones-entrega/:schema?search=TERMINO_BUSQUEDA
     */
    static async getDireccionesEntregaBySchema(req: Request, res: Response) {
        try {
            const { schema } = req.params;
            const { search } = req.query;

            // Validar que el parámetro schema esté presente
            if (!schema) {
                return res.status(400).json({
                    success: false,
                    message: 'El parámetro schema es requerido',
                });
            }

            // Validar que sea un schema válido
            if (!isValidSchema(schema)) {
                return res.status(400).json({
                    success: false,
                    message:
                        'Schema no válido. Debe ser: tqc, TALEX, BIOGEN o AGRAVENT (no sensible a mayúsculas)',
                });
            }

            const normalizedSchema = normalizeSchema(schema) as SchemaType;

            const result =
                await DireccionEntregaSequelizeService.getDireccionesEntregaBySchema(
                    normalizedSchema,
                    search as string
                );

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json(result);
        } catch (error) {
            console.error('Error en getDireccionesEntregaBySchema:', error);
            return res.status(500).json({
                success: false,
                error: 'Error interno del servidor',
                message:
                    error instanceof Error
                        ? error.message
                        : 'Error desconocido',
            });
        }
    }

    /**
     * Obtiene direcciones de entrega de un cliente específico en un esquema
     * GET /api/direcciones-entrega/:schema/cliente/:clienteCode
     */
    static async getDireccionesEntregaByCliente(req: Request, res: Response) {
        try {
            const { schema, clienteCode } = req.params;

            // Validaciones
            if (!schema || !clienteCode) {
                return res.status(400).json({
                    success: false,
                    message:
                        'Los parámetros schema y clienteCode son requeridos',
                });
            }

            if (!isValidSchema(schema)) {
                return res.status(400).json({
                    success: false,
                    message:
                        'Schema no válido. Debe ser: tqc, TALEX, BIOGEN o AGRAVENT (no sensible a mayúsculas)',
                });
            }

            const normalizedSchema = normalizeSchema(schema) as SchemaType;

            const result =
                await DireccionEntregaSequelizeService.getDireccionesEntregaByCliente(
                    normalizedSchema,
                    clienteCode
                );

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json(result);
        } catch (error) {
            console.error('Error en getDireccionesEntregaByCliente:', error);
            return res.status(500).json({
                success: false,
                error: 'Error interno del servidor',
                message:
                    error instanceof Error
                        ? error.message
                        : 'Error desconocido',
            });
        }
    }

    /**
     * Busca direcciones de entrega en todos los esquemas
     * GET /api/direcciones-entrega/all
     * GET /api/direcciones-entrega/all?cliente=CODIGO_CLIENTE
     * GET /api/direcciones-entrega/all?search=TERMINO_BUSQUEDA
     * GET /api/direcciones-entrega/all?cliente=CODIGO_CLIENTE&search=TERMINO_BUSQUEDA
     */
    static async findDireccionesInAllSchemas(req: Request, res: Response) {
        try {
            const { cliente, search } = req.query;

            const result =
                await DireccionEntregaSequelizeService.findDireccionesInAllSchemas(
                    cliente as string,
                    search as string
                );

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json(result);
        } catch (error) {
            console.error('Error en findDireccionesInAllSchemas:', error);
            return res.status(500).json({
                success: false,
                error: 'Error interno del servidor',
                message:
                    error instanceof Error
                        ? error.message
                        : 'Error desconocido',
            });
        }
    }

    /**
     * Obtiene una dirección de entrega específica por ID
     * GET /api/direcciones-entrega/:schema/detalle/:detalleId
     */
    static async getDireccionEntregaById(req: Request, res: Response) {
        try {
            const { schema, detalleId } = req.params;

            // Validaciones
            if (!schema || !detalleId) {
                return res.status(400).json({
                    success: false,
                    message: 'Los parámetros schema y detalleId son requeridos',
                });
            }

            if (!isValidSchema(schema)) {
                return res.status(400).json({
                    success: false,
                    message:
                        'Schema no válido. Debe ser: tqc, TALEX, BIOGEN o AGRAVENT (no sensible a mayúsculas)',
                });
            }

            const normalizedSchema = normalizeSchema(schema) as SchemaType;

            const result =
                await DireccionEntregaSequelizeService.getDireccionEntregaById(
                    normalizedSchema,
                    detalleId
                );

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json(result);
        } catch (error) {
            console.error('Error en getDireccionEntregaById:', error);
            return res.status(500).json({
                success: false,
                error: 'Error interno del servidor',
                message:
                    error instanceof Error
                        ? error.message
                        : 'Error desconocido',
            });
        }
    }

    /**
     * Obtiene estadísticas de direcciones de entrega por esquema
     * GET /api/direcciones-entrega/:schema/estadisticas
     */
    static async getEstadisticasDirecciones(req: Request, res: Response) {
        try {
            const { schema } = req.params;

            // Validar que el parámetro schema esté presente
            if (!schema) {
                return res.status(400).json({
                    success: false,
                    message: 'El parámetro schema es requerido',
                });
            }

            if (!isValidSchema(schema)) {
                return res.status(400).json({
                    success: false,
                    message:
                        'Schema no válido. Debe ser: tqc, TALEX, BIOGEN o AGRAVENT (no sensible a mayúsculas)',
                });
            }

            const normalizedSchema = normalizeSchema(schema) as SchemaType;

            const result =
                await DireccionEntregaSequelizeService.getEstadisticasDirecciones(
                    normalizedSchema
                );

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json(result);
        } catch (error) {
            console.error('Error en getEstadisticasDirecciones:', error);
            return res.status(500).json({
                success: false,
                error: 'Error interno del servidor',
                message:
                    error instanceof Error
                        ? error.message
                        : 'Error desconocido',
            });
        }
    }

    /**
     * Obtiene estadísticas consolidadas de todos los esquemas
     * GET /api/direcciones-entrega/estadisticas/consolidadas
     */
    static async getEstadisticasConsolidadas(req: Request, res: Response) {
        try {
            const schemas: SchemaType[] = [
                'tqc',
                'TALEX',
                'BIOGEN',
                'AGRAVENT',
            ];
            const estadisticasConsolidadas: any = {
                success: true,
                data: {
                    totalGeneral: {
                        direcciones: 0,
                        clientes: 0,
                        promedio: 0,
                    },
                    porEsquema: {},
                },
                message: 'Estadísticas consolidadas obtenidas exitosamente',
            };

            let totalDirecciones = 0;
            let totalClientes = 0;

            for (const schema of schemas) {
                try {
                    const result =
                        await DireccionEntregaSequelizeService.getEstadisticasDirecciones(
                            schema
                        );

                    if (result.success && result.data) {
                        estadisticasConsolidadas.data.porEsquema[schema] =
                            result.data;
                        totalDirecciones += result.data.totalDirecciones;
                        totalClientes += result.data.totalClientes;
                    } else {
                        estadisticasConsolidadas.data.porEsquema[schema] = {
                            totalDirecciones: 0,
                            totalClientes: 0,
                            promedioClienteDirecciones: 0,
                            error: result.message || 'No disponible',
                        };
                    }
                } catch (error) {
                    console.warn(
                        `Error obteniendo estadísticas para ${schema}:`,
                        error
                    );
                    estadisticasConsolidadas.data.porEsquema[schema] = {
                        totalDirecciones: 0,
                        totalClientes: 0,
                        promedioClienteDirecciones: 0,
                        error: 'Error de conexión',
                    };
                }
            }

            // Calcular totales generales
            estadisticasConsolidadas.data.totalGeneral.direcciones =
                totalDirecciones;
            estadisticasConsolidadas.data.totalGeneral.clientes = totalClientes;
            estadisticasConsolidadas.data.totalGeneral.promedio =
                totalClientes > 0 ? totalDirecciones / totalClientes : 0;

            return res.status(200).json(estadisticasConsolidadas);
        } catch (error) {
            console.error('Error en getEstadisticasConsolidadas:', error);
            return res.status(500).json({
                success: false,
                error: 'Error interno del servidor',
                message:
                    error instanceof Error
                        ? error.message
                        : 'Error desconocido',
            });
        }
    }
}
