import { CustomError } from "../errors/custom.error";

export class FotoDemoplotEntity {

    constructor(
        public id: number,
        public idDemoPlot: number,
        public rutaFoto: string,
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
        
        /*if (latitud && typeof latitud !== 'number') {
            latitudNumber = parseFloat(latitud);
            if (isNaN(latitudNumber)) throw CustomError.badRequest('latitud must be a valid number');
        }

        if (longitud && typeof longitud !== 'number') {
            longitudNumber = parseFloat(longitud);
            if (isNaN(longitudNumber)) throw CustomError.badRequest('longitud must be a valid number');
        }*/
        
        return new FotoDemoplotEntity(
            id, idDemoPlot, rutaFoto, tipo, latitudNumber, longitudNumber,
            // createdAt, updatedAt
        );
    }
}