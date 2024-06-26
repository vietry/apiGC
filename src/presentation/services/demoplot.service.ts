import { prisma } from "../../data/sqlserver";
import { CreateDemoplotDto, CustomError, PaginationDto, UpdateDemoplotDto } from "../../domain";

export class DemoplotService {

    // DI
    constructor() {}

    async createDemoplot(createDemoplotDto: CreateDemoplotDto) {
        try {
            const currentDate = new Date();

            const demoplot = await prisma.demoPlot.create({
                data: {
                    titulo: createDemoplotDto.titulo,
                    objetivo: createDemoplotDto.objetivo,
                    hasCultivo: createDemoplotDto.hasCultivo,
                    instalacion: createDemoplotDto.instalacion,
                    seguimiento: createDemoplotDto.seguimiento,
                    finalizacion: createDemoplotDto.finalizacion,
                    estado: createDemoplotDto.estado,
                    gradoInfestacion: createDemoplotDto.gradoInfestacion,
                    dosis: createDemoplotDto.dosis,
                    validacion: createDemoplotDto.validacion,
                    resultado: createDemoplotDto.resultado,
                    idCultivo: createDemoplotDto.idCultivo,
                    idContactoP: createDemoplotDto.idContactoP,
                    idBlanco: createDemoplotDto.idBlanco,
                    idDistrito: createDemoplotDto.idDistrito,
                    idArticulo: createDemoplotDto.idArticulo,
                    idGte: createDemoplotDto.idGte,
                    createdAt: currentDate,
                    updatedAt: currentDate,
                },
            });

            return demoplot;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateDemoplot(updateDemoplotDto: UpdateDemoplotDto) {
        const demoplotExists = await prisma.demoPlot.findFirst({ where: { id: updateDemoplotDto.id } });
        if (!demoplotExists) throw CustomError.badRequest(`Demoplot with id ${updateDemoplotDto.id} does not exist`);

        try {
            const updatedDemoplot = await prisma.demoPlot.update({
                where: { id: updateDemoplotDto.id },
                data: {
                    ...updateDemoplotDto.values,
                    updatedAt: new Date(),
                },
            });

            return updatedDemoplot;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }


    async getDemoplots(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;

        try {
            const [total, demoplots] = await Promise.all([
                prisma.demoPlot.count(),
                prisma.demoPlot.findMany({
                    skip: (page - 1) * limit,
                    take: limit,
                    include: {
                        Articulo: true,
                        BlancoBiologico: true,
                        ContactoDelPunto: true,
                        Cultivo: true,
                        Gte: true,
                        Distrito: true,
                        FotoDemoPlot: true
                    },
                }),
            ]);

            return {
                page: page,
                limit: limit,
                total: total,
                next: `/api/demoplots?page=${page + 1}&limit=${limit}`,
                prev: page - 1 > 0 ? `/api/demoplots?page=${page - 1}&limit=${limit}` : null,
                demoplots: demoplots.map(demoplot => ({
                    id: demoplot.id,
                    titulo: demoplot.titulo,
                    objetivo: demoplot.objetivo,
                    hasCultivo: demoplot.hasCultivo,
                    instalacion: demoplot.instalacion,
                    seguimiento: demoplot.seguimiento,
                    finalizacion: demoplot.finalizacion,
                    estado: demoplot.estado,
                    gradoInfestacion: demoplot.gradoInfestacion,
                    dosis: demoplot.dosis,
                    validacion: demoplot.validacion,
                    resultado: demoplot.resultado,
                    idCultivo: demoplot.idCultivo,
                    idContactoP: demoplot.idContactoP,
                    idBlanco: demoplot.idBlanco,
                    idDistrito: demoplot.idDistrito,
                    idArticulo: demoplot.idArticulo,
                    idGte: demoplot.idGte,
                    Articulo: demoplot.Articulo,
                    BlancoBiologico: demoplot.BlancoBiologico,
                    ContactoDelPunto: demoplot.ContactoDelPunto,
                    Cultivo: demoplot.Cultivo,
                    Gte: demoplot.Gte,
                    Distrito: demoplot.Distrito,
                    FotoDemoPlot: demoplot.FotoDemoPlot
                }))
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
