export class UpdateCharlaDto {
    private constructor(
        public readonly id: number,
        public readonly tema?: string | null,
        public readonly asistentes?: number | null,
        public readonly hectareas?: number | null,
        public readonly dosis?: number | null,
        public readonly efectivo?: boolean | null,
        public readonly comentarios?: string | null,
        public readonly demoplots?: number | null,
        public readonly estado?: string | null,
        public readonly programacion?: Date | null,
        public readonly ejecucion?: Date | null,
        public readonly cancelacion?: Date | null,
        public readonly motivo?: string | null,
        public readonly idVegetacion?: number,
        public readonly idBlanco?: number | null,
        public readonly idDistrito?: string | null,
        public readonly idFamilia?: number | null,
        public readonly idGte?: number,
        public readonly idTienda?: number,
        //public readonly createdAt?: Date | null,
        //public readonly createdBy?: number | null,
        //public readonly updatedAt?: Date | null,
        public readonly updatedBy?: number | null
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};

        if (this.tema !== undefined) returnObj.tema = this.tema;
        if (this.asistentes !== undefined) returnObj.asistentes = this.asistentes;
        if (this.hectareas !== undefined) returnObj.hectareas = this.hectareas;
        if (this.dosis !== undefined) returnObj.dosis = this.dosis;
        if (this.efectivo !== undefined) returnObj.efectivo = this.efectivo;
        if (this.comentarios !== undefined) returnObj.comentarios = this.comentarios;
        if (this.demoplots !== undefined) returnObj.demoplots = this.demoplots;
        if (this.estado !== undefined) returnObj.estado = this.estado;
        if (this.programacion !== undefined) returnObj.programacion = this.programacion;
        if (this.ejecucion !== undefined) returnObj.ejecucion = this.ejecucion;
        if (this.cancelacion !== undefined) returnObj.cancelacion = this.cancelacion;
        if (this.motivo !== undefined) returnObj.motivo = this.motivo;
        if (this.idVegetacion !== undefined) returnObj.idVegetacion = this.idVegetacion;
        if (this.idBlanco !== undefined) returnObj.idBlanco = this.idBlanco;
        if (this.idDistrito !== undefined) returnObj.idDistrito = this.idDistrito;
        if (this.idFamilia !== undefined) returnObj.idFamilia = this.idFamilia;
        if (this.idGte !== undefined) returnObj.idGte = this.idGte;
        if (this.idTienda !== undefined) returnObj.idTienda = this.idTienda;
        if (this.updatedBy !== undefined) returnObj.updatedBy = this.updatedBy;

        return returnObj;
    }

    static async create(props: { [key: string]: any }): Promise<[string?, UpdateCharlaDto?]> {
        const {
            id, tema, asistentes, hectareas = null, dosis = null, efectivo, comentarios, demoplots, estado,
            programacion, ejecucion, cancelacion, motivo, idVegetacion, idBlanco, idDistrito,
            idFamilia, idGte, idTienda, 
                        //createdAt, 
                        //createdBy, 
                        //updatedAt, 
                        updatedBy
        } = props;

        if (!id || isNaN(Number(id))) {
            return ['Invalid or missing ID'];
        }

        let hectareasNumber = hectareas;
        let dosisNumber = dosis;

        if (hectareas !== undefined && typeof hectareas !== 'number') {
            hectareasNumber = parseFloat(hectareas);
            
        }

        if (dosis !== undefined && typeof dosis !== 'number') {
            dosisNumber = parseFloat(dosis);
            
        }

        return [
            undefined,
            new UpdateCharlaDto(
                id, tema, asistentes, hectareasNumber, dosisNumber, efectivo, comentarios, demoplots,
                estado, programacion, ejecucion, cancelacion, motivo, idVegetacion, idBlanco,
                idDistrito, idFamilia, idGte, idTienda,             //createdAt, 
                //createdBy, 
                //updatedAt, 
                updatedBy
            )
        ];
    }
}
