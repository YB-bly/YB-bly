const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');

// 로그인한 사용자만 접근 가능한 예시 API (마이페이지 등에서 활용)
router.get('/me', authMiddleware, (req, res) => {
  res.json({ id: req.user.id, role: req.user.role });
});

module.exports = router;
