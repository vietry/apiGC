export class CreateCostoLaboralDto {
    private constructor(
        public readonly conteo1: number | null,
        public readonly conteo2: number | null,
        public readonly diacampo: number | null,
        public readonly sueldo: number | null,
        public readonly viaticos: number | null,
        public readonly moto: number | null,
        public readonly year: number,
        public readonly month: number,
        public readonly createdBy: number | null,
        public readonly updatedBy: number | null
    ) {}

    static async create(object: {
        [key: string]: any;
    }): Promise<[string?, CreateCostoLaboralDto?]> {
        const {
            conteo1,
            conteo2,
            diacampo,
            sueldo,
            viaticos,
            moto,
            year,
            month,
            createdBy,
            updatedBy,
        } = object;

        if (!year || isNaN(Number(year)))
            return ['Año es requerido y debe ser un número válido'];
        if (!month || isNaN(Number(month)))
            return ['Mes es requerido y debe ser un número válido'];
        if (month < 1 || month > 12) return ['Mes debe estar entre 1 y 12'];

        const parseNumber = (value: any) => {
            if (value === null || value === undefined) return null;
            const num = Number(value);
            return isNaN(num) ? null : num;
        };

        return [
            undefined,
            new CreateCostoLaboralDto(
                parseNumber(conteo1),
                parseNumber(conteo2),
                parseNumber(diacampo),
                parseNumber(sueldo),
                parseNumber(viaticos),
                parseNumber(moto),
                Number(year),
                Number(month),
                createdBy,
                updatedBy
            ),
        ];
    }
}
