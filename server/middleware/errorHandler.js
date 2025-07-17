const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.stack);

    // Handle SyntaxError from body-parser
    const statusCode = err.status || (err instanceof SyntaxError && err.status === 400 ? 400 : 500);
    const message = err.message || 'Internal server error';
    const stack = process.env.NODE_ENV === 'development' ? err.stack : null;

    res.status(statusCode).json({
        success: false,
        result: message,
        error: stack,
    });
};

module.exports = errorHandler;