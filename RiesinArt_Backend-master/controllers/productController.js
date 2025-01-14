const Product = require('../models/Product');

exports.addProduct = async (req, res) => {
  const { name, price, description, quantity } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    const product = await Product.create({
      name,
      price,
      description,
      image,
      quantity, 
      seller: req.user._id,
});
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProducts = async (req, res) => {
    try {
      let products;
  
      if (req.user.role === 'seller') {
        products = await Product.find({ seller: req.user._id });
      } else if (req.user.role === 'buyer' || req.user.role === 'admin') {
        products = await Product.find().populate('seller', 'name email role');
      } else {
        return res.status(403).json({ message: 'Access denied' });
      }
  
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
