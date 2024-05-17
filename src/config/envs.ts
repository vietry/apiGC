import 'dotenv/config';
import {get} from 'env-var';


export const envs = {
    PORT: get('PORT').required().asPortNumber(),
    PUBLIC_PATH: get('PUBLIC_PATH').default('public').asString(),

    SQLSERVER_DB_NAME: get('SQLSERVER_DB_NAME').required().asString(),
    SQLSERVER_USER: get('SQLSERVER_USER').required().asString(),
    SQLSERVER_PASSWORD: get('SQLSERVER_PASSWORD').required().asString(),
    SQLSERVER_SERVER: get('SQLSERVER_SERVER').required().asString(),
    SQLSERVER_PORT: get('SQLSERVER_PORT').required().asString(),

    JWT_SEED:  get('JWT_SEED').required().asString() ,

    SEND_EMAIL: get('SEND_EMAIL').default('false').asBool(),
    MAILER_SERVICE: get('MAILER_SERVICE').required().asString(),
    MAILER_EMAIL: get( 'MAILER_EMAIL' ).required().asString(),
    MAILER_SECRET_KEY: get('MAILER_SECRET_KEY').required().asString(),

    WEBSERVICE_URL: get( 'WEBSERVICE_URL' ).required().asString(),
    NGROK_TOKEN: get('NGROK_TOKEN').required().asString(),
}

