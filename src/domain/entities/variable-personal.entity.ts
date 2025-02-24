import { CustomError } from '../errors/custom.error';

export class VariablePersonalEntity {
    constructor(
        public id: number,
        public variable: number | null,
        public bono10: number | null,
        public vidaLey: number | null,
        public beneficio: number | null,
        public sctr: number | null,
        public total: number | null,
        public year: number,
        public month: number,
        public idGte: number,
        public createdAt: Date | null,
        public createdBy: number | null,
        public updatedAt: Date | null,
        public updatedBy: number | null
    ) {}

    public static fromObject(object: {
        [key: string]: any;
    }): VariablePersonalEntity {
        const {
            id,
            variable,
            bono10,
            vidaLey,
            beneficio,
            sctr,
            total,
            year,
            month,
            idGte,
            createdAt,
            createdBy,
            updatedAt,
            updatedBy,
        } = object;

        if (!id) throw CustomError.badRequest('ID is required');
        if (!year) throw CustomError.badRequest('Year is required');
        if (!month) throw CustomError.badRequest('Month is required');
        if (!idGte) throw CustomError.badRequest('idGte is required');

        return new VariablePersonalEntity(
            id,
            variable ?? null,
            bono10 ?? null,
            vidaLey ?? null,
            beneficio ?? null,
            sctr ?? null,
            total ?? null,
            year,
            month,
            idGte,
            createdAt ? new Date(createdAt) : null,
            createdBy,
            updatedAt ? new Date(updatedAt) : null,
            updatedBy
        );
    }
}
