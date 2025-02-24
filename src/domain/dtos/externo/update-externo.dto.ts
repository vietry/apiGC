export class UpdateExternoDto {
    private constructor(
        public readonly id: number,
        public readonly cargo?: string | null,
        public readonly idRepresentada?: number,
        public readonly idUsuario?: number | null
    ) //public readonly updatedBy?: number | null
    {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.cargo !== undefined) returnObj.cargo = this.cargo;
        if (this.idRepresentada !== undefined)
            returnObj.idRepresentada = this.idRepresentada;
        if (this.idUsuario !== undefined) returnObj.idUsuario = this.idUsuario;
        //if (this.updatedBy !== undefined) returnObj.updatedBy = this.updatedBy;
        return returnObj;
    }

    static async create(props: {
        [key: string]: any;
    }): Promise<[string?, UpdateExternoDto?]> {
        const { id, cargo, idRepresentada, idUsuario /*updatedBy*/ } = props;

        if (!id || isNaN(Number(id))) return ['ID inválido o faltante'];

        if (idRepresentada !== undefined && isNaN(Number(idRepresentada)))
            return ['ID Representada debe ser un número válido'];

        const parseNumber = (value: any) => {
            if (value === undefined) return undefined;
            if (value === null) return null;
            const num = Number(value);
            return isNaN(num) ? undefined : num;
        };

        return [
            undefined,
            new UpdateExternoDto(
                Number(id),
                cargo,
                idRepresentada ? Number(idRepresentada) : undefined,
                parseNumber(idUsuario)
                //updatedBy
            ),
        ];
    }
}
