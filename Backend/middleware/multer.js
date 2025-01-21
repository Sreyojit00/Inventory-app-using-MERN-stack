const multer = require('multer');

// Configure Multer to use memory storage
const storage = multer.memoryStorage();

// Set up upload middleware
const upload = multer({ storage });

module.exports = upload;
