
export class MissingValuesError extends Error {
    status: number;

    constructor(message: string){
        super(message);
        this.name = 'MissingValuesError';
        this.status = 400
    }
}