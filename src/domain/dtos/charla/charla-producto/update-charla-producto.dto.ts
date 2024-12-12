export class UpdateCharlaProductoDto {
    private constructor(
        public readonly id: number,
        public readonly idCharla?: number,
        public readonly idFamilia?: number,
        public readonly idBlanco?: number | null,
        public readonly updatedBy?: number | null
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};

        if (this.idCharla !== undefined) returnObj.idCharla = this.idCharla;
        if (this.idFamilia !== undefined) returnObj.idFamilia = this.idFamilia;
        if (this.idBlanco !== undefined) returnObj.idBlanco = this.idBlanco;
        if (this.updatedBy !== undefined) returnObj.updatedBy = this.updatedBy;

        return returnObj;
    }

    static async create(props: { [key: string]: any }): Promise<[string?, UpdateCharlaProductoDto?]> {
        const { id, idCharla, idFamilia, idBlanco, updatedBy } = props;

        if (!id || isNaN(Number(id))) {
            return ['Invalid or missing ID'];
        }

        let idCharlaNumber = idCharla;
        let idFamiliaNumber = idFamilia;
        let idBlancoNumber = idBlanco;

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

        return [
            undefined,
            new UpdateCharlaProductoDto(
                id,
                idCharlaNumber,
                idFamiliaNumber,
                idBlancoNumber,
                updatedBy
            )
        ];
    }
}