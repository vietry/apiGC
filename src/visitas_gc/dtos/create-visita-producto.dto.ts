export class CreateVisitaProductoDto {
    // Constructor privado para garantizar la creación a través del método create
    private constructor(
        public readonly idVisita: number,
        public readonly idFamilia: number
    ) {}

    static async create(object: {
        [key: string]: any;
    }): Promise<[string?, CreateVisitaProductoDto?]> {
        const { idVisita, idFamilia } = object;
        if (!idVisita || isNaN(Number(idVisita))) {
            return ['idVisita is required and must be a valid number'];
        }
        if (!idFamilia || isNaN(Number(idFamilia))) {
            return ['idFamilia is required and must be a valid number'];
        }
        return [
            undefined,
            new CreateVisitaProductoDto(Number(idVisita), Number(idFamilia)),
        ];
    }
}
