export class CreateAsistenciaDto {
    private constructor(
        public readonly idContactoTienda: number,
        public readonly idCharla: number,
                //public createdAt: Date | null,
                public createdBy: number | null,
                //public updatedAt: Date | null,
                public updatedBy: number | null
    ) {}

    static async create(object: { [key: string]: any }): Promise<[string?, CreateAsistenciaDto?]> {
        const { idContactoTienda, idCharla, createdBy, updatedBy } = object;

        if (!idContactoTienda) return ['idContactoTienda faltante'];
        if (!idCharla) return ['idCharla faltante'];

        const idContactoTiendaNumber = parseInt(idContactoTienda);
        const idCharlaNumber = parseInt(idCharla);

        if (isNaN(idContactoTiendaNumber)) return ['idContactoTienda debe ser un número válido'];
        if (isNaN(idCharlaNumber)) return ['idCharla debe ser un número válido'];

        return [
            undefined,
            new CreateAsistenciaDto(idContactoTiendaNumber, idCharlaNumber, createdBy, updatedBy)
        ];
    }
}
