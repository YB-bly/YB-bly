const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

// 공개 (로그인 없이도 조회 가능)
router.get('/', productController.list);
router.get('/search', productController.search);
router.get('/:id', productController.detail);

// 관리자 전용
router.post('/', authMiddleware, adminOnly, productController.create);
router.put('/:id', authMiddleware, adminOnly, productController.update);
router.delete('/:id', authMiddleware, adminOnly, productController.remove);
router.patch('/:id/stock', authMiddleware, adminOnly, productController.updateStock);

module.exports = router;
