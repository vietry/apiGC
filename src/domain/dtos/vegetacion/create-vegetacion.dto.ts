export class CreateVegetacionDto {
    private constructor(
        public readonly nombre: string,
        public readonly tipo?: string,
        public readonly nomColombia?: string
    ) {}

    static async create(object: {
        [key: string]: any;
    }): Promise<[string?, CreateVegetacionDto?]> {
        const { nombre, tipo, nomColombia } = object;

        if (!nombre) return ['Nombre faltante'];

        return [undefined, new CreateVegetacionDto(nombre, tipo, nomColombia)];
    }
}
