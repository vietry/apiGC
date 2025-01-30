export class UpdateRegistroLaboralDto {
    private constructor(
        public readonly id: number,
        public readonly ingreso?: Date | null,
        public readonly cese?: Date | null,
        public readonly idGte?: number,
        public readonly updatedBy?: number | null
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};

        if (this.ingreso !== undefined) returnObj.ingreso = this.ingreso;
        if (this.cese !== undefined) returnObj.cese = this.cese;
        if (this.idGte !== undefined) returnObj.idGte = this.idGte;
        if (this.updatedBy !== undefined) returnObj.updatedBy = this.updatedBy;

        return returnObj;
    }

    static async create(props: {
        [key: string]: any;
    }): Promise<[string?, UpdateRegistroLaboralDto?]> {
        const { id, ingreso, cese, idGte, updatedBy } = props;

        if (!id || isNaN(Number(id))) {
            return ['Invalid or missing ID'];
        }

        if (ingreso !== undefined && isNaN(new Date(ingreso).getTime())) {
            return ['ingreso debe ser una fecha válida'];
        }

        if (cese !== undefined && isNaN(new Date(cese).getTime())) {
            return ['cese debe ser una fecha válida'];
        }

        return [
            undefined,
            new UpdateRegistroLaboralDto(
                id,
                ingreso ? new Date(ingreso) : undefined,
                cese ? new Date(cese) : undefined,
                idGte,
                updatedBy ?? null
            ),
        ];
    }
}
