import { prisma } from './index';
import sql from 'mssql';

interface Options {
    user: string;
    password: string;
    server: string;
    database: string;
}

export class SqlServerDatabase {
    static async connect(options: Options) {
        const { user, password, server, database } = options;

        try {
            await sql.connect({
                user: user,
                password: password,
                server: server,
                database: database,
                options: {
                    encrypt: false,
                    trustServerCertificate: true,
                },
            });

            console.log('SQL Server connected');
            return true;
        } catch (error) {
            console.log('SQL Server connection error');
            throw error;
        }
    }

    // Método para verificar la salud de la base de datos (con caché para evitar saturar el pool)
    private static lastHealthCheck: {
        result: boolean;
        timestamp: number;
    } | null = null;
    private static readonly HEALTH_CHECK_CACHE_MS = 30_000; // cachear resultado por 30 segundos

    static async healthCheck(): Promise<boolean> {
        const now = Date.now();
        // Si el último check fue hace menos de 30s, devolver el resultado cacheado
        if (
            this.lastHealthCheck &&
            now - this.lastHealthCheck.timestamp < this.HEALTH_CHECK_CACHE_MS
        ) {
            return this.lastHealthCheck.result;
        }

        try {
            await prisma.$queryRaw`SELECT 1`;
            this.lastHealthCheck = { result: true, timestamp: now };
            return true;
        } catch (error) {
            console.error('❌ Health check falló:', error);
            this.lastHealthCheck = { result: false, timestamp: now };
            return false;
        }
    }
}
