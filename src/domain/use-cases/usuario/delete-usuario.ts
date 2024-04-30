import { UsuarioEntity } from "../../entities/usuario.entity";
import { UsuarioRepository } from "../../repositories/usuario.repository";


export interface DeleteUsuarioUseCase{
    execute(id: number): Promise<UsuarioEntity>
}

export class DeleteUsuario implements DeleteUsuarioUseCase {
    constructor (
        private readonly repository : UsuarioRepository
        ) {}

        execute(id: number): Promise<UsuarioEntity> {
            return this.repository.deleteById(id);
        }
}