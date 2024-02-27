import { User } from '../models/user.model.js';
import ErrorHandler from '../utils/customErrorClass.js';
import { catchAsyncError } from './catchAsyncError.js';
import jwt from 'jsonwebtoken';

const isAuthenticated = catchAsyncError(async (req, res, next) => {
    const JWT = req.cookies.jwt;
    if (!JWT) return next(new ErrorHandler('Not Logged In', 401));

    const decoded = jwt.verify(JWT, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
});
export { isAuthenticated };
