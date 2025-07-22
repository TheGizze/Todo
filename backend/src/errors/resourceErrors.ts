
export class ItemNotFoundError extends Error {
    status: number;

    constructor(message: string){
        super(message);
        this.name = 'ItemNotFoundError';
        this.status = 404
    }
}

export class ListNotFoundError extends Error {
    status: number;

    constructor(message: string){
        super(message);
        this.name = 'ListNotFoundError';
        this.status = 404
    }
}