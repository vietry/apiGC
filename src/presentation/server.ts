import express, { Router } from 'express';
import fileUpload from 'express-fileupload';
import compression from 'compression';
import path from 'path';
import ngrok from '@ngrok/ngrok';
import { envs } from '../config';

interface Options {
    port: number;
    routes: Router;
    public_path: string;
}

export class Server{

    public readonly app = express();
    private serverListener?: any;
    private readonly port: number;
    private readonly publicPath: string;
    private readonly routes: Router;


    constructor(options: Options){
        const {port, routes, public_path = 'public' } = options;
        this.port = port;
        this.publicPath = public_path;
        this.routes = routes;
    }

    async start(){


        //* Middlewares

        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true})); //x-www-form-urlencoded
        this.app.use(compression());

        this.app.use(fileUpload({
            limits: { fileSize: 50 * 1024 * 1024 },
          }));

        //* Public Folder
        this.app.use(express.static(this.publicPath));


        //* Routes
        this.app.use(this.routes);


        //* SPA
        this.app.get('*', (req, res) =>{
            const indexPath = path.join(__dirname + `../../../${this.publicPath}/v1/index.html`);
            res.sendFile(indexPath);
            
        })
        
        this.serverListener = this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });

        // Inicia ngrok y expone el servidor local a la web
        /*await ngrok.connect({ addr: this.port, authtoken: envs.NGROK_TOKEN})
        .then(listener => console.log(`Ingress established at: ${listener.url()}`))*/

    }

    public close(){
        this.serverListener?.close();
        //ngrok.disconnect();
    }

}