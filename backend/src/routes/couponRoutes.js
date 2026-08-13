const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', couponController.listMyCoupons);

module.exports = router;
