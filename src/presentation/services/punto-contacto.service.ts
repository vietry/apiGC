import { prisma } from '../../data/sqlserver';
import { Prisma } from '@prisma/client';
import {
    CreatePuntoContactoDto,
    CustomError,
    PaginationDto,
    PuntoFilters,
    UpdatePuntoContactoDto,
} from '../../domain';
import { getCurrentDate } from '../../config/time';

export class PuntoContactoService {
    async createPuntoContacto(createPuntoContactoDto: CreatePuntoContactoDto) {
        const puntoContactoExists = await prisma.puntoContacto.findFirst({
            where: {
                AND: [
                    { numDoc: createPuntoContactoDto.numDoc },
                    { idGte: createPuntoContactoDto.idGte },
                ],
            },
        });
        if (puntoContactoExists)
            throw CustomError.badRequest(
                `Ya existe un Cliente/Tienda con el número de documento ${createPuntoContactoDto.numDoc}.`
            );

        try {
            const currentDate = getCurrentDate();

            const puntoContacto = await prisma.puntoContacto.create({
                data: {
                    nombre: createPuntoContactoDto.nombre,
                    tipoDoc: createPuntoContactoDto.tipoDoc,
                    numDoc: createPuntoContactoDto.numDoc,
                    hectareas: createPuntoContactoDto.hectareas,
                    tipo: createPuntoContactoDto.tipo,
                    dirReferencia: createPuntoContactoDto.dirReferencia,
                    lider: createPuntoContactoDto.lider,
                    activo: createPuntoContactoDto.activo,
                    /*idGte: gte.id,*/
                    idGte: createPuntoContactoDto.idGte,
                    idDistrito: createPuntoContactoDto.idDistrito,
                    idEmpresa: createPuntoContactoDto.idEmpresa,
                    idColaborador: createPuntoContactoDto.idColaborador,
                    gestion: createPuntoContactoDto.gestion,
                    sede: createPuntoContactoDto.sede,
                    codZona: createPuntoContactoDto.codZona,
                    subTipo: createPuntoContactoDto.subTipo,
                    cantR0: createPuntoContactoDto.cantR0,
                    cantR1: createPuntoContactoDto.cantR1,
                    cantR2: createPuntoContactoDto.cantR2,
                    aniversario: createPuntoContactoDto.aniversario,
                    createdAt: currentDate,
                    updatedAt: currentDate,
                },
            });

            return {
                id: puntoContacto.id,
                nombre: puntoContacto.nombre,
                tipoDoc: puntoContacto.tipoDoc,
                numDoc: puntoContacto.numDoc,
                tipo: puntoContacto.tipo,
                referencia: puntoContacto.dirReferencia,
                lider: puntoContacto.lider,
                activo: puntoContacto.activo,
                idGte: puntoContacto.idGte,
                idDistrito: puntoContacto.idDistrito,
                idColaborador: puntoContacto.idColaborador,
                gestion: puntoContacto.gestion,
                idEmpresa: puntoContacto.idEmpresa,
                codZona: puntoContacto.codZona,
                hectareas: puntoContacto.hectareas,
                subTipo: puntoContacto.subTipo,
                cantR0: puntoContacto.cantR0,
                cantR1: puntoContacto.cantR1,
                cantR2: puntoContacto.cantR2,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updatePuntoContacto(updatePuntoContactoDto: UpdatePuntoContactoDto) {
        const currentDate = getCurrentDate();
        const puntoContactoExists = await prisma.puntoContacto.findFirst({
            where: { id: updatePuntoContactoDto.id },
        });
        if (!puntoContactoExists)
            throw CustomError.badRequest(
                `PuntoContacto with id ${updatePuntoContactoDto.id} does not exist`
            );

        try {
            const updatedPuntoContacto = await prisma.puntoContacto.update({
                where: { id: updatePuntoContactoDto.id },
                data: {
                    ...updatePuntoContactoDto.values, // Usar valores directamente del DTO
                    updatedAt: currentDate,
                },
            });

            return updatedPuntoContacto;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getPuntosContacto(
        paginationDto: PaginationDto,
        filters: PuntoFilters = {}
    ) {
        const { page, limit } = paginationDto;
        const {
            nombre,
            numDoc,
            idGte,
            idColaborador,
            idMacrozona,
            idEmpresa,
            activo,
            idDistrito,
            idProvincia,
            idDepartamento,
            idSubzona,
            codZona,
            nomZona,
            gestion, // Nuevo filtro
        } = filters;

        // Construir el objeto where para los filtros
        const where: any = {};

        // Filtros básicos
        if (nombre) {
            where.nombre = { contains: nombre };
        }
        if (numDoc) {
            where.numDoc = { contains: numDoc };
        }
        if (idGte) {
            where.idGte = idGte;
        }
        if (idEmpresa) {
            where.idEmpresa = idEmpresa;
        }
        if (activo !== undefined) {
            where.activo = activo;
        }
        if (codZona) {
            where.codZona = codZona;
        }
        if (idColaborador) {
            where.idColaborador = idColaborador;
        }
        if (gestion !== undefined) {
            where.gestion = gestion;
        }

        // Filtro por distrito
        if (idDistrito) {
            where.idDistrito = idDistrito;
        }

        // Filtro por provincia
        if (idProvincia) {
            where.Distrito = {
                ...where.Distrito,
                idProvincia,
            };
        }

        // Filtro por departamento
        if (idDepartamento) {
            where.Distrito = {
                ...where.Distrito,
                Provincia: {
                    ...where.Distrito?.Provincia,
                    idDepartamento,
                },
            };
        }

        // Filtros relacionados con Gte y Colaborador
        // idColaborador ya no se filtra aquí
        if (idMacrozona || idSubzona || nomZona) {
            where.Gte = {
                AND: [
                    // Condición idMacrozona
                    idMacrozona
                        ? {
                              Colaborador: {
                                  ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador:
                                      {
                                          some: {
                                              SuperZona: { id: idMacrozona },
                                          },
                                      },
                              },
                          }
                        : {},
                    // Condición para SubZona
                    idSubzona
                        ? {
                              Colaborador: {
                                  ZonaAnterior: { id: idSubzona },
                              },
                          }
                        : {},
                    // Condición nomZona
                    nomZona
                        ? {
                              Colaborador: {
                                  ZonaAnterior: {
                                      nombre: { contains: nomZona },
                                  },
                              },
                          }
                        : {},
                ].filter((condition) => Object.keys(condition).length > 0),
            };
        }

        try {
            const [total, puntosContacto] = await Promise.all([
                prisma.puntoContacto.count({ where }),
                prisma.puntoContacto.findMany({
                    where,
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { nombre: 'asc' },
                    include: {
                        Gte: {
                            select: {
                                Usuario: {
                                    select: {
                                        id: true,
                                    },
                                },
                                Colaborador: {
                                    select: {
                                        id: true,
                                        ZonaAnterior: true,
                                        ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador:
                                            {
                                                select: {
                                                    SuperZona: true,
                                                },
                                            },
                                    },
                                },
                            },
                        },
                        Distrito: {
                            select: {
                                nombre: true,
                                id: true,
                                idProvincia: true,
                                Provincia: {
                                    select: {
                                        id: true,
                                        nombre: true,
                                        idDepartamento: true,
                                        Departamento: {
                                            select: {
                                                id: true,
                                                nombre: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                }),
            ]);

            return {
                page: page,
                pages: Math.ceil(total / limit),
                limit: limit,
                total: total,

                puntosContacto: puntosContacto.map((puntoContacto) => {
                    const macrozona =
                        puntoContacto.Gte?.Colaborador
                            ?.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador?.[0]
                            ?.SuperZona?.nombre ?? null;

                    const idMacrozona =
                        puntoContacto.Gte?.Colaborador
                            ?.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador?.[0]
                            ?.SuperZona?.id ?? null;

                    return {
                        id: puntoContacto.id,
                        nombre: puntoContacto.nombre,
                        tipoDoc: puntoContacto.tipoDoc,
                        numDoc: puntoContacto.numDoc,
                        tipo: puntoContacto.tipo,
                        dirReferencia: puntoContacto.dirReferencia,
                        lider: puntoContacto.lider,
                        activo: puntoContacto.activo,
                        idGte: puntoContacto.idGte,
                        hectareas: puntoContacto.hectareas,
                        idUsuario: puntoContacto.Gte?.Usuario?.id,
                        idColaborador: puntoContacto.idColaborador, // Cambiado: directo de PuntoContacto
                        idDistrito: puntoContacto.Distrito?.id,
                        distrito: puntoContacto.Distrito?.nombre,
                        idProvincia: puntoContacto.Distrito?.idProvincia,
                        provincia: puntoContacto.Distrito?.Provincia?.nombre,
                        idDepartamento:
                            puntoContacto.Distrito?.Provincia?.idDepartamento,
                        departamento:
                            puntoContacto.Distrito?.Provincia?.Departamento
                                ?.nombre,
                        idEmpresa: puntoContacto.idEmpresa,
                        codZona: puntoContacto.codZona,
                        idSubzona:
                            puntoContacto.Gte?.Colaborador?.ZonaAnterior?.id,
                        nomZona:
                            puntoContacto.Gte?.Colaborador?.ZonaAnterior
                                ?.nombre,
                        idMacrozona,
                        macrozona,
                        subTipo: puntoContacto.subTipo,
                        cantR0: puntoContacto.cantR0,
                        cantR1: puntoContacto.cantR1,
                        cantR2: puntoContacto.cantR2,
                        aniversario: puntoContacto.aniversario,
                        gestion: puntoContacto.gestion,
                        sede: puntoContacto.sede,
                    };
                }),
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getAllPuntosContacto(filters: PuntoFilters = {}) {
        const {
            nombre,
            numDoc,
            idGte,
            idColaborador,
            idMacrozona,
            idEmpresa,
            activo,
            idDistrito,
            idProvincia,
            idDepartamento,
            idSubzona,
            codZona,
            nomZona,
        } = filters;

        // Construir el objeto where para los filtros
        const where: any = {};

        // Filtros básicos
        if (nombre) {
            where.nombre = { contains: nombre };
        }
        if (numDoc) {
            where.numDoc = { contains: numDoc };
        }
        if (idGte) {
            where.idGte = idGte;
        }
        if (idEmpresa) {
            where.idEmpresa = idEmpresa;
        }
        if (activo !== undefined) {
            where.activo = activo;
        }
        if (codZona) {
            where.codZona = codZona;
        }

        // Filtro por distrito
        if (idDistrito) {
            where.idDistrito = idDistrito;
        }

        // Filtro por provincia
        if (idProvincia) {
            where.Distrito = {
                ...where.Distrito,
                idProvincia,
            };
        }

        // Filtro por departamento
        if (idDepartamento) {
            where.Distrito = {
                ...where.Distrito,
                Provincia: {
                    ...where.Distrito?.Provincia,
                    idDepartamento,
                },
            };
        }

        // Filtros relacionados con Gte y Colaborador
        if (idColaborador || idMacrozona || nomZona) {
            where.Gte = {
                AND: [
                    // Condición idColaborador
                    idColaborador
                        ? {
                              Colaborador: { id: idColaborador },
                          }
                        : {},
                    // Condición idMacrozona
                    idMacrozona
                        ? {
                              Colaborador: {
                                  ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador:
                                      {
                                          some: {
                                              SuperZona: { id: idMacrozona },
                                          },
                                      },
                              },
                          }
                        : {},
                    // Condición para SubZona
                    idSubzona
                        ? {
                              Colaborador: {
                                  ZonaAnterior: { id: idSubzona },
                              },
                          }
                        : {},
                    // Condición nomZona
                    nomZona
                        ? {
                              Colaborador: {
                                  ZonaAnterior: {
                                      nombre: { contains: nomZona },
                                  },
                              },
                          }
                        : {},
                ].filter((condition) => Object.keys(condition).length > 0),
            };
        }

        try {
            const puntosContacto = await prisma.puntoContacto.findMany({
                where,
                orderBy: { nombre: 'asc' },
                include: {
                    Gte: {
                        select: {
                            Usuario: {
                                select: {
                                    id: true,
                                },
                            },
                            Colaborador: {
                                select: {
                                    id: true,
                                    ZonaAnterior: true,
                                    ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador:
                                        {
                                            select: {
                                                SuperZona: true,
                                            },
                                        },
                                },
                            },
                        },
                    },
                    Distrito: {
                        select: {
                            nombre: true,
                            id: true,
                            idProvincia: true,
                            Provincia: {
                                select: {
                                    id: true,
                                    nombre: true,
                                    idDepartamento: true,
                                    Departamento: {
                                        select: {
                                            id: true,
                                            nombre: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });

            return puntosContacto.map((puntoContacto) => {
                const macrozona =
                    puntoContacto.Gte?.Colaborador
                        ?.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador?.[0]
                        ?.SuperZona?.nombre ?? null;

                const idMacrozona =
                    puntoContacto.Gte?.Colaborador
                        ?.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador?.[0]
                        ?.SuperZona?.id ?? null;

                return {
                    id: puntoContacto.id,
                    nombre: puntoContacto.nombre,
                    tipoDoc: puntoContacto.tipoDoc,
                    numDoc: puntoContacto.numDoc,
                    tipo: puntoContacto.tipo,
                    dirReferencia: puntoContacto.dirReferencia,
                    lider: puntoContacto.lider,
                    activo: puntoContacto.activo,
                    idGte: puntoContacto.idGte,
                    hectareas: puntoContacto.hectareas,
                    idUsuario: puntoContacto.Gte?.Usuario?.id,
                    idColaborador: puntoContacto.Gte?.Colaborador?.id,
                    idDistrito: puntoContacto.Distrito?.id,
                    distrito: puntoContacto.Distrito?.nombre,
                    idProvincia: puntoContacto.Distrito?.idProvincia,
                    provincia: puntoContacto.Distrito?.Provincia?.nombre,
                    idDepartamento:
                        puntoContacto.Distrito?.Provincia?.idDepartamento,
                    departamento:
                        puntoContacto.Distrito?.Provincia?.Departamento?.nombre,
                    idEmpresa: puntoContacto.idEmpresa,
                    codZona: puntoContacto.codZona,
                    idSubzona: puntoContacto.Gte?.Colaborador?.ZonaAnterior?.id,
                    nomZona:
                        puntoContacto.Gte?.Colaborador?.ZonaAnterior?.nombre,
                    idMacrozona,
                    macrozona,
                    subTipo: puntoContacto.subTipo,
                    cantR0: puntoContacto.cantR0,
                    cantR1: puntoContacto.cantR1,
                    cantR2: puntoContacto.cantR2,
                    aniversario: puntoContacto.aniversario,
                    gestion: puntoContacto.gestion,
                    sede: puntoContacto.sede,
                };
            });
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getPuntoContactoById(id: number) {
        try {
            const puntoContacto = await prisma.puntoContacto.findUnique({
                where: { id },
            });

            if (!puntoContacto)
                throw CustomError.badRequest(
                    `PuntoContacto with id ${id} does not exist`
                );

            return puntoContacto;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    /*async getPuntosContactoByGteId(idUsuario: number, paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;

        const gte = await prisma.gte.findFirst({
            where: { idUsuario },
            select: { id: true }
        });
        if ( !gte ) throw CustomError.badRequest( `gd no exists` );

        try {
            const [total, puntosContacto] = await Promise.all([
                prisma.puntoContacto.count({ where: {idGte: gte?.id } }),
                prisma.puntoContacto.findMany({
                    where: { idGte: gte?.id },
                    skip: (page - 1) * limit,
                    take: limit,
                    include: {
                        Gte: {
                            select: {
                                Usuario: {
                                    select: {
                                        id: true,
                                        
                                    }
                                }
                            }
                        }
                    }
                })
            ]);

            //if (!puntosContacto || puntosContacto.length === 0) throw CustomError.badRequest(`No PuntoContacto found with Gte id ${idGte}`);

            return {
                page: page,
                limit: limit,
                total: total,
                next: `/api/puntoscontacto?idGte=${gte?.id}&page=${page + 1}&limit=${limit}`,
                prev: (page - 1 > 0) ? `/api/puntoscontacto?idGte=${gte?.id}&page=${(page - 1)}&limit=${limit}` : null,
                puntosContacto: puntosContacto.map(puntoContacto => ({
                    id: puntoContacto.id,
                    nombre: puntoContacto.nombre,
                    tipoDoc: puntoContacto.tipoDoc,
                    numDoc: puntoContacto.numDoc,
                    tipo: puntoContacto.tipo,
                    referencia: puntoContacto.dirReferencia,
                    lider: puntoContacto.lider,
                    activo: puntoContacto.activo,
                    idGte: puntoContacto.idGte,
                    hectareas: puntoContacto.hectareas,
                    idUsuario: puntoContacto.Gte.Usuario?.id
                }))
            };

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }*/
    async getPuntosContactoByGteId(idUsuario: number) {
        const gte = await prisma.gte.findFirst({
            where: { idUsuario },
            select: { id: true },
        });
        if (!gte) throw CustomError.badRequest(`gd no exists`);

        try {
            const [total, puntosContacto] = await Promise.all([
                prisma.puntoContacto.count({ where: { idGte: gte?.id } }),
                prisma.puntoContacto.findMany({
                    where: { idGte: gte?.id },
                    include: {
                        Gte: {
                            select: {
                                Usuario: {
                                    select: {
                                        id: true,
                                    },
                                },
                                Colaborador: {
                                    select: {
                                        ZonaAnterior: true,
                                    },
                                },
                            },
                        },
                        Distrito: {
                            select: {
                                nombre: true,
                                id: true,
                                idProvincia: true,
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
                        },
                    },
                }),
            ]);

            //if (!puntosContacto || puntosContacto.length === 0) throw CustomError.badRequest(`No PuntoContacto found with Gte id ${idGte}`);
            return {
                puntosContacto: puntosContacto.map((puntoContacto) => ({
                    id: puntoContacto.id,
                    nombre: puntoContacto.nombre,
                    tipoDoc: puntoContacto.tipoDoc,
                    numDoc: puntoContacto.numDoc,
                    tipo: puntoContacto.tipo,
                    dirReferencia: puntoContacto.dirReferencia,
                    lider: puntoContacto.lider,
                    activo: puntoContacto.activo,
                    idGte: puntoContacto.idGte,
                    hectareas: puntoContacto.hectareas,
                    idUsuario: puntoContacto.Gte?.Usuario?.id,
                    idDistrito: puntoContacto.Distrito?.id,
                    distrito: puntoContacto.Distrito?.nombre,
                    idProvincia: puntoContacto.Distrito?.idProvincia,
                    provincia: puntoContacto.Distrito?.Provincia.nombre,
                    departamento:
                        puntoContacto.Distrito?.Provincia.Departamento.nombre,
                    idEmpresa: puntoContacto.idEmpresa,
                    codZona: puntoContacto.codZona,
                    nomZona:
                        puntoContacto.Gte?.Colaborador?.ZonaAnterior?.nombre,
                    subTipo: puntoContacto.subTipo,
                    cantR0: puntoContacto.cantR0,
                    cantR1: puntoContacto.cantR1,
                    cantR2: puntoContacto.cantR2,
                    aniversario: puntoContacto.aniversario,
                })),
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getPuntosContactoByCodZonaAndGteId(codZona: string, idGte?: number) {
        try {
            // Construir la cláusula where dinámicamente
            let whereClause: Prisma.PuntoContactoWhereInput = { codZona };

            if (idGte) {
                whereClause = {
                    AND: [
                        {
                            OR: [
                                { idGte },
                                { idGte: null }, // Para incluir aquellos sin idGte
                            ],
                        },
                        { codZona },
                    ],
                };
            }

            const puntosContacto = await prisma.puntoContacto.findMany({
                where: whereClause,
                orderBy: {
                    nombre: 'asc',
                },
                include: {
                    Gte: {
                        select: {
                            Usuario: {
                                select: {
                                    id: true,
                                },
                            },
                            Colaborador: {
                                select: {
                                    ZonaAnterior: true,
                                },
                            },
                        },
                    },
                    Distrito: {
                        select: {
                            nombre: true,
                            id: true,
                            idProvincia: true,
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
                    },
                },
            });

            return puntosContacto.map((puntoContacto) => ({
                id: puntoContacto.id,
                nombre: puntoContacto.nombre,
                tipoDoc: puntoContacto.tipoDoc,
                numDoc: puntoContacto.numDoc,
                tipo: puntoContacto.tipo,
                dirReferencia: puntoContacto.dirReferencia,
                lider: puntoContacto.lider,
                activo: puntoContacto.activo,
                idGte: puntoContacto.idGte,
                hectareas: puntoContacto.hectareas,
                idUsuario: puntoContacto.Gte?.Usuario?.id,
                idDistrito: puntoContacto.Distrito?.id,
                distrito: puntoContacto.Distrito?.nombre,
                idProvincia: puntoContacto.Distrito?.idProvincia,
                provincia: puntoContacto.Distrito?.Provincia.nombre,
                departamento:
                    puntoContacto.Distrito?.Provincia.Departamento.nombre,
                idEmpresa: puntoContacto.idEmpresa,
                codZona: puntoContacto.codZona,
                nomZona: puntoContacto.Gte?.Colaborador?.ZonaAnterior?.nombre,
                subTipo: puntoContacto.subTipo,
                cantR0: puntoContacto.cantR0,
                cantR1: puntoContacto.cantR1,
                cantR2: puntoContacto.cantR2,
                aniversario: puntoContacto.aniversario,
            }));
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async createMultiplePuntosContacto(
        puntosContactoDtos: CreatePuntoContactoDto[]
    ) {
        try {
            const BATCH_SIZE = 50;
            const allResults = [];

            for (let i = 0; i < puntosContactoDtos.length; i += BATCH_SIZE) {
                const batch = puntosContactoDtos.slice(i, i + BATCH_SIZE);

                const batchResults = await prisma.$transaction(
                    async (prismaClient) => {
                        const results = [];
                        for (const dto of batch) {
                            // Validación de unicidad por numDoc + idGte
                            // const exists =
                            //     await prismaClient.puntoContacto.findFirst({
                            //         where: {
                            //             AND: [
                            //                 { numDoc: dto.numDoc },
                            //                 { idGte: dto.idGte },
                            //             ],
                            //         },
                            //     });
                            // if (exists) {
                            //     throw CustomError.badRequest(
                            //         `Ya existe un Cliente/Tienda con el número de documento ${dto.numDoc} para el GTE ${dto.idGte}.`
                            //     );
                            // }
                            const currentDate = getCurrentDate();
                            const puntoContacto =
                                await prismaClient.puntoContacto.create({
                                    data: {
                                        nombre: dto.nombre,
                                        tipoDoc: dto.tipoDoc,
                                        numDoc: dto.numDoc,
                                        hectareas: dto.hectareas,
                                        tipo: dto.tipo,
                                        dirReferencia: dto.dirReferencia,
                                        lider: dto.lider,
                                        activo: dto.activo,
                                        idGte: dto.idGte,
                                        idDistrito: dto.idDistrito,
                                        idEmpresa: dto.idEmpresa,
                                        codZona: dto.codZona,
                                        subTipo: dto.subTipo,
                                        cantR0: dto.cantR0,
                                        cantR1: dto.cantR1,
                                        cantR2: dto.cantR2,
                                        aniversario: dto.aniversario,
                                        createdAt: currentDate,
                                        updatedAt: currentDate,
                                    },
                                });
                            results.push(puntoContacto);
                        }
                        return results;
                    },
                    {
                        timeout: 20000,
                        maxWait: 25000,
                    }
                );
                allResults.push(...batchResults);
            }
            return allResults;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
