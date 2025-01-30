export class UpdateCostoLaboralDto {
    private constructor(
        public readonly id: number,
        public readonly conteo1?: number | null,
        public readonly conteo2?: number | null,
        public readonly diacampo?: number | null,
        public readonly sueldo?: number | null,
        public readonly viaticos?: number | null,
        public readonly moto?: number | null,
        public readonly year?: number,
        public readonly month?: number,
        public readonly updatedBy?: number | null
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.conteo1 !== undefined) returnObj.conteo1 = this.conteo1;
        if (this.conteo2 !== undefined) returnObj.conteo2 = this.conteo2;
        if (this.diacampo !== undefined) returnObj.diacampo = this.diacampo;
        if (this.sueldo !== undefined) returnObj.sueldo = this.sueldo;
        if (this.viaticos !== undefined) returnObj.viaticos = this.viaticos;
        if (this.moto !== undefined) returnObj.moto = this.moto;
        if (this.year !== undefined) returnObj.year = this.year;
        if (this.month !== undefined) returnObj.month = this.month;
        if (this.updatedBy !== undefined) returnObj.updatedBy = this.updatedBy;
        return returnObj;
    }

    static async create(props: {
        [key: string]: any;
    }): Promise<[string?, UpdateCostoLaboralDto?]> {
        const {
            id,
            conteo1,
            conteo2,
            diacampo,
            sueldo,
            viaticos,
            moto,
            year,
            month,
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
            new UpdateCostoLaboralDto(
                Number(id),
                parseNumber(conteo1),
                parseNumber(conteo2),
                parseNumber(diacampo),
                parseNumber(sueldo),
                parseNumber(viaticos),
                parseNumber(moto),
                year ? Number(year) : undefined,
                month ? Number(month) : undefined,
                updatedBy
            ),
        ];
    }
}
