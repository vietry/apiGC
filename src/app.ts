import { envs } from "./config/envs";
import { SqlServerDatabase } from "./data";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";


(() => {
    main();
})();

async function main(){

    await SqlServerDatabase.connect({
        user:     envs.SQLSERVER_USER, 
        password: envs.SQLSERVER_PASSWORD,  
        server:   envs.SQLSERVER_SERVER,
        database: envs.SQLSERVER_DB_NAME, 
    })

    const server = new Server({
        port: envs.PORT,
        public_path: envs.PUBLIC_PATH,
        routes: AppRoutes.routes,
    }
    );

    server.start();
}