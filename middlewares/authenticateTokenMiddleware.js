import jwt from "jsonwebtoken";

export const authenticateTokenMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({
            error: "No token provided"
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).send({
            error: "No token provided"
        });
    }

    jwt.verify(token, process.env.APP_JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                error: "Invalid token",
                details: err.message,
            });
        }

        req.user = {user_id: decoded.user_id};
        next();
    });
};
