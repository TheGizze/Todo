
export class InvalidItemContentError extends Error {
    status: number;

    constructor(message: string){
        super(message);
        this.name = 'InvalidItemContentError';
        this.status = 400
    }
}

export class InvalidListNameError extends Error {
    status: number;

    constructor(message: string){
        super(message);
        this.name = 'InvalidListNameError';
        this.status = 400
    }
}