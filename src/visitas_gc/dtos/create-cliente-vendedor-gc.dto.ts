export class CreateClienteVendedorGCDto {
    private constructor(
        public readonly empresaId: number,
        public readonly codcli: string,
        public readonly nomcli: string | null,
        public readonly codven: string | null,
        public readonly nomvende: string | null,
        public readonly email: string | null,
        public readonly activo: boolean,
        public readonly createdBy: number
    ) {}

    static async create(object: {
        [key: string]: any;
    }): Promise<[string?, CreateClienteVendedorGCDto?]> {
        const {
            empresaId,
            codcli,
            nomcli,
            codven,
            nomvende,
            email,
            activo = true,
            createdBy,
        } = object;

        if (!empresaId || isNaN(Number(empresaId)))
            return ['empresaId es requerido y numérico'];
        if (!codcli || typeof codcli !== 'string')
            return ['codcli es requerido'];
        if (!createdBy || isNaN(Number(createdBy)))
            return ['createdBy es requerido y numérico'];

        return [
            undefined,
            new CreateClienteVendedorGCDto(
                Number(empresaId),
                String(codcli).trim(),
                nomcli ? String(nomcli).trim() : null,
                String(codven).trim(),
                nomvende ? String(nomvende).trim() : null,
                email ? String(email).trim() : null,
                Boolean(activo),
                Number(createdBy)
            ),
        ];
    }
}
