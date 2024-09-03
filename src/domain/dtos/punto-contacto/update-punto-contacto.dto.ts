export class UpdatePuntoContactoDto {
    private constructor(
        public readonly id: number,
        public readonly nombre?: string,
        public readonly tipoDoc?: string | null,
        public readonly numDoc?: string | null,
        public readonly hectareas?: number | null,
        public readonly tipo?: string,
        public readonly dirReferencia?: string | null,
        public readonly lider?: boolean | null,
        public readonly activo?: boolean,
        public readonly idGte?: number,
        public readonly idDistrito?: string,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};

        if (this.nombre) returnObj.nombre = this.nombre;
        if (this.tipoDoc ) returnObj.tipoDoc = this.tipoDoc;
        if (this.numDoc ) returnObj.numDoc = this.numDoc;
        if (this.hectareas ) returnObj.hectareas = this.hectareas;
        if (this.tipo ) returnObj.tipo = this.tipo;
        if (this.dirReferencia ) returnObj.dirReferencia = this.dirReferencia;
        if (this.lider ) returnObj.lider = this.lider;
        if (this.activo ) returnObj.activo = this.activo;
        if (this.idGte ) returnObj.idGte = this.idGte;
        if (this.idDistrito ) returnObj.idDistrito = this.idDistrito;

        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdatePuntoContactoDto?] {
        const {
            id, nombre, tipoDoc, numDoc, hectareas, tipo, dirReferencia, lider, activo, idGte, idDistrito
        } = props;

        if (!id || isNaN(Number(id))) {
            return ['Invalid or missing ID'];
        }

        let hectareasNumber = hectareas;
        let numDocNumeric = numDoc;
        let idGteNumber = idGte;

        if (hectareas !== undefined && typeof hectareas !== 'number') {
            hectareasNumber = parseFloat(hectareas);
            if (isNaN(hectareasNumber)) return ['hectareas debe ser un número válido'];
        }

        if (numDoc !== undefined && typeof numDoc !== 'number') {
            numDocNumeric = parseFloat(numDoc);
            if (isNaN(numDocNumeric)) return ['Numero de documento debe ser un número válido'];
        }

        if (idGte !== undefined && typeof idGte !== 'number') {
            idGteNumber = parseInt(idGte);
            if (isNaN(idGteNumber)) return ['idGte debe ser un número válido'];
        }

        return [undefined, new UpdatePuntoContactoDto(
            id, nombre, tipoDoc, numDoc, hectareasNumber, tipo, dirReferencia, lider, activo, idGteNumber, idDistrito
        )];
    }
}
