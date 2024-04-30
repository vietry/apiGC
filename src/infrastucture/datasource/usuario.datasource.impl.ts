import { prisma } from "../../data/sqlserver";
import { CreateUsuarioDto, CustomError, UsuarioDatasource, UsuarioEntity, UpdateUsuarioDto } from "../../domain";


export class UsuarioDatasourceImpl implements UsuarioDatasource{
    async create(createUsuarioDto: CreateUsuarioDto): Promise<UsuarioEntity> {
        const usuario = await prisma.usuario.create({
           data: createUsuarioDto!
        });

        return UsuarioEntity.fromObject(usuario);
        
    }

    async getAll(): Promise<UsuarioEntity[]> {
        const usuarios = await prisma.usuario.findMany();

        return usuarios.map(usuario => UsuarioEntity.fromObject(usuario));
    }

    async findById(id: number): Promise<UsuarioEntity> {
        const usuario = await prisma.usuario.findFirst({
            where: { id}
        });

        if (!usuario) throw new CustomError(404, `Usuario with id ${id} not found`);
        return UsuarioEntity.fromObject(usuario);
    }

    async findByEmail(email: string): Promise<UsuarioEntity> {
        
        const usuario = await prisma.usuario.findFirst({
            where: { email: email }
        });

        if (!usuario) throw new CustomError(404, `Usuario with id ${email} not found`);
        return UsuarioEntity.fromObject(usuario);
    }

    async updateById(updateUsuarioDto: UpdateUsuarioDto): Promise<UsuarioEntity> {
        await this.findById(updateUsuarioDto.id);
        const updatedUsuario = await prisma.usuario.update({
            where: {id: updateUsuarioDto.id},
            data: updateUsuarioDto!.values
        });

        return UsuarioEntity.fromObject(updatedUsuario);

    }

    async deleteById(id: number): Promise<UsuarioEntity> {
        await this.findById(id);

        const deleted = await prisma.usuario.delete({
            where:{id}
        });

        return UsuarioEntity.fromObject(deleted);
    }

}