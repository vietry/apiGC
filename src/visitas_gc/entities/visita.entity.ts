import { CustomError } from '../../domain';

export class VisitaEntity {
    constructor(
        public id: number,
        public programacion: Date | null,
        public duracionP: number | null,
        public objetivo: string | null,
        public semana: number | null,
        public estado: string | null,
        public numReprog: number | null,
        public inicio: Date | null,
        public finalizacion: Date | null,
        public duracionV: number | null,
        public resultado: string | null,
        public aFuturo: string | null,
        public detalle: string | null,
        public latitud: number | null,
        public longitud: number | null,
        public idColaborador: number,
        public idContacto: number | null,
        public idCultivo: number | null,
        public idRepresentada: number | null,
        public empGrupo: string | null,
        public programada: boolean | null //public createdAt: Date | null, //public updatedAt: Date | null
    ) {}

    public static fromObject(object: { [key: string]: any }): VisitaEntity {
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
            //createdAt,
            //updatedAt,
        } = object;

        if (idColaborador === undefined || idColaborador === null)
            throw CustomError.badRequest('idColaborador is required');

        return new VisitaEntity(
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
            programada
            //createdAt,
            //updatedAt
        );
    }
}
