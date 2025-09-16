import { prisma } from '../../data/sqlserver';
import { CustomError, PaginationDto } from '../../domain';

export type TiendaClienteFilters = {
    codcli?: string;
    id_tda?: number;
    descrip?: string;
    codsbz?: string;
    direccion?: string;
    debaja?: number;
    ubigeo?: string;
    vigente?: boolean;
    editable?: boolean;
};

export class TiendaClienteService {
    async create(input: any) {
        try {
            const created = await prisma.tiendaCliente.create({ data: input });
            return created;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async update(id: number, values: any) {
        const exists = await prisma.tiendaCliente.findUnique({ where: { id } });
        if (!exists)
            throw CustomError.badRequest(`TiendaCliente ${id} no existe`);
        try {
            const updated = await prisma.tiendaCliente.update({
                where: { id },
                data: values,
            });
            return updated;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getAll(
        pagination: PaginationDto,
        filters: TiendaClienteFilters = {}
    ) {
        const { page, limit } = pagination;
        const where: any = {};
        if (filters.codcli) where.codcli = { contains: filters.codcli };
        if (filters.id_tda !== undefined) where.id_tda = filters.id_tda;
        if (filters.descrip) where.descrip = { contains: filters.descrip };
        if (filters.codsbz) where.codsbz = { contains: filters.codsbz };
        if (filters.direccion)
            where.direccion = { contains: filters.direccion };
        if (filters.debaja !== undefined) where.debaja = filters.debaja;
        if (filters.ubigeo) where.ubigeo = { contains: filters.ubigeo };
        if (filters.vigente !== undefined) where.vigente = filters.vigente;
        if (filters.editable !== undefined) where.editable = filters.editable;

        try {
            const [total, rows] = await Promise.all([
                prisma.tiendaCliente.count({ where }),
                prisma.tiendaCliente.findMany({
                    where,
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { updated_at: 'desc' },
                    include: {
                        ClienteVendedorGC: { include: { Empresa: true } },
                        Colaborador: { include: { Usuario: true } },
                    },
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

    async getById(id: number) {
        const row = await prisma.tiendaCliente.findUnique({
            where: { id },
            include: {
                ClienteVendedorGC: { include: { Empresa: true } },
                Colaborador: { include: { Usuario: true } },
            },
        });
        if (!row) throw CustomError.badRequest(`TiendaCliente ${id} no existe`);
        return row;
    }
}
