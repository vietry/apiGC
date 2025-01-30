import { prisma } from '../../data/sqlserver';
import {
    CreateVariablePersonalDto,
    UpdateVariablePersonalDto,
    PaginationDto,
    CustomError,
} from '../../domain';
import { getCurrentDate } from '../../config/time';
import { GteRankingFilters } from '../../domain/common/filters';
import { CreateDemoplotDto } from '../../domain/dtos/demoplot/create-demoplot.dto';

export class VariablePersonalService {
    async createVariablePersonal(
        createVariablePersonalDto: CreateVariablePersonalDto
    ) {
        const {
            variable,
            bono10,
            vidaLey,
            beneficio,
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

                        colaborador: variable.Gte.Colaborador?.id,
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
                where,
                orderBy: [{ year: 'desc' }, { month: 'desc' }],
                include: {
                    Gte: {
                        include: {
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

                    colaborador: variable.Gte.Colaborador?.id,
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
            });
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async generateVariablePersonal(idUsuario: number) {
        try {
            // Obtener GTEs activos
            const gtes = await prisma.gte.findMany({
                where: { activo: true },
                select: { id: true },
            });

            // Obtener fecha actual
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth() + 1;

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
                // Contar demoplots por estado
                const demoplots = await prisma.demoPlot.groupBy({
                    by: ['estado'],
                    where: {
                        idGte: gte.id,
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
                    _count: true,
                });

                const demoplotsCampo = await prisma.demoPlot.groupBy({
                    by: ['estado'],
                    where: {
                        idGte: gte.id,
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
                    _count: true,
                });

                // Calcular total
                const total = demoplots.reduce(
                    (acc, curr) => acc + curr._count,
                    0
                );
                const totalC = demoplotsCampo.reduce(
                    (acc, curr) => acc + curr._count,
                    0
                );

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

                // Calcular costoLaboral total
                const costoLaboralTotal = sueldo + viaticos + moto;
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
                if (total >= 30 && total <= 40) {
                    variableCompletado = total * conteo1;
                } else if (total > 40) {
                    variableCompletado = total * conteo2;
                }

                // Calcular variable campo según reglas
                let variableCampo = 0;
                if (totalC >= 4) {
                    variableCampo = totalC * diaCampo;
                }
                let variable = variableCompletado + variableCampo;

                // Calcular otros valores
                const bono10 = parseFloat((variable * 0.1).toFixed(2));
                const vidaLey = parseFloat((variable * 0.00715).toFixed(2));
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
            }));
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
