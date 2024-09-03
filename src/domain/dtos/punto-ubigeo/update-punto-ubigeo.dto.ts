export class UpdatePuntoUbigeoDto {
    private constructor(
        public readonly id: number,
        public readonly idPunto?: number,
        public readonly idDistrito?: string,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};

        if (this.idPunto) returnObj.idPunto = this.idPunto;
        if (this.idDistrito) returnObj.idDistrito = this.idDistrito;

        return returnObj;
    }

    static create(object: { [key: string]: any }): [string?, UpdatePuntoUbigeoDto?] {
        const { id, idPunto, idDistrito } = object;

        if (!id || isNaN(Number(id))) return ['Invalid or missing ID'];

        let idPuntoNumber = idPunto;
        if (idPunto !== undefined && typeof idPunto !== 'number') {
            idPuntoNumber = parseInt(idPunto);
            if (isNaN(idPuntoNumber)) return ['idPunto must be a valid number'];
        }

        return [undefined, new UpdatePuntoUbigeoDto(id, idPuntoNumber, idDistrito)];
    }
}
