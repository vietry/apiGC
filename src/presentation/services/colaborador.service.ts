import { prisma } from "../../data/sqlserver";
import { ColaboradorEntity, CreateColaboradorDTO, CustomError, UsuarioEntity } from "../../domain";



export class ColaboradorService{

    //DI
    constructor(){}


    async createColaborador( createColaboradorDto: CreateColaboradorDTO, user: UsuarioEntity){

        //const colaboradorExists = await prisma.colaborador.findFirst({where: {email: createColaboradorDto.cargo}});

        try {
            
            const colaborador = new ColaboradorEntity({
                ...createColaboradorDto,
                idNegocio: 1,
                idUsuario: user.id

            })

        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }

    }

}