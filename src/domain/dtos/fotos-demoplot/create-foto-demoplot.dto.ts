export class CreateFotoDemoplotDto {

    private constructor(
        public readonly idDemoPlot: number,
        public readonly nombre: string | null,
        public readonly comentario: string | null,
        //public readonly rutaFoto: string | null,
        //public readonly tipo: string | null,
        public readonly latitud: number | null,
        public readonly longitud: number | null,
    ) {}

    static async create(object: { [key: string]: any }): Promise<[string?, CreateFotoDemoplotDto?]> {
        const { idDemoPlot, nombre, comentario, /*rutaFoto, tipo,*/ latitud, longitud } = object;

        let idDemoPlotNumber = idDemoPlot;
        let latitudNumber = latitud;
        let longitudNumber = longitud;

        if (!idDemoPlot) return ['idDemoPlot faltante'];
        if (!comentario) return ['comentario faltante'];

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
            new CreateFotoDemoplotDto(
                idDemoPlotNumber, 
                nombre,
                comentario,
                //rutaFoto, 
                //tipo, 
                latitudNumber, 
                longitudNumber,
            )
        ];
    }
}
