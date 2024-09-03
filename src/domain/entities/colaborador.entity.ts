import { CustomError } from "../errors/custom.error";

export class ColaboradorEntity {

    constructor(
        public id: number,
        public cargo: string | null,
        public idArea: number,
        public idZonaAnt: number | null,
        public idUsuario: number,
        //public createdAt: Date | null,
        //public updatedAt: Date | null
    ){}

    public static fromObject(object: {[key: string]: any}): ColaboradorEntity {
        const {id, cargo, idArea, idZonaAnt, idUsuario,/* createdAt, updatedAt*/} = object; 
        //if (!id) throw CustomError.badRequest('ID is required');
        if (!idArea) throw CustomError.badRequest('idArea is required');
        //if (!idZonaAnt) throw CustomError.badRequest('idZonaAnt is required');
        if (!idUsuario) throw CustomError.badRequest('idUsuario is required');

        return new ColaboradorEntity(
            id, cargo, idArea, idZonaAnt, idUsuario, 
            //createdAt, updatedAt
        )
    }
}