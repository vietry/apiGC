export class CreateCharlaProductoDto {
    private constructor(
        public readonly idCharla: number,
        public readonly idFamilia: number,
        public readonly idBlanco: number | null,
        public readonly createdBy: number | null,
        public readonly updatedBy: number | null
    ) {}

    static async create(object: { [key: string]: any }): Promise<[string?, CreateCharlaProductoDto?]> {
        const { idCharla, idFamilia, idBlanco, createdBy, updatedBy } = object;

        let idCharlaNumber = idCharla;
        let idFamiliaNumber = idFamilia;
        let idBlancoNumber = idBlanco;
        let createdByNumber = createdBy;
        let updatedByNumber = updatedBy;

        if (!idCharla) return ['idCharla faltante'];
        if (!idFamilia) return ['idFamilia faltante'];
        if (!createdBy) return ['createdBy faltante'];

        if (idCharla !== undefined && typeof idCharla !== 'number') {
            idCharlaNumber = parseInt(idCharla);
            if (isNaN(idCharlaNumber)) return ['idCharla debe ser un número válido'];
        }

        if (idFamilia !== undefined && typeof idFamilia !== 'number') {
            idFamiliaNumber = parseInt(idFamilia);
            if (isNaN(idFamiliaNumber)) return ['idFamilia debe ser un número válido'];
        }

        if (idBlanco !== undefined && idBlanco !== null && typeof idBlanco !== 'number') {
            idBlancoNumber = parseInt(idBlanco);
            if (isNaN(idBlancoNumber)) return ['idBlanco debe ser un número válido'];
        }

        if (createdBy !== undefined && typeof createdBy !== 'number') {
            createdByNumber = parseInt(createdBy);
            if (isNaN(createdByNumber)) return ['createdBy debe ser un número válido'];
        }

        if (updatedBy !== undefined && typeof updatedBy !== 'number') {
            updatedByNumber = parseInt(updatedBy);
            if (isNaN(updatedByNumber)) return ['updatedBy debe ser un número válido'];
        }

        return [
            undefined,
            new CreateCharlaProductoDto(
                idCharlaNumber,
                idFamiliaNumber,
                idBlancoNumber,
                createdByNumber,
                updatedByNumber
            )
        ];
    }
}