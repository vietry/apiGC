import { prisma } from "../../data/sqlserver";
import { CreatePuntoContactoDto, CustomError, PaginationDto, UpdatePuntoContactoDto } from "../../domain";

export class PuntoContactoService {
    constructor() {}

    async createPuntoContacto(createPuntoContactoDto: CreatePuntoContactoDto/*, gte: GteEntity*/) {
        try {
            const currentDate = new Date();

            const puntoContacto = await prisma.puntoContacto.create({
                data: {
                    nombre: createPuntoContactoDto.nombre,
                    tipoDoc: createPuntoContactoDto.tipoDoc,
                    numDoc: createPuntoContactoDto.numDoc,
                    hectareas: createPuntoContactoDto.hectareas,
                    tipo: createPuntoContactoDto.tipo,
                    dirReferencia: createPuntoContactoDto.dirReferencia,
                    lider: createPuntoContactoDto.lider,
                    activo: createPuntoContactoDto.activo,
                    /*idGte: gte.id,*/
                    idGte: createPuntoContactoDto.idGte,
                    createdAt: currentDate,
                    updatedAt: currentDate,
                },
            });

            return {
                id: puntoContacto.id,
                nombre: puntoContacto.nombre,
                tipoDoc: puntoContacto.tipoDoc,
                numDoc: puntoContacto.numDoc,
                tipo: puntoContacto.tipo,
                referencia: puntoContacto.dirReferencia,
                lider: puntoContacto.lider,
                activo: puntoContacto.activo,
                idGte: puntoContacto.idGte,
                hectareas: puntoContacto.hectareas,

            };

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }


    async updatePuntoContacto(updatePuntoContactoDto: UpdatePuntoContactoDto) {
        const puntoContactoExists = await prisma.puntoContacto.findFirst({ where: { id: updatePuntoContactoDto.id } });
        if (!puntoContactoExists) throw CustomError.badRequest(`PuntoContacto with id ${updatePuntoContactoDto.id} does not exist`);

        try {
            const updatedPuntoContacto = await prisma.puntoContacto.update({
                where: { id: updatePuntoContactoDto.id },
                data: {
                    ...updatePuntoContactoDto.values, // Usar valores directamente del DTO
                    updatedAt: new Date(),
                },
            });

            return updatedPuntoContacto;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getPuntosContacto(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;

        try {
            const [total, puntosContacto] = await Promise.all([
                prisma.puntoContacto.count(),
                prisma.puntoContacto.findMany({
                    skip: (page - 1) * limit,
                    take: limit,
                    include: {
                        Gte: {
                            select: {
                                Usuario: {
                                    select: {
                                        id: true,
                                        
                                    }
                                }
                            }
                        }
                    }
                })
            ]);

            return {
                page: page,
                limit: limit,
                total: total,
                next: `/api/puntoscontacto?page=${page + 1}&limit=${limit}`,
                prev: (page - 1 > 0) ? `/api/puntoscontacto?page=${page - 1}&limit=${limit}` : null,
                puntosContacto: puntosContacto.map(puntoContacto => ({
                    id: puntoContacto.id,
                    nombre: puntoContacto.nombre,
                    tipoDoc: puntoContacto.tipoDoc,
                    numDoc: puntoContacto.numDoc,
                    tipo: puntoContacto.tipo,
                    referencia: puntoContacto.dirReferencia,
                    lider: puntoContacto.lider,
                    activo: puntoContacto.activo,
                    idGte: puntoContacto.idGte,
                    hectareas: puntoContacto.hectareas,
                    idUsuario: puntoContacto.Gte.Usuario.id
                }))
            };

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getPuntoContactoById(id: number) {
        try {
            const puntoContacto = await prisma.puntoContacto.findUnique({
                where: { id }
            });

            if (!puntoContacto) throw CustomError.badRequest(`PuntoContacto with id ${id} does not exist`);

            return puntoContacto;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getPuntosContactoByGteId(idGte: number, paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;

        try {
            const [total, puntosContacto] = await Promise.all([
                prisma.puntoContacto.count({ where: { idGte } }),
                prisma.puntoContacto.findMany({
                    where: { idGte },
                    skip: (page - 1) * limit,
                    take: limit,
                    include: {
                        Gte: {
                            select: {
                                Usuario: {
                                    select: {
                                        id: true,
                                        
                                    }
                                }
                            }
                        }
                    }
                })
            ]);

            if (!puntosContacto || puntosContacto.length === 0) throw CustomError.badRequest(`No PuntoContacto found with Gte id ${idGte}`);

            return {
                page: page,
                limit: limit,
                total: total,
                next: `/api/puntoscontacto?idGte=${idGte}&page=${page + 1}&limit=${limit}`,
                prev: (page - 1 > 0) ? `/api/puntoscontacto?idGte=${idGte}&page=${(page - 1)}&limit=${limit}` : null,
                puntosContacto: puntosContacto.map(puntoContacto => ({
                    id: puntoContacto.id,
                    nombre: puntoContacto.nombre,
                    tipoDoc: puntoContacto.tipoDoc,
                    numDoc: puntoContacto.numDoc,
                    tipo: puntoContacto.tipo,
                    referencia: puntoContacto.dirReferencia,
                    lider: puntoContacto.lider,
                    activo: puntoContacto.activo,
                    idGte: puntoContacto.idGte,
                    hectareas: puntoContacto.hectareas,
                    idUsuario: puntoContacto.Gte.Usuario.id
                }))
            };

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
