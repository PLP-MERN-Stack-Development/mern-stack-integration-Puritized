const Category = require('../models/Category');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ success: true, data: categories });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(422).json({ success:false, error:'Name is required' });
    const exists = await Category.findOne({ name });
    if (exists) return res.status(409).json({ success:false, error:'Category exists' });

    const category = await Category.create({ name });
    res.status(201).json({ success:true, data: category });
  } catch (err) { next(err); }
};