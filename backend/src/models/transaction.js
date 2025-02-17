const db = require('../config/database');

class Transaction {
    static async findAll() {
        const query = `
            SELECT t.*, p.part_name, p.brand
            FROM transactions t
            JOIN products p ON t.rfid_tag_id = p.rfid_tag_id
            ORDER BY t.transaction_date DESC
        `;
        const [rows] = await db.query(query);
        return rows;
    }

    static async findById(transactionId) {
        const query = `
            SELECT t.*, p.part_name, p.brand
            FROM transactions t
            JOIN products p ON t.rfid_tag_id = p.rfid_tag_id
            WHERE t.transaction_id = ?
        `;
        const [transaction] = await db.query(query, [transactionId]);
        return transaction;
    }

    static async findByType(type) {
        const query = `
            SELECT t.*, p.part_name, p.brand
            FROM transactions t
            JOIN products p ON t.rfid_tag_id = p.rfid_tag_id
            WHERE t.transaction_type = ?
            ORDER BY t.transaction_date DESC
        `;
        const [rows] = await db.query(query, [type]);
        return rows;
    }

    static async findByDateRange(startDate, endDate) {
        const query = `
            SELECT t.*, p.part_name, p.brand
            FROM transactions t
            JOIN products p ON t.rfid_tag_id = p.rfid_tag_id
            WHERE t.transaction_date BETWEEN ? AND ?
            ORDER BY t.transaction_date DESC
        `;
        return await db.query(query, [startDate, endDate]);
    }

    static async findByProduct(rfidTag) {
        const query = `
            SELECT t.*, p.part_name, p.brand
            FROM transactions t
            JOIN products p ON t.rfid_tag_id = p.rfid_tag_id
            WHERE t.rfid_tag_id = ?
            ORDER BY t.transaction_date DESC
        `;
        return await db.query(query, [rfidTag]);
    }

    static async create(transactionData) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Insert transaction record
            const insertQuery = `
                INSERT INTO transactions 
                (transaction_type, rfid_tag_id, quantity, reference_number)
                VALUES (?, ?, ?, ?)
            `;
            const insertValues = [
                transactionData.transaction_type,
                transactionData.rfid_tag_id,
                transactionData.quantity,
                transactionData.reference_number
            ];
            
            const result = await connection.query(insertQuery, insertValues);

            // Update product quantity
            const quantityChange = transactionData.transaction_type === 'SUPPLY' 
                ? transactionData.quantity 
                : -transactionData.quantity;

            const updateQuery = `
                UPDATE products 
                SET quantity = quantity + ?
                WHERE rfid_tag_id = ?
            `;
            await connection.query(updateQuery, [quantityChange, transactionData.rfid_tag_id]);

            await connection.commit();
            return result;

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async createSupply(data) {
        return await this.create({
            ...data,
            transaction_type: 'SUPPLY'
        });
    }

    static async createSaleOut(data) {
        // Check if enough stock is available
        const [product] = await db.query(
            'SELECT quantity FROM products WHERE rfid_tag_id = ?',
            [data.rfid_tag_id]
        );

        if (!product || product.quantity < data.quantity) {
            throw new Error('Insufficient stock');
        }

        return await this.create({
            ...data,
            transaction_type: 'SALE_OUT'
        });
    }
}

module.exports = Transaction;
