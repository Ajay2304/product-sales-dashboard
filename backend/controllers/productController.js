const Product = require('../models/Product');

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, sku, price } = req.body;

    // Basic validation
    if (price <= 0) {
      return res.status(400).json({ message: 'Price must be greater than 0' });
    }

    const product = new Product({ name, sku, price });
    await product.save();

    res.status(201).json(product);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'SKU must be unique' });
    }
    res.status(500).json({ message: err.message });
  }
};

// Get all active products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.price && updates.price <= 0) {
      return res.status(400).json({ message: 'Price must be greater than 0' });
    }

    const product = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'SKU must be unique' });
    }
    res.status(500).json({ message: err.message });
  }
};

// Soft delete (set isActive = false)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deactivated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};