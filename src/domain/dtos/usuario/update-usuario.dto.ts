import { Validators } from "../../../config";

export class UpdateUsuarioDto {

    private constructor(
        public readonly id: number,
        public readonly nombres?: string,
        public readonly apellidos?: string | null,
        public readonly password?: string,
        public readonly celular?: string | null,
        public readonly email?: string,
        public readonly rol?: string,
        public readonly idFoto?: number | null,
        public readonly createdAt?: Date | null,
        public readonly updatedAt?: Date | null
    ){}

    get values(){
        const returnObj: {[key: string]:any} = {};

        if (this.nombres) returnObj.nombres = this.nombres;
        if (this.apellidos) returnObj.apellidos = this.apellidos;
        if (this.password) returnObj.password = this.password;
        if (this.celular) returnObj.celular = this.celular;
        if (this.email) returnObj.email = this.email;
        if (this.rol) returnObj.rol = this.rol;
        if (this.idFoto) returnObj.idFoto = this.idFoto;
        if (this.createdAt) returnObj.createdAt = this.createdAt;
        if (this.updatedAt) returnObj.updatedAt = this.updatedAt;

        return returnObj;
    }

    static create( props: {[key:string]: any}): [string?, UpdateUsuarioDto?]{

        const {id, nombres, apellidos, password, celular, email, rol, idFoto, createdAt, updatedAt} = props;

        if (!id || isNaN(Number(id))){
            return ['Invalid or missing ID'];
        }

        if (email !== undefined) {
            if (!Validators.email.test(email)) return ['El email no es válido'];
        }

        if (password !== undefined) {
            if (password.length < 6) return ['El password es muy corto'];
        }

        return [undefined, new UpdateUsuarioDto(id, nombres, apellidos, password, celular, email, rol, idFoto, createdAt, updatedAt)];
    }
}
