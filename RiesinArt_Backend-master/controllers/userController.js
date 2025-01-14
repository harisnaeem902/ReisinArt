const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register User
exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, role });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ 
      error: true,
      message: error.message 
    });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({
        error: true,
         message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ 
      error: true,
      message: error.message });
  }
};


exports.getSellersAndBuyers = async (req, res) => {
  try {
    const sellers = await User.find({ role: 'seller' }).select('-password -__v');
    const buyers = await User.find({ role: 'buyer' }).select('-password -__v');
    
    const combined = [
      ...sellers.map(seller => ({ ...seller.toObject(), role: 'seller' })),
      ...buyers.map(buyer => ({ ...buyer.toObject(), role: 'buyer' }))
    ];
    
    res.status(200).json(combined);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


