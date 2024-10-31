export class UpdateFotoCharlaDto {
    private constructor(
        public readonly id: number,
        public readonly idCharla?: number,
        public readonly nombre?: string | null,
        public readonly comentario?: string | null,
        public readonly estado?: string | null,
        public readonly rutaFoto?: string | null,
        public readonly tipo?: string | null,
        public readonly latitud?: number | null,
        public readonly longitud?: number | null,
        public readonly updatedBy?: number | null
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};

        if (this.idCharla !== undefined) returnObj.idCharla = this.idCharla;
        if (this.nombre !== undefined) returnObj.nombre = this.nombre;
        if (this.comentario !== undefined) returnObj.comentario = this.comentario;
        if (this.estado !== undefined) returnObj.estado = this.estado;
        if (this.rutaFoto !== undefined) returnObj.rutaFoto = this.rutaFoto;
        if (this.tipo !== undefined) returnObj.tipo = this.tipo;
        if (this.latitud !== undefined) returnObj.latitud = this.latitud;
        if (this.longitud !== undefined) returnObj.longitud = this.longitud;
        if (this.updatedBy !== undefined) returnObj.updatedBy = this.updatedBy;

        return returnObj;
    }

    static async create(props: { [key: string]: any }): Promise<[string?, UpdateFotoCharlaDto?]> {
        const { id, idCharla, nombre, comentario, estado, rutaFoto, tipo, latitud, longitud, updatedBy } = props;

        if (!id || isNaN(Number(id))) {
            return ['Invalid or missing ID'];
        }

        let idCharlaNumber = idCharla;
        let latitudNumber = latitud;
        let longitudNumber = longitud;

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
            new UpdateFotoCharlaDto(
                id,
                idCharlaNumber,
                nombre,
                comentario,
                estado,
                rutaFoto,
                tipo,
                latitudNumber,
                longitudNumber,
                updatedBy
            )
        ];
    }
}