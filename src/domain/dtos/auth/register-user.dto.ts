import { Validators } from "../../../config";


export class RegisterUsuarioDto{
    private constructor(
        public nombres: string,
        public apellidos: string,
        public email: string,
        public readonly emailValidado: boolean = false,
        public readonly celular: string | null,
        public password: string,
        public rol: string = 'user',
        //public rol: string,
        
    ){}

static create(object: {[key: string]: any}): [string?, RegisterUsuarioDto?] {

    const { nombres, apellidos, email, emailValidado, celular, password, rol} = object;

    let rolUser = rol;
    let emailValidadoBoolean = emailValidado;
    let celularString: string | null = celular;

    if(!nombres) return ['Nombres faltante'];
    if(!apellidos) return ['Apellidos faltante'];
    if(!email) return ['Email faltante'];
    if(!Validators.email.test(email)) return ['El email no es válido'];
    if(!password) return ['Password faltante'];
    if(password.length < 6) return ['El password es muy corto'];


    /*if(!emailValidado) return ['EmailValidado activo faltante'];
        if( typeof emailValidado !== 'boolean') {
            emailValidadoBoolean = Boolean(emailValidado);
        }*/

        if (typeof celular !== 'string') {
            if (typeof celular === 'number') {
                celularString = String(celular);
            } else if (celular === null || celular === undefined) {
                celularString = null;
            } else {
                celularString = String(celular); // Convertir cualquier otro tipo a string
            }
        }

            // Asegura que el tipo de dato final sea correcto
            if (celularString !== null && typeof celularString !== 'string') {
                celularString = String(celularString);
            }

    return [
        undefined,
        new RegisterUsuarioDto(nombres, apellidos, email, emailValidadoBoolean, celularString, password, rol)
    ];
}
    
}