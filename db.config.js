import mongoose from 'mongoose';
import { catchAsyncError } from './middlewares/catchAsyncError.js';
export const creatingConnectionWithDB = catchAsyncError(async () => {
    const { connection } = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connecting to ${connection.host}`);
});
