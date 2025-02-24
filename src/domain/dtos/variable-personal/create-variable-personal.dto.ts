export class CreateVariablePersonalDto {
    private constructor(
        public readonly variable: number | null,
        public readonly bono10: number | null,
        public readonly vidaLey: number | null,
        public readonly beneficio: number | null,
        public readonly sctr: number | null,
        public readonly total: number | null,
        public readonly year: number,
        public readonly month: number,
        public readonly idGte: number,
        public readonly createdBy: number | null,
        public readonly updatedBy: number | null
    ) {}

    static async create(object: {
        [key: string]: any;
    }): Promise<[string?, CreateVariablePersonalDto?]> {
        const {
            variable,
            bono10,
            vidaLey,
            beneficio,
            sctr,
            total,
            year,
            month,
            idGte,
            createdBy,
            updatedBy,
        } = object;

        if (!year || isNaN(Number(year)))
            return ['Año es requerido y debe ser un número válido'];
        if (!month || isNaN(Number(month)))
            return ['Mes es requerido y debe ser un número válido'];
        if (month < 1 || month > 12) return ['Mes debe estar entre 1 y 12'];
        if (!idGte || isNaN(Number(idGte)))
            return ['ID GTE es requerido y debe ser un número válido'];

        const parseNumber = (value: any) => {
            if (value === null || value === undefined) return null;
            const num = Number(value);
            return isNaN(num) ? null : num;
        };

        return [
            undefined,
            new CreateVariablePersonalDto(
                parseFloat(variable),
                parseFloat(bono10),
                parseFloat(vidaLey),
                parseFloat(beneficio),
                parseFloat(sctr),
                parseFloat(total),
                Number(year),
                Number(month),
                Number(idGte),
                parseNumber(createdBy),
                parseNumber(updatedBy)
            ),
        ];
    }
}
