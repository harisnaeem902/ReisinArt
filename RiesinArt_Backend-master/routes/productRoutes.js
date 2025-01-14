const express = require('express');
const { addProduct, getProducts } = require('../controllers/productController');
const { protect, sellerOnly } = require('../middleware/authMiddleware');
const multer = require('multer');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', protect, sellerOnly, upload.single('image'), addProduct);
router.get('/', protect, getProducts);

module.exports = router;
