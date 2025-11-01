const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
const auth = require('../middleware/auth');
const multer = require('multer');
const { body } = require('express-validator');
const path = require('path');
const fs = require('fs');

// multer setup
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random()*1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// public endpoints
router.get('/', postsController.getAllPosts);
router.get('/:id', postsController.getPost);
router.get('/search', (req,res)=>res.send('use /?q=...'));

// protected endpoints
router.post('/', auth, upload.single('featuredImage'), [
  body('title').notEmpty().withMessage('Title required'),
  body('content').notEmpty().withMessage('Content required'),
  body('category').notEmpty().withMessage('Category required')
], postsController.createPost);

router.put('/:id', auth, upload.single('featuredImage'), postsController.updatePost);
router.delete('/:id', auth, postsController.deletePost);

// comments
router.post('/:id/comments', auth, postsController.addComment);

module.exports = router;