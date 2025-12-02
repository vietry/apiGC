import { prisma } from '../../data/sqlserver';
import { CustomError, PaginationDto } from '../../domain';

export class DistritoService {
    async getDistritos(
        departamento?: string,
        provincia?: string,
        pais?: string
    ) {
        try {
            const where: any = {};

            // Filtro por país
            if (pais) {
                where.pais = {
                    contains: pais,
                };
            }

            // Filtro por departamento a través de la relación con Provincia
            if (departamento) {
                where.Provincia = {
                    Departamento: {
                        nombre: {
                            contains: departamento,
                        },
                    },
                };
            }

            // Filtro por provincia
            if (provincia) {
                where.Provincia = {
                    ...where.Provincia,
                    nombre: {
                        contains: provincia,
                    },
                };
            }

            const distritos = await prisma.distrito.findMany({
                where,
                include: {
                    Provincia: {
                        select: {
                            id: true,
                            nombre: true,
                            Departamento: {
                                select: {
                                    id: true,
                                    nombre: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    nombre: 'asc',
                },
            });

            return distritos.map((distrito) => ({
                id: distrito.id,
                nombre: distrito.nombre,
                idProvincia: distrito.idProvincia,
                idDepartamento: distrito.idDepartamento,
                pais: distrito.pais,
                provincia: distrito.Provincia?.nombre || null,
                departamento: distrito.Provincia?.Departamento?.nombre || null,
            }));
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getDistritosByPage(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;

        try {
            const [total, distritos] = await Promise.all([
                prisma.distrito.count(),
                prisma.distrito.findMany({
                    skip: (page - 1) * limit,
                    take: limit,
                    include: {
                        Provincia: {
                            select: {
                                id: true,
                                nombre: true,
                                Departamento: {
                                    select: {
                                        id: true,
                                        nombre: true,
                                    },
                                },
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
                distritos: distritos.map((distrito) => ({
                    id: distrito.id,
                    nombre: distrito.nombre,
                    idProvincia: distrito.idProvincia,
                    idDepartamento: distrito.idDepartamento,
                    pais: distrito.pais,
                    provincia: distrito.Provincia?.nombre || null,
                    departamento:
                        distrito.Provincia?.Departamento?.nombre || null,
                })),
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getDistritoById(id: string) {
        try {
            const distrito = await prisma.distrito.findUnique({
                where: { id },
                include: {
                    Provincia: {
                        select: {
                            id: true,
                            nombre: true,
                            Departamento: {
                                select: {
                                    id: true,
                                    nombre: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!distrito)
                throw CustomError.badRequest(
                    `Distrito with id ${id} does not exist`
                );

            return {
                id: distrito.id,
                nombre: distrito.nombre,
                idProvincia: distrito.idProvincia,
                idDepartamento: distrito.idDepartamento,
                pais: distrito.pais,
                provincia: distrito.Provincia?.nombre || null,
                departamento: distrito.Provincia?.Departamento?.nombre || null,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
