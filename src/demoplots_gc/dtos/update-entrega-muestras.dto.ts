export class UpdateEntregaMuestrasDto {
    private constructor(
        public readonly id: number,
        public readonly idFamilia?: number,
        public readonly idGte?: number,
        public readonly presentacion?: number | null,
        public readonly unidades?: number | null,
        public readonly total?: number | null,
        public readonly agotado?: boolean | null,
        public readonly facturacion?: Date | null,
        public readonly recepcion?: Date | null,
        public readonly updatedBy?: number | null
    ) {}

    get values(): { [key: string]: any } {
        const returnObj: { [key: string]: any } = {};

        if (this.idFamilia !== undefined) returnObj.idFamilia = this.idFamilia;
        if (this.idGte !== undefined) returnObj.idGte = this.idGte;
        if (this.presentacion !== undefined)
            returnObj.presentacion = this.presentacion;
        if (this.unidades !== undefined) returnObj.unidades = this.unidades;
        if (this.total !== undefined) returnObj.total = this.total;
        if (this.agotado !== undefined) returnObj.agotado = this.agotado;
        if (this.facturacion !== undefined)
            returnObj.facturacion = this.facturacion;
        if (this.recepcion !== undefined) returnObj.recepcion = this.recepcion;
        if (this.updatedBy !== undefined) returnObj.updatedBy = this.updatedBy;

        return returnObj;
    }

    static async create(object: {
        [key: string]: any;
    }): Promise<[string?, UpdateEntregaMuestrasDto?]> {
        const {
            id,
            idFamilia,
            idGte,
            presentacion,
            unidades,
            total,
            agotado,
            facturacion,
            recepcion,
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
            new UpdateEntregaMuestrasDto(
                Number(id),
                idFamilia !== undefined ? Number(idFamilia) : undefined,
                idGte !== undefined ? Number(idGte) : undefined,
                parseNumber(presentacion),
                parseNumber(unidades),
                parseNumber(total),
                agotado !== undefined ? Boolean(agotado) : undefined,
                facturacion ? new Date(facturacion) : undefined,
                recepcion ? new Date(recepcion) : undefined,
                updatedBy !== undefined ? Number(updatedBy) : undefined
            ),
        ];
    }
}
