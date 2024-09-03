export class CreatePuntoUbigeoDto {
    private constructor(
        public readonly idPunto: number,
        public readonly idDistrito: string,
    ) {}

    static create(object: { [key: string]: any }): [string?, CreatePuntoUbigeoDto?] {
        const { idPunto, idDistrito } = object;

        if (!idPunto) return ['idPunto is required'];
        if (!idDistrito) return ['idDistrito is required'];

        let idPuntoNumber = idPunto;
        if (typeof idPunto !== 'number') {
            idPuntoNumber = parseInt(idPunto);
            if (isNaN(idPuntoNumber)) return ['idPunto must be a valid number'];
        }

        return [
            undefined,
            new CreatePuntoUbigeoDto(idPuntoNumber, idDistrito)
        ];
    }
}
