export default class ApplicationError extends Error {
    public statusCode: number;
    public errorType: string;
    public isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.errorType = `${statusCode}`.startsWith('4') ? 'client error' : 'server error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}
