import { prisma } from "../../data/sqlserver";
import { CustomError, PaginationDto } from "../../domain";

export class DistritoService {

    // DI
    constructor() {}

    /*async createDistrito(createDistritoDto: CreateDistritoDTO) {
        try {
            const distrito = await prisma.distrito.create({
                data: {
                    id: createDistritoDto.id,
                    nombre: createDistritoDto.nombre,
                    idProvincia: createDistritoDto.idProvincia,
                    idDepartamento: createDistritoDto.idDepartamento,
                },
            });

            return {
                id: distrito.id,
                nombre: distrito.nombre,
                idProvincia: distrito.idProvincia,
                idDepartamento: distrito.idDepartamento,
            };

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateDistrito(updateDistritoDto: UpdateDistritoDTO) {
        const distritoExists = await prisma.distrito.findFirst({ where: { id: updateDistritoDto.id } });
        if (!distritoExists) throw CustomError.badRequest(`Distrito with id ${updateDistritoDto.id} does not exist`);

        try {
            const updatedDistrito = await prisma.distrito.update({
                where: { id: updateDistritoDto.id },
                data: {
                    ...updateDistritoDto.values,
                },
            });

            return updatedDistrito;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }*/

        async getDistritos() {
            try {
                const distritos = await prisma.distrito.findMany({
                    include: {
                        Provincia: {
                            select: {
                                nombre: true,
                                Departamento: {
                                    select: {
                                        nombre: true
                                    }
                                }
                            }
                        }
                    }
                });
    
                return distritos.map((distrito) => ({
                    id: distrito.id,
                    nombre: distrito.nombre,
                    idProvincia: distrito.idProvincia,
                    idDepartamento: distrito.idDepartamento,
                    provincia: distrito.Provincia.nombre,
                    departamento: distrito.Provincia.Departamento.nombre
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
                    skip: ((page - 1) * limit),
                    take: limit,
                    include: {
                        Provincia: {
                            select: {
                                nombre: true,
                                Departamento: {
                                    select: {
                                        nombre: true
                                    }
                                }
                            }
                        }
                        
                        
                    }
                })
            ]);

            return {
                page: page,
                limit: limit,
                total: total,
                next: `/v1/distritos?page${(page + 1)}&limit=${limit}`,
                prev: (page - 1 > 0) ? `/v1/distritos?page${(page - 1)}&limit=${limit}` : null,
                distritos:  
                distritos.map((distrito) => {
                    return {
                        id: distrito.id,
                        nombre: distrito.nombre,
                        idProvincia: distrito.idProvincia,
                        idDepartamento: distrito.idDepartamento,
                        provincia: distrito.Provincia.nombre,
                        departamento: distrito.Provincia.Departamento.nombre
                    };
                })
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

            if (!distrito) throw CustomError.badRequest(`Distrito with id ${id} does not exist`);

            return distrito;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}