import { UsuarioEntity } from "../../entities/usuario.entity";
import { UsuarioRepository } from "../../repositories/usuario.repository";


export interface GetUsuarioUseCase{
    execute(id: number): Promise<UsuarioEntity>
}

export class GetUsuario implements GetUsuarioUseCase {
    constructor (
        private readonly repository : UsuarioRepository
        ) {}

        execute(id: number): Promise<UsuarioEntity> {
            return this.repository.findById(id)
        }
}