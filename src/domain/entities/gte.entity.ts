import { CustomError } from "../errors/custom.error";

export class GteEntity {

    constructor(
        public id: number,
        public activo: boolean | null,
        public idSubZona: number,
        public idColaborador: number,
        public idUsuario: number,
        public createdAt: Date | null,
        public updatedAt: Date | null
    ) {}

    public static fromObject(object: {[key: string]: any}): GteEntity {
        const { id, activo, idSubZona, idColaborador, idUsuario, createdAt, updatedAt } = object;
        if (!id) throw CustomError.badRequest('ID is required');
        if (!idSubZona) throw CustomError.badRequest('ID SubZona is required');
        if (!idColaborador) throw CustomError.badRequest('ID Colaborador is required');
        if (!idUsuario) throw CustomError.badRequest('ID Usuario is required');

        return new GteEntity(
            id, activo, idSubZona, idColaborador, idUsuario, createdAt, updatedAt
        );
    }
}