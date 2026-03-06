import { PrismaClient } from '@prisma/client';

// Singleton: una única instancia de PrismaClient para toda la app
// Evita agotar el connection pool creando múltiples instancias
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log:
            process.env.NODE_ENV === 'development'
                ? ['warn', 'error']
                : ['error'],
    });

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

// Monitoreo del pool de conexiones: log periódico para detectar problemas
const POOL_MONITOR_INTERVAL = 5 * 60 * 1000; // cada 5 minutos
setInterval(() => {
    const mem = process.memoryUsage();
    console.log(
        `[Prisma Pool Monitor] Heap: ${(mem.heapUsed / 1024 / 1024).toFixed(
            1
        )}MB / ${(mem.heapTotal / 1024 / 1024).toFixed(1)}MB`
    );
}, POOL_MONITOR_INTERVAL).unref();

// Manejo de desconexión limpia al cerrar la app
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});
