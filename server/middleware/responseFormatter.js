const responseFormatter = () => {
    return (req, res, next) => {
        // Success Response
        res.success = (data, message = "Operation Successful", statusCode = 200) => {
            res.status(statusCode).json({
                success: true,
                status: statusCode,
                message,
                data
            });
        };

        // Error Response
        res.error = (message = 'An Error Occurred', statusCode = 500, errorDetails = null) => {
            const response = {
                success: false,
                status: statusCode,
                message
            };

            if (errorDetails) {
                response.error = errorDetails;
            }

            res.status(statusCode).json(response);
        };

        next();
    };
};

module.exports  = responseFormatter;