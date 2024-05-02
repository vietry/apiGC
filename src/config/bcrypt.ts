    import { compareSync, genSaltSync, hashSync } from 'bcryptjs';



    export class BcryptAdapter{

        static hash( password: string): string{
            const salt = genSaltSync();
            return hashSync(password, salt) 
        }

        static compare(password: string, hashed: string): boolean{
            return compareSync(password, hashed);
        }


    }


