import fs from 'fs';
import path from 'path';

import { Request, Response } from 'express';
import { CustomError } from '../../domain';

export class ImageController {
    constructor() {}

    getImage = (req: Request, res: Response) => {
        const { type = '', img = '' } = req.params;

        const imagePath = path.resolve(
            __dirname,
            `../../../uploads/${type}/${img}`
        );

        if (!fs.existsSync(imagePath)) {
            return res.status(404).send('Image not found');
        }

        res.sendFile(imagePath);
    };

    getImageCharla = (req: Request, res: Response) => {
        const { type = '', img = '', idCharla = '' } = req.params;

        const imagePath = path.resolve(
            __dirname,
            `../../../uploads/${type}/${idCharla}/${img}`
        );

        if (!fs.existsSync(imagePath)) {
            return res.status(404).send('Image not found');
        }
        console.log('imagePath', imagePath);

        res.sendFile(imagePath);
    };

    /**
     * Obtiene la imagen de charla usando el email del usuario
     */
    getImageCharlaByEmail = async (req: Request, res: Response) => {
        const { type = '', img = '', email = '' } = req.params;
        if (!email) {
            return res.status(400).send('Email es requerido');
        }
        // Buscar el id del usuario por email
        try {
            // Importación dinámica para evitar ciclos
            const { prisma } = await import('../../data/sqlserver');
            const usuario = await prisma.usuario.findFirst({
                where: { email },
            });
            if (!usuario) {
                return res.status(404).send('Usuario no encontrado');
            }
            const idCharla = usuario.id;
            const imagePath = path.resolve(
                __dirname,
                `../../../uploads/${type}/${idCharla}/${img}`
            );
            if (!fs.existsSync(imagePath)) {
                return res.status(404).send('Image not found');
            }
            res.sendFile(imagePath);
        } catch (error) {
            console.error('Error in getImageCharlaByEmail:', error);
            return res.status(500).send('Error interno');
        }
    };

    async deleteFile(type: string, img: string) {
        const imagePath = path.resolve(
            __dirname,
            `../../../uploads/${type}/${img}`
        );

        if (!fs.existsSync(imagePath)) {
            throw CustomError.badRequest('Image not found');
        }

        try {
            fs.unlinkSync(imagePath);
            return { message: 'File deleted successfully' };
        } catch (error) {
            throw CustomError.internalServer(`Error deleting file: ${error}`);
        }
    }

    async deleteFileCharla(idCharla: string, type: string, img: string) {
        const imagePath = path.resolve(
            __dirname,
            `../../../uploads/${type}/${idCharla}/${img}`
        );

        if (!fs.existsSync(imagePath)) {
            throw CustomError.badRequest('Image not found');
        }

        try {
            fs.unlinkSync(imagePath);
            return { message: 'File deleted successfully' };
        } catch (error) {
            throw CustomError.internalServer(`Error deleting file: ${error}`);
        }
    }
}
