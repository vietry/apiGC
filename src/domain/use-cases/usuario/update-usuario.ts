import { UpdateUsuarioDto } from "../../dtos";
import { UsuarioEntity } from "../../entities/usuario.entity";
import { UsuarioRepository } from "../../repositories/usuario.repository";


export interface UpdateUsuarioUseCase{
    execute(dto: UpdateUsuarioDto): Promise<UsuarioEntity>
}

export class UpdateUsuario implements UpdateUsuarioUseCase {
    constructor (
        private readonly repository : UsuarioRepository
        ) {}

        execute(dto: UpdateUsuarioDto): Promise<UsuarioEntity> {
            return this.repository.updateById(dto)
        }
}