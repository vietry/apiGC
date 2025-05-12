export class CreatePuntoContactoDto {
    private constructor(
        public readonly nombre: string,
        public readonly tipoDoc: string | null,
        public readonly numDoc: string | null,
        public readonly hectareas: number | null,
        public readonly tipo: string,
        public readonly dirReferencia: string | null,
        public readonly lider: boolean | null,
        public readonly activo: boolean,
        public readonly idGte: number | null,
        public readonly idDistrito: string | null,
        public readonly idEmpresa: number | null,
        public readonly idColaborador: number | null,
        public readonly gestion: boolean | null,
        public readonly sede: string | null,
        public readonly codZona: string | null,
        public readonly subTipo: string | null,
        public readonly cantR0: number | null,
        public readonly cantR1: number | null,
        public readonly cantR2: number | null,
        public readonly aniversario: Date | null = null
    ) {}

    static create(object: {
        [key: string]: any;
    }): [string?, CreatePuntoContactoDto?] {
        const {
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
        } = object;

        if (!nombre) return ['Nombre is required'];
        if (!activo) return ['Activo is required'];
        //if (!idGte) return ['idGte is required'];
        //if (!idDistrito) return ['idDistrito is required'];
        if (!tipo) return ['Tipo is required'];

        let hectareasNumber = hectareas;
        let idGteNumber = idGte;
        let idEmpresaNumber = idEmpresa;
        let idColaboradorNumber = idColaborador;

        if (typeof hectareas !== 'number') {
            hectareasNumber = parseFloat(hectareas);
        }
        if (typeof idEmpresa !== 'number') {
            idEmpresaNumber = parseInt(idEmpresa);
        }

        if (typeof idColaborador !== 'number') {
            idColaboradorNumber = parseInt(idEmpresa);
        }

        return [
            undefined,
            new CreatePuntoContactoDto(
                nombre,
                tipoDoc,
                numDoc,
                hectareasNumber,
                tipo,
                dirReferencia,
                lider,
                activo,
                idGteNumber,
                idDistrito,
                idEmpresaNumber,
                idColaboradorNumber,
                gestion,
                sede,
                codZona,
                subTipo,
                cantR0,
                cantR1,
                cantR2,
                aniversario
            ),
        ];
    }
}
