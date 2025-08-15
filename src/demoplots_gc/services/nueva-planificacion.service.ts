import { prisma } from '../../data/sqlserver';
import { CustomError } from '../../domain';

interface CreateNuevaPlanificacionInput {
    idColaborador: number;
    mes: number;
    gteId: number;
    tiendaId: number;
    vegetacionId: number;
    momentoAplicaId: number;
    paramEvaAntes?: string;
    paramEvaDespues?: string;
    productoId: number;
    blancoId: number;
    dosisMoc?: number;
    cantDemos: number;
    muestraTotal?: number;
    estado: string;
    checkJefe?: boolean;
    comentariosJefe?: string;
    comentarios?: string;
    createdBy?: number;
    monthYear: Date;
}

interface UpdateNuevaPlanificacionInput {
    idColaborador?: number;
    mes?: number;
    gteId?: number;
    tiendaId?: number;
    vegetacionId?: number;
    momentoAplicaId?: number;
    paramEvaAntes?: string;
    paramEvaDespues?: string;
    productoId?: number;
    blancoId?: number;
    dosisMoc?: number;
    cantDemos?: number;
    muestraTotal?: number;
    estado?: string;
    checkJefe?: boolean;
    comentariosJefe?: string;
    comentarios?: string;
    activo?: boolean;
    approvedAt?: Date;
    updatedBy?: number;
    monthYear?: Date;
}

interface GetAllNuevaPlanificacionParams {
    activo?: string;
    search?: string;
    idColaborador?: number;
    mes?: number;
    gteId?: number;
    tiendaId?: number;
    vegetacionId?: number;
    momentoAplicaId?: number;
    productoId?: number;
    blancoId?: number;
    estado?: string;
    checkJefe?: boolean;
    year?: number;
    month?: number;
    limit?: number;
    page?: number;
}

