import { prisma } from '../../data/sqlserver';
import { CustomError } from '../../domain';

interface FamiliaFilters {
    idEmpresa?: number;
    clase?: string;
    enfoque?: boolean;
    escuela?: boolean;
    visitas?: boolean;
}

export class FamiliaService {
    async getFamilias(filters: FamiliaFilters = {}) {
        try {
            const where: any = {};

            if (filters.idEmpresa) where.idEmpresa = filters.idEmpresa;
            if (filters.clase) {
                where.clase = { contains: filters.clase };
            }
            if (filters.enfoque !== undefined) where.enfoque = filters.enfoque;
            if (filters.escuela !== undefined) where.escuela = filters.escuela;
            if (filters.visitas !== undefined) where.visitas = filters.visitas;

            const familias = await prisma.familia.findMany({
                where,
                include: {
                    Empresa: true,
                },
                orderBy: {
                    nombre: 'asc',
                },
            });

            return familias.map((familia) => ({
                id: familia.id,
                codigo: familia.codigo.trim(),
                nombre: familia.nombre.trim(),
                idEmpresa: familia.idEmpresa,
                enfoque: familia.enfoque,
                escuela: familia.escuela,
                clase: familia.clase,
                visitas: familia.visitas,
                createdAt: familia.createdAt,
                updatedAt: familia.updatedAt,
                empresaNombre: familia.Empresa.nomEmpresa,
                codiEmpresa: `0${familia.Empresa.id}`,
            }));
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getFamiliaById(id: number) {
        try {
            const familia = await prisma.familia.findUnique({
                where: { id },
                include: {
                    Empresa: true,
                },
            });

            if (!familia)
                throw CustomError.badRequest(
                    `Familia with id ${id} does not exist`
                );

            return {
                id: familia.id,
                codigo: familia.codigo.trim(),
                nombre: familia.nombre.trim(),
                idEmpresa: familia.idEmpresa,
                enfoque: familia.enfoque,
                escuela: familia.escuela,
                clase: familia.clase,
                createdAt: familia.createdAt,
                updatedAt: familia.updatedAt,
                empresaNombre: familia.Empresa.nomEmpresa,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getFamiliasConEnfoque(filters: FamiliaFilters = {}) {
        try {
            const where: any = {};

            if (filters.idEmpresa) where.idEmpresa = filters.idEmpresa;
            if (filters.clase) {
                where.clase = { contains: filters.clase };
            }
            if (filters.enfoque !== undefined) where.enfoque = true;

            const familias = await prisma.familia.findMany({
                where,
                include: {
                    Empresa: true,
                },
                orderBy: {
                    nombre: 'asc',
                },
            });

            return familias.map((familia) => ({
                id: familia.id,
                codigo: familia.codigo.trim(),
                nombre: familia.nombre.trim(),
                idEmpresa: familia.idEmpresa,
                enfoque: familia.enfoque,
                clase: familia.clase,
                createdAt: familia.createdAt,
                updatedAt: familia.updatedAt,
                empresaNombre: familia.Empresa.nomEmpresa,
                codiEmpresa: `0${familia.Empresa.id}`,
            }));
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getFamiliasEscuela() {
        try {
            const familias = await prisma.familia.findMany({
                where: {
                    escuela: true,
                },
                include: {
                    Empresa: true,
                },
            });

            return familias.map((familia) => ({
                id: familia.id,
                codigo: familia.codigo.trim(),
                nombre: familia.nombre.trim(),
                idEmpresa: familia.idEmpresa,
                escuela: familia.escuela,
                createdAt: familia.createdAt,
                updatedAt: familia.updatedAt,
                empresaNombre: familia.Empresa.nomEmpresa,
                codiEmpresa: `0${familia.Empresa.id}`,
            }));
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
