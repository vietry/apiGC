export class UpdateGteDto {

    private constructor(
        public readonly id: number,
        public readonly activo?: boolean | null,
        public readonly tipo?: string | null,
        public readonly idSubZona?: number,
        public readonly idColaborador?: number,
        public readonly idUsuario?: number,
        //public readonly updatedAt?: Date | null
    ){}

    get values() {
        const returnObj: {[key: string]: any} = {};

        if (this.idUsuario) returnObj.idUsuario = this.idUsuario;
        if (this.activo) returnObj.activo = this.activo;
        if (this.tipo) returnObj.tipo = this.tipo;
        if (this.idSubZona) returnObj.idSubZona = this.idSubZona;
        if (this.idColaborador) returnObj.idColaborador = this.idColaborador;

        return returnObj;
    }

    static create(props: {[key: string]: any}): [string?, UpdateGteDto?] {

        const { id, activo, tipo, idUsuario, idSubZona, idColaborador, /*updatedAt*/ } = props;

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


        if (idSubZona !== undefined && typeof idSubZona !== 'number') {
            idSubZonaNumber = parseInt(idSubZona);
            if (isNaN(idSubZonaNumber)) return ['idSubZona debe ser un número válido'];
        }

        if (idColaborador !== undefined && typeof idColaborador !== 'number') {
            idColaboradorNum = parseInt(idColaborador);
            if (isNaN(idColaboradorNum)) return ['idColaborador debe ser un número válido'];
        }

        if (idUsuario !== undefined && typeof idUsuario !== 'number') {
            idSubZonaNumber = parseInt(idUsuario);
            if (isNaN(idUsuarioNumber)) return ['idUsuario debe ser un número válido'];
        }

        return [undefined, new UpdateGteDto(id,  activoBoolean, tipo, idSubZonaNumber, idColaboradorNum, idUsuarioNumber, //updatedAt

        )];
    }
}