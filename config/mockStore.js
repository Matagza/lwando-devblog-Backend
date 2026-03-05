const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data');
const USERS_FILE = path.join(DB_PATH, 'users.json');
const POSTS_FILE = path.join(DB_PATH, 'posts.json');

// Ensure data directory exists
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(DB_PATH, { recursive: true });
}

// Initialize files if they don't exist
if (!fs.existsSync(USERS_FILE)) {
  const initialUsers = [
    {
      _id: 'testuser123',
      name: 'Test User',
      email: 'test@example.com',
      password: '$2a$10$YourHashedPasswordHere', // placeholder
      createdAt: new Date().toISOString()
    }
  ];
  fs.writeFileSync(USERS_FILE, JSON.stringify(initialUsers, null, 2));
}

if (!fs.existsSync(POSTS_FILE)) {
  const initialPosts = [
    {
      _id: '1',
      title: 'Getting Started with React Server Components',
      subtitle: 'Everything you need to know about the future of React',
      content: 'React Server Components are a new way to build React apps that render on the server and stream to the client. They offer better performance and developer experience...',
      category: 'Technology',
      image: 'https://placehold.co/800x400/2563eb/ffffff?text=React+Server+Components',
      author: 'testuser123',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString()
    }
  ];
  fs.writeFileSync(POSTS_FILE, JSON.stringify(initialPosts, null, 2));
}

const readData = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeData = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

module.exports = {
  getUsers: () => readData(USERS_FILE),
  saveUsers: (users) => writeData(USERS_FILE, users),
  getPosts: () => readData(POSTS_FILE),
  savePosts: (posts) => writeData(POSTS_FILE, posts)
};
