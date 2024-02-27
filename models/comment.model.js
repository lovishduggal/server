import mongoose from 'mongoose';
const schema = new mongoose.Schema(
    {
        content: {
            type: String,
            trim: true,
            minlength: 1,
            maxlength: 100,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
        },
    },
    { timestamps: true }
);
export const Comment = mongoose.model('Comment', schema);
