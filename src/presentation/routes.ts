import { Router } from 'express';

import { AuthRoutes } from './auth/routes';
import { ColaboradorRoutes } from './usuarios/colaborador/routes';
import { GteRoutes } from './usuarios/gte/routes';
import { PuntoContactoRoutes } from './puntos-contacto/routes';
import { ContactoPuntoRoutes } from './contactos-punto/routes';
import { DemoplotRoutes } from './demoplots/routes';
import { FileUploadRoutes } from './file-upload/routes';
import { ImageRoutes } from './images/routes';
import { FotoDemoplotRoutes } from './fotos-demoplot/routes';
import { UsuarioRoutes } from './usuarios/routes';
import { CultivoRoutes } from './cultivos/routes';
import { BlancoBiologicoRoutes } from './blancos/routes';
import { ArticuloRoutes } from './articulos/routes';
import { VegetacionRoutes } from './vegetacion/routes';
import { DistritoRoutes } from './distritos/routes';
import { VariedadRoutes } from './variedades/routes';
import { ProvinciaRoutes } from './provincias/routes';

import { FamiliaRoutes } from './familias/routes';
import { FundoRoutes } from './fundos/routes';
import { PuntoUbigeoRoutes } from './puntos-ubigeos/routes';
import { CharlaRoutes } from './charla/routes';
import { AsistenciaRoutes } from './asistencias/routes';
import { FotoCharlaRoutes } from './fotos-charla/routes';
import { CharlaProductoRoutes } from './charla-producto/routes';
import { DashboardRoutes } from './dashboards/routes';
import { SubZonaRoutes } from './subzonas/routes';
import { ZonaAnteriorRoutes } from './zona-anterior/routes';
import { RegistroLaboralGdRoutes } from './registro-laboral-gd/routes';
import { CostoLaboralRoutes } from './costo-laboral/routes';
import { VariablePersonalRoutes } from './variable-personal/routes';
import { ExternoRoutes } from './externos/routes';
import { VisitaRoutes } from '../visitas_gc/routes/visita.routes';
import { EntregaMuestrasRoutes } from '../demoplots_gc/routes/entrega-muestras.routes';
import { ConsumoMuestrasRoutes } from '../demoplots_gc/routes/consumo-muestras.routes';
import { FotoUsuarioRoutes } from '../common/routes/foto_usuario.routes';
import { VisitaGteTiendaRoutes } from '../demoplots_gc/routes/visita-gte-tienda.routes';
import { FotoRoutes } from '../common/routes/foto.routes';
import { LaborVisitaRoutes } from '../visitas_gc/routes/labor-visita.routes';

export class AppRoutes {
    static get routes(): Router {
        const router = Router();

        router.use('/api/auth', AuthRoutes.routes);
        router.use('/api/usuarios', UsuarioRoutes.routes);
        router.use('/api/colaboradores', ColaboradorRoutes.routes);
        router.use('/api/gtes', GteRoutes.routes);
        router.use('/api/puntoscontacto', PuntoContactoRoutes.routes);
        router.use('/api/contactospuntos', ContactoPuntoRoutes.routes);
        router.use('/api/demoplots', DemoplotRoutes.routes);
        router.use('/api/dashboards', DashboardRoutes.routes);
        router.use('/api/upload', FileUploadRoutes.routes);
        router.use('/api/carga/', FotoUsuarioRoutes.routes);
        router.use('/api/images', ImageRoutes.routes);
        router.use('/api/fotosdemoplots', FotoDemoplotRoutes.routes);
        router.use('/api/cultivos', CultivoRoutes.routes);
        router.use('/api/blancos', BlancoBiologicoRoutes.routes);
        router.use('/api/articulos', ArticuloRoutes.routes);
        router.use('/api/vegetacion', VegetacionRoutes.routes);
        router.use('/api/variedades', VariedadRoutes.routes);
        router.use('/api/distritos', DistritoRoutes.routes);
        router.use('/api/provincias', ProvinciaRoutes.routes);
        router.use('/api/familias', FamiliaRoutes.routes);
        router.use('/api/fundos', FundoRoutes.routes);
        router.use('/api/puntosubigeos', PuntoUbigeoRoutes.routes);
        router.use('/api/subzonas', SubZonaRoutes.routes);
        router.use('/api/zonasanteriores', ZonaAnteriorRoutes.routes);
        router.use('/api/charlas', CharlaRoutes.routes);
        router.use('/api/asistencias', AsistenciaRoutes.routes);
        router.use('/api/fotoscharlas', FotoCharlaRoutes.routes);
        router.use('/api/charlaproductos', CharlaProductoRoutes.routes);
        router.use('/api/registroslaborales', RegistroLaboralGdRoutes.routes);
        router.use('/api/costoslaborales', CostoLaboralRoutes.routes);
        router.use('/api/variables', VariablePersonalRoutes.routes);
        router.use('/api/externos', ExternoRoutes.routes);
        router.use('/api/visitas', VisitaRoutes.routes);
        router.use('/api/muestras/consumo', ConsumoMuestrasRoutes.routes);
        router.use('/api/muestras/entrega', EntregaMuestrasRoutes.routes);
        router.use('/api/visitas-gte-tienda', VisitaGteTiendaRoutes.routes);
        router.use('/api/fotos', FotoRoutes.routes);
        router.use('/api/labores-visita', LaborVisitaRoutes.routes);

        return router;
    }
}
