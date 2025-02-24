import { getCurrentDate } from '../../config/time';
import { prisma } from '../../data/sqlserver';
import {
    CreateExternoDto,
    CustomError,
    PaginationDto,
    UpdateExternoDto,
} from '../../domain';

interface ExternoFilters {
    nombres?: string;
    apellidos?: string;
    cargo?: string;
    representada?: string;
}

export class ExternoService {
    async createExterno(createExternoDto: CreateExternoDto) {
        if (createExternoDto.idUsuario) {
            const usuarioExists = await prisma.usuario.findFirst({
                where: { id: createExternoDto.idUsuario },
            });
            if (!usuarioExists)
                throw CustomError.badRequest(`Usuario no existe`);

            const externoExists = await prisma.externo.findFirst({
                where: { idUsuario: createExternoDto.idUsuario },
            });
            if (externoExists)
                throw CustomError.badRequest(
                    `Externo con ese IdUsuario ya existe`
                );
        }

        try {
            const currentDate = getCurrentDate();
            const externo = await prisma.externo.create({
                data: {
                    cargo: createExternoDto.cargo,
                    idRepresentada: createExternoDto.idRepresentada,
                    idUsuario: createExternoDto.idUsuario,
                    createdAt: currentDate,
                    updatedAt: currentDate,
                },
            });

            return externo;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateExterno(updateExternoDto: UpdateExternoDto) {
        const externoExists = await prisma.externo.findFirst({
            where: { id: updateExternoDto.id },
        });
        if (!externoExists)
            throw CustomError.badRequest(
                `Externo with id ${updateExternoDto.id} does not exist`
            );

        try {
            const currentDate = getCurrentDate();
            const updatedExterno = await prisma.externo.update({
                where: { id: updateExternoDto.id },
                data: {
                    ...updateExternoDto.values,
                    updatedAt: currentDate,
                },
            });

            return updatedExterno;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getExternos(paginationDto: PaginationDto, filters: ExternoFilters) {
        const { page, limit } = paginationDto;
        const { nombres, apellidos, cargo, representada } = filters;

        try {
            const where: any = {};

            if (nombres || apellidos) {
                where.Usuario = {
                    ...(nombres && { nombres: { contains: nombres } }),
                    ...(apellidos && { apellidos: { contains: apellidos } }),
                };
            }

            if (cargo) {
                where.cargo = { contains: cargo };
            }

            if (representada) {
                where.Representada = {
                    nombre: { contains: representada },
                };
            }

            const [total, externos] = await Promise.all([
                prisma.externo.count({ where }),
                prisma.externo.findMany({
                    skip: (page - 1) * limit,
                    take: limit,
                    where,
                    include: {
                        Usuario: true,
                        Representada: true,
                    },
                }),
            ]);

            return {
                page,
                pages: Math.ceil(total / limit),
                limit,
                total,
                externos: externos.map((externo) => ({
                    id: externo.id,
                    cargo: externo.cargo,
                    idUsuario: externo.idUsuario,
                    idRepresentada: externo.idRepresentada,
                    nombres: externo.Usuario?.nombres,
                    apellidos: externo.Usuario?.apellidos,
                    representada: externo.Representada?.nombre,
                    createdAt: externo.createdAt,
                    updatedAt: externo.updatedAt,
                })),
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getAllExternos(filters: ExternoFilters) {
        const { nombres, apellidos, cargo, representada } = filters;

        try {
            const where: any = {};

            if (nombres || apellidos) {
                where.Usuario = {
                    ...(nombres && { nombres: { contains: nombres } }),
                    ...(apellidos && { apellidos: { contains: apellidos } }),
                };
            }

            if (cargo) {
                where.cargo = { contains: cargo };
            }

            if (representada) {
                where.Representada = {
                    nombre: { contains: representada },
                };
            }

            const externos = await prisma.externo.findMany({
                where,
                include: {
                    Usuario: true,
                    Representada: true,
                },
            });

            return externos.map((externo) => ({
                id: externo.id,
                cargo: externo.cargo,
                idUsuario: externo.idUsuario,
                idRepresentada: externo.idRepresentada,
                nombres: externo.Usuario?.nombres,
                apellidos: externo.Usuario?.apellidos,
                representada: externo.Representada?.nombre,
                createdAt: externo.createdAt,
                updatedAt: externo.updatedAt,
            }));
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getExternoById(id: number) {
        try {
            const externo = await prisma.externo.findUnique({
                where: { id },
                include: {
                    Usuario: true,
                    Representada: true,
                },
            });

            if (!externo)
                throw CustomError.badRequest(
                    `Externo with id ${id} does not exist`
                );

            return externo;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
