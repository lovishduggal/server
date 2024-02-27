import express from 'express';
import { config } from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import postRouter from './routes/post.route.js';
import commentRouter from './routes/comment.route.js';
import likeRouter from './routes/like.route.js';
import { ErrorMiddleware } from './middlewares/error.js';
import { isAuthenticated } from './middlewares/auth.js';
import cors from 'cors';

const app = express();

//* Loads environment variables from a .env file into process.env.
config({
    path: '.env',
});

//* Middleware for handling CORS, JSON, URL-encoded data, cookies and logging HTTP requests.
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

//* Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', isAuthenticated, userRouter);
app.use('/api/v1/post', isAuthenticated, postRouter);
app.use('/api/v1/comment', isAuthenticated, commentRouter);
app.use('/api/v1/like', isAuthenticated, likeRouter);

app.get('/', (req, res) => {
    return res.send('<h1>Server is working!!</h1>');
});
app.use(ErrorMiddleware);

export default app;
