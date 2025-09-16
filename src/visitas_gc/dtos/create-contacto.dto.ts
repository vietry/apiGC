export class CreateContactoDto {
    private constructor(
        public readonly nombre: string,
        public readonly apellido: string,
        public readonly cargo: string,
        public readonly email: string | null,
        public readonly celularA: string | null,
        public readonly celularB: string | null,
        public readonly activo: boolean,
        public readonly clienteExactusId: number,
        public readonly clienteGestionCId: number,
        public readonly tipo: string | null,
        public readonly createdBy: number | null
    ) {}

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
        } = object ?? {};

        if (!nombre || typeof nombre !== 'string')
            return ['nombre es requerido'];
        if (!apellido || typeof apellido !== 'string')
            return ['apellido es requerido'];
        if (!cargo || typeof cargo !== 'string') return ['cargo es requerido'];

        const parsedExactus = Number(clienteExactusId);
        const parsedGestionC = Number(clienteGestionCId);
        if (!parsedExactus || isNaN(parsedExactus))
            return ['clienteExactusId es requerido y numérico'];
        if (!parsedGestionC || isNaN(parsedGestionC))
            return ['clienteGestionCId es requerido y numérico'];

        const parsedCreatedBy =
            createdBy === null || createdBy === undefined
                ? null
                : Number(createdBy);
        if (parsedCreatedBy !== null && isNaN(parsedCreatedBy))
            return ['createdBy debe ser numérico si se envía'];

        return [
            undefined,
            new CreateContactoDto(
                String(nombre).trim(),
                String(apellido).trim(),
                String(cargo).trim(),
                email ? String(email).trim() : null,
                celularA ? String(celularA).trim() : null,
                celularB ? String(celularB).trim() : null,
                Boolean(activo),
                parsedExactus,
                parsedGestionC,
                tipo ? String(tipo).trim() : null,
                parsedCreatedBy
            ),
        ];
    }
}
