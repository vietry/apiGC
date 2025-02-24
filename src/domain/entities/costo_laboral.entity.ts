import { CustomError } from '../errors/custom.error';

export class CostoLaboralEntity {
    constructor(
        public id: number,
        public conteo1: number | null,
        public conteo2: number | null,
        public diacampo: number | null,
        public sueldo: number | null,
        public viaticos: number | null,
        public moto: number | null,
        public linea: number | null,
        public celular: number | null,
        public servGte: number | null,
        public year: number,
        public month: number,
        public createdAt: Date | null,
        public createdBy: number | null,
        public updatedAt: Date | null,
        public updatedBy: number | null
    ) {}

    public static fromObject(object: {
        [key: string]: any;
    }): CostoLaboralEntity {
        const {
            id,
            conteo1,
            conteo2,
            diacampo,
            sueldo,
            viaticos,
            moto,
            linea,
            celular,
            servGte,
            year,
            month,
            createdAt,
            createdBy,
            updatedAt,
            updatedBy,
        } = object;

        if (!id) throw CustomError.badRequest('ID is required');
        if (!year) throw CustomError.badRequest('Year is required');
        if (!month) throw CustomError.badRequest('Month is required');

        return new CostoLaboralEntity(
            id,
            conteo1,
            conteo2,
            diacampo,
            sueldo,
            viaticos,
            moto,
            linea,
            celular,
            servGte,
            year,
            month,
            createdAt,
            createdBy,
            updatedAt,
            updatedBy
        );
    }
}
