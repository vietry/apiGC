import { CustomError } from "../errors/custom.error";

export class ContactoPuntoEntity {

    constructor(
        public id: number,
        public nombre: string,
        public apellido: string,
        public cargo: string,
        public correo: string | null,
        public celularA: string | null,
        public celularB: string | null,
        public idPunto: number,
        //public createdAt: Date | null,
        //public updatedAt: Date | null
    ) {}

    public static fromObject(object: { [key: string]: any }): ContactoPuntoEntity {
        const {
            id, nombre, apellido, cargo, correo, celularA, celularB, idPunto, /* createdAt, updatedAt */
        } = object;

        if (!nombre) throw CustomError.badRequest('Nombre is required');
        if (!apellido) throw CustomError.badRequest('Apellido is required');
        if (!cargo) throw CustomError.badRequest('Cargo is required');
        if (!idPunto) throw CustomError.badRequest('idPunto is required');

        return new ContactoPuntoEntity(
            id, nombre, apellido, cargo, correo, celularA, celularB, idPunto, 
            //createdAt, updatedAt
        );
    }
}