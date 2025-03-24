import { prisma } from '../../data/sqlserver';
import { CustomError } from '../../domain';

export class FotoService {
    async deleteFotoById(id: number) {
        try {
            const foto = await prisma.foto.findUnique({
                where: { id },
            });

            if (!foto) {
                throw CustomError.badRequest(
                    `Foto with id ${id} does not exist`
                );
            }

            await prisma.foto.delete({
                where: { id },
            });

            return {
                message: `Foto with id ${id} has been successfully deleted`,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
