export class UpdateFotoDemoPlotLogDto {
    private constructor(
        public readonly id: number,
        public readonly idFotoDemoPlot?: number | null,
        public readonly idDemoPlot?: number,
        public readonly nombre?: string | null,
        public readonly comentario?: string | null,
        public readonly rutaFoto?: string | null,
        public readonly tipo?: string | null,
        public readonly latitud?: number | null,
        public readonly longitud?: number | null,
        public readonly estado?: string | null,
        public readonly deletedAt?: Date,
        public readonly deletedBy?: number,
        public readonly motivo?: string
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};

        if (this.idFotoDemoPlot !== undefined) returnObj.idFotoDemoPlot = this.idFotoDemoPlot;
        if (this.idDemoPlot !== undefined) returnObj.idDemoPlot = this.idDemoPlot;
        if (this.nombre !== undefined) returnObj.nombre = this.nombre;
        if (this.comentario !== undefined) returnObj.comentario = this.comentario;
        if (this.rutaFoto !== undefined) returnObj.rutaFoto = this.rutaFoto;
        if (this.tipo !== undefined) returnObj.tipo = this.tipo;
        if (this.latitud !== undefined) returnObj.latitud = this.latitud;
        if (this.longitud !== undefined) returnObj.longitud = this.longitud;
        if (this.estado !== undefined) returnObj.estado = this.estado;
        if (this.deletedAt !== undefined) returnObj.deletedAt = this.deletedAt;
        if (this.deletedBy !== undefined) returnObj.deletedBy = this.deletedBy;
        if (this.motivo !== undefined) returnObj.motivo = this.motivo;

        return returnObj;
    }

    static async create(props: { [key: string]: any }): Promise<[string?, UpdateFotoDemoPlotLogDto?]> {
        const { id, idFotoDemoPlot, idDemoPlot, nombre, comentario, rutaFoto, tipo, latitud, longitud, estado, deletedAt, deletedBy, motivo } = props;

        if (!id || isNaN(Number(id))) return ['Invalid or missing ID'];

        return [
            undefined,
            new UpdateFotoDemoPlotLogDto(
                id,
                idFotoDemoPlot,
                idDemoPlot,
                nombre,
                comentario,
                rutaFoto,
                tipo,
                latitud,
                longitud,
                estado,
                deletedAt,
                deletedBy,
                motivo
            )
        ];
    }
}