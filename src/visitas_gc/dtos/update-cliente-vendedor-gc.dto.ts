export class UpdateClienteVendedorGCDto {
    private constructor(
        public readonly id: number,
        public readonly values: {
            empresaId?: number;
            codcli?: string;
            nomcli?: string | null;
            codven?: string;
            nomvende?: string | null;
            email?: string | null;
            activo?: boolean;
            updatedBy?: number | null;
        }
    ) {}

    static async create(object: {
        [key: string]: any;
    }): Promise<[string?, UpdateClienteVendedorGCDto?]> {
        const { id, ...rest } = object;
        const parsedId = Number(id);
        if (!parsedId || isNaN(parsedId)) return ['id inválido'];

        const values: any = {};
        if (rest.empresaId !== undefined)
            values.empresaId = Number(rest.empresaId);
        if (rest.codcli !== undefined) values.codcli = String(rest.codcli);
        if (rest.nomcli !== undefined)
            values.nomcli = rest.nomcli ? String(rest.nomcli) : null;
        if (rest.codven !== undefined) values.codven = String(rest.codven);
        if (rest.nomvende !== undefined)
            values.nomvende = rest.nomvende ? String(rest.nomvende) : null;
        if (rest.email !== undefined)
            values.email = rest.email ? String(rest.email) : null;
        if (rest.activo !== undefined) values.activo = Boolean(rest.activo);
        if (rest.updatedBy !== undefined)
            values.updatedBy = Number(rest.updatedBy);

        return [undefined, new UpdateClienteVendedorGCDto(parsedId, values)];
    }
}
