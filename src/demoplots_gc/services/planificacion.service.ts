import { prisma } from '../../data/sqlserver';
import { CustomError } from '../../domain';
import { getCurrentDate } from '../../config/time';

interface CreatePlanificacionInput {
    idColaborador: number;
    mes: number;
    cantDemos: number;
    dosisCil?: number;
    dosisMoc?: number;
    muestraTotal?: number;
    estado: string;
    checkJefe?: boolean;
    comentarios?: string;
    createdBy?: number;
    // Relaciones opcionales
    gtes?: number[];
    tiendas?: number[];
    productos?: number[];
    cultivos?: number[];
    blancos?: number[];
    momentosAplicacion?: {
        momentoAplicaId: number;
        paramEvaAntes: string;
        paramEvaDespues: string;
    }[];
}

interface UpdatePlanificacionInput {
    idColaborador?: number;
    mes?: number;
    cantDemos?: number;
    dosisCil?: number;
    dosisMoc?: number;
    muestraTotal?: number;
    estado?: string;
    checkJefe?: boolean;
    comentarios?: string;
    activo?: boolean;
    updatedBy?: number;
    // Relaciones opcionales
    gtes?: number[];
    tiendas?: number[];
    productos?: number[];
    cultivos?: number[];
    blancos?: number[];
    momentosAplicacion?: {
        momentoAplicaId: number;
        paramEvaAntes: string;
        paramEvaDespues: string;
    }[];
}

interface GetAllPlanificacionesParams {
    activo?: string;
    search?: string;
    idColaborador?: number;
    mes?: number;
    estado?: string;
    checkJefe?: boolean;
    year?: number;
    limit?: number;
    page?: number;
}

