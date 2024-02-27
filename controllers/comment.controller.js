import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import { Comment } from '../models/comment.model.js';
import { Post } from '../models/post.model.js';
import ErrorHandler from '../utils/customErrorClass.js';

const handleCreateComment = catchAsyncError(async (req, res, next) => {
    const postId = req.params.postId; // Get ID of the post
    const userId = req.user._id; // Get ID of current user
    const { content } = req.body;

    const existingPost = await Post.findById(postId);
    if (!existingPost) {
        return next(new ErrorHandler('Post not found', 404));
    }

    const newComment = await Comment.create({
        content,
        user: userId,
        post: postId,
    });

    await existingPost.updateOne({ $push: { comments: newComment._id } });

    return res.status(201).json({
        success: true,
        message: 'Comment posted',
        newComment,
    });
});

const handleGetAllComments = catchAsyncError(async (req, res) => {
    const postId = req.params.postId; // Get ID of the post
    const comments = await Comment.find({ post: postId }).populate('user'); // Populate all info of user
    return res.status(200).json({
        success: true,
        comments,
    });
});

const handleUpdateComment = catchAsyncError(async (req, res, next) => {
    const postId = req.params.postId; // Get ID of the post
    const commentId = req.params.commentId; // Get ID of the comment
    const { content } = req.body;
    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { content },
        { new: true }
    );
    if (!updatedComment || updatedComment.post.toString() !== postId) {
        // Ensure comment belongs to post
        return next(new ErrorHandler('Comment not found', 404));
    }
    return res.status(200).json({
        success: true,
        updatedComment,
    });
});

const handleDeleteComment = catchAsyncError(async (req, res, next) => {
    const postId = req.params.postId; // Get ID of the post
    const commentId = req.params.commentId; // Get ID of the comment
    const comment = await Comment.findById(commentId);

    if (!comment || comment.post.toString() !== postId) {
        // Ensure comment belongs to post
        return next(new ErrorHandler('Comment not found', 404));
    }

    await comment.deleteOne();

    await Post.findByIdAndUpdate(postId, {
        $pull: { comments: commentId }, // Remove comment ID from post's comments array
    });

    return res.status(200).json({
        success: true,
        message: 'Comment deleted successfully',
        deletedComment: comment,
    });
});
export {
    handleCreateComment,
    handleGetAllComments,
    handleUpdateComment,
    handleDeleteComment,
};
