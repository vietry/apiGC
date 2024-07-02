import { Validators } from "../../../config";


export class RegisterUsuarioDto{
    private constructor(
        public nombres: string,
        public apellidos: string,
        public email: string,
        public emailValidado: boolean = false,
        public password: string,
        public rol: string = 'user',
        //public rol: string,
        
    ){}

static create(object: {[key: string]: any}): [string?, RegisterUsuarioDto?] {

    const { nombres, apellidos, email, emailValidado, password, rol} = object;

    let rolUser = rol;

    if(!nombres) return ['Nombres faltante'];
    if(!apellidos) return ['Apellidos faltante'];
    if(!email) return ['Email faltante'];
    if(!Validators.email.test(email)) return ['El email no es válido'];
    if(!password) return ['Password faltante'];
    if(password.length < 6) return ['El password es muy corto'];


    return [
        undefined,
        new RegisterUsuarioDto(nombres, apellidos, email, emailValidado, password, rol)
    ];
}
    
}