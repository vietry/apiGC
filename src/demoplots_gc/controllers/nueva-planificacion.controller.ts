import { Request, Response } from 'express';
import { CustomError } from '../../domain';
import { NuevaPlanificacionService } from '../services/nueva-planificacion.service';

export class NuevaPlanificacionController {
    constructor(
        private readonly nuevaPlanificacionService: NuevaPlanificacionService
    ) {}

    getAllNuevaPlanificaciones = async (req: Request, res: Response) => {
        try {
            const {
                activo,
                search,
                idColaborador,
                mes,
                gteId,
                tiendaId,
                vegetacionId,
                momentoAplicaId,
                productoId,
                blancoId,
                estado,
                checkJefe,
                year,
                month,
                idMacrozona,
                idEmpresa,
                limit,
                page,
            } = req.query;

            const params = {
                activo: activo as string,
                search: search as string,
                idColaborador: idColaborador
                    ? parseInt(idColaborador as string)
                    : undefined,
                mes: mes ? parseInt(mes as string) : undefined,
                gteId: gteId ? parseInt(gteId as string) : undefined,
                tiendaId: tiendaId ? parseInt(tiendaId as string) : undefined,
                vegetacionId: vegetacionId
                    ? parseInt(vegetacionId as string)
                    : undefined,
                momentoAplicaId: momentoAplicaId
                    ? parseInt(momentoAplicaId as string)
                    : undefined,
                productoId: productoId
                    ? parseInt(productoId as string)
                    : undefined,
                blancoId: blancoId ? parseInt(blancoId as string) : undefined,
                estado: estado as string,
                checkJefe: checkJefe ? checkJefe === 'true' : undefined,
                year: year ? parseInt(year as string) : undefined,
                month: month ? parseInt(month as string) : undefined,
                idMacrozona: idMacrozona
                    ? parseInt(idMacrozona as string)
                    : undefined,
                idEmpresa: idEmpresa
                    ? parseInt(idEmpresa as string)
                    : undefined,
                limit: limit ? parseInt(limit as string) : undefined,
                page: page ? parseInt(page as string) : undefined,
            };

            const result =
                await this.nuevaPlanificacionService.getAllNuevaPlanificaciones(
                    params
                );

            return res.status(200).json({
                ok: true,
                data: result.data,
                pagination: result.pagination,
                statistics: result.statistics,
                planificacionStats: result.planificacionStats,
            });
        } catch (error) {
            if (error instanceof CustomError) {
                return res.status(error.statusCode).json({
                    ok: false,
                    message: error.message,
                });
            }
            return res.status(500).json({
                ok: false,
                message: 'Error interno del servidor',
            });
        }
    };

    getNuevaPlanificacionById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const planificacion =
                await this.nuevaPlanificacionService.getNuevaPlanificacionById(
                    parseInt(id)
                );

