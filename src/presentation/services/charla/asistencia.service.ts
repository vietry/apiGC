import { prisma } from '../../../data/sqlserver';
import {
    CreateAsistenciaDto,
    CustomError,
    PaginationDto,
    UpdateAsistenciaDto,
} from '../../../domain';

interface AsistenciaFilters {
    idCharla?: number;
    idContactoTienda?: number;
    idTienda?: number;
    idGte?: number;
    createdBy?: number;
    updatedBy?: number;
    year?: number;
    month?: number;
}
export class AsistenciaService {
    constructor() {}

    async createAsistencia(createAsistenciaDto: CreateAsistenciaDto) {
        const date = new Date();
        const currentDate = new Date(date.getTime() - 5 * 60 * 60 * 1000);
        try {
            const asistencia = await prisma.asistencia.create({
                data: {
                    idContactoTienda: createAsistenciaDto.idContactoTienda,
                    idCharla: createAsistenciaDto.idCharla,
                    createdAt: currentDate,
                    createdBy: createAsistenciaDto.createdBy,
                    updatedAt: currentDate,
                    updatedBy: createAsistenciaDto.updatedBy,
                },
            });

            return asistencia;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateAsistencia(updateAsistenciaDto: UpdateAsistenciaDto) {
        const date = new Date();
        const currentDate = new Date(date.getTime() - 5 * 60 * 60 * 1000);
        const asistenciaExists = await prisma.asistencia.findFirst({
            where: { id: updateAsistenciaDto.id },
        });
        if (!asistenciaExists)
            throw CustomError.badRequest(
                `Asistencia with id ${updateAsistenciaDto.id} does not exist`
            );

        try {
            const updatedAsistencia = await prisma.asistencia.update({
                where: { id: updateAsistenciaDto.id },
                data: {
                    ...updateAsistenciaDto.values,
                    updatedAt: currentDate,
                },
            });

            return updatedAsistencia;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getAsistencias(offset: number, limit: number) {
        try {
            const asistencias = await prisma.asistencia.findMany({
                skip: (offset - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    Charla: {
                        select: {
                            id: true,
                            idTienda: true,
                            tema: true,
                            idGte: true,
                            Gte: true,
                            PuntoContacto: true,
                        },
                    },
                    ContactoPunto: true,
                },
            });

            return asistencias.map((asistencia) => ({
                id: asistencia.id,
                idCharla: asistencia.idCharla,
                idContactoTienda: asistencia.idContactoTienda,
                nombres: `${asistencia.ContactoPunto.nombre} ${asistencia.ContactoPunto.apellido}`,
                celular: asistencia.ContactoPunto.celularA,
                cargo: asistencia.ContactoPunto.cargo,
                tema: asistencia.Charla.tema,
                idTienda: asistencia.Charla.idTienda,
                tienda: asistencia.Charla.PuntoContacto.nombre,
                idGte: asistencia.Charla.idGte,
                createdAt: asistencia.createdAt,
                createdBy: asistencia.createdBy,
                updatedAt: asistencia.updatedAt,
                updatedBy: asistencia.updatedBy,
            }));
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getAsistenciasByIdCharla(
        idCharla: number,
        paginationDto: PaginationDto
    ) {
        const { page, limit } = paginationDto;
        try {
            const asistencias = await prisma.asistencia.findMany({
                skip: (page - 1) * limit,
                take: limit,
                where: { idCharla },
                orderBy: { createdAt: 'desc' },
                include: {
                    Charla: {
                        select: {
                            id: true,
                            idTienda: true,
                            tema: true,
                            idGte: true,
                            Gte: true,
                            PuntoContacto: true,
                        },
                    },
                    ContactoPunto: true,
                },
            });
            //{ asistencias };
            return asistencias.map((asistencia) => ({
                id: asistencia.id,
                idCharla: asistencia.idCharla,
                idContactoTienda: asistencia.idContactoTienda,
                nombres: `${asistencia.ContactoPunto.nombre} ${asistencia.ContactoPunto.apellido}`,
                celular: asistencia.ContactoPunto.celularA,
                cargo: asistencia.ContactoPunto.cargo,
                tema: asistencia.Charla.tema,
                idTienda: asistencia.Charla.idTienda,
                tienda: asistencia.Charla.PuntoContacto.nombre,
                idGte: asistencia.Charla.idGte,
                createdAt: asistencia.createdAt,
                createdBy: asistencia.createdBy,
                updatedAt: asistencia.updatedAt,
                updatedBy: asistencia.updatedBy,
            }));
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getAsistenciasByUsuario(idUsuario: number) {
        try {
            const asistencias = await prisma.asistencia.findMany({
                where: { createdBy: idUsuario },
                orderBy: { createdAt: 'desc' },
                include: {
                    Charla: {
                        select: {
                            id: true,
                            idTienda: true,
                            tema: true,
                            idGte: true,
                            Gte: true,
                            PuntoContacto: true,
                        },
                    },
                    ContactoPunto: true,
                    //Usuario_Asistencia_createdByToUsuario: true,
                },
            });
            //{ asistencias };
            return asistencias.map((asistencia) => ({
                id: asistencia.id,
                idCharla: asistencia.idCharla,
                idContactoTienda: asistencia.idContactoTienda,
                nombres: `${asistencia.ContactoPunto.nombre} ${asistencia.ContactoPunto.apellido}`,
                celular: asistencia.ContactoPunto.celularA,
                cargo: asistencia.ContactoPunto.cargo,
                tema: asistencia.Charla.tema,
                idTienda: asistencia.Charla.idTienda,
                tienda: asistencia.Charla.PuntoContacto.nombre,
                idGte: asistencia.Charla.idGte,
                createdAt: asistencia.createdAt,
                createdBy: asistencia.createdBy,
                updatedAt: asistencia.updatedAt,
                updatedBy: asistencia.updatedBy,
            }));
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getAsistenciaById(id: number) {
        try {
            const asistencia = await prisma.asistencia.findUnique({
                where: { id },
                include: {
                    Charla: true,
                    ContactoPunto: true,
                },
            });

            if (!asistencia)
                throw CustomError.badRequest(
                    `Asistencia with id ${id} does not exist`
                );

            return asistencia;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async deleteAsistencia(id: number) {
        // Verificar si la asistencia existe
        const asistenciaExists = await prisma.asistencia.findUnique({
            where: { id },
        });

        if (!asistenciaExists)
            throw CustomError.badRequest(
                `Asistencia with id ${id} does not exist`
            );

        try {
            // Eliminar la asistencia
            const asistenciaEliminada = await prisma.asistencia.delete({
                where: { id },
            });
            return asistenciaEliminada;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getAllAsistencias(filters: AsistenciaFilters = {}) {
        try {
            const where: any = {};

            // Aplicar filtros base
            if (filters.idCharla) where.idCharla = filters.idCharla;
            if (filters.idContactoTienda)
                where.idContactoTienda = filters.idContactoTienda;
            if (filters.createdBy) where.createdBy = filters.createdBy;
            if (filters.updatedBy) where.updatedBy = filters.updatedBy;

            // Filtros relacionados
            if (filters.idTienda || filters.idGte) {
                where.Charla = {
                    ...(filters.idTienda && { idTienda: filters.idTienda }),
                    ...(filters.idGte && { idGte: filters.idGte }),
                };
            }

            // Filtros de fecha
            if (filters.year || filters.month) {
                where.createdAt = {};
                if (filters.year) {
                    if (filters.month) {
                        where.createdAt = {
                            gte: new Date(filters.year, filters.month - 1),
                            lt: new Date(filters.year, filters.month),
                        };
                    } else {
                        where.createdAt = {
                            gte: new Date(filters.year, 0),
                            lt: new Date(filters.year + 1, 0),
                        };
                    }
                }
            }

            const asistencias = await prisma.asistencia.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                include: {
                    Charla: {
                        select: {
                            id: true,
                            idTienda: true,
                            tema: true,
                            idGte: true,
                            Gte: true,
                            PuntoContacto: true,
                        },
                    },
                    ContactoPunto: true,
                },
            });

            return asistencias.map((asistencia) => ({
                id: asistencia.id,
                idCharla: asistencia.idCharla,
                idContactoTienda: asistencia.idContactoTienda,
                nombres: `${asistencia.ContactoPunto.nombre} ${asistencia.ContactoPunto.apellido}`,
                celular: asistencia.ContactoPunto.celularA,
                cargo: asistencia.ContactoPunto.cargo,
                tema: asistencia.Charla.tema,
                idTienda: asistencia.Charla.idTienda,
                tienda: asistencia.Charla.PuntoContacto.nombre,
                idGte: asistencia.Charla.idGte,
                createdAt: asistencia.createdAt,
                createdBy: asistencia.createdBy,
                updatedAt: asistencia.updatedAt,
                updatedBy: asistencia.updatedBy,
            }));
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
