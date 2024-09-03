import { CustomError } from "../errors/custom.error";

export class FundoEntity {
    constructor(
        public id: number,
        public nombre: string | null,
        public idClienteUbigeo: number | null,
        public idPuntoUbigeo: number | null,
        public idPuntoContacto: number | null,
        public idContactoPunto: number | null,
        public idDistrito: string | null,
        public centroPoblado: string | null,
        public createdAt: Date | null,
        public updatedAt: Date | null
    ) {}

    public static fromObject(object: { [key: string]: any }): FundoEntity {
        const {
            id, nombre, idClienteUbigeo, idPuntoUbigeo, idPuntoContacto, idContactoPunto, idDistrito, centroPoblado, createdAt, updatedAt
        } = object;

        if (!id) throw CustomError.badRequest('ID is required');
        // idClienteUbigeo and idPuntoUbigeo are nullable, so we don't enforce their presence here

        return new FundoEntity(
            id, nombre, idClienteUbigeo, idPuntoUbigeo, idPuntoContacto,idContactoPunto,idDistrito,centroPoblado, createdAt, updatedAt
        );
    }
}
