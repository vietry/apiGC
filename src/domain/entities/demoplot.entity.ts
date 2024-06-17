import { CustomError } from "../errors/custom.error";

export class DemoPlotEntity {

    constructor(
        public id: number,
        public titulo: string | null,
        public objetivo: string | null,
        public hasCultivo: number | null,
        public instalacion: Date | null,
        public seguimiento: Date | null,
        public finalizacion: Date | null,
        public estado: string | null,
        public gradoInfestacion: string | null,
        public dosis: number | null,
        public validacion: boolean | null,
        public resultado: string | null,
        public idCultivo: number,
        public idContactoP: number,
        public idBlanco: number,
        public idDistrito: string,
        public idArticulo: number | null,
        public idGte: number,
        // public createdAt: Date | null,
        // public updatedAt: Date | null
    ) {}

    public static fromObject(object: { [key: string]: any }): DemoPlotEntity {
        const {
            id, titulo, objetivo, hasCultivo, instalacion, seguimiento, finalizacion,
            estado, gradoInfestacion, dosis, validacion, resultado, idCultivo, idContactoP,
            idBlanco, idDistrito, idArticulo, idGte, /* createdAt, updatedAt */
        } = object;

        if (!gradoInfestacion) throw CustomError.badRequest('GradoInfestacion is required');
        if (!hasCultivo) throw CustomError.badRequest('HasCultivo is required');
        if (!dosis) throw CustomError.badRequest('Dosis is required');

        if (!idCultivo) throw CustomError.badRequest('idCultivo is required');
        if (!idContactoP) throw CustomError.badRequest('idContactoP is required');
        if (!idBlanco) throw CustomError.badRequest('idBlanco is required');
        if (!idDistrito) throw CustomError.badRequest('idDistrito is required');
        if (!idGte) throw CustomError.badRequest('idGte is required');

        return new DemoPlotEntity(
            id, titulo, objetivo, hasCultivo, instalacion, seguimiento, finalizacion,
            estado, gradoInfestacion, dosis, validacion, resultado, idCultivo, idContactoP,
            idBlanco, idDistrito, idArticulo, idGte, 
            // createdAt, updatedAt
        );
    }
}