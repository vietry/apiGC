export class UpdateVariablePersonalDto {
    private constructor(
        public readonly id: number,
        public readonly variable?: number | null,
        public readonly bono10?: number | null,
        public readonly vidaLey?: number | null,
        public readonly beneficio?: number | null,
        public readonly total?: number | null,
        public readonly year?: number,
        public readonly month?: number,
        public readonly idGte?: number,
        public readonly updatedBy?: number | null
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.variable !== undefined) returnObj.variable = this.variable;
        if (this.bono10 !== undefined) returnObj.bono10 = this.bono10;
        if (this.vidaLey !== undefined) returnObj.vidaLey = this.vidaLey;
        if (this.beneficio !== undefined) returnObj.beneficio = this.beneficio;
        if (this.total !== undefined) returnObj.total = this.total;
        if (this.year !== undefined) returnObj.year = this.year;
        if (this.month !== undefined) returnObj.month = this.month;
        if (this.idGte !== undefined) returnObj.idGte = this.idGte;
        if (this.updatedBy !== undefined) returnObj.updatedBy = this.updatedBy;
        return returnObj;
    }

    static async create(props: {
        [key: string]: any;
    }): Promise<[string?, UpdateVariablePersonalDto?]> {
        const {
            id,
            variable,
            bono10,
            vidaLey,
            beneficio,
            total,
            year,
            month,
            idGte,
            updatedBy,
        } = props;

        if (!id || isNaN(Number(id))) return ['ID inválido o faltante'];
        if (month !== undefined && (month < 1 || month > 12))
            return ['Mes debe estar entre 1 y 12'];

        const parseNumber = (value: any) => {
            if (value === undefined) return undefined;
            if (value === null) return null;
            const num = Number(value);
            return isNaN(num) ? undefined : num;
        };

        return [
            undefined,
            new UpdateVariablePersonalDto(
                Number(id),
                parseNumber(variable),
                parseNumber(bono10),
                parseNumber(vidaLey),
                parseNumber(beneficio),
                parseNumber(total),
                year ? Number(year) : undefined,
                month ? Number(month) : undefined,
                idGte ? Number(idGte) : undefined,
                updatedBy
            ),
        ];
    }
}
