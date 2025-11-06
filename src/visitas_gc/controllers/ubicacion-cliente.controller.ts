import { Request, Response } from 'express';
import {
    UbicacionClienteService,
    UbicacionClienteFilters,
    UbicacionClienteCreateInput,
    UbicacionClienteUpdateInput,
} from '../services/ubicacion-cliente.service';

export class UbicacionClienteController {
    private handleError(res: Response, error: any) {
        console.error('Error en UbicacionClienteController:', error);
        return res.status(500).json({
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Error interno del servidor',
        });
    }

    private handleResponse(res: Response, result: any) {
        if (result.success) {
            return res.json(result);
        } else {
            const statusCode =
                result.message?.includes('no encontrada') ||
                result.message?.includes('No se encontraron')
                    ? 404
                    : 400;
            return res.status(statusCode).json(result);
        }
    }

    /**
     * Obtiene todas las ubicaciones de cliente con filtros opcionales
     */
    getAll = async (req: Request, res: Response) => {
        try {
            const {
                cliente,
                esquema,
                vigente,
                search,
                departamento,
                provincia,
                distrito,
            } = req.query as any;

            const filters: UbicacionClienteFilters = {};

            if (cliente) filters.cliente = cliente;
            if (esquema) filters.esquema = esquema;
            if (vigente !== undefined) {
                filters.vigente = vigente === 'true' || vigente === '1';
            }
            if (search) filters.search = search;
            if (departamento) filters.departamento = departamento;
            if (provincia) filters.provincia = provincia;
            if (distrito) filters.distrito = distrito;

            const result = await UbicacionClienteService.getUbicacionesCliente(
                filters
            );
            this.handleResponse(res, result);
        } catch (error) {
            this.handleError(res, error);
        }
    };

    /**
     * Obtiene una ubicación de cliente por ID
     */
    getById = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    error: 'ID inválido',
                });
            }

            const result =
                await UbicacionClienteService.getUbicacionClienteById(id);
            this.handleResponse(res, result);
        } catch (error) {
            this.handleError(res, error);
        }
    };

    /**
     * Obtiene ubicaciones de cliente por código de cliente
     */
    getByCliente = async (req: Request, res: Response) => {
        try {
            const { clienteCode } = req.params;
            const { esquema } = req.query as any;

            if (!clienteCode) {
                return res.status(400).json({
                    success: false,
                    error: 'Código de cliente requerido',
                });
            }

            const result =
                await UbicacionClienteService.getUbicacionesByCliente(
                    clienteCode,
                    esquema
                );
            this.handleResponse(res, result);
        } catch (error) {
            this.handleError(res, error);
        }
    };

    /**
     * Obtiene ubicaciones de cliente por esquema
     */
    getByEsquema = async (req: Request, res: Response) => {
        try {
            const { esquema } = req.params;

            if (!esquema) {
                return res.status(400).json({
                    success: false,
                    error: 'Esquema requerido',
                });
            }

            const result =
                await UbicacionClienteService.getUbicacionesByEsquema(esquema);
            this.handleResponse(res, result);
        } catch (error) {
            this.handleError(res, error);
        }
    };

    /**
     * Crea una nueva ubicación de cliente
     */
    create = async (req: Request, res: Response) => {
        try {
            const {
                cliente,
                detalleDireccion,
                nombre,
                ubigeoId,
                departamento,
                provincia,
                distrito,
                direccion1,
                direccion2,
                vigente,
                esquema,
            } = req.body;

            // Validaciones básicas
            if (!cliente || !esquema) {
                return res.status(400).json({
                    success: false,
                    error: 'Los campos cliente y esquema son requeridos',
                });
            }

            // detalleDireccion es opcional y puede ser null; si viene como número, validar > 0
            if (detalleDireccion !== undefined && detalleDireccion !== null) {
                if (
                    typeof detalleDireccion !== 'number' ||
                    detalleDireccion <= 0
                ) {
                    return res.status(400).json({
                        success: false,
                        error: 'detalleDireccion debe ser un número válido mayor a 0 o null',
                    });
                }
            }

            const createData: UbicacionClienteCreateInput = {
                cliente,
                // si no viene, Prisma insertará null por defecto si el schema lo permite
                detalleDireccion: detalleDireccion ?? null,
                esquema,
                nombre,
                ubigeoId,
                departamento,
                provincia,
                distrito,
                direccion1,
                direccion2,
                vigente,
            };

            const result = await UbicacionClienteService.createUbicacionCliente(
                createData
            );

            if (result.success) {
                return res.status(201).json(result);
            } else {
                this.handleResponse(res, result);
            }
        } catch (error) {
            this.handleError(res, error);
        }
    };

    private buildUpdateData(body: any): {
        updateData: UbicacionClienteUpdateInput;
        error?: string;
    } {
        const updateData: UbicacionClienteUpdateInput = {};

        // Campos simples que se copian si vienen definidos
        const simpleFields: Array<keyof UbicacionClienteUpdateInput> = [
            'cliente',
            'nombre',
            'ubigeoId',
            'departamento',
            'provincia',
            'distrito',
            'direccion1',
            'direccion2',
            'vigente',
            'esquema',
        ];

        for (const key of simpleFields) {
            if (key in body) {
                (updateData as any)[key] = body[key as string];
            }
        }

        // Validación específica de detalleDireccion (puede ser null o número > 0)
        if ('detalleDireccion' in body) {
            const dd = body.detalleDireccion;
            if (dd !== null && (typeof dd !== 'number' || dd <= 0)) {
                return {
                    updateData,
                    error: 'detalleDireccion debe ser un número válido mayor a 0 o null',
                };
            }
            updateData.detalleDireccion = dd;
        }

        return { updateData };
    }

    /**
     * Actualiza una ubicación de cliente
     */
    update = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    error: 'ID inválido',
                });
            }

            const { updateData, error } = this.buildUpdateData(req.body);

            if (error) {
                return res.status(400).json({
                    success: false,
                    error,
                });
            }

            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'No se proporcionaron datos para actualizar',
                });
            }

            const result = await UbicacionClienteService.updateUbicacionCliente(
                id,
                updateData
            );
            this.handleResponse(res, result);
        } catch (error) {
            this.handleError(res, error);
        }
    };

    /**
     * Elimina (marca como no vigente) una ubicación de cliente
     */
    delete = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    error: 'ID inválido',
                });
            }

            const result = await UbicacionClienteService.deleteUbicacionCliente(
                id
            );
            this.handleResponse(res, result);
        } catch (error) {
            this.handleError(res, error);
        }
    };

    /**
     * Obtiene estadísticas de ubicaciones de cliente
     */
    getEstadisticas = async (req: Request, res: Response) => {
        try {
            const { esquema } = req.query as any;

            const result =
                await UbicacionClienteService.getEstadisticasUbicaciones(
                    esquema
                );
            this.handleResponse(res, result);
        } catch (error) {
            this.handleError(res, error);
        }
    };

    /**
     * Busca ubicaciones de cliente con término de búsqueda flexible
     */
    search = async (req: Request, res: Response) => {
        try {
            const { term } = req.params;
            const { esquema } = req.query as any;

            if (!term || term.trim().length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Término de búsqueda requerido',
                });
            }

            const result = await UbicacionClienteService.searchUbicaciones(
                term.trim(),
                esquema
            );
            this.handleResponse(res, result);
        } catch (error) {
            this.handleError(res, error);
        }
    };
}
