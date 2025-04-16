export class UpdateVisitaProductoDto {
    // Constructor privado para la actualización
    private constructor(
        public readonly id: number,
        public readonly idVisita?: number,
        public readonly idFamilia?: number
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.idVisita !== undefined) returnObj.idVisita = this.idVisita;
        if (this.idFamilia !== undefined) returnObj.idFamilia = this.idFamilia;
        return returnObj;
    }

    static async create(object: {
        [key: string]: any;
    }): Promise<[string?, UpdateVisitaProductoDto?]> {
        const { id, idVisita, idFamilia } = object;
        if (!id || isNaN(Number(id))) {
            return ['id must be a valid number'];
        }
        return [
            undefined,
            new UpdateVisitaProductoDto(
                Number(id),
                idVisita ? Number(idVisita) : undefined,
                idFamilia ? Number(idFamilia) : undefined
            ),
        ];
    }
}
