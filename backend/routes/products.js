const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Create product
router.post('/', productController.createProduct);

// Get all active products
router.get('/', productController.getProducts);

// Update product
router.put('/:id', productController.updateProduct);

// Soft delete product
router.delete('/:id', productController.deleteProduct);

module.exports = router;