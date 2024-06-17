import { Validators } from "../../../config";



export class CreateContactoPuntoDto{

    private constructor(
        public readonly nombre: string,
        public readonly apellido: string,
        public readonly cargo: string,
        public readonly email: string | null,
        public readonly celularA: string | null,
        public readonly celularB: string | null,
        public readonly idPunto: number, //ID
    ){}

    static async create(object: { [key: string]: any }): Promise<[string?, CreateContactoPuntoDto?]> {
        const { nombre, apellido, cargo, correo, celularA, celularB, idPunto } = object;

        let idPuntoNumber = idPunto;

        if (!nombre) return ['Nombre faltante'];
        if (!apellido) return ['Apellido faltante'];
        if (!cargo) return ['Cargo faltante'];
        if (!idPunto) return ['idPunto faltante'];

        if (typeof idPunto !== 'number') {
            idPuntoNumber = parseInt(idPunto);
            if (isNaN(idPuntoNumber)) return ['idPunto debe ser un número válido'];
        }

        const isUnique = await Validators.isPuntoID(idPuntoNumber);
        if (!isUnique) return ['Invalid idPunto'];


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