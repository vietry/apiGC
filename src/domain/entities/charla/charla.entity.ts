import { CustomError } from "../../errors/custom.error";

export class CharlaEntity {
    constructor(
        public id: number,
        public tema: string | null,
        public asistentes: number | null,
        public hectareas: number | null,
        public dosis: number | null,
        public efectivo: boolean | null,
        public comentarios: string | null,
        public demoplots: number | null,
        public estado: string | null,
        public programacion: Date | null,
        public ejecucion: Date | null,
        public cancelacion: Date | null,
        public motivo: string | null,
        public idVegetacion: number,
        public idBlanco: number,
        public idDistrito: string | null,
        public idFamilia: number | null,
        public idGte: number,
        public idTienda: number,
        //public createdAt: Date | null,
        public createdBy: number | null,
        //public updatedAt: Date | null,
        public updatedBy: number | null
    ) {}

    public static fromObject(object: { [key: string]: any }): CharlaEntity {
        const {
            id, tema, asistentes, hectareas, dosis, efectivo, comentarios, demoplots, estado,
            programacion, ejecucion, cancelacion, motivo, idVegetacion, idBlanco, idDistrito,
            idFamilia, idGte, idTienda, 
            //createdAt, 
            createdBy, 
            //updatedAt, 
            updatedBy
        } = object;

        if (!idVegetacion) throw CustomError.badRequest('idVegetacion is required');
        if (!idBlanco) throw CustomError.badRequest('idBlanco is required');
        if (!idGte) throw CustomError.badRequest('idGte is required');
        if (!idTienda) throw CustomError.badRequest('idTienda is required');

        return new CharlaEntity(
            id, tema, asistentes, hectareas, dosis, efectivo, comentarios, demoplots, estado,
            programacion, ejecucion, cancelacion, motivo, idVegetacion, idBlanco, idDistrito,
            idFamilia, idGte, idTienda, 
            //createdAt, 
            createdBy, 
            //updatedAt, 
            updatedBy,
        );
    }
}