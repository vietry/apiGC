import { CustomError } from '../errors/custom.error';

export class ContactoPuntoEntity {
    constructor(
        public id: number,
        public nombre: string,
        public apellido: string,
        public cargo: string,
        public tipo: string,
        public email: string | null,
        public celularA: string | null,
        public celularB: string | null,
        public activo: boolean | null,
        public idPunto: number,
        public idGte: number | null,
        public nomAsesor: string | null,
        public numAsesor: string | null,
        public referente: boolean | null //public createdAt: Date | null,
    ) //public updatedAt: Date | null
    {}

    public static fromObject(object: {
        [key: string]: any;
    }): ContactoPuntoEntity {
        const {
            id,
            nombre,
            apellido,
            cargo,
            tipo,
            email,
            celularA,
            celularB,
            activo,
            idPunto,
            idGte,
            nomAsesor,
            numAsesor,
            referente /* createdAt, updatedAt */,
        } = object;

        if (!nombre) throw CustomError.badRequest('Nombre is required');
        if (!apellido) throw CustomError.badRequest('Apellido is required');
        if (!cargo) throw CustomError.badRequest('Cargo is required');
        if (!tipo) throw CustomError.badRequest('Tipo is required');
        if (!idPunto) throw CustomError.badRequest('idPunto is required');

        return new ContactoPuntoEntity(
            id,
            nombre,
            apellido,
            cargo,
            tipo,
            email,
            celularA,
            celularB,
            activo,
            idPunto,
            idGte,
            nomAsesor,
            numAsesor,
            referente
            //createdAt, updatedAt
        );
    }
}
