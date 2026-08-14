const express = require('express');
const router = express.Router();

const authRoutes = require('../routes/authRoutes');
const cartRoutes = require('../routes/cartRoutes');
const userRoutes = require('../routes/userRoutes');
const wishlistRoutes = require('../routes/wishlistRoutes');
const couponRoutes = require('../routes/couponRoutes');
const productController = require('../controllers/productController');
const adminController = require('../controllers/adminController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

const { unsignedAdminStatisticsOnly } = require('./vulnAuthMiddleware');
const { vulnSearch } = require('./vulnProductController');
const { vulnListByProduct } = require('./vulnReviewController');
const { vulnCreateOrder, myOrders, vulnOrderDetail } = require('./vulnOrderController');
const reviewController = require('../controllers/reviewController');

// 회원가입/로그인/로그아웃, 장바구니, 회원정보는 그대로 정상 버전 사용
router.use('/auth', authRoutes);
router.use('/cart', cartRoutes);
router.use('/users', userRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/coupons', couponRoutes);

// ---- 상품: 검색만 취약 버전으로 교체 ----
const productRouter = express.Router();
productRouter.get('/', productController.list);
productRouter.get('/search', vulnSearch); // 🚩 SQL Injection
productRouter.get('/:id', productController.detail);
productRouter.post('/', authMiddleware, adminOnly, productController.create);
productRouter.put('/:id', authMiddleware, adminOnly, productController.update);
productRouter.delete('/:id', authMiddleware, adminOnly, productController.remove);
productRouter.patch('/:id/stock', authMiddleware, adminOnly, productController.updateStock);
router.use('/products', productRouter);

// ---- 주문 ----
const orderRouter = express.Router();
orderRouter.post('/', authMiddleware, vulnCreateOrder); // 🚩 쿠폰 로직 결함
orderRouter.get('/', authMiddleware, myOrders);
orderRouter.get('/:id', authMiddleware, vulnOrderDetail); // 🚩 IDOR
router.use('/orders', orderRouter);

// ---- 리뷰: 목록 조회 시 orderId 노출 (IDOR 발견 경로) ----
const reviewRouter = express.Router();
reviewRouter.get('/product/:productId', vulnListByProduct); // 🚩 orderId 노출
reviewRouter.post('/', authMiddleware, reviewController.create);
reviewRouter.delete('/:id', authMiddleware, reviewController.remove);
router.use('/reviews', reviewRouter);

// ---- 관리자: 주문 통계 API만 JWT 서명 검증 누락 ----
const adminRouter = express.Router();
adminRouter.get('/orders', authMiddleware, adminOnly, adminController.listOrders);
adminRouter.patch('/orders/:id/status', authMiddleware, adminOnly, adminController.updateOrderStatus);
adminRouter.get('/users', authMiddleware, adminOnly, adminController.listUsers);
adminRouter.get('/dashboard', authMiddleware, adminOnly, adminController.dashboard);
adminRouter.get(
  '/order-statistics',
  unsignedAdminStatisticsOnly, // 🚩 payload만 신뢰하고 서명/iss/aud 미검증
  adminController.orderStatistics
);
router.use('/admin', adminRouter);

module.exports = router;
