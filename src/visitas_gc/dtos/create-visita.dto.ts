export class CreateVisitaDto {
    private constructor(
        public readonly programacion: Date | null,
        public readonly duracionP: number | null,
        public readonly objetivo: string | null,
        public readonly semana: number | null,
        public readonly estado: string | null,
        public readonly numReprog: number | null,
        public readonly inicio: Date | null,
        public readonly finalizacion: Date | null,
        public readonly duracionV: number | null,
        public readonly resultado: string | null,
        public readonly aFuturo: string | null,
        public readonly detalle: string | null,
        public readonly latitud: number | null,
        public readonly longitud: number | null,
        public readonly idColaborador: number,
        public readonly idContacto: number | null,
        public readonly idCultivo: number | null,
        public readonly idRepresentada: number | null,
        public readonly motivo: string | null,
        public readonly empresa: string | null,
        public readonly programada: boolean | null,
        public readonly negocio: string | null,
        public readonly macrozonaId: number | null
    ) {}

    static async create(object: {
        [key: string]: any;
    }): Promise<[string?, CreateVisitaDto?]> {
        const {
            programacion,
            duracionP,
            objetivo,
            semana,
            estado,
            numReprog,
            inicio,
            finalizacion,
            duracionV,
            resultado,
            aFuturo,
            detalle,
            latitud,
            longitud,
            idColaborador,
            idContacto,
            idCultivo,
            idRepresentada,
            motivo,
            empresa,
            programada,
            negocio,
            macrozonaId,
        } = object;

        if (!idColaborador || isNaN(Number(idColaborador))) {
            return ['idColaborador is required and must be a valid number'];
        }

        const parseNumber = (value: any): number | null => {
            if (value === null || value === undefined) return null;
            const num = Number(value);
            return isNaN(num) ? null : num;
        };

        return [
            undefined,
            new CreateVisitaDto(
                programacion ? new Date(programacion) : null,
                Number(duracionP),
                objetivo ?? null,
                parseNumber(semana),
                estado ?? null,
                parseNumber(numReprog),
                inicio ? new Date(inicio) : null,
                finalizacion ? new Date(finalizacion) : null,
                parseFloat(duracionV),
                resultado ?? null,
                aFuturo ?? null,
                detalle ?? null,
                parseFloat(latitud),
                parseFloat(longitud),
                Number(idColaborador),
                idContacto !== undefined ? Number(idContacto) : null,
                idCultivo !== undefined ? Number(idCultivo) : null,
                idRepresentada !== undefined ? Number(idRepresentada) : null,
                motivo ?? null,
                empresa ?? null,
                programada !== undefined ? Boolean(programada) : null,
                negocio ?? null,
                macrozonaId !== undefined ? Number(macrozonaId) : null
            ),
        ];
    }
}
