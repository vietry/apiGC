import { Validators } from "../../../config/validators";


export class LoginUserDto{
    constructor(
        public email:string,
        public password:string,
    ){}

    static login(object: {[key: string]: any}): [string?, LoginUserDto?] {

        const { email, password} = object;
    
        if(!email) return ['Email faltante'];
        if(!Validators.email.test(email)) return ['El email no es válido'];
        if(!password) return ['Password faltante'];
        if(password.length < 6) return ['El password es muy corto'];
    
    
        return [
            undefined,
            new LoginUserDto(email, password)
        ];
    }

}