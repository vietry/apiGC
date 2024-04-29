export class UsuarioEntity {

    constructor(
        public id: number,
        public nombres: string,
        public apellidos: string | null,
        public password: string,
        public celular: string | null,
        public correo: string,
        public rol: string,
        public idFoto: number | null,
        public createdAt: Date | null,
        public updatedAt: Date | null
    ){}

    public static fromObject(object: {[key: string]: any}): UsuarioEntity {
        const {id, nombres, apellidos, password, celular, correo, rol, idFoto, createdAt, updatedAt} = object; 
        if (!id) throw 'ID is required';
        if (!nombres) throw 'Nombres is required';
        if (!password) throw 'Password is required';
        if (!correo) throw 'Correo is required';
        if (!rol) throw 'Rol is required';

        return new UsuarioEntity(
            id, nombres, apellidos, password, celular, correo, rol, idFoto, createdAt, updatedAt
        )
    }
}