export class PlanificacionService {
    async getAllPlanificaciones(params: GetAllPlanificacionesParams) {
        try {
            const {
                activo = 'true',
                search,
                idColaborador,
                mes,
                estado,
                checkJefe,
                year,
                limit = 10,
                page = 1,
            } = params;

            const where: any = {};

            if (activo !== 'all') {
                where.activo = activo === 'true';
            }

            if (idColaborador) {
                where.idColaborador = idColaborador;
            }

            if (mes) {
                where.mes = mes;
            }

            if (estado) {
                where.estado = estado;
            }

            if (checkJefe !== undefined) {
                where.checkJefe = checkJefe;
            }

            // Filtros por año
            if (year) {
                where.createdAt = {
                    gte: new Date(year, 0, 1),
                    lte: new Date(year, 11, 31, 23, 59, 59, 999),
                };
            }

            if (search) {
                where.OR = [
                    { comentarios: { contains: search } },
                    { estado: { contains: search } },
                    // Búsqueda por nombre del colaborador
                    {
                        Colaborador: {
                            Usuario: {
                                nombres: { contains: search },
                            },
                        },
                    },
                ];
            }

            const [planificaciones, total] = await Promise.all([
                prisma.planificacion.findMany({
                    where,
                    take: limit,
                    skip: (page - 1) * limit,
                    orderBy: { id: 'desc' },
                    include: {
                        Colaborador: {
                            include: {
                                Usuario: {
                                    select: {
                                        id: true,
                                        nombres: true,
                                        apellidos: true,
                                        email: true,
                                    },
                                },
                            },
                        },
                        PlanGtes: {
                            include: {
                                Gte: {
                                    include: {
                                        Usuario: {
                                            select: {
                                                nombres: true,
                                                apellidos: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        PlanTiendas: {
                            include: {
                                PuntoContacto: true,
                            },
                        },
                        PlanProductos: {
                            include: {
                                Familia: true,
                            },
                        },
                        PlanCultivos: {
                            include: {
                                Cultivo: true,
                            },
                        },
                        PlanBlancosBiologicos: {
                            include: {
                                BlancoBiologico: true,
                            },
                        },
                        PlanMomentoAplicacion: {
                            include: {
                                MomentoAplicacion: true,
                            },
                        },
                    },
                }),
                prisma.planificacion.count({ where }),
            ]);

            // Calcular detalles de paginación
            const totalPages = Math.ceil(total / limit);

            // Contadores globales de activos e inactivos
            const [totalActivos, totalInactivos] = await Promise.all([
                prisma.planificacion.count({
                    where: { ...where, activo: true },
                }),
                prisma.planificacion.count({
                    where: { ...where, activo: false },
                }),
            ]);

            // Estadísticas adicionales filtradas
            const [
                programados,
                completados,
                cancelados,
                aprobados,
                rechazados,
                pendientesAprobacion,
            ] = await Promise.all([
                prisma.planificacion.count({
                    where: {
                        ...where,
                        estado: 'Programado',
                    },
                }),
                prisma.planificacion.count({
                    where: {
                        ...where,
                        estado: 'Completado',
                    },
                }),
                prisma.planificacion.count({
                    where: {
                        ...where,
                        estado: 'Cancelado',
                    },
                }),
                prisma.planificacion.count({
                    where: {
                        ...where,
                        checkJefe: true,
                    },
                }),
                prisma.planificacion.count({
                    where: {
                        ...where,
                        checkJefe: false,
                    },
                }),
                prisma.planificacion.count({
                    where: {
                        ...where,
                        checkJefe: null,
                    },
                }),
            ]);

            return {
                data: planificaciones,
                pagination: {
                    total,
                    limit,
                    page,
                    totalPages,
                },
                statistics: {
                    total,
                    activos: totalActivos,
                    inactivos: totalInactivos,
                },
                planificacionStats: {
                    programados,
                    completados,
                    cancelados,
                    aprobados,
                    rechazados,
                    pendientesAprobacion,
                },
            };
        } catch (error) {
            throw new CustomError(
                500,
                `Error al obtener planificaciones: ${(error as Error).message}`
            );
        }
    }

    async getPlanificacionById(id: number) {
        try {
            const planificacion = await prisma.planificacion.findUnique({
                where: { id },
                include: {
                    Colaborador: {
                        include: {
                            Usuario: {
                                select: {
                                    id: true,
                                    nombres: true,
                                    apellidos: true,
                                    email: true,
                                },
                            },
                        },
                    },
                    PlanGtes: {
                        include: {
                            Gte: {
                                include: {
                                    Usuario: {
                                        select: {
                                            nombres: true,
                                            apellidos: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    PlanTiendas: {
                        include: {
                            PuntoContacto: true,
                        },
                    },
                    PlanProductos: {
                        include: {
                            Familia: true,
                        },
                    },
                    PlanCultivos: {
                        include: {
                            Cultivo: true,
                        },
                    },
                    PlanBlancosBiologicos: {
                        include: {
                            BlancoBiologico: true,
                        },
                    },
                    PlanMomentoAplicacion: {
                        include: {
                            MomentoAplicacion: true,
                        },
                    },
                },
            });

            if (!planificacion) {
                throw new CustomError(404, 'Planificación no encontrada');
            }

            return planificacion;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(
                500,
                `Error al obtener planificación: ${(error as Error).message}`
            );
        }
    }

    async createPlanificacion(data: CreatePlanificacionInput) {
        try {
            if (
                !data.idColaborador ||
                !data.mes ||
                !data.cantDemos ||
                !data.estado
            ) {
                throw new CustomError(400, 'Faltan campos requeridos');
            }

            // Verificar que el colaborador existe
            const colaboradorExists = await prisma.colaborador.findUnique({
                where: { id: data.idColaborador },
            });

            if (!colaboradorExists) {
                throw new CustomError(
                    400,
                    'El colaborador especificado no existe'
                );
            }

            const currentDate = getCurrentDate();

            // Usar transacción para crear la planificación y sus relaciones
            const result = await prisma.$transaction(async (tx) => {
                // Crear la planificación principal
                const planificacion = await tx.planificacion.create({
                    data: {
                        idColaborador: data.idColaborador,
                        mes: data.mes,
                        cantDemos: data.cantDemos,
                        dosisCil: data.dosisCil,
                        dosisMoc: data.dosisMoc,
                        muestraTotal: data.muestraTotal,
                        estado: data.estado,
                        checkJefe: data.checkJefe ?? false,
                        comentarios: data.comentarios,
                        createdBy: data.createdBy,
                        createdAt: currentDate,
                        updatedAt: currentDate,
                    },
                });

                // Crear relaciones con GTEs
                if (data.gtes && data.gtes.length > 0) {
                    await tx.planGtes.createMany({
                        data: data.gtes.map((gteId) => ({
                            planId: planificacion.id,
                            gteId: gteId,
                        })),
                    });
                }

                // Crear relaciones con Tiendas
                if (data.tiendas && data.tiendas.length > 0) {
                    await tx.planTiendas.createMany({
                        data: data.tiendas.map((tiendaId) => ({
                            planId: planificacion.id,
                            tiendaId: tiendaId,
                        })),
                    });
                }

                // Crear relaciones con Productos
                if (data.productos && data.productos.length > 0) {
                    await tx.planProductos.createMany({
                        data: data.productos.map((productoId) => ({
                            planId: planificacion.id,
                            productoId: productoId,
                        })),
                    });
                }

                // Crear relaciones con Cultivos
                if (data.cultivos && data.cultivos.length > 0) {
                    await tx.planCultivos.createMany({
                        data: data.cultivos.map((cultivoId) => ({
                            planId: planificacion.id,
                            cultivoId: cultivoId,
                        })),
                    });
                }

                // Crear relaciones con Blancos Biológicos
                if (data.blancos && data.blancos.length > 0) {
                    await tx.planBlancosBiologicos.createMany({
                        data: data.blancos.map((blancoId) => ({
                            planId: planificacion.id,
                            blancoId: blancoId,
                        })),
                    });
                }

                // Crear relaciones con Momentos de Aplicación
                if (
                    data.momentosAplicacion &&
                    data.momentosAplicacion.length > 0
                ) {
                    await tx.planMomentoAplicacion.createMany({
                        data: data.momentosAplicacion.map((momento) => ({
                            planId: planificacion.id,
                            momentoAplicaId: momento.momentoAplicaId,
                            paramEvaAntes: momento.paramEvaAntes,
                            paramEvaDespues: momento.paramEvaDespues,
                        })),
                    });
                }

                return planificacion;
            });

            return result;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(
                500,
                `Error al crear planificación: ${(error as Error).message}`
            );
        }
    }

    async updatePlanificacion(id: number, data: UpdatePlanificacionInput) {
        try {
            const planificacionExistente =
                await prisma.planificacion.findUnique({
                    where: { id },
                });

            if (!planificacionExistente) {
                throw new CustomError(404, 'Planificación no encontrada');
            }

            const currentDate = getCurrentDate();

            // Usar transacción para actualizar la planificación y sus relaciones
            const result = await prisma.$transaction(async (tx) => {
                // Actualizar la planificación principal
                const planificacion = await this.updatePlanificacionMain(
                    tx,
                    id,
                    data,
                    currentDate
                );

                // Actualizar todas las relaciones
                await this.updatePlanificacionRelations(tx, id, data);

                return planificacion;
            });

            return result;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(
                500,
                `Error al actualizar planificación: ${(error as Error).message}`
            );
        }
    }

    private async updatePlanificacionMain(
        tx: any,
        id: number,
        data: UpdatePlanificacionInput,
        currentDate: Date
    ) {
        return await tx.planificacion.update({
            where: { id },
            data: {
                ...(data.idColaborador && {
                    idColaborador: data.idColaborador,
                }),
                ...(data.mes !== undefined && { mes: data.mes }),
                ...(data.cantDemos !== undefined && {
                    cantDemos: data.cantDemos,
                }),
                ...(data.dosisCil !== undefined && { dosisCil: data.dosisCil }),
                ...(data.dosisMoc !== undefined && { dosisMoc: data.dosisMoc }),
                ...(data.muestraTotal !== undefined && {
                    muestraTotal: data.muestraTotal,
                }),
                ...(data.estado && { estado: data.estado }),
                ...(data.checkJefe !== undefined && {
                    checkJefe: data.checkJefe,
                }),
                ...(data.comentarios !== undefined && {
                    comentarios: data.comentarios,
                }),
                ...(data.activo !== undefined && { activo: data.activo }),
                ...(data.updatedBy && { updatedBy: data.updatedBy }),
                updatedAt: currentDate,
            },
        });
    }

    private async updatePlanificacionRelations(
        tx: any,
        id: number,
        data: UpdatePlanificacionInput
    ) {
        // Actualizar relaciones con GTEs
        if (data.gtes !== undefined) {
            await this.updateGtesRelation(tx, id, data.gtes);
        }

        // Actualizar relaciones con Tiendas
        if (data.tiendas !== undefined) {
            await this.updateTiendasRelation(tx, id, data.tiendas);
        }

        // Actualizar relaciones con Productos
        if (data.productos !== undefined) {
            await this.updateProductosRelation(tx, id, data.productos);
        }

        // Actualizar relaciones con Cultivos
        if (data.cultivos !== undefined) {
            await this.updateCultivosRelation(tx, id, data.cultivos);
        }

        // Actualizar relaciones con Blancos Biológicos
        if (data.blancos !== undefined) {
            await this.updateBlancosRelation(tx, id, data.blancos);
        }

        // Actualizar relaciones con Momentos de Aplicación
        if (data.momentosAplicacion !== undefined) {
            await this.updateMomentosAplicacionRelation(
                tx,
                id,
                data.momentosAplicacion
            );
        }
    }

    private async updateGtesRelation(tx: any, planId: number, gtes: number[]) {
        await tx.planGtes.deleteMany({ where: { planId } });
        if (gtes.length > 0) {
            await tx.planGtes.createMany({
                data: gtes.map((gteId) => ({ planId, gteId })),
            });
        }
    }

    private async updateTiendasRelation(
        tx: any,
        planId: number,
        tiendas: number[]
    ) {
        await tx.planTiendas.deleteMany({ where: { planId } });
        if (tiendas.length > 0) {
            await tx.planTiendas.createMany({
                data: tiendas.map((tiendaId) => ({ planId, tiendaId })),
            });
        }
    }

    private async updateProductosRelation(
        tx: any,
        planId: number,
        productos: number[]
    ) {
        await tx.planProductos.deleteMany({ where: { planId } });
        if (productos.length > 0) {
            await tx.planProductos.createMany({
                data: productos.map((productoId) => ({ planId, productoId })),
            });
        }
    }

    private async updateCultivosRelation(
        tx: any,
        planId: number,
        cultivos: number[]
    ) {
        await tx.planCultivos.deleteMany({ where: { planId } });
        if (cultivos.length > 0) {
            await tx.planCultivos.createMany({
                data: cultivos.map((cultivoId) => ({ planId, cultivoId })),
            });
        }
    }

    private async updateBlancosRelation(
        tx: any,
        planId: number,
        blancos: number[]
    ) {
        await tx.planBlancosBiologicos.deleteMany({ where: { planId } });
        if (blancos.length > 0) {
            await tx.planBlancosBiologicos.createMany({
                data: blancos.map((blancoId) => ({ planId, blancoId })),
            });
        }
    }

    private async updateMomentosAplicacionRelation(
        tx: any,
        planId: number,
        momentosAplicacion: {
            momentoAplicaId: number;
            paramEvaAntes: string;
            paramEvaDespues: string;
        }[]
    ) {
        await tx.planMomentoAplicacion.deleteMany({ where: { planId } });
        if (momentosAplicacion.length > 0) {
            await tx.planMomentoAplicacion.createMany({
                data: momentosAplicacion.map((momento) => ({
                    planId,
                    momentoAplicaId: momento.momentoAplicaId,
                    paramEvaAntes: momento.paramEvaAntes,
                    paramEvaDespues: momento.paramEvaDespues,
                })),
            });
        }
    }

    async deactivatePlanificacion(id: number, updatedBy?: number) {
        try {
            const planificacionExistente =
                await prisma.planificacion.findUnique({
                    where: { id },
                });

            if (!planificacionExistente) {
                throw new CustomError(404, 'Planificación no encontrada');
            }

            return await prisma.planificacion.update({
                where: { id },
                data: {
                    activo: false,
                    updatedBy,
                    updatedAt: getCurrentDate(),
                },
            });
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(
                500,
                `Error al desactivar planificación: ${(error as Error).message}`
            );
        }
    }

    async activatePlanificacion(id: number, updatedBy?: number) {
        try {
            const planificacionExistente =
                await prisma.planificacion.findUnique({
                    where: { id },
                });

            if (!planificacionExistente) {
                throw new CustomError(404, 'Planificación no encontrada');
            }

            return await prisma.planificacion.update({
                where: { id },
                data: {
                    activo: true,
                    updatedBy,
                    updatedAt: getCurrentDate(),
                },
            });
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(
                500,
                `Error al activar planificación: ${(error as Error).message}`
            );
        }
    }

    async approvePlanificacion(id: number, updatedBy?: number) {
        try {
            const planificacionExistente =
                await prisma.planificacion.findUnique({
                    where: { id },
                });

            if (!planificacionExistente) {
                throw new CustomError(404, 'Planificación no encontrada');
            }

            return await prisma.planificacion.update({
                where: { id },
                data: {
                    checkJefe: true,
                    approvedAt: getCurrentDate(),
                    updatedBy,
                    updatedAt: getCurrentDate(),
                },
            });
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(
                500,
                `Error al aprobar planificación: ${(error as Error).message}`
            );
        }
    }

    async rejectPlanificacion(id: number, updatedBy?: number) {
        try {
            const planificacionExistente =
                await prisma.planificacion.findUnique({
                    where: { id },
                });

            if (!planificacionExistente) {
                throw new CustomError(404, 'Planificación no encontrada');
            }

            return await prisma.planificacion.update({
                where: { id },
                data: {
                    checkJefe: false,
                    approvedAt: null,
                    updatedBy,
                    updatedAt: getCurrentDate(),
                },
            });
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(
                500,
                `Error al rechazar planificación: ${(error as Error).message}`
            );
        }
    }

    async deletePlanificacion(id: number) {
        try {
            const planificacionExistente =
                await prisma.planificacion.findUnique({
                    where: { id },
                });

            if (!planificacionExistente) {
                throw new CustomError(404, 'Planificación no encontrada');
            }

            // Usar transacción para eliminar la planificación y sus relaciones
            await prisma.$transaction(async (tx) => {
                // Eliminar todas las relaciones primero
                await tx.planGtes.deleteMany({ where: { planId: id } });
                await tx.planTiendas.deleteMany({ where: { planId: id } });
                await tx.planProductos.deleteMany({ where: { planId: id } });
                await tx.planCultivos.deleteMany({ where: { planId: id } });
                await tx.planBlancosBiologicos.deleteMany({
                    where: { planId: id },
                });
                await tx.planMomentoAplicacion.deleteMany({
                    where: { planId: id },
                });

                // Eliminar la planificación
                await tx.planificacion.delete({ where: { id } });
            });

            return {
                message: `Planificación con id ${id} ha sido eliminada exitosamente`,
            };
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(
                500,
                `Error al eliminar planificación: ${(error as Error).message}`
            );
        }
    }

    // Métodos auxiliares para obtener datos relacionados
    async getMomentosAplicacion() {
        try {
            return await prisma.momentoAplicacion.findMany({
                orderBy: { nombre: 'asc' },
            });
        } catch (error) {
            throw new CustomError(
                500,
                `Error al obtener momentos de aplicación: ${
                    (error as Error).message
                }`
            );
        }
    }

    async getPlanificacionesByColaborador(idColaborador: number, mes?: number) {
        try {
            const where: any = { idColaborador, activo: true };

            if (mes) {
                where.mes = mes;
            }

            return await prisma.planificacion.findMany({
                where,
                include: {
                    PlanGtes: {
                        include: {
                            Gte: {
                                include: {
                                    Usuario: {
                                        select: {
                                            nombres: true,
                                            apellidos: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    PlanTiendas: {
                        include: {
                            PuntoContacto: true,
                        },
                    },
                    PlanProductos: {
                        include: {
                            Familia: true,
                        },
                    },
                    PlanCultivos: {
                        include: {
                            Cultivo: true,
                        },
                    },
                    PlanBlancosBiologicos: {
                        include: {
                            BlancoBiologico: true,
                        },
                    },
                    PlanMomentoAplicacion: {
                        include: {
                            MomentoAplicacion: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });
        } catch (error) {
            throw new CustomError(
                500,
                `Error al obtener planificaciones del colaborador: ${
                    (error as Error).message
                }`
            );
        }
    }
}
