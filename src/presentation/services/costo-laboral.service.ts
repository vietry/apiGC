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
}
