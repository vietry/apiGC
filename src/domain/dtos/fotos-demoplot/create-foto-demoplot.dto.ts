export class CreateFotoDemoplotDto {

    private constructor(
        public readonly idDemoPlot: number,
        public readonly nombre: string | null,
        public readonly comentario: string | null,
        public readonly estado: string | null,
        //public readonly rutaFoto: string | null,
        //public readonly tipo: string | null,
        public readonly latitud: number | null,
        public readonly longitud: number | null,
        public readonly createdBy: number | null,
        public readonly updatedBy: number | null
    ) {}

    static async create(object: { [key: string]: any }): Promise<[string?, CreateFotoDemoplotDto?]> {
        const { idDemoPlot, nombre, comentario, estado, /*rutaFoto, tipo,*/ latitud, longitud, createdBy, updatedBy } = object;

        let idDemoPlotNumber = idDemoPlot;
        let latitudNumber = latitud;
        let longitudNumber = longitud;
        let createdByN = createdBy;
        let updatedByN = updatedBy;

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

        
        if (createdBy !== undefined && typeof createdBy !== 'number') {
            createdByN = parseFloat(createdBy);
            if (isNaN(createdByN)) return ['createdBy debe ser un número válido'];
        }

        if (updatedBy !== undefined && typeof updatedBy !== 'number') {
            updatedByN = parseFloat(updatedBy);
            if (isNaN(updatedByN)) return ['updatedBy debe ser un número válido'];
        }

        return [
            undefined,
            new CreateFotoDemoplotDto(
                idDemoPlotNumber, 
                nombre,
                comentario,
                estado,
                //rutaFoto, 
                //tipo, 
                latitudNumber, 
                longitudNumber, 
                createdByN, updatedByN
            )
        ];
    }
}
