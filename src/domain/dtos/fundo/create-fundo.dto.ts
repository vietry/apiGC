export class CreateFundoDto {
    private constructor(
        public readonly nombre: string | null,
        public readonly idClienteUbigeo: number | null,
        public readonly idPuntoUbigeo: number | null,
        public readonly idPuntoContacto: number | null,
        public readonly idContactoPunto: number | null,
        public readonly idDistrito: string | null,
        public readonly centroPoblado: string | null
    ) {}

    static create(object: { [key: string]: any }): [string?, CreateFundoDto?] {
        const { nombre, idClienteUbigeo, idPuntoUbigeo, idPuntoContacto, idContactoPunto, idDistrito, centroPoblado } = object;

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
            if (isNaN(idContactoPuntoNumber)) return ['idContactoPunto must be a valid number'];
        }

        return [
            undefined,
            new CreateFundoDto(nombre, idClienteUbigeoNumber, idPuntoUbigeoNumber, idPuntoContactoNumber,idContactoPuntoNumber,idDistrito,centroPoblado)
        ];
    }
}