import { CustomError } from "../../errors/custom.error";


export class AsistenciaEntity {
    constructor(
        public id: number,
        public idContactoTienda: number | null,
        public idCharla: number | null,

    ) {}

    public static fromObject(object: { [key: string]: any }): AsistenciaEntity {
        const {
            id, idContactoTienda, idCharla,
        } = object;


        if (!idContactoTienda) throw CustomError.badRequest('idContactoTienda is required');
        if (!idCharla) throw CustomError.badRequest('idCharla is required');

        return new AsistenciaEntity(
            id, idContactoTienda, idCharla,
        );
    }
}
