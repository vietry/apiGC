export class UpdateVideoDemoplotDto {
    private constructor(
        public readonly id: number,
        public readonly idDemoplot?: number,
        public readonly comentario?: string | null,
        public readonly duracion?: number | null,
        public readonly peso?: number | null, // Peso en MB
        public readonly activo?: boolean,
        public readonly updatedBy?: number | null
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};

        if (this.idDemoplot !== undefined)
            returnObj.idDemoplot = this.idDemoplot;
        if (this.comentario !== undefined)
            returnObj.comentario = this.comentario;
        if (this.duracion !== undefined) returnObj.duracion = this.duracion;
        if (this.peso !== undefined) returnObj.peso = this.peso;
        if (this.activo !== undefined) returnObj.activo = this.activo;
        if (this.updatedBy !== undefined) returnObj.updatedBy = this.updatedBy;

        return returnObj;
    }

    static async create(object: {
        [key: string]: any;
    }): Promise<[string?, UpdateVideoDemoplotDto?]> {
        const {
            id,
            idDemoplot,
            comentario,
            duracion,
            peso,
            activo,
            updatedBy,
        } = object;

        let idNumber = id;
        let idDemoplotNumber = idDemoplot;
        let duracionNumber = duracion;
        let pesoNumber = peso;
        let updatedByN = updatedBy;

        if (!id) return ['id faltante'];

        if (id !== undefined && typeof id !== 'number') {
            idNumber = parseInt(id);
            if (isNaN(idNumber)) return ['id debe ser un número válido'];
        }

        if (idDemoplot !== undefined && typeof idDemoplot !== 'number') {
            idDemoplotNumber = parseInt(idDemoplot);
            if (isNaN(idDemoplotNumber))
                return ['idDemoplot debe ser un número válido'];
        }

        if (duracion !== undefined && duracion !== null) {
            if (typeof duracion !== 'number') {
                duracionNumber = parseInt(duracion);
                if (isNaN(duracionNumber))
                    return ['duracion debe ser un número válido'];
            }
        }

        if (peso !== undefined && peso !== null) {
            if (typeof peso !== 'number') {
                pesoNumber = parseFloat(peso);
                if (isNaN(pesoNumber))
                    return ['peso debe ser un número válido'];
            }
        }

        if (updatedBy !== undefined && typeof updatedBy !== 'number') {
            updatedByN = parseInt(updatedBy);
            if (isNaN(updatedByN))
                return ['updatedBy debe ser un número válido'];
        }

        return [
            undefined,
            new UpdateVideoDemoplotDto(
                idNumber,
                idDemoplotNumber,
                comentario,
                duracionNumber,
                pesoNumber,
                activo,
                updatedByN
            ),
        ];
    }
}
