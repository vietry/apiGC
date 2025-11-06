import { prisma } from '../../data/sqlserver';
import {
    CreateCultivoDto,
    CultivoFilters,
    CustomError,
    PaginationDto,
    UpdateCultivoDto,
} from '../../domain';

export class CultivoService {
    // DI

    private buildCultivoWhere(filters: CultivoFilters = {}) {
        const where: any = {};
        if (!filters) return where;

        if (filters.centroPoblado)
            where.Fundo = {
                ...(where.Fundo ?? {}),
                centroPoblado: { contains: filters.centroPoblado },
            };
        if (filters.idCultivo) where.id = filters.idCultivo;
        if (filters.idFundo) where.idFundo = filters.idFundo;
        if (filters.ubicacionClienteId)
            where.Fundo = {
                ...(where.Fundo ?? {}),
                ubicacionClienteId: filters.ubicacionClienteId,
            };
        if (filters.idVegetacion)
            where.Variedad = {
                ...(where.Variedad ?? {}),
                idVegetacion: filters.idVegetacion,
            };
        if (filters.vegetacion)
            where.Variedad = {
                ...(where.Variedad ?? {}),
                Vegetacion: {
                    nombre: {
                        contains: filters.vegetacion,
                    },
                },
            };
        if (filters.idContactoPunto)
            where.Fundo = {
                ...(where.Fundo ?? {}),
                idContactoPunto: filters.idContactoPunto,
            };
        if (filters.idPuntoContacto)
            where.Fundo = {
                ...(where.Fundo ?? {}),
                idPuntoContacto: filters.idPuntoContacto,
            };
        if (filters.codCliente)
            where.Fundo = {
                ...(where.Fundo ?? {}),
                UbicacionCliente: {
                    cliente: { contains: filters.codCliente },
                },
            };

        return where;
    }

