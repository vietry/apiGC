import { CustomError } from '../errors/custom.error';

export class RegistroLaboralEntity {
    constructor(
        public id: number,
        public ingreso: Date | null,
        public cese: Date | null,
        public idGte: number,
        public createdAt: Date | null,
        public createdBy: number | null,
        public updatedAt: Date | null,
        public updatedBy: number | null
    ) {}

    public static fromObject(object: {
        [key: string]: any;
    }): RegistroLaboralEntity {
        const {
            id,
            ingreso,
            cese,
            idGte,
            createdAt,
            createdBy,
            updatedAt,
            updatedBy,
        } = object;

        if (!idGte) throw CustomError.badRequest('idGte is required');

        return new RegistroLaboralEntity(
            id,
            ingreso,
            cese,
            idGte,
            createdAt,
            createdBy,
            updatedAt,
            updatedBy
        );
    }
}
