
export class CreateGteDto{

    private constructor(
        public readonly activo: boolean | null,
        public readonly idSubZona: number,
        public readonly colaborador: string, //ID
        public readonly usuario: string, //ID
        
    ){}

    static create( props: { [key: string]: any } ): [string?, CreateGteDto?]{
        const { activo, idSubZona, colaborador, usuario } = props;

        let idSubZonaNumber = idSubZona;

        if(!activo) return ['Missing activo'];
        if(!idSubZona) return ['Missing idSubZona'];

        if (!idSubZona) return ['idSubZona faltante'];
        if ( typeof idSubZona !== 'number' ) {
            idSubZonaNumber =  parseInt(idSubZona)
        }
        if(!colaborador) return ['Missing colaborador'];
        if(!usuario) return ['Missing usuario'];

        return [
            undefined,
            new CreateGteDto(!!activo, idSubZonaNumber, colaborador, usuario)
        ]
    }
    
}