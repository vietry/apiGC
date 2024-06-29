import fs from 'fs';
import path from 'path';

import { Request, Response } from "express";
import { CustomError } from '../../domain';



export class ImageController{

    constructor(){}

    getImage = (req: Request, res: Response) => {

        const {type = '', img = ''} = req.params;

        const imagePath = path.resolve( __dirname, `../../../uploads/${type}/${img}`);
        console.log(imagePath)

        if (!fs.existsSync(imagePath)){
            return res.status(404).send('Image not found');
        }

        res.sendFile(imagePath);

    }

    async deleteFile(type: string, img: string) {
        const imagePath = path.resolve(__dirname, `../../../uploads/${type}/${img}`);
        console.log(imagePath);

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