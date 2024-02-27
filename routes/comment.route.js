import { Router } from 'express';
import {
    handleCreateComment,
    handleDeleteComment,
    handleGetAllComments,
    handleUpdateComment,
} from '../controllers/comment.controller.js';
const router = Router();

router.get('/:postId', handleGetAllComments); //* Get all comments of specific post.
router.post('/:postId', handleCreateComment); //* Create comment
router.put('/:postId/:commentId', handleUpdateComment); //* I haven't implemented this feature on frontend.
router.delete('/:postId/:commentId', handleDeleteComment); //* Delete comment
export default router;
