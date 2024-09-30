import { prisma } from "../../data/sqlserver";
import { CustomError, PaginationDto } from "../../domain";
import { CreateVegetacionDto } from "../../domain/dtos/vegetacion/create-vegetacion.dto";
import { UpdateVegetacionDto } from "../../domain/dtos/vegetacion/update-vegetacion.dto";

export class VegetacionService {

    // DI
    constructor() {}

    async createVegetacion(createVegetacionDto: CreateVegetacionDto) {
        try {
            const currentDate = new Date();

            const vegetacion = await prisma.vegetacion.create({
                data: {
                    nombre: createVegetacionDto.nombre,
                    createdAt: currentDate,
                    updatedAt: currentDate,
                },
            });

            return {
                id: vegetacion.id,
                nombre: vegetacion.nombre,
                createdAt: vegetacion.createdAt,
                updatedAt: vegetacion.updatedAt,
            };

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateVegetacion(updateVegetacionDto: UpdateVegetacionDto) {
        const vegetacionExists = await prisma.vegetacion.findFirst({ where: { id: updateVegetacionDto.id } });
        if (!vegetacionExists) throw CustomError.badRequest(`Vegetacion with id ${updateVegetacionDto.id} does not exist`);

        try {
            const updatedVegetacion = await prisma.vegetacion.update({
                where: { id: updateVegetacionDto.id },
                data: {
                    ...updateVegetacionDto.values,
                    updatedAt: new Date(),
                },
            });

            return updatedVegetacion;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getVegetacion() {
        try {
            const vegetaciones = await prisma.vegetacion.findMany({
                where: {
                    nombre: {
                        not: 'VARIOS CULTIVOS',
                    },
                },
                orderBy: {
                    nombre: 'asc',
                },
            });
    
            return vegetaciones.map((vegetacion) => ({
                id: vegetacion.id,
                nombre: vegetacion.nombre,
                createdAt: vegetacion.createdAt,
                updatedAt: vegetacion.updatedAt,
            }));
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

        async getVegetacionGC() {
            try {
                const vegetaciones = await prisma.vegetacion.findMany();
    
                return vegetaciones.map((vegetacion) => ({
                    id: vegetacion.id,
                    nombre: vegetacion.nombre,
                    createdAt: vegetacion.createdAt,
                    updatedAt: vegetacion.updatedAt,
                }));
            } catch (error) {
                throw CustomError.internalServer(`${error}`);
            }
        }

    /*async getVegetacion(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;

        try {
            const [total, vegetaciones] = await Promise.all([
                await prisma.vegetacion.count(),
                await prisma.vegetacion.findMany({
                    skip: ((page - 1) * limit),
                    take: limit,
                })
            ]);

            return {
                page: page,
                limit: limit,
                total: total,
                next: `/v1/vegetaciones?page${(page + 1)}&limit=${limit}`,
                prev: (page - 1 > 0) ? `/v1/vegetaciones?page${(page - 1)}&limit=${limit}` : null,
                vegetaciones: vegetaciones.map((vegetacion) => {
                    return {
                        id: vegetacion.id,
                        nombre: vegetacion.nombre,
                        createdAt: vegetacion.createdAt,
                        updatedAt: vegetacion.updatedAt,
                    };
                })
            };

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }*/

    async getVegetacionById(id: number) {
        try {
            const vegetacion = await prisma.vegetacion.findUnique({
                where: { id },
            });

            if (!vegetacion) throw CustomError.badRequest(`Vegetacion with id ${id} does not exist`);

            return vegetacion;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
