import { prisma } from "../../data/sqlserver";
import { RegisterUsuarioDto, UsuarioRepository } from "../../domain";
import { UsuariosController } from "../usuarios/controller";



export class AuthService{


    constructor(){}

    public async registerUsuario(registerUsuarioDto: RegisterUsuarioDto){

        const existUser = await prisma.usuario.findUnique({
            where: {id: registerUsuarioDto., email: registerUsuarioDto.email },
          });

    }
}