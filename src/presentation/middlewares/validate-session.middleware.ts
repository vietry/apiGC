import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

// Middleware para validar la sesión usando la cookie compartida y el endpoint de plataforma
export const validateSessionMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Leer la cookie de sesión (ajusta el nombre si es necesario)
        const sessionCookie =
            req.cookies['session'] ??
            req.cookies['SESSION'] ??
            req.cookies['token'];
        if (!sessionCookie) {
            return res.status(401).json({ error: 'No session cookie found' });
        }

        // Llamar al endpoint de validación de sesión de la plataforma
        const response = await axios.get(
            'https://apps.tqc.com.pe/v3/api/auth/validate-session',
            {
                headers: {
                    Cookie: `session=${sessionCookie}`,
                },
                withCredentials: true,
            }
        );

        if (response.data.status !== 'success') {
            return res.status(401).json({ error: 'Invalid session' });
        }

        // Puedes guardar los datos del usuario en req.user si lo necesitas
        req.body.user = response.data.data;
        next();
    } catch (error: any) {
        // Si la validación falla, denegar acceso
        return res
            .status(401)
            .json({
                error: 'Session validation failed',
                details: error?.response?.data || error.message,
            });
    }
};
