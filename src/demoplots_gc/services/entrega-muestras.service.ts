import { getCurrentDate } from '../../config/time';
import { prisma } from '../../data/sqlserver';
import { CustomError, EntregaFilters, PaginationDto } from '../../domain';
import { CreateEntregaMuestrasDto } from '../dtos/create-entrega-muestras.dto';
import { CreateMultipleEntregaMuestrasDto } from '../dtos/create-multiple-entrega-muestras.dto';
import { UpdateEntregaMuestrasDto } from '../dtos/update-entrega-muestras.dto';

export class EntregaMuestrasService {
    async createEntregaMuestras(
        createEntregaMuestrasDto: CreateEntregaMuestrasDto
    ) {
        // Verificar que la familia existe
        const familiaExists = await prisma.familia.findUnique({
            where: { id: createEntregaMuestrasDto.idFamilia },
        });
        if (!familiaExists)
            throw CustomError.badRequest(
                `La familia con id ${createEntregaMuestrasDto.idFamilia} no existe`
            );

        // Verificar que el GTE existe
        const gteExists = await prisma.gte.findUnique({
            where: { id: createEntregaMuestrasDto.idGte },
        });
        if (!gteExists)
            throw CustomError.badRequest(
                `El GTE con id ${createEntregaMuestrasDto.idGte} no existe`
            );

        const currentDate = getCurrentDate();

        try {
            const entregaMuestras = await prisma.entregaMuestras.create({
                data: {
                    idFamilia: createEntregaMuestrasDto.idFamilia,
                    idGte: createEntregaMuestrasDto.idGte,
                    presentacion: createEntregaMuestrasDto.presentacion,
                    unidades: createEntregaMuestrasDto.unidades,
                    total: createEntregaMuestrasDto.total,
                    agotado: createEntregaMuestrasDto.agotado,
                    facturacion: createEntregaMuestrasDto.facturacion,
                    recepcion: createEntregaMuestrasDto.recepcion,
                    precio: createEntregaMuestrasDto.precio,
                    createdAt: currentDate,
                    updatedAt: currentDate,
                    createdBy: createEntregaMuestrasDto.createdBy,
                    updatedBy: createEntregaMuestrasDto.updatedBy,
                },
            });

            return entregaMuestras;
        } catch (error) {
            console.log(error);
            throw CustomError.internalServer(`${error}`);
        }
    }

