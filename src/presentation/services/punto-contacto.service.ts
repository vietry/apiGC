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
                    take: limit
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
                }))
            };

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
