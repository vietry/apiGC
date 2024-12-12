export class CreateFotoDemoPlotLogDto {
    private constructor(
        public readonly idDemoPlot: number,
        public readonly nombre: string | null,
        public readonly comentario: string | null,
        public readonly rutaFoto: string | null,
        public readonly tipo: string | null,
        public readonly latitud: number | null,
        public readonly longitud: number | null,
        public readonly estado: string | null,
        public readonly createdAt: Date | null,
        public readonly updatedAt: Date | null,
        //public readonly deletedAt: Date,
        public readonly deletedBy: number,
        public readonly motivo: string
    ) {}

    static async create(object: { [key: string]: any }): Promise<[string?, CreateFotoDemoPlotLogDto?]> {
        const { idDemoPlot, nombre, comentario, rutaFoto, tipo, latitud, longitud, estado, 
            createdAt, updatedAt,
            //deletedAt, 
            deletedBy, motivo } = object;

        if (!idDemoPlot) return ['idDemoPlot is missing'];
        //if (!deletedAt) return ['deletedAt is missing'];
        if (!deletedBy) return ['deletedBy is missing'];
        if (!motivo) return ['motivo is missing'];

        let latitudNumber = latitud !== undefined ? latitud : null;
        let longitudNumber = longitud !== undefined ? longitud : null;

        return [
            undefined,
            new CreateFotoDemoPlotLogDto(
                idDemoPlot,
                nombre,
                comentario,
                rutaFoto,
                tipo,
                latitudNumber,
                longitudNumber,
                estado,
                createdAt, updatedAt,
                //deletedAt,
                deletedBy,
                motivo
            )
        ];
    }
}