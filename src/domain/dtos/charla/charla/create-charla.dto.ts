export class CreateCharlaDto {
    private constructor(
        public readonly tema: string | null,
        public readonly asistentes: number | null,
        public readonly hectareas: number | null,
        public readonly dosis: number | null,
        public readonly efectivo: boolean | null,
        public readonly comentarios: string | null,
        public readonly demoplots: number | null,
        public readonly estado: string | null,
        public readonly programacion: Date | null,
        public readonly ejecucion: Date | null,
        public readonly cancelacion: Date | null,
        public readonly motivo: string | null,
        //planificacion
        public readonly visita: Date | null,
        public readonly planificacion: Date | null,
        public readonly duracionVisita: number | null,
        public readonly duracionCharla: number | null,
        public readonly objetivo: string | null,
        //charla
        public readonly idVegetacion: number | null,
        public readonly idBlanco: number | null,
        public readonly idDistrito: string | null,
        public readonly idFamilia: number | null,
        public readonly idGte: number,
        public readonly idTienda: number,
        public readonly idPropietario: number | null,
        public readonly idMostrador: number | null,
        //public readonly createdAt: Date | null,
        public readonly createdBy: number | null,
        //public readonly updatedAt: Date | null,
        public readonly updatedBy: number | null
    ) {}

    static async create(object: {
        [key: string]: any;
    }): Promise<[string?, CreateCharlaDto?]> {
        const {
            tema,
            asistentes,
            hectareas,
            dosis,
            efectivo,
            comentarios,
            demoplots,
            estado,
            programacion,
            ejecucion,
            cancelacion,
            motivo,
            visita,
            planificacion,
            duracionVisita,
            duracionCharla,
            objetivo,
            idVegetacion,
            idBlanco,
            idDistrito,
            idFamilia,
            idGte,
            idTienda,
            idPropietario,
            idMostrador,
            //createdAt,
            createdBy,
            //updatedAt,
            updatedBy,
        } = object;

        if (!idGte) return ['idGte faltante'];
        if (!idTienda) return ['idTienda faltante'];

        let hectareasNumber = hectareas;
        let dosisNumber = dosis;

        if (hectareas && typeof hectareas !== 'number') {
            hectareasNumber = parseFloat(hectareas);
            if (isNaN(hectareasNumber))
                return ['hectareas debe ser un número válido'];
        }

        if (dosis && typeof dosis !== 'number') {
            dosisNumber = parseFloat(dosis);
            if (isNaN(dosisNumber)) return ['dosis debe ser un número válido'];
        }

        return [
            undefined,
            new CreateCharlaDto(
                tema,
                asistentes,
                hectareasNumber,
                dosisNumber,
                efectivo,
                comentarios,
                demoplots,
                estado,
                programacion,
                ejecucion,
                cancelacion,
                motivo,
                visita,
                planificacion,
                duracionVisita,
                duracionCharla,
                objetivo,
                idVegetacion,
                idBlanco,
                idDistrito,
                idFamilia,
                idGte,
                idTienda,
                idPropietario,
                idMostrador,
                //createdAt,
                createdBy,
                //updatedAt,
                updatedBy
            ),
        ];
    }
}