    async createMultipleEntregaMuestras(
        createMultipleEntregaMuestrasDto: CreateMultipleEntregaMuestrasDto
    ) {
        try {
            const BATCH_SIZE = 50; // Procesar 50 registros a la vez
            const allResults = [];
            const entregas = createMultipleEntregaMuestrasDto.entregas;

            // Procesar en lotes
            for (let i = 0; i < entregas.length; i += BATCH_SIZE) {
                const batch = entregas.slice(i, i + BATCH_SIZE);

                // Procesar cada lote en una transacción separada
                const batchResults = await prisma.$transaction(
                    async (prismaClient) => {
                        const results = [];

                        for (const entregaDto of batch) {
                            // Verificar que la familia existe
                            const familiaExists =
                                await prismaClient.familia.findUnique({
                                    where: { id: entregaDto.idFamilia },
                                });
                            if (!familiaExists)
                                throw CustomError.badRequest(
                                    `La familia con id ${entregaDto.idFamilia} no existe`
                                );

                            // Verificar que el GTE existe
                            const gteExists = await prismaClient.gte.findUnique(
                                {
                                    where: { id: entregaDto.idGte },
                                }
                            );
                            if (!gteExists)
                                throw CustomError.badRequest(
                                    `El GTE con id ${entregaDto.idGte} no existe`
                                );

                            const currentDate = getCurrentDate();

                            const entregaMuestras =
                                await prismaClient.entregaMuestras.create({
                                    data: {
                                        idFamilia: entregaDto.idFamilia,
                                        idGte: entregaDto.idGte,
                                        presentacion: entregaDto.presentacion,
                                        unidades: entregaDto.unidades,
                                        total: entregaDto.total,
                                        agotado: entregaDto.agotado,
                                        precio: entregaDto.precio,
                                        perdida: entregaDto.perdida,
                                        facturacion: entregaDto.facturacion,
                                        recepcion: entregaDto.recepcion,
                                        createdAt: currentDate,
                                        updatedAt: currentDate,
                                        createdBy: entregaDto.createdBy,
                                        updatedBy: entregaDto.updatedBy,
                                    },
                                });

                            results.push(entregaMuestras);
                        }

                        return results;
                    },
                    {
                        timeout: 20000, // 20 segundos por lote
                        maxWait: 25000, // máximo tiempo de espera
                    }
                );

                allResults.push(...batchResults);
            }

            return allResults;
        } catch (error) {
            console.log(error);
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateEntregaMuestras(
        updateEntregaMuestrasDto: UpdateEntregaMuestrasDto
    ) {
        const currentDate = getCurrentDate();
        const entregaExists = await prisma.entregaMuestras.findUnique({
            where: { id: updateEntregaMuestrasDto.id },
        });
        if (!entregaExists)
            throw CustomError.badRequest(
                `Entrega de muestras con id ${updateEntregaMuestrasDto.id} no existe`
            );

        try {
            const updatedEntrega = await prisma.entregaMuestras.update({
                where: { id: updateEntregaMuestrasDto.id },
                data: {
                    ...updateEntregaMuestrasDto.values,
                    updatedAt: currentDate,
                },
            });
            return updatedEntrega;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getEntregaMuestras(
        paginationDto: PaginationDto,
        filters: EntregaFilters = {}
    ) {
        const { page, limit } = paginationDto;
        const {
            agotado,
            idColaborador,
            idMacrozona,
            empresa,
            year,
            month,
            idFamilia,
            clase,
            idGte,
        } = filters;

        const where: any = {};

        // Filtro por agotado
        if (agotado !== undefined) {
            where.agotado = agotado;
        }

        // Filtro por idFamilia
        if (idFamilia) {
            where.idFamilia = idFamilia;
        }

        // Filtro por clase de familia
        if (clase) {
            where.Familia = {
                clase: { contains: clase },
            };
        }

        // Filtro por idGte
        if (idGte) {
            where.idGte = idGte;
        }

        // Construir condiciones para Gte y Colaborador
        if (idColaborador || idMacrozona || empresa) {
            where.Gte = {
                AND: [
                    // Condición idColaborador
                    idColaborador
                        ? {
                              Colaborador: { id: idColaborador },
                          }
                        : {},
                    // Condición macrozona
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
                    // Condición empresa
                    empresa
                        ? {
                              Colaborador: {
                                  ZonaAnterior: {
                                      Empresa: {
                                          nomEmpresa: { contains: empresa },
                                      },
                                  },
                              },
                          }
                        : {},
                ].filter((condition) => Object.keys(condition).length > 0),
            };
        }

        // Filtros de fecha - para facturación
        if (year) {
            where.facturacion = {
                gte: new Date(year, 0),
                lt: new Date(year + 1, 0),
            };
        }

        if (month && year) {
            where.facturacion = {
                gte: new Date(year, month - 1),
                lt: new Date(year, month),
            };
        }

        try {
            const [total, entregas] = await Promise.all([
                prisma.entregaMuestras.count({ where }),
                prisma.entregaMuestras.findMany({
                    where,
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { updatedAt: 'desc' },
                    include: {
                        Familia: true,
                        Gte: {
                            include: {
                                Usuario: true,
                                Colaborador: {
                                    include: {
                                        Usuario: true,
                                        ZonaAnterior: {
                                            include: {
                                                Empresa: true,
                                            },
                                        },
                                        ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador:
                                            {
                                                include: {
                                                    SuperZona: true,
                                                },
                                            },
                                    },
                                },
                            },
                        },
                        Usuario_EntregaMuestras_createdByToUsuario: true,
                        Usuario_EntregaMuestras_updatedByToUsuario: true,
                    },
                }),
            ]);

            return {
                page,
                pages: Math.ceil(total / limit),
                limit,
                total,
                entregas: entregas.map((entrega) => {
                    const macrozona =
                        entrega.Gte?.Colaborador
                            ?.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador?.[0]
                            ?.SuperZona?.nombre ?? null;
                    const idMacrozona =
                        entrega.Gte?.Colaborador
                            ?.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador?.[0]
                            ?.SuperZona?.id ?? null;
                    return {
                        ...entrega,
                        precio: entrega.precio,
                        macrozona,
                        idMacrozona,
                        familia: entrega.Familia?.nombre,
                        empresa:
                            entrega.Gte?.Colaborador?.ZonaAnterior?.Empresa
                                ?.nomEmpresa,
                        gte: `${entrega.Gte.Usuario?.nombres ?? ''} ${
                            entrega.Gte.Usuario?.apellidos ?? ''
                        }`.trim(),
                        colaborador: entrega.Gte?.Colaborador
                            ? `${
                                  entrega.Gte.Colaborador.Usuario?.nombres ?? ''
                              } ${
                                  entrega.Gte.Colaborador.Usuario?.apellidos ??
                                  ''
                              }`.trim()
                            : null,
                        idColaborador: entrega.Gte?.Colaborador?.id,
                    };
                }),
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getAllEntregaMuestras(filters: EntregaFilters = {}) {
        const {
            agotado,
            idColaborador,
            idMacrozona,
            empresa,
            year,
            month,
            idFamilia,
            clase,
            idGte,
        } = filters;

        const where: any = {};

        // Filtro por agotado
        if (agotado !== undefined) {
            where.agotado = agotado;
        }

        // Filtro por idFamilia
        if (idFamilia) {
            where.idFamilia = idFamilia;
        }

        // Filtro por clase de familia
        if (clase) {
            where.Familia = {
                clase: { contains: clase },
            };
        }

        // Filtro por idGte
        if (idGte) {
            where.idGte = idGte;
        }

        // Construir condiciones para Gte y Colaborador
        if (idColaborador || idMacrozona || empresa) {
            where.Gte = {
                AND: [
                    // Condición idColaborador
                    idColaborador
                        ? {
                              Colaborador: { id: idColaborador },
                          }
                        : {},
                    // Condición macrozona
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
                    // Condición empresa
                    empresa
                        ? {
                              Colaborador: {
                                  ZonaAnterior: {
                                      Empresa: {
                                          nomEmpresa: { contains: empresa },
                                      },
                                  },
                              },
                          }
                        : {},
                ].filter((condition) => Object.keys(condition).length > 0),
            };
        }

        // Filtros de fecha - para facturación
        if (year) {
            where.facturacion = {
                gte: new Date(year, 0),
                lt: new Date(year + 1, 0),
            };
        }

        if (month && year) {
            where.facturacion = {
                gte: new Date(year, month - 1),
                lt: new Date(year, month),
            };
        }

        try {
            const entregas = await prisma.entregaMuestras.findMany({
                where,
                orderBy: { updatedAt: 'desc' },
                include: {
                    Familia: true,
                    Gte: {
                        include: {
                            Usuario: true,
                            Colaborador: {
                                include: {
                                    Usuario: true,
                                    ZonaAnterior: {
                                        include: {
                                            Empresa: true,
                                        },
                                    },
                                    ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador:
                                        {
                                            include: {
                                                SuperZona: true,
                                            },
                                        },
                                },
                            },
                        },
                    },
                    Usuario_EntregaMuestras_createdByToUsuario: true,
                    Usuario_EntregaMuestras_updatedByToUsuario: true,
                },
            });

            return entregas.map((entrega) => {
                const macrozona =
                    entrega.Gte?.Colaborador
                        ?.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador?.[0]
                        ?.SuperZona?.nombre ?? null;
                const idMacrozona =
                    entrega.Gte?.Colaborador
                        ?.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador?.[0]
                        ?.SuperZona?.id ?? null;

                return {
                    ...entrega,
                    idMacrozona,
                    macrozona,

                    familia: entrega.Familia?.nombre,
                    empresa:
                        entrega.Gte?.Colaborador?.ZonaAnterior?.Empresa
                            ?.nomEmpresa,
                    gte: `${entrega.Gte?.Usuario?.nombres ?? ''} ${
                        entrega.Gte?.Usuario?.apellidos ?? ''
                    }`.trim(),
                    colaborador: entrega.Gte?.Colaborador
                        ? `${entrega.Gte.Colaborador.Usuario?.nombres ?? ''} ${
                              entrega.Gte.Colaborador.Usuario?.apellidos ?? ''
                          }`.trim()
                        : null,
                    idColaborador: entrega.Gte?.Colaborador?.id,
                };
            });
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getEntregaMuestrasById(id: number) {
        try {
            const entrega = await prisma.entregaMuestras.findUnique({
                where: { id },
                include: {
                    Familia: true,
                    Gte: {
                        include: {
                            Usuario: true,
                            Colaborador: {
                                include: {
                                    Usuario: true,
                                    ZonaAnterior: {
                                        include: {
                                            Empresa: true,
                                        },
                                    },
                                    ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador:
                                        {
                                            include: {
                                                SuperZona: true,
                                            },
                                        },
                                },
                            },
                        },
                    },
                    Usuario_EntregaMuestras_createdByToUsuario: true,
                    Usuario_EntregaMuestras_updatedByToUsuario: true,
                },
            });

            if (!entrega)
                throw CustomError.badRequest(`Entrega con id ${id} no existe`);

            // Procesar los datos como en getAllEntregaMuestras
            const macrozona =
                entrega.Gte?.Colaborador
                    ?.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador?.[0]
                    ?.SuperZona?.nombre ?? null;

            const idMacrozona =
                entrega.Gte?.Colaborador
                    ?.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador?.[0]
                    ?.SuperZona?.id ?? null;

            return {
                id: entrega.id,
                idFamilia: entrega.idFamilia,
                idGte: entrega.idGte,
                presentacion: entrega.presentacion,
                unidades: entrega.unidades,
                total: entrega.total,
                agotado: entrega.agotado,
                precio: entrega.precio,
                perdida: entrega.perdida,
                facturacion: entrega.facturacion,
                recepcion: entrega.recepcion,
                createdAt: entrega.createdAt,
                updatedAt: entrega.updatedAt,
                createdBy: entrega.createdBy,
                updatedBy: entrega.updatedBy,
                idMacrozona,
                macrozona,
                familia: entrega.Familia?.nombre,
                clase: entrega.Familia?.clase,
                empresa:
                    entrega.Gte?.Colaborador?.ZonaAnterior?.Empresa?.nomEmpresa,
                gte: `${entrega.Gte?.Usuario?.nombres ?? ''} ${
                    entrega.Gte?.Usuario?.apellidos ?? ''
                }`.trim(),
                colaborador: entrega.Gte?.Colaborador
                    ? `${entrega.Gte.Colaborador.Usuario?.nombres ?? ''} ${
                          entrega.Gte.Colaborador.Usuario?.apellidos ?? ''
                      }`.trim()
                    : null,
                idColaborador: entrega.Gte?.Colaborador?.id,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async calculateStats(filters: {
        idGte?: number;
        idFamilia?: number;
        year?: number;
        month?: number;
        presentacion?: string;
    }) {
        const { idGte, idFamilia, year, month, presentacion } = filters;

        const where: any = {};

        // Aplicar filtros
        if (idGte) {
            where.idGte = idGte;
        }

        if (idFamilia) {
            where.idFamilia = idFamilia;
        }

        if (presentacion) {
            where.presentacion = presentacion;
        }

        // Filtros de fecha para facturación
        if (year && month) {
            where.facturacion = {
                gte: new Date(year, month - 1),
                lt: new Date(year, month),
            };
        } else if (year) {
            where.facturacion = {
                gte: new Date(year, 0),
                lt: new Date(year + 1, 0),
            };
        }

        try {
            // Buscar todas las entregas que coincidan con los filtros
            const entregas = await prisma.entregaMuestras.findMany({
                where,
                select: {
                    unidades: true,
                    presentacion: true,
                    precio: true,
                    total: true,
                },
            });

            // Calcular estadísticas
            const totalUnidades = entregas.reduce(
                (sum, item) => sum + Number(item.unidades),
                0
            );
            const totalMonto = entregas.reduce(
                (sum, item) => sum + Number(item.total),
                0
            );
            const totalPrecio = entregas.reduce(
                (sum, item) =>
                    sum + Number(item.precio) * Number(item.unidades),
                0
            );

            return {
                totalUnidades,
                totalMonto,
                totalPrecio,
                cantidadRegistros: entregas.length,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
