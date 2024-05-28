
export class CreateGteDto{

    private constructor(
        public readonly activo: boolean | null,
        public readonly idSubZona: number,
        public readonly idColaborador: number,

        
    ){}

    static create(object: {[key: string]: any}): [string?, CreateGteDto?] {

        const { activo, idSubZona, idColaborador } = object;

        let idSubZonaNumber = idSubZona;
        let activoBoolean = activo;
        let idColaboradorNum = idColaborador;
    
        if(!activo) return ['Estado activo faltante'];
        if( typeof activo !== 'boolean') {
            activoBoolean = Boolean(activo);
        }

        if (!idSubZona) return ['idSubZona faltante'];
        if ( typeof idSubZona !== 'number' ) {
            idSubZonaNumber =  parseInt(idSubZona)
        }

        if (!idColaborador  ) return ['idColaborador faltante'];
        if ( typeof idSubZona !== 'number' ) {
            idColaboradorNum =  parseInt(idColaborador)
        }
    

        return [
            undefined,
            new CreateGteDto(activoBoolean, idSubZonaNumber, idColaboradorNum)
        ];
    }
    
}