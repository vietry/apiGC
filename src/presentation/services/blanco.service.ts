import { prisma } from '../../data/sqlserver';
import {
    CreateBlancoBiologicoDto,
    CustomError,
    PaginationDto,
    UpdateBlancoBiologicoDto,
} from '../../domain';

export class BlancoBiologicoService {
    // DI
    //constructor() {}

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

    async getBlancosBiologicosByGtePeriodo(
        idGte: number,
        month: number,
        year: number
    ) {
        try {
            // Buscar las planificaciones del GTE en el período especificado
            const planificaciones = await prisma.nuevaPlanificacion.findMany({
                where: {
                    gteId: idGte,
                    checkJefe: true,
                    activo: true,
                    mes: month,
                    monthYear: {
                        gte: new Date(
                            `${year}-${month.toString().padStart(2, '0')}-01`
                        ),
                        lt: new Date(year, month, 1), // Primer día del siguiente mes
                    },
                },
                select: {
                    blancoId: true, // blancoId corresponde al ID del blanco biológico
                },
                distinct: ['blancoId'], // Obtener IDs únicos de blancos biológicos
            });

            // Extraer los IDs únicos de los blancos biológicos
            const blancoIds = planificaciones.map((p) => p.blancoId);

            if (blancoIds.length === 0) {
                return []; // No hay planificaciones para este GTE en el período especificado
            }

            // Buscar los blancos biológicos correspondientes
            const blancosBiologicos = await prisma.blancoBiologico.findMany({
                where: {
                    id: {
                        in: blancoIds,
                    },
                },
                include: {
                    Vegetacion: true,
                },
                orderBy: {
                    estandarizado: 'asc',
                },
            });

            return blancosBiologicos.map((blancoBiologico) => ({
                id: blancoBiologico.id,
                cientifico: blancoBiologico.cientifico,
                estandarizado: blancoBiologico.estandarizado,
                idVegetacion: blancoBiologico.idVegetacion,
                vegetacion: blancoBiologico.Vegetacion.nombre,
                codi: blancoBiologico.codi,
                createdAt: blancoBiologico.createdAt,
                updatedAt: blancoBiologico.updatedAt,
            }));
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
