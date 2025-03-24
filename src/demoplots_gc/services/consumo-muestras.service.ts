import { getCurrentDate } from '../../config/time';
import { prisma } from '../../data/sqlserver';
import { ConsumoFilters, CustomError, PaginationDto } from '../../domain';
import { CreateConsumoMuestrasDto } from '../dtos/create-consumo-muestras.dto';
import { UpdateConsumoMuestrasDto } from '../dtos/update-consumo-muestras.dto';
import { Gte } from '../../domain/entities/dashboard/cumplimiento_jerarquia.entity';

export class ConsumoMuestrasService {
    async createConsumoMuestras(
        createConsumoMuestrasDto: CreateConsumoMuestrasDto
    ) {
        // Verificar que la entrega existe
        /*const entregaExists = await prisma.entregaMuestras.findUnique({
            where: { id: createConsumoMuestrasDto.idEntrega },
        });
        if (!entregaExists)
            throw CustomError.badRequest(
                `La entrega con id ${createConsumoMuestrasDto.idEntrega} no existe`
            );*/

        // Verificar que el demoplot existe
        const demoplotExists = await prisma.demoPlot.findUnique({
            where: { id: createConsumoMuestrasDto.idDemoplot },
        });
        if (!demoplotExists)
            throw CustomError.badRequest(
                `El demoplot con id ${createConsumoMuestrasDto.idDemoplot} no existe`
            );

        const currentDate = getCurrentDate();

        try {
            const consumoMuestras = await prisma.consumoMuestras.create({
                data: {
                    idEntrega: createConsumoMuestrasDto.idEntrega,
                    idDemoplot: createConsumoMuestrasDto.idDemoplot,
                    consumo: createConsumoMuestrasDto.consumo,
                    complemento: createConsumoMuestrasDto.complemento,
                    fechaConsumo: createConsumoMuestrasDto.fechaConsumo,
                    comentarios: createConsumoMuestrasDto.comentarios,
                    createdAt: currentDate,
                    updatedAt: currentDate,
                    createdBy: createConsumoMuestrasDto.createdBy,
                },
            });

            return consumoMuestras;
        } catch (error) {
            console.log(error);
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateConsumoMuestras(
        updateConsumoMuestrasDto: UpdateConsumoMuestrasDto
    ) {
        const currentDate = getCurrentDate();
        const consumoExists = await prisma.consumoMuestras.findUnique({
            where: { id: updateConsumoMuestrasDto.id },
        });
        if (!consumoExists)
            throw CustomError.badRequest(
                `Consumo de muestras con id ${updateConsumoMuestrasDto.id} no existe`
            );

        try {
            const updatedConsumo = await prisma.consumoMuestras.update({
                where: { id: updateConsumoMuestrasDto.id },
                data: {
                    ...updateConsumoMuestrasDto.values,
                    updatedAt: currentDate,
                },
            });
            return updatedConsumo;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getConsumosMuestras(
        paginationDto: PaginationDto,
        filters: ConsumoFilters = {}
    ) {
        const { page, limit } = paginationDto;
        const {
            idEntrega,
            idDemoplot,
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

        // Filtro por idEntrega
        if (idEntrega) {
            where.idEntrega = idEntrega;
        }

        // Filtro por idDemoplot
        if (idDemoplot) {
            where.idDemoplot = idDemoplot;
        }

        // Filtro por idFamilia (a través de DemoPlot)
        if (idFamilia) {
            where.DemoPlot = {
                ...where.DemoPlot,
                idFamilia: idFamilia,
            };
        }

        // Filtro por clase de familia
        if (clase) {
            where.DemoPlot = {
                ...where.DemoPlot,
                Familia: {
                    clase: { contains: clase },
                },
            };
        }

        // Filtro por idGte
        if (idGte) {
            where.DemoPlot = {
                ...where.DemoPlot,
                idGte: idGte,
            };
        }

        // Construir condiciones para Gte y Colaborador
        if (idColaborador || idMacrozona || empresa) {
            where.DemoPlot = {
                ...where.DemoPlot,
                Gte: {
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
                                                  SuperZona: {
                                                      id: idMacrozona,
                                                  },
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
                },
            };
        }

        // Filtros de fecha
        if (year) {
            where.fechaConsumo = {
                gte: new Date(year, 0),
                lt: new Date(year + 1, 0),
            };
        }
        if (month && year) {
            where.fechaConsumo = {
                gte: new Date(year, month - 1),
                lt: new Date(year, month),
            };
        }

        try {
            const [total, consumos] = await Promise.all([
                prisma.consumoMuestras.count({ where }),
                prisma.consumoMuestras.findMany({
                    where,
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { updatedAt: 'desc' },
                    include: {
                        DemoPlot: {
                            select: {
                                id: true,
                                titulo: true,
                                Gte: {
                                    select: {
                                        id: true,
                                        Usuario: true,
                                        Colaborador: {
                                            select: {
                                                id: true,
                                                Usuario: true,
                                                ZonaAnterior: {
                                                    select: {
                                                        nombre: true,
                                                        Empresa: {
                                                            select: {
                                                                nomEmpresa:
                                                                    true,
                                                            },
                                                        },
                                                    },
                                                },
                                                ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador:
                                                    {
                                                        select: {
                                                            SuperZona: {
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
                                },
                                Familia: true,
                            },
                        },
                        EntregaMuestras: true,
                        Usuario_ConsumoMuestras_createdByToUsuario: true,
                        Usuario_ConsumoMuestras_updatedByToUsuario: true,
                    },
                }),
            ]);

            return {
                page,
                pages: Math.ceil(total / limit),
                limit,
                total,
                consumos: consumos.map((consumo) => {
                    const macrozona =
                        consumo.DemoPlot?.Gte?.Colaborador
                            ?.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador?.[0]
                            ?.SuperZona?.nombre ?? null;
                    const idMacrozona =
                        consumo.DemoPlot?.Gte?.Colaborador
                            ?.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador?.[0]
                            ?.SuperZona?.id ?? null;

                    return {
                        ...consumo,
                        DemoPlot: {
                            ...consumo.DemoPlot,
                            macrozona,
                            idMacrozona,
                            familia: consumo.DemoPlot?.Familia?.nombre,
                            empresa:
                                consumo.DemoPlot?.Gte?.Colaborador?.ZonaAnterior
                                    ?.Empresa?.nomEmpresa,
                            gte: `${
                                consumo.DemoPlot.Gte.Usuario?.nombres ?? ''
                            } ${
                                consumo.DemoPlot.Gte.Usuario?.apellidos ?? ''
                            }`.trim(),
                            colaborador: consumo.DemoPlot?.Gte?.Colaborador
                                ? `${
                                      consumo.DemoPlot.Gte.Colaborador.Usuario
                                          ?.nombres ?? ''
                                  } ${
                                      consumo.DemoPlot.Gte.Colaborador.Usuario
                                          ?.apellidos ?? ''
                                  }`.trim()
                                : null,
                            idColaborador:
                                consumo.DemoPlot?.Gte?.Colaborador?.id,
                        },
                    };
                }),
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getAllConsumosMuestras(filters: ConsumoFilters = {}) {
        const {
            idEntrega,
            idDemoplot,
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

        // Filtro por idEntrega
        if (idEntrega) {
            where.idEntrega = idEntrega;
        }

        // Filtro por idDemoplot
        if (idDemoplot) {
            where.idDemoplot = idDemoplot;
        }

        // Filtro por idFamilia (a través de DemoPlot)
        if (idFamilia) {
            where.DemoPlot = {
                ...where.DemoPlot,
                idFamilia: idFamilia,
            };
        }

        // Filtro por clase de familia
        if (clase) {
            where.DemoPlot = {
                ...where.DemoPlot,
                Familia: {
                    clase: { contains: clase },
                },
            };
        }

        // Filtro por idGte
        if (idGte) {
            where.DemoPlot = {
                ...where.DemoPlot,
                idGte: idGte,
            };
        }

        // Construir condiciones para Gte y Colaborador
        if (idColaborador || idMacrozona || empresa) {
            where.DemoPlot = {
                ...where.DemoPlot,
                Gte: {
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
                                                  SuperZona: {
                                                      id: idMacrozona,
                                                  },
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
                },
            };
        }

        // Filtros de fecha
        if (year) {
            where.fechaConsumo = {
                gte: new Date(year, 0),
                lt: new Date(year + 1, 0),
            };
        }
        if (month && year) {
            where.fechaConsumo = {
                gte: new Date(year, month - 1),
                lt: new Date(year, month),
            };
        }

        try {
            const consumos = await prisma.consumoMuestras.findMany({
                where,
                orderBy: { updatedAt: 'desc' },
                include: {
                    DemoPlot: {
                        select: {
                            id: true,
                            titulo: true,
                            Gte: {
                                select: {
                                    id: true,
                                    Usuario: true,
                                    Colaborador: {
                                        select: {
                                            id: true,
                                            Usuario: true,
                                            ZonaAnterior: {
                                                select: {
                                                    nombre: true,
                                                    Empresa: {
                                                        select: {
                                                            nomEmpresa: true,
                                                        },
                                                    },
                                                },
                                            },
                                            ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador:
                                                {
                                                    select: {
                                                        SuperZona: {
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
                            },
                            Familia: true,
                        },
                    },
                    EntregaMuestras: true,
                    Usuario_ConsumoMuestras_createdByToUsuario: true,
                    Usuario_ConsumoMuestras_updatedByToUsuario: true,
                },
            });

            return consumos.map((consumo) => {
                const macrozona =
                    consumo.DemoPlot?.Gte?.Colaborador
                        ?.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador?.[0]
                        ?.SuperZona?.nombre ?? null;
                const idMacrozona =
                    consumo.DemoPlot?.Gte?.Colaborador
                        ?.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador?.[0]
                        ?.SuperZona?.id ?? null;

                return {
                    ...consumo,
                    DemoPlot: {
                        ...consumo.DemoPlot,
                        macrozona,
                        idMacrozona,
                        familia: consumo.DemoPlot?.Familia?.nombre,
                        empresa:
                            consumo.DemoPlot?.Gte?.Colaborador?.ZonaAnterior
                                ?.Empresa?.nomEmpresa,
                        gte: `${consumo.DemoPlot.Gte.Usuario?.nombres ?? ''} ${
                            consumo.DemoPlot.Gte.Usuario?.apellidos ?? ''
                        }`.trim(),
                        colaborador: consumo.DemoPlot?.Gte?.Colaborador
                            ? `${
                                  consumo.DemoPlot.Gte.Colaborador.Usuario
                                      ?.nombres ?? ''
                              } ${
                                  consumo.DemoPlot.Gte.Colaborador.Usuario
                                      ?.apellidos ?? ''
                              }`.trim()
                            : null,
                        idColaborador: consumo.DemoPlot?.Gte?.Colaborador?.id,
                    },
                };
            });
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getConsumoMuestrasById(id: number) {
        try {
            const consumo = await prisma.consumoMuestras.findUnique({
                where: { id },
                include: {
                    DemoPlot: true,
                    EntregaMuestras: true,
                    Usuario_ConsumoMuestras_createdByToUsuario: true,
                    Usuario_ConsumoMuestras_updatedByToUsuario: true,
                },
            });
            if (!consumo)
                throw CustomError.badRequest(`Consumo con id ${id} no existe`);
            return consumo;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
