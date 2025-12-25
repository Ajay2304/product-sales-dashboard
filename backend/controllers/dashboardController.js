const Product = require('../models/Product');
const Order = require('../models/Order');

exports.getSummary = async (req, res) => {
  try {
    // Count only active products
    const totalProducts = await Product.countDocuments({ isActive: true });

    // Count all orders
    const totalOrders = await Order.countDocuments();

    // Calculate total revenue from all orders
    const revenueResult = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.json({
      totalProducts,
      totalOrders,
      totalRevenue: Number(totalRevenue.toFixed(2))  // Clean decimal
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};