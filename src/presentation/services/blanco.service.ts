import { prisma } from '../../data/sqlserver';
import {
    CreateBlancoBiologicoDto,
    CustomError,
    PaginationDto,
    UpdateBlancoBiologicoDto,
} from '../../domain';

export class BlancoBiologicoService {
    // DI
    constructor() {}

    async createBlancoBiologico(
        createBlancoBiologicoDto: CreateBlancoBiologicoDto
    ) {
        try {
            const currentDate = new Date();

            const blancoBiologico = await prisma.blancoBiologico.create({
                data: {
                    cientifico: createBlancoBiologicoDto.cientifico,
                    estandarizado: createBlancoBiologicoDto.estandarizado,
                    idVegetacion: createBlancoBiologicoDto.idVegetacion,
                    createdAt: currentDate,
                    updatedAt: currentDate,
                },
            });

            return {
                id: blancoBiologico.id,
                cientifico: blancoBiologico.cientifico,
                estandarizado: blancoBiologico.estandarizado,
                idVegetacion: blancoBiologico.idVegetacion,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateBlancoBiologico(
        updateBlancoBiologicoDto: UpdateBlancoBiologicoDto
    ) {
        const blancoBiologicoExists = await prisma.blancoBiologico.findFirst({
            where: { id: updateBlancoBiologicoDto.id },
        });
        if (!blancoBiologicoExists)
            throw CustomError.badRequest(
                `BlancoBiologico with id ${updateBlancoBiologicoDto.id} does not exist`
            );

        try {
            const updatedBlancoBiologico = await prisma.blancoBiologico.update({
                where: { id: updateBlancoBiologicoDto.id },
                data: {
                    ...updateBlancoBiologicoDto.values,
                    updatedAt: new Date(),
                },
            });

            return updatedBlancoBiologico;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getBlancosBiologicosByPage(
        paginationDto: PaginationDto,
        cientifico?: string,
        estandarizado?: string,
        idVegetacion?: number,
        vegetacion?: string
    ) {
        const { page, limit } = paginationDto;

        try {
            const where: any = {};
            if (cientifico) {
                where.cientifico = { contains: cientifico };
            }
            if (idVegetacion) {
                where.idVegetacion = idVegetacion;
            }
            if (estandarizado) {
                where.estandarizado = { contains: estandarizado };
            }
            if (vegetacion) {
                where.Vegetacion = { nombre: { contains: vegetacion } };
            }

            const [total, blancosBiologicos] = await Promise.all([
                await prisma.blancoBiologico.count({ where }),
                await prisma.blancoBiologico.findMany({
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
                blancosBiologicos: blancosBiologicos.map((blancoBiologico) => {
                    return {
                        id: blancoBiologico.id,
                        cientifico: blancoBiologico.cientifico,
                        estandarizado: blancoBiologico.estandarizado,
                        idVegetacion: blancoBiologico.idVegetacion,
                        vegetacion: blancoBiologico.Vegetacion.nombre,
                        createdAt: blancoBiologico.createdAt,
                        updatedAt: blancoBiologico.updatedAt,
                    };
                }),
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getBlancosBiologicos(
        cientifico?: string,
        estandarizado?: string,
        idVegetacion?: number,
        vegetacion?: string
    ) {
        try {
            const where: any = {};
            if (cientifico) {
                where.cientifico = { contains: cientifico };
            }
            if (idVegetacion) {
                where.idVegetacion = idVegetacion;
            }
            if (estandarizado) {
                where.estandarizado = { contains: estandarizado };
            }
            if (vegetacion) {
                where.Vegetacion = { nombre: { contains: vegetacion } };
            }

            const blancosBiologicos = await prisma.blancoBiologico.findMany({
                where: where, // <-- Agregado el filtro
                include: {
                    Vegetacion: {
                        select: {
                            nombre: true,
                        },
                    },
                },
                orderBy: {
                    estandarizado: 'asc',
                },
            });

            // Filtrar los resultados para obtener valores únicos en 'cientifico'
            const uniqueBlancosBiologicos = Array.from(
                new Map(
                    blancosBiologicos.map((item) => [item.cientifico, item])
                ).values()
            );

            return uniqueBlancosBiologicos.map((blancoBiologico) => ({
                id: blancoBiologico.id,
                cientifico: blancoBiologico.cientifico,
                estandarizado: blancoBiologico.estandarizado,
                idVegetacion: blancoBiologico.idVegetacion,
                vegetacion: blancoBiologico.Vegetacion?.nombre,
                createdAt: blancoBiologico.createdAt,
                updatedAt: blancoBiologico.updatedAt,
            }));
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getBlancoBiologicoById(id: number) {
        try {
            const blancoBiologico = await prisma.blancoBiologico.findUnique({
                where: { id },
                include: {
                    Vegetacion: true,
                },
            });

            if (!blancoBiologico)
                throw CustomError.badRequest(
                    `BlancoBiologico with id ${id} does not exist`
                );

            return blancoBiologico;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
