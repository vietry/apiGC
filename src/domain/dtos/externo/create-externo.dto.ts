export class CreateExternoDto {
    private constructor(
        public readonly cargo: string | null,
        public readonly idRepresentada: number,
        public readonly idUsuario: number | null
    ) //public readonly createdBy: number | null,
    //public readonly updatedBy: number | null
    {}

    static async create(object: {
        [key: string]: any;
    }): Promise<[string?, CreateExternoDto?]> {
        const { cargo, idRepresentada, idUsuario /*createdBy, updatedBy*/ } =
            object;

        if (!idRepresentada || isNaN(Number(idRepresentada)))
            return ['ID Representada es requerido y debe ser un número válido'];

        const parseNumber = (value: any) => {
            if (value === null || value === undefined) return null;
            const num = Number(value);
            return isNaN(num) ? null : num;
        };

        return [
            undefined,
            new CreateExternoDto(
                cargo || null,
                Number(idRepresentada),
                parseNumber(idUsuario)
                //parseNumber(createdBy),
                //parseNumber(updatedBy)
            ),
        ];
    }
}
