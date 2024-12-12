
import { prisma } from "../../data/sqlserver";
import { CreateFotoDemoPlotLogDto, CustomError, UpdateFotoDemoPlotLogDto } from "../../domain";

export class FotoDemoPlotLogService {

    //constructor() {}

    async createFotoDemoPlotLog(createDto: CreateFotoDemoPlotLogDto) {
        try {
            const date = new Date();
            const currentDate = new Date(date.getTime() - 5 * 60 * 60 * 1000); // Ajustar la zona horaria

            const fotoDemoPlotLog = await prisma.fotoDemoPlotLog.create({
                data: {
                    idDemoPlot: createDto.idDemoPlot,
                    nombre: createDto.nombre,
                    comentario: createDto.comentario,
                    rutaFoto: createDto.rutaFoto,
                    tipo: createDto.tipo,
                    latitud: createDto.latitud,
                    longitud: createDto.longitud,
                    estado: createDto.estado,
                    createdAt: createDto.createdAt,
                    updatedAt: createDto.updatedAt,
                    deletedAt: currentDate,
                    deletedBy: createDto.deletedBy,
                    motivo: createDto.motivo,
                    
                },
            });

            return fotoDemoPlotLog;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateFotoDemoPlotLog(updateDto: UpdateFotoDemoPlotLogDto) {
        try {
            const date = new Date();
            const currentDate = new Date(date.getTime() - 5 * 60 * 60 * 1000);
            const logExists = await prisma.fotoDemoPlotLog.findUnique({ where: { id: updateDto.id } });
            if (!logExists) throw CustomError.badRequest(`Log with id ${updateDto.id} does not exist`);

            const updatedLog = await prisma.fotoDemoPlotLog.update({
                where: { id: updateDto.id },
                data: {
                    ...updateDto.values,
                    updatedAt: currentDate,
                },
            });

            return updatedLog;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getFotoDemoPlotLogs(offset: number, limit: number) {
        try {
            const logs = await prisma.fotoDemoPlotLog.findMany({
                skip: offset,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    DemoPlot: true,
                    Usuario: true,
                },
            });

            return logs.map(log => ({
                id: log.id,
                idFotoDemoPlot: log.idFotoDemoPlot,
                idDemoPlot: log.idDemoPlot,
                nombre: log.nombre,
                comentario: log.comentario,
                rutaFoto: log.rutaFoto,
                tipo: log.tipo,
                latitud: log.latitud,
                longitud: log.longitud,
                estado: log.estado,
                createdAt: log.createdAt,
                updatedAt: log.updatedAt,
                deletedAt: log.deletedAt,
                deletedBy: log.deletedBy,
                motivo: log.motivo,
            }));
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getFotoDemoPlotLogById(id: number) {
        try {
            const log = await prisma.fotoDemoPlotLog.findUnique({
                where: { id },
                include: {
                    DemoPlot: true,
                    Usuario: true,
                },
            });

            if (!log) throw CustomError.badRequest(`Log with id ${id} does not exist`);

            return {
                id: log.id,
                idFotoDemoPlot: log.idFotoDemoPlot,
                idDemoPlot: log.idDemoPlot,
                nombre: log.nombre,
                comentario: log.comentario,
                rutaFoto: log.rutaFoto,
                tipo: log.tipo,
                latitud: log.latitud,
                longitud: log.longitud,
                estado: log.estado,
                createdAt: log.createdAt,
                updatedAt: log.updatedAt,
                deletedAt: log.deletedAt,
                deletedBy: log.deletedBy,
                motivo: log.motivo,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}