import { CustomError } from '../errors/custom.error';

export class ExternoEntity {
    constructor(
        public id: number,
        public cargo: string | null,
        public idRepresentada: number,
        public idUsuario: number | null,
        public createdAt: Date | null,
        public updatedAt: Date | null
    ) {}

    public static fromObject(object: { [key: string]: any }): ExternoEntity {
        const { id, cargo, idRepresentada, idUsuario, createdAt, updatedAt } =
            object;

        if (!idRepresentada)
            throw CustomError.badRequest('idRepresentada is required');
        if (!idUsuario) throw CustomError.badRequest('idUsuario is required');

        return new ExternoEntity(
            id,
            cargo,
            idRepresentada,
            idUsuario,
            createdAt,
            updatedAt
        );
    }
}
