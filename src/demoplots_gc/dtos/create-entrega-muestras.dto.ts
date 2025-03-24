export class CreateEntregaMuestrasDto {
    private constructor(
        public readonly idFamilia: number,
        public readonly idGte: number,
        public readonly presentacion: number | null,
        public readonly unidades: number | null,
        public readonly total: number | null,
        public readonly agotado: boolean | null,
        public readonly facturacion: Date | null,
        public readonly recepcion: Date | null,
        public readonly createdBy: number | null,
        public readonly updatedBy: number | null
    ) {}

    static async create(object: {
        [key: string]: any;
    }): Promise<[string?, CreateEntregaMuestrasDto?]> {
        const {
            idFamilia,
            idGte,
            presentacion,
            unidades,
            total,
            agotado,
            facturacion,
            recepcion,
            createdBy,
            updatedBy,
        } = object;

        if (!idFamilia || isNaN(Number(idFamilia))) {
            return ['idFamilia is required and must be a valid number'];
        }

        if (!idGte || isNaN(Number(idGte))) {
            return ['idGte is required and must be a valid number'];
        }

        const parseNumber = (value: any): number | null => {
            if (value === null || value === undefined) return null;
            const num = Number(value);
            return isNaN(num) ? null : num;
        };

        const parsedAgotado = (): boolean | null => {
            if (agotado === undefined || agotado === null) {
                return false; // Valor por defecto si no se proporciona
            }

            if (typeof agotado === 'boolean') {
                return agotado; // Si ya es boolean, devolver tal cual
            }

            // Si es string, convertir a boolean
            if (agotado === 'true' || agotado === '1' || agotado === 1) {
                return true;
            } else if (
                agotado === 'false' ||
                agotado === '0' ||
                agotado === 0
            ) {
                return false;
            }

            return false; // Valor por defecto para otros casos
        };

        return [
            undefined,
            new CreateEntregaMuestrasDto(
                Number(idFamilia),
                Number(idGte),
                parseNumber(presentacion),
                parseNumber(unidades),
                parseNumber(total),
                parsedAgotado(),
                facturacion ? new Date(facturacion) : null,
                recepcion ? new Date(recepcion) : null,
                createdBy ? Number(createdBy) : null,
                updatedBy ? Number(updatedBy) : null
            ),
        ];
    }
}
