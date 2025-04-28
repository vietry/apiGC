import { prisma } from '../../data/sqlserver';
import { CustomError, PaginationDto } from '../../domain';

export class VariedadService {
    constructor() {}

    async createVariedad(data: {
        nombre: string;
        idVegetacion: number;
        idFoto?: number;
    }) {
        try {
            const currentDate = new Date();

            const variedad = await prisma.variedad.create({
                data: {
                    ...data,
                    createdAt: currentDate,
                    updatedAt: currentDate,
                },
            });

            return {
                id: variedad.id,
                nombre: variedad.nombre,
                idVegetacion: variedad.idVegetacion,
                idFoto: variedad.idFoto,
                createdAt: variedad.createdAt,
                updatedAt: variedad.updatedAt,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateVariedad(
        id: number,
        data: { nombre?: string; idVegetacion?: number; idFoto?: number }
    ) {
        const variedadExists = await prisma.variedad.findFirst({
            where: { id },
        });
        if (!variedadExists)
            throw CustomError.badRequest(
                `Variedad with id ${id} does not exist`
            );

        try {
            const updatedVariedad = await prisma.variedad.update({
                where: { id },
                data: {
                    ...data,
                    updatedAt: new Date(),
                },
            });

            return updatedVariedad;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getVariedades() {
        try {
            const variedades = await prisma.variedad.findMany({
                include: {
                    Vegetacion: {
                        select: {
                            nombre: true,
                        },
                    },
                },
            });

            return variedades.map((variedad) => ({
                id: variedad.id,
                nombre: variedad.nombre,
                idVegetacion: variedad.idVegetacion,
                idFoto: variedad.idFoto,
                createdAt: variedad.createdAt,
                updatedAt: variedad.updatedAt,
                vegetacion: variedad.Vegetacion.nombre,
            }));
            //return variedades;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getVariedadById(id: number) {
        try {
            const variedad = await prisma.variedad.findUnique({
                where: { id },
            });

            if (!variedad)
                throw CustomError.badRequest(
                    `Variedad with id ${id} does not exist`
                );

            return variedad;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getVariedadesByPage(
        paginationDto: PaginationDto,
        nombre?: string,
        idVegetacion?: number,
        vegetacion?: string
    ) {
        const { page, limit } = paginationDto;

        try {
            // Filtros
            const where: any = {};
            if (nombre) {
                where.nombre = { contains: nombre };
            }
            if (idVegetacion) {
                where.idVegetacion = idVegetacion;
            }
            if (vegetacion) {
                where.Vegetacion = { nombre: { contains: vegetacion } };
            }

            const [total, variedades] = await Promise.all([
                await prisma.variedad.count({ where }),
                await prisma.variedad.findMany({
                    skip: (page - 1) * limit,
                    take: limit,
                    where: where,
                    include: {
                        Vegetacion: true,
                    },
                }),
            ]);

            return {
                page: page,
                pages: Math.ceil(total / limit),
                limit: limit,
                total: total,
                variedades: variedades.map((variedad) => {
                    return {
                        id: variedad.id,
                        nombre: variedad.nombre,
                        createdAt: variedad.createdAt,
                        updatedAt: variedad.updatedAt,
                        vegetacion: variedad.Vegetacion.nombre,
                    };
                }),
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
