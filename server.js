require("dotenv").config();
console.log('Server.js: JWT_SECRET available:', !!process.env.JWT_SECRET, 'length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0);
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const dbRoutes = require("./routes/dbRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: "https://lwando-devblog-frontend.vercel.app",
  credentials: true,
}));
app.use(express.json());

// Add Content Security Policy header to allow fonts
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; font-src 'self' https://*; img-src 'self' data: https://*; script-src 'self' https://*; style-src 'self' https://*; connect-src 'self' https://*");
  next();
});

// Serve static files from the 'public' directory
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Favicon handler
app.get("/favicon.ico", (req, res) => res.status(204).send());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/db", dbRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Lwando DevBlog Backend API is running!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || "Server error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT} and binding to 0.0.0.0`);
});
