export class UpdateVisitaDto {
    private constructor(
        public readonly id: number,
        public readonly programacion?: Date | null,
        public readonly duracionP?: number | null,
        public readonly objetivo?: string | null,
        public readonly semana?: number | null,
        public readonly estado?: string | null,
        public readonly numReprog?: number | null,
        public readonly inicio?: Date | null,
        public readonly finalizacion?: Date | null,
        public readonly duracionV?: number | null,
        public readonly resultado?: string | null,
        public readonly aFuturo?: string | null,
        public readonly detalle?: string | null,
        public readonly latitud?: number | null,
        public readonly longitud?: number | null,
        public readonly idColaborador?: number,
        public readonly idContacto?: number | null,
        public readonly idCultivo?: number | null,
        public readonly idRepresentada?: number | null,
        public readonly empGrupo?: string | null,
        public readonly programada?: boolean | null //public readonly updatedBy?: number | null
    ) {}

    get values(): { [key: string]: any } {
        const returnObj: { [key: string]: any } = {};
        if (this.programacion !== undefined)
            returnObj.programacion = this.programacion;
        if (this.duracionP !== undefined) returnObj.duracionP = this.duracionP;
        if (this.objetivo !== undefined) returnObj.objetivo = this.objetivo;
        if (this.semana !== undefined) returnObj.semana = this.semana;
        if (this.estado !== undefined) returnObj.estado = this.estado;
        if (this.numReprog !== undefined) returnObj.numReprog = this.numReprog;
        if (this.inicio !== undefined) returnObj.inicio = this.inicio;
        if (this.finalizacion !== undefined)
            returnObj.finalizacion = this.finalizacion;
        if (this.duracionV !== undefined) returnObj.duracionV = this.duracionV;
        if (this.resultado !== undefined) returnObj.resultado = this.resultado;
        if (this.aFuturo !== undefined) returnObj.aFuturo = this.aFuturo;
        if (this.detalle !== undefined) returnObj.detalle = this.detalle;
        if (this.latitud !== undefined) returnObj.latitud = this.latitud;
        if (this.longitud !== undefined) returnObj.longitud = this.longitud;
        if (this.idColaborador !== undefined)
            returnObj.idColaborador = this.idColaborador;
        if (this.idContacto !== undefined)
            returnObj.idContacto = this.idContacto;
        if (this.idCultivo !== undefined) returnObj.idCultivo = this.idCultivo;
        if (this.idRepresentada !== undefined)
            returnObj.idRepresentada = this.idRepresentada;
        if (this.empGrupo !== undefined) returnObj.empGrupo = this.empGrupo;
        if (this.programada !== undefined)
            returnObj.programada = this.programada;
        //if (this.updatedBy !== undefined) returnObj.updatedBy = this.updatedBy;
        return returnObj;
    }

    static async create(object: {
        [key: string]: any;
    }): Promise<[string?, UpdateVisitaDto?]> {
        const {
            id,
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
            empGrupo,
            programada,
            //updatedBy,
        } = object;

        if (!id || isNaN(Number(id))) {
            return ['id is required and must be a valid number'];
        }

        const parseNumber = (value: any): number | undefined => {
            if (value === null || value === undefined) return undefined;
            const num = Number(value);
            return isNaN(num) ? undefined : num;
        };

        // Si idCultivo o idRepresentada son 0, asignar undefined
        const parseFk = (value: any): number | undefined => {
            const num = Number(value);
            return !num ? undefined : num;
        };

        return [
            undefined,
            new UpdateVisitaDto(
                Number(id),
                programacion ? new Date(programacion) : undefined,
                parseNumber(duracionP),
                objetivo ?? undefined,
                parseNumber(semana),
                estado ?? undefined,
                parseNumber(numReprog),
                inicio ? new Date(inicio) : undefined,
                finalizacion ? new Date(finalizacion) : undefined,
                parseNumber(duracionV),
                resultado ?? undefined,
                aFuturo ?? undefined,
                detalle ?? undefined,
                latitud !== undefined ? parseFloat(latitud) : undefined,
                longitud !== undefined ? parseFloat(longitud) : undefined,
                idColaborador !== undefined ? Number(idColaborador) : undefined,
                idContacto !== undefined ? Number(idContacto) : undefined,
                parseFk(idCultivo),
                parseFk(idRepresentada),
                empGrupo ?? undefined,
                programada !== undefined ? Boolean(programada) : undefined
                //updatedBy !== undefined ? Number(updatedBy) : undefined
            ),
        ];
    }
}
