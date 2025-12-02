export class CreateCultivoAgricultorDto {
    private constructor(
        public readonly contactoId: number,
        public readonly vegetacionId: number,
        public readonly createdBy: number,
        public readonly nomAsesor?: string,
        public readonly numAsesor?: string,
        public readonly cargoAsesor?: string
    ) {}

    static async create(props: {
        [key: string]: any;
    }): Promise<[string?, CreateCultivoAgricultorDto?]> {
        const {
            contactoId,
            vegetacionId,
            createdBy,
            nomAsesor,
            numAsesor,
            cargoAsesor,
        } = props;

        if (!contactoId || Number.isNaN(Number(contactoId))) {
            return ['contactoId es requerido y debe ser un número válido'];
        }

        if (!vegetacionId || Number.isNaN(Number(vegetacionId))) {
            return ['vegetacionId es requerido y debe ser un número válido'];
        }

        if (!createdBy || Number.isNaN(Number(createdBy))) {
            return ['createdBy es requerido y debe ser un número válido'];
        }

        // Validación opcional de nomAsesor
        if (nomAsesor !== undefined && typeof nomAsesor !== 'string') {
            return ['nomAsesor debe ser una cadena de texto'];
        }

        if (nomAsesor && nomAsesor.length > 100) {
            return ['nomAsesor no puede exceder los 100 caracteres'];
        }

        // Validación opcional de numAsesor
        if (numAsesor !== undefined && typeof numAsesor !== 'string') {
            return ['numAsesor debe ser una cadena de texto'];
        }

        if (numAsesor && numAsesor.length > 20) {
            return ['numAsesor no puede exceder los 20 caracteres'];
        }

        // Validación opcional de cargoAsesor
        if (cargoAsesor !== undefined && typeof cargoAsesor !== 'string') {
            return ['cargoAsesor debe ser una cadena de texto'];
        }

        if (cargoAsesor && cargoAsesor.length > 50) {
            return ['cargoAsesor no puede exceder los 50 caracteres'];
        }

        return [
            undefined,
            new CreateCultivoAgricultorDto(
                Number(contactoId),
                Number(vegetacionId),
                Number(createdBy),
                nomAsesor,
                numAsesor,
                cargoAsesor
            ),
        ];
    }
}
