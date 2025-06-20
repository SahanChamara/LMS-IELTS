const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    res.error(
        err.message || 'Internal server error',
        err.status || 500,
        process.env.NODE_ENV === 'development' ? err.stack : null
    );
};

module.exports = errorHandler;