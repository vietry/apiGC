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
        public readonly idEmpresa?: number | null,
        public readonly idColaborador?: number | null,
        public readonly gestion?: boolean | null,
        public readonly sede?: string | null,
        public readonly codZona?: string | null,
        public readonly subTipo?: string | null,
        public readonly cantR0?: number | null,
        public readonly cantR1?: number | null,
        public readonly cantR2?: number | null,
        public readonly aniversario?: Date | null
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};

        if (this.nombre) returnObj.nombre = this.nombre;
        if (this.tipoDoc) returnObj.tipoDoc = this.tipoDoc;
        if (this.numDoc) returnObj.numDoc = this.numDoc;
        if (this.hectareas) returnObj.hectareas = this.hectareas;
        if (this.tipo) returnObj.tipo = this.tipo;
        if (this.dirReferencia) returnObj.dirReferencia = this.dirReferencia;
        if (this.lider !== undefined) returnObj.lider = this.lider;
        if (this.activo !== undefined) returnObj.activo = this.activo;
        if (this.idGte) returnObj.idGte = this.idGte;
        if (this.idDistrito) returnObj.idDistrito = this.idDistrito;
        if (this.idEmpresa) returnObj.idEmpresa = this.idEmpresa;
        if (this.idColaborador) returnObj.idColaborador = this.idColaborador;
        if (this.gestion) returnObj.gestion = this.gestion;
        if (this.sede) returnObj.sede = this.sede;
        if (this.codZona) returnObj.codZona = this.codZona;
        if (this.subTipo) returnObj.subTipo = this.subTipo;
        if (this.cantR0) returnObj.cantR0 = this.cantR0;
        if (this.cantR1) returnObj.cantR1 = this.cantR1;
        if (this.cantR2) returnObj.cantR2 = this.cantR2;
        if (this.aniversario)
            returnObj.aniversario = new Date(this.aniversario);

        return returnObj;
    }

    static create(props: {
        [key: string]: any;
    }): [string?, UpdatePuntoContactoDto?] {
        const {
            id,
            nombre,
            tipoDoc,
            numDoc,
            hectareas,
            tipo,
            dirReferencia,
            lider,
            activo,
            idGte,
            idDistrito,
            idEmpresa,
            idColaborador,
            gestion,
            sede,
            codZona,
            subTipo,
            cantR0,
            cantR1,
            cantR2,
            aniversario,
        } = props;

        if (!id || isNaN(Number(id))) {
            return ['Invalid or missing ID'];
        }

        let hectareasNumber = hectareas;
        let numDocNumeric = numDoc;
        let idGteNumber = idGte;
        let idEmpresaNumber = idEmpresa;
        let activoBoolean = activo;

        let gestionBoolean = gestion;
        let liderBoolean = lider;

        if (numDoc !== undefined && typeof numDoc !== 'number') {
            numDocNumeric = parseFloat(numDoc);
            if (isNaN(numDocNumeric))
                return ['Numero de documento debe ser un número válido'];
        }

        if (idEmpresa !== undefined && typeof idEmpresa !== 'number') {
            idEmpresaNumber = parseInt(idEmpresa);
            if (isNaN(idEmpresaNumber))
                return ['idEmpresa debe ser un número válido'];
        }

        if (typeof activo !== 'boolean') {
            activoBoolean = Boolean(activo);
        }

        if (typeof lider !== 'boolean') {
            liderBoolean = Boolean(lider);
        }

        if (typeof gestion !== 'boolean') {
            gestionBoolean = Boolean(gestion);
        }

        // Validación y conversión de la fecha de aniversario
        let aniversarioDate = null;
        if (aniversario) {
            aniversarioDate = new Date(aniversario);
            if (isNaN(aniversarioDate.getTime())) {
                return ['Fecha de aniversario inválida'];
            }
        }

        return [
            undefined,
            new UpdatePuntoContactoDto(
                id,
                nombre,
                tipoDoc,
                numDoc,
                hectareasNumber,
                tipo,
                dirReferencia,
                liderBoolean,
                activoBoolean,
                idGteNumber,
                idDistrito,
                idEmpresaNumber,
                idColaborador,
                gestionBoolean,
                sede,
                codZona,
                subTipo,
                cantR0,
                cantR1,
                cantR2,
                aniversarioDate
            ),
        ];
    }
}