    async createCultivo(createCultivoDto: CreateCultivoDto) {
        try {
            const currentDate = new Date();

            const cultivo = await prisma.cultivo.create({
                data: {
                    certificacion: createCultivoDto.certificacion,
                    hectareas: createCultivoDto.hectareas,
                    poblacion: createCultivoDto.poblacion,
                    mesInicio: createCultivoDto.mesInicio,
                    mesFinal: createCultivoDto.mesFinal,
                    observacion: createCultivoDto.observacion,
                    idFundo: createCultivoDto.idFundo,
                    idVariedad: createCultivoDto.idVariedad,
                    createdAt: currentDate,
                    updatedAt: currentDate,
                },
            });

            return {
                id: cultivo.id,
                certificacion: cultivo.certificacion,
                hectareas: cultivo.hectareas,
                poblacion: cultivo.poblacion,
                mesInicio: cultivo.mesInicio,
                mesFinal: cultivo.mesFinal,
                observacion: cultivo.observacion,
                idFundo: cultivo.idFundo,
                idVariedad: cultivo.idVariedad,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateCultivo(updateCultivoDto: UpdateCultivoDto) {
        const cultivoExists = await prisma.cultivo.findFirst({
            where: { id: updateCultivoDto.id },
        });
        if (!cultivoExists)
            throw CustomError.badRequest(
                `Cultivo with id ${updateCultivoDto.id} does not exist`
            );

        try {
            const updatedCultivo = await prisma.cultivo.update({
                where: { id: updateCultivoDto.id },
                data: {
                    ...updateCultivoDto.values,
                    updatedAt: new Date(),
                },
            });

            return updatedCultivo;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getCultivos(
        paginationDto: PaginationDto,
        filters: CultivoFilters = {}
    ) {
        const { page, limit } = paginationDto;

        // Construir el objeto where dinámicamente según los filtros recibidos
        const where: any = this.buildCultivoWhere(filters);

        try {
            const [total, cultivos] = await Promise.all([
                prisma.cultivo.count({ where }),
                prisma.cultivo.findMany({
                    where,
                    skip: (page - 1) * limit,
                    take: limit,
                    include: {
                        Fundo: {
                            select: {
                                nombre: true,
                                centroPoblado: true,
                                idDistrito: true,
                                PuntoContacto: {
                                    select: {
                                        idDistrito: true,
                                        id: true,
                                        nombre: true,
                                    },
                                },
                                ContactoPunto: true,
                            },
                        },
                        Variedad: {
                            select: {
                                nombre: true,
                                Vegetacion: true,
                            },
                        },
                    },
                }),
            ]);

            return {
                page,
                pages: Math.ceil(total / limit),
                limit,
                total,
                cultivos: cultivos.map((cultivo) => {
                    return {
                        id: cultivo.id,
                        certificacion: cultivo.certificacion,
                        hectareas: cultivo.hectareas,
                        poblacion: cultivo.poblacion,
                        mesInicio: cultivo.mesInicio,
                        mesFinal: cultivo.mesFinal,
                        observacion: cultivo.observacion,
                        idFundo: cultivo.idFundo,
                        fundo: cultivo.Fundo.nombre,
                        centroPoblado: cultivo.Fundo.centroPoblado,
                        idVariedad: cultivo.idVariedad,
                        variedad: cultivo.Variedad.nombre,
                        vegetacion: cultivo.Variedad.Vegetacion.nombre,
                        idContactoPunto: cultivo.Fundo.ContactoPunto?.id,
                        idVegetacion: cultivo.Variedad.Vegetacion.id,
                        idPunto: cultivo.Fundo.PuntoContacto?.id,
                        idDistrito: cultivo.Fundo.idDistrito,
                        punto: cultivo.Fundo.PuntoContacto?.nombre,
                    };
                }),
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getAllCultivos(filters: CultivoFilters = {}) {
        // Construir el objeto where dinámicamente según los filtros recibidos
        const where: any = this.buildCultivoWhere(filters);

        try {
            const cultivos = await prisma.cultivo.findMany({
                where,
                include: {
                    Fundo: {
                        select: {
                            nombre: true,
                            centroPoblado: true,
                            idDistrito: true,
                            PuntoContacto: {
                                select: {
                                    idDistrito: true,
                                    id: true,
                                },
                            },
                            ContactoPunto: true,
                        },
                    },
                    Variedad: {
                        select: {
                            nombre: true,
                            Vegetacion: true,
                        },
                    },
                },
            });

            return {
                cultivos: cultivos.map((cultivo) => {
                    return {
                        id: cultivo.id,
                        certificacion: cultivo.certificacion,
                        hectareas: cultivo.hectareas,
                        poblacion: cultivo.poblacion,
                        mesInicio: cultivo.mesInicio,
                        mesFinal: cultivo.mesFinal,
                        observacion: cultivo.observacion,
                        idFundo: cultivo.idFundo,
                        fundo: cultivo.Fundo.nombre,
                        centroPoblado: cultivo.Fundo.centroPoblado,
                        idVariedad: cultivo.idVariedad,
                        variedad: cultivo.Variedad.nombre,
                        vegetacion: cultivo.Variedad.Vegetacion.nombre,
                        idContactoPunto: cultivo.Fundo.ContactoPunto?.id,
                        idVegetacion: cultivo.Variedad.Vegetacion.id,
                        idPunto: cultivo.Fundo.PuntoContacto?.id,
                        idDistrito: cultivo.Fundo.idDistrito,
                    };
                }),
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getCultivoById(id: number) {
        try {
            const cultivo = await prisma.cultivo.findUnique({
                where: { id },
                include: {
                    Fundo: {
                        include: {
                            PuntoContacto: true,
                        },
                    },
                    Variedad: {
                        include: {
                            Vegetacion: true,
                        },
                    },
                },
            });

            if (!cultivo)
                throw CustomError.badRequest(
                    `Cultivo with id ${id} does not exist`
                );

            return {
                id: cultivo.id,
                certificacion: cultivo.certificacion,
                hectareas: cultivo.hectareas,
                poblacion: cultivo.poblacion,
                mesInicio: cultivo.mesInicio,
                mesFinal: cultivo.mesFinal,
                observacion: cultivo.observacion,
                idFundo: cultivo.idFundo,
                fundo: cultivo.Fundo.nombre,
                centroPoblado: cultivo.Fundo.centroPoblado,
                idVariedad: cultivo.idVariedad,
                variedad: cultivo.Variedad.nombre,
                idVegetacion: cultivo.Variedad.idVegetacion,
                vegetacion: cultivo.Variedad.Vegetacion.nombre,
                idDistrito: cultivo.Fundo.idDistrito,
                idPunto: cultivo.Fundo.PuntoContacto?.id,
                punto: cultivo.Fundo.PuntoContacto?.nombre,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getCultivosByPuntoContactoId(
        idPuntoContacto: number,
        tipoContacto?: string
    ) {
        try {
            const where: any = {
                Fundo: {
                    PuntoContacto: {
                        id: idPuntoContacto,
                    },
                },
            };

            if (tipoContacto) {
                where.Fundo.ContactoPunto = { tipo: tipoContacto };
            }

            const cultivos = await prisma.cultivo.findMany({
                where,
                include: {
                    Fundo: {
                        select: {
                            nombre: true,
                            centroPoblado: true,
                            idDistrito: true,
                            PuntoContacto: {
                                select: {
                                    id: true,
                                    idDistrito: true,
                                },
                            },
                            ContactoPunto: true,
                        },
                    },
                    Variedad: {
                        select: {
                            nombre: true,
                            Vegetacion: {
                                select: {
                                    nombre: true,
                                    id: true,
                                },
                            },
                        },
                    },
                },
            });

            return {
                cultivos: cultivos.map((cultivo) => {
                    return {
                        id: cultivo.id,
                        certificacion: cultivo.certificacion,
                        hectareas: cultivo.hectareas,
                        poblacion: cultivo.poblacion,
                        mesInicio: cultivo.mesInicio,
                        mesFinal: cultivo.mesFinal,
                        observacion: cultivo.observacion,
                        idFundo: cultivo.idFundo,
                        fundo: cultivo.Fundo.nombre,
                        centroPoblado: cultivo.Fundo.centroPoblado,
                        idVariedad: cultivo.idVariedad,
                        variedad: cultivo.Variedad.nombre,
                        vegetacion: cultivo.Variedad.Vegetacion.nombre,
                        idVegetacion: cultivo.Variedad.Vegetacion.id,
                        idPunto: cultivo.Fundo.PuntoContacto?.id,
                        idContactoPunto: cultivo.Fundo.ContactoPunto?.id,
                        idDistrito: cultivo.Fundo.idDistrito,
                        tipoContacto: cultivo.Fundo.ContactoPunto?.tipo,
                    };
                }),
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getCultivosByContactoPuntoId(idContactoPunto: number) {
        try {
            const cultivos = await prisma.cultivo.findMany({
                where: {
                    Fundo: {
                        ContactoPunto: {
                            id: idContactoPunto,
                        },
                    },
                },
                include: {
                    Fundo: {
                        select: {
                            nombre: true,
                            centroPoblado: true,
                            idDistrito: true,
                            PuntoContacto: {
                                select: {
                                    id: true,
                                    idDistrito: true,
                                },
                            },
                            ContactoPunto: true,
                        },
                    },
                    Variedad: {
                        select: {
                            nombre: true,
                            Vegetacion: {
                                select: {
                                    nombre: true,
                                    id: true,
                                },
                            },
                        },
                    },
                },
            });

            return {
                cultivos: cultivos.map((cultivo) => {
                    return {
                        id: cultivo.id,
                        certificacion: cultivo.certificacion,
                        hectareas: cultivo.hectareas,
                        poblacion: cultivo.poblacion,
                        mesInicio: cultivo.mesInicio,
                        mesFinal: cultivo.mesFinal,
                        observacion: cultivo.observacion,
                        idFundo: cultivo.idFundo,
                        fundo: cultivo.Fundo.nombre,
                        centroPoblado: cultivo.Fundo.centroPoblado,
                        idVariedad: cultivo.idVariedad,
                        variedad: cultivo.Variedad.nombre,
                        vegetacion: cultivo.Variedad.Vegetacion.nombre,
                        idVegetacion: cultivo.Variedad.Vegetacion.id,
                        idPunto: cultivo.Fundo.PuntoContacto?.id,
                        idContactoPunto: cultivo.Fundo.ContactoPunto?.id,
                        idDistrito: cultivo.Fundo?.idDistrito,
                    };
                }),
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
