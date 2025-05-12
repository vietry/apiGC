import { prisma } from '../../data/sqlserver';
import { CustomError, PaginationDto } from '../../domain';

export class DistritoService {
    async getDistritos(departamento?: string, provincia?: string) {
        try {
            const where: any = {};
            if (departamento) {
                where.Provincia = {
                    Departamento: { nombre: { contains: departamento } },
                };
            }
            if (provincia) {
                where.Provincia = { nombre: { contains: provincia } };
            }

            const distritos = await prisma.distrito.findMany({
                where,
                include: {
                    Provincia: {
                        select: {
                            nombre: true,
                            Departamento: {
                                select: {
                                    nombre: true,
                                },
                            },
                        },
                    },
                },
            });

            return distritos.map((distrito) => ({
                id: distrito.id,
                nombre: distrito.nombre,
                idProvincia: distrito.idProvincia,
                idDepartamento: distrito.idDepartamento,
                provincia: distrito.Provincia.nombre,
                departamento: distrito.Provincia.Departamento.nombre,
            }));
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getDistritosByPage(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;

        try {
            const [total, distritos] = await Promise.all([
                await prisma.distrito.count(),
                await prisma.distrito.findMany({
                    skip: (page - 1) * limit,
                    take: limit,
                    include: {
                        Provincia: {
                            select: {
                                nombre: true,
                                Departamento: {
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
                page: page,
                limit: limit,
                total: total,
                distritos: distritos.map((distrito) => {
                    return {
                        id: distrito.id,
                        nombre: distrito.nombre,
                        idProvincia: distrito.idProvincia,
                        idDepartamento: distrito.idDepartamento,
                        provincia: distrito.Provincia.nombre,
                        departamento: distrito.Provincia.Departamento.nombre,
                    };
                }),
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getDistritoById(id: string) {
        try {
            const distrito = await prisma.distrito.findUnique({
                where: { id },
            });

            if (!distrito)
                throw CustomError.badRequest(
                    `Distrito with id ${id} does not exist`
                );

            return distrito;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
