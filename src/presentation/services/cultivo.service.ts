import { prisma } from "../../data/sqlserver";
import { CultivoEntity, CustomError, PaginationDto, UsuarioEntity } from "../../domain";

export class CultivoService {

    // DI
    constructor() {}

    /*async createCultivo(createCultivoDto: CreateCultivoDTO, user: UsuarioEntity) {
        try {
            const currentDate = new Date();

            const cultivo = await prisma.cultivo.create({
                data: {
                    certificacion: createCultivoDto.certificacion,
                    hectareas: createCultivoDto.hectareas,
                    mesInicio: createCultivoDto.mesInicio,
                    mesFinal: createCultivoDto.mesFinal,
                    observacion: createCultivoDto.observacion,
                    idFundo: createCultivoDto.idFundo,
                    idVariedad: createCultivoDto.idVariedad,
                    createdAt: currentDate,
                    updatedAt: currentDate,
                },
            });

            return {
                id: cultivo.id,
                certificacion: cultivo.certificacion,
                hectareas: cultivo.hectareas,
                mesInicio: cultivo.mesInicio,
                mesFinal: cultivo.mesFinal,
                observacion: cultivo.observacion,
                idFundo: cultivo.idFundo,
                idVariedad: cultivo.idVariedad,
            };

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateCultivo(updateCultivoDto: UpdateCultivoDTO) {
        const cultivoExists = await prisma.cultivo.findFirst({ where: { id: updateCultivoDto.id } });
        if (!cultivoExists) throw CustomError.badRequest(`Cultivo with id ${updateCultivoDto.id} does not exist`);

        try {
            const updatedCultivo = await prisma.cultivo.update({
                where: { id: updateCultivoDto.id },
                data: {
                    ...updateCultivoDto.values,
                    updatedAt: new Date(),
                },
            });

            return updatedCultivo;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }*/

    async getCultivos(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;

        try {
            const [total, cultivos] = await Promise.all([
                await prisma.cultivo.count(),
                await prisma.cultivo.findMany({
                    skip: ((page - 1) * limit),
                    take: limit,
                    include: {
                        Fundo: {
                            select: {
                                nombre: true,
                                PuntoContacto: true
                            }
                        },
                        Variedad: {
                            select: {
                                nombre: true,
                                Vegetacion: true
                            }
                        }
                    },
                })
            ]);

            return {
                page: page,
                limit: limit,
                total: total,
                next: `/v1/cultivos?page${(page + 1)}&limit=${limit}`,
                prev: (page - 1 > 0) ? `/v1/cultivos?page${(page - 1)}&limit=${limit}` : null,
                cultivos: cultivos.map((cultivo) => {
                    return {
                        id: cultivo.id,
                        certificacion: cultivo.certificacion,
                        hectareas: cultivo.hectareas,
                        mesInicio: cultivo.mesInicio,
                        mesFinal: cultivo.mesFinal,
                        observacion: cultivo.observacion,
                        idFundo: cultivo.idFundo,
                        idVariedad: cultivo.idVariedad,
                        variedad: cultivo.Variedad.nombre,
                        vegetacion:cultivo.Variedad.Vegetacion.nombre,
                        idVegetacion:cultivo.Variedad.Vegetacion.id,
                        idPunto: cultivo.Fundo.PuntoContacto?.id
                    };
                })
            };

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getCultivoById(id: number) {
        try {
            const cultivo = await prisma.cultivo.findUnique({
                where: { id },
                include: {
                    Fundo: true,
                    Variedad: true,
                },
            });

            if (!cultivo) throw CustomError.badRequest(`Cultivo with id ${id} does not exist`);

            return cultivo;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}