export class UpdateFundoDto {
    private constructor(
        public readonly id: number,
        public readonly nombre?: string | null,
        public readonly idClienteUbigeo?: number | null,
        public readonly idPuntoUbigeo?: number | null,
        public readonly idPuntoContacto?: number | null,
        public readonly idContactoPunto?: number | null,
        public readonly idDistrito?: string | null,
        public readonly centroPoblado?: string | null,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};

        if (this.nombre) returnObj.nombre = this.nombre;
        if (this.idClienteUbigeo) returnObj.idClienteUbigeo = this.idClienteUbigeo;
        if (this.idPuntoUbigeo) returnObj.idPuntoUbigeo = this.idPuntoUbigeo;
        if (this.idPuntoContacto) returnObj.idPuntoContacto = this.idPuntoContacto;
        if (this.idContactoPunto) returnObj.idContactoPunto = this.idContactoPunto;
        if (this.idDistrito) returnObj.idDistrito = this.idDistrito;
        if (this.centroPoblado) returnObj.centroPoblado = this.centroPoblado;

        return returnObj;
    }

    static create(object: { [key: string]: any }): [string?, UpdateFundoDto?] {
        const { id, nombre, idClienteUbigeo, idPuntoUbigeo, idPuntoContacto,idContactoPunto,idDistrito, centroPoblado } = object;

        if (!id || isNaN(Number(id))) return ['Invalid or missing ID'];

        let idClienteUbigeoNumber = idClienteUbigeo;
        let idPuntoUbigeoNumber = idPuntoUbigeo;
        let idPuntoContactoNumber = idPuntoContacto;
        let idContactoPuntoNumber = idContactoPunto;

        if (idClienteUbigeo !== undefined && idClienteUbigeo !== null && typeof idClienteUbigeo !== 'number') {
            idClienteUbigeoNumber = parseInt(idClienteUbigeo);
            if (isNaN(idClienteUbigeoNumber)) return ['idClienteUbigeo must be a valid number'];
        }

        if (idPuntoUbigeo !== undefined && idPuntoUbigeo !== null && typeof idPuntoUbigeo !== 'number') {
            idPuntoUbigeoNumber = parseInt(idPuntoUbigeo);
            if (isNaN(idPuntoUbigeoNumber)) return ['idPuntoUbigeo must be a valid number'];
        }

        if (idPuntoContacto !== undefined && idPuntoContacto !== null && typeof idPuntoContacto !== 'number') {
            idPuntoContactoNumber = parseInt(idPuntoContacto);
            if (isNaN(idPuntoContactoNumber)) return ['idPuntoContacto must be a valid number'];
        }

        if (idContactoPunto !== undefined && idContactoPunto !== null && typeof idContactoPunto !== 'number') {
            idContactoPuntoNumber = parseInt(idContactoPunto);
            if (isNaN(idContactoPuntoNumber)) return ['idContactoP must be a valid number'];
        }
        
        return [undefined, new UpdateFundoDto(id, nombre, idClienteUbigeoNumber, idPuntoUbigeoNumber, idPuntoContactoNumber,idContactoPuntoNumber,idDistrito, centroPoblado)];
    }
}