const Post = require('../models/Post');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

// GET /api/posts
exports.getAllPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);
    const category = req.query.category;
    const search = req.query.q;

    const filter = {};
    if (category && mongoose.Types.ObjectId.isValid(category)) filter.category = category;
    if (search) filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } }
    ];

    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .populate('author', 'name email')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ success: true, data: posts, page, limit, total });
  } catch (err) { next(err); }
};

// GET /api/posts/:id
exports.getPost = async (req, res, next) => {
  try {
    const idOrSlug = req.params.id;
    let post;
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      post = await Post.findById(idOrSlug).populate('author', 'name').populate('category', 'name');
    } else {
      post = await Post.findOne({ slug: idOrSlug }).populate('author', 'name').populate('category', 'name');
    }
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });

    // increment view count (non-blocking)
    post.viewCount += 1;
    post.save().catch(()=>{});

    res.json({ success: true, data: post });
  } catch (err) { next(err); }
};

// POST /api/posts
exports.createPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ success:false, errors: errors.array() });

    const payload = {
      title: req.body.title,
      content: req.body.content,
      author: req.user.id,
      category: req.body.category,
      tags: req.body.tags || [],
      isPublished: req.body.isPublished || false,
    };

    if (req.file) {
      payload.featuredImage = `/uploads/${req.file.filename}`;
    }

    const post = await Post.create(payload);
    res.status(201).json({ success: true, data: post });
  } catch (err) { next(err); }
};

// PUT /api/posts/:id
exports.updatePost = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success:false, error:'Invalid ID' });

    const updates = {};
    ['title','content','category','tags','isPublished','excerpt'].forEach(k => {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    });
    if (req.file) updates.featuredImage = `/uploads/${req.file.filename}`;

    const post = await Post.findByIdAndUpdate(id, updates, { new: true });
    if (!post) return res.status(404).json({ success:false, error:'Post not found' });

    res.json({ success:true, data: post });
  } catch (err) { next(err); }
};

// DELETE /api/posts/:id
exports.deletePost = async (req, res, next) => {
  try {
    const id = req.params.id;
    const post = await Post.findByIdAndDelete(id);
    if (!post) return res.status(404).json({ success:false, error:'Post not found' });
    res.json({ success:true, message: 'Post deleted' });
  } catch (err) { next(err); }
};

// POST /api/posts/:id/comments
exports.addComment = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { content } = req.body;
    if (!content) return res.status(400).json({ success:false, error:'Comment content required' });

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ success:false, error:'Post not found' });

    post.comments.push({ user: req.user.id, content });
    await post.save();
    res.status(201).json({ success:true, data: post });
  } catch (err) { next(err); }
};