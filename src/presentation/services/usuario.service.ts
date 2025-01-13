import { BcryptAdapter } from "../../config";
import { getCurrentDate } from "../../config/time";

import { prisma } from "../../data/sqlserver";
import {
  CreateUsuarioDto,
  UpdateUsuarioDto,
  CustomError,
  PaginationDto,
  UsuarioEntity,
} from "../../domain"; // Ajustar al path real

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
}

export class UsuariosService {
  constructor() {}

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
    //const date = new Date();

    const usuario = await prisma.usuario.findUnique({
      where: { id: updateUsuarioDto.id },
    });
    if (!usuario) {
      throw CustomError.badRequest(
        `No existe el usuario con id ${updateUsuarioDto.id}`
      );
    }

    try {
      const currentDate = getCurrentDate();
      const updatedUsuario = await prisma.usuario.update({
        where: { id: updateUsuarioDto.id },
        data: {
          ...updateUsuarioDto.values,
          updatedAt: currentDate,
        },
      });
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
    const { nombres, apellidos, email, celular, rol } = filters;

    // Construimos el objeto 'where' para los filtros
    const where: any = {};

    // Ejemplo de filtro con búsqueda parcial (case-insensitive)
    if (nombres) {
      where.nombres = {
        contains: nombres,
        //mode: "insensitive",
      };
    }
    if (apellidos) {
      where.apellidos = {
        contains: apellidos,
      };
    }
    if (email) {
      where.email = {
        contains: email,
      };
    }
    if (celular) {
      where.celular = {
        contains: celular,
      };
    }
    if (rol) {
      where.rol = { contains: rol };
    }

    try {
      const [total, usuarios] = await Promise.all([
        prisma.usuario.count({ where }),
        prisma.usuario.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
        }),
      ]);

      return {
        page,
        pages: Math.ceil(total / limit),
        limit,
        total,
        next: `/v1/usuarios?page=${page + 1}&limit=${limit}`,
        prev:
          page - 1 > 0 ? `/v1/usuarios?page=${page - 1}&limit=${limit}` : null,
        usuarios,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async getUsuarios(filters: UsuarioFilters = {}) {
    const { nombres, apellidos, email, celular, rol } = filters;

    const where: any = {};

    if (nombres) {
      where.nombres = {
        contains: nombres,
        mode: "insensitive",
      };
    }
    if (apellidos) {
      where.apellidos = {
        contains: apellidos,
        mode: "insensitive",
      };
    }
    if (email) {
      where.email = {
        contains: email,
        mode: "insensitive",
      };
    }
    if (celular) {
      where.celular = {
        contains: celular,
        mode: "insensitive",
      };
    }
    if (rol) {
      where.rol = rol;
    }

    try {
      const usuarios = await prisma.usuario.findMany({ where });
      return usuarios;
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
    if (updateUsuarioDto.email && updateUsuarioDto.email !== usuario.email) {
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
