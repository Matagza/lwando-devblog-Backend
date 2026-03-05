const Post = require('../models/Post');
const { cloudinary } = require('../config/cloudinary');
const { saveLocalFile } = require('../config/localUpload');

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'name').sort({ createdAt: -1 });
    res.json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ success: true, post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { title, subtitle, content, category } = req.body;
    let imageUrl = `https://placehold.co/800x400/2563eb/ffffff?text=${encodeURIComponent(title)}`;
    
    if (req.file) {
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'mock') {
        const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        const uploadResponse = await cloudinary.uploader.upload(fileBase64, { folder: 'newsletter' });
        imageUrl = uploadResponse.secure_url;
      } else {
        imageUrl = `http://localhost:5000${saveLocalFile(req.file)}`;
      }
    }

    const post = await Post.create({
      title, subtitle, content, category,
      image: imageUrl,
      author: req.user.id
    });

    res.status(201).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updateData = { ...req.body };
    if (req.file) {
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'mock') {
        const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        const uploadResponse = await cloudinary.uploader.upload(fileBase64, { folder: 'newsletter' });
        updateData.image = uploadResponse.secure_url;
      } else {
        updateData.image = `http://localhost:5000${saveLocalFile(req.file)}`;
      }
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, post: updatedPost });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await post.deleteOne();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
