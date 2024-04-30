import { CustomError } from "../errors/custom.error";

export class UsuarioEntity {

    constructor(
        public id: number,
        public nombres: string,
        public apellidos: string | null,
        public password: string,
        public celular: string | null,
        public email: string,
        public rol: string,
        public idFoto: number | null,
        public createdAt: Date | null,
        public updatedAt: Date | null
        
    ){}

    public static fromObject(object: {[key: string]: any}): UsuarioEntity {
        const {id, nombres, apellidos, password, celular, email, rol, idFoto, createdAt, updatedAt} = object; 
        if (!id) throw CustomError.badRequest('ID is required');
        if (!nombres) throw CustomError.badRequest('Nombres is required');
        if (!apellidos) throw CustomError.badRequest('Nombres is required');
        if (!password) throw CustomError.badRequest('Password is required');
        if (!email) throw CustomError.badRequest('Correo is required');
        if (!rol) throw CustomError.badRequest('Rol is required');

        return new UsuarioEntity(
            id, nombres, apellidos, password, celular, email, rol, idFoto, createdAt, updatedAt
        )
    }
}