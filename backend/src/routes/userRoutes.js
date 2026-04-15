const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUserProfile,
  addPet,
  getUserPets,
  deleteUser,
  getUserStats
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');

router.get('/', protect, adminMiddleware, getUsers);
router.get('/stats', protect, adminMiddleware, getUserStats);
router.get('/pets', protect, getUserPets);
router.put('/profile', protect, updateUserProfile);
router.post('/pets', protect, addPet);
router.get('/:id', protect, adminMiddleware, getUserById);
router.delete('/:id', protect, adminMiddleware, deleteUser);

module.exports = router;