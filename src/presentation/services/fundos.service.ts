import { prisma } from "../../data/sqlserver";
import { CreateFundoDto, UpdateFundoDto, CustomError, PaginationDto } from "../../domain";

export class FundoService {
    constructor() {}

    async createFundo(createFundoDto: CreateFundoDto) {
        try {
            const currentDate = new Date();

            const fundo = await prisma.fundo.create({
                data: {
                    nombre: createFundoDto.nombre,
                    idClienteUbigeo: createFundoDto.idClienteUbigeo,
                    idPuntoUbigeo: createFundoDto.idPuntoUbigeo,
                    idPuntoContacto: createFundoDto.idPuntoContacto,
                    idContactoPunto: createFundoDto.idContactoPunto,
                    idDistrito: createFundoDto.idDistrito,
                    centroPoblado: createFundoDto.centroPoblado,
                    createdAt: currentDate,
                    updatedAt: currentDate,
                },
            });

            return {
                id: fundo.id,
                nombre: fundo.nombre,
                centroPoblado: fundo.centroPoblado,
                idClienteUbigeo: fundo.idClienteUbigeo,
                idPuntoUbigeo: fundo.idPuntoUbigeo,
                idPuntoContacto: fundo.idPuntoContacto,
                idContactoPunto: fundo.idContactoPunto,
                idDistrito: fundo.idDistrito,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateFundo(updateFundoDto: UpdateFundoDto) {
        const fundoExists = await prisma.fundo.findFirst({ where: { id: updateFundoDto.id } });
        if (!fundoExists) throw CustomError.badRequest(`Fundo with id ${updateFundoDto.id} does not exist`);

        try {
            const updatedFundo = await prisma.fundo.update({
                where: { id: updateFundoDto.id },
                data: {
                    ...updateFundoDto.values, // Usar valores directamente del DTO
                    updatedAt: new Date(),
                },
            });

            return updatedFundo;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getFundos(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;

        try {
            const [total, fundos] = await Promise.all([
                prisma.fundo.count(),
                prisma.fundo.findMany({
                    skip: (page - 1) * limit,
                    take: limit,
                })
            ]);

            return {
                page: page,
                limit: limit,
                total: total,
                next: `/api/fundos?page=${page + 1}&limit=${limit}`,
                prev: (page - 1 > 0) ? `/api/fundos?page=${page - 1}&limit=${limit}` : null,
                fundos,
            };

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getFundosByPuntoContactoId(idPuntoContacto: number) {
        try {
            const fundos = await prisma.fundo.findMany({
                where: { idPuntoContacto },
                include: {
                    PuntoUbigeo: {
                        select: {
                            Distrito: {
                                select: {
                                    id: true,
                                    nombre: true
                                }
                            },
                            
                        }
                    },
                    PuntoContacto: {
                        select: {
                            id: true,
                            nombre: true,
                            
                        }
                    },
                    ContactoPunto: {
                        select: {
                            id: true,
                            nombre: true,
                            
                        }
                    }
                }
            });

            //if (fundos.length === 0) throw CustomError.badRequest(`No Fundos found with PuntoUbigeo id ${idPuntoUbigeo}`);

            return fundos.map(fundo => ({
                id: fundo.id,
                nombre: fundo.nombre,
                idClienteUbigeo: fundo.idClienteUbigeo,
                idPuntoUbigeo: fundo.idPuntoUbigeo,
                idPuntoContacto: fundo.idPuntoContacto,
                punto: fundo.PuntoContacto?.nombre,
                idDistrito: fundo.PuntoUbigeo?.Distrito.id,
                distrito: fundo.PuntoUbigeo?.Distrito.nombre,
                createdAt: fundo.createdAt,
                updatedAt: fundo.updatedAt
            }));
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getFundosByContactoPuntoId(idContactoPunto: number) {
        try {
            const fundos = await prisma.fundo.findMany({
                where: { idContactoPunto },
                include: {
                    ContactoPunto: {
                        select: {
                            id: true,
                            nombre: true,
                            
                        }
                    },
                    Distrito: {
                        select: {
                            id: true,
                            nombre: true,
                            idProvincia: true,
                            Provincia: {
                                select: {
                                    Departamento: true
                                }
                            }
                        }
                    }
                }
            });

            //if (fundos.length === 0) throw CustomError.badRequest(`No Fundos found with PuntoUbigeo id ${idPuntoUbigeo}`);

            return fundos.map(fundo => ({
                id: fundo.id,
                nombre: fundo.nombre,
                idClienteUbigeo: fundo.idClienteUbigeo,
                idPuntoUbigeo: fundo.idPuntoUbigeo,
                idPuntoContacto: fundo.idPuntoContacto,
                idContactoPunto: fundo.ContactoPunto?.id,
                idDistrito: fundo.Distrito?.id,
                distrito: fundo.Distrito?.nombre,
                idProvincia: fundo.Distrito?.idProvincia,
                departamento: fundo.Distrito?.Provincia.Departamento.nombre,
                createdAt: fundo.createdAt,
                updatedAt: fundo.updatedAt
            }));
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getFundoById(id: number) {
        try {
            const fundo = await prisma.fundo.findUnique({
                where: { id }
            });

            if (!fundo) throw CustomError.badRequest(`Fundo with id ${id} does not exist`);

            return fundo;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}