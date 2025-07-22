
export class MissingRequiredContent extends Error {
    status: number;

    constructor(message: string){
        super(message);
        this.name = 'MissingRequiredContent';
        this.status = 400
    }
}