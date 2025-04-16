import { CustomError } from '../../domain';

export class EntregaMuestrasEntity {
    constructor(
        public id: number,
        public idFamilia: number,
        public idGte: number,
        public presentacion: number | null,
        public unidades: number | null,
        public total: number | null,
        public agotado: boolean | null,
        public precio: number | null,
        public perdida: number | null,
        public facturacion: Date | null,
        public recepcion: Date | null,
        public createdAt: Date | null,
        public updatedAt: Date | null,
        public createdBy: number | null,
        public updatedBy: number | null
    ) {}

    public static fromObject(object: {
        [key: string]: any;
    }): EntregaMuestrasEntity {
        const {
            id,
            idFamilia,
            idGte,
            presentacion,
            unidades,
            total,
            agotado,
            precio,
            perdida,
            facturacion,
            recepcion,
            createdAt,
            updatedAt,
            createdBy,
            updatedBy,
        } = object;

        if (!idFamilia) throw CustomError.badRequest('idFamilia is required');
        if (!idGte) throw CustomError.badRequest('idGte is required');

        return new EntregaMuestrasEntity(
            id,
            idFamilia,
            idGte,
            presentacion,
            unidades,
            total,
            agotado,
            precio,
            perdida,
            facturacion,
            recepcion,
            createdAt,
            updatedAt,
            createdBy,
            updatedBy
        );
    }
}
