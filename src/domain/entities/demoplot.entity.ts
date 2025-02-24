import { CustomError } from '../errors/custom.error';

export class DemoPlotEntity {
    constructor(
        public id: number,
        public titulo: string | null,
        public objetivo: string | null,
        public hasCultivo: number | null,
        public programacion: Date | null,
        public instalacion: Date | null,
        public seguimiento: Date | null,
        public finalizacion: Date | null,
        public presentacion: Date | null,
        public estado: string | null,
        public gradoInfestacion: string | null,
        public dosis: number | null,
        public validacion: boolean | null,
        public resultado: string | null,
        public diaCampo: boolean | null,
        public idCultivo: number,
        public idContactoP: number,
        public idBlanco: number,
        public idDistrito: string,
        public idFamilia: number | null,
        public idGte: number,
        public idCharla: number | null,
        public fecVenta: Date | null,
        public venta: boolean | null,
        public cantidad: number | null,
        public importe: number | null,
        public createdBy: number | null,
        public updatedBy: number | null
    ) // public createdAt: Date | null,
    // public updatedAt: Date | null
    {}

    public static fromObject(object: { [key: string]: any }): DemoPlotEntity {
        const {
            id,
            titulo,
            objetivo,
            hasCultivo,
            programacion,
            instalacion,
            seguimiento,
            finalizacion,
            presentacion,
            estado,
            gradoInfestacion,
            dosis,
            validacion,
            resultado,
            diaCampo,
            idCultivo,
            idContactoP,
            idBlanco,
            idDistrito,
            idFamilia,
            idGte,
            idCharla,
            venta,
            fecVenta,
            cantidad,
            importe,
            //createdAt,
            createdBy,
            //updatedAt,
            updatedBy,
        } = object;

        if (!gradoInfestacion)
            throw CustomError.badRequest('GradoInfestacion is required');
        if (!hasCultivo) throw CustomError.badRequest('HasCultivo is required');
        if (!dosis) throw CustomError.badRequest('Dosis is required');

        if (!idCultivo) throw CustomError.badRequest('idCultivo is required');
        if (!idContactoP)
            throw CustomError.badRequest('idContactoP is required');
        if (!idBlanco) throw CustomError.badRequest('idBlanco is required');
        if (!idDistrito) throw CustomError.badRequest('idDistrito is required');
        if (!idGte) throw CustomError.badRequest('idGte is required');

        return new DemoPlotEntity(
            id,
            titulo,
            objetivo,
            hasCultivo,
            programacion,
            instalacion,
            seguimiento,
            finalizacion,
            presentacion,
            estado,
            gradoInfestacion,
            dosis,
            validacion,
            resultado,
            diaCampo,
            idCultivo,
            idContactoP,
            idBlanco,
            idDistrito,
            idFamilia,
            idGte,
            idCharla,
            fecVenta,
            venta,
            cantidad,
            importe,
            //createdAt,
            createdBy,
            //updatedAt,
            updatedBy
        );
    }
}
