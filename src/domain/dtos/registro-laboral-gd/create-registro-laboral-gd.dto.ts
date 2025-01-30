export class CreateRegistroLaboralDto {
    private constructor(
        public readonly ingreso: Date | null,
        public readonly cese: Date | null,
        public readonly idGte: number,
        public readonly createdBy: number | null,
        public readonly updatedBy: number | null
    ) {}

    static async create(object: {
        [key: string]: any;
    }): Promise<[string?, CreateRegistroLaboralDto?]> {
        const { ingreso, cese, idGte, createdBy, updatedBy } = object;

        if (!idGte) return ['idGte faltante'];

        if (ingreso && isNaN(new Date(ingreso).getTime())) {
            return ['ingreso debe ser una fecha válida'];
        }

        if (cese && isNaN(new Date(cese).getTime())) {
            return ['cese debe ser una fecha válida'];
        }

        return [
            undefined,
            new CreateRegistroLaboralDto(
                ingreso ? new Date(ingreso) : null,
                cese ? new Date(cese) : null,
                idGte,
                createdBy,
                updatedBy
            ),
        ];
    }
}
