export class UpdateAsistenciaDto {
    private constructor(
        public readonly id: number,
        public readonly idContactoTienda?: number | null,
        public readonly idCharla?: number | null,
        public readonly updatedBy?: number | null
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};

        if (this.idContactoTienda !== undefined) returnObj.idContactoTienda = this.idContactoTienda;
        if (this.idCharla !== undefined) returnObj.idCharla = this.idCharla;
        if (this.updatedBy !== undefined) returnObj.updatedBy = this.updatedBy;

        return returnObj;
    }

    static async create(props: { [key: string]: any }): Promise<[string?, UpdateAsistenciaDto?]> {
        const { id, idContactoTienda, idCharla, updatedBy } = props;

        if (!id || isNaN(Number(id))) {
            return ['Invalid or missing ID'];
        }

        let idContactoTiendaNumber = idContactoTienda;
        let idCharlaNumber = idCharla;

        if (idContactoTienda !== undefined && typeof idContactoTienda !== 'number') {
            idContactoTiendaNumber = parseInt(idContactoTienda);
            if (isNaN(idContactoTiendaNumber)) return ['idContactoTienda debe ser un número válido'];
        }

        if (idCharla !== undefined && typeof idCharla !== 'number') {
            idCharlaNumber = parseInt(idCharla);
            if (isNaN(idCharlaNumber)) return ['idCharla debe ser un número válido'];
        }

        return [
            undefined,
            new UpdateAsistenciaDto(id, idContactoTiendaNumber, idCharlaNumber, updatedBy)
        ];
    }
}
