import { Router } from 'express';
import {
    handleGetAllLikes,
    handleLikePost,
    handleUnLikePost,
} from '../controllers/like.controller.js';
const router = Router();

router.get('/:postId', handleGetAllLikes); //* Get all likes of specific post.
router.post('/:postId', handleLikePost); //* Like a post.
router.delete('/:postId', handleUnLikePost); //* Unlike a post.
export default router;
