
export class MissingValuesError extends Error {
    status: number;
    missingValues: string[]

    constructor(message: string, missingValues: string[]){
        super(message);
        this.missingValues = missingValues;
        this.name = 'MissingValuesError';
        this.status = 400
    }
}
// {message: 'request body missing values', missingValues: values})