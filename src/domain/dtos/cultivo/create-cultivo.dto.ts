export class CreateCultivoDto {
    private constructor(
        public readonly certificacion: string | null,
        public readonly hectareas: number | null,
        public readonly mesInicio: string | null,
        public readonly mesFinal: string | null,
        public readonly observacion: string | null,
        public readonly poblacion: number | null,
        public readonly idFundo: number,
        public readonly idVariedad: number,
        public readonly nomAsesor: string | null,
        public readonly numAsesor: string | null
    ) {}

    static async create(object: {
        [key: string]: any;
    }): Promise<[string?, CreateCultivoDto?]> {
        const {
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
        } = object;

        let hectareasNumber = hectareas;
        let poblacionNumber = poblacion;
        let idFundoNumber = idFundo;
        let idVariedadNumber = idVariedad;

        if (!idFundo) return ['ID de Fundo faltante'];
        if (!idVariedad) return ['ID de Variedad faltante'];

        if (typeof idFundo !== 'number') {
            idFundoNumber = parseInt(idFundo);
            if (isNaN(idFundoNumber))
                return ['idFundo debe ser un número válido'];
        }

        if (typeof idVariedad !== 'number') {
            idVariedadNumber = parseInt(idVariedad);
            if (isNaN(idVariedadNumber))
                return ['idVariedad debe ser un número válido'];
        }

        if (typeof hectareas !== 'number') {
            hectareasNumber = parseFloat(hectareas);
        }

        if (poblacion !== undefined && typeof poblacion !== 'number') {
            poblacionNumber = parseFloat(poblacion);
        }

        return [
            undefined,
            new CreateCultivoDto(
                certificacion,
                hectareasNumber,
                mesInicio,
                mesFinal,
                observacion,
                poblacionNumber ?? null,
                idFundoNumber,
                idVariedadNumber,
                nomAsesor ?? null,
                numAsesor ?? null
            ),
        ];
    }
}
