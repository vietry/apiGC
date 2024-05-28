export class CreatePuntoContactoDTO {
    private constructor(
        public readonly nombre: string,
        public readonly tipoDoc: string | null,
        public readonly numDoc: string | null,
        public readonly hectareas: number | null,
        public readonly tipo: string,
        public readonly dirReferencia: string | null,
        public readonly lider: boolean | null,
        public readonly activo: boolean,
        public readonly idGte: number
    ) {}

    static create(object: { [key: string]: any }): [string?, CreatePuntoContactoDTO?] {
        const {
            nombre, tipoDoc, numDoc, hectareas, tipo, dirReferencia, lider, activo, idGte
        } = object;

        if (!nombre) return ['Nombre is required'];
        if (!activo) return ['Activo is required'];
        if (!idGte) return ['idGte is required'];
        if (!tipo) return ['Tipo is required'];

        let hectareasNumber = hectareas;
        let idGteNumber = idGte;

        if (typeof hectareas !== 'number') {
            hectareasNumber = parseFloat(hectareas);
        }
        if (typeof idGte !== 'number') {
            idGteNumber = parseInt(idGte);
        }

        return [
            undefined,
            new CreatePuntoContactoDTO(
                nombre, tipoDoc, numDoc, hectareasNumber, tipo, dirReferencia, lider, activo, idGteNumber
            )
        ];
    }
}