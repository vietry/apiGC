import { getCurrentDate } from '../../config/time';
import { prisma } from '../../data/sqlserver';
import { CustomError } from '../../domain';
import { CreateVisitaProductoDto } from '../dtos/create-visita-producto.dto';
import { UpdateVisitaProductoDto } from '../dtos/update-visita-producto.dto';

export class VisitaProductoService {
    /* ...existing code... */

    async createVisitaProducto(createDto: CreateVisitaProductoDto) {
        // Verificar que la visita exista
        const visitaExists = await prisma.visita.findUnique({
            where: { id: createDto.idVisita },
        });
        if (!visitaExists)
            throw CustomError.badRequest(
                `Visita with id ${createDto.idVisita} does not exist`
            );
        // Verificar que la familia de visita exista (FamiliaVisita)
        const familiaVisitaExists = await prisma.familiaVisita.findUnique({
            where: { id: createDto.idFamilia },
        });
        if (!familiaVisitaExists)
            throw CustomError.badRequest(
                `FamiliaVisita with id ${createDto.idFamilia} does not exist`
            );
        const currentDate = getCurrentDate();
        try {
            const visitaProducto = await prisma.visitaProducto.create({
                data: {
                    idVisita: createDto.idVisita,
                    idFamilia: createDto.idFamilia,
                    createdAt: currentDate,
                    updatedAt: currentDate,
                },
            });
            return visitaProducto;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async createMultipleVisitaProductos(
        visitaProductosDtos: CreateVisitaProductoDto[]
    ) {
        try {
            const BATCH_SIZE = 50;
            const allResults = [];

            for (let i = 0; i < visitaProductosDtos.length; i += BATCH_SIZE) {
                const batch = visitaProductosDtos.slice(i, i + BATCH_SIZE);
                // Validación previa por lote para asegurar que las visitas y familias existan
                const visitaIds = Array.from(
                    new Set(batch.map((b) => b.idVisita))
                );
                const familiaIds = Array.from(
                    new Set(batch.map((b) => b.idFamilia))
                );

                const [visitasFound, familiasFound] = await Promise.all([
                    prisma.visita.findMany({
                        where: { id: { in: visitaIds } },
                        select: { id: true },
                    }),
                    prisma.familiaVisita.findMany({
                        where: { id: { in: familiaIds } },
                        select: { id: true },
                    }),
                ]);

                const visitaSet = new Set(visitasFound.map((v) => v.id));
                const familiaSet = new Set(familiasFound.map((f) => f.id));

                const missingVisitas = visitaIds.filter(
                    (id) => !visitaSet.has(id)
                );
                if (missingVisitas.length) {
                    throw CustomError.badRequest(
                        `Some Visita ids do not exist: ${missingVisitas.join(
                            ', '
                        )}`
                    );
                }

                const missingFamilias = familiaIds.filter(
                    (id) => !familiaSet.has(id)
                );
                if (missingFamilias.length) {
                    throw CustomError.badRequest(
                        `Some FamiliaVisita ids do not exist: ${missingFamilias.join(
                            ', '
                        )}`
                    );
                }

                const batchResults = await prisma.$transaction(
                    async (prismaClient) => {
                        const results = [];
                        for (const dto of batch) {
                            const currentDate = getCurrentDate();
                            const visitaProducto =
                                await prismaClient.visitaProducto.create({
                                    data: {
                                        idVisita: dto.idVisita,
                                        idFamilia: dto.idFamilia,
                                        createdAt: currentDate,
                                        updatedAt: currentDate,
                                    },
                                });
                            results.push(visitaProducto);
                        }
                        return results;
                    },
                    {
                        timeout: 20000,
                        maxWait: 25000,
                    }
                );
                allResults.push(...batchResults);
            }
            return allResults;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateVisitaProducto(updateDto: UpdateVisitaProductoDto) {
        const exists = await prisma.visitaProducto.findUnique({
            where: { id: updateDto.id },
        });
        if (!exists)
            throw CustomError.badRequest(
                `VisitaProducto with id ${updateDto.id} does not exist`
            );

        try {
            const updated = await prisma.visitaProducto.update({
                where: { id: updateDto.id },
                data: {
                    ...updateDto.values,
                },
            });
            return updated;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getVisitaProductoById(id: number) {
        try {
            const visitaProducto = await prisma.visitaProducto.findUnique({
                where: { id },
                include: {
                    Familia: true,
                },
            });
            if (!visitaProducto)
                throw CustomError.badRequest(
                    `VisitaProducto with id ${id} does not exist`
                );
            return {
                id: visitaProducto.id,
                idVisita: visitaProducto.idVisita,
                idFamilia: visitaProducto.idFamilia,
                producto: visitaProducto.Familia?.nombre,
                createdAt: visitaProducto.createdAt,
                updatedAt: visitaProducto.updatedAt,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getVisitaProductosByVisitaId(idVisita: number) {
        try {
            const visitaProductos = await prisma.visitaProducto.findMany({
                where: { idVisita },
                include: {
                    Familia: true,
                },
            });
            return visitaProductos.map((visitaProducto) => ({
                id: visitaProducto.id,
                idVisita: visitaProducto.idVisita,
                idFamilia: visitaProducto.idFamilia,
                producto: visitaProducto.Familia?.nombre,
                createdAt: visitaProducto.createdAt,
                updatedAt: visitaProducto.updatedAt,
            }));
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
