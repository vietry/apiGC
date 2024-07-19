import { CustomError } from "../errors/custom.error";

export class CultivoEntity {
    constructor(
        public id: number,
        public certificacion: string | null,
        public hectareas: number | null,
        public mesInicio: string | null,
        public mesFinal: string | null,
        public observacion: string | null,
        public idFundo: number,
        public idVariedad: number,
        public createdAt: Date | null,
        public updatedAt: Date | null
    ) {}

    public static fromObject(object: { [key: string]: any }): CultivoEntity {
        const {
            id, certificacion, hectareas, mesInicio, mesFinal,
            observacion, idFundo, idVariedad, createdAt, updatedAt
        } = object;

        if (!id) throw CustomError.badRequest('ID is required');
        if (!idFundo) throw CustomError.badRequest('ID Fundo is required');
        if (!idVariedad) throw CustomError.badRequest('ID Variedad is required');

        return new CultivoEntity(
            id, certificacion, hectareas, mesInicio, mesFinal, observacion,
            idFundo, idVariedad, createdAt, updatedAt
        );
    }
}