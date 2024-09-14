export class CreateVegetacionDto {
    private constructor(
        public readonly nombre: string,
    ) {}

    static async create(object: { [key: string]: any }): Promise<[string?, CreateVegetacionDto?]> {
        const { nombre } = object;

        if (!nombre) return ['Nombre faltante'];

        return [
            undefined,
            new CreateVegetacionDto(
                nombre,
            )
        ];
    }
}
