import { sequelizeExactus } from '../../config';
import { QueryTypes } from 'sequelize';

/**
 * Clase helper para manejar operaciones con la base de datos Exactus
 */
export class ExactusDatabase {
    /**
     * Ejecuta una consulta SQL raw en la base de datos Exactus
     * @param query - La consulta SQL a ejecutar
     * @param replacements - Parámetros para la consulta (opcional)
     * @returns Resultado de la consulta
     */
    static async query<T = any>(
        query: string,
        replacements?: any[]
    ): Promise<T[]> {
        try {
            const result = await sequelizeExactus.query(query, {
                type: QueryTypes.SELECT,
                replacements,
            });
            return result as T[];
        } catch (error) {
            console.error('Error ejecutando consulta en Exactus:', error);
            throw error;
        }
    }

    /**
     * Ejecuta una consulta de inserción, actualización o eliminación
     * @param query - La consulta SQL a ejecutar
     * @param replacements - Parámetros para la consulta (opcional)
     * @returns Número de filas afectadas
     */
    static async execute(query: string, replacements?: any[]): Promise<number> {
        try {
            const [, metadata] = await sequelizeExactus.query(query, {
                replacements,
            });
            return (metadata as any)?.rowsAffected?.[0] || 0;
        } catch (error) {
            console.error('Error ejecutando comando en Exactus:', error);
            throw error;
        }
    }

    /**
     * Verifica si la conexión con la base de datos Exactus está activa
     * @returns true si la conexión está activa, false en caso contrario
     */
    static async healthCheck(): Promise<boolean> {
        try {
            await sequelizeExactus.authenticate();
            return true;
        } catch (error) {
            console.error('Health check fallido para Exactus:', error);
            return false;
        }
    }

    /**
     * Obtiene información de la base de datos
     * @returns Información básica de la base de datos
     */
    static async getDatabaseInfo(): Promise<any> {
        try {
            const result = await this.query(`
                SELECT 
                    DB_NAME() as database_name,
                    @@VERSION as version,
                    @@SERVERNAME as server_name,
                    GETDATE() as current_time
            `);
            return result[0];
        } catch (error) {
            console.error(
                'Error obteniendo información de la base de datos Exactus:',
                error
            );
            throw error;
        }
    }

    /**
     * Ejecuta una transacción en la base de datos Exactus
     * @param callback - Función que contiene las operaciones a ejecutar en la transacción
     * @returns Resultado de la transacción
     */
    static async transaction<T>(
        callback: (transaction: any) => Promise<T>
    ): Promise<T> {
        const transaction = await sequelizeExactus.transaction();
        try {
            const result = await callback(transaction);
            await transaction.commit();
            return result;
        } catch (error) {
            await transaction.rollback();
            console.error('Error en transacción de Exactus:', error);
            throw error;
        }
    }

    /**
     * Cierra la conexión con la base de datos Exactus
     */
    static async close(): Promise<void> {
        try {
            await sequelizeExactus.close();
            console.log('✅ Conexión a Exactus cerrada correctamente');
        } catch (error) {
            console.error('❌ Error cerrando conexión a Exactus:', error);
            throw error;
        }
    }
}
