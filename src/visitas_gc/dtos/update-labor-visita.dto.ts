export class UpdateLaborVisitaDto {
    private constructor(
        public readonly id: number,
        public readonly idVisita?: number,
        public readonly idSubLabor?: number,
        public readonly idRepresentada?: number | null
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};

        if (this.idVisita !== undefined) returnObj.idVisita = this.idVisita;
        if (this.idSubLabor !== undefined)
            returnObj.idSubLabor = this.idSubLabor;
        if (this.idRepresentada !== undefined)
            returnObj.idRepresentada = this.idRepresentada;

        return returnObj;
    }

    static async create(object: {
        [key: string]: any;
    }): Promise<[string?, UpdateLaborVisitaDto?]> {
        const { id, idVisita, idSubLabor, idRepresentada } = object;

        if (!id || isNaN(Number(id))) {
            return ['id must be a valid number'];
        }

        return [
            undefined,
            new UpdateLaborVisitaDto(
                Number(id),
                idVisita !== undefined ? Number(idVisita) : undefined,
                idSubLabor !== undefined ? Number(idSubLabor) : undefined,
                idRepresentada !== undefined
                    ? Number(idRepresentada)
                    : undefined
            ),
        ];
    }
}
