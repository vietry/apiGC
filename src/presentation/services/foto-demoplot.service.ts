import { prisma } from "../../data/sqlserver";
import { CreateFotoDemoplotDto, CustomError, PaginationDto } from "../../domain";
import { FileUploadService } from './file-upload.service';
import { UploadedFile } from 'express-fileupload';

export class FotoDemoplotService {
    constructor(
        private readonly fileUploadService: FileUploadService,
    ) {}

    async createFotoDemoplot(createFotoDemoplotDto: CreateFotoDemoplotDto, file: UploadedFile) {
        try {
            // Subir el archivo
            const uploadResult = await this.fileUploadService.uploadSingle(file, 'uploads/fotos');
            if (!uploadResult.fileName) {
                throw new Error('Error uploading file');
            }

            // Actualizar rutaFoto en el DTO
            const rutaFoto = `uploads/fotos/${uploadResult.fileName}`;

            // Guardar en la base de datos
            const fotoDemoplot = await prisma.fotoDemoPlot.create({
                data: {
                    idDemoPlot: createFotoDemoplotDto.idDemoPlot,
                    rutaFoto: rutaFoto,
                    tipo: createFotoDemoplotDto.tipo,
                    latitud: createFotoDemoplotDto.latitud,
                    longitud: createFotoDemoplotDto.longitud,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });

            return fotoDemoplot;

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getFotoDemoplots(paginationDto: PaginationDto) {
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
                next: `/api/fotodemoplots?page=${page + 1}&limit=${limit}`,
                prev: page - 1 > 0 ? `/api/fotodemoplots?page=${page - 1}&limit=${limit}` : null,
                fotoDemoplots,
            };

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
