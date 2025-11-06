export class CreateContactoDto {
    private constructor(
        public readonly nombre: string,
        public readonly apellido: string,
        public readonly cargo: string,
        public readonly email: string | null,
        public readonly celularA: string | null,
        public readonly celularB: string | null,
        public readonly activo: boolean,
        public readonly clienteExactusId: number | null,
        public readonly clienteGestionCId: number | null,
        public readonly tipo: string | null,
        public readonly createdBy: number | null,
        public readonly ubicacionId: number | null
    ) {}

    // Helpers para reducir complejidad en create()
    private static requiredString(
        value: any,
        field: string
    ): [string | undefined, string | undefined] {
        if (!value || typeof value !== 'string')
            return [`${field} es requerido`, undefined];
        return [undefined, String(value).trim()];
    }

    private static optionalTrim(value: any): string | null {
        return value ? String(value).trim() : null;
    }

    private static optionalPositiveNumber(
        value: any,
        field: string
    ): [string | undefined, number | null] {
        if (value === null || value === undefined) return [undefined, null];
        const n = Number(value);
        if (isNaN(n) || n <= 0)
            return [`${field} debe ser numérico y mayor a 0 si se envía`, null];
        return [undefined, n];
    }

    private static optionalNumber(
        value: any,
        field: string
    ): [string | undefined, number | null] {
        if (value === null || value === undefined) return [undefined, null];
        const n = Number(value);
        if (isNaN(n)) return [`${field} debe ser numérico si se envía`, null];
        return [undefined, n];
    }

    static async create(object: {
        [key: string]: any;
    }): Promise<[string?, CreateContactoDto?]> {
        const {
            nombre,
            apellido,
            cargo,
            email = null,
            celularA = null,
            celularB = null,
            activo = true,
            clienteExactusId,
            clienteGestionCId,
            tipo = null,
            createdBy = null,
            ubicacionId = null,
        } = object ?? {};

        const [eNombre, vNombre] = this.requiredString(nombre, 'nombre');
        if (eNombre) return [eNombre];
        const [eApellido, vApellido] = this.requiredString(
            apellido,
            'apellido'
        );
        if (eApellido) return [eApellido];
        const [eCargo, vCargo] = this.requiredString(cargo, 'cargo');
        if (eCargo) return [eCargo];

        const [eExactus, vExactus] = this.optionalPositiveNumber(
            clienteExactusId,
            'clienteExactusId'
        );
        if (eExactus) return [eExactus];
        const [eGestionC, vGestionC] = this.optionalPositiveNumber(
            clienteGestionCId,
            'clienteGestionCId'
        );
        if (eGestionC) return [eGestionC];

        if (vExactus === null && vGestionC === null)
            return [
                'Debe enviar al menos uno: clienteExactusId o clienteGestionCId',
            ];

        const [eCreatedBy, vCreatedBy] = this.optionalNumber(
            createdBy,
            'createdBy'
        );
        if (eCreatedBy) return [eCreatedBy];

        const [eUbic, vUbic] = this.optionalNumber(ubicacionId, 'ubicacionId');
        if (eUbic) return [eUbic];

        return [
            undefined,
            new CreateContactoDto(
                vNombre!,
                vApellido!,
                vCargo!,
                this.optionalTrim(email),
                this.optionalTrim(celularA),
                this.optionalTrim(celularB),
                Boolean(activo),
                vExactus ?? null,
                vGestionC ?? null,
                tipo ? String(tipo).trim() : null,
                vCreatedBy ?? null,
                vUbic ?? null
            ),
        ];
    }
}
