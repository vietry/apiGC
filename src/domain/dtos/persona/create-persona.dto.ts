

export class CreatePersonaDto {

    private constructor(
        public readonly text: string,
    ){}

    static create( props: {[key:string]: any}): [string?, CreatePersonaDto?]{

        const {text} = props;

        if(!text) return ['Text property is required', undefined];
    
        return [undefined, new CreatePersonaDto(text)];
    }
}