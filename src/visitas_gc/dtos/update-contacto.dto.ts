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
            clienteExactusId?: number;
            clienteGestionCId?: number;
            tipo?: string | null;
            createdBy?: number | null;
        }
    ) {}

    static async create(object: {
        [key: string]: any;
    }): Promise<[string?, UpdateContactoDto?]> {
        const { id, ...rest } = object ?? {};
        const parsedId = Number(id);
        if (!parsedId || isNaN(parsedId)) return ['id inválido'];

        const values: any = {};
        const set = (key: string, val: any) => {
            if (val !== undefined) values[key] = val;
        };
        const toStrOrNull = (v: any) => {
            if (v === undefined) return undefined;
            return v ? String(v) : null;
        };
        const toNum = (v: any) => (v === undefined ? undefined : Number(v));
        const toBool = (v: any) => (v === undefined ? undefined : Boolean(v));

        set(
            'nombre',
            rest.nombre !== undefined ? String(rest.nombre) : undefined
        );
        set(
            'apellido',
            rest.apellido !== undefined ? String(rest.apellido) : undefined
        );
        set('cargo', rest.cargo !== undefined ? String(rest.cargo) : undefined);
        set('email', toStrOrNull(rest.email));
        set('celularA', toStrOrNull(rest.celularA));
        set('celularB', toStrOrNull(rest.celularB));
        set('activo', toBool(rest.activo));
        set('clienteExactusId', toNum(rest.clienteExactusId));
        set('clienteGestionCId', toNum(rest.clienteGestionCId));
        set('tipo', toStrOrNull(rest.tipo));
        if (rest.createdBy !== undefined) {
            set(
                'createdBy',
                rest.createdBy === null ? null : Number(rest.createdBy)
            );
        }

        return [undefined, new UpdateContactoDto(parsedId, values)];
    }
}
