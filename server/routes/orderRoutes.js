const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getAllOrders,
} = require('../controllers/orderController');

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);
router.get('/', protect, adminOnly, getAllOrders);

module.exports = router;
