import { prisma } from '../../data/sqlserver';
import {
    CreateVisitaCultivoAgricultorDto,
    CustomError,
    PaginationDto,
    UpdateVisitaCultivoAgricultorDto,
} from '../../domain';

export interface VisitaCultivoAgricultorFilters {
    visitaId?: number;
    cultivoAgricultorId?: number;
}

export class VisitaCultivoAgricultorService {
    private buildVisitaCultivoAgricultorWhere(
        filters: VisitaCultivoAgricultorFilters = {}
    ) {
        const where: any = {};

        if (filters.visitaId) where.visitaId = filters.visitaId;
        if (filters.cultivoAgricultorId)
            where.cultivoAgricultorId = filters.cultivoAgricultorId;

        return where;
    }
    async createVisitaCultivoAgricultor(
        createVisitaCultivoAgricultorDto: CreateVisitaCultivoAgricultorDto
    ) {
        // Validar que la Visita exista
        const visitaExists = await prisma.visita.findFirst({
            where: { id: createVisitaCultivoAgricultorDto.visitaId },
        });

        if (!visitaExists)
            throw CustomError.badRequest(
                `Visita con id ${createVisitaCultivoAgricultorDto.visitaId} no existe`
            );

        // Validar que el CultivoAgricultor exista
        const cultivoAgricultorExists =
            await prisma.cultivoAgricultor.findFirst({
                where: {
                    id: createVisitaCultivoAgricultorDto.cultivoAgricultorId,
                },
            });

        if (!cultivoAgricultorExists)
            throw CustomError.badRequest(
                `CultivoAgricultor con id ${createVisitaCultivoAgricultorDto.cultivoAgricultorId} no existe`
            );

        try {
            const currentDate = new Date();

            const visitaCultivoAgricultor =
                await prisma.visitaCultivoAgricultor.create({
                    data: {
                        visitaId: createVisitaCultivoAgricultorDto.visitaId,
                        cultivoAgricultorId:
                            createVisitaCultivoAgricultorDto.cultivoAgricultorId,
                        createdBy: createVisitaCultivoAgricultorDto.createdBy,
                        createdAt: currentDate,
                        updatedAt: currentDate,
                    },
                });

            return {
                id: visitaCultivoAgricultor.id,
                visitaId: visitaCultivoAgricultor.visitaId,
                cultivoAgricultorId:
                    visitaCultivoAgricultor.cultivoAgricultorId,
                createdAt: visitaCultivoAgricultor.createdAt,
                createdBy: visitaCultivoAgricultor.createdBy,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateVisitaCultivoAgricultor(
        updateVisitaCultivoAgricultorDto: UpdateVisitaCultivoAgricultorDto
    ) {
        const visitaCultivoAgricultorExists =
            await prisma.visitaCultivoAgricultor.findFirst({
                where: { id: updateVisitaCultivoAgricultorDto.id },
            });

        if (!visitaCultivoAgricultorExists)
            throw CustomError.badRequest(
                `VisitaCultivoAgricultor con id ${updateVisitaCultivoAgricultorDto.id} no existe`
            );

        try {
            const updatedVisitaCultivoAgricultor =
                await prisma.visitaCultivoAgricultor.update({
                    where: { id: updateVisitaCultivoAgricultorDto.id },
                    data: {
                        ...updateVisitaCultivoAgricultorDto.values,
                        updatedAt: new Date(),
                    },
                });

            return updatedVisitaCultivoAgricultor;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getVisitasCultivoAgricultor(
        paginationDto?: PaginationDto,
        filters: VisitaCultivoAgricultorFilters = {}
    ) {
        const where = this.buildVisitaCultivoAgricultorWhere(filters);

        try {
            // Si hay paginación, retornar con paginación
            if (paginationDto) {
                const { page, limit } = paginationDto;

                const [total, visitasCultivoAgricultor] = await Promise.all([
                    prisma.visitaCultivoAgricultor.count({ where }),
                    prisma.visitaCultivoAgricultor.findMany({
                        where,
                        skip: (page - 1) * limit,
                        take: limit,
                        include: {
                            Visita: {
                                select: {
                                    id: true,
                                    objetivo: true,
                                    programacion: true,
                                    inicio: true,
                                },
                            },
                            CultivoAgricultor: {
                                select: {
                                    id: true,
                                    Contacto: {
                                        select: {
                                            nombre: true,
                                            apellido: true,
                                        },
                                    },
                                    Vegetacion: {
                                        select: {
                                            nombre: true,
                                        },
                                    },
                                },
                            },
                        },
                    }),
                ]);

                return {
                    page,
                    pages: Math.ceil(total / limit),
                    limit,
                    total,
                    visitasCultivoAgricultor: visitasCultivoAgricultor.map(
                        (visita) => ({
                            id: visita.id,
                            visitaId: visita.visitaId,
                            visitaObjetivo: visita.Visita.objetivo,
                            visitaProgramacion: visita.Visita.programacion,
                            visitaInicio: visita.Visita.inicio,
                            cultivoAgricultorId: visita.cultivoAgricultorId,
                            contactoNombre: `${visita.CultivoAgricultor.Contacto.nombre} ${visita.CultivoAgricultor.Contacto.apellido}`,
                            vegetacionNombre:
                                visita.CultivoAgricultor.Vegetacion.nombre,
                            createdAt: visita.createdAt,
                            updatedAt: visita.updatedAt,
                        })
                    ),
                };
            }

            // Sin paginación, retornar todos los registros
            const visitasCultivoAgricultor =
                await prisma.visitaCultivoAgricultor.findMany({
                    where,
                    include: {
                        Visita: {
                            select: {
                                id: true,
                                objetivo: true,
                                programacion: true,
                                inicio: true,
                            },
                        },
                        CultivoAgricultor: {
                            select: {
                                id: true,
                                Contacto: {
                                    select: {
                                        nombre: true,
                                        apellido: true,
                                    },
                                },
                                Vegetacion: {
                                    select: {
                                        nombre: true,
                                    },
                                },
                            },
                        },
                    },
                });

            return {
                visitasCultivoAgricultor: visitasCultivoAgricultor.map(
                    (visita) => ({
                        id: visita.id,
                        visitaId: visita.visitaId,
                        visitaObjetivo: visita.Visita.objetivo,
                        visitaProgramacion: visita.Visita.programacion,
                        visitaInicio: visita.Visita.inicio,
                        cultivoAgricultorId: visita.cultivoAgricultorId,
                        contactoNombre: `${visita.CultivoAgricultor.Contacto.nombre} ${visita.CultivoAgricultor.Contacto.apellido}`,
                        vegetacionNombre:
                            visita.CultivoAgricultor.Vegetacion.nombre,
                        createdAt: visita.createdAt,
                        updatedAt: visita.updatedAt,
                    })
                ),
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getVisitaCultivoAgricultorById(id: number) {
        try {
            const visitaCultivoAgricultor =
                await prisma.visitaCultivoAgricultor.findUnique({
                    where: { id },
                    include: {
                        Visita: {
                            select: {
                                id: true,
                                objetivo: true,
                                programacion: true,
                                inicio: true,
                            },
                        },
                        CultivoAgricultor: {
                            select: {
                                id: true,
                                Contacto: {
                                    select: {
                                        nombre: true,
                                        apellido: true,
                                    },
                                },
                                Vegetacion: {
                                    select: {
                                        nombre: true,
                                    },
                                },
                            },
                        },
                    },
                });

            if (!visitaCultivoAgricultor)
                throw CustomError.badRequest(
                    `VisitaCultivoAgricultor con id ${id} no existe`
                );

            return {
                id: visitaCultivoAgricultor.id,
                visitaId: visitaCultivoAgricultor.visitaId,
                visitaObjetivo: visitaCultivoAgricultor.Visita.objetivo,
                visitaProgramacion: visitaCultivoAgricultor.Visita.programacion,
                visitaInicio: visitaCultivoAgricultor.Visita.inicio,
                cultivoAgricultorId:
                    visitaCultivoAgricultor.cultivoAgricultorId,
                contactoNombre: `${visitaCultivoAgricultor.CultivoAgricultor.Contacto.nombre} ${visitaCultivoAgricultor.CultivoAgricultor.Contacto.apellido}`,
                vegetacionNombre:
                    visitaCultivoAgricultor.CultivoAgricultor.Vegetacion.nombre,
                createdAt: visitaCultivoAgricultor.createdAt,
                updatedAt: visitaCultivoAgricultor.updatedAt,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async deleteVisitaCultivoAgricultor(id: number) {
        const visitaCultivoAgricultorExists =
            await prisma.visitaCultivoAgricultor.findFirst({
                where: { id },
            });

        if (!visitaCultivoAgricultorExists)
            throw CustomError.badRequest(
                `VisitaCultivoAgricultor con id ${id} no existe`
            );

        try {
            await prisma.visitaCultivoAgricultor.delete({
                where: { id },
            });

            return {
                message: 'VisitaCultivoAgricultor eliminado correctamente',
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
