import { prisma } from "../../data/sqlserver";
import { CustomError, PaginationDto } from "../../domain";

export class ProvinciaService {
    constructor() {}

    async getProvinciasByPage(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;

        try {
            const [total, provincias] = await Promise.all([
                await prisma.provincia.count(),
                await prisma.provincia.findMany({
                    skip: ((page - 1) * limit),
                    take: limit,
                    include: {
                        Departamento: {
                            select: {
                                nombre: true,
                            }
                        }
                    }
                })
            ]);

            return {
                page: page,
                limit: limit,
                total: total,
                next: `/v1/provincias?page=${(page + 1)}&limit=${limit}`,
                prev: (page - 1 > 0) ? `/v1/provincias?page=${(page - 1)}&limit=${limit}` : null,
                provincias: provincias.map((provincia) => {
                    return {
                        id: provincia.id,
                        nombre: provincia.nombre,
                        idDepartamento: provincia.idDepartamento,
                        departamento: provincia.Departamento.nombre,
                    };
                })
            };

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getProvincias() {
        try {
            const provincias = await prisma.provincia.findMany({
                include: {
                    Departamento: {
                        select: {
                            nombre: true
                        }
                    }
                }
            });

            return provincias.map((provincia) => ({
                id: provincia.id,
                nombre: provincia.nombre,
                idDepartamento: provincia.idDepartamento,
                departamento: provincia.Departamento.nombre

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
                            nombre: true,
                        }
                    }
                }
            });

            if (!provincia) throw CustomError.badRequest(`Provincia with id ${id} does not exist`);

            return {
                id: provincia.id,
                nombre: provincia.nombre,
                idDepartamento: provincia.idDepartamento,
                departamento: provincia.Departamento.nombre,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}