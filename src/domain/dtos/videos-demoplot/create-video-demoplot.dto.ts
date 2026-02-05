export class CreateVideoDemoplotDto {
    private constructor(
        public readonly idDemoplot: number,
        public readonly comentario: string | null,
        public readonly duracion: number | null,
        public readonly peso: number | null, // Peso en MB
        public readonly createdBy: number | null,
        public readonly updatedBy: number | null
    ) {}

    static async create(object: {
        [key: string]: any;
    }): Promise<[string?, CreateVideoDemoplotDto?]> {
        const { idDemoplot, comentario, duracion, peso, createdBy, updatedBy } =
            object;

        let idDemoplotNumber = idDemoplot;
        let duracionNumber = duracion;
        let pesoNumber = peso;
        let createdByN = createdBy;
        let updatedByN = updatedBy;

        if (!idDemoplot) return ['idDemoplot faltante'];

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

        if (createdBy !== undefined && typeof createdBy !== 'number') {
            createdByN = parseInt(createdBy);
            if (isNaN(createdByN))
                return ['createdBy debe ser un número válido'];
        }

        if (updatedBy !== undefined && typeof updatedBy !== 'number') {
            updatedByN = parseInt(updatedBy);
            if (isNaN(updatedByN))
                return ['updatedBy debe ser un número válido'];
        }

        return [
            undefined,
            new CreateVideoDemoplotDto(
                idDemoplotNumber,
                comentario ?? null,
                duracionNumber ?? null,
                pesoNumber ?? null,
                createdByN ?? null,
                updatedByN ?? null
            ),
        ];
    }
}
