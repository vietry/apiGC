import { CustomError } from '../../domain';

export class VisitaProductoEntity {
    constructor(
        public id: number,
        public idVisita: number,
        // idFamilia ahora referencia a FamiliaVisita.id
        public idFamilia: number
    ) {}

    public static fromObject(object: {
        [key: string]: any;
    }): VisitaProductoEntity {
        const { id, idVisita, idFamilia } = object;

        if (!idVisita) throw CustomError.badRequest('idVisita is required');
        if (!idFamilia)
            throw CustomError.badRequest(
                'idFamilia (FamiliaVisita) is required'
            );

        return new VisitaProductoEntity(id, idVisita, idFamilia);
    }
}
