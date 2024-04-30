import { RegisterUsuarioDto, UsuarioRepository } from "../../domain";
import { UsuariosController } from "../usuarios/controller";



export class AuthService{


    constructor(){}

    public async registerUsuario(registerUsuarioDto: RegisterUsuarioDto){

        const existUser = await UsuariosController ({ email: registerUsuarioDto.email });

    }
}