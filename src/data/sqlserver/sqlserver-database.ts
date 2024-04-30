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
                    encrypt: true,
                    trustServerCertificate: true
                }
            });

            console.log('SQL Server connected');
            return true;

        } catch (error) {
            console.log('SQL Server connection error');
            throw error;
        }
    }
}