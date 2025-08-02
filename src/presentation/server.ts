import express, { Router } from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';
import compression from 'compression';
import os from 'os';
import { SqlServerDatabase } from '../data';
import cors from 'cors';

interface Options {
    port: number;
    routes: Router;
    public_path: string;
}

export class Server {
    public readonly app = express();
    private serverListener?: any;
    private readonly port: number;
    private readonly publicPath: string;
    private readonly routes: Router;

    private showMemoryUsage() {
        const used = process.memoryUsage();
        const totalMemory = os.totalmem();
        const freeMemory = os.freemem();

        console.log('Uso de Memoria:');
        console.log(
            `Total: ${(totalMemory / 1024 / 1024 / 1024).toFixed(2)} GB`
        );
        console.log(
            `Libre: ${(freeMemory / 1024 / 1024 / 1024).toFixed(2)} GB`
        );
        console.log(`RSS: ${(used.rss / 1024 / 1024).toFixed(2)} MB`);
        console.log(
            `Heap Total: ${(used.heapTotal / 1024 / 1024).toFixed(2)} MB`
        );
        console.log(
            `Heap Usado: ${(used.heapUsed / 1024 / 1024).toFixed(2)} MB`
        );
    }

    constructor(options: Options) {
        const { port, routes, public_path = 'public' } = options;
        this.port = port;
        this.publicPath = public_path;
        this.routes = routes;
    }

    async start() {
        //* Middlewares

        this.app.use(express.json({ limit: '50mb' })); // Se aumenta el límite del request
        this.app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Se aumenta el límite para urlencoded
        this.app.use(compression());
        this.app.use(
            fileUpload({
                limits: { fileSize: 50 * 1024 * 1024 },
            })
        );

        //* Public Folder
        // this.app.use(express.static(this.publicPath));
        // this.app.use(cors());

        //* Public Folder - Ruta absoluta
        const publicPath = path.resolve(__dirname, '../../public');
        this.app.use(express.static(publicPath));

        //* CORS Configuration
        this.app.use(
            cors({
                origin: [
                    'https://apps.tqc.com.pe',
                    'http://localhost:5173',
                    'http://localhost:5174',
                ],
                credentials: true,
            })
        );

        //* Routes
        this.app.use(this.routes);

        // Health check mejorado
        this.app.get('/api/health', async (req, res) => {
            const dbHealth = await SqlServerDatabase.healthCheck();

            console.log(
                `[${new Date().toISOString()}] Health check accessed from: ${
                    req.ip
                }`
            );

            res.status(200).json({
                status: 'ok',
                timestamp: new Date(),
                uptime: process.uptime(),
                //memory: process.memoryUsage(),
                database: dbHealth ? 'connected' : 'disconnected',
                version: '2.0.0',
                //port: this.port,
                //env: process.env.NODE_ENV ?? "development",
                //requestIP: req.ip,
                forwardedFor: req.headers['x-forwarded-for'],
            });
        });

        //* SPA Route - Debe ir después de todas las rutas API
        this.app.get('*', (req, res) => {
            res.sendFile(path.join(publicPath, 'index.html'));
        });

        this.serverListener = this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
            console.log(`Static files served from: ${publicPath}`);
            this.showMemoryUsage();

            setInterval(() => {
                this.showMemoryUsage();
            }, 5 * 60 * 1000);
        });
    }

    public close() {
        this.serverListener?.close();
    }
}
