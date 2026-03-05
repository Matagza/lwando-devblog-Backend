require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const dbRoutes = require('./routes/dbRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/db', dbRoutes);

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || 'Server error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server on ${PORT}`);
});
