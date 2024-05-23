


export class CreateColaboradorDTO{

    private constructor(
        public readonly cargo: string,
        //public apellidos: string,
        //public email: string,
        //public emailValidado: boolean = false,
       // public password: string,
        //public rol: string = 'USUARIO',
        
    ){}

    static create(object: {[key: string]: any}): [string?, CreateColaboradorDTO?] {

        const { cargo } = object;
    
        if(!cargo) return ['Cargo faltante'];

        return [
            undefined,
            new CreateColaboradorDTO(cargo)
        ];
    }
    
}