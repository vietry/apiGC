import { CustomError } from "../errors/custom.error";

export class PuntoUbigeoEntity {
    constructor(
        public id: number,
        public idPunto: number,
        public idDistrito: string,
        public createdAt: Date | null,
        public updatedAt: Date | null
    ) {}

    public static fromObject(object: { [key: string]: any }): PuntoUbigeoEntity {
        const {
            id, idPunto, idDistrito, createdAt, updatedAt
        } = object;

        if (!id) throw CustomError.badRequest('ID is required');
        if (!idPunto) throw CustomError.badRequest('ID Punto is required');
        if (!idDistrito) throw CustomError.badRequest('ID Distrito is required');

        return new PuntoUbigeoEntity(
            id, idPunto, idDistrito, createdAt, updatedAt
        );
    }
}