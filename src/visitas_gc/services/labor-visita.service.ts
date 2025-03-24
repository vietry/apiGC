import { getCurrentDate } from '../../config/time';
import { prisma } from '../../data/sqlserver';
import { CustomError } from '../../domain';
import { CreateLaborVisitaDto } from '../dtos/create-labor-visita.dto';
import { UpdateLaborVisitaDto } from '../dtos/update-labor-visita.dto';

export class LaborVisitaService {
    async createLaborVisita(createLaborVisitaDto: CreateLaborVisitaDto) {
        const { idVisita, idSubLabor, idRepresentada } = createLaborVisitaDto;

        // Verificar que la visita exista
        const visitaExists = await prisma.visita.findUnique({
            where: { id: idVisita },
        });
        if (!visitaExists)
            throw CustomError.badRequest(
                `Visita with id ${idVisita} does not exist`
            );

        // Verificar que la subLabor exista
        const subLaborExists = await prisma.subLabor.findUnique({
            where: { id: idSubLabor },
        });
        if (!subLaborExists)
            throw CustomError.badRequest(
                `SubLabor with id ${idSubLabor} does not exist`
            );

        const currentDate = getCurrentDate();

        try {
            const laborVisita = await prisma.laborVisita.create({
                data: {
                    idVisita,
                    idSubLabor,
                    idRepresentada,
                    createdAt: currentDate,
                    updatedAt: currentDate,
                },
                include: {
                    Visita: true,
                    SubLabor: {
                        include: {
                            Labor: true,
                        },
                    },
                    Representada: true,
                },
            });

            return laborVisita;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateLaborVisita(updateLaborVisitaDto: UpdateLaborVisitaDto) {
        const currentDate = getCurrentDate();
        const laborVisitaExists = await prisma.laborVisita.findUnique({
            where: { id: updateLaborVisitaDto.id },
        });

        if (!laborVisitaExists)
            throw CustomError.badRequest(
                `LaborVisita with id ${updateLaborVisitaDto.id} does not exist`
            );

        try {
            const updatedLaborVisita = await prisma.laborVisita.update({
                where: { id: updateLaborVisitaDto.id },
                data: {
                    ...updateLaborVisitaDto.values,
                    updatedAt: currentDate,
                },
                include: {
                    Visita: true,
                    SubLabor: {
                        include: {
                            Labor: true,
                        },
                    },
                    Representada: true,
                },
            });

            return updatedLaborVisita;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getLaborVisitaById(id: number) {
        try {
            const laborVisita = await prisma.laborVisita.findUnique({
                where: { id },
                include: {
                    Visita: true,
                    SubLabor: {
                        include: {
                            Labor: true,
                        },
                    },
                    Representada: true,
                },
            });

            if (!laborVisita)
                throw CustomError.badRequest(
                    `LaborVisita with id ${id} does not exist`
                );

            return {
                id: laborVisita.id,
                idVisita: laborVisita.Visita.id,
                idSubLabor: laborVisita.idSubLabor,
                subLabor: laborVisita.SubLabor.nombre,
                idLabor: laborVisita.SubLabor.idLabor,
                labor: laborVisita.SubLabor.Labor.nombre,
                idRepresentada: laborVisita.idRepresentada,
                representada: laborVisita.Representada?.nombre,
                createdAt: laborVisita.createdAt,
                updatedAt: laborVisita.updatedAt,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getLaborVisitasByVisitaId(idVisita: number) {
        try {
            const laborVisitas = await prisma.laborVisita.findMany({
                where: { idVisita },
                include: {
                    SubLabor: {
                        include: {
                            Labor: true,
                        },
                    },
                    Representada: true,
                },
                orderBy: { createdAt: 'desc' },
            });

            return laborVisitas.map((laborVisita) => {
                return {
                    id: laborVisita.id,
                    idVisita: laborVisita.idVisita,
                    idSubLabor: laborVisita.idSubLabor,
                    subLabor: laborVisita.SubLabor.nombre,
                    idLabor: laborVisita.SubLabor.idLabor,
                    labor: laborVisita.SubLabor.Labor.nombre,
                    idRepresentada: laborVisita.idRepresentada,
                    representada: laborVisita.Representada?.nombre,
                    createdAt: laborVisita.createdAt,
                    updatedAt: laborVisita.updatedAt,
                };
            });
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getSubLaboresVisita(filters?: { idLabor?: number; nombre?: string }) {
        try {
            const subLabores = await prisma.subLabor.findMany({
                where: {
                    AND: [
                        filters?.idLabor ? { idLabor: filters.idLabor } : {},
                        filters?.nombre
                            ? {
                                  nombre: {
                                      contains: filters.nombre,
                                  },
                              }
                            : {},
                    ],
                },
                include: {
                    Labor: true,
                },
                orderBy: {
                    nombre: 'asc',
                },
            });

            return subLabores.map((subLabor) => ({
                id: subLabor.id,
                nombre: subLabor.nombre,
                idLabor: subLabor.idLabor,
                labor: subLabor.Labor.nombre,
                createdAt: subLabor.createdAt,
                updatedAt: subLabor.updatedAt,
            }));
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
