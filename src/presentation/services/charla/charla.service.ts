
import { prisma } from "../../../data/sqlserver";
import { CreateCharlaDto, CustomError, UpdateCharlaDto } from "../../../domain";


export class CharlaService {
    constructor() {}

    async createCharla(createCharlaDto: CreateCharlaDto) {

        const colabIdUsuarioExists = await prisma.puntoContacto.findUnique({where: {id: createCharlaDto.idTienda}});
        if ( !colabIdUsuarioExists ) throw CustomError.badRequest( `La tienda no existe` );


        try {
            const currentDate = new Date();

            const charla = await prisma.charla.create({
                data: {
                    tema: createCharlaDto.tema,
                    asistentes: createCharlaDto.asistentes,
                    hectareas: createCharlaDto.hectareas,
                    dosis: createCharlaDto.dosis,
                    efectivo: createCharlaDto.efectivo,
                    comentarios: createCharlaDto.comentarios,
                    demoplots: createCharlaDto.demoplots,
                    estado: createCharlaDto.estado,
                    programacion: createCharlaDto.programacion,
                    ejecucion: createCharlaDto.ejecucion,
                    cancelacion: createCharlaDto.cancelacion,
                    motivo: createCharlaDto.motivo,
                    idVegetacion: createCharlaDto.idVegetacion,
                    idBlanco: createCharlaDto.idBlanco,
                    idDistrito: createCharlaDto.idDistrito,
                    idFamilia: createCharlaDto.idFamilia,
                    idGte: createCharlaDto.idGte,
                    idTienda: createCharlaDto.idTienda,
                    createdAt: currentDate,
                    createdBy: createCharlaDto.createdBy,
                    updatedAt: currentDate,
                    updatedBy: createCharlaDto.updatedBy,
                },
            });

            return charla;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateCharla(updateCharlaDto: UpdateCharlaDto) {
        const charlaExists = await prisma.charla.findFirst({ where: { id: updateCharlaDto.id } });
        if (!charlaExists) throw CustomError.badRequest(`Charla with id ${updateCharlaDto.id} does not exist`);

        try {
            const updatedCharla = await prisma.charla.update({
                where: { id: updateCharlaDto.id },
                data: {
                    ...updateCharlaDto.values,
                    updatedAt: new Date(),
                },
            });

            return updatedCharla;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getCharlas(offset: number, limit: number) {
        try {
            const charlas = await prisma.charla.findMany({
                    skip: offset,
                    take: limit,
                    orderBy: { programacion: 'desc' },
                    include: {
                        Vegetacion: true,
                        BlancoBiologico: true,
                        Distrito: true,
                        Familia: true,
                        Gte: { select: { Usuario: { select: { nombres: true } } } },
                        PuntoContacto: true,
                    },
                });
            

            //return 
                //variedades.map((variedad) => ({
            return charlas.map((charla) => ({
                    id: charla.id,
                    tema: charla.tema,
                    asistentes: charla.asistentes,
                    hectareas: charla.hectareas,
                    dosis: charla.dosis,
                    efectivo: charla.efectivo,
                    comentarios: charla.comentarios,
                    demoplots: charla.demoplots,
                    estado: charla.estado,
                    programacion: charla.programacion,
                    ejecucion: charla.ejecucion,
                    cancelacion: charla.cancelacion,
                    motivo: charla.motivo,
                    idVegetacion: charla.idVegetacion,
                    idBlanco: charla.idBlanco,
                    idDistrito: charla.idDistrito,
                    idFamilia: charla.idFamilia,
                    idGte: charla.idGte,
                    idTienda: charla.idTienda,
                    createdAt: charla.createdAt,
                    createdBy: charla.createdBy,
                    updatedAt: charla.updatedAt,
                    updatedBy: charla.updatedBy
                }));
            
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getAsistenciasByIdCharla(idCharla: number, offset: number, limit: number) {
        try {
            const asistencias = await prisma.asistencia.findMany({
                skip: offset,
                take: limit,
                where: { idCharla },
                orderBy: { createdAt: 'desc' },
                include: {
                    Charla: true,
                    ContactoPunto: true,
                },
            });
    
            return { asistencias };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getCharlaById(id: number) {
        try {
            const charla = await prisma.charla.findUnique({
                where: { id },
                include: {
                    Vegetacion: true,
                    BlancoBiologico: true,
                    Distrito: true,
                    Familia: true,
                    Gte: { select: { Usuario: { select: { nombres: true } } } },
                    PuntoContacto: true,
                },
            });

            if (!charla) throw CustomError.badRequest(`Charla with id ${id} does not exist`);

            return charla;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
