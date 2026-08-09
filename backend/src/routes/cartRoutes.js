const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', cartController.getCart);
router.post('/', cartController.addItem);
router.patch('/:id', cartController.updateItem);
router.delete('/:id', cartController.removeItem);

module.exports = router;
