const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ success:false, error:'No token' });

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ success:false, error:'Invalid token' });
    req.user = { id: user._id, name: user.name, email: user.email, role: user.role };
    next();
  } catch (err) {
    res.status(401).json({ success:false, error:'Token invalid/expired' });
  }
};