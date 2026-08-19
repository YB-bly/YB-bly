const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');
const { authMiddleware, issueCsrfToken } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);

router.get('/csrf-token', (req, res) => {
  issueCsrfToken(res);
  res.json({ message: 'CSRF 토큰이 발급되었습니다.' });
});

module.exports = router;