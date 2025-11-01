const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ success:false, errors: errors.array() });

    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ success:false, error:'Email already in use' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ success:true, data: { user: { id: user._id, name: user.name, email: user.email }, token }});
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success:false, error:'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ success:false, error:'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ success:true, data: { user: { id: user._id, name: user.name, email: user.email }, token }});
  } catch (err) { next(err); }
};