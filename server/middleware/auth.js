const jwt = require('jsonwebtoken');
const {UNAUTHORIZED, FORBIDDEN} = require("../config/statusCode");

const authMiddleware = (roles = []) => {
    return (req, res, next) => {
        // const token = req.header('Authorization')?.replace('Bearer ', '');
        const token = req.cookies.accessToken
        console.log(token)
        if (!token) {
            return res.error('No token, authorization denied', UNAUTHORIZED);
        }

        try {
            req.user = jwt.verify(token, process.env.JWT_SECRET);

            if (roles.length && !roles.includes(req.user.role)) {
                return res.error('Access denied', FORBIDDEN);
            }
            next();
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.error("Token expired", UNAUTHORIZED, error);
            }
            res.error('Invalid token', UNAUTHORIZED, error);
        }
    };
};

module.exports = authMiddleware;