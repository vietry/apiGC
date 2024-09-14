import { CustomError } from "../errors/custom.error";

export class PuntoContactoEntity {

    constructor(
        public id: number,
        public nombre: string,
        public tipoDoc: string | null,
        public numDoc: string | null,
        public hectareas: number | null,
        public tipo: string,
        public dirReferencia: string | null,
        public lider: boolean | null,
        public activo: boolean,
        public idGte: number | null,
        public idDistrito: string,
        public idEmpresa: number | null,
        public codZona: string | null,
        //public createdAt: Date | null,
        //public updatedAt: Date | null
    ) {}

    public static fromObject(object: { [key: string]: any }): PuntoContactoEntity {
        const {
            id, nombre, tipoDoc, numDoc, hectareas, tipo, dirReferencia, lider, activo, idGte, idDistrito,idEmpresa,codZona,createdAt, updatedAt
        } = object;

        if (!nombre) throw CustomError.badRequest('Nombre is required');
        if (!activo) throw CustomError.badRequest('Activo is required');
        if (!tipoDoc) throw CustomError.badRequest('Tipo documento is required');
        if (!idGte) throw CustomError.badRequest('idGte is required');
        if (!idDistrito) throw CustomError.badRequest('idDistrito is required');
        if (!tipo) throw CustomError.badRequest('Tipo is required');

        return new PuntoContactoEntity(
            id, nombre, tipoDoc, numDoc, hectareas, tipo, dirReferencia, lider, activo, idGte, idDistrito,idEmpresa,codZona//createdAt, updatedAt
        );
    }
}