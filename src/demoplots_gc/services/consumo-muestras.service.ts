import { getCurrentDate } from '../../config/time';
import { prisma } from '../../data/sqlserver';
import { ConsumoFilters, CustomError, PaginationDto } from '../../domain';
import { CreateConsumoMuestrasDto } from '../dtos/create-consumo-muestras.dto';
import { UpdateConsumoMuestrasDto } from '../dtos/update-consumo-muestras.dto';

export class ConsumoMuestrasService {
    async createConsumoMuestras(
        createConsumoMuestrasDto: CreateConsumoMuestrasDto
    ) {
        // Verificar que la entrega existe

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
                    idDemoplot: createConsumoMuestrasDto.idDemoplot,
                    consumo: createConsumoMuestrasDto.consumo,
                    idEntrega: createConsumoMuestrasDto.idEntrega,
                    complemento: createConsumoMuestrasDto.complemento,
                    fechaConsumo: createConsumoMuestrasDto.fechaConsumo,
                    comentarios: createConsumoMuestrasDto.comentarios,
                    createdAt: currentDate,
                    updatedAt: currentDate,
                    createdBy: createConsumoMuestrasDto.createdBy,
                    updatedBy: createConsumoMuestrasDto.updatedBy,
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
            where.createdAt = {
                gte: new Date(year, 0),
                lt: new Date(year + 1, 0),
            };
        }
        if (month && year) {
            where.createdAt = {
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
                                idGte: true,
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
                        //...consumo,
                        id: consumo.id,
                        idEntrega: consumo.idEntrega,
                        idDemoplot: consumo.idDemoplot,
                        consumo: Number(consumo.consumo),
                        complemento: consumo.complemento,
                        fechaConsumo: consumo.fechaConsumo,
                        createdAt: consumo.createdAt,
                        updatedAt: consumo.updatedAt,
                        createdBy: consumo.createdBy,
                        updatedBy: consumo.updatedBy,
                        comentarios: consumo.comentarios,
                        macrozona,
                        idMacrozona,
                        familia: consumo.DemoPlot?.Familia?.nombre,
                        empresa:
                            consumo.DemoPlot?.Gte?.Colaborador?.ZonaAnterior
                                ?.Empresa?.nomEmpresa,
                        idGte: consumo.DemoPlot?.idGte,
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
                    DemoPlot: {
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
                        },
                    },
                    EntregaMuestras: true,
                    Usuario_ConsumoMuestras_createdByToUsuario: true,
                    Usuario_ConsumoMuestras_updatedByToUsuario: true,
                },
            });
            if (!consumo)
                throw CustomError.badRequest(`Consumo con id ${id} no existe`);

            // Procesar los mismos datos que en getConsumoMuestras
            const macrozona =
                consumo.DemoPlot?.Gte?.Colaborador
                    ?.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador?.[0]
                    ?.SuperZona?.nombre ?? null;
            const idMacrozona =
                consumo.DemoPlot?.Gte?.Colaborador
                    ?.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador?.[0]
                    ?.SuperZona?.id ?? null;

            return {
                id: consumo.id,
                idEntrega: consumo.idEntrega,
                idDemoplot: consumo.idDemoplot,
                consumo: Number(consumo.consumo),
                complemento: consumo.complemento,
                fechaConsumo: consumo.fechaConsumo,
                createdAt: consumo.createdAt,
                updatedAt: consumo.updatedAt,
                createdBy: consumo.createdBy,
                updatedBy: consumo.updatedBy,
                comentarios: consumo.comentarios,
                macrozona,
                idMacrozona,
                familia: consumo.DemoPlot?.Familia?.nombre,
                empresa:
                    consumo.DemoPlot?.Gte?.Colaborador?.ZonaAnterior?.Empresa
                        ?.nomEmpresa,
                idGte: consumo.DemoPlot?.idGte,
                gte: `${consumo.DemoPlot.Gte.Usuario?.nombres ?? ''} ${
                    consumo.DemoPlot.Gte.Usuario?.apellidos ?? ''
                }`.trim(),
                colaborador: consumo.DemoPlot?.Gte?.Colaborador
                    ? `${
                          consumo.DemoPlot.Gte.Colaborador.Usuario?.nombres ??
                          ''
                      } ${
                          consumo.DemoPlot.Gte.Colaborador.Usuario?.apellidos ??
                          ''
                      }`.trim()
                    : null,
                idColaborador: consumo.DemoPlot?.Gte?.Colaborador?.id,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getConsumoTotalByFilters(
        idGte?: number,
        idFamilia?: number,
        year?: number,
        month?: number
    ) {
        const where: any = {
            DemoPlot: {},
        };

        // Filtrar por idGte
        if (idGte) {
            where.DemoPlot.idGte = idGte;
        }

        // Filtrar por idFamilia
        if (idFamilia) {
            where.DemoPlot.idFamilia = idFamilia;
        }

        // Filtrar por año y mes
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
            // Obtener todos los registros que cumplen con los filtros
            const consumos = await prisma.consumoMuestras.findMany({
                where,
                select: {
                    consumo: true,
                    complemento: true,
                },
            });

            // Calcular la suma de consumos y complementos
            let totalConsumo = 0;
            let totalComplemento = 0;

            consumos.forEach((item) => {
                totalConsumo += Number(item.consumo);
                if (item.complemento) {
                    totalComplemento += Number(item.complemento);
                }
            });

            return {
                totalConsumo,
                totalComplemento,
                total: totalConsumo + totalComplemento,
                count: consumos.length,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getStatisticsConsolidated(filters: {
        idGte?: number;
        idFamilia?: number;
        year?: number;
        month?: number;
        presentacion?: string;
    }) {
        const { idGte, idFamilia, year, month, presentacion } = filters;

        try {
            // 1. Obtener estadísticas de consumo
            const whereConsumo: any = {
                DemoPlot: {},
            };

            // Filtrar por idGte
            if (idGte) {
                whereConsumo.DemoPlot.idGte = idGte;
            }

            // Filtrar por idFamilia
            if (idFamilia) {
                whereConsumo.DemoPlot.idFamilia = idFamilia;
            }

            // Filtrar por año y mes para consumo
            if (year) {
                whereConsumo.fechaConsumo = {
                    gte: new Date(year, 0),
                    lt: new Date(year + 1, 0),
                };
            }
            if (month && year) {
                whereConsumo.fechaConsumo = {
                    gte: new Date(year, month - 1),
                    lt: new Date(year, month),
                };
            }

            // 2. Obtener estadísticas de entrega
            const whereEntrega: any = {};

            // Aplicar filtros
            if (idGte) {
                whereEntrega.idGte = idGte;
            }

            if (idFamilia) {
                whereEntrega.idFamilia = idFamilia;
            }

            if (presentacion) {
                whereEntrega.presentacion = presentacion;
            }

            // Filtros de fecha para facturación de entregas
            if (year && month) {
                whereEntrega.facturacion = {
                    gte: new Date(year, month - 1),
                    lt: new Date(year, month),
                };
            } else if (year) {
                whereEntrega.facturacion = {
                    gte: new Date(year, 0),
                    lt: new Date(year + 1, 0),
                };
            }

            // 3. Ejecutar consultas en paralelo
            const [consumos, entregas] = await Promise.all([
                prisma.consumoMuestras.findMany({
                    where: whereConsumo,
                    select: {
                        consumo: true,
                        complemento: true,
                    },
                }),
                prisma.entregaMuestras.findMany({
                    where: whereEntrega,
                    select: {
                        unidades: true,
                        presentacion: true,
                        precio: true,
                        total: true,
                    },
                }),
            ]);

            // 4. Calcular estadísticas de consumo
            let totalConsumo = 0;
            let totalComplemento = 0;

            consumos.forEach((item) => {
                totalConsumo += Number(item.consumo || 0);
                if (item.complemento) {
                    totalComplemento += Number(item.complemento);
                }
            });

            // 5. Calcular estadísticas de entrega
            const totalUnidades = entregas.reduce(
                (sum, item) => sum + Number(item.unidades ?? 0),
                0
            );
            const totalMonto = entregas.reduce(
                (sum, item) => sum + Number(item.total ?? 0),
                0
            );
            const totalPrecio = entregas.reduce(
                (sum, item) =>
                    sum + Number(item.precio || 0) * Number(item.unidades ?? 0),
                0
            );

            // 6. Retornar estadísticas consolidadas
            return {
                consumos: {
                    totalConsumo,
                    totalComplemento,
                    totalGeneral: totalConsumo + totalComplemento,
                    cantidadRegistros: consumos.length,
                },
                entregas: {
                    totalUnidades,
                    totalMonto,
                    totalPrecio,
                    cantidadRegistros: entregas.length,
                },
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
