


export class CreateColaboradorDTO{

    private constructor(
        public readonly cargo: string,
        public readonly idArea: number,
        public readonly idZonaAnt: number,

        //public readonly idUsuario: number
        
    ){}

    static create(object: {[key: string]: any}): [string?, CreateColaboradorDTO?] {

        const { cargo, idArea, idZonaAnt/*, idUsuario */} = object;

        let idAreaNumber = idArea;
        let idZonaAntNumber = idZonaAnt;
    
        if(!cargo) return ['Cargo faltante'];
        if (!idArea) return ['idArea faltante'];
        if (!idZonaAnt) return ['idZonaAnt faltante'];
        if ( typeof idArea !== 'number' ) {
            idAreaNumber =  parseInt(idArea)
          }
        if ( typeof idZonaAnt !== 'number' ) {
            idZonaAntNumber =  parseInt(idZonaAnt)
        }
      

        //if (!idUsuario === undefined || idUsuario === null) return ['idUsuario faltante'];

        return [
            undefined,
            new CreateColaboradorDTO(cargo, idAreaNumber, idZonaAntNumber,/*, idUsuario*/)
        ];
    }
    
}