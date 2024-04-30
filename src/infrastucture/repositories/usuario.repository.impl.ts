import { CreateUsuarioDto, UsuarioDatasource, UsuarioEntity, UsuarioRepository, UpdateUsuarioDto } from "../../domain";

export class UsuarioRepositoryImpl implements UsuarioRepository{

    constructor(
        private readonly datasource: UsuarioDatasource,
    ){}

    create(createUsuarioDto: CreateUsuarioDto): Promise<UsuarioEntity> {
        return this.datasource.create(createUsuarioDto);
    }
    getAll(): Promise<UsuarioEntity[]> {
        return this.datasource.getAll();
    }
    findById(id: number): Promise<UsuarioEntity> {
        return this.datasource.findById(id);
    }
    findByEmail(email: string): Promise<UsuarioEntity> {
        return this.datasource.findByEmail(email);
    }
    updateById(updateUsuarioDto: UpdateUsuarioDto): Promise<UsuarioEntity> {
        return this.datasource.updateById(updateUsuarioDto);
    }
    deleteById(id: number): Promise<UsuarioEntity> {
        return this.datasource.deleteById(id);
    }

}