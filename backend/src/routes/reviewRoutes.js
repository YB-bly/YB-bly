const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/product/:productId', reviewController.listByProduct); // 공개 조회
router.post('/', authMiddleware, reviewController.create);
router.delete('/:id', authMiddleware, reviewController.remove);

module.exports = router;
