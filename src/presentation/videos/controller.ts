import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';

export class VideoController {
    /**
     * Obtiene un video por tipo e id del demoplot
     * Ruta: /v1/api/videos/demoplots/:idDemoplot/:video
     * Ejemplo: /v1/api/videos/demoplots/123/abc123.mp4
     */
    getVideoDemoplot = (req: Request, res: Response) => {
        const { idDemoplot = '', video = '' } = req.params;

        const videoPath = path.resolve(
            __dirname,
            `../../../uploads/demoplots/videos/${idDemoplot}/${video}`
        );

        if (!fs.existsSync(videoPath)) {
            return res.status(404).json({ error: 'Video not found' });
        }

        // Obtener la extensión para el content-type
        const ext = path.extname(video).toLowerCase();
        const mimeTypes: Record<string, string> = {
            '.mp4': 'video/mp4',
            '.webm': 'video/webm',
            '.mov': 'video/quicktime',
            '.avi': 'video/x-msvideo',
            '.mkv': 'video/x-matroska',
        };

        const contentType = mimeTypes[ext] || 'video/mp4';

        // Obtener stats del archivo para streaming
        const stat = fs.statSync(videoPath);
        const fileSize = stat.size;
        const range = req.headers.range;

        // Soporte para streaming con Range headers (importante para videos)
        if (range) {
            const parts = range.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunkSize = end - start + 1;

            const file = fs.createReadStream(videoPath, { start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
                'Content-Type': contentType,
            };

            res.writeHead(206, head);
            file.pipe(res);
        } else {
            // Sin range, enviar todo el archivo
            const head = {
                'Content-Length': fileSize,
                'Content-Type': contentType,
            };
            res.writeHead(200, head);
            fs.createReadStream(videoPath).pipe(res);
        }
    };

    /**
     * Obtiene un video genérico por tipo y subcarpeta
     * Ruta: /v1/api/videos/:type/:folder/:video
     */
    getVideo = (req: Request, res: Response) => {
        const { type = '', folder = '', video = '' } = req.params;

        const videoPath = path.resolve(
            __dirname,
            `../../../uploads/${type}/videos/${folder}/${video}`
        );

        if (!fs.existsSync(videoPath)) {
            return res.status(404).json({ error: 'Video not found' });
        }

        const ext = path.extname(video).toLowerCase();
        const mimeTypes: Record<string, string> = {
            '.mp4': 'video/mp4',
            '.webm': 'video/webm',
            '.mov': 'video/quicktime',
            '.avi': 'video/x-msvideo',
            '.mkv': 'video/x-matroska',
        };

        const contentType = mimeTypes[ext] || 'video/mp4';
        const stat = fs.statSync(videoPath);
        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunkSize = end - start + 1;

            const file = fs.createReadStream(videoPath, { start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
                'Content-Type': contentType,
            };

            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': contentType,
            };
            res.writeHead(200, head);
            fs.createReadStream(videoPath).pipe(res);
        }
    };
}
