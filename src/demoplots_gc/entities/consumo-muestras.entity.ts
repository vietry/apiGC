import { CustomError } from '../../domain';

export class ConsumoMuestrasEntity {
    constructor(
        public id: number,
        public idEntrega: number,
        public idDemoplot: number,
        public consumo: number,
        public complemento: number | null,
        public fechaConsumo: Date | null,
        public comentarios: string | null,
        public createdAt: Date | null,
        public updatedAt: Date | null,
        public createdBy: number | null,
        public updatedBy: number | null
    ) {}

    public static fromObject(object: {
        [key: string]: any;
    }): ConsumoMuestrasEntity {
        const {
            id,
            idEntrega,
            idDemoplot,
            consumo,
            complemento,
            fechaConsumo,
            comentarios,
            createdAt,
            updatedAt,
            createdBy,
            updatedBy,
        } = object;

        if (!idEntrega) throw CustomError.badRequest('idEntrega is required');
        if (!idDemoplot) throw CustomError.badRequest('idDemoplot is required');
        if (!consumo) throw CustomError.badRequest('consumo is required');

        return new ConsumoMuestrasEntity(
            id,
            idEntrega,
            idDemoplot,
            consumo,
            complemento,
            fechaConsumo,
            comentarios,
            createdAt,
            updatedAt,
            createdBy,
            updatedBy
        );
    }
}
