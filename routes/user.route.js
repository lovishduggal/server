import { Router } from 'express';
import {
    handleFollow,
    handleUnfollow,
    handleGetUserProfile,
    handleUpdateUserProfile,
    handleGetUserNotifications,
} from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.js';
const router = Router();

router.get('/:userId', handleGetUserProfile); //* Get user profile //* This help you for enable / disable the edit functionality
router.get('/notifications/:userId', handleGetUserNotifications); // Get notifications
router.post('/follow/:userId', handleFollow); //* Follow user
router.post('/unfollow/:userId', handleUnfollow); //* Unfollow user
router.put('/me', upload.single('image'), handleUpdateUserProfile); //* Update user profile

export default router;
