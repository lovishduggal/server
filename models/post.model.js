import mongoose from 'mongoose';

const schema = new mongoose.Schema(
    {
        content: {
            type: String,
            trim: true,
            minlength: 1,
            maxlength: 255,
        },
        image: {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Comment',
            },
        ],
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Like',
            },
        ],
        deleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export const Post = mongoose.model('Post', schema);
