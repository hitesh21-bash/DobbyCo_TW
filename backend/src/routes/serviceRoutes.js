const express = require('express');
const router = express.Router();
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');

router.get('/', getServices);
router.get('/:id', getServiceById);
router.post('/', protect, adminMiddleware, createService);
router.put('/:id', protect, adminMiddleware, updateService);
router.delete('/:id', protect, adminMiddleware, deleteService);

module.exports = router;