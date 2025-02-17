const Product = require('../models/product');

const productsController = {
    // Get all products
    async getAllProducts(req, res) {
        try {
            const products = await Product.findAll();
            res.json({ 
                success: true, 
                data: products 
            });
        } catch (error) {
            console.error('Error in getAllProducts:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Error fetching products: ' + error.message 
            });
        }
    },

    // Get product by RFID
    async getProductByRFID(req, res) {
        try {
            const product = await Product.findByRFID(req.params.rfidTag);
            if (!product) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'Product not found' 
                });
            }
            res.json({ 
                success: true, 
                data: product 
            });
        } catch (error) {
            console.error('Error in getProductByRFID:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Error fetching product: ' + error.message 
            });
        }
    },

    // Get products by category
    async getProductsByCategory(req, res) {
        try {
            const products = await Product.findByCategory(req.params.category);
            res.json({ 
                success: true, 
                data: products 
            });
        } catch (error) {
            console.error('Error in getProductsByCategory:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Error fetching products by category: ' + error.message 
            });
        }
    },

    // Get products by brand
    async getProductsByBrand(req, res) {
        try {
            const products = await Product.findByBrand(req.params.brand);
            res.json({ 
                success: true, 
                data: products 
            });
        } catch (error) {
            console.error('Error in getProductsByBrand:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Error fetching products by brand: ' + error.message 
            });
        }
    },

    // Get products by location
    async getProductsByLocation(req, res) {
        try {
            const products = await Product.findByLocation(req.params.locationId);
            res.json({ 
                success: true, 
                data: products 
            });
        } catch (error) {
            console.error('Error in getProductsByLocation:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Error fetching products by location: ' + error.message 
            });
        }
    },

    // Create new product
    async createProduct(req, res) {
        try {
            const { 
                rfid_tag_id, part_name, brand, category,
                location_area, location_section, quantity,
                price, description 
            } = req.body;

            // Basic validation
            if (!rfid_tag_id || !part_name || !brand || !category || !location_area || !location_section || !price) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields'
                });
            }

            const product = await Product.create(req.body);
            res.status(201).json({ 
                success: true, 
                message: 'Product created successfully',
                data: product 
            });
        } catch (error) {
            console.error('Error in createProduct:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Error creating product: ' + error.message 
            });
        }
    },

    // Update product
    async updateProduct(req, res) {
        try {
            const rfidTag = req.params.rfidTag;
            const product = await Product.findByRFID(rfidTag);
            
            if (!product) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'Product not found' 
                });
            }

            const updatedProduct = await Product.update(rfidTag, req.body);
            res.json({ 
                success: true, 
                message: 'Product updated successfully',
                data: updatedProduct 
            });
        } catch (error) {
            console.error('Error in updateProduct:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Error updating product: ' + error.message 
            });
        }
    },

    // Delete product
    async deleteProduct(req, res) {
        try {
            const rfidTag = req.params.rfidTag;
            const product = await Product.findByRFID(rfidTag);
            
            if (!product) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'Product not found' 
                });
            }

            const deleted = await Product.delete(rfidTag);
            if (deleted) {
                res.json({ 
                    success: true, 
                    message: 'Product deleted successfully' 
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Failed to delete product'
                });
            }
        } catch (error) {
            console.error('Error in deleteProduct:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Error deleting product: ' + error.message 
            });
        }
    },

    // Get product stock history
    async getProductHistory(req, res) {
        try {
            const history = await Product.getStockHistory(req.params.rfidTag);
            res.json({ 
                success: true, 
                data: history 
            });
        } catch (error) {
            console.error('Error in getProductHistory:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Error fetching product history: ' + error.message 
            });
        }
    }
};

module.exports = productsController;
