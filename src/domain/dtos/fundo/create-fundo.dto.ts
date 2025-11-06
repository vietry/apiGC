export class CreateFundoDto {
    private constructor(
        public readonly nombre: string | null,
        public readonly idClienteUbigeo: number | null,
        public readonly idPuntoUbigeo: number | null,
        public readonly idPuntoContacto: number | null,
        public readonly idContactoPunto: number | null,
        public readonly ubicacionClienteId: number | null,
        public readonly idDistrito: string | null,
        public readonly centroPoblado: string | null,
        public readonly createdBy: number | null
    ) {}

    static create(object: { [key: string]: any }): [string?, CreateFundoDto?] {
        const { nombre, idDistrito, centroPoblado } = object;

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
            new CreateFundoDto(
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
