import { prisma } from '../../data/sqlserver';
import { CustomError, PaginationDto } from '../../domain';

export type ContactoFilters = {
    nombre?: string;
    apellido?: string;
    cargo?: string;
    email?: string;
    celularA?: string;
    celularB?: string;
    activo?: boolean;
    clienteExactusId?: number;
    clienteGestionCId?: number;
    tipo?: string;
    createdBy?: number;
    ubicacionId?: number;
    codCliente?: string; // antes codcli: codCliente de ClienteVendedorExactus o ClienteVendedorGC
};

export class ContactoService {
    async create(input: any) {
        try {
            // Asegurar null explícito para campos opcionales
            const data = {
                ...input,
                clienteExactusId:
                    input.clienteExactusId === undefined
                        ? null
                        : input.clienteExactusId,
                clienteGestionCId:
                    input.clienteGestionCId === undefined
                        ? null
                        : input.clienteGestionCId,
            };
            const created = await prisma.contacto.create({ data });
            return created;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async update(id: number, values: any) {
        const exists = await prisma.contacto.findUnique({ where: { id } });
        if (!exists) throw CustomError.badRequest(`Contacto ${id} no existe`);
        try {
            // Validar que el estado final mantenga al menos uno de los IDs
            const finalExactus =
                values.clienteExactusId !== undefined
                    ? values.clienteExactusId
                    : exists.clienteExactusId;
            const finalGestionC =
                values.clienteGestionCId !== undefined
                    ? values.clienteGestionCId
                    : exists.clienteGestionCId;
            if (
                (finalExactus === null || finalExactus === undefined) &&
                (finalGestionC === null || finalGestionC === undefined)
            ) {
                throw CustomError.badRequest(
                    'Debe mantener al menos uno: clienteExactusId o clienteGestionCId'
                );
            }
            const updated = await prisma.contacto.update({
                where: { id },
                data: values,
            });
            return updated;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getAll(pagination: PaginationDto, filters: ContactoFilters = {}) {
        const { page, limit } = pagination;
        const where: any = {};
        if (filters.nombre) where.nombre = { contains: filters.nombre };
        if (filters.apellido) where.apellido = { contains: filters.apellido };
        if (filters.cargo) where.cargo = { contains: filters.cargo };
        if (filters.email) where.email = { contains: filters.email };
        if (filters.celularA) where.celularA = { contains: filters.celularA };
        if (filters.celularB) where.celularB = { contains: filters.celularB };
        if (filters.activo !== undefined) where.activo = filters.activo;
        if (filters.clienteExactusId !== undefined)
            where.clienteExactusId = filters.clienteExactusId;
        if (filters.clienteGestionCId !== undefined)
            where.clienteGestionCId = filters.clienteGestionCId;
        if (filters.tipo) where.tipo = { contains: filters.tipo };
        if (filters.createdBy !== undefined)
            where.createdBy = filters.createdBy;
        if (filters.ubicacionId !== undefined)
            where.ubicacionId = filters.ubicacionId;
        // Filtro OR por codCliente en cualquiera de las relaciones
        if (filters.codCliente) {
            where.OR = [
                {
                    ClienteVendedorExactus: {
                        codcli: { contains: filters.codCliente },
                    },
                },
                {
                    ClienteVendedorGC: {
                        codcli: { contains: filters.codCliente },
                    },
                },
            ];
        }

        try {
            const [total, rows] = await Promise.all([
                prisma.contacto.count({ where }),
                prisma.contacto.findMany({
                    where,
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { updatedAt: 'desc' },
                    include: {
                        ClienteVendedorExactus: true,
                        ClienteVendedorGC: { include: { Empresa: true } },
                        Colaborador: { include: { Usuario: true } },
                        UbicacionCliente: true,
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
        const row = await prisma.contacto.findUnique({
            where: { id },
            include: {
                ClienteVendedorExactus: true,
                ClienteVendedorGC: { include: { Empresa: true } },
                Colaborador: { include: { Usuario: true } },
                UbicacionCliente: true,
            },
        });
        if (!row) throw CustomError.badRequest(`Contacto ${id} no existe`);
        return row;
    }
}
