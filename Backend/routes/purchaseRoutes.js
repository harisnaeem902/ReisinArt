const express = require('express');
const { createPurchases, getPurchases } = require('../controllers/purchaseController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Protect the route so that only authenticated users can access it
router.post('/', protect, createPurchases);
router.get('/', protect, getPurchases);  // Ensure protect middleware is used here

module.exports = router;
