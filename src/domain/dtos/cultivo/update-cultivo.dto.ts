export class UpdateCultivoDto {
    private constructor(
        public readonly id: number,
        public readonly certificacion?: string | null,
        public readonly hectareas?: number | null,
        public readonly mesInicio?: string | null,
        public readonly mesFinal?: string | null,
        public readonly observacion?: string | null,
        public readonly idFundo?: number,
        public readonly idVariedad?: number,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.certificacion) returnObj.certificacion = this.certificacion;
        if (this.hectareas) returnObj.hectareas = this.hectareas;
        if (this.mesInicio) returnObj.mesInicio = this.mesInicio;
        if (this.mesFinal) returnObj.mesFinal = this.mesFinal;
        if (this.observacion) returnObj.observacion = this.observacion;
        if (this.idFundo) returnObj.idFundo = this.idFundo;
        if (this.idVariedad) returnObj.idVariedad = this.idVariedad;

        return returnObj;
    }

    static async create(props: { [key: string]: any }): Promise<[string?, UpdateCultivoDto?]> {
        const { id, certificacion, hectareas, mesInicio, mesFinal, observacion, idFundo, idVariedad } = props;

        if (!id || isNaN(Number(id))) return ['ID inválido o faltante'];

        let idFundoNumber = idFundo;
        let idVariedadNumber = idVariedad;

        if (idFundo !== undefined && typeof idFundo !== 'number') {
            idFundoNumber = parseInt(idFundo);
            if (isNaN(idFundoNumber)) return ['idFundo debe ser un número válido'];
        }

        if (idVariedad !== undefined && typeof idVariedad !== 'number') {
            idVariedadNumber = parseInt(idVariedad);
            if (isNaN(idVariedadNumber)) return ['idVariedad debe ser un número válido'];
        }

        return [
            undefined,
            new UpdateCultivoDto(
                id,
                certificacion,
                hectareas,
                mesInicio,
                mesFinal,
                observacion,
                idFundoNumber,
                idVariedadNumber
            )
        ];
    }
}
