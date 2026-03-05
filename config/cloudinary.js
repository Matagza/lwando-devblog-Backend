const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer memory storage
const storage = multer.memoryStorage();

// File filter to ensure only images are uploaded
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed!'), false);
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = { cloudinary, upload };
