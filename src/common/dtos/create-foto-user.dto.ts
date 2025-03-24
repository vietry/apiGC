export class CreateFotoUsuarioDto {
    private constructor(
        public readonly nombre: string | null,
        public readonly rutaFoto: string | null,
        public readonly tipo: string | null
    ) {}

    static async create(object: {
        [key: string]: any;
    }): Promise<[string?, CreateFotoUsuarioDto?]> {
        const { nombre, rutaFoto, tipo } = object;

        return [undefined, new CreateFotoUsuarioDto(nombre, rutaFoto, tipo)];
    }
}
