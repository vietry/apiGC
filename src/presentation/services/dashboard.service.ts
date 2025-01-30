import { prisma } from '../../data/sqlserver';
import { CustomError, GteRankingFilters, PaginationDto } from '../../domain';

import { DemoplotFilters } from './demoplot.service';

export class DashboardService {
    async getGteRankings(filters: GteRankingFilters = {}) {
        const {
            year,
            month,
            idColaborador,
            macrozona,
            empresa,
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
                where: gteWhere,
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

            // 4. Para agrupar demoplots, necesitamos filtrar SOLO por los GTEs obtenidos + estado + finalizacion
            // Obtenemos la lista de IDs de GTE filtrados
            const gteIds = gtes.map((g) => g.id);

            // Creamos "where" para la agrupación de demoplots
            const demoWhereCompletado: any = {
                estado: 'Completado',
                idGte: { in: gteIds },
            };
            const demoWhereDiaCampo: any = {
                estado: 'Día campo',
                idGte: { in: gteIds },
            };

            if (startDate && endDate) {
                demoWhereCompletado.finalizacion = {
                    gte: startDate,
                    lt: endDate,
                };
                demoWhereDiaCampo.finalizacion = {
                    gte: startDate,
                    lt: endDate,
                };
            }

            // 5. Agrupa los demoplots "Completado" y "Día campo"
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

            // 6. Diccionarios para conteo rápido
            const completedCountsByGteId: { [key: number]: number } = {};
            completedDemoplotCounts.forEach((item) => {
                completedCountsByGteId[item.idGte] = item._count.id;
            });

            const diaCampoCountsByGteId: { [key: number]: number } = {};
            diaCampoDemoplotCounts.forEach((item) => {
                diaCampoCountsByGteId[item.idGte] = item._count.id;
            });

            // 7. Armamos la lista final con la info de cada GTE filtrado
            const gteStats = gtes.map((gte) => {
                const completados = completedCountsByGteId[gte.id] || 0;
                const diasCampo = diaCampoCountsByGteId[gte.id] || 0;

                // Supongamos meta de 60 para completados y 4 para día de campo
                const cumplimientoCompletados = completados / 60;
                const cumplimientoDiaCampo = diasCampo / 4;
                const total = completados + diasCampo;
                const cumplimiento = total / 60;

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
                    completados,
                    diasCampo,
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
        const { year, month, idColaborador, macrozona, empresa, activo } =
            filters;
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
                where: gteWhere,
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
            let demoWhereCompletado: any = {
                estado: 'Completado',
                idGte: { in: gtes.map((g) => g.id) },
            };
            let demoWhereDiaCampo: any = {
                estado: 'Día campo',
                idGte: { in: gtes.map((g) => g.id) },
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
}
