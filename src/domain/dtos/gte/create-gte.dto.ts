
export class CreateGteDto{

    private constructor(
        public readonly activo: boolean | null,
        public readonly idSubZona: number,
        
    ){}

    static create(object: {[key: string]: any}): [string?, CreateGteDto?] {

        const { activo, idSubZona } = object;

        let idSubZonaNumber = idSubZona;
    
        if(!activo) return ['activo faltante'];
        if (!idSubZona) return ['idSubZona faltante'];
        if ( typeof idSubZona !== 'number' ) {
            idSubZonaNumber =  parseInt(idSubZona)
        }
    

        return [
            undefined,
            new CreateGteDto(activo, idSubZonaNumber,)
        ];
    }
    
}