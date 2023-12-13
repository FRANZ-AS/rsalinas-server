
export class HTTPError extends Error {
    statusCode;
    message;
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
    }
}

export const handleErrorMiddleware = (err, _req, res, _next) => {
    if (err instanceof HTTPError) {
        return res.status(err.statusCode).json({
            status: 'error',
            statusCode: err.statusCode,
            message: err.message,
        });
    } else {
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: err.message || 'Internal Server Error',
        });
    }
}