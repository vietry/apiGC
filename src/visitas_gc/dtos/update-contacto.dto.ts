export class UpdateContactoDto {
    private constructor(
        public readonly id: number,
        public readonly values: {
            nombre?: string;
            apellido?: string;
            cargo?: string;
            email?: string | null;
            celularA?: string | null;
            celularB?: string | null;
            activo?: boolean;
            clienteExactusId?: number | null;
            clienteGestionCId?: number | null;
            tipo?: string | null;
            createdBy?: number | null;
            ubicacionId?: number | null;
        }
    ) {}

    static async create(object: {
        [key: string]: any;
    }): Promise<[string?, UpdateContactoDto?]> {
        const { id, ...rest } = object ?? {};
        const parsedId = Number(id);
        if (!parsedId || isNaN(parsedId)) return ['id inválido'];

        const values: any = {};
        const setIfDefined = (key: string, val: any) => {
            if (val !== undefined) values[key] = val;
        };
        const toStrOrNull = (v: any): string | null | undefined => {
            if (v === undefined) return undefined;
            return v ? String(v) : null;
        };
        const toBool = (v: any): boolean | undefined =>
            v === undefined ? undefined : Boolean(v);
        const parseNumOrNull = (v: any): number | null | undefined => {
            if (v === undefined) return undefined;
            if (v === null) return null;
            return Number(v);
        };

        setIfDefined(
            'nombre',
            rest.nombre !== undefined ? String(rest.nombre) : undefined
        );
        setIfDefined(
            'apellido',
            rest.apellido !== undefined ? String(rest.apellido) : undefined
        );
        setIfDefined(
            'cargo',
            rest.cargo !== undefined ? String(rest.cargo) : undefined
        );
        setIfDefined('email', toStrOrNull(rest.email));
        setIfDefined('celularA', toStrOrNull(rest.celularA));
        setIfDefined('celularB', toStrOrNull(rest.celularB));
        setIfDefined('activo', toBool(rest.activo));

        const ce = parseNumOrNull(rest.clienteExactusId);
        if (ce !== undefined && ce !== null && isNaN(ce as any))
            return ['clienteExactusId debe ser numérico si se envía'];
        const cg = parseNumOrNull(rest.clienteGestionCId);
        if (cg !== undefined && cg !== null && isNaN(cg as any))
            return ['clienteGestionCId debe ser numérico si se envía'];
        setIfDefined('clienteExactusId', ce);
        setIfDefined('clienteGestionCId', cg);

        setIfDefined('tipo', toStrOrNull(rest.tipo));
        const createdBy = parseNumOrNull(rest.createdBy);
        if (
            createdBy !== undefined &&
            createdBy !== null &&
            isNaN(createdBy as any)
        )
            return ['createdBy debe ser numérico si se envía'];
        setIfDefined('createdBy', createdBy);
        const ubicacionId = parseNumOrNull(rest.ubicacionId);
        if (
            ubicacionId !== undefined &&
            ubicacionId !== null &&
            isNaN(ubicacionId as any)
        )
            return ['ubicacionId debe ser numérico si se envía'];
        setIfDefined('ubicacionId', ubicacionId);

        return [undefined, new UpdateContactoDto(parsedId, values)];
    }
}
