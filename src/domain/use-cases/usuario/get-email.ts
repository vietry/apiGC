import { UsuarioEntity } from "../../entities/usuario.entity";
import { UsuarioRepository } from "../../repositories/usuario.repository";


export interface GetEmailUseCase{
    execute(email: string): Promise<UsuarioEntity>
}

export class GetEmail implements GetEmailUseCase {
    constructor (
        private readonly repository : UsuarioRepository
        ) {}

        execute(email: string): Promise<UsuarioEntity> {
            return this.repository.findByEmail(email)
        }
}