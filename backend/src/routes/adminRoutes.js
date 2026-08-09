const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

router.use(authMiddleware, adminOnly);

router.get('/orders', adminController.listOrders);
router.patch('/orders/:id/status', adminController.updateOrderStatus);
router.get('/users', adminController.listUsers);
router.get('/dashboard', adminController.dashboard);

module.exports = router;
