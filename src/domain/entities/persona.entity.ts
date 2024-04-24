export class PersonaEntity {
    constructor(
        public idPersona: number,
        public dni: string,
        public nombres: string,
        public apellidos: string | null,
        public createdAt: Date,
        public updatedAt: Date 
    ) {}

    public static fromObject(object: { [key: string]: any }): PersonaEntity {
        const { idPersona, dni, nombres, apellidos, createdAt, updatedAt } = object;
        if (!idPersona) throw 'ID Persona is required';
        if (!dni) throw 'DNI is required';
        if (!nombres) throw 'Nombres is required';
        if (!createdAt) throw 'CreatedAt is required';
        if (!updatedAt) throw 'UpdatedAt is required';
    
        let newCreatedAt = createdAt ? new Date(createdAt) : new Date();
        let newUpdatedAt = updatedAt ? new Date(updatedAt) : new Date();
    
        if (isNaN(newCreatedAt.getTime())) {
            throw 'CreatedAt is not a valid date';
        }
        if (isNaN(newUpdatedAt.getTime())) {
            throw 'UpdatedAt is not a valid date';
        }
    
        return new PersonaEntity(
            idPersona,
            dni,
            nombres,
            apellidos,
            newCreatedAt,
            newUpdatedAt
        );
    }
}