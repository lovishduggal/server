import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import { User } from '../models/user.model.js';
import ErrorHandler from '../utils/customErrorClass.js';
import * as cloudinary from 'cloudinary';

const handleFollow = catchAsyncError(async (req, res, next) => {
    const follower = req.user; // Current user.
    const followerId = req.user._id; // Current user.
    const followedId = req.params.userId; // Get ID of user to follow.

    // Check if already following
    if (follower.following.includes(followedId)) {
        return next(
            new ErrorHandler('You are already following this user', 400)
        );
    }

    // Update both users' followers/following lists
    await User.findByIdAndUpdate(followerId, {
        $push: { following: followedId },
    });
    await User.findByIdAndUpdate(followedId, {
        $push: {
            followers: followerId,
            notifications: followerId,
        },
    });

    return res.status(200).json({ success: true });
});

const handleUnfollow = catchAsyncError(async (req, res, next) => {
    const follower = req.user; // Current user.
    const followerId = req.user._id; // Current user.
    const followedId = req.params.userId; // Get ID of user to follow.

    // Check if already following
    if (!follower.following.includes(followedId)) {
        return next(new ErrorHandler('You are not following this user', 400));
    }

    // Update both users' followers/following lists
    await User.findByIdAndUpdate(followerId, {
        $pull: { following: followedId },
    });
    await User.findByIdAndUpdate(followedId, {
        $pull: {
            followers: followerId,
            notifications: { followerId },
        },
    });
    return res.status(200).json({ success: true });
});

const handleGetUserProfile = catchAsyncError(async (req, res, next) => {
    const userId = req.params.userId;
    const user = await User.findById(userId)
        .populate({
            path: 'posts',
            options: {
                sort: { createdAt: -1 }, // Sort by creation date (newest first)
            },
            populate: [
                {
                    path: 'user',
                    model: 'User',
                },
                {
                    path: 'likes',
                    model: 'Like',
                },
            ],
        })
        .populate('followers')
        .populate('following'); // .populate('posts') will do later...
    if (!user) {
        return next(new ErrorHandler('User not found', 400));
    }

    return res.status(200).json({ success: true, user });
});

const handleGetUserNotifications = catchAsyncError(async (req, res, next) => {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate('notifications'); // .populate('posts') will do later...
    if (!user) {
        return next(new ErrorHandler('User not found', 400));
    }
    return res.status(200).json({ success: true, user });
});

const handleUpdateUserProfile = catchAsyncError(async (req, res, next) => {
    const userId = req.user._id;
    const { name, email, bio, website, interests } = req.body;

    const user = await User.findOne({ _id: userId }).populate({
        path: 'posts',
        options: {
            select: 'image',
            sort: { createdAt: -1 }, // Sort by creation date (newest first)
        },
    });
    if (!user) return next(new ErrorHandler('User not found', 400));

    if (name) user.fullName = name;
    if (email) user.email = email;
    if (bio) user.bio = bio;
    if (website) user.website = website;
    if (interests) user.interests = interests;

    if (user.profilePicture.public_id && user.profilePicture.url)
        await cloudinary.v2.uploader.destroy(user.profilePicture.public_id, {
            resource_type: 'image',
        });
    if (req.file) {
        user.profilePicture.public_id = req.file.filename;
        user.profilePicture.url = req.file.path;
    }

    await user.save();

    return res
        .status(200)
        .json({ success: true, message: 'Profile updated successfully', user });
});
export {
    handleFollow,
    handleUnfollow,
    handleGetUserProfile,
    handleUpdateUserProfile,
    handleGetUserNotifications,
};
