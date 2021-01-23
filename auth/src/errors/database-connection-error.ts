import CustomError from "./custom-error";
export default class DatabaseConnectionError extends CustomError {
    reason = 'Error connecting to database'
    statusCode = 500;
    constructor() {
        super('Error conneting to database.');
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
    }
    serializeErrors() {
        return [
            { message: this.reason }
        ]
    }
}
