import { Validators } from "../../../config";

export class CreateGteDto2{

    private constructor(
        public readonly activo: boolean | null,
        public readonly idSubZona: number,
        public readonly idColaborador: number, //ID
        public readonly idUsuario: number, //ID
        
    ){}

    static async create( props: { [key: string]: any } ): Promise<[string?, CreateGteDto2?]>{
        const { activo, idSubZona, idColaborador, idUsuario } = props;

        let idSubZonaNumber = idSubZona;

        if(!activo) return ['Missing activo'];
        if(!idSubZona) return ['Missing idSubZona'];

        if (!idSubZona) return ['idSubZona faltante'];
        if ( typeof idSubZona !== 'number' ) {
            idSubZonaNumber =  parseInt(idSubZona)
        }
        if(!idColaborador) return ['Missing colaborador'];
        if(!idUsuario) return ['Missing usuario'];

        const isUnique = await Validators.isColaboradorID(idColaborador);
        if (!isUnique) return ['Invalid idPunto'];


        return [
            undefined,
            new CreateGteDto2(!!activo, idSubZonaNumber, idColaborador, idUsuario)
        ]
    }
    
}