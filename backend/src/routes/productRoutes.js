const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

// Get all products
router.get('/', productsController.getAllProducts);

// Get product by RFID tag
router.get('/rfid/:rfidTag', productsController.getProductByRFID);

// Get product by category
router.get('/category/:category', productsController.getProductsByCategory);

// Get product by brand
router.get('/brand/:brand', productsController.getProductsByBrand);

// Get product by location
router.get('/location/:locationId', productsController.getProductsByLocation);

// Create new product
router.post('/', productsController.createProduct);

// Update product
router.put('/:rfidTag', productsController.updateProduct);

// Delete product
router.delete('/:rfidTag', productsController.deleteProduct);

// Get product stock history
router.get('/:rfidTag/history', productsController.getProductHistory);

module.exports = router;
