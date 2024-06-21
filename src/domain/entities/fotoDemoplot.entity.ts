import { CustomError } from "../errors/custom.error";

export class FotoDemoplotEntity {

    constructor(
        public id: number,
        public idDemoPlot: number,
        public rutaFoto: string | null,
        public tipo: string | null,
        public latitud: number | null,
        public longitud: number | null,
        // public createdAt: Date | null,
        // public updatedAt: Date | null
    ) {}

    public static fromObject(object: { [key: string]: any }): FotoDemoplotEntity {
        const {
            id, idDemoPlot, rutaFoto, tipo, latitud, longitud, /* createdAt, updatedAt */
        } = object;

        if (!idDemoPlot) throw CustomError.badRequest('idDemoPlot is required');
        if (!rutaFoto) throw CustomError.badRequest('rutaFoto is required');

        let latitudNumber = latitud;
        let longitudNumber = longitud;
    
        
        return new FotoDemoplotEntity(
            id, idDemoPlot, rutaFoto, tipo, latitudNumber, longitudNumber,
            // createdAt, updatedAt
        );
    }
}