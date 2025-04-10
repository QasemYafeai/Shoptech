const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products); // Return JSON
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching products' });
  }
});

// Create a product
router.post('/', async (req, res) => {
  try {
   
    const newProduct = new Product(req.body);
    const saved = await newProduct.save();
    res.json(saved);
  } catch (error) {
    res.status(500).json({ error: 'Server error creating product' });
  }
});

// (Optional) Get a single product by ID
router.get('/:productId', async (req, res) => {
    try {
      const product = await Product.findById(req.params.productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Server error fetching product' });
    }
  });

module.exports = router;
