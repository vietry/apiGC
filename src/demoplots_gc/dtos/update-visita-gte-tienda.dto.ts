export class UpdateVisitaGteTiendaDto {
    private constructor(
        public readonly id: number,
        public readonly idGte?: number,
        public readonly idPunto?: number,
        public readonly idFamilia?: number | null,
        public readonly idFoto?: number | null,
        public readonly objetivo?: string,
        public readonly comentarios?: string | null,
        public readonly cantidad?: number | null,
        public readonly latitud?: number | null,
        public readonly longitud?: number | null
    ) {}

    get values(): { [key: string]: any } {
        const returnObj: { [key: string]: any } = {};

        if (this.idGte !== undefined) returnObj.idGte = this.idGte;
        if (this.idPunto !== undefined) returnObj.idPunto = this.idPunto;
        if (this.idFamilia) returnObj.idFamilia = this.idFamilia;
        if (this.idFoto !== undefined) returnObj.idFoto = this.idFoto;
        if (this.objetivo !== undefined) returnObj.objetivo = this.objetivo;
        if (this.comentarios !== undefined)
            returnObj.comentarios = this.comentarios;
        if (this.cantidad) returnObj.cantidad = this.cantidad;
        if (this.latitud) returnObj.latitud = this.latitud;
        if (this.longitud) returnObj.longitud = this.longitud;

        return returnObj;
    }

    static async create(object: {
        [key: string]: any;
    }): Promise<[string?, UpdateVisitaGteTiendaDto?]> {
        const {
            id,
            idGte,
            idPunto,
            idFamilia,
            idFoto,
            objetivo,
            comentarios,
            cantidad,
            latitud,
            longitud,
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
            new UpdateVisitaGteTiendaDto(
                Number(id),
                idGte !== undefined ? Number(idGte) : undefined,
                idPunto !== undefined ? Number(idPunto) : undefined,
                idFamilia !== undefined ? Number(idFamilia) : undefined,
                idFoto !== undefined ? Number(idFoto) : undefined,
                objetivo !== undefined && typeof objetivo === 'string'
                    ? objetivo.trim()
                    : undefined,
                comentarios,
                cantidad !== undefined ? parseNumber(cantidad) : undefined,
                latitud !== undefined ? parseFloat(latitud) : undefined,
                longitud !== undefined ? parseFloat(longitud) : undefined
            ),
        ];
    }
}
