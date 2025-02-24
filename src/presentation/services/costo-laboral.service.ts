import { prisma } from '../../data/sqlserver';
import {
    CreateCostoLaboralDto,
    UpdateCostoLaboralDto,
    PaginationDto,
    CustomError,
} from '../../domain';
import { getCurrentDate } from '../../config/time';

export class CostoLaboralService {
    async createCostoLaboral(createCostoLaboralDto: CreateCostoLaboralDto) {
        const {
            conteo1,
            conteo2,
            diacampo,
            sueldo,
            viaticos,
            moto,
            linea,
            celular,
            servGte,
            year,
            month,
            createdBy,
        } = createCostoLaboralDto;

        try {
            const currentDate = getCurrentDate();
            const costoLaboral = await prisma.costoLaboral.create({
                data: {
                    conteo1,
                    conteo2,
                    diacampo,
                    sueldo,
                    viaticos,
                    moto,
                    linea,
                    celular,
                    servGte,
                    year,
                    month,
                    createdAt: currentDate,
                    createdBy,
                    updatedAt: currentDate,
                    updatedBy: createdBy,
                },
            });

            return costoLaboral;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateCostoLaboral(updateCostoLaboralDto: UpdateCostoLaboralDto) {
        const { id, values } = updateCostoLaboralDto;
        const currentDate = getCurrentDate();

        const costoLaboralExists = await prisma.costoLaboral.findUnique({
            where: { id },
        });

        if (!costoLaboralExists) {
            throw CustomError.badRequest(
                `CostoLaboral with id ${id} does not exist`
            );
        }

        try {
            const updatedCostoLaboral = await prisma.costoLaboral.update({
                where: { id },
                data: {
                    ...values,
                    updatedAt: currentDate,
                },
            });

            return updatedCostoLaboral;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getCostosLaborales(paginationDto: PaginationDto, filters: any) {
        const { page, limit } = paginationDto;
        const { year, month } = filters;

        try {
            const where: any = {};

            if (year && month) {
                where.year = year;
                where.month = month;
            } else if (year) {
                where.year = year;
            }

            const [total, costosLaborales] = await Promise.all([
                prisma.costoLaboral.count({ where }),
                prisma.costoLaboral.findMany({
                    skip: (page - 1) * limit,
                    take: limit,
                    where,
                    //orderBy: [{ year: 'desc' }, { month: 'desc' }],
                    orderBy: [{ id: 'asc' }],
                }),
            ]);

            return {
                page,
                pages: Math.ceil(total / limit),
                limit,
                total,
                costosLaborales,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getCostoLaboralById(id: number) {
        try {
            const costoLaboral = await prisma.costoLaboral.findUnique({
                where: { id },
            });

            if (!costoLaboral) {
                throw CustomError.badRequest(
                    `CostoLaboral with id ${id} does not exist`
                );
            }

            return costoLaboral;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getAllCostosLaborales(filters: any) {
        const { year, month } = filters;

        try {
            const where: any = {};
            if (year) where.year = year;
            if (month) where.month = month;

            return await prisma.costoLaboral.findMany({
                where,
                orderBy: [{ year: 'desc' }, { month: 'desc' }],
            });
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async generateMissingCostosLaborales(idUsuario: number) {
        try {
            const currentYear = new Date().getFullYear();

            // Obtener registros existentes del año actual
            const existingCostos = await prisma.costoLaboral.findMany({
                where: { year: currentYear },
                select: { month: true },
            });

            const existingMonths = new Set(existingCostos.map((c) => c.month));
            const missingMonths: number[] = [];

            // Determinar meses faltantes (1-12)
            for (let month = 1; month <= 12; month++) {
                if (!existingMonths.has(month)) {
                    missingMonths.push(month);
                }
            }

            // Valores por defecto
            const defaultValues = {
                conteo1: 10,
                conteo2: 15,
                diacampo: 75,
                sueldo: 2000,
                viaticos: 550,
                moto: 250,
                linea: 40,
                celular: 40,
                servGte: 400,
            };

            // Crear registros faltantes
            const createdCostos = await Promise.all(
                missingMonths.map((month) =>
                    prisma.costoLaboral.create({
                        data: {
                            ...defaultValues,
                            year: currentYear,
                            month,
                            createdBy: idUsuario,
                            updatedBy: idUsuario,
                            createdAt: getCurrentDate(),
                            updatedAt: getCurrentDate(),
                        },
                    })
                )
            );

            return {
                message: `Se crearon ${createdCostos.length} registros de costos laborales`,
                created: createdCostos,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
