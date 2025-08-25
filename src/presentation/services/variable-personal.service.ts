import { prisma } from '../../data/sqlserver';
import {
    CreateVariablePersonalDto,
    UpdateVariablePersonalDto,
    PaginationDto,
    CustomError,
} from '../../domain';
import { getCurrentDate } from '../../config/time';
import { GteRankingFilters } from '../../domain/common/filters';
import { Empresa } from '../../domain/entities/dashboard/variables_jerarquia.entity';

export class VariablePersonalService {
    async createVariablePersonal(
        createVariablePersonalDto: CreateVariablePersonalDto
    ) {
        const {
            variable,
            bono10,
            vidaLey,
            beneficio,
            sctr,
            total,
            year,
            month,
            idGte,
            createdBy,
        } = createVariablePersonalDto;

        const gteExists = await prisma.gte.findUnique({ where: { id: idGte } });
        if (!gteExists) {
            throw CustomError.badRequest(`Gte with id ${idGte} does not exist`);
        }

        try {
            const currentDate = getCurrentDate();
            return await prisma.variablePersonal.create({
                data: {
                    variable,
                    bono10,
                    vidaLey,
                    beneficio,
                    sctr,
                    total,
                    year,
                    month,
                    idGte,
                    createdAt: currentDate,
                    createdBy,
                    updatedAt: currentDate,
                    updatedBy: createdBy,
                },
            });
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateVariablePersonal(
        updateVariablePersonalDto: UpdateVariablePersonalDto
    ) {
        const { id, values } = updateVariablePersonalDto;
        const currentDate = getCurrentDate();

        const variablePersonalExists = await prisma.variablePersonal.findUnique(
            {
                where: { id },
            }
        );

        if (!variablePersonalExists) {
            throw CustomError.badRequest(
                `VariablePersonal with id ${id} does not exist`
            );
        }

        try {
            return await prisma.variablePersonal.update({
                where: { id },
                data: {
                    ...values,
                    updatedAt: currentDate,
                },
            });
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getVariablesPersonales(
        paginationDto: PaginationDto,
        filters: GteRankingFilters = {}
    ) {
        const { page, limit } = paginationDto;

        try {
            const where: any = {};
            if (filters.idGte) where.idGte = filters.idGte;
            if (filters.year) where.year = filters.year;
            if (filters.month) where.month = filters.month;
            if (
                filters.empresa ||
                filters.macrozona ||
                filters.idColaborador ||
                filters.activo !== undefined
            ) {
                where.Gte = {
                    ...(filters.activo !== undefined && {
                        activo: filters.activo,
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

            const [total, variables] = await Promise.all([
                prisma.variablePersonal.count({ where }),
                prisma.variablePersonal.findMany({
                    skip: (page - 1) * limit,
                    take: limit,
                    where,
                    orderBy: [{ id: 'asc' }],
                    include: {
                        Gte: {
                            include: {
                                Usuario: true,
                                Colaborador: {
                                    include: {
                                        ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador:
                                            {
                                                include: {
                                                    SuperZona: true,
                                                },
                                            },
                                        ZonaAnterior: {
                                            include: {
                                                Empresa: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                }),
            ]);

            const costoLaboral = await prisma.costoLaboral.findFirst({
                where: {
                    year: filters.year,
                    month: filters.month,
                },
            });

            if (!costoLaboral) {
                throw CustomError.badRequest(
                    `No existe configuración de costos laborales para ${filters.month}/${filters.year}`
                );
            }

            const sueldo = Number(costoLaboral.sueldo) || 0;
            const viaticos = Number(costoLaboral.viaticos) || 0;
            const moto = Number(costoLaboral.moto) || 0;

            // Calcular costoLaboral total
            const costoLaboralTotal = sueldo + viaticos + moto;

            return {
                page,
                pages: Math.ceil(total / limit),
                limit,
                total,

                variables: variables.map((variable) => {
                    const macrozona =
                        variable.Gte.Colaborador
                            ?.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador?.[0]
                            ?.SuperZona?.id ?? null;

                    return {
                        id: variable.id,
                        variable: variable.variable
                            ? Number(variable.variable)
                            : 0,
                        bono10: variable.bono10 ? Number(variable.bono10) : 0,
                        vidaLey: variable.vidaLey
                            ? Number(variable.vidaLey)
                            : 0,
                        beneficio: variable.beneficio
                            ? Number(variable.beneficio)
                            : null,
                        total: variable.total ? Number(variable.total) : 0,
                        year: variable.year,
                        month: variable.month,
                        idGte: variable.idGte,
                        nombreGte: `${variable.Gte.Usuario?.nombres} ${variable.Gte.Usuario?.apellidos}`,
                        idColaborador: variable.Gte.Colaborador?.id,
                        empresa:
                            variable.Gte.Colaborador?.ZonaAnterior?.Empresa
                                .nomEmpresa,
                        macrozona,
                        costoLaboral: costoLaboralTotal || 0,
                        createdBy: variable.createdBy,
                        updatedBy: variable.updatedBy,
                        createdAt: variable.createdAt,
                        updatedAt: variable.updatedAt,
                    };
                }),
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getVariablePersonalById(id: number) {
        try {
            const variablePersonal = await prisma.variablePersonal.findUnique({
                where: { id },
            });

            if (!variablePersonal) {
                throw CustomError.badRequest(
                    `VariablePersonal with id ${id} does not exist`
                );
            }

            return variablePersonal;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getAllVariablesPersonales(filters: GteRankingFilters = {}) {
        try {
            const where: any = {};
            if (filters.idGte) where.idGte = filters.idGte;
            if (filters.year) where.year = filters.year;
            if (filters.month) where.month = filters.month;
            if (
                filters.empresa ||
                filters.macrozona ||
                filters.idColaborador ||
                filters.activo !== undefined
            ) {
                where.Gte = {
                    ...(filters.activo !== undefined && {
                        activo: filters.activo,
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

            const variables = await prisma.variablePersonal.findMany({
                where: {
                    NOT: {
                        Gte: {
                            id: 1125, // GTE de pruebas
                        },
                    },
                    ...where,
                },
                orderBy: [{ year: 'desc' }, { month: 'desc' }],

                include: {
                    Gte: {
                        include: {
                            Usuario: true,
                            Colaborador: {
                                include: {
                                    ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador:
                                        {
                                            include: {
                                                SuperZona: true,
                                            },
                                        },
                                    ZonaAnterior: {
                                        include: {
                                            Empresa: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });

            const costoLaboral = await prisma.costoLaboral.findFirst({
                where: {
                    year: filters.year,
                    month: filters.month,
                },
            });

            if (!costoLaboral) {
                throw CustomError.badRequest(
                    `No existe configuración de costos laborales para ${filters.month}/${filters.year}`
                );
            }

            const sueldo = Number(costoLaboral.sueldo) || 0;
            const viaticos = Number(costoLaboral.viaticos) || 0;
            const moto = Number(costoLaboral.moto) || 0;

            // Calcular costoLaboral total
            const costoLaboralTotal = sueldo + viaticos + moto;

            let demoplotWhere: any = {
                idGte: { in: variables.map((v) => v.idGte) },
            };

            if (filters.year && filters.month) {
                const year = filters.year;
                const month = filters.month;
                const previousMonth = month === 1 ? 12 : month - 1;
                const previousYear = month === 1 ? year - 1 : year;

                // Rango 1-19 del mes actual y 20-fin del mes anterior
                demoplotWhere.OR = [
                    {
                        updatedAt: {
                            gte: new Date(year, month - 1, 1),
                            lt: new Date(year, month - 1, 20),
                        },
                    },
                    {
                        updatedAt: {
                            gte: new Date(previousYear, previousMonth - 1, 20),
                            lt: new Date(year, month - 1, 1),
                        },
                    },
                ];
            }

            // Obtener conteos por GTE
            const [completadosCount, diaCampoCount] = await Promise.all([
                prisma.demoPlot.groupBy({
                    by: ['idGte'],
                    where: {
                        ...demoplotWhere,
                        validacion: true,
                        checkJefe: true,
                        NOT: {
                            AND: [
                                { updatedAt: { gte: new Date('2024-01-01') } },
                                { updatedAt: { lt: new Date('2025-01-01') } },
                            ],
                        },
                        estado: 'Completado',
                    },
                    _count: { id: true },
                }),
                prisma.demoPlot.groupBy({
                    by: ['idGte'],
                    where: {
                        ...demoplotWhere,
                        validacion: true,
                        checkJefe: true,
                        NOT: {
                            AND: [
                                { updatedAt: { gte: new Date('2024-01-01') } },
                                { updatedAt: { lt: new Date('2025-01-01') } },
                            ],
                        },
                        estado: 'Día campo',
                    },
                    _count: { id: true },
                }),
            ]);

            // Crear diccionarios para búsqueda rápida
            const completadosPorGte: Record<number, number> = {};
            const diaCampoPorGte: Record<number, number> = {};

            completadosCount.forEach((count) => {
                completadosPorGte[count.idGte] = count._count.id;
            });
            diaCampoCount.forEach((count) => {
                diaCampoPorGte[count.idGte] = count._count.id;
            });

            return variables.map((variable) => {
                const macrozona =
                    variable.Gte.Colaborador
                        ?.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador?.[0]
                        ?.SuperZona?.id ?? null;

                return {
                    id: variable.id,
                    variable: variable.variable ? Number(variable.variable) : 0,
                    bono10: variable.bono10 ? Number(variable.bono10) : 0,
                    vidaLey: variable.vidaLey ? Number(variable.vidaLey) : 0,
                    beneficio: variable.beneficio
                        ? Number(variable.beneficio)
                        : null,
                    total: variable.total ? Number(variable.total) : 0,
                    year: variable.year,
                    month: variable.month,
                    idGte: variable.idGte,
                    nombreGte: `${variable.Gte.Usuario?.apellidos}, ${variable.Gte.Usuario?.nombres}`,
                    idColaborador: variable.Gte.Colaborador?.id,
                    zonaanterior:
                        variable.Gte.Colaborador?.ZonaAnterior?.nombre?.trim(),
                    empresa:
                        variable.Gte.Colaborador?.ZonaAnterior?.Empresa
                            .nomEmpresa,
                    macrozona,
                    costoLaboral: costoLaboralTotal || 0,
                    completados: completadosPorGte[variable.idGte] || 0,
                    diasCampo: diaCampoPorGte[variable.idGte] || 0,
                    createdBy: variable.createdBy,
                    updatedBy: variable.updatedBy,
                    createdAt: variable.createdAt,
                    updatedAt: variable.updatedAt,
                };
            });
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    getFamilyClasses(gteType: string): string[] {
        switch (gteType.toUpperCase()) {
            case 'TQC':
                return ['BIOGEN', 'TQC', 'SUMITOMO'];
            case 'SYNGENTA':
                return ['SYNGENTA'];
            case 'BIOGEN':
                return ['BIOGEN'];
            case 'TALEX':
                return ['TALEX', 'SYNGENTA'];
            case 'UPL':
                return ['UPL'];
            default:
                return [];
        }
    }

    async generateVariablePersonal(
        idUsuario: number,
        year?: number,
        month?: number
    ) {
        try {
            // Obtener GTEs activos
            const gtes = await prisma.gte.findMany({
                where: { activo: true },
                select: { id: true, tipo: true },
            });

            // Obtener fecha actual
            const now = new Date();
            const currentYear = year ?? now.getFullYear();
            const currentMonth = month ?? now.getMonth() + 1;

            // Calcular mes anterior
            const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
            const previousYear =
                currentMonth === 1 ? currentYear - 1 : currentYear;

            // Fechas para el mes actual (1-19)
            const currentMonthStart = new Date(
                currentYear,
                currentMonth - 1,
                1
            );
            const currentMonthEnd = new Date(currentYear, currentMonth - 1, 20);

            // Fechas para el mes anterior (20-fin)
            const previousMonthStart = new Date(
                previousYear,
                previousMonth - 1,
                20
            );
            const previousMonthEnd = new Date(currentYear, currentMonth - 1, 1);

            const createdVariables = [];

            for (const gte of gtes) {
                // Construir condición adicional por tipo de gte
                const familyCondition =
                    gte.tipo && this.getFamilyClasses(gte.tipo).length > 0
                        ? {
                              Familia: {
                                  clase: {
                                      in: this.getFamilyClasses(gte.tipo),
                                  },
                              },
                          }
                        : {};

                // Contar demoplots (total)
                const total = await prisma.demoPlot.count({
                    where: {
                        idGte: gte.id,
                        validacion: true,
                        checkJefe: true,
                        NOT: {
                            AND: [
                                { updatedAt: { gte: new Date('2024-01-01') } },
                                { updatedAt: { lt: new Date('2025-01-01') } },
                            ],
                        },
                        OR: [
                            {
                                updatedAt: {
                                    gte: currentMonthStart,
                                    lt: currentMonthEnd,
                                },
                                estado: { in: ['Completado', 'Día campo'] },
                            },
                            {
                                updatedAt: {
                                    gte: previousMonthStart,
                                    lt: previousMonthEnd,
                                },
                                estado: { in: ['Completado', 'Día campo'] },
                            },
                        ],
                    },
                });

                // Contar demoplots con tipo gte y clase familia
                const tipoTotal = await prisma.demoPlot.count({
                    where: {
                        idGte: gte.id,
                        ...familyCondition,
                        validacion: true,
                        checkJefe: true,
                        NOT: {
                            AND: [
                                { updatedAt: { gte: new Date('2024-01-01') } },
                                { updatedAt: { lt: new Date('2025-01-01') } },
                            ],
                        },
                        OR: [
                            {
                                updatedAt: {
                                    gte: currentMonthStart,
                                    lt: currentMonthEnd,
                                },
                                estado: { in: ['Completado', 'Día campo'] },
                            },
                            {
                                updatedAt: {
                                    gte: previousMonthStart,
                                    lt: previousMonthEnd,
                                },
                                estado: { in: ['Completado', 'Día campo'] },
                            },
                        ],
                    },
                });

                // Contar demoplots solo en estado "Día campo"
                const totalC = await prisma.demoPlot.count({
                    where: {
                        idGte: gte.id,
                        validacion: true,
                        checkJefe: true,
                        NOT: {
                            AND: [
                                { updatedAt: { gte: new Date('2024-01-01') } },
                                { updatedAt: { lt: new Date('2025-01-01') } },
                            ],
                        },
                        OR: [
                            {
                                updatedAt: {
                                    gte: currentMonthStart,
                                    lt: currentMonthEnd,
                                },
                                estado: { in: ['Día campo'] },
                            },
                            {
                                updatedAt: {
                                    gte: previousMonthStart,
                                    lt: previousMonthEnd,
                                },
                                estado: { in: ['Día campo'] },
                            },
                        ],
                    },
                });

                const demosCampoMesAct = await prisma.demoPlot.count({
                    where: {
                        idGte: gte.id,
                        estado: 'Día campo',
                        validacion: true,
                        checkJefe: true,
                        NOT: {
                            AND: [
                                { updatedAt: { gte: new Date('2024-01-01') } },
                                { updatedAt: { lt: new Date('2025-01-01') } },
                            ],
                        },
                        finalizacion: {
                            gte: currentMonthStart,
                            lt: currentMonthEnd,
                        },
                        presentacion: {
                            gte: currentMonthStart,
                            lt: currentMonthEnd,
                        },
                    },
                });

                const totalCMesAnt = totalC - demosCampoMesAct;
                const totalD = total - totalCMesAnt;

                const costoLaboral = await prisma.costoLaboral.findFirst({
                    where: {
                        year: currentYear,
                        month: currentMonth,
                    },
                });

                if (!costoLaboral) {
                    throw CustomError.badRequest(
                        `No existe configuración de costos laborales para ${currentMonth}/${currentYear}`
                    );
                }

                const sueldo = Number(costoLaboral.sueldo) || 0;
                const viaticos = Number(costoLaboral.viaticos) || 0;
                const moto = Number(costoLaboral.moto) || 0;
                const linea = Number(costoLaboral.linea) || 0;
                const celular = Number(costoLaboral.celular) || 0;
                const servGte = Number(costoLaboral.servGte) || 0;

                // Calcular costoLaboral total
                const costoLaboralTotal =
                    sueldo + viaticos + moto + linea + celular;
                const conteo1 = Number(costoLaboral.conteo1) || 0;
                const conteo2 = Number(costoLaboral.conteo2) || 0;
                const diaCampo = Number(costoLaboral.diacampo) || 0;

                const existingVariable =
                    await prisma.variablePersonal.findUnique({
                        where: {
                            idGte_year_month: {
                                idGte: gte.id,
                                year: currentYear,
                                month: currentMonth,
                            },
                        },
                    });

                // Calcular variable según reglas
                let variableCompletado = 0;
                let variableCampo = 0;
                if (tipoTotal >= 30) {
                    if (totalD <= 40) {
                        variableCompletado = total * conteo1;
                    } else {
                        variableCompletado =
                            40 * conteo1 + (totalD - 40) * conteo2;
                    }

                    // Calcular variableCampo solo si total >= 30
                    if (totalC >= 1) {
                        variableCampo = totalC * diaCampo;
                    }
                }
                let variable = variableCompletado + variableCampo;

                const carga10 = 0.1;
                const vida = 0.0065;
                const sctr = 0.015;
                //COSTOS FIJOS
                const totalCostoFijo =
                    sueldo * (1 + carga10 + vida + sctr) +
                    viaticos +
                    moto +
                    servGte;

                // Calcular otros valores
                const bono10 = parseFloat((variable * carga10).toFixed(2));
                const vidaLey = parseFloat((variable * vida).toFixed(2));
                // Manejar el beneficio de forma segura
                const beneficio = existingVariable?.beneficio
                    ? parseFloat(existingVariable.beneficio.toString())
                    : null;
                const totalVariable = parseFloat(
                    (variable + bono10 + vidaLey + (beneficio ?? 0)).toFixed(2)
                );

                // Crear o actualizar registro con upsert
                const createdVariable = await prisma.variablePersonal.upsert({
                    where: {
                        idGte_year_month: {
                            idGte: gte.id,
                            year: currentYear,
                            month: currentMonth,
                        },
                    },
                    update: {
                        variable,
                        bono10,
                        vidaLey,
                        beneficio,
                        total: totalVariable,
                        updatedBy: idUsuario,
                        updatedAt: getCurrentDate(),
                    },
                    create: {
                        variable,
                        bono10,
                        vidaLey,
                        beneficio,
                        total: totalVariable,
                        year: currentYear,
                        month: currentMonth,
                        idGte: gte.id,
                        createdBy: idUsuario,
                        updatedBy: idUsuario,
                        createdAt: getCurrentDate(),
                        updatedAt: getCurrentDate(),
                    },
                });

                createdVariables.push({
                    ...createdVariable,
                    costoLaboral: costoLaboralTotal,
                    totalCostoFijo,
                });
            }

            return createdVariables.map((variable) => ({
                ...variable,
                variable: variable.variable ? Number(variable.variable) : 0,
                bono10: variable.bono10 ? Number(variable.bono10) : 0,
                vidaLey: variable.vidaLey ? Number(variable.vidaLey) : 0,
                beneficio: variable.beneficio
                    ? Number(variable.beneficio)
                    : null,
                total: variable.total ? Number(variable.total) : 0,
                costoLaboral: variable.costoLaboral || 0,
                totalCostoFijo: variable.totalCostoFijo || 0,
            }));
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getJerarquiaVariables(filters: GteRankingFilters = {}) {
        try {
            const variablesStats = await this.getAllVariablesPersonales(
                filters
            );
            const empresas: { [key: string]: Empresa } = {};

            variablesStats.forEach((variable) => {
                const empresaName = variable.empresa ?? 'Sin Empresa';
                const macrozonaId =
                    variable.macrozona?.toString() ?? 'Sin Macrozona';
                const rtcId = variable.idColaborador?.toString() ?? 'Sin RTC';
                const zona = variable.zonaanterior?.toString() ?? 'Sin Zona';

                if (!empresas[empresaName]) {
                    empresas[empresaName] = {
                        id: empresaName,
                        name: empresaName,
                        macroZonas: [],
                        total: {
                            demoplots: 0,
                            completados: 0,
                            diasCampo: 0,
                            variable: 0,
                            bono10: 0,
                            vidaLey: 0,
                            beneficio: 0,
                            total: 0,
                            costoLaboral: 0,
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
                            completados: 0,
                            diasCampo: 0,
                            variable: 0,
                            bono10: 0,
                            vidaLey: 0,
                            beneficio: 0,
                            total: 0,
                            costoLaboral: 0,
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
                            completados: 0,
                            diasCampo: 0,
                            variable: 0,
                            bono10: 0,
                            vidaLey: 0,
                            beneficio: 0,
                            total: 0,
                            costoLaboral: 0,
                        },
                    };
                    macrozona.retailers.push(rtc);
                }

                rtc.generadores.push({
                    id: variable.idGte.toString(),
                    nombres: variable.nombreGte,
                    demoplots: 0,
                    completados: variable.completados,
                    diasCampo: variable.diasCampo,
                    variable: variable.variable,
                    bono10: variable.bono10,
                    vidaLey: variable.vidaLey,
                    beneficio: variable.beneficio ?? 0,
                    total: variable.total,
                    costoLaboral: variable.costoLaboral,
                });
            });

            Object.values(empresas).forEach((empresa) => {
                empresa.macroZonas.forEach((macrozona) => {
                    macrozona.retailers.forEach((rtc) => {
                        // Calcular totales de RTC
                        rtc.total = rtc.generadores.reduce(
                            (total, gte) => ({
                                demoplots: total.demoplots + gte.demoplots,
                                completados:
                                    total.completados + gte.completados,
                                diasCampo: total.diasCampo + gte.diasCampo,
                                variable: total.variable + gte.variable,
                                bono10: total.bono10 + gte.bono10,
                                vidaLey: total.vidaLey + gte.vidaLey,
                                beneficio: total.beneficio + gte.beneficio,
                                total: total.total + gte.total,
                                costoLaboral:
                                    total.costoLaboral + gte.costoLaboral,
                            }),
                            {
                                demoplots: 0,
                                completados: 0,
                                diasCampo: 0,
                                variable: 0,
                                bono10: 0,
                                vidaLey: 0,
                                beneficio: 0,
                                total: 0,
                                costoLaboral: 0,
                            }
                        );
                    });

                    // Calcular totales de Macrozona
                    macrozona.total = macrozona.retailers.reduce(
                        (total, rtc) => ({
                            demoplots: total.demoplots + rtc.total.demoplots,
                            completados:
                                total.completados + rtc.total.completados,
                            diasCampo: total.diasCampo + rtc.total.diasCampo,
                            variable: total.variable + rtc.total.variable,
                            bono10: total.bono10 + rtc.total.bono10,
                            vidaLey: total.vidaLey + rtc.total.vidaLey,
                            beneficio: total.beneficio + rtc.total.beneficio,
                            total: total.total + rtc.total.total,
                            costoLaboral:
                                total.costoLaboral + rtc.total.costoLaboral,
                        }),
                        macrozona.total
                    );

                    // Sumar totales a empresa
                    empresa.total.demoplots += macrozona.total.demoplots;
                    empresa.total.completados += macrozona.total.completados;
                    empresa.total.diasCampo += macrozona.total.diasCampo;
                    empresa.total.variable += macrozona.total.variable;
                    empresa.total.bono10 += macrozona.total.bono10;
                    empresa.total.vidaLey += macrozona.total.vidaLey;
                    empresa.total.beneficio += macrozona.total.beneficio;
                    empresa.total.total += macrozona.total.total;
                    empresa.total.costoLaboral += macrozona.total.costoLaboral;
                });
            });

            return Object.values(empresas);
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
