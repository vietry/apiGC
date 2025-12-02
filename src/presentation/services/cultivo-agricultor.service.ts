import { prisma } from '../../data/sqlserver';
import {
    CreateCultivoAgricultorDto,
    CustomError,
    PaginationDto,
    UpdateCultivoAgricultorDto,
} from '../../domain';

export interface CultivoAgricultorFilters {
    contactoId?: number;
    vegetacionId?: number;
}

export class CultivoAgricultorService {
    private buildCultivoAgricultorWhere(
        filters: CultivoAgricultorFilters = {}
    ) {
        const where: any = {};

        if (filters.contactoId) where.contactoId = filters.contactoId;
        if (filters.vegetacionId) where.vegetacionId = filters.vegetacionId;

        return where;
    }

    async createCultivoAgricultor(
        createCultivoAgricultorDto: CreateCultivoAgricultorDto
    ) {
        // Validar que el Contacto exista
        const contactoExists = await prisma.contacto.findFirst({
            where: { id: createCultivoAgricultorDto.contactoId },
        });

        if (!contactoExists)
            throw CustomError.badRequest(
                `Contacto con id ${createCultivoAgricultorDto.contactoId} no existe`
            );

        // Validar que la Vegetacion exista
        const vegetacionExists = await prisma.vegetacion.findFirst({
            where: { id: createCultivoAgricultorDto.vegetacionId },
        });

        if (!vegetacionExists)
            throw CustomError.badRequest(
                `Vegetacion con id ${createCultivoAgricultorDto.vegetacionId} no existe`
            );

        try {
            const currentDate = new Date();

            const cultivoAgricultor = await prisma.cultivoAgricultor.create({
                data: {
                    contactoId: createCultivoAgricultorDto.contactoId,
                    vegetacionId: createCultivoAgricultorDto.vegetacionId,
                    createdBy: createCultivoAgricultorDto.createdBy,
                    nomAsesor: createCultivoAgricultorDto.nomAsesor,
                    numAsesor: createCultivoAgricultorDto.numAsesor,
                    cargoAsesor: createCultivoAgricultorDto.cargoAsesor,
                    createdAt: currentDate,
                    updatedAt: currentDate,
                },
            });

            return {
                id: cultivoAgricultor.id,
                contactoId: cultivoAgricultor.contactoId,
                vegetacionId: cultivoAgricultor.vegetacionId,
                nomAsesor: cultivoAgricultor.nomAsesor,
                numAsesor: cultivoAgricultor.numAsesor,
                cargoAsesor: cultivoAgricultor.cargoAsesor,
                createdAt: cultivoAgricultor.createdAt,
                createdBy: cultivoAgricultor.createdBy,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateCultivoAgricultor(
        updateCultivoAgricultorDto: UpdateCultivoAgricultorDto
    ) {
        const cultivoAgricultorExists =
            await prisma.cultivoAgricultor.findFirst({
                where: { id: updateCultivoAgricultorDto.id },
            });

        if (!cultivoAgricultorExists)
            throw CustomError.badRequest(
                `CultivoAgricultor con id ${updateCultivoAgricultorDto.id} no existe`
            );

        try {
            const updatedCultivoAgricultor =
                await prisma.cultivoAgricultor.update({
                    where: { id: updateCultivoAgricultorDto.id },
                    data: {
                        ...updateCultivoAgricultorDto.values,
                        updatedAt: new Date(),
                    },
                });

            return updatedCultivoAgricultor;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getCultivosAgricultor(
        paginationDto?: PaginationDto,
        filters: CultivoAgricultorFilters = {}
    ) {
        const where = this.buildCultivoAgricultorWhere(filters);

        try {
            // Si hay paginación, retornar con paginación
            if (paginationDto) {
                const { page, limit } = paginationDto;

                const [total, cultivosAgricultor] = await Promise.all([
                    prisma.cultivoAgricultor.count({ where }),
                    prisma.cultivoAgricultor.findMany({
                        where,
                        skip: (page - 1) * limit,
                        take: limit,
                        include: {
                            Contacto: {
                                select: {
                                    id: true,
                                    nombre: true,
                                    apellido: true,
                                },
                            },
                            Vegetacion: {
                                select: {
                                    id: true,
                                    nombre: true,
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
                    cultivosAgricultor: cultivosAgricultor.map((cultivo) => ({
                        id: cultivo.id,
                        contactoId: cultivo.contactoId,
                        contactoNombre: `${cultivo.Contacto.nombre} ${cultivo.Contacto.apellido}`,
                        vegetacionId: cultivo.vegetacionId,
                        vegetacionNombre: cultivo.Vegetacion.nombre,
                        nomAsesor: cultivo.nomAsesor,
                        numAsesor: cultivo.numAsesor,
                        cargoAsesor: cultivo.cargoAsesor,
                        createdAt: cultivo.createdAt,
                        updatedAt: cultivo.updatedAt,
                    })),
                };
            }

            // Sin paginación, retornar todos los registros
            const cultivosAgricultor = await prisma.cultivoAgricultor.findMany({
                where,
                include: {
                    Contacto: {
                        select: {
                            id: true,
                            nombre: true,
                            apellido: true,
                        },
                    },
                    Vegetacion: {
                        select: {
                            id: true,
                            nombre: true,
                        },
                    },
                },
            });

            return {
                cultivosAgricultor: cultivosAgricultor.map((cultivo) => ({
                    id: cultivo.id,
                    contactoId: cultivo.contactoId,
                    contactoNombre: `${cultivo.Contacto.nombre} ${cultivo.Contacto.apellido}`,
                    vegetacionId: cultivo.vegetacionId,
                    vegetacionNombre: cultivo.Vegetacion.nombre,
                    nomAsesor: cultivo.nomAsesor,
                    numAsesor: cultivo.numAsesor,
                    cargoAsesor: cultivo.cargoAsesor,
                    createdAt: cultivo.createdAt,
                    updatedAt: cultivo.updatedAt,
                })),
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getCultivoAgricultorById(id: number) {
        try {
            const cultivoAgricultor = await prisma.cultivoAgricultor.findUnique(
                {
                    where: { id },
                    include: {
                        Contacto: {
                            select: {
                                id: true,
                                nombre: true,
                                apellido: true,
                            },
                        },
                        Vegetacion: {
                            select: {
                                id: true,
                                nombre: true,
                            },
                        },
                    },
                }
            );

            if (!cultivoAgricultor)
                throw CustomError.badRequest(
                    `CultivoAgricultor con id ${id} no existe`
                );

            return {
                id: cultivoAgricultor.id,
                contactoId: cultivoAgricultor.contactoId,
                contactoNombre: `${cultivoAgricultor.Contacto.nombre} ${cultivoAgricultor.Contacto.apellido}`,
                vegetacionId: cultivoAgricultor.vegetacionId,
                vegetacionNombre: cultivoAgricultor.Vegetacion.nombre,
                nomAsesor: cultivoAgricultor.nomAsesor,
                numAsesor: cultivoAgricultor.numAsesor,
                cargoAsesor: cultivoAgricultor.cargoAsesor,
                createdAt: cultivoAgricultor.createdAt,
                updatedAt: cultivoAgricultor.updatedAt,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async deleteCultivoAgricultor(id: number) {
        const cultivoAgricultorExists =
            await prisma.cultivoAgricultor.findFirst({
                where: { id },
            });

        if (!cultivoAgricultorExists)
            throw CustomError.badRequest(
                `CultivoAgricultor con id ${id} no existe`
            );

        try {
            await prisma.cultivoAgricultor.delete({
                where: { id },
            });

            return { message: 'CultivoAgricultor eliminado correctamente' };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
