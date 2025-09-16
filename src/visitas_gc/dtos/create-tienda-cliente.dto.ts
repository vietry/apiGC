export class CreateTiendaClienteDto {
    private constructor(
        public readonly codcli: string,
        public readonly id_tda: number | null,
        public readonly descrip: string | null,
        public readonly codsbz: string | null,
        public readonly direccion: string | null,
        public readonly debaja: number | null,
        public readonly ubigeo: string | null,
        public readonly observ: string | null,
        public readonly vigente: boolean,
        public readonly editable: boolean,
        public readonly createdBy: number | null,
        public readonly clienteVendedorId: number | null
    ) {}

    static async create(object: {
        [key: string]: any;
    }): Promise<[string?, CreateTiendaClienteDto?]> {
        const {
            codcli,
            id_tda,
            descrip,
            codsbz,
            direccion,
            debaja,
            ubigeo,
            observ,
            vigente = true,
            editable = false,
            createdBy = null,
            clienteVendedorId = null,
        } = object;

        if (!codcli || typeof codcli !== 'string')
            return ['codcli es requerido'];

        return [
            undefined,
            new CreateTiendaClienteDto(
                String(codcli).trim(),
                id_tda !== undefined && id_tda !== null ? Number(id_tda) : null,
                descrip ? String(descrip).trim() : null,
                codsbz ? String(codsbz).trim() : null,
                direccion ? String(direccion).trim() : null,
                debaja !== undefined && debaja !== null ? Number(debaja) : null,
                ubigeo ? String(ubigeo).trim() : null,
                observ ? String(observ).trim() : null,
                Boolean(vigente),
                Boolean(editable),
                createdBy !== null && createdBy !== undefined
                    ? Number(createdBy)
                    : null,
                clienteVendedorId !== null && clienteVendedorId !== undefined
                    ? Number(clienteVendedorId)
                    : null
            ),
        ];
    }
}
