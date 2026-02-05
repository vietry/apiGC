import { prisma } from '../../data/sqlserver';
import { CustomError, PaginationDto } from '../../domain';

export class VideoDemoplotService {
    async getVideosDemoplot(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;

        try {
            const [total, videos] = await Promise.all([
                prisma.videoDemoplot.count({
                    where: { activo: true },
                }),
                prisma.videoDemoplot.findMany({
                    skip: (page - 1) * limit,
                    take: limit,
                    where: { activo: true },
                    orderBy: { createdAt: 'desc' },
                    include: {
                        DemoPlot: {
                            select: {
                                id: true,
                                titulo: true,
                            },
                        },
                    },
                }),
            ]);

            return {
                page,
                pages: Math.ceil(total / limit),
                limit,
                total,
                videos,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getVideoDemoplotById(id: number) {
        try {
            const video = await prisma.videoDemoplot.findUnique({
                where: { id },
                include: {
                    DemoPlot: {
                        select: {
                            id: true,
                            titulo: true,
                            objetivo: true,
                        },
                    },
                },
            });

            if (!video) {
                throw CustomError.badRequest(
                    `VideoDemoplot with id ${id} does not exist`
                );
            }

            return video;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getVideosByIdDemoplot(idDemoplot: number) {
        try {
            const demoplotExists = await prisma.demoPlot.findFirst({
                where: { id: idDemoplot },
            });

            if (!demoplotExists) {
                throw CustomError.badRequest(
                    `DemoPlot with id ${idDemoplot} does not exist`
                );
            }

            const videos = await prisma.videoDemoplot.findMany({
                where: {
                    idDemoplot: idDemoplot,
                    activo: true,
                },
                orderBy: { createdAt: 'desc' },
            });

            return videos;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`${error}`);
        }
    }

    async deleteVideoDemoplotById(id: number) {
        try {
            const video = await prisma.videoDemoplot.findUnique({
                where: { id },
            });

            if (!video) {
                throw CustomError.badRequest(
                    `VideoDemoplot with id ${id} does not exist`
                );
            }

            // Soft delete - marcar como inactivo
            const deletedVideo = await prisma.videoDemoplot.update({
                where: { id },
                data: { activo: false },
            });

            return {
                message: 'Video deleted successfully',
                video: deletedVideo,
            };
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`${error}`);
        }
    }

    async hardDeleteVideoDemoplotById(id: number) {
        try {
            const video = await prisma.videoDemoplot.findUnique({
                where: { id },
            });

            if (!video) {
                throw CustomError.badRequest(
                    `VideoDemoplot with id ${id} does not exist`
                );
            }

            // Hard delete - eliminar completamente
            await prisma.videoDemoplot.delete({
                where: { id },
            });

            return {
                message: 'Video permanently deleted',
                video,
            };
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`${error}`);
        }
    }
}
