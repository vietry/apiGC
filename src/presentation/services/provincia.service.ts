import { prisma } from '../../data/sqlserver';
import { CustomError, PaginationDto } from '../../domain';

export class ProvinciaService {
    constructor() {}

    async getProvinciasByPage(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;

        try {
            const [total, provincias] = await Promise.all([
                prisma.provincia.count(),
                prisma.provincia.findMany({
                    skip: (page - 1) * limit,
                    take: limit,
                    include: {
                        Departamento: {
                            select: {
                                id: true,
                                nombre: true,
                            },
                        },
                    },
                    orderBy: {
                        nombre: 'asc',
                    },
                }),
            ]);

            return {
                page: page,
                limit: limit,
                total: total,
                provincias: provincias.map((provincia) => ({
                    id: provincia.id,
                    nombre: provincia.nombre,
                    idDepartamento: provincia.idDepartamento,
                    pais: provincia.pais,
                    departamento: provincia.Departamento?.nombre || null,
                })),
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getProvincias(departamento?: string, pais?: string) {
        try {
            const where: any = {};

            // Filtro por país
            if (pais) {
                where.pais = {
                    contains: pais,
                };
            }

            // Filtro por departamento
            if (departamento) {
                where.Departamento = {
                    nombre: {
                        contains: departamento,
                    },
                };
            }

            const provincias = await prisma.provincia.findMany({
                where,
                include: {
                    Departamento: {
                        select: {
                            id: true,
                            nombre: true,
                        },
                    },
                },
                orderBy: {
                    nombre: 'asc',
                },
            });

            return provincias.map((provincia) => ({
                id: provincia.id,
                nombre: provincia.nombre.trim(),
                idDepartamento: provincia.idDepartamento,
                pais: provincia.pais,
                departamento: provincia.Departamento?.nombre || null,
            }));
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getProvinciaById(id: string) {
        try {
            const provincia = await prisma.provincia.findUnique({
                where: { id },
                include: {
                    Departamento: {
                        select: {
                            id: true,
                            nombre: true,
                        },
                    },
                },
            });

            if (!provincia)
                throw CustomError.badRequest(
                    `Provincia with id ${id} does not exist`
                );

            return {
                id: provincia.id,
                nombre: provincia.nombre,
                idDepartamento: provincia.idDepartamento,
                pais: provincia.pais,
                departamento: provincia.Departamento?.nombre || null,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
