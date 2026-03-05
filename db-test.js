require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');

const runTest = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully!');

    // Create a test user if not exists
    let user = await User.findOne({ email: 'tester@newsletter.com' });
    if (!user) {
      user = await User.create({
        name: 'Database Tester',
        email: 'tester@newsletter.com',
        password: 'password123'
      });
      console.log('Test user created');
    } else {
      console.log('Test user already exists');
    }

    // Create a dummy post
    const post = await Post.create({
      title: 'Real Database Connection Verified',
      subtitle: 'This post confirms the app is connected to MongoDB Atlas',
      content: 'This content was successfully written to and read from the provided MongoDB Atlas cluster.',
      category: 'Technology',
      author: user._id,
      image: 'https://placehold.co/800x400/2563eb/ffffff?text=Database+Connected'
    });
    console.log('Dummy post created:', post.title);

    const postCount = await Post.countDocuments();
    console.log('Total posts in database:', postCount);

    console.log('Test completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err.message);
    process.exit(1);
  }
};

runTest();
