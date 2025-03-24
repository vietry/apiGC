export class CreateConsumoMuestrasDto {
    private constructor(
        public readonly idEntrega: number | null,
        public readonly idDemoplot: number,
        public readonly consumo: number,
        public readonly complemento: number | null,
        public readonly fechaConsumo: Date | null,
        public readonly comentarios: string | null,
        public readonly createdBy: number | null,
        public readonly updatedBy: number | null
    ) {}

    static async create(object: {
        [key: string]: any;
    }): Promise<[string?, CreateConsumoMuestrasDto?]> {
        const {
            idEntrega,
            idDemoplot,
            consumo,
            complemento,
            fechaConsumo,
            comentarios,
            createdBy,
            updatedBy,
        } = object;

        if (!idEntrega || isNaN(Number(idEntrega))) {
            return ['idEntrega is required and must be a valid number'];
        }

        if (!idDemoplot || isNaN(Number(idDemoplot))) {
            return ['idDemoplot is required and must be a valid number'];
        }

        if (!consumo || isNaN(Number(consumo))) {
            return ['consumo is required and must be a valid number'];
        }

        const parseNumber = (value: any): number | null => {
            if (value === null || value === undefined) return null;
            const num = Number(value);
            return isNaN(num) ? null : num;
        };

        return [
            undefined,
            new CreateConsumoMuestrasDto(
                Number(idEntrega),
                Number(idDemoplot),
                Number(consumo),
                parseNumber(complemento),
                fechaConsumo ? new Date(fechaConsumo) : null,
                comentarios ?? null,
                createdBy ? Number(createdBy) : null,
                updatedBy ? Number(updatedBy) : null
            ),
        ];
    }
}
