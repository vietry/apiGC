

export class CustomError extends Error{

    constructor(
        public readonly statusCode: number = 400,
        public readonly message:string,
    ){
        super(message);
    }
    
    static badRequest(message: string){
        return new CustomError(400, message);
    }
    static unauthorized(message: string){
        return new CustomError(401, message);
    }
    static notFound(message: string){
        return new CustomError(404, message);
    }
    static internalServer(message: string = 'Internal Server error'){
        return new CustomError(500, message);
    }
}