const fs = require('fs');
const path = require('path');

const UPLOADS_DIR = path.join(__dirname, '../public/uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const saveLocalFile = (file) => {
  const fileName = `${Date.now()}-${file.originalname}`;
  const filePath = path.join(UPLOADS_DIR, fileName);
  fs.writeFileSync(filePath, file.buffer);
  // Return the relative URL for the frontend
  return `/uploads/${fileName}`;
};

module.exports = { saveLocalFile };
