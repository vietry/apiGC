import { CustomError } from '../../domain';

export class VisitaGteTiendaEntity {
    constructor(
        public id: number,
        public idGte: number,
        public idPunto: number,
        public idFamilia: number | null,
        public idFoto: number | null,
        public objetivo: string,
        public comentarios: string | null,
        public cantidad: number | null,
        public latitud: number | null,
        public longitud: number | null,
        public createdAt: Date | null
    ) {}

    public static fromObject(object: {
        [key: string]: any;
    }): VisitaGteTiendaEntity {
        const {
            id,
            idGte,
            idPunto,
            idFamilia,
            idFoto,
            objetivo,
            comentarios,
            cantidad,
            latitud,
            longitud,
            createdAt,
        } = object;

        if (idGte === undefined || idGte === null)
            throw CustomError.badRequest('idGte is required');
        if (idPunto === undefined || idPunto === null)
            throw CustomError.badRequest('idPunto is required');
        if (!objetivo) throw CustomError.badRequest('objetivo is required');

        return new VisitaGteTiendaEntity(
            id,
            idGte,
            idPunto,
            idFamilia,
            idFoto,
            objetivo,
            comentarios ?? null,
            cantidad,
            latitud !== undefined ? Number(latitud) : null,
            longitud !== undefined ? Number(longitud) : null,
            createdAt ? new Date(createdAt) : null
        );
    }
}
