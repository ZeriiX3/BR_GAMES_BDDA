const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const multer = require('multer');
const path = require('path'); // Import the path module


router.get('/', productController.getAllProducts); // Fetch all products
router.delete('/:id', productController.deleteProduct);

// Set up storage engine for Multer to save images in proj/public/images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/images'));  // Adjust path to proj/public/images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Use timestamp to avoid conflicts
  }
});

// Initialize multer with the storage engine
const upload = multer({ storage: storage });

// Route to handle product creation (with image upload)
router.post('/', upload.single('image'), productController.createProduct);

module.exports = router;