const db = require('../config/database');

class Product {
    static async findAll() {
        const query = 'SELECT * FROM products ORDER BY part_name ASC';
        const [rows] = await db.query(query);
        return rows;
    }

    static async findByRFID(rfidTag) {
        const query = 'SELECT * FROM products WHERE rfid_tag_id = ?';
        const [rows] = await db.query(query, [rfidTag]);
        return rows[0];
    }

    static async findByCategory(category) {
        const query = 'SELECT * FROM products WHERE category = ? ORDER BY part_name ASC';
        const [rows] = await db.query(query, [category]);
        return rows;
    }

    static async findByBrand(brand) {
        const query = 'SELECT * FROM products WHERE brand = ? ORDER BY part_name ASC';
        const [rows] = await db.query(query, [brand]);
        return rows;
    }

    static async findByLocation(locationArea) {
        const query = 'SELECT * FROM products WHERE location_area = ? ORDER BY part_name ASC';
        const [rows] = await db.query(query, [locationArea]);
        return rows;
    }

    static async create(productData) {
        const query = `
            INSERT INTO products 
            (rfid_tag_id, part_name, brand, category, location_area, location_section, quantity, price, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            productData.rfid_tag_id,
            productData.part_name,
            productData.brand,
            productData.category,
            productData.location_area,
            productData.location_section,
            productData.quantity || 0,
            productData.price,
            productData.description
        ];
        
        const [result] = await db.query(query, values);
        if (result.affectedRows) {
            return this.findByRFID(productData.rfid_tag_id);
        }
        throw new Error('Failed to create product');
    }

    static async update(rfidTag, productData) {
        const query = `
            UPDATE products 
            SET part_name = ?,
                brand = ?,
                category = ?,
                location_area = ?,
                location_section = ?,
                quantity = ?,
                price = ?,
                description = ?
            WHERE rfid_tag_id = ?
        `;
        const values = [
            productData.part_name,
            productData.brand,
            productData.category,
            productData.location_area,
            productData.location_section,
            productData.quantity,
            productData.price,
            productData.description,
            rfidTag
        ];

        const [result] = await db.query(query, values);
        if (result.affectedRows) {
            return this.findByRFID(rfidTag);
        }
        throw new Error('Failed to update product');
    }

    static async delete(rfidTag) {
        const query = 'DELETE FROM products WHERE rfid_tag_id = ?';
        const [result] = await db.query(query, [rfidTag]);
        return result.affectedRows > 0;
    }

    static async updateQuantity(rfidTag, quantity) {
        const query = 'UPDATE products SET quantity = quantity + ? WHERE rfid_tag_id = ?';
        const [result] = await db.query(query, [quantity, rfidTag]);
        if (result.affectedRows) {
            return this.findByRFID(rfidTag);
        }
        throw new Error('Failed to update quantity');
    }

    static async getStockHistory(rfidTag) {
        const query = `
            SELECT t.*, p.part_name, p.brand
            FROM transactions t
            JOIN products p ON t.rfid_tag_id = p.rfid_tag_id
            WHERE t.rfid_tag_id = ?
            ORDER BY t.transaction_date DESC
        `;
        const [rows] = await db.query(query, [rfidTag]);
        return rows;
    }
}

module.exports = Product;
