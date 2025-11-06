import { prisma } from '../../data/sqlserver';
import { CustomError } from '../../domain';

export interface FamiliaVisitaFilters {
    search?: string; // Busca en nombre, familia, linea, clasificacion, proveedor
    vigente?: boolean;
    agrupacion?: number;
    esquema?: string;
    unidadMedida?: string;
    // Paginación estándar usada en otros servicios
    page?: number; // página 1-based
    limit?: number; // tamaño de página
}

export class FamiliaVisitaService {
    async getById(id: number) {
        try {
            const item = await prisma.familiaVisita.findUnique({
                where: { id },
            });
            if (!item)
                throw CustomError.badRequest(
                    `FamiliaVisita with id ${id} does not exist`
                );
            return item;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getAll(filters?: FamiliaVisitaFilters) {
        try {
            const where: any = {};

            if (filters?.vigente !== undefined) where.vigente = filters.vigente;
            if (filters?.agrupacion !== undefined)
                where.agrupacion = filters.agrupacion;
            if (filters?.esquema) where.esquema = filters.esquema;
            if (filters?.unidadMedida)
                where.unidadMedida = filters.unidadMedida;

            if (filters?.search) {
                const term = filters.search;
                // Nota: En SQL Server con Prisma, el modo insensitive depende del collation.
                // Se omite `mode: 'insensitive'` por compatibilidad.
                where.OR = [
                    { nombre: { contains: term } },
                    { familia: { contains: term } },
                    { linea: { contains: term } },
                    { clasificacion: { contains: term } },
                    { proveedor: { contains: term } },
                ];
            }

            // Paginación: convertir page/limit a skip/take como usan otros servicios
            let skip: number | undefined;
            let take: number | undefined;
            if (filters?.page !== undefined && filters?.limit !== undefined) {
                const page = Math.max(1, Number(filters.page));
                const limit = Math.max(1, Number(filters.limit));
                skip = (page - 1) * limit;
                take = limit;
            }

            const [total, data] = await prisma.$transaction([
                prisma.familiaVisita.count({ where }),
                prisma.familiaVisita.findMany({
                    where,
                    orderBy: [{ nombre: 'asc' }],
                    ...(take !== undefined ? { take } : {}),
                    ...(skip !== undefined ? { skip } : {}),
                }),
            ]);

            // Si hay paginación, devolver metadatos similares a otros servicios
            if (take !== undefined && skip !== undefined) {
                const page = skip / take + 1;
                const pages = Math.ceil(total / take);
                return { page, pages, limit: take, total, items: data };
            }

            return { total, data };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
