const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = require('../models/Post');
const User = require('../models/User');

router.get('/status', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    const postCount = await Post.countDocuments();
    const userCount = await User.countDocuments();
    const latestPosts = await Post.find().limit(5).sort({ createdAt: -1 }).populate('author', 'name');

    res.json({
      status: 'success',
      database: {
        state: dbStatus,
        name: mongoose.connection.name,
        host: mongoose.connection.host
      },
      stats: {
        totalPosts: postCount,
        totalUsers: userCount
      },
      latestData: latestPosts
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;
