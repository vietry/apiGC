import { Sequelize } from 'sequelize';
import { envs } from './envs';

// Configuración de Sequelize para SQL Server (Base de datos Exactus)
export const sequelizeExactus = new Sequelize({
    dialect: 'mssql',
    host: envs.SQLSERVER_EXACTUS_SERVER,
    port: 1433,
    database: envs.SQLSERVER_EXACTUS_DB_NAME,
    username: envs.SQLSERVER_EXACTUS_USER,
    password: envs.SQLSERVER_EXACTUS_PASSWORD,
    dialectOptions: {
        options: {
            encrypt: false,
            trustServerCertificate: true,
            enableArithAbort: true,
        },
    },
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

// Test de conexión para Exactus
export const testSequelizeExactusConnection = async (): Promise<boolean> => {
    try {
        await sequelizeExactus.authenticate();
        console.log(
            '✅ Sequelize Exactus: Conexión a SQL Server establecida correctamente'
        );
        return true;
    } catch (error) {
        console.error(
            '❌ Sequelize Exactus: Error al conectar con SQL Server:',
            error
        );
        return false;
    }
};

// Inicializar conexión de Sequelize Exactus
export const initializeSequelizeExactus = async (): Promise<void> => {
    try {
        await testSequelizeExactusConnection();
    } catch (error) {
        console.error('Error al inicializar Sequelize Exactus:', error);
        throw error;
    }
};

// Health check específico para Exactus
export const sequelizeExactusHealthCheck = async (): Promise<boolean> => {
    try {
        await sequelizeExactus.query('SELECT 1');
        return true;
    } catch (error) {
        console.error('Health check fallido para Sequelize Exactus:', error);
        return false;
    }
};

// Cierre graceful de la conexión
const closeSequelizeExactus = async () => {
    console.log('\n🛑 Cerrando conexión de Sequelize Exactus...');
    try {
        await sequelizeExactus.close();
        console.log('✅ Conexión de Sequelize Exactus cerrada correctamente');
    } catch (error) {
        console.error(
            '❌ Error al cerrar conexión de Sequelize Exactus:',
            error
        );
    }
};

// Manejadores de señales para cierre graceful
process.on('SIGINT', closeSequelizeExactus);
process.on('SIGTERM', closeSequelizeExactus);
