import { CustomError } from '../../domain';

export class LaborVisitaEntity {
    constructor(
        public id: number,
        public idVisita: number,
        public idSubLabor: number,
        public idRepresentada: number | null
    ) {}

    public static fromObject(object: {
        [key: string]: any;
    }): LaborVisitaEntity {
        const { id, idVisita, idSubLabor, idRepresentada } = object;

        if (!idVisita) throw CustomError.badRequest('idVisita is required');
        if (!idSubLabor) throw CustomError.badRequest('idSubLabor is required');

        return new LaborVisitaEntity(
            id,
            idVisita,
            idSubLabor,
            idRepresentada || null
        );
    }
}
