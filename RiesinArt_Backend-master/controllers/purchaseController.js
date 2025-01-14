const Purchase = require('../models/Purchase');
const Product = require('../models/Product');
const User = require('../models/User');

exports.createPurchases = async (req, res) => {
    const purchases = req.body;
  
    try {
      const results = [];
      for (const purchase of purchases) {
        const { buyerId, sellerId, productId } = purchase;
  
        const product = await Product.findById(productId);
        if (!product) {
          results.push({ productId, status: 'failed', message: 'Product not found' });
          continue;
        }
  
          const newPurchase = await Purchase.create({
          buyer: buyerId,
          seller: sellerId,
          product: productId,
        });
  
        results.push({ productId, status: 'success', purchase: newPurchase });
      }
  
      res.status(201).json({
        message: 'Purchase operation completed',
        results,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  exports.getPurchases = async (req, res) => {
    try {
      console.log(req.user); 
  
      const filter = {};
  
      if (req.user.role === 'seller') {
        filter.seller = req.user._id;
      }
  
      if (req.query.sellerId) {
        filter.seller = req.query.sellerId;
      }
  
      const purchases = await Purchase.find(filter)
        .populate('buyer', 'name email')
        .populate('seller', 'name email')
        .populate('product', 'name price description image');
  
      if (purchases.length === 0) {
        return res.status(404).json({ message: 'No purchases found' });
      }
  
      res.status(200).json(purchases);
    } catch (error) {
      console.error('Error in GET Purchases:', error.message);
      res.status(500).json({ message: error.message });
    }
  };
  