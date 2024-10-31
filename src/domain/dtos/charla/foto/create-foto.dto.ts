export class CreateFotoCharlaDto {
    private constructor(
        public readonly idCharla: number,
        public readonly nombre: string | null,
        public readonly comentario: string | null,
        public readonly estado: string | null,
        public readonly rutaFoto: string | null,
        public readonly tipo: string | null,
        public readonly latitud: number | null,
        public readonly longitud: number | null,
        public readonly createdBy: number | null,
        public readonly updatedBy: number | null
    ) {}

    static async create(object: { [key: string]: any }): Promise<[string?, CreateFotoCharlaDto?]> {
        const { idCharla, nombre, comentario, estado, rutaFoto, tipo, latitud, longitud, createdBy, updatedBy } = object;

        let idCharlaNumber = idCharla;
        let latitudNumber = latitud;
        let longitudNumber = longitud;

        if (!idCharla) return ['idCharla faltante'];
        if (!createdBy) return ['createdBy faltante'];

        if (idCharla !== undefined && typeof idCharla !== 'number') {
            idCharlaNumber = parseInt(idCharla);
            if (isNaN(idCharlaNumber)) return ['idCharla debe ser un número válido'];
        }

        if (latitud !== undefined && typeof latitud !== 'number') {
            latitudNumber = parseFloat(latitud);
            if (isNaN(latitudNumber)) return ['latitud debe ser un número válido'];
        }

        if (longitud !== undefined && typeof longitud !== 'number') {
            longitudNumber = parseFloat(longitud);
            if (isNaN(longitudNumber)) return ['longitud debe ser un número válido'];
        }

        return [
            undefined,
            new CreateFotoCharlaDto(
                idCharlaNumber,
                nombre,
                comentario,
                estado,
                rutaFoto,
                tipo,
                latitudNumber,
                longitudNumber,
                createdBy,
                updatedBy
            )
        ];
    }
}