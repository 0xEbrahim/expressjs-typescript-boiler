class AppError extends Error {
    public statusCode;
    public status;
    public isOperational;
    constructor(message:string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational=true;
        this.status = `${statusCode}`.startsWith('4') ? "fail" : "error"
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;