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

const { vulnAuthMiddleware, attachUserIfPresent, vulnAdminOnly } = require('./vulnAuthMiddleware');
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
// 🚩 주문 생성만 attachUserIfPresent(서명 미검증)를 사용 - GET들은 정상 검증(vulnAuthMiddleware)을 씀
//    라우트 파일까지 직접 봐야 "왜 이 API만 다른 미들웨어를 쓰지?"가 드러남
orderRouter.post('/', attachUserIfPresent, vulnCreateOrder); // 🚩 서명 검증 누락 + 쿠폰 로직 결함
orderRouter.get('/', vulnAuthMiddleware, myOrders);
orderRouter.get('/:id', vulnAuthMiddleware, vulnOrderDetail); // 🚩 IDOR
router.use('/orders', orderRouter);

// ---- 리뷰: 목록 조회 시 orderId 노출 (IDOR 발견 경로) ----
const reviewRouter = express.Router();
reviewRouter.get('/product/:productId', vulnListByProduct); // 🚩 orderId 노출
reviewRouter.post('/', authMiddleware, reviewController.create);
reviewRouter.delete('/:id', authMiddleware, reviewController.remove);
router.use('/reviews', reviewRouter);

// ---- 관리자: 대시보드만 권한 검사 누락 ----
const adminRouter = express.Router();
adminRouter.get('/orders', authMiddleware, adminOnly, adminController.listOrders);
adminRouter.patch('/orders/:id/status', authMiddleware, adminOnly, adminController.updateOrderStatus);
adminRouter.get('/users', authMiddleware, adminOnly, adminController.listUsers);
adminRouter.get('/dashboard', vulnAuthMiddleware, adminController.dashboard); // 🚩 adminOnly 없음
router.use('/admin', adminRouter);

module.exports = router;