export class CreateUsuarioDto {

    private constructor(
        public readonly id: number,
        public readonly nombres: string,
        public readonly apellidos: string | null,
        public readonly password: string,
        public readonly celular: string | null,
        public readonly email: string,
        public readonly emailValidado: boolean,
        public readonly rol: string,
        public readonly idFoto: number | null,
        public readonly createdAt: Date | null,
        public readonly updatedAt: Date | null
    ){}

    static create( props: {[key:string]: any}): [string?, CreateUsuarioDto?]{

        const {id, nombres, apellidos, password, celular, email, emailValidado, rol, idFoto, createdAt, updatedAt} = props;

        if(!id) return ['ID property is required', undefined];
        if(!nombres||nombres.length === 0) return ['Nombres property is required', undefined];
        if(!password||password.length === 0) return ['Password property is required', undefined];
        if(!email||email.length === 0) return ['Correo property is required', undefined];
        if(!rol) return ['Rol property is required', undefined];

        return [undefined, new CreateUsuarioDto(id, nombres, apellidos, password, celular, email, emailValidado, rol, idFoto, createdAt, updatedAt)];
    }
}