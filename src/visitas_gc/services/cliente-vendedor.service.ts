import { prisma } from '../../data/sqlserver';
import { CustomError, PaginationDto } from '../../domain';

export type ClienteVendedorCommonFilters = {
    codcli?: string;
    nomcli?: string;
    codven?: string;
    nomvende?: string;
    email?: string;
    activo?: boolean;
};

export class ClienteVendedorService {
    // Exactus - solo lectura
    async getExactusAll(
        pagination: PaginationDto,
        filters: ClienteVendedorCommonFilters = {}
    ) {
        const { page, limit } = pagination;
        const where: any = {};
        if (filters.codcli) where.codcli = { contains: filters.codcli };
        if (filters.nomcli) where.nomcli = { contains: filters.nomcli };
        if (filters.codven) where.codven = { contains: filters.codven };
        if (filters.nomvende) where.nomvende = { contains: filters.nomvende };
        if (filters.email) where.email = { contains: filters.email };
        if (filters.activo !== undefined) where.activo = filters.activo;

        try {
            const [total, rows] = await Promise.all([
                prisma.clienteVendedorExactus.count({ where }),
                prisma.clienteVendedorExactus.findMany({
                    where,
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { updatedAt: 'desc' },
                }),
            ]);
            return {
                page,
                pages: Math.ceil(total / limit),
                limit,
                total,
                items: rows,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getExactusById(id: number) {
        const row = await prisma.clienteVendedorExactus.findUnique({
            where: { id },
        });
        if (!row)
            throw CustomError.badRequest(
                `ClienteVendedorExactus ${id} no existe`
            );
        return row;
    }

    // GC - lectura
    async getGCAll(
        pagination: PaginationDto,
        filters: ClienteVendedorCommonFilters & { empresaId?: number } = {}
    ) {
        const { page, limit } = pagination;
        const where: any = {};
        if (filters.codcli) where.codcli = { contains: filters.codcli };
        if (filters.nomcli) where.nomcli = { contains: filters.nomcli };
        if (filters.codven) where.codven = { contains: filters.codven };
        if (filters.nomvende) where.nomvende = { contains: filters.nomvende };
        if (filters.email) where.email = { contains: filters.email };
        if (filters.activo !== undefined) where.activo = filters.activo;
        if (filters.empresaId !== undefined)
            where.empresaId = filters.empresaId;

        try {
            const [total, rows] = await Promise.all([
                prisma.clienteVendedorGC.count({ where }),
                prisma.clienteVendedorGC.findMany({
                    where,
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { updatedAt: 'desc' },
                    include: { Empresa: true },
                }),
            ]);
            return {
                page,
                pages: Math.ceil(total / limit),
                limit,
                total,
                items: rows,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getGCById(id: number) {
        const row = await prisma.clienteVendedorGC.findUnique({
            where: { id },
            include: { Empresa: true },
        });
        if (!row)
            throw CustomError.badRequest(`ClienteVendedorGC ${id} no existe`);
        return row;
    }

    // GC - crear
    async createGC(input: {
        empresaId: number;
        codcli: string;
        nomcli: string | null;
        codven: string;
        nomvende: string | null;
        email: string | null;
        activo: boolean;
        createdBy: number;
    }) {
        try {
            // Restricción única: empresaId, codcli, codven
            const exists = await prisma.clienteVendedorGC.findFirst({
                where: {
                    empresaId: input.empresaId,
                    codcli: input.codcli,
                    codven: input.codven,
                },
            });
            if (exists)
                throw CustomError.badRequest(
                    `Ya existe ClienteVendedorGC empresaId:${input.empresaId}, codcli:${input.codcli}, codven:${input.codven}`
                );

            const created = await prisma.clienteVendedorGC.create({
                data: {
                    empresaId: input.empresaId,
                    codcli: input.codcli,
                    nomcli: input.nomcli,
                    codven: input.codven,
                    nomvende: input.nomvende,
                    email: input.email,
                    activo: input.activo,
                    createdBy: input.createdBy,
                },
            });
            return created;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    // GC - actualizar
    async updateGC(id: number, values: any) {
        const found = await prisma.clienteVendedorGC.findUnique({
            where: { id },
        });
        if (!found)
            throw CustomError.badRequest(`ClienteVendedorGC ${id} no existe`);
        try {
            const updated = await prisma.clienteVendedorGC.update({
                where: { id },
                data: values,
            });
            return updated;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    // Combinado Exactus + GC (solo lectura)
    async getCombined(
        pagination: PaginationDto,
        filters: ClienteVendedorCommonFilters = {}
    ) {
        const { page, limit } = pagination;
        const whereExactus: any = {};
        const whereGC: any = {};
        const apply = (src: any) => {
            if (filters.codcli) src.codcli = { contains: filters.codcli };
            if (filters.nomcli) src.nomcli = { contains: filters.nomcli };
            if (filters.codven) src.codven = { contains: filters.codven };
            if (filters.nomvende) src.nomvende = { contains: filters.nomvende };
            if (filters.email) src.email = { contains: filters.email };
            if (filters.activo !== undefined) src.activo = filters.activo;
        };
        apply(whereExactus);
        apply(whereGC);

        try {
            const [totalExactus, exactus, totalGC, gc] = await Promise.all([
                prisma.clienteVendedorExactus.count({ where: whereExactus }),
                prisma.clienteVendedorExactus.findMany({
                    where: whereExactus,
                    orderBy: { updatedAt: 'desc' },
                }),
                prisma.clienteVendedorGC.count({ where: whereGC }),
                prisma.clienteVendedorGC.findMany({
                    where: whereGC,
                    orderBy: { updatedAt: 'desc' },
                    include: { Empresa: true },
                }),
            ]);

            const combined = [
                ...exactus.map((x) => ({
                    source: 'exactus' as const,
                    id: x.id,
                    empresa: x.empresa,
                    codcli: x.codcli,
                    nomcli: x.nomcli,
                    codven: x.codven,
                    nomvende: x.nomvende,
                    email: x.email,
                    activo: x.activo,
                    updatedAt: x.updatedAt,
                })),
                ...gc.map((g) => ({
                    source: 'gc' as const,
                    id: g.id,
                    empresa: g.Empresa?.nomEmpresa ?? String(g.empresaId),
                    codcli: g.codcli,
                    nomcli: g.nomcli,
                    codven: g.codven,
                    nomvende: g.nomvende,
                    email: g.email,
                    activo: g.activo,
                    updatedAt: g.updatedAt,
                })),
            ].sort(
                (a, b) =>
                    (b.updatedAt?.getTime?.() ?? 0) -
                    (a.updatedAt?.getTime?.() ?? 0)
            );

            // paginar combinado en memoria
            const total = totalExactus + totalGC;
            const start = (page - 1) * limit;
            const end = start + limit;
            const paged = combined.slice(start, end);
            return {
                page,
                pages: Math.ceil(total / limit),
                limit,
                total,
                items: paged,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
