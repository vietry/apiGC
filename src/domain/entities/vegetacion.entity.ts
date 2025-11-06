import { CustomError } from '../errors/custom.error';

export class VegetacionEntity {
    constructor(
        public id: number,
        public nombre: string,
        public updatedAt: Date | null,
        public createdAt: Date | null,
        public tipo?: string,
        public nomColombia?: string
    ) {}

    public static fromObject(object: { [key: string]: any }): VegetacionEntity {
        const { id, nombre, tipo, updatedAt, createdAt, nomColombia } = object;

        if (!id) throw CustomError.badRequest('ID is required');
        if (!nombre) throw CustomError.badRequest('Nombre is required');

        return new VegetacionEntity(
            id,
            nombre,
            updatedAt,
            createdAt,
            tipo,
            nomColombia
        );
    }
}
