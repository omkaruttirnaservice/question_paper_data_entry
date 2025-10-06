import jwt from 'jsonwebtoken';
import { sendError } from '../application/utils/commonFunctions.js';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticateJWT = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.cookies.token;

        if (!authHeader) {
            return res.status(403).json(sendError(res, null, 'Invalid token'));
        }

        const token = authHeader.replace('Bearer ', '');

        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) return res.status(403).json(sendError(res, err, 'Invalid token'));
            req.user = user;
            next();
        });
    } catch (error) {
        console.log(error, '==');
    }
};
