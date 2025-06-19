import { BcryptAdapter } from '../../config';
import { getCurrentDate } from '../../config/time';

import { prisma } from '../../data/sqlserver';
import {
    CreateUsuarioDto,
    UpdateUsuarioDto,
    CustomError,
    PaginationDto,
    UsuarioEntity,
} from '../../domain'; // Ajustar al path real

/**
 * Tipos de filtros que deseamos manejar
 * (puedes ajustarlo según tus necesidades)
 */
interface UsuarioFilters {
    nombres?: string;
    apellidos?: string;
    email?: string;
    celular?: string;
    rol?: string;
    activo?: boolean;
}

export class UsuariosService {
    async createUsuario(createUsuarioDto: CreateUsuarioDto) {
        const usuarioExists = await prisma.usuario.findFirst({
            where: { email: createUsuarioDto.email },
        });
        if (usuarioExists) {
            throw CustomError.badRequest(
                `El correo ${createUsuarioDto.email} ya está registrado`
            );
        }

        try {
            const currentDate = getCurrentDate();
            const usuario = await prisma.usuario.create({
                data: {
                    nombres: createUsuarioDto.nombres,
                    apellidos: createUsuarioDto.apellidos,
                    email: createUsuarioDto.email,
                    emailValidado: createUsuarioDto.emailValidado ?? false,
                    password: createUsuarioDto.password,
                    celular: createUsuarioDto.celular,
                    rol: createUsuarioDto.rol,
                    idFoto: createUsuarioDto.idFoto,
                    createdAt: currentDate,
                    updatedAt: currentDate,
                },
            });

            return usuario;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateUsuario(updateUsuarioDto: UpdateUsuarioDto) {
        const usuario = await prisma.usuario.findUnique({
            where: { id: updateUsuarioDto.id },
        });
        if (!usuario) {
            throw CustomError.badRequest(
                `No existe el usuario con id ${updateUsuarioDto.id}`
            );
        }
        console.log('service1', updateUsuarioDto.values);

        try {
            const currentDate = getCurrentDate();
            const updatedUsuario = await prisma.usuario.update({
                where: { id: updateUsuarioDto.id },
                data: {
                    ...updateUsuarioDto.values,
                    updatedAt: currentDate,
                },
            });
            console.log('service2', updatedUsuario);

            return updatedUsuario;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getUsuariosByPage(
        paginationDto: PaginationDto,
        filters: UsuarioFilters = {}
    ) {
        const { page, limit } = paginationDto;
        const { nombres, apellidos, email, celular, rol, activo } = filters;
        const where: any = {};

        // Filtros básicos con mode insensitive
        if (nombres) {
            where.nombres = { contains: nombres };
        }
        if (apellidos) {
            where.apellidos = { contains: apellidos };
        }
        if (email) {
            where.email = { contains: email };
        }
        if (celular) {
            where.celular = { contains: celular };
        }
        if (rol) {
            where.rol = rol;
        }

        try {
            // 1. Obtener todos los usuarios según filtros básicos
            const todosUsuarios = await prisma.usuario.findMany({ where });

            // 2. Obtener usuarios activos (colaborador o gte)
            const [colaboradores, gtes] = await Promise.all([
                prisma.colaborador.findMany({ select: { idUsuario: true } }),
                prisma.gte.findMany({ select: { idUsuario: true } }),
            ]);

            const idsActivos = new Set([
                ...colaboradores.map((c) => c.idUsuario),
                ...gtes.map((g) => g.idUsuario),
            ]);

            // 3. Filtrar usuarios según activo
            const usuariosFiltrados = todosUsuarios.filter(
                (usuario) =>
                    activo === undefined ||
                    activo === idsActivos.has(usuario.id)
            );

            // 4. Calcular total y aplicar paginación
            const total = usuariosFiltrados.length;
            const start = (page - 1) * limit;
            const usuariosPaginados = usuariosFiltrados.slice(
                start,
                start + limit
            );

            // 5. Mapear resultados
            const usuariosConActivo = usuariosPaginados.map((usuario) => ({
                id: usuario.id,
                nombres: usuario.nombres,
                apellidos: usuario.apellidos,
                email: usuario.email,
                emailValidado: usuario.emailValidado ?? false,
                //password: usuario.password,
                celular: usuario.celular,
                rol: usuario.rol,
                idFoto: usuario.idFoto,
                activo: idsActivos.has(usuario.id),
                createdAt: usuario.createdAt,
                updatedAt: usuario.updatedAt,
            }));

            return {
                page,
                pages: Math.ceil(total / limit),
                limit,
                total,
                usuarios: usuariosConActivo,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getUsuarios(filters: UsuarioFilters = {}) {
        const { nombres, apellidos, email, celular, rol, activo } = filters;
        const where: any = {};

        // Filtros básicos
        if (nombres) {
            where.nombres = { contains: nombres, mode: 'insensitive' };
        }
        if (apellidos) {
            where.apellidos = { contains: apellidos, mode: 'insensitive' };
        }
        if (email) {
            where.email = { contains: email, mode: 'insensitive' };
        }
        if (celular) {
            where.celular = { contains: celular, mode: 'insensitive' };
        }
        if (rol) {
            where.rol = rol;
        }

        try {
            // 1. Obtener usuarios según filtros básicos
            const usuarios = await prisma.usuario.findMany({
                where,
                orderBy: {
                    nombres: 'asc',
                },
            });

            // 2. Obtener todos los usuarios activos (que existen en colaborador o gte)
            const [colaboradores, gtes] = await Promise.all([
                prisma.colaborador.findMany({ select: { idUsuario: true } }),
                prisma.gte.findMany({ select: { idUsuario: true } }),
            ]);

            const idsActivos = new Set([
                ...colaboradores.map((c) => c.idUsuario),
                ...gtes.map((g) => g.idUsuario),
            ]);

            // 3. Filtrar usuarios según el parámetro activo
            const usuariosFiltrados = usuarios.filter(
                (usuario) =>
                    activo === undefined ||
                    activo === idsActivos.has(usuario.id)
            );

            // 4. Mapear resultados
            return usuariosFiltrados.map((usuario) => ({
                id: usuario.id,
                nombres: usuario.nombres,
                apellidos: usuario.apellidos,
                email: usuario.email,
                emailValidado: usuario.emailValidado ?? false,
                //password: usuario.password,
                celular: usuario.celular,
                rol: usuario.rol,
                idFoto: usuario.idFoto,
                activo: idsActivos.has(usuario.id),
                createdAt: usuario.createdAt,
                updatedAt: usuario.updatedAt,
            }));
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getUsuarioById(id: number) {
        try {
            const usuario = await prisma.usuario.findUnique({
                where: { id },
            });
            if (!usuario) {
                throw CustomError.badRequest(`Usuario con id ${id} no existe`);
            }
            return usuario;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getUsuarioByEmail(email: string) {
        try {
            const usuario = await prisma.usuario.findFirst({
                where: { email },
            });
            if (!usuario) {
                throw CustomError.badRequest(
                    `Usuario con email ${email} no existe`
                );
            }
            return usuario;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async deleteUsuario(id: number) {
        // Verificamos si existe el usuario
        const usuario = await prisma.usuario.findUnique({
            where: { id },
        });
        if (!usuario) {
            throw CustomError.badRequest(`No existe el usuario con id ${id}`);
        }

        try {
            // Eliminamos el usuario
            const deletedUsuario = await prisma.usuario.delete({
                where: { id },
            });
            return deletedUsuario;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async findByEmail(email: string): Promise<UsuarioEntity> {
        const usuario = await prisma.usuario.findFirst({
            where: { email },
        });

        if (!usuario) {
            throw new CustomError(404, `Usuario with email ${email} not found`);
        }

        // Convertimos el resultado de Prisma a nuestra entidad de dominio
        return UsuarioEntity.fromObject(usuario);
    }

    async updateUsuarioById(
        updateUsuarioDto: UpdateUsuarioDto
    ): Promise<UsuarioEntity> {
        // 1. Verificar si existe el usuario con ese ID
        const usuario = await prisma.usuario.findUnique({
            where: { id: updateUsuarioDto.id },
        });
        if (!usuario) {
            throw CustomError.badRequest(
                `No existe el usuario con id ${updateUsuarioDto.id}`
            );
        }

        // 2. Si se quiere actualizar el email, verificar que NO exista en otro usuario
        if (
            updateUsuarioDto.email &&
            updateUsuarioDto.email !== usuario.email
        ) {
            const userWithSameEmail = await prisma.usuario.findFirst({
                where: {
                    email: updateUsuarioDto.email,
                    NOT: { id: updateUsuarioDto.id },
                },
            });
            if (userWithSameEmail) {
                throw CustomError.badRequest(
                    `El correo ${updateUsuarioDto.email} ya está registrado por otro usuario`
                );
            }
        }

        // 3. Preparar data de actualización desde el DTO
        const updateData = { ...updateUsuarioDto.values };

        // 4. Si viene un nuevo password, hashearlo
        if (updateUsuarioDto.password) {
            updateData.password = BcryptAdapter.hash(updateUsuarioDto.password);
        }

        try {
            const currentDate = getCurrentDate();

            // 5. Actualizar en DB y retornar la entidad de dominio
            const updatedUsuario = await prisma.usuario.update({
                where: { id: updateUsuarioDto.id },
                data: {
                    ...updateData,
                    updatedAt: currentDate,
                },
            });
            return UsuarioEntity.fromObject(updatedUsuario);
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
