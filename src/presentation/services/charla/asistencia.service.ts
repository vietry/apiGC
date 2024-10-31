import { prisma } from "../../../data/sqlserver";
import { CreateAsistenciaDto, CustomError, UpdateAsistenciaDto } from "../../../domain";


export class AsistenciaService {
    constructor() {}

    async createAsistencia(createAsistenciaDto: CreateAsistenciaDto) {
        try {
            const currentDate = new Date();

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
        const asistenciaExists = await prisma.asistencia.findFirst({ where: { id: updateAsistenciaDto.id } });
        if (!asistenciaExists) throw CustomError.badRequest(`Asistencia with id ${updateAsistenciaDto.id} does not exist`);

        try {
            const updatedAsistencia = await prisma.asistencia.update({
                where: { id: updateAsistenciaDto.id },
                data: {
                    ...updateAsistenciaDto.values,
                    updatedAt: new Date(),
                },
            });

            return updatedAsistencia;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getAsistencias(offset: number, limit: number) {
        try {
            const asistencias = await
                prisma.asistencia.findMany({
                    skip: (offset - 1) * limit,
                    take: limit,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        Charla: true,
                        ContactoPunto: true,
                    },
                });
            

            return {

                asistencias,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getAsistenciasByIdCharla(idCharla: number, offset: number, limit: number) {
        try {
            const asistencias = await prisma.asistencia.findMany({
                skip: (offset - 1) * limit,
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

    async getAsistenciaById(id: number) {
        try {
            const asistencia = await prisma.asistencia.findUnique({
                where: { id },
                include: {
                    Charla: true,
                    ContactoPunto: true,
                },
            });

            if (!asistencia) throw CustomError.badRequest(`Asistencia with id ${id} does not exist`);

            return asistencia;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
