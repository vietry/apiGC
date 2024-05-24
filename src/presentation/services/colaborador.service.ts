import { prisma } from "../../data/sqlserver";
import { ColaboradorEntity, CreateColaboradorDTO, CustomError, UsuarioEntity } from "../../domain";



export class ColaboradorService{

    //DI
    constructor(){}


    async createColaborador( createColaboradorDto: CreateColaboradorDTO, user: UsuarioEntity){

        //const colaboradorExists = await prisma.colaborador.findFirst({where: {email: createColaboradorDto.cargo}});

        try {
            const currentDate = new Date();
            const colaborador = new ColaboradorEntity(
                createColaboradorDto.cargo,
                createColaboradorDto.idArea,
                createColaboradorDto.idZonaAnt,
                user.id,

            );

            await prisma.colaborador.create({
                data: {
                    ...colaborador,
                    createdAt: currentDate,
                    updatedAt: currentDate, 
                }
            });

            return {
              name:  colaborador.cargo
            }

        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }

    }

}