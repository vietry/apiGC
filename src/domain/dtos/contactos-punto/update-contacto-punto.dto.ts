import { Validators } from "../../../config";

export class UpdateContactoPuntoDto {

    private constructor(
        public readonly id: number,
        public readonly nombre?: string,
        public readonly apellido?: string,
        public readonly cargo?: string,
        public readonly tipo?: string,
        public readonly email?: string | null,
        public readonly celularA?: string | null,
        public readonly celularB?: string | null,
        public readonly idPunto?: number,
    ){}

    get values() {
        const returnObj: { [key: string]: any } = {};

        if (this.nombre) returnObj.nombre = this.nombre;
        if (this.apellido) returnObj.apellido = this.apellido;
        if (this.cargo) returnObj.cargo = this.cargo;
        if (this.tipo) returnObj.tipo = this.tipo;
        if (this.email) returnObj.email = this.email;
        if (this.celularA) returnObj.celularA = this.celularA;
        if (this.celularB) returnObj.celularB = this.celularB;
        if (this.idPunto) returnObj.idPunto = this.idPunto;

        return returnObj;
    }

    static async create(props: { [key: string]: any }): Promise<[string?, UpdateContactoPuntoDto?]> {
        const { id, nombre, apellido, cargo, tipo, email, celularA, celularB, idPunto } = props;

        if (!id || isNaN(Number(id))) {
            return ['Invalid or missing ID'];
        }

        let idPuntoNumber = idPunto;

        if (idPunto !== undefined && typeof idPunto !== 'number') {
            idPuntoNumber = parseInt(idPunto);
            if (isNaN(idPuntoNumber)) return ['idPunto debe ser un número válido'];
        }

        if (idPuntoNumber !== undefined) {
            const isUnique = await Validators.isPuntoID(idPuntoNumber);
            if (!isUnique) return ['Invalid idPunto'];
        }

        return [
            undefined,
            new UpdateContactoPuntoDto(
                id,
                nombre,
                apellido,
                cargo,
                tipo,
                email,
                celularA,
                celularB,
                idPuntoNumber
            )
        ];
    }
}