export class UpdateFundoDto {
    private constructor(
        public readonly id: number,
        public readonly nombre?: string | null,
        public readonly idClienteUbigeo?: number | null,
        public readonly idPuntoUbigeo?: number | null,
        public readonly idPuntoContacto?: number | null,
        public readonly idContactoPunto?: number | null,
        public readonly ubicacionClienteId?: number | null,
        public readonly idDistrito?: string | null,
        public readonly centroPoblado?: string | null,
        public readonly createdBy?: number | null
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};

        if (this.nombre) returnObj.nombre = this.nombre;
        if (this.idClienteUbigeo)
            returnObj.idClienteUbigeo = this.idClienteUbigeo;
        if (this.idPuntoUbigeo) returnObj.idPuntoUbigeo = this.idPuntoUbigeo;
        if (this.idPuntoContacto)
            returnObj.idPuntoContacto = this.idPuntoContacto;
        if (this.idContactoPunto)
            returnObj.idContactoPunto = this.idContactoPunto;
        if (this.idDistrito) returnObj.idDistrito = this.idDistrito;
        if (this.centroPoblado) returnObj.centroPoblado = this.centroPoblado;
        if (this.ubicacionClienteId)
            returnObj.ubicacionClienteId = this.ubicacionClienteId;
        if (this.createdBy !== undefined) returnObj.createdBy = this.createdBy;

        return returnObj;
    }

    static create(object: { [key: string]: any }): [string?, UpdateFundoDto?] {
        const { id, nombre, idDistrito, centroPoblado } = object;

        if (!id || isNaN(Number(id))) return ['Invalid or missing ID'];

        const numericKeys = [
            'idClienteUbigeo',
            'idPuntoUbigeo',
            'idPuntoContacto',
            'idContactoPunto',
            'ubicacionClienteId',
            'createdBy',
        ] as const;

        const parsed: Record<string, number | null | undefined> = {};
        for (const key of numericKeys) {
            const val = (object as any)[key];
            if (val === undefined || val === null || typeof val === 'number') {
                parsed[key] = val;
                continue;
            }
            const n = parseInt(val);
            if (isNaN(n)) return [`${key} must be a valid number`];
            parsed[key] = n;
        }

        return [
            undefined,
            new UpdateFundoDto(
                Number(id),
                nombre ?? null,
                (parsed['idClienteUbigeo'] as number) ?? null,
                (parsed['idPuntoUbigeo'] as number) ?? null,
                (parsed['idPuntoContacto'] as number) ?? null,
                (parsed['idContactoPunto'] as number) ?? null,
                (parsed['ubicacionClienteId'] as number) ?? null,
                idDistrito ?? null,
                centroPoblado ?? null,
                (parsed['createdBy'] as number) ?? null
            ),
        ];
    }
}
