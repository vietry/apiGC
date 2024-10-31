import { CustomError } from "../../errors/custom.error";


export class FotoCharlaEntity {

    constructor(
        public id: number,
        public idCharla: number,
        public nombre: string | null,
        public comentario: string | null,
        public estado: string | null,
        public rutaFoto: string | null,
        public tipo: string | null,
        public latitud: number | null,
        public longitud: number | null,
        //public createdAt: Date | null,
        public createdBy: number | null,
        //public updatedAt: Date | null,
        public updatedBy: number | null
    ) {}

    public static fromObject(object: { [key: string]: any }): FotoCharlaEntity {
        const {
            id, idCharla, nombre, comentario, estado, rutaFoto, tipo, latitud, longitud, createdBy, updatedBy/* createdAt,  updatedAt, */
        } = object;

        if (!idCharla) throw CustomError.badRequest('idCharla is required');


        let latitudNumber = latitud;
        let longitudNumber = longitud;
    
        
        return new FotoCharlaEntity(
            id, idCharla, nombre, comentario, estado, rutaFoto, tipo, latitudNumber, longitudNumber,
            createdBy, updatedBy
            // createdAt,  updatedAt, 
        );
    }
}
