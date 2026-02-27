import dotenv from 'dotenv';
import express, { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import upload from 'express-fileupload';
import indexRoutes from './routes/indexRoutes.js';
import cors from 'cors';
import morgan from 'morgan';

const app = express();

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

dotenv.config();

app.use(upload());

app.use(
    cors({
        origin: function (origin, callback) {
            // allow non-browser tools like Postman
            if (!origin || origin === 'null') return callback(null, true);

            const allowedOrigins = [
                'https://psa.atomtech.in',
                'kopbankasso',
                'sznsbal',
                'uttirna',
                'localhost',
                '192',
                '10',
            ];

            if (allowedOrigins.some((allowedOrigin) => origin.includes(allowedOrigin))) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }),
);

// IMPORTANT: allow preflight requests
app.options('*', cors());

app.use(json({ limit: '1024mb' }));
app.use(urlencoded({ extended: true, limit: '1024mb' }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('API is running....');
});

app.use('/api', indexRoutes);

app.use((err, req, res, next) => {
    console.error(err);
});

app.listen(process.env.PORT, () => {
    console.log('Server started on', process.env.PORT);
});
