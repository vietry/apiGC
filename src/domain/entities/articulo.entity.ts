import { CustomError } from "../errors/custom.error";

export class ArticuloEntity {
    constructor(
        public id: number,
        public codigo: string,
        public nombre: string,
        public present: number | null,
        public codFamilia: string | null,
        public codClase: string | null,
        public codLinea: string | null,
        public codDivision: string | null,
        public idFamilia: number | null,
        public idClase: number | null,
        public idLinea: number | null,
        public idDivision: number | null,
        public idEmpresa: number,
        public createdAt: Date | null,
        public updatedAt: Date | null,
        public activo: boolean | null
    ) {}

    public static fromObject(object: { [key: string]: any }): ArticuloEntity {
        const {
            id, codigo, nombre, present, codFamilia, codClase, codLinea, codDivision,
            idFamilia, idClase, idLinea, idDivision, idEmpresa, createdAt, updatedAt, activo
        } = object;

        if (!id) throw CustomError.badRequest('ID is required');
        if (!codigo) throw CustomError.badRequest('Codigo is required');
        if (!nombre) throw CustomError.badRequest('Nombre is required');
        if (!idEmpresa) throw CustomError.badRequest('ID Empresa is required');

        return new ArticuloEntity(
            id, codigo, nombre, present, codFamilia, codClase, codLinea, codDivision,
            idFamilia, idClase, idLinea, idDivision, idEmpresa, createdAt, updatedAt, activo
        );
    }
}