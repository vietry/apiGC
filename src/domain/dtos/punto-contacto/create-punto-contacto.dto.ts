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
        public readonly idDistrito: string,
        public readonly idEmpresa: number | null,
        public readonly codZona: string | null,
    ) {}

    static create(object: { [key: string]: any }): [string?, CreatePuntoContactoDto?] {
        const {
            nombre, tipoDoc, numDoc, hectareas, tipo, dirReferencia, lider, activo, idGte, idDistrito, idEmpresa, codZona
        } = object;

        if (!nombre) return ['Nombre is required'];
        if (!activo) return ['Activo is required'];
        //if (!idGte) return ['idGte is required'];
        if (!idDistrito) return ['idDistrito is required'];
        if (!tipo) return ['Tipo is required'];

        let hectareasNumber = hectareas;
        let idGteNumber = idGte;
        let idEmpresaNumber = idEmpresa;

        if (typeof hectareas !== 'number') {
            hectareasNumber = parseFloat(hectareas);
        }
        if (typeof idEmpresa !== 'number') {
            idEmpresaNumber = parseInt(idEmpresa);
        }

        return [
            undefined,
            new CreatePuntoContactoDto(
                nombre, tipoDoc, numDoc, hectareasNumber, tipo, dirReferencia, lider, activo, idGteNumber, idDistrito, idEmpresaNumber, codZona,
            )
        ];
    }
}