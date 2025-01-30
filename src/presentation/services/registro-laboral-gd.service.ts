import { prisma } from '../../data/sqlserver';
import {
    CreateRegistroLaboralDto,
    UpdateRegistroLaboralDto,
    PaginationDto,
    CustomError,
} from '../../domain';
import { getCurrentDate } from '../../config/time';
import { RegistroLaboralFilters } from '../../domain/common/filters';

export class RegistroLaboralGdService {
    // Crear un nuevo registro laboral
    async createRegistroLaboral(
        createRegistroLaboralDto: CreateRegistroLaboralDto
    ) {
        const { idGte, ingreso, cese, createdBy } = createRegistroLaboralDto;

        const gteExists = await prisma.gte.findUnique({ where: { id: idGte } });
        if (!gteExists)
            throw CustomError.badRequest(`Gte with id ${idGte} does not exist`);

        try {
            const currentDate = getCurrentDate();
            const registroLaboral = await prisma.registroLaboralGD.create({
                data: {
                    idGte,
                    ingreso,
                    cese,
                    createdAt: currentDate,
                    createdBy: createdBy,
                    updatedAt: currentDate,
                    updatedBy: createdBy,
                },
            });

            return {
                id: registroLaboral.id,
                idGte: registroLaboral.idGte,
                ingreso: registroLaboral.ingreso,
                cese: registroLaboral.cese,
                createdAt: registroLaboral.createdAt,
                createdBy: registroLaboral.createdBy,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    // Actualizar un registro laboral existente
    async updateRegistroLaboral(
        updateRegistroLaboralDto: UpdateRegistroLaboralDto
    ) {
        const { id, values } = updateRegistroLaboralDto;
        const currentDate = getCurrentDate();

        const registroLaboralExists = await prisma.registroLaboralGD.findUnique(
            { where: { id } }
        );
        if (!registroLaboralExists)
            throw CustomError.badRequest(
                `RegistroLaboral with id ${id} does not exist`
            );

        try {
            const updatedRegistroLaboral =
                await prisma.registroLaboralGD.update({
                    where: { id },
                    data: {
                        ...values,
                        updatedAt: currentDate,
                        updatedBy: values.updatedBy,
                    },
                });

            return updatedRegistroLaboral;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    // Obtener registros laborales con paginación y filtros
    async getRegistrosLaborales(
        paginationDto: PaginationDto,
        filters: RegistroLaboralFilters
    ) {
        const { page, limit } = paginationDto;
        const { idGte, yearIngreso, monthIngreso, yearCese, monthCese } =
            filters;

        try {
            const where: any = {};

            if (idGte) {
                where.idGte = idGte;
            }

            if (yearIngreso && monthIngreso) {
                where.ingreso = {
                    gte: new Date(yearIngreso, monthIngreso - 1, 1),
                    lt: new Date(yearIngreso, monthIngreso, 1),
                };
            } else if (yearIngreso) {
                where.ingreso = {
                    gte: new Date(yearIngreso, 0, 1),
                    lt: new Date(yearIngreso + 1, 0, 1),
                };
            }

            if (yearCese && monthCese) {
                where.cese = {
                    gte: new Date(yearCese, monthCese - 1, 1),
                    lt: new Date(yearCese, monthCese, 1),
                };
            } else if (yearCese) {
                where.cese = {
                    gte: new Date(yearCese, 0, 1),
                    lt: new Date(yearCese + 1, 0, 1),
                };
            }

            const [total, registrosLaborales] = await Promise.all([
                prisma.registroLaboralGD.count({ where }),
                prisma.registroLaboralGD.findMany({
                    skip: (page - 1) * limit,
                    take: limit,
                    where,
                    orderBy: {
                        ingreso: 'desc',
                    },
                }),
            ]);

            return {
                page,
                pages: Math.ceil(total / limit),
                limit,
                total,
                registrosLaborales,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getRegistrosLaboralesAll(filters: any) {
        const { idGte, ingreso, cese } = filters;

        try {
            const where: any = {};
            if (idGte) where.idGte = idGte;
            if (ingreso) where.ingreso = ingreso;
            if (cese) where.cese = cese;

            const registrosLaborales = await prisma.registroLaboralGD.findMany({
                where,
            });

            return registrosLaborales.map((registro) => ({
                id: registro.id,
                ingreso: registro.ingreso,
                cese: registro.cese,
                idGte: registro.idGte,
                createdAt: registro.createdAt,
                updatedAt: registro.updatedAt,
            }));
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    // Obtener un registro laboral por ID
    async getRegistroLaboralById(id: number) {
        try {
            const registroLaboral = await prisma.registroLaboralGD.findUnique({
                where: { id },
            });
            if (!registroLaboral)
                throw CustomError.badRequest(
                    `RegistroLaboral with id ${id} does not exist`
                );

            return registroLaboral;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
