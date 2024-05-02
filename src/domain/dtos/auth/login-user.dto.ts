import { Validators } from "../../../config/validators";


export class LoginUsuarioDto{
    constructor(
        public email:string,
        public password:string,
    ){}

    static create(object: {[key: string]: any}): [string?, LoginUsuarioDto?] {

        const { email, password} = object;
    
        if(!email) return ['Email faltante'];
        if(!Validators.email.test(email)) return ['El email no es válido'];
        if(!password) return ['Password faltante'];
        if(password.length < 6) return ['El password es muy corto'];
    
    
        return [
            undefined,
            new LoginUsuarioDto(email, password)
        ];
    }

}