export class NuevaPlanificacionService {
    async getAllNuevaPlanificaciones(params: GetAllNuevaPlanificacionParams) {
        try {
            const {
                activo = 'true',
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
            if (gteId) {
                where.gteId = gteId;
            }
            if (tiendaId) {
                where.tiendaId = tiendaId;
            }
            if (vegetacionId) {
                where.vegetacionId = vegetacionId;
            }
            if (momentoAplicaId) {
                where.momentoAplicaId = momentoAplicaId;
            }
            if (productoId) {
                where.productoId = productoId;
            }
            if (blancoId) {
                where.blancoId = blancoId;
            }
            if (estado) {
                where.estado = estado;
            }
            if (checkJefe !== undefined) {
                where.checkJefe = checkJefe;
            }

            // Filtros por año y mes usando monthYear
            if (year || month) {
                if (year && month) {
                    // Filtrar por año y mes específicos
                    where.AND = [
                        ...(where.AND || []),
                        {
                            monthYear: {
                                gte: new Date(
                                    `${year}-${month
                                        .toString()
                                        .padStart(2, '0')}-01`
                                ),
                                lt: new Date(year, month, 1), // Primer día del siguiente mes
                            },
                        },
                    ];
                } else if (year) {
                    // Filtrar solo por año
                    where.AND = [
                        ...(where.AND || []),
                        {
                            monthYear: {
                                gte: new Date(`${year}-01-01`),
                                lt: new Date(`${year + 1}-01-01`),
                            },
                        },
                    ];
                }
            }

            if (search) {
                // Relaciones 1:1 deben filtrarse con 'is'
                where.OR = [
                    { comentarios: { contains: search } },
                    { comentariosJefe: { contains: search } },
                    { estado: { contains: search } },
                    { paramEvaAntes: { contains: search } },
                    { paramEvaDespues: { contains: search } },
                    // Búsqueda por nombre del colaborador
                    {
                        Colaborador: {
                            is: {
                                Usuario: {
                                    is: {
                                        nombres: { contains: search },
                                    },
                                },
                            },
                        },
                    },
                    // Búsqueda por nombre o tipo del GTE
                    {
                        Gte: {
                            is: {
                                OR: [
                                    {
                                        Usuario: {
                                            is: {
                                                nombres: { contains: search },
                                            },
                                        },
                                    },
                                    { tipo: { contains: search } },
                                ],
                            },
                        },
                    },
                    // Búsqueda por nombre de la tienda/punto de contacto
                    {
                        PuntoContacto: {
                            is: {
                                nombre: { contains: search },
                            },
                        },
                    },
                    // Búsqueda por nombre de la vegetación
                    {
                        Vegetacion: {
                            is: {
                                nombre: { contains: search },
                            },
                        },
                    },
                    // Búsqueda por nombre del producto/familia
                    {
                        Familia: {
                            is: {
                                nombre: { contains: search },
                            },
                        },
                    },
                    // Búsqueda por nombre del blanco biológico
                    {
                        BlancoBiologico: {
                            is: {
                                OR: [
                                    { estandarizado: { contains: search } },
                                    { cientifico: { contains: search } },
                                ],
                            },
                        },
                    },
                ];
            }

            const [planificaciones, total] = await Promise.all([
                prisma.nuevaPlanificacion.findMany({
                    where,
                    take: limit,
                    skip: (page - 1) * limit,
                    orderBy: { id: 'desc' },
                    include: {
                        Colaborador: {
                            include: {
                                Usuario: {
                                    select: {
                                        nombres: true,
                                        apellidos: true,
                                        email: true,
                                    },
                                },
                            },
                        },
                        Gte: {
                            include: {
                                Usuario: {
                                    select: {
                                        nombres: true,
                                        apellidos: true,
                                        email: true,
                                    },
                                },
                            },
                        },
                        PuntoContacto: true,
                        Vegetacion: true,
                        MomentoAplicacion: true,
                        Familia: true,
                        BlancoBiologico: true,
                    },
                }),
                prisma.nuevaPlanificacion.count({ where }),
            ]);

            // Calcular detalles de paginación
            const totalPages = Math.ceil(total / limit);

            // Contadores globales de activos e inactivos
            const [totalActivos, totalInactivos] = await Promise.all([
                prisma.nuevaPlanificacion.count({
                    where: { ...where, activo: true },
                }),
                prisma.nuevaPlanificacion.count({
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
                prisma.nuevaPlanificacion.count({
                    where: {
                        ...where,
                        estado: 'Programado',
                    },
                }),
                prisma.nuevaPlanificacion.count({
                    where: {
                        ...where,
                        estado: 'Completado',
                    },
                }),
                prisma.nuevaPlanificacion.count({
                    where: {
                        ...where,
                        estado: 'Cancelado',
                    },
                }),
                prisma.nuevaPlanificacion.count({
                    where: {
                        ...where,
                        checkJefe: true,
                    },
                }),
                prisma.nuevaPlanificacion.count({
                    where: {
                        ...where,
                        checkJefe: false,
                    },
                }),
                prisma.nuevaPlanificacion.count({
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

    async getNuevaPlanificacionById(id: number) {
        try {
            const planificacion = await prisma.nuevaPlanificacion.findUnique({
                where: { id },
                include: {
                    Colaborador: {
                        include: {
                            Usuario: {
                                select: {
                                    nombres: true,
                                    apellidos: true,
                                    email: true,
                                },
                            },
                        },
                    },
                    Gte: {
                        include: {
                            Usuario: {
                                select: {
                                    nombres: true,
                                    apellidos: true,
                                    email: true,
                                },
                            },
                        },
                    },
                    PuntoContacto: true,
                    Vegetacion: true,
                    MomentoAplicacion: true,
                    Familia: true,
                    BlancoBiologico: true,
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

    async createNuevaPlanificacion(data: CreateNuevaPlanificacionInput) {
        try {
            if (
                !data.idColaborador ||
                !data.mes ||
                !data.gteId ||
                !data.tiendaId ||
                !data.vegetacionId ||
                !data.momentoAplicaId ||
                !data.productoId ||
                !data.blancoId ||
                !data.cantDemos ||
                !data.estado ||
                !data.monthYear
            ) {
                throw new CustomError(400, 'Faltan campos requeridos');
            }

            return await prisma.nuevaPlanificacion.create({
                data: {
                    idColaborador: data.idColaborador,
                    mes: data.mes,
                    gteId: data.gteId,
                    tiendaId: data.tiendaId,
                    vegetacionId: data.vegetacionId,
                    momentoAplicaId: data.momentoAplicaId,
                    paramEvaAntes: data.paramEvaAntes,
                    paramEvaDespues: data.paramEvaDespues,
                    productoId: data.productoId,
                    blancoId: data.blancoId,
                    dosisMoc: data.dosisMoc,
                    cantDemos: data.cantDemos,
                    muestraTotal: data.muestraTotal,
                    estado: data.estado,
                    checkJefe: data.checkJefe,
                    comentariosJefe: data.comentariosJefe,
                    comentarios: data.comentarios,
                    createdBy: data.createdBy,
                    monthYear: data.monthYear,
                },
                include: {
                    Colaborador: true,
                    Gte: true,
                    PuntoContacto: true,
                    Vegetacion: true,
                    MomentoAplicacion: true,
                    Familia: true,
                    BlancoBiologico: true,
                },
            });
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(
                500,
                `Error al crear planificación: ${(error as Error).message}`
            );
        }
    }

    async updateNuevaPlanificacion(
        id: number,
        data: UpdateNuevaPlanificacionInput
    ) {
        try {
            const planificacionExistente =
                await prisma.nuevaPlanificacion.findUnique({ where: { id } });
            if (!planificacionExistente) {
                throw new CustomError(404, 'Planificación no encontrada');
            }

            return await prisma.nuevaPlanificacion.update({
                where: { id },
                data: {
                    ...(data.idColaborador && {
                        idColaborador: data.idColaborador,
                    }),
                    ...(data.mes !== undefined && { mes: data.mes }),
                    ...(data.gteId && { gteId: data.gteId }),
                    ...(data.tiendaId && { tiendaId: data.tiendaId }),
                    ...(data.vegetacionId && {
                        vegetacionId: data.vegetacionId,
                    }),
                    ...(data.momentoAplicaId && {
                        momentoAplicaId: data.momentoAplicaId,
                    }),
                    ...(data.paramEvaAntes !== undefined && {
                        paramEvaAntes: data.paramEvaAntes,
                    }),
                    ...(data.paramEvaDespues !== undefined && {
                        paramEvaDespues: data.paramEvaDespues,
                    }),
                    ...(data.productoId && { productoId: data.productoId }),
                    ...(data.blancoId && { blancoId: data.blancoId }),
                    ...(data.dosisMoc !== undefined && {
                        dosisMoc: data.dosisMoc,
                    }),
                    ...(data.cantDemos !== undefined && {
                        cantDemos: data.cantDemos,
                    }),
                    ...(data.muestraTotal !== undefined && {
                        muestraTotal: data.muestraTotal,
                    }),
                    ...(data.estado && { estado: data.estado }),
                    ...(data.checkJefe !== undefined && {
                        checkJefe: data.checkJefe,
                    }),
                    ...(data.comentariosJefe !== undefined && {
                        comentariosJefe: data.comentariosJefe,
                    }),
                    ...(data.comentarios !== undefined && {
                        comentarios: data.comentarios,
                    }),
                    ...(data.activo !== undefined && { activo: data.activo }),
                    ...(data.approvedAt !== undefined && {
                        approvedAt: data.approvedAt,
                    }),
                    ...(data.monthYear !== undefined && {
                        monthYear: data.monthYear,
                    }),
                    ...(data.updatedBy && { updatedBy: data.updatedBy }),
                    updatedAt: new Date(),
                },
                include: {
                    Colaborador: true,
                    Gte: true,
                    PuntoContacto: true,
                    Vegetacion: true,
                    MomentoAplicacion: true,
                    Familia: true,
                    BlancoBiologico: true,
                },
            });
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(
                500,
                `Error al actualizar planificación: ${(error as Error).message}`
            );
        }
    }

    async deactivateNuevaPlanificacion(id: number, updatedBy?: number) {
        try {
            const planificacionExistente =
                await prisma.nuevaPlanificacion.findUnique({ where: { id } });
            if (!planificacionExistente) {
                throw new CustomError(404, 'Planificación no encontrada');
            }

            return await prisma.nuevaPlanificacion.update({
                where: { id },
                data: {
                    activo: false,
                    updatedBy,
                    updatedAt: new Date(),
                },
                include: {
                    Colaborador: true,
                    Gte: true,
                    PuntoContacto: true,
                    Vegetacion: true,
                    MomentoAplicacion: true,
                    Familia: true,
                    BlancoBiologico: true,
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

    async activateNuevaPlanificacion(id: number, updatedBy?: number) {
        try {
            const planificacionExistente =
                await prisma.nuevaPlanificacion.findUnique({ where: { id } });
            if (!planificacionExistente) {
                throw new CustomError(404, 'Planificación no encontrada');
            }

            return await prisma.nuevaPlanificacion.update({
                where: { id },
                data: {
                    activo: true,
                    updatedBy,
                    updatedAt: new Date(),
                },
                include: {
                    Colaborador: true,
                    Gte: true,
                    PuntoContacto: true,
                    Vegetacion: true,
                    MomentoAplicacion: true,
                    Familia: true,
                    BlancoBiologico: true,
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

    async approvePlanificacion(
        id: number,
        approvedBy: number,
        comentariosJefe?: string
    ) {
        try {
            const planificacionExistente =
                await prisma.nuevaPlanificacion.findUnique({ where: { id } });
            if (!planificacionExistente) {
                throw new CustomError(404, 'Planificación no encontrada');
            }

            return await prisma.nuevaPlanificacion.update({
                where: { id },
                data: {
                    checkJefe: true,
                    approvedAt: new Date(),
                    comentariosJefe,
                    updatedBy: approvedBy,
                    updatedAt: new Date(),
                },
                include: {
                    Colaborador: true,
                    Gte: true,
                    PuntoContacto: true,
                    Vegetacion: true,
                    MomentoAplicacion: true,
                    Familia: true,
                    BlancoBiologico: true,
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

    async rejectPlanificacion(
        id: number,
        rejectedBy: number,
        comentariosJefe: string
    ) {
        try {
            const planificacionExistente =
                await prisma.nuevaPlanificacion.findUnique({ where: { id } });
            if (!planificacionExistente) {
                throw new CustomError(404, 'Planificación no encontrada');
            }

            // Validar que se proporcionen comentarios obligatorios para el rechazo
            if (!comentariosJefe || comentariosJefe.trim() === '') {
                throw new CustomError(
                    400,
                    'Los comentarios del jefe son obligatorios para rechazar una planificación'
                );
            }

            return await prisma.nuevaPlanificacion.update({
                where: { id },
                data: {
                    checkJefe: false,
                    approvedAt: null, // Limpiar fecha de aprobación si existía
                    comentariosJefe,
                    updatedBy: rejectedBy,
                    updatedAt: new Date(),
                },
                include: {
                    Colaborador: true,
                    Gte: true,
                    PuntoContacto: true,
                    Vegetacion: true,
                    MomentoAplicacion: true,
                    Familia: true,
                    BlancoBiologico: true,
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

    async changeEstadoPlanificacion(
        id: number,
        estado: string,
        updatedBy?: number
    ) {
        try {
            const planificacionExistente =
                await prisma.nuevaPlanificacion.findUnique({ where: { id } });
            if (!planificacionExistente) {
                throw new CustomError(404, 'Planificación no encontrada');
            }

            const estadosValidos = ['Programado', 'Completado', 'Cancelado'];
            if (!estadosValidos.includes(estado)) {
                throw new CustomError(400, 'Estado no válido');
            }

            return await prisma.nuevaPlanificacion.update({
                where: { id },
                data: {
                    estado,
                    updatedBy,
                    updatedAt: new Date(),
                },
                include: {
                    Colaborador: true,
                    Gte: true,
                    PuntoContacto: true,
                    Vegetacion: true,
                    MomentoAplicacion: true,
                    Familia: true,
                    BlancoBiologico: true,
                },
            });
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(
                500,
                `Error al cambiar estado de planificación: ${
                    (error as Error).message
                }`
            );
        }
    }
}
