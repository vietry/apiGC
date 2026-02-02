export class UpdateCultivoDto {
    private constructor(
        public readonly id: number,
        public readonly certificacion?: string | null,
        public readonly hectareas?: number | null,
        public readonly mesInicio?: string | null,
        public readonly mesFinal?: string | null,
        public readonly observacion?: string | null,
        public readonly poblacion?: number | null,
        public readonly idFundo?: number,
        public readonly idVariedad?: number,
        public readonly nomAsesor?: string | null,
        public readonly numAsesor?: string | null,
        public readonly cargoAsesor?: string | null
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.certificacion) returnObj.certificacion = this.certificacion;
        if (this.hectareas) returnObj.hectareas = this.hectareas;
        if (this.mesInicio) returnObj.mesInicio = this.mesInicio;
        if (this.mesFinal) returnObj.mesFinal = this.mesFinal;
        if (this.observacion) returnObj.observacion = this.observacion;
        if (this.poblacion !== undefined) returnObj.poblacion = this.poblacion;
        if (this.idFundo) returnObj.idFundo = this.idFundo;
        if (this.idVariedad) returnObj.idVariedad = this.idVariedad;
        if (this.nomAsesor !== undefined) returnObj.nomAsesor = this.nomAsesor;
        if (this.numAsesor !== undefined) returnObj.numAsesor = this.numAsesor;
        if (this.cargoAsesor !== undefined)
            returnObj.cargoAsesor = this.cargoAsesor;

        return returnObj;
    }

    static async create(props: {
        [key: string]: any;
    }): Promise<[string?, UpdateCultivoDto?]> {
        const {
            id,
            certificacion,
            hectareas,
            mesInicio,
            mesFinal,
            observacion,
            poblacion,
            idFundo,
            idVariedad,
            nomAsesor,
            numAsesor,
            cargoAsesor,
        } = props;

        if (!id || isNaN(Number(id))) return ['ID inválido o faltante'];

        let idFundoNumber = idFundo;
        let idVariedadNumber = idVariedad;
        let hectareasNumber = hectareas;
        let poblacionNumber = poblacion;

        if (idFundo !== undefined && typeof idFundo !== 'number') {
            idFundoNumber = parseInt(idFundo);
            if (isNaN(idFundoNumber))
                return ['idFundo debe ser un número válido'];
        }

        if (idVariedad !== undefined && typeof idVariedad !== 'number') {
            idVariedadNumber = parseInt(idVariedad);
            if (isNaN(idVariedadNumber))
                return ['idVariedad debe ser un número válido'];
        }

        if (hectareas !== undefined && typeof hectareas !== 'number') {
            hectareasNumber = parseFloat(hectareas);
        }

        if (poblacion !== undefined && typeof poblacion !== 'number') {
            poblacionNumber = parseFloat(poblacion);
        }

        // Validación de cargoAsesor
        if (cargoAsesor !== undefined && typeof cargoAsesor !== 'string') {
            return ['cargoAsesor debe ser una cadena de texto'];
        }

        if (cargoAsesor && cargoAsesor.length > 50) {
            return ['cargoAsesor no puede exceder los 50 caracteres'];
        }

        return [
            undefined,
            new UpdateCultivoDto(
                id,
                certificacion,
                hectareasNumber,
                mesInicio,
                mesFinal,
                observacion,
                poblacionNumber,
                idFundoNumber,
                idVariedadNumber,
                nomAsesor,
                numAsesor,
                cargoAsesor
            ),
        ];
    }
}
