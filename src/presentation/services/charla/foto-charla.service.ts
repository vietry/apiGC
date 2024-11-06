import { prisma } from "../../../data/sqlserver";
import { CustomError, PaginationDto } from "../../../domain";


export class FotoCharlaService {
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

    async getFotosCharlas(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;

        try {
            const [total, fotoCharlas] = await Promise.all([
                prisma.fotoCharla.count(),
                prisma.fotoCharla.findMany({
                    skip: (page - 1) * limit,
                    take: limit,
                    include: {
                        Charla: {
                            select: {
                                id: true,
                                idVegetacion: true,
                                idGte: true,
                                idBlanco: true,
                                tema: true,
                            }
                        }
                    },
                }),
            ]);

            return {
                page,
                limit,
                total,
                next: `/v1/fotoscharlas?page=${page + 1}&limit=${limit}`,
                prev: page - 1 > 0 ? `/api/fotoscharlas?page=${page - 1}&limit=${limit}` : null,
                fotoCharlas,
            };

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getFotoCharlaById(id: number) {
        try {
            const fotoCharla = await prisma.fotoCharla.findUnique({
                where: { id },
                include: {
                    Charla: {
                        select: {
                            id: true,
                            idVegetacion: true,
                            idGte: true,
                            idBlanco: true,
                            tema: true,
                        }
                    }
                }
            });

            if (!fotoCharla) throw CustomError.badRequest(`FotoDemoPlot with id ${id} does not exist`);

            return fotoCharla;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

        async getFotosByIdCharla(idCharla: number) {
            try {
                const fotosCharlas = await prisma.fotoCharla.findMany({
                    where: { idCharla: idCharla },
                    include: {
                        Charla: {
                            select: {
                                id: true,
                                idVegetacion: true,
                                idGte: true,
                                idBlanco: true,
                                tema: true,
                            }
                        }
                    },
                });
        
                return fotosCharlas.map((foto) => ({
                    id: foto.id,
                    nombre: foto.nombre,
                    comentario: foto.comentario,
                    estado: foto.estado,
                    rutaFoto: foto.rutaFoto,
                    tipo: foto.tipo,
                    latitud: foto.latitud,
                    longitud: foto.longitud,
                    createdAt: foto.createdAt,
                    createdBy: foto.createdBy,
                    updatedAt: foto.updatedAt,
                    updatedBy: foto.updatedBy,
                    idCharla: foto.idCharla
                }));
            } catch (error) {
                throw CustomError.internalServer(`${error}`);
            }
        }
}
