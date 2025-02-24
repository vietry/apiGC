import { prisma } from '../../data/sqlserver';
import { CustomError, Empresa, GteRankingFilters } from '../../domain';

import { DemoplotFilters } from './demoplot.service';

export class DashboardService {
    async getGteRankings(filters: GteRankingFilters = {}) {
        const {
            year,
            month,
            idColaborador,
            macrozona,
            empresa,
            clase,
            idFamilia,
            activo,
            idGte,
        } = filters;
        try {
            // 1. Construir "where" para filtrar GTEs según idColaborador, macrozona y empresa
            const gteWhere: any = {};

            // Filtro por idColaborador
            if (idColaborador !== undefined) {
                gteWhere.idColaborador = idColaborador;
            }

            if (activo !== undefined) {
                gteWhere.activo = activo;
            }
            if (idGte) {
                gteWhere.id = idGte;
            }

            // Filtro por macrozona
            if (macrozona) {
                // Recordando que "macrozona" la obtenías de:
                //  Colaborador.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador.[].SuperZona.nombre
                // Se hace un "some" (al menos uno) coincida con la macrozona
                gteWhere.Colaborador = {
                    ...gteWhere.Colaborador,
                    ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador:
                        {
                            some: {
                                SuperZona: {
                                    id: macrozona, // o { contains: macrozona, mode: 'insensitive' } si quieres búsqueda parcial
                                },
                            },
                        },
                };
            }

            // Filtro por empresa
            if (empresa) {
                // Recordando que "empresa" la obtenías de:
                //  Colaborador.ZonaAnterior.Empresa.nomEmpresa
                gteWhere.Colaborador = {
                    ...gteWhere.Colaborador,
                    ZonaAnterior: {
                        ...gteWhere.Colaborador?.ZonaAnterior,
                        Empresa: {
                            nomEmpresa: empresa, // o { contains: empresa, mode: 'insensitive' }
                        },
                    },
                };
            }

            // 2. Obtén todos los GTEs que cumplan con esos filtros (junto a su info de usuario/colaborador)
            const gtes = await prisma.gte.findMany({
                where: {
                    NOT: {
                        id: 1125,
                    },
                    ...gteWhere,
                },

                select: {
                    id: true,
                    idColaborador: true,
                    activo: true,
                    Colaborador: {
                        select: {
                            id: true,
                            Usuario: {
                                select: {
                                    nombres: true,
                                    apellidos: true,
                                },
                            },
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
                                            },
                                        },
                                    },
                                },
                        },
                    },
                    Usuario: {
                        select: {
                            nombres: true,
                            apellidos: true,
                        },
                    },
                },
            });

            // Si no hay GTEs que cumplan el filtro, puedes retornar un array vacío
            if (!gtes.length) {
                return [];
            }

            // 3. Calcular las fechas según year y month (si se proveen)
            // Si no hay year ni month => sin filtrar por fecha
            // Si hay year, pero no month => filtrar all el año
            // Si hay year y month => filtrar solo ese month
            let startDate: Date | undefined;
            let endDate: Date | undefined;

            if (year) {
                if (month) {
                    // año y month
                    startDate = new Date(year, month - 1, 1); // Primer día del month
                    endDate = new Date(year, month, 1); // Primer día del siguiente month
                } else {
                    // solo año
                    startDate = new Date(year, 0, 1); // 1 de enero de 'year'
                    endDate = new Date(year + 1, 0, 1); // 1 de enero del year siguiente
                }
            }

            const calcularObjetivos = () => {
                const demosPorMes = 60;
                const diasCampoPorMes = 4;
                const fechaActual = new Date();
                const añoActual = fechaActual.getFullYear();
                const mesActual = fechaActual.getMonth() + 1;

                if (year && month) {
                    // Si hay año y mes específico
                    return {
                        demosObjetivo: demosPorMes,
                        diasCampoObjetivo: diasCampoPorMes,
                    };
                } else if (year) {
                    if (year < añoActual) {
                        // Año anterior completo
                        return {
                            demosObjetivo: demosPorMes * 12,
                            diasCampoObjetivo: diasCampoPorMes * 12,
                        };
                    } else if (year === añoActual) {
                        // Año actual hasta el mes actual
                        return {
                            demosObjetivo: demosPorMes * mesActual,
                            diasCampoObjetivo: diasCampoPorMes * mesActual,
                        };
                    } else {
                        // Año futuro
                        return {
                            demosObjetivo: demosPorMes,
                            diasCampoObjetivo: diasCampoPorMes,
                        };
                    }
                }
                // Sin filtros de fecha
                return {
                    demosObjetivo: demosPorMes,
                    diasCampoObjetivo: diasCampoPorMes,
                };
            };

            // 4. Para agrupar demoplots, necesitamos filtrar SOLO por los GTEs obtenidos + estado + finalizacion
            const claseFamiliaFilter = clase
                ? {
                      Familia: {
                          clase: { contains: clase },
                      },
                  }
                : {};

            const familiaFilter = idFamilia
                ? {
                      Familia: {
                          id: idFamilia,
                      },
                  }
                : {};
            // Obtenemos la lista de IDs de GTE filtrados
            const gteIds = gtes.map((g) => g.id);

            // Creamos "where" para la agrupación de demoplots
            const demoWhereCompletado: any = {
                estado: 'Completado',
                idGte: { in: gteIds },
                ...claseFamiliaFilter,
                ...familiaFilter,
            };
            const demoWhereDiaCampo: any = {
                estado: 'Día campo',
                idGte: { in: gteIds },
                ...claseFamiliaFilter,
                ...familiaFilter,
            };

            // Agregar nuevos where para cada estado
            const demoWhereProgramado: any = {
                estado: 'Programado',
                idGte: { in: gteIds },
                ...claseFamiliaFilter,
                ...familiaFilter,
            };
            const demoWhereIniciado: any = {
                estado: 'Iniciado',
                idGte: { in: gteIds },
                ...claseFamiliaFilter,
                ...familiaFilter,
            };
            const demoWhereSeguimiento: any = {
                estado: 'Seguimiento',
                idGte: { in: gteIds },
                ...claseFamiliaFilter,
                ...familiaFilter,
            };
            const demoWhereCancelado: any = {
                estado: 'Cancelado',
                idGte: { in: gteIds },
                ...claseFamiliaFilter,
                ...familiaFilter,
            };
            const demoWhereReprogramado: any = {
                estado: 'Reprogramado',
                idGte: { in: gteIds },
                ...claseFamiliaFilter,
                ...familiaFilter,
            };

            if (startDate && endDate) {
                const dateFilter = {
                    updatedAt: {
                        gte: startDate,
                        lt: endDate,
                    },
                };
                demoWhereCompletado.updatedAt = dateFilter.updatedAt;
                demoWhereDiaCampo.updatedAt = dateFilter.updatedAt;
                demoWhereProgramado.updatedAt = dateFilter.updatedAt;
                demoWhereIniciado.updatedAt = dateFilter.updatedAt;
                demoWhereSeguimiento.updatedAt = dateFilter.updatedAt;
                demoWhereCancelado.updatedAt = dateFilter.updatedAt;
                demoWhereReprogramado.updatedAt = dateFilter.updatedAt;
            }

            // 5. Agrupa los demoplots "Completado" y "Día campo"
            const [
                completedDemoplotCounts,
                diaCampoDemoplotCounts,
                programadoDemoplotCounts,
                iniciadoDemoplotCounts,
                seguimientoDemoplotCounts,
                canceladoDemoplotCounts,
                reprogramadoDemoplotCounts,
            ] = await Promise.all([
                prisma.demoPlot.groupBy({
                    by: ['idGte'],
                    where: demoWhereCompletado,
                    _count: { id: true },
                }),
                prisma.demoPlot.groupBy({
                    by: ['idGte'],
                    where: demoWhereDiaCampo,
                    _count: { id: true },
                }),
                prisma.demoPlot.groupBy({
                    by: ['idGte'],
                    where: demoWhereProgramado,
                    _count: { id: true },
                }),
                prisma.demoPlot.groupBy({
                    by: ['idGte'],
                    where: demoWhereIniciado,
                    _count: { id: true },
                }),
                prisma.demoPlot.groupBy({
                    by: ['idGte'],
                    where: demoWhereSeguimiento,
                    _count: { id: true },
                }),
                prisma.demoPlot.groupBy({
                    by: ['idGte'],
                    where: demoWhereCancelado,
                    _count: { id: true },
                }),
                prisma.demoPlot.groupBy({
                    by: ['idGte'],
                    where: demoWhereReprogramado,
                    _count: { id: true },
                }),
            ]);

            // 6. Diccionarios para conteo rápido
            const completedCountsByGteId: { [key: number]: number } = {};
            completedDemoplotCounts.forEach((item) => {
                completedCountsByGteId[item.idGte] = item._count.id;
            });

            const diaCampoCountsByGteId: { [key: number]: number } = {};
            diaCampoDemoplotCounts.forEach((item) => {
                diaCampoCountsByGteId[item.idGte] = item._count.id;
            });

            const programadoCountsByGteId: { [key: number]: number } = {};
            programadoDemoplotCounts.forEach((item) => {
                programadoCountsByGteId[item.idGte] = item._count.id;
            });

            const iniciadoCountsByGteId: { [key: number]: number } = {};
            iniciadoDemoplotCounts.forEach((item) => {
                iniciadoCountsByGteId[item.idGte] = item._count.id;
            });

            const seguimientoCountsByGteId: { [key: number]: number } = {};
            seguimientoDemoplotCounts.forEach((item) => {
                seguimientoCountsByGteId[item.idGte] = item._count.id;
            });

            const canceladoCountsByGteId: { [key: number]: number } = {};
            canceladoDemoplotCounts.forEach((item) => {
                canceladoCountsByGteId[item.idGte] = item._count.id;
            });

            const reprogramadoCountsByGteId: { [key: number]: number } = {};
            reprogramadoDemoplotCounts.forEach((item) => {
                reprogramadoCountsByGteId[item.idGte] = item._count.id;
            });

            const { demosObjetivo, diasCampoObjetivo } = calcularObjetivos();

            // 7. Armamos la lista final con la info de cada GTE filtrado
            const gteStats = gtes.map((gte) => {
                const completados = completedCountsByGteId[gte.id] || 0;
                const diasCampo = diaCampoCountsByGteId[gte.id] || 0;
                const programados = programadoCountsByGteId[gte.id] || 0;
                const iniciados = iniciadoCountsByGteId[gte.id] || 0;
                const seguimiento = seguimientoCountsByGteId[gte.id] || 0;
                const cancelados = canceladoCountsByGteId[gte.id] || 0;
                const reprogramados = reprogramadoCountsByGteId[gte.id] || 0;
                // Supongamos meta de 60 para completados y 4 para día de campo
                const cumplimientoCompletados = completados / demosObjetivo;
                const cumplimientoDiaCampo = diasCampo / diasCampoObjetivo;
                const totalCumplimiento = completados + diasCampo;
                const total =
                    completados +
                    diasCampo +
                    programados +
                    iniciados +
                    seguimiento +
                    cancelados +
                    reprogramados;
                const cumplimiento = totalCumplimiento / demosObjetivo;

                // Extraer macrozona (asumiendo un array de ColaboradorJefe => .[0]?
                const macrozona =
                    gte.Colaborador
                        ?.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador?.[0]
                        ?.SuperZona?.id ?? null;

                return {
                    idGte: gte.id,
                    activo: gte.activo,
                    macrozona: macrozona,
                    idColaborador: gte.Colaborador?.id,
                    zonaanterior: gte.Colaborador?.ZonaAnterior?.nombre?.trim(),
                    empresa: gte.Colaborador?.ZonaAnterior?.Empresa?.nomEmpresa,
                    nombreGte: `${gte.Usuario?.nombres} ${gte.Usuario?.apellidos}`,
                    nomApeGte: `${gte.Usuario?.nombres.split(' ')[0]} ${
                        gte.Usuario?.apellidos?.split(' ')[0]
                    }`,
                    colaborador: `${gte.Colaborador?.Usuario?.nombres} ${gte.Colaborador?.Usuario?.apellidos}`,
                    programados,
                    iniciados,
                    completados,
                    seguimiento,
                    diasCampo,
                    cancelados,
                    reprogramados,
                    demosObjetivo,
                    diasCampoObjetivo,
                    cumplimientoCompletados,
                    cumplimientoDiaCampo,
                    cumplimiento,
                    rank: 0, // se asignará más adelante
                };
            });

            // 8. Ordenar por el total de demoplots (completados + día campo)
            gteStats.sort((a, b) => {
                const totalA = a.completados + a.diasCampo;
                const totalB = b.completados + b.diasCampo;
                return totalB - totalA;
            });

            // 9. Asignar rank (1-based) según el total de demoplots
            let rank = 1;
            let previousTotal = null;
            for (let i = 0; i < gteStats.length; i++) {
                const currentTotal =
                    gteStats[i].completados + gteStats[i].diasCampo;
                if (previousTotal !== null && currentTotal < previousTotal) {
                    rank = i + 1;
                }
                gteStats[i].rank = rank;
                previousTotal = currentTotal;
            }

            // 10. Retornar el resultado filtrado
            return gteStats;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async countDemoplotsByFilters(filters: DemoplotFilters) {
        try {
            const where: any = {};

            if (filters.objetivo) {
                where.objetivo = { contains: filters.objetivo };
            }
            if (filters.cultivo) {
                where.Cultivo = {
                    Variedad: {
                        Vegetacion: { nombre: { contains: filters.cultivo } },
                    },
                };
            }
            if (filters.estado) {
                where.estado = filters.estado;
            }
            if (filters.idFamilia) {
                where.idFamilia = filters.idFamilia;
            }

            if (filters.clase) {
                where.Familia = { clase: { contains: filters.clase } };
            }
            if (filters.idGte) {
                where.idGte = filters.idGte;
            }
            if (filters.infestacion) {
                where.gradoInfestacion = { contains: filters.infestacion };
            }
            if (
                filters.empresa ||
                filters.macrozona ||
                filters.idColaborador ||
                filters.gdactivo !== undefined
            ) {
                where.Gte = {
                    ...(filters.gdactivo !== undefined && {
                        activo: filters.gdactivo,
                    }),
                    Colaborador: {
                        ...(filters.idColaborador && {
                            id: filters.idColaborador,
                        }),
                        ...(filters.empresa && {
                            ZonaAnterior: {
                                Empresa: {
                                    nomEmpresa: { contains: filters.empresa },
                                },
                            },
                        }),
                        ...(filters.macrozona && {
                            ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador:
                                {
                                    some: {
                                        SuperZona: { id: filters.macrozona },
                                    },
                                },
                        }),
                    },
                };
            }
            if (filters.departamento) {
                where.Distrito = {
                    Provincia: {
                        Departamento: {
                            nombre: { contains: filters.departamento },
                        },
                    },
                };
            }
            if (filters.provincia) {
                where.Distrito = {
                    Provincia: { nombre: { contains: filters.provincia } },
                };
            }
            if (filters.distrito) {
                where.Distrito = { nombre: { contains: filters.distrito } };
            }
            if (filters.venta !== undefined) {
                where.venta = filters.venta;
            }
            if (filters.validacion !== undefined) {
                where.validacion = filters.validacion;
            }
            if (filters.year) {
                where.updatedAt = {
                    gte: new Date(filters.year, 0),
                    lt: new Date(filters.year + 1, 0),
                };
            }
            if (filters.month && filters.year) {
                where.updatedAt = {
                    gte: new Date(filters.year, filters.month - 1),
                    lt: new Date(filters.year, filters.month),
                };
            }

            const demoplotCounts = await prisma.demoPlot.groupBy({
                by: ['estado'],
                where,

                _count: { estado: true },
            });

            const counts = {
                todos: 0,
                programados: 0,
                seguimiento: 0,
                completados: 0,
                cancelados: 0,
                reprogramados: 0,
                diaCampo: 0,
                iniciados: 0,
            };

            demoplotCounts.forEach((demoplot) => {
                counts.todos += demoplot._count.estado;
                switch (demoplot.estado) {
                    case 'Programado':
                        counts.programados = demoplot._count.estado;
                        break;
                    case 'Seguimiento':
                        counts.seguimiento = demoplot._count.estado;
                        break;
                    case 'Completado':
                        counts.completados = demoplot._count.estado;
                        break;
                    case 'Cancelado':
                        counts.cancelados = demoplot._count.estado;
                        break;
                    case 'Reprogramado':
                        counts.reprogramados = demoplot._count.estado;
                        break;
                    case 'Día campo':
                        counts.diaCampo = demoplot._count.estado;
                        break;
                    case 'Iniciado':
                        counts.iniciados = demoplot._count.estado;
                        break;
                }
            });

            return counts;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async countDemoplotsByFiltersCustomDate(filters: DemoplotFilters) {
        try {
            const where: any = {};
            // ... copiar todos los filtros anteriores hasta year/month ...

            if (filters.objetivo) {
                where.objetivo = { contains: filters.objetivo };
            }
            if (filters.cultivo) {
                where.Cultivo = {
                    Variedad: {
                        Vegetacion: { nombre: { contains: filters.cultivo } },
                    },
                };
            }
            if (filters.estado) {
                where.estado = filters.estado;
            }
            if (filters.idFamilia) {
                where.idFamilia = filters.idFamilia;
            }

            if (filters.clase) {
                where.Familia = { clase: { contains: filters.clase } };
            }
            if (filters.idGte) {
                where.idGte = filters.idGte;
            }
            if (filters.infestacion) {
                where.gradoInfestacion = { contains: filters.infestacion };
            }
            if (
                filters.empresa ||
                filters.macrozona ||
                filters.idColaborador ||
                filters.gdactivo !== undefined
            ) {
                where.Gte = {
                    ...(filters.gdactivo !== undefined && {
                        activo: filters.gdactivo,
                    }),
                    Colaborador: {
                        ...(filters.idColaborador && {
                            id: filters.idColaborador,
                        }),
                        ...(filters.empresa && {
                            ZonaAnterior: {
                                Empresa: {
                                    nomEmpresa: { contains: filters.empresa },
                                },
                            },
                        }),
                        ...(filters.macrozona && {
                            ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador:
                                {
                                    some: {
                                        SuperZona: { id: filters.macrozona },
                                    },
                                },
                        }),
                    },
                };
            }
            if (filters.departamento) {
                where.Distrito = {
                    Provincia: {
                        Departamento: {
                            nombre: { contains: filters.departamento },
                        },
                    },
                };
            }
            if (filters.provincia) {
                where.Distrito = {
                    Provincia: { nombre: { contains: filters.provincia } },
                };
            }
            if (filters.distrito) {
                where.Distrito = { nombre: { contains: filters.distrito } };
            }
            if (filters.venta !== undefined) {
                where.venta = filters.venta;
            }
            if (filters.validacion !== undefined) {
                where.validacion = filters.validacion;
            }

            if (filters.year && filters.month) {
                const year = filters.year;
                const month = filters.month;

                // Calcular mes anterior
                const previousMonth = month === 1 ? 12 : month - 1;
                const previousYear = month === 1 ? year - 1 : year;

                // Fechas para el mes actual (1-19)
                const currentMonthStart = new Date(year, month - 1, 1);
                const currentMonthEnd = new Date(year, month - 1, 20); // día 19 a las 23:59

                // Fechas para el mes anterior (20-fin)
                const previousMonthStart = new Date(
                    previousYear,
                    previousMonth - 1,
                    20
                );
                const previousMonthEnd = new Date(year, month - 1, 1);

                where.OR = [
                    {
                        // Registros del 1-19 del mes actual
                        updatedAt: {
                            gte: currentMonthStart,
                            lt: currentMonthEnd,
                        },
                    },
                    {
                        // Registros del 20-fin del mes anterior
                        updatedAt: {
                            gte: previousMonthStart,
                            lt: previousMonthEnd,
                        },
                    },
                ];
            }

            const demoplotCounts = await prisma.demoPlot.groupBy({
                by: ['estado'],
                where,
                _count: { estado: true },
            });

            const counts = {
                todos: 0,
                programados: 0,
                seguimiento: 0,
                completados: 0,
                cancelados: 0,
                reprogramados: 0,
                diaCampo: 0,
                iniciados: 0,
            };

            demoplotCounts.forEach((demoplot) => {
                counts.todos += demoplot._count.estado;
                switch (demoplot.estado) {
                    case 'Programado':
                        counts.programados = demoplot._count.estado;
                        break;
                    case 'Seguimiento':
                        counts.seguimiento = demoplot._count.estado;
                        break;
                    case 'Completado':
                        counts.completados = demoplot._count.estado;
                        break;
                    case 'Cancelado':
                        counts.cancelados = demoplot._count.estado;
                        break;
                    case 'Reprogramado':
                        counts.reprogramados = demoplot._count.estado;
                        break;
                    case 'Día campo':
                        counts.diaCampo = demoplot._count.estado;
                        break;
                    case 'Iniciado':
                        counts.iniciados = demoplot._count.estado;
                        break;
                }
            });

            return counts;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getGteRankingsCustomDate(filters: GteRankingFilters = {}) {
        const {
            year,
            month,
            idColaborador,
            macrozona,
            empresa,
            clase,
            activo,
        } = filters;
        try {
            // 1. Construir "where" para filtrar GTEs según idColaborador, macrozona, empresa, activo.
            const gteWhere: any = {};

            if (idColaborador !== undefined) {
                gteWhere.idColaborador = idColaborador;
            }

            if (activo !== undefined) {
                gteWhere.activo = activo;
            }

            if (macrozona) {
                // Buscamos GTEs que tengan un Colaborador -> ColaboradorJefe -> SuperZona con ID (o nombre) 'macrozona'
                gteWhere.Colaborador = {
                    ...gteWhere.Colaborador,
                    ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador:
                        {
                            some: {
                                SuperZona: {
                                    id: macrozona,
                                    // Si quisieras por nombre aproximado:
                                    // nombre: { contains: macrozona, mode: 'insensitive' }
                                },
                            },
                        },
                };
            }

            if (empresa) {
                gteWhere.Colaborador = {
                    ...gteWhere.Colaborador,
                    ZonaAnterior: {
                        ...gteWhere.Colaborador?.ZonaAnterior,
                        Empresa: {
                            nomEmpresa: empresa,
                            // o { contains: empresa, mode: 'insensitive' }
                        },
                    },
                };
            }

            // 2. Buscar los GTE que cumplan con esos filtros
            const gtes = await prisma.gte.findMany({
                where: {
                    NOT: {
                        id: 1125,
                    },
                    ...gteWhere,
                },
                select: {
                    id: true,
                    idColaborador: true,
                    activo: true,
                    Colaborador: {
                        select: {
                            id: true,
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
                                                // o 'nombre' si filtras por nombre
                                            },
                                        },
                                    },
                                },
                        },
                    },
                    Usuario: {
                        select: {
                            nombres: true,
                            apellidos: true,
                        },
                    },
                },
            });

            if (!gtes.length) {
                return [];
            }

            // 3. Construir la lógica de fechas personalizada SOLO si year y month existen
            const claseFamiliaFilter = clase
                ? {
                      Familia: {
                          clase: { contains: clase },
                      },
                  }
                : {};

            let demoWhereCompletado: any = {
                estado: 'Completado',
                idGte: { in: gtes.map((g) => g.id) },
                ...claseFamiliaFilter,
            };
            let demoWhereDiaCampo: any = {
                estado: 'Día campo',
                idGte: { in: gtes.map((g) => g.id) },
                ...claseFamiliaFilter,
            };

            if (year && month) {
                // Calculamos el mes anterior
                const previousMonth = month === 1 ? 12 : month - 1;
                const previousYear = month === 1 ? year - 1 : year;

                // Rango 1-19 del mes actual
                const currentMonthStart = new Date(year, month - 1, 1);
                const currentMonthEnd = new Date(year, month - 1, 20);

                // Rango 20-fin del mes anterior
                const previousMonthStart = new Date(
                    previousYear,
                    previousMonth - 1,
                    20
                );
                const previousMonthEnd = new Date(year, month - 1, 1);

                // Para aplicar esta lógica en Prisma, usamos OR en 'updatedAt'
                // (o en 'finalizacion' si tu campo de fecha es otro)
                const customOR = [
                    {
                        updatedAt: {
                            gte: currentMonthStart,
                            lt: currentMonthEnd,
                        },
                    },
                    {
                        updatedAt: {
                            gte: previousMonthStart,
                            lt: previousMonthEnd,
                        },
                    },
                ];

                demoWhereCompletado = {
                    ...demoWhereCompletado,
                    OR: customOR,
                };
                demoWhereDiaCampo = {
                    ...demoWhereDiaCampo,
                    OR: customOR,
                };
            }

            // 4. Agrupar los demoplots “Completado” y “Día campo” con la lógica de fechas custom
            const [completedDemoplotCounts, diaCampoDemoplotCounts] =
                await Promise.all([
                    prisma.demoPlot.groupBy({
                        by: ['idGte'],
                        where: demoWhereCompletado,
                        _count: { id: true },
                    }),
                    prisma.demoPlot.groupBy({
                        by: ['idGte'],
                        where: demoWhereDiaCampo,
                        _count: { id: true },
                    }),
                ]);

            // 5. Armar diccionarios para conteo rápido
            const completedCountsByGteId: Record<number, number> = {};
            completedDemoplotCounts.forEach((item) => {
                completedCountsByGteId[item.idGte] = item._count.id;
            });

            const diaCampoCountsByGteId: Record<number, number> = {};
            diaCampoDemoplotCounts.forEach((item) => {
                diaCampoCountsByGteId[item.idGte] = item._count.id;
            });

            // 6. Construimos la lista final con los totales
            const gteStats = gtes.map((gte) => {
                const completados = completedCountsByGteId[gte.id] || 0;
                const diasCampo = diaCampoCountsByGteId[gte.id] || 0;

                const cumplimientoCompletados = completados / 60; // meta 60
                const cumplimientoDiaCampo = diasCampo / 4; // meta 4
                const total = completados + diasCampo;
                const cumplimiento = total / 60;

                const macrozonaVal =
                    gte.Colaborador
                        ?.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador?.[0]
                        ?.SuperZona?.id ?? null;

                return {
                    idGte: gte.id,
                    activo: gte.activo,
                    macrozona: macrozonaVal,
                    idColaborador: gte.Colaborador?.id,
                    zonaanterior: gte.Colaborador?.ZonaAnterior?.nombre?.trim(),
                    empresa: gte.Colaborador?.ZonaAnterior?.Empresa?.nomEmpresa,
                    nombreGte: `${gte.Usuario?.nombres} ${gte.Usuario?.apellidos}`,
                    completados,
                    diasCampo,
                    cumplimientoCompletados,
                    cumplimientoDiaCampo,
                    cumplimiento,
                    rank: 0,
                };
            });

            // 7. Ordenar por (# completados + # días campo) desc
            gteStats.sort((a, b) => {
                const totalA = a.completados + a.diasCampo;
                const totalB = b.completados + b.diasCampo;
                return totalB - totalA;
            });

            // 8. Asignar rank
            let rank = 1;
            let previousTotal = null;
            for (let i = 0; i < gteStats.length; i++) {
                const currentTotal =
                    gteStats[i].completados + gteStats[i].diasCampo;
                if (previousTotal !== null && currentTotal < previousTotal) {
                    rank = i + 1;
                }
                gteStats[i].rank = rank;
                previousTotal = currentTotal;
            }

            return gteStats;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getJerarquiaRankings(filters: GteRankingFilters = {}) {
        try {
            const gteStats = await this.getGteRankings(filters);
            const empresas: { [key: string]: Empresa } = {};

            gteStats.forEach((gte) => {
                const empresaName = gte.empresa ?? 'Sin Empresa';
                const macrozonaId =
                    gte.macrozona?.toString() ?? 'Sin Macrozona';
                const rtcId = gte.idColaborador?.toString() ?? 'Sin RTC';
                const zona = gte.zonaanterior?.toString() ?? 'Sin Zona';

                if (!empresas[empresaName]) {
                    empresas[empresaName] = {
                        id: empresaName,
                        name: empresaName,
                        macroZonas: [],
                        total: {
                            demoplots: 0,
                            programados: 0,
                            iniciados: 0,
                            seguimiento: 0,
                            completados: 0,
                            diasCampo: 0,
                            reprogramados: 0,
                            cancelados: 0,
                            demosObjetivo: 0,
                            diasCampoObjetivo: 0,
                            cumplimientoCompletados: 0,
                            cumplimientoDiaCampo: 0,
                            cumplimiento: 0,
                        },
                    };
                }

                let macrozona = empresas[empresaName].macroZonas.find(
                    (m) => m.id === macrozonaId
                );

                if (!macrozona) {
                    macrozona = {
                        id: macrozonaId,
                        name: macrozonaId,
                        retailers: [],
                        total: {
                            demoplots: 0,
                            programados: 0,
                            iniciados: 0,
                            seguimiento: 0,
                            completados: 0,
                            diasCampo: 0,
                            reprogramados: 0,
                            cancelados: 0,
                            demosObjetivo: 0,
                            diasCampoObjetivo: 0,
                            cumplimientoCompletados: 0,
                            cumplimientoDiaCampo: 0,
                            cumplimiento: 0,
                        },
                    };
                    empresas[empresaName].macroZonas.push(macrozona);
                }

                let rtc = macrozona.retailers.find((r) => r.id === rtcId);

                if (!rtc) {
                    rtc = {
                        id: rtcId,
                        name: zona,
                        generadores: [],
                        total: {
                            demoplots: 0,
                            programados: 0,
                            iniciados: 0,
                            seguimiento: 0,
                            completados: 0,
                            diasCampo: 0,
                            reprogramados: 0,
                            cancelados: 0,
                            demosObjetivo: 0,
                            diasCampoObjetivo: 0,
                            cumplimientoCompletados: 0,
                            cumplimientoDiaCampo: 0,
                            cumplimiento: 0,
                        },
                    };
                    macrozona.retailers.push(rtc);
                }

                rtc.generadores.push({
                    id: gte.idGte.toString(),
                    nombres: gte.nombreGte,
                    demoplots: gte.completados + gte.diasCampo,
                    programados: gte.programados,
                    iniciados: gte.iniciados,
                    seguimiento: gte.seguimiento,
                    completados: gte.completados,
                    diasCampo: gte.diasCampo,
                    reprogramados: gte.reprogramados,
                    cancelados: gte.cancelados,
                    demosObjetivo: gte.demosObjetivo,
                    diasCampoObjetivo: gte.diasCampoObjetivo,
                    cumplimientoCompletados: gte.cumplimientoCompletados,
                    cumplimientoDiaCampo: gte.cumplimientoDiaCampo,
                    cumplimiento: gte.cumplimiento,
                    rank: gte.rank,
                });
            });

            Object.values(empresas).forEach((empresa) => {
                empresa.macroZonas.forEach((macrozona) => {
                    macrozona.retailers.forEach((rtc) => {
                        // Calcular totales de RTC
                        rtc.total = rtc.generadores.reduce(
                            (total, gte) => ({
                                demoplots: total.demoplots + gte.demoplots,
                                programados:
                                    total.programados + gte.programados,
                                iniciados: total.iniciados + gte.iniciados,
                                seguimiento:
                                    total.seguimiento + gte.seguimiento,
                                completados:
                                    total.completados + gte.completados,
                                diasCampo: total.diasCampo + gte.diasCampo,
                                reprogramados:
                                    total.reprogramados + gte.reprogramados,
                                cancelados: total.cancelados + gte.cancelados,
                                demosObjetivo:
                                    total.demosObjetivo + gte.demosObjetivo,
                                diasCampoObjetivo:
                                    total.diasCampoObjetivo +
                                    gte.diasCampoObjetivo,
                                cumplimientoCompletados: 0,
                                cumplimientoDiaCampo: 0,
                                cumplimiento: 0,
                            }),
                            {
                                demoplots: 0,
                                programados: 0,
                                iniciados: 0,
                                seguimiento: 0,
                                completados: 0,
                                diasCampo: 0,
                                reprogramados: 0,
                                cancelados: 0,
                                demosObjetivo: 0,
                                diasCampoObjetivo: 0,
                                cumplimientoCompletados: 0,
                                cumplimientoDiaCampo: 0,
                                cumplimiento: 0,
                            }
                        );

                        // Calcular promedios de RTC
                        const gteCount = rtc.generadores.length;
                        if (gteCount > 0) {
                            rtc.total.cumplimientoCompletados =
                                rtc.generadores.reduce(
                                    (sum, gte) =>
                                        sum + gte.cumplimientoCompletados,
                                    0
                                ) / gteCount;
                            rtc.total.cumplimientoDiaCampo =
                                rtc.generadores.reduce(
                                    (sum, gte) =>
                                        sum + gte.cumplimientoDiaCampo,
                                    0
                                ) / gteCount;
                            rtc.total.cumplimiento =
                                rtc.generadores.reduce(
                                    (sum, gte) => sum + gte.cumplimiento,
                                    0
                                ) / gteCount;
                        }
                    });

                    // Calcular totales de Macrozona
                    macrozona.total = macrozona.retailers.reduce(
                        (total, rtc) => ({
                            demoplots: total.demoplots + rtc.total.demoplots,
                            programados:
                                total.programados + rtc.total.programados,
                            iniciados: total.iniciados + rtc.total.iniciados,
                            seguimiento:
                                total.seguimiento + rtc.total.seguimiento,
                            completados:
                                total.completados + rtc.total.completados,
                            diasCampo: total.diasCampo + rtc.total.diasCampo,
                            reprogramados:
                                total.reprogramados + rtc.total.reprogramados,
                            cancelados: total.cancelados + rtc.total.cancelados,
                            demosObjetivo:
                                total.demosObjetivo + rtc.total.demosObjetivo,
                            diasCampoObjetivo:
                                total.diasCampoObjetivo +
                                rtc.total.diasCampoObjetivo,
                            cumplimientoCompletados: 0,
                            cumplimientoDiaCampo: 0,
                            cumplimiento: 0,
                        }),
                        macrozona.total
                    );

                    // Calcular promedios de Macrozona
                    const rtcCount = macrozona.retailers.length;
                    if (rtcCount > 0) {
                        macrozona.total.cumplimientoCompletados =
                            macrozona.retailers.reduce(
                                (sum, rtc) =>
                                    sum + rtc.total.cumplimientoCompletados,
                                0
                            ) / rtcCount;
                        macrozona.total.cumplimientoDiaCampo =
                            macrozona.retailers.reduce(
                                (sum, rtc) =>
                                    sum + rtc.total.cumplimientoDiaCampo,
                                0
                            ) / rtcCount;
                        macrozona.total.cumplimiento =
                            macrozona.retailers.reduce(
                                (sum, rtc) => sum + rtc.total.cumplimiento,
                                0
                            ) / rtcCount;
                    }

                    // Sumar totales a empresa
                    empresa.total.demoplots += macrozona.total.demoplots;
                    empresa.total.programados += macrozona.total.programados;
                    empresa.total.iniciados += macrozona.total.iniciados;
                    empresa.total.seguimiento += macrozona.total.seguimiento;
                    empresa.total.completados += macrozona.total.completados;
                    empresa.total.diasCampo += macrozona.total.diasCampo;
                    empresa.total.demosObjetivo +=
                        macrozona.total.demosObjetivo;
                    empresa.total.diasCampoObjetivo +=
                        macrozona.total.diasCampoObjetivo;
                });

                // Calcular promedios de Empresa
                const macrozonasCount = empresa.macroZonas.length;
                if (macrozonasCount > 0) {
                    empresa.total.cumplimientoCompletados =
                        empresa.macroZonas.reduce(
                            (sum, mz) => sum + mz.total.cumplimientoCompletados,
                            0
                        ) / macrozonasCount;
                    empresa.total.cumplimientoDiaCampo =
                        empresa.macroZonas.reduce(
                            (sum, mz) => sum + mz.total.cumplimientoDiaCampo,
                            0
                        ) / macrozonasCount;
                    empresa.total.cumplimiento =
                        empresa.macroZonas.reduce(
                            (sum, mz) => sum + mz.total.cumplimiento,
                            0
                        ) / macrozonasCount;
                }
            });

            // Ordenar generadores dentro de cada RTC
            Object.values(empresas).forEach((empresa) => {
                empresa.macroZonas.forEach((macrozona) => {
                    macrozona.retailers.forEach((rtc) => {
                        // Ordenar generadores por cumplimiento
                        rtc.generadores.sort(
                            (a, b) => b.cumplimiento - a.cumplimiento
                        );
                    });

                    // Ordenar retailers por cumplimiento promedio
                    macrozona.retailers.sort(
                        (a, b) => b.total.cumplimiento - a.total.cumplimiento
                    );
                });

                // Ordenar macrozonas por cumplimiento promedio
                empresa.macroZonas.sort(
                    (a, b) => b.total.cumplimiento - a.total.cumplimiento
                );
            });

            // Convertir a array y ordenar empresas por cumplimiento
            const empresasArray = Object.values(empresas);
            empresasArray.sort(
                (a, b) => b.total.cumplimiento - a.total.cumplimiento
            );

            return empresasArray;
            //return Object.values(empresas);
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
