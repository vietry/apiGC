export class UpdateConsumoMuestrasDto {
    private constructor(
        public readonly id: number,
        public readonly idEntrega?: number,
        public readonly idDemoplot?: number,
        public readonly consumo?: number,
        public readonly complemento?: number | null,
        public readonly fechaConsumo?: Date | null,
        public readonly comentarios?: string | null,
        public readonly updatedBy?: number | null
    ) {}

    get values(): { [key: string]: any } {
        const returnObj: { [key: string]: any } = {};

        if (this.idEntrega !== undefined) returnObj.idEntrega = this.idEntrega;
        if (this.idDemoplot !== undefined)
            returnObj.idDemoplot = this.idDemoplot;
        if (this.consumo !== undefined) returnObj.consumo = this.consumo;
        if (this.complemento !== undefined)
            returnObj.complemento = this.complemento;
        if (this.fechaConsumo !== undefined)
            returnObj.fechaConsumo = this.fechaConsumo;
        if (this.comentarios !== undefined)
            returnObj.comentarios = this.comentarios;
        if (this.updatedBy !== undefined) returnObj.updatedBy = this.updatedBy;

        return returnObj;
    }

    static async create(object: {
        [key: string]: any;
    }): Promise<[string?, UpdateConsumoMuestrasDto?]> {
        const {
            id,
            idEntrega,
            idDemoplot,
            consumo,
            complemento,
            fechaConsumo,
            comentarios,
            updatedBy,
        } = object;

        if (!id || isNaN(Number(id))) {
            return ['id is required and must be a valid number'];
        }

        const parseNumber = (value: any): number | null => {
            if (value === null || value === undefined) return null;
            const num = Number(value);
            return isNaN(num) ? null : num;
        };

        return [
            undefined,
            new UpdateConsumoMuestrasDto(
                Number(id),
                idEntrega !== undefined ? Number(idEntrega) : undefined,
                idDemoplot !== undefined ? Number(idDemoplot) : undefined,
                consumo !== undefined ? Number(consumo) : undefined,
                parseNumber(complemento),
                fechaConsumo ? new Date(fechaConsumo) : undefined,
                comentarios ?? undefined,
                updatedBy !== undefined ? Number(updatedBy) : undefined
            ),
        ];
    }
}
