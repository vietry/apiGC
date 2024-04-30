import { UsuarioEntity } from "../../entities/usuario.entity";
import { UsuarioRepository } from "../../repositories/usuario.repository";


export interface GetUsuarioUseCase{
    execute(email: string): Promise<UsuarioEntity>
}

export class GetUsuario implements GetUsuarioUseCase {
    constructor (
        private readonly repository : UsuarioRepository
        ) {}

        execute(email: string): Promise<UsuarioEntity> {
            return this.repository.findByEmail(email)
        }
}