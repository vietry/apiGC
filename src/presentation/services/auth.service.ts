import { prisma } from "../../data/sqlserver";
import { JwtAdapter, BcryptAdapter, envs } from '../../config';
import { CustomError, RegisterUsuarioDto, UsuarioEntity } from "../../domain";
import { LoginUsuarioDto } from "../../domain/dtos/auth/login-user.dto";
import { EmailService } from "./email.service";




export class AuthService{
    prisma: any;


    constructor(
        //DI - EMAIL SERVICE
        private readonly emailService: EmailService,
    ){}

    public async registerUsuario(registerUsuarioDto: RegisterUsuarioDto){

        const existUser = await prisma.usuario.findFirst({
            where: {email: registerUsuarioDto.email },
          });
          if (existUser) throw CustomError.badRequest('El email ya existe');

          try {
            const currentDate = new Date();
            const hashedPassword = BcryptAdapter.hash(registerUsuarioDto.password);
            const user = await prisma.usuario.create({
                data: {
                  ...registerUsuarioDto,
                  password: hashedPassword,
                  createdAt: currentDate,
                  updatedAt: currentDate,
                },
              });
              
            // email de confirmacion
              this.sendEmailValidationLink(user.email);

              const { password, ...userEntity } = UsuarioEntity.fromObject(user);
              const token = await JwtAdapter.generateToken({ id: user.id});
              if (!token) throw CustomError.internalServer('Error while creating JWT');

              return {
                user: userEntity,
                token: token,
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
          user: {
              ...userEntity,
              token: token,
          },
          token: token,
      };
      }

      private sendEmailValidationLink = async (email: string) => {

        const token = await JwtAdapter.generateToken({email});
        if (!token) throw CustomError.internalServer('Error getting token');

        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
        const html = `
            <h1>Valida tu email</h1>
            <p>Haz click en el siguiente enlace para validar tu cuenta de usuario.</p>
            <a href="${link}">Click here to validate your email: ${email}</a>`;

        const options = {
            to: email,
            subject: 'Validate your email',
            htmlBody: html,
        }

        const isSet = await this.emailService.sendEmail(options);
        if(!isSet) throw CustomError.internalServer('There was an error sending the validation email'); 

        return true;
      }

      public validateEmail = async  (token:string) => {

        const payload = await JwtAdapter.validateToken(token);
        if(!payload) throw CustomError.unauthorized('Invalid or expired token');

        const  {email} = payload as {email: string};
        console.log(email)
        if(!email) throw CustomError.internalServer('Email not in token');

        const user = await prisma.usuario.findFirst({ where: { email: email } });
        console.log(user);
        if(!user) throw CustomError.internalServer('El email no existe');

        /*user.emailValidado = true;
        await user.update();

        return true;*/

            // Actualizar el valor de emailValidado a true
        const updatedUser = await prisma.usuario.update({
            where: { id: user.id },
            data: { emailValidado: true },
        });

        return true;

    }

 

  

}