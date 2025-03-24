export class CreateVisitaGteTiendaDto {
    private constructor(
        public readonly idGte: number,
        public readonly idPunto: number,
        public readonly idFamilia: number | null,

        public readonly objetivo: string,
        public readonly comentarios: string | null,
        public readonly cantidad: number | null,
        public readonly latitud: number | null,
        public readonly longitud: number | null //public readonly createdAt: Date | null
    ) {}

    static async create(object: {
        [key: string]: any;
    }): Promise<[string?, CreateVisitaGteTiendaDto?]> {
        const {
            idGte,
            idPunto,
            idFamilia,

            objetivo,
            comentarios,
            cantidad,
            latitud,
            longitud,
            //createdAt,
        } = object;

        if (idGte === undefined || idGte === null || isNaN(Number(idGte))) {
            return ['idGte is required and must be a valid number'];
        }
        if (
            idPunto === undefined ||
            idPunto === null ||
            isNaN(Number(idPunto))
        ) {
            return ['idPunto is required and must be a valid number'];
        }
        if (!objetivo || typeof objetivo !== 'string' || !objetivo.trim()) {
            return ['objetivo is required'];
        }

        const parseNumber = (value: any): number | null => {
            if (value === null || value === undefined) return null;
            const num = Number(value);
            return isNaN(num) ? null : num;
        };

        return [
            undefined,
            new CreateVisitaGteTiendaDto(
                Number(idGte),
                Number(idPunto),
                Number(idFamilia),

                objetivo.trim(),
                comentarios ? String(comentarios).trim() : null,
                parseFloat(cantidad),
                parseFloat(latitud),
                parseFloat(longitud)
                //createdAt ? new Date(createdAt) : null
            ),
        ];
    }
}
