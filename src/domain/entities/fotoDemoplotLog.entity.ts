import { CustomError } from "../errors/custom.error";

export class FotoDemoPlotLogEntity {
    constructor(
        public id: number,
        public idFotoDemoPlot: number | null,
        public idDemoPlot: number,
        public nombre: string | null,
        public comentario: string | null,
        public rutaFoto: string | null,
        public tipo: string | null,
        public latitud: number | null,
        public longitud: number | null,
        public estado: string | null,
        public createdAt: Date | null,
        public updatedAt: Date | null,
        public deletedAt: Date,
        public deletedBy: number,
        public motivo: string
    ) {}

    public static fromObject(object: { [key: string]: any }): FotoDemoPlotLogEntity {
        const {
            id, idFotoDemoPlot, idDemoPlot, nombre, comentario, rutaFoto, tipo,
            latitud, longitud, estado, createdAt, updatedAt, deletedAt, deletedBy, motivo
        } = object;

        if (!idDemoPlot) throw CustomError.badRequest('idDemoPlot is required');
        if (!deletedAt) throw CustomError.badRequest('deletedAt is required');
        if (!deletedBy) throw CustomError.badRequest('deletedBy is required');
        if (!motivo) throw CustomError.badRequest('motivo is required');

        let latitudNumber = latitud !== undefined ? latitud : null;
        let longitudNumber = longitud !== undefined ? longitud : null;

        return new FotoDemoPlotLogEntity(
            id, idFotoDemoPlot, idDemoPlot, nombre, comentario, rutaFoto,
            tipo, latitudNumber, longitudNumber, estado, createdAt, updatedAt,
            deletedAt, deletedBy, motivo
        );
    }
}