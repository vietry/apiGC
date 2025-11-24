export class CreateVisitaCultivoAgricultorDto {
    private constructor(
        public readonly visitaId: number,
        public readonly cultivoAgricultorId: number,
        public readonly createdBy: number
    ) {}

    static async create(props: {
        [key: string]: any;
    }): Promise<[string?, CreateVisitaCultivoAgricultorDto?]> {
        const { visitaId, cultivoAgricultorId, createdBy } = props;

        if (!visitaId || Number.isNaN(Number(visitaId))) {
            return ['visitaId es requerido y debe ser un número válido'];
        }

        if (!cultivoAgricultorId || Number.isNaN(Number(cultivoAgricultorId))) {
            return [
                'cultivoAgricultorId es requerido y debe ser un número válido',
            ];
        }

        if (!createdBy || Number.isNaN(Number(createdBy))) {
            return ['createdBy es requerido y debe ser un número válido'];
        }

        return [
            undefined,
            new CreateVisitaCultivoAgricultorDto(
                Number(visitaId),
                Number(cultivoAgricultorId),
                Number(createdBy)
            ),
        ];
    }
}
