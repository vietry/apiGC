import { prisma } from '../../data/sqlserver';
import {
    CreateFundoDto,
    UpdateFundoDto,
    CustomError,
    PaginationDto,
    FundoFilters, // <-- importar FundoFilters
} from '../../domain';

export class FundoService {
    private buildWhere(filters: FundoFilters = {}) {
        const where: any = {};
        if (!filters) return where;

        if (filters.nombre) where.nombre = { contains: filters.nombre };
        if (filters.idPuntoContacto)
            where.idPuntoContacto = filters.idPuntoContacto;
        if (filters.idContactoPunto)
            where.idContactoPunto = filters.idContactoPunto;
        if (filters.ubicacionClienteId)
            where.ubicacionClienteId = filters.ubicacionClienteId;
        if (filters.createdBy) where.createdBy = filters.createdBy;
        if (filters.distrito || filters.provincia || filters.departamento) {
            where.Distrito = { ...(where.Distrito ?? {}) };
            if (filters.distrito)
                where.Distrito.nombre = { contains: filters.distrito };
            if (filters.provincia) {
                where.Distrito.Provincia = {
                    ...(where.Distrito?.Provincia ?? {}),
                    nombre: { contains: filters.provincia },
                };
            }
            if (filters.departamento) {
                where.Distrito = {
                    ...(where.Distrito ?? {}),
                    Provincia: {
                        ...(where.Distrito?.Provincia ?? {}),
                        Departamento: {
                            nombre: { contains: filters.departamento },
                        },
                    },
                };
            }
        }
        return where;
    }
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
                    ubicacionClienteId: createFundoDto.ubicacionClienteId,
                    idDistrito: createFundoDto.idDistrito,
                    centroPoblado: createFundoDto.centroPoblado,
                    createdBy: createFundoDto.createdBy ?? undefined,
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
                ubicacionClienteId: fundo.ubicacionClienteId,
                idDistrito: fundo.idDistrito,
                createdBy: fundo.createdBy,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateFundo(updateFundoDto: UpdateFundoDto) {
        const fundoExists = await prisma.fundo.findFirst({
            where: { id: updateFundoDto.id },
        });
        if (!fundoExists)
            throw CustomError.badRequest(
                `Fundo with id ${updateFundoDto.id} does not exist`
            );

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

    async getFundos(paginationDto: PaginationDto, filters: FundoFilters = {}) {
        const { page, limit } = paginationDto;

        const where = this.buildWhere(filters);

        try {
            const [total, fundos] = await Promise.all([
                prisma.fundo.count({ where }),
                prisma.fundo.findMany({
                    where,
                    skip: (page - 1) * limit,
                    take: limit,
                    include: {
                        Distrito: {
                            select: {
                                id: true,
                                nombre: true,
                                idProvincia: true,
                                Provincia: {
                                    select: {
                                        nombre: true,
                                        Departamento: true,
                                    },
                                },
                            },
                        },
                        PuntoContacto: true,
                        UbicacionCliente: true,
                    },
                }),
            ]);

            return {
                page: page,
                pages: Math.ceil(total / limit),
                limit: limit,
                total: total,
                fundos: fundos.map((fundo) => ({
                    id: fundo.id,
                    nombre: fundo.nombre,
                    centroPoblado: fundo.centroPoblado,
                    idClienteUbigeo: fundo.idClienteUbigeo,
                    idPuntoUbigeo: fundo.idPuntoUbigeo,
                    idPuntoContacto: fundo.idPuntoContacto,
                    idContactoPunto: fundo.idContactoPunto,
                    ubicacionClienteId: fundo.ubicacionClienteId,
                    idDistrito: fundo.idDistrito,
                    distrito: fundo.Distrito?.nombre,
                    idProvincia: fundo.Distrito?.idProvincia,
                    provincia: fundo.Distrito?.Provincia?.nombre,
                    departamento: fundo.Distrito?.Provincia.Departamento.nombre,
                    punto: fundo.PuntoContacto?.nombre,
                    cliente: fundo.UbicacionCliente?.nombre,
                    createdBy: fundo.createdBy,
                    createdAt: fundo.createdAt,
                    updatedAt: fundo.updatedAt,
                })),
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getAllFundos(filters: FundoFilters = {}) {
        const where = this.buildWhere(filters);

        try {
            const fundos = await prisma.fundo.findMany({
                where,
                include: {
                    Distrito: {
                        select: {
                            id: true,
                            nombre: true,
                            idProvincia: true,
                            Provincia: {
                                select: {
                                    nombre: true,
                                    Departamento: true,
                                },
                            },
                        },
                    },
                    PuntoContacto: true,
                },
            });

            return fundos.map((fundo) => ({
                id: fundo.id,
                nombre: fundo.nombre,
                centroPoblado: fundo.centroPoblado,
                idClienteUbigeo: fundo.idClienteUbigeo,
                idPuntoUbigeo: fundo.idPuntoUbigeo,
                idPuntoContacto: fundo.idPuntoContacto,
                idContactoPunto: fundo.idContactoPunto,
                ubicacionClienteId: fundo.ubicacionClienteId,
                idDistrito: fundo.idDistrito,
                distrito: fundo.Distrito?.nombre,
                idProvincia: fundo.Distrito?.idProvincia,
                provincia: fundo.Distrito?.Provincia?.nombre,
                departamento: fundo.Distrito?.Provincia.Departamento.nombre,
                punto: fundo.PuntoContacto?.nombre,
                createdBy: fundo.createdBy,
                createdAt: fundo.createdAt,
                updatedAt: fundo.updatedAt,
            }));
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    // async getFundosByPuntoContactoId(idPuntoContacto: number) {
    //     try {
    //         const fundos = await prisma.fundo.findMany({
    //             where: { idPuntoContacto },
    //             include: {
    //                 PuntoUbigeo: {
    //                     select: {
    //                         Distrito: {
    //                             select: {
    //                                 id: true,
    //                                 nombre: true,
    //                             },
    //                         },
    //                     },
    //                 },
    //                 PuntoContacto: {
    //                     select: {
    //                         id: true,
    //                         nombre: true,
    //                     },
    //                 },
    //                 ContactoPunto: {
    //                     select: {
    //                         id: true,
    //                         nombre: true,
    //                     },
    //                 },
    //             },
    //         });

    //         return fundos.map((fundo) => ({
    //             id: fundo.id,
    //             nombre: fundo.nombre,
    //             idClienteUbigeo: fundo.idClienteUbigeo,
    //             idPuntoUbigeo: fundo.idPuntoUbigeo,
    //             idPuntoContacto: fundo.idPuntoContacto,
    //             punto: fundo.PuntoContacto?.nombre,
    //             idDistrito: fundo.PuntoUbigeo?.Distrito.id,
    //             distrito: fundo.PuntoUbigeo?.Distrito.nombre,
    //             createdAt: fundo.createdAt,
    //             updatedAt: fundo.updatedAt,
    //         }));
    //     } catch (error) {
    //         throw CustomError.internalServer(`${error}`);
    //     }
    // }

    async getFundosByContactoPuntoId(idContactoPunto: number) {
        try {
            const fundos = await prisma.fundo.findMany({
                where: { idContactoPunto },
                include: {
                    ContactoPunto: {
                        select: {
                            id: true,
                            nombre: true,
                        },
                    },
                    Distrito: {
                        select: {
                            id: true,
                            nombre: true,
                            idProvincia: true,
                            Provincia: {
                                select: {
                                    Departamento: true,
                                },
                            },
                        },
                    },
                },
            });

            return fundos.map((fundo) => ({
                id: fundo.id,
                nombre: fundo.nombre,
                idClienteUbigeo: fundo.idClienteUbigeo,
                idPuntoUbigeo: fundo.idPuntoUbigeo,
                idPuntoContacto: fundo.idPuntoContacto,
                idContactoPunto: fundo.ContactoPunto?.id,
                ubicacionClienteId: fundo.ubicacionClienteId,
                idDistrito: fundo.Distrito?.id,
                distrito: fundo.Distrito?.nombre,
                idProvincia: fundo.Distrito?.idProvincia,
                departamento: fundo.Distrito?.Provincia.Departamento.nombre,
                createdBy: fundo.createdBy,
                createdAt: fundo.createdAt,
                updatedAt: fundo.updatedAt,
            }));
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getFundoById(id: number) {
        try {
            const fundo = await prisma.fundo.findUnique({
                where: { id },
            });

            if (!fundo)
                throw CustomError.badRequest(
                    `Fundo with id ${id} does not exist`
                );

            return fundo;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
