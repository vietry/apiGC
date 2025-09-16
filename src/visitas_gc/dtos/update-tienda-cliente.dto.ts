export class UpdateTiendaClienteDto {
    private constructor(
        public readonly id: number,
        public readonly values: {
            codcli?: string;
            id_tda?: number | null;
            descrip?: string | null;
            codsbz?: string | null;
            direccion?: string | null;
            debaja?: number | null;
            ubigeo?: string | null;
            observ?: string | null;
            vigente?: boolean;
            editable?: boolean;
            createdBy?: number | null;
            clienteVendedorId?: number | null;
        }
    ) {}

    static async create(object: {
        [key: string]: any;
    }): Promise<[string?, UpdateTiendaClienteDto?]> {
        const { id, ...rest } = object;
        const parsedId = Number(id);
        if (!parsedId || isNaN(parsedId)) return ['id inválido'];

        const values: any = {};
        const set = (key: string, val: any) => {
            if (val !== undefined) values[key] = val;
        };
        const toStr = (v: any) => (v ? String(v) : null);
        const toNumOrNull = (v: any) =>
            v === null || v === '' || v === undefined ? null : Number(v);

        set(
            'codcli',
            rest.codcli !== undefined ? String(rest.codcli) : undefined
        );
        set('id_tda', toNumOrNull(rest.id_tda));
        set(
            'descrip',
            rest.descrip !== undefined ? toStr(rest.descrip) : undefined
        );
        set(
            'codsbz',
            rest.codsbz !== undefined ? toStr(rest.codsbz) : undefined
        );
        set(
            'direccion',
            rest.direccion !== undefined ? toStr(rest.direccion) : undefined
        );
        set('debaja', toNumOrNull(rest.debaja));
        set(
            'ubigeo',
            rest.ubigeo !== undefined ? toStr(rest.ubigeo) : undefined
        );
        set(
            'observ',
            rest.observ !== undefined ? toStr(rest.observ) : undefined
        );
        set(
            'vigente',
            rest.vigente !== undefined ? Boolean(rest.vigente) : undefined
        );
        set(
            'editable',
            rest.editable !== undefined ? Boolean(rest.editable) : undefined
        );
        set('createdBy', toNumOrNull(rest.createdBy));
        set('clienteVendedorId', toNumOrNull(rest.clienteVendedorId));

        return [undefined, new UpdateTiendaClienteDto(parsedId, values)];
    }
}
