export class UpdateCultivoAgricultorDto {
    private constructor(
        public readonly id: number,
        public readonly contactoId?: number,
        public readonly vegetacionId?: number,
        public readonly updatedBy?: number,
        public readonly nomAsesor?: string,
        public readonly numAsesor?: string
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};

        if (this.contactoId !== undefined)
            returnObj.contactoId = this.contactoId;
        if (this.vegetacionId !== undefined)
            returnObj.vegetacionId = this.vegetacionId;
        if (this.updatedBy !== undefined) returnObj.updatedBy = this.updatedBy;
        if (this.nomAsesor !== undefined) returnObj.nomAsesor = this.nomAsesor;
        if (this.numAsesor !== undefined) returnObj.numAsesor = this.numAsesor;

        return returnObj;
    }

    static async create(props: {
        [key: string]: any;
    }): Promise<[string?, UpdateCultivoAgricultorDto?]> {
        const {
            id,
            contactoId,
            vegetacionId,
            updatedBy,
            nomAsesor,
            numAsesor,
        } = props;

        if (!id || Number.isNaN(Number(id))) {
            return ['ID inválido o faltante'];
        }

        let contactoIdNumber = contactoId;
        let vegetacionIdNumber = vegetacionId;
        let updatedByNumber = updatedBy;

        if (contactoId !== undefined && typeof contactoId !== 'number') {
            contactoIdNumber = Number.parseInt(contactoId);
            if (Number.isNaN(contactoIdNumber))
                return ['contactoId debe ser un número válido'];
        }

        if (vegetacionId !== undefined && typeof vegetacionId !== 'number') {
            vegetacionIdNumber = Number.parseInt(vegetacionId);
            if (Number.isNaN(vegetacionIdNumber))
                return ['vegetacionId debe ser un número válido'];
        }

        if (updatedBy !== undefined && typeof updatedBy !== 'number') {
            updatedByNumber = Number.parseInt(updatedBy);
            if (Number.isNaN(updatedByNumber))
                return ['updatedBy debe ser un número válido'];
        }

        // Validación de nomAsesor
        if (nomAsesor !== undefined && typeof nomAsesor !== 'string') {
            return ['nomAsesor debe ser una cadena de texto'];
        }

        if (nomAsesor && nomAsesor.length > 100) {
            return ['nomAsesor no puede exceder los 100 caracteres'];
        }

        // Validación de numAsesor
        if (numAsesor !== undefined && typeof numAsesor !== 'string') {
            return ['numAsesor debe ser una cadena de texto'];
        }

        if (numAsesor && numAsesor.length > 20) {
            return ['numAsesor no puede exceder los 20 caracteres'];
        }

        return [
            undefined,
            new UpdateCultivoAgricultorDto(
                Number(id),
                contactoIdNumber,
                vegetacionIdNumber,
                updatedByNumber,
                nomAsesor,
                numAsesor
            ),
        ];
    }
}
