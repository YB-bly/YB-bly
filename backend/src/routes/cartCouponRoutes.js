const express = require('express');
const router = express.Router();
const cartCouponController = require('../controllers/cartCouponController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/apply', cartCouponController.applyCartCoupon);
router.get('/summary', cartCouponController.getCartCouponSummary);

module.exports = router;
