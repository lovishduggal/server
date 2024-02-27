import { Router } from 'express';
import {
    handleUploadPost,
    handleGetAllPosts,
    handleGetPost,
    handleUpdatePost,
    handleDeletePost,
} from '../controllers/post.controller.js';
import { upload } from '../middlewares/multer.js';
const router = Router();

router.get('/', handleGetAllPosts); //* Get all posts
router.get('/:id', handleGetPost); //* Get single post //Pending on frontend
router.post('/', upload.single('image'), handleUploadPost); //* Upload post
router.put('/:id', handleUpdatePost); //* Update post
router.delete('/:id', handleDeletePost); //* Delete post
export default router;
