export class UpdateFotoUsuarioDto {
    private constructor(
        public readonly id: number,
        public readonly nombre?: string | null,
        public readonly rutaFoto?: string | null,
        public readonly tipo?: string | null
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};

        if (this.nombre !== undefined) returnObj.nombre = this.nombre;
        if (this.rutaFoto !== undefined) returnObj.rutaFoto = this.rutaFoto;
        if (this.tipo !== undefined) returnObj.tipo = this.tipo;

        return returnObj;
    }

    static async create(props: {
        [key: string]: any;
    }): Promise<[string?, UpdateFotoUsuarioDto?]> {
        const { id, nombre, rutaFoto, tipo } = props;

        if (!id || isNaN(Number(id))) {
            return ['Invalid or missing ID'];
        }

        return [
            undefined,
            new UpdateFotoUsuarioDto(id, nombre, rutaFoto, tipo),
        ];
    }
}
