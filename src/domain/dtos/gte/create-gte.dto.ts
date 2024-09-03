import { Validators } from "../../../config";

export class CreateGteDto{

    private constructor(
        public readonly activo: boolean | null,
        public readonly tipo: string | null,
        public readonly idSubZona: number,
        public readonly idColaborador: number,
        //ublic readonly idUsuario: number,

        
    ){}

    static create(object: {[key: string]: any}): [string?, CreateGteDto?] {

        const { activo, tipo, idSubZona, idColaborador, /*idUsuario*/ } = object;

        let idSubZonaNumber = idSubZona;
        let activoBoolean = activo;
        let idColaboradorNum = idColaborador;
        //let idUsuarioNumber = idUsuario;
    
        if(!activo) return ['Estado activo faltante'];
        if( typeof activo !== 'boolean') {
            activoBoolean = Boolean(activo);
        }

        if (!idSubZona) return ['idSubZona faltante'];
        if ( typeof idSubZona !== 'number' ) {
            idSubZonaNumber =  parseInt(idSubZona)
        }
        /*if (!idUsuario) return ['idUsuario faltante'];
        if ( typeof idUsuario !== 'number' ) {
            idUsuarioNumber =  parseInt(idUsuario)
        }*/

        if (!idColaborador  ) return ['idColaborador faltante'];
        if ( typeof idSubZona !== 'number' ) {
            idColaboradorNum =  parseInt(idColaborador)
        }
    

        return [
            undefined,
            new CreateGteDto(activoBoolean, tipo, idSubZonaNumber, idColaboradorNum, 
                //idUsuarioNumber,
            )
        ];
    }
    
}