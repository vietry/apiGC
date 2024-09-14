export class UpdateVegetacionDto {
    private constructor(
        public readonly id: number,
        public readonly nombre?: string,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.nombre) returnObj.nombre = this.nombre;
        return returnObj;
    }

    static async create(props: { [key: string]: any }): Promise<[string?, UpdateVegetacionDto?]> {
        const { id, nombre } = props;

        if (!id || isNaN(Number(id))) return ['ID inválido o faltante'];

        return [
            undefined,
            new UpdateVegetacionDto(
                id,
                nombre,
            )
        ];
    }
}