            return res.status(200).json({
                ok: true,
                data: planificacion,
            });
        } catch (error) {
            if (error instanceof CustomError) {
                return res.status(error.statusCode).json({
                    ok: false,
                    message: error.message,
                });
            }
            return res.status(500).json({
                ok: false,
                message: 'Error interno del servidor',
            });
        }
    };

    createNuevaPlanificacion = async (req: Request, res: Response) => {
        try {
            const data = req.body;
            const planificacion =
                await this.nuevaPlanificacionService.createNuevaPlanificacion(
                    data
                );

            return res.status(201).json({
                ok: true,
                data: planificacion,
                message: 'Planificación creada exitosamente',
            });
        } catch (error) {
            if (error instanceof CustomError) {
                return res.status(error.statusCode).json({
                    ok: false,
                    message: error.message,
                });
            }
            return res.status(500).json({
                ok: false,
                message: 'Error interno del servidor',
            });
        }
    };

    updateNuevaPlanificacion = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const planificacion =
                await this.nuevaPlanificacionService.updateNuevaPlanificacion(
                    parseInt(id),
                    data
                );

            return res.status(200).json({
                ok: true,
                data: planificacion,
                message: 'Planificación actualizada exitosamente',
            });
        } catch (error) {
            if (error instanceof CustomError) {
                return res.status(error.statusCode).json({
                    ok: false,
                    message: error.message,
                });
            }
            return res.status(500).json({
                ok: false,
                message: 'Error interno del servidor',
            });
        }
    };

    deactivateNuevaPlanificacion = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { updatedBy } = req.body;

            const planificacion =
                await this.nuevaPlanificacionService.deactivateNuevaPlanificacion(
                    parseInt(id),
                    updatedBy ? parseInt(updatedBy) : undefined
                );

            return res.status(200).json({
                ok: true,
                data: planificacion,
                message: 'Planificación desactivada exitosamente',
            });
        } catch (error) {
            if (error instanceof CustomError) {
                return res.status(error.statusCode).json({
                    ok: false,
                    message: error.message,
                });
            }
            return res.status(500).json({
                ok: false,
                message: 'Error interno del servidor',
            });
        }
    };

    activateNuevaPlanificacion = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { updatedBy } = req.body;

            const planificacion =
                await this.nuevaPlanificacionService.activateNuevaPlanificacion(
                    parseInt(id),
                    updatedBy ? parseInt(updatedBy) : undefined
                );

            return res.status(200).json({
                ok: true,
                data: planificacion,
                message: 'Planificación activada exitosamente',
            });
        } catch (error) {
            if (error instanceof CustomError) {
                return res.status(error.statusCode).json({
                    ok: false,
                    message: error.message,
                });
            }
            return res.status(500).json({
                ok: false,
                message: 'Error interno del servidor',
            });
        }
    };

    approvePlanificacion = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { approvedBy, comentariosJefe } = req.body;

            if (!approvedBy) {
                return res.status(400).json({
                    ok: false,
                    message: 'El campo approvedBy es requerido',
                });
            }

            const planificacion =
                await this.nuevaPlanificacionService.approvePlanificacion(
                    parseInt(id),
                    parseInt(approvedBy),
                    comentariosJefe
                );

            return res.status(200).json({
                ok: true,
                data: planificacion,
                message: 'Planificación aprobada exitosamente',
            });
        } catch (error) {
            if (error instanceof CustomError) {
                return res.status(error.statusCode).json({
                    ok: false,
                    message: error.message,
                });
            }
            return res.status(500).json({
                ok: false,
                message: 'Error interno del servidor',
            });
        }
    };

    rejectPlanificacion = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { rejectedBy, comentariosJefe } = req.body;

            if (!rejectedBy) {
                return res.status(400).json({
                    ok: false,
                    message: 'El campo rejectedBy es requerido',
                });
            }

            if (!comentariosJefe || comentariosJefe.trim() === '') {
                return res.status(400).json({
                    ok: false,
                    message:
                        'Los comentarios del jefe son obligatorios para rechazar',
                });
            }

            const planificacion =
                await this.nuevaPlanificacionService.rejectPlanificacion(
                    parseInt(id),
                    parseInt(rejectedBy),
                    comentariosJefe
                );

            return res.status(200).json({
                ok: true,
                data: planificacion,
                message: 'Planificación rechazada exitosamente',
            });
        } catch (error) {
            if (error instanceof CustomError) {
                return res.status(error.statusCode).json({
                    ok: false,
                    message: error.message,
                });
            }
            return res.status(500).json({
                ok: false,
                message: 'Error interno del servidor',
            });
        }
    };

    changeEstadoPlanificacion = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { estado, updatedBy } = req.body;

            if (!estado) {
                return res.status(400).json({
                    ok: false,
                    message: 'El campo estado es requerido',
                });
            }

            const planificacion =
                await this.nuevaPlanificacionService.changeEstadoPlanificacion(
                    parseInt(id),
                    estado,
                    updatedBy ? parseInt(updatedBy) : undefined
                );

            return res.status(200).json({
                ok: true,
                data: planificacion,
                message: 'Estado de planificación actualizado exitosamente',
            });
        } catch (error) {
            if (error instanceof CustomError) {
                return res.status(error.statusCode).json({
                    ok: false,
                    message: error.message,
                });
            }
            return res.status(500).json({
                ok: false,
                message: 'Error interno del servidor',
            });
        }
    };

    getMomentosAplicacion = async (req: Request, res: Response) => {
        try {
            const momentos =
                await this.nuevaPlanificacionService.getMomentosAplicacion();
            res.json(momentos);
        } catch (error) {
            if (error instanceof CustomError) {
                return res.status(error.statusCode).json({
                    ok: false,
                    message: error.message,
                });
            }
            return res.status(500).json({
                ok: false,
                message: 'Error interno del servidor',
            });
        }
    };
}
