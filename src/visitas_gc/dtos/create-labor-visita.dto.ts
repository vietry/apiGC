export class CreateLaborVisitaDto {
    private constructor(
        public readonly idVisita: number,
        public readonly idSubLabor: number,
        public readonly idRepresentada: number | null
    ) {}

    static async create(object: {
        [key: string]: any;
    }): Promise<[string?, CreateLaborVisitaDto?]> {
        const { idVisita, idSubLabor, idRepresentada } = object;

        if (!idVisita || isNaN(Number(idVisita))) {
            return ['idVisita is required and must be a valid number'];
        }

        if (!idSubLabor || isNaN(Number(idSubLabor))) {
            return ['idSubLabor is required and must be a valid number'];
        }

        return [
            undefined,
            new CreateLaborVisitaDto(
                Number(idVisita),
                Number(idSubLabor),
                idRepresentada !== undefined ? Number(idRepresentada) : null
            ),
        ];
    }
}
