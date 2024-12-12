import { CustomError } from "../../errors/custom.error";

export class CharlaProductoEntity {
    constructor(
        public id: number,
        public idCharla: number,
        public idFamilia: number,
        public idBlanco: number | null,
        public createdAt: Date | null,
        public createdBy: number | null,
        public updatedAt: Date | null,
        public updatedBy: number | null
    ) {}

    public static fromObject(object: { [key: string]: any }): CharlaProductoEntity {
        const {
            id,
            idCharla,
            idFamilia,
            idBlanco,
            createdAt,
            createdBy,
            updatedAt,
            updatedBy
        } = object;

        if (!idCharla) throw CustomError.badRequest('idCharla is required');
        if (!idFamilia) throw CustomError.badRequest('idFamilia is required');

        return new CharlaProductoEntity(
            id,
            idCharla,
            idFamilia,
            idBlanco,
            createdAt ? new Date(createdAt) : null, // Convierte a Date si existe
            createdBy,
            updatedAt ? new Date(updatedAt) : null, // Convierte a Date si existe
            updatedBy
        );
    }
}