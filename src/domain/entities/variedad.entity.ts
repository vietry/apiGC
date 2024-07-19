import { CustomError } from "../errors/custom.error";

export class VariedadEntity {
    constructor(
        public id: number,
        public nombre: string,
        public idVegetacion: number,
        public idFoto: number | null,
        public createdAt: Date | null,
        public updatedAt: Date | null
    ) {}

    public static fromObject(object: { [key: string]: any }): VariedadEntity {
        const { id, nombre, idVegetacion, idFoto, createdAt, updatedAt } = object;

        if (!id) throw CustomError.badRequest('ID is required');
        if (!nombre) throw CustomError.badRequest('Nombre is required');
        if (!idVegetacion) throw CustomError.badRequest('ID Vegetacion is required');

        return new VariedadEntity(
            id, nombre, idVegetacion, idFoto, createdAt, updatedAt
        );
    }
}