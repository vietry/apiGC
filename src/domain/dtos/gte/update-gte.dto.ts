export class UpdateGteDto {

    private constructor(
        public readonly id: number,
        public readonly activo?: boolean | null,
        public readonly idSubZona?: number,
        public readonly idColaborador?: number,
        public readonly idUsuario?: number,
        //public readonly updatedAt?: Date | null
    ){}

    get values() {
        const returnObj: {[key: string]: any} = {};

        if (this.idUsuario !== undefined) returnObj.idUsuario = this.idUsuario;
        if (this.activo !== undefined) returnObj.activo = this.activo;
        if (this.idSubZona !== undefined) returnObj.idSubZona = this.idSubZona;
        if (this.idColaborador !== undefined) returnObj.idColaborador = this.idColaborador;
        //if (this.updatedAt) returnObj.updatedAt = this.updatedAt;

        return returnObj;
    }

    static create(props: {[key: string]: any}): [string?, UpdateGteDto?] {

        const { id, activo, idUsuario, idSubZona, idColaborador, /*updatedAt*/ } = props;

        if (!id || isNaN(Number(id))) {
            return ['Invalid or missing ID'];
        }

        let activoBoolean = activo;
        let idSubZonaNumber = idSubZona;
        let idColaboradorNum = idColaborador;
        let idUsuarioNumber = idUsuario;

        if (typeof activo !== 'boolean') {
            activoBoolean = Boolean(activo);
        }


        if (typeof idSubZona !== 'number') {
            idSubZonaNumber = parseInt(idSubZona);
            if (isNaN(idSubZonaNumber)) return ['idSubZona debe ser un número válido'];
        }

        if (typeof idColaborador !== 'number') {
            idColaboradorNum = parseInt(idColaborador);
            if (isNaN(idColaboradorNum)) return ['idColaborador debe ser un número válido'];
        }

        if (typeof idUsuario !== 'number') {
            idSubZonaNumber = parseInt(idUsuario);
            if (isNaN(idUsuarioNumber)) return ['idUsuario debe ser un número válido'];
        }

        return [undefined, new UpdateGteDto(id,  activoBoolean, idSubZonaNumber, idColaboradorNum, idUsuarioNumber, //updatedAt

        )];
    }
}