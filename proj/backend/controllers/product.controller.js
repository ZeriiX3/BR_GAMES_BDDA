const db = require('../models'); // Adjust the path to your models
const multer = require('multer');
const path = require('path');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await db.products.findAll(); // Ensure this matches your Sequelize model
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products: ' + error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await db.products.destroy({
      where: { id: productId },
    });

    if (deletedProduct) {
      res.status(200).json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

// Setup multer storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images'); // Folder where images will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Filename with timestamp
  },
});

const upload = multer({ storage: storage });

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, rating, stock } = req.body;
    const image = req.file ? req.file.filename : null; // Check if an image is provided
    console.log(image + "productCCCCC ")
    const newProduct = await db.products.create({
      name,
      description,
      price,
      rating,
      stock,
      image,
    });
    console.log(image + "productCCCCC ")
    
    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating product',
      error: error.message,
    });
  }
};
