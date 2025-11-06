import { Router } from 'express';
import { DireccionEntregaController } from '../controllers/direccion-entrega.controller';

const router = Router();

/**
 * @route GET /api/direcciones-entrega/all
 * @desc Obtiene direcciones de entrega de todos los esquemas
 * @query cliente - Código del cliente (opcional)
 * @access Public
 * @example
 * GET /api/direcciones-entrega/all
 * GET /api/direcciones-entrega/all?cliente=CLI001
 */
router.get('/all', DireccionEntregaController.findDireccionesInAllSchemas);

/**
 * @route GET /api/direcciones-entrega/estadisticas/consolidadas
 * @desc Obtiene estadísticas consolidadas de todos los esquemas
 * @access Public
 * @example GET /api/direcciones-entrega/estadisticas/consolidadas
 */
router.get(
    '/estadisticas/consolidadas',
    DireccionEntregaController.getEstadisticasConsolidadas
);

/**
 * @route GET /api/direcciones-entrega/:schema
 * @desc Obtiene todas las direcciones de entrega por esquema específico
 * @param schema - Esquema de la base de datos (tqc, TALEX, BIOGEN, AGRAVENT)
 * @access Public
 * @example GET /api/direcciones-entrega/tqc
 */
router.get(
    '/:schema',
    DireccionEntregaController.getDireccionesEntregaBySchema
);

/**
 * @route GET /api/direcciones-entrega/:schema/estadisticas
 * @desc Obtiene estadísticas de direcciones de entrega por esquema
 * @param schema - Esquema de la base de datos (tqc, TALEX, BIOGEN, AGRAVENT)
 * @access Public
 * @example GET /api/direcciones-entrega/tqc/estadisticas
 */
router.get(
    '/:schema/estadisticas',
    DireccionEntregaController.getEstadisticasDirecciones
);

/**
 * @route GET /api/direcciones-entrega/:schema/cliente/:clienteCode
 * @desc Obtiene direcciones de entrega de un cliente específico en un esquema
 * @param schema - Esquema de la base de datos (tqc, TALEX, BIOGEN, AGRAVENT)
 * @param clienteCode - Código del cliente
 * @access Public
 * @example GET /api/direcciones-entrega/tqc/cliente/CLI001
 */
router.get(
    '/:schema/cliente/:clienteCode',
    DireccionEntregaController.getDireccionesEntregaByCliente
);

/**
 * @route GET /api/direcciones-entrega/:schema/detalle/:detalleId
 * @desc Obtiene una dirección de entrega específica por su ID
 * @param schema - Esquema de la base de datos (tqc, TALEX, BIOGEN, AGRAVENT)
 * @param detalleId - ID del detalle de dirección
 * @access Public
 * @example GET /api/direcciones-entrega/tqc/detalle/DIR001
 */
router.get(
    '/:schema/detalle/:detalleId',
    DireccionEntregaController.getDireccionEntregaById
);

export { router as direccionEntregaRoutes };
