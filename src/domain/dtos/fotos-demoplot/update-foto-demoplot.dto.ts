export class UpdateFotoDemoplotDto {

    private constructor(
        public readonly id: number,
        public readonly idDemoPlot?: number,
        public readonly nombre?: string | null,
        public readonly comentario?: string | null,
        public readonly estado?: string | null,
        public readonly latitud?: number | null,
        public readonly longitud?: number | null,
        //public readonly updatedAt?: Date | null
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};

        if (this.idDemoPlot !== undefined) returnObj.idDemoPlot = this.idDemoPlot;
        if (this.nombre !== undefined) returnObj.nombre = this.nombre;
        if (this.comentario !== undefined) returnObj.comentario = this.comentario;
        if (this.estado !== undefined) returnObj.estado = this.estado;
        if (this.latitud !== undefined) returnObj.latitud = this.latitud;
        if (this.longitud !== undefined) returnObj.longitud = this.longitud;
        //if (this.updatedAt !== undefined) returnObj.updatedAt = this.updatedAt;

        return returnObj;
    }

    static async create(props: { [key: string]: any }): Promise<[string?, UpdateFotoDemoplotDto?]> {
        const { id, idDemoPlot, nombre, comentario, estado, latitud, longitud } = props;

        if (!id || isNaN(Number(id))) {
            return ['Invalid or missing ID'];
        }

        let idDemoPlotNumber = idDemoPlot;
        let latitudNumber = latitud;
        let longitudNumber = longitud;

        if (idDemoPlot !== undefined && typeof idDemoPlot !== 'number') {
            idDemoPlotNumber = parseInt(idDemoPlot);
            if (isNaN(idDemoPlotNumber)) return ['idDemoPlot debe ser un número válido'];
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
            new UpdateFotoDemoplotDto(
                id,
                idDemoPlotNumber,
                nombre,
                comentario,
                estado,
                latitudNumber,
                longitudNumber,
                //updatedAt
            )
        ];
    }
}
