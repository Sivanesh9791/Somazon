const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  getAllUsers,
  deleteUser,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/userController');

// Get all users (Admin only)
router.get('/', protect, adminOnly, getAllUsers);

// Delete a user (Admin only)
router.delete('/:id', protect, adminOnly, deleteUser);

// Get user profile
router.get('/profile', protect, getUserProfile);

// Update user profile
router.put('/profile', protect, updateUserProfile);

module.exports = router;
