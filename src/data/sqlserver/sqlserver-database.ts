import { PrismaClient } from '@prisma/client';
import sql from 'mssql';

interface Options {
    user: string;
    password: string;
    server: string;
    database: string;
}

export class SqlServerDatabase {
    private static readonly prisma = new PrismaClient();

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

    // Método para verificar la salud de la base de datos
    static async healthCheck(): Promise<boolean> {
        try {
            await this.prisma.$queryRaw`SELECT 1`;
            return true;
        } catch (error) {
            console.error('❌ Health check falló:', error);
            return false;
        }
    }
}
