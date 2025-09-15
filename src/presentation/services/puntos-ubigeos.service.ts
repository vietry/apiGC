import { prisma } from '../../data/sqlserver';
import {
    CreatePuntoUbigeoDto,
    UpdatePuntoUbigeoDto,
    CustomError,
} from '../../domain';

export class PuntoUbigeoService {
    async createPuntoUbigeo(createPuntoUbigeoDto: CreatePuntoUbigeoDto) {
        try {
            const currentDate = new Date();

            const puntoUbigeo = await prisma.puntoUbigeo.create({
                data: {
                    idPunto: createPuntoUbigeoDto.idPunto,
                    idDistrito: createPuntoUbigeoDto.idDistrito,
                    createdAt: currentDate,
                    updatedAt: currentDate,
                },
            });

            return {
                id: puntoUbigeo.id,
                idPunto: puntoUbigeo.idPunto,
                idDistrito: puntoUbigeo.idDistrito,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updatePuntoUbigeo(updatePuntoUbigeoDto: UpdatePuntoUbigeoDto) {
        const puntoUbigeoExists = await prisma.puntoUbigeo.findFirst({
            where: { id: updatePuntoUbigeoDto.id },
        });
        if (!puntoUbigeoExists)
            throw CustomError.badRequest(
                `PuntoUbigeo with id ${updatePuntoUbigeoDto.id} does not exist`
            );

        try {
            const updatedPuntoUbigeo = await prisma.puntoUbigeo.update({
                where: { id: updatePuntoUbigeoDto.id },
                data: {
                    ...updatePuntoUbigeoDto.values, // Usar valores directamente del DTO
                    updatedAt: new Date(),
                },
            });

            return updatedPuntoUbigeo;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    // async getPuntosUbigeoByPuntoId(idPunto: number) {
    //     try {
    //         const puntosUbigeo = await prisma.puntoUbigeo.findMany({
    //             where: { idPunto },
    //             include: {
    //                 PuntoContacto: {
    //                     select: {
    //                         nombre: true,
    //                     },
    //                 },
    //                 Distrito: {
    //                     select: {
    //                         nombre: true,
    //                     },
    //                 },
    //             },
    //         });

    //         //if (puntosUbigeo.length === 0) throw CustomError.badRequest(`No PuntosUbigeo found with Punto id ${idPunto}`);

    //         return puntosUbigeo.map((puntoUbigeo) => ({
    //             id: puntoUbigeo.id,
    //             idPunto: puntoUbigeo.idPunto,
    //             idDistrito: puntoUbigeo.idDistrito,
    //             createdAt: puntoUbigeo.createdAt,
    //             updatedAt: puntoUbigeo.updatedAt,
    //         }));
    //     } catch (error) {
    //         throw CustomError.internalServer(`${error}`);
    //     }
    // }

    async getPuntosUbigeo() {
        try {
            const puntosUbigeo = await prisma.puntoUbigeo.findMany();

            return puntosUbigeo.map((puntoUbigeo) => ({
                id: puntoUbigeo.id,
                idPunto: puntoUbigeo.idPunto,
                idDistrito: puntoUbigeo.idDistrito,
                createdAt: puntoUbigeo.createdAt,
                updatedAt: puntoUbigeo.updatedAt,
            }));
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getPuntoUbigeoById(id: number) {
        try {
            const puntoUbigeo = await prisma.puntoUbigeo.findUnique({
                where: { id },
            });

            if (!puntoUbigeo)
                throw CustomError.badRequest(
                    `PuntoUbigeo with id ${id} does not exist`
                );

            return puntoUbigeo;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getPuntoUbigeoByPuntoId(idPuntoContacto: number) {
        try {
            const puntoUbigeo = await prisma.puntoUbigeo.findFirst({
                where: { idPunto: idPuntoContacto },
            });

            if (!puntoUbigeo)
                throw CustomError.badRequest(
                    `PuntoUbigeo with id ${idPuntoContacto} does not exist`
                );

            return {
                id: puntoUbigeo.id,
                idPunto: puntoUbigeo.idPunto,
                idDistrito: puntoUbigeo.idDistrito,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
