


export class CreateContactoPuntoDto{

    private constructor(
        public readonly nombre: string,
        public readonly apellido: string,
        public readonly cargo: string,
        public readonly email: string | null,
        public readonly celularA: string | null,
        public readonly celularB: string | null,
        public readonly punto: number, //ID
    ){}

    static create(object: { [key: string]: any }): [string?, CreateContactoPuntoDto?] {
        const { nombre, apellido, cargo, correo, celularA, celularB, idPunto } = object;

        if (!nombre) return ['Nombre faltante'];
        if (!apellido) return ['Apellido faltante'];
        if (!cargo) return ['Cargo faltante'];
        if (!idPunto) return ['idPunto faltante'];

        let idPuntoNumber = idPunto;

        if (typeof idPunto !== 'number') {
            idPuntoNumber = parseInt(idPunto);
            if (isNaN(idPuntoNumber)) return ['idPunto debe ser un número válido'];
        }

        return [
            undefined,
            new CreateContactoPuntoDto(
                nombre, 
                apellido, 
                cargo, 
                correo, 
                celularA, 
                celularB, 
                idPuntoNumber
            )
        ];
    }
}