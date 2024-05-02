import { prisma } from "../../data/sqlserver";
import { JwtAdapter, BcryptAdapter } from '../../config';
import { CustomError, RegisterUsuarioDto, UsuarioEntity } from "../../domain";
import { LoginUsuarioDto } from "../../domain/dtos/auth/login-user.dto";




export class AuthService{


    constructor(){}

    public async registerUsuario(registerUsuarioDto: RegisterUsuarioDto){

        const existUser = await prisma.usuario.findFirst({
            where: {email: registerUsuarioDto.email },
          });
          if (existUser) throw CustomError.badRequest('El email ya existe');

          try {

            const hashedPassword = BcryptAdapter.hash(registerUsuarioDto.password);
            const user = await prisma.usuario.create({
                data: {
                  ...registerUsuarioDto,
                  password: hashedPassword,
                },
              });

              const { password, ...userEntity } = UsuarioEntity.fromObject(user);

              return {
                user: userEntity,
                token: 'ABC',
              };
            
          } catch (error) {
            
            throw CustomError.internalServer(`${error}`);
          }
    }


    public async loginUser(loginUsuarioDto: LoginUsuarioDto) {
        const user = await prisma.usuario.findFirst({ where: { email: loginUsuarioDto.email } });
        if (!user) throw CustomError.badRequest('Email not exist');
    
        const isMatching = BcryptAdapter.compare(loginUsuarioDto.password, user.password);
        if (!isMatching) throw CustomError.badRequest('Password is not valid');
    
        const { password, ...userEntity } = UsuarioEntity.fromObject(user);
    
        const token = await JwtAdapter.generateToken({ id: user.id, email: user.email });
        if (!token) throw CustomError.internalServer('Error while creating JWT');
    
        return {
          user: userEntity,
          token: token,
        };
      }

}