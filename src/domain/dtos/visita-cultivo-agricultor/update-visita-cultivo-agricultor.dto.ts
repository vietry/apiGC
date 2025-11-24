export class UpdateVisitaCultivoAgricultorDto {
    private constructor(
        public readonly id: number,
        public readonly visitaId?: number,
        public readonly cultivoAgricultorId?: number,
        public readonly updatedBy?: number
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};

        if (this.visitaId !== undefined) returnObj.visitaId = this.visitaId;
        if (this.cultivoAgricultorId !== undefined)
            returnObj.cultivoAgricultorId = this.cultivoAgricultorId;
        if (this.updatedBy !== undefined) returnObj.updatedBy = this.updatedBy;

        return returnObj;
    }

    static async create(props: {
        [key: string]: any;
    }): Promise<[string?, UpdateVisitaCultivoAgricultorDto?]> {
        const { id, visitaId, cultivoAgricultorId, updatedBy } = props;

        if (!id || Number.isNaN(Number(id))) {
            return ['ID inválido o faltante'];
        }

        let visitaIdNumber = visitaId;
        let cultivoAgricultorIdNumber = cultivoAgricultorId;
        let updatedByNumber = updatedBy;

        if (visitaId !== undefined && typeof visitaId !== 'number') {
            visitaIdNumber = Number.parseInt(visitaId);
            if (Number.isNaN(visitaIdNumber))
                return ['visitaId debe ser un número válido'];
        }

        if (
            cultivoAgricultorId !== undefined &&
            typeof cultivoAgricultorId !== 'number'
        ) {
            cultivoAgricultorIdNumber = Number.parseInt(cultivoAgricultorId);
            if (Number.isNaN(cultivoAgricultorIdNumber))
                return ['cultivoAgricultorId debe ser un número válido'];
        }

        if (updatedBy !== undefined && typeof updatedBy !== 'number') {
            updatedByNumber = Number.parseInt(updatedBy);
            if (Number.isNaN(updatedByNumber))
                return ['updatedBy debe ser un número válido'];
        }

        return [
            undefined,
            new UpdateVisitaCultivoAgricultorDto(
                Number(id),
                visitaIdNumber,
                cultivoAgricultorIdNumber,
                updatedByNumber
            ),
        ];
    }
}
