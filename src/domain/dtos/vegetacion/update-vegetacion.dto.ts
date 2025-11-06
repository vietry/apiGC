export class UpdateVegetacionDto {
    private constructor(
        public readonly id: number,
        public readonly nombre?: string,
        public readonly tipo?: string,
        public readonly nomColombia?: string
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.nombre) returnObj.nombre = this.nombre;
        if (this.tipo !== undefined) returnObj.tipo = this.tipo;
        if (this.nomColombia !== undefined)
            returnObj.nomColombia = this.nomColombia;
        return returnObj;
    }

    static async create(props: {
        [key: string]: any;
    }): Promise<[string?, UpdateVegetacionDto?]> {
        const { id, nombre, tipo, nomColombia } = props;

        if (!id || isNaN(Number(id))) return ['ID inválido o faltante'];

        return [
            undefined,
            new UpdateVegetacionDto(id, nombre, tipo, nomColombia),
        ];
    }
}
