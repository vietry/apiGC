import { prisma } from "../../data/sqlserver";
import { CreateFotoDemoplotDto, CustomError, PaginationDto } from "../../domain";

import { UploadedFile } from 'express-fileupload';
import { FotoDemoplotEntity } from "../../domain/entities/fotoDemoplot.entity";

export class FotoDemoplotService {
    constructor() {}

    /*async createFotoDemoplot(createFotoDemoplotDto: CreateFotoDemoplotDto, foto: FotoDemoplotEntity) {
        try {
            // Subir el archivo

            // Guardar en la base de datos
            const fotoDemoplot = await prisma.fotoDemoPlot.create({
                data: {
                    idDemoPlot: foto.idDemoPlot,
                    rutaFoto: foto.rutaFoto,
                    tipo: foto.tipo,
                    latitud: foto.latitud,
                    longitud: foto.longitud,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });

            return fotoDemoplot;

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }*/

    async getFotosDemoplots(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;

        try {
            const [total, fotoDemoplots] = await Promise.all([
                prisma.fotoDemoPlot.count(),
                prisma.fotoDemoPlot.findMany({
                    skip: (page - 1) * limit,
                    take: limit,
                    include: {
                        DemoPlot: {
                            select: {
                                id: true,
                                idCultivo: true,
                                idGte: true,
                                idBlanco: true,
                                gradoInfestacion: true,
                            }
                        }
                    },
                }),
            ]);

            return {
                page,
                limit,
                total,
                next: `/api/fotosdemoplots?page=${page + 1}&limit=${limit}`,
                prev: page - 1 > 0 ? `/api/fotosdemoplots?page=${page - 1}&limit=${limit}` : null,
                fotoDemoplots,
            };

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getFotosByIdDemoplot(idDemoPlot: number,paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;

        try {
            const [total, fotoDemoplots] = await Promise.all([
                prisma.fotoDemoPlot.count(),
                prisma.fotoDemoPlot.findMany({
                    where: {idDemoPlot: idDemoPlot},
                    skip: (page - 1) * limit,
                    take: limit,
                    include: {
                        DemoPlot: {
                            select: {
                                id: true,
                                idCultivo: true,
                                idGte: true,
                                idBlanco: true,
                                gradoInfestacion: true,
                            }
                        }
                    },
                }),
            ]);

            return {
                page,
                limit,
                total,
                next: `/api/fotosdemoplots/${idDemoPlot}?page=${page + 1}&limit=${limit}`,
                prev: page - 1 > 0 ? `/api/fotodemoplots/${idDemoPlot}?page=${page - 1}&limit=${limit}` : null,
                fotoDemoplots,
            };

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
