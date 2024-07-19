import { CustomError } from "../errors/custom.error";

export class BlancoBiologicoEntity {
    constructor(
        public id: number,
        public cientifico: string | null,
        public estandarizado: string | null,
        public idVegetacion: number,
        public createdAt: Date | null,
        public updatedAt: Date | null
    ) {}

    public static fromObject(object: { [key: string]: any }): BlancoBiologicoEntity {
        const {
            id, cientifico, estandarizado, idVegetacion, createdAt, updatedAt
        } = object;

        if (!id) throw CustomError.badRequest('ID is required');
        if (!idVegetacion) throw CustomError.badRequest('ID Vegetacion is required');

        return new BlancoBiologicoEntity(
            id, cientifico, estandarizado, idVegetacion, createdAt, updatedAt
        );
    }
}