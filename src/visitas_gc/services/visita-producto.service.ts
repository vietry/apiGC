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
                idFamilia: visitaProducto.Familia.id,
                producto: visitaProducto.Familia.nombre,
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
                producto: visitaProducto.Familia.nombre,
                createdAt: visitaProducto.createdAt,
                updatedAt: visitaProducto.updatedAt,
            }));
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
