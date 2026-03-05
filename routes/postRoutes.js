const express = require('express');
const router = express.Router();
const { 
  getPosts, 
  getPost, 
  createPost, 
  updatePost, 
  deletePost 
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', getPosts);
router.get('/:id', getPost);

// Protected routes
router.post('/', protect, upload.single('image'), createPost);
router.put('/:id', protect, upload.single('image'), updatePost);
router.delete('/:id', protect, deletePost);

module.exports = router;
