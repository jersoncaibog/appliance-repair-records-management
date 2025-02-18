const { pool } = require('../config/db');

class RepairModel {
    static async getAll() {
        const [rows] = await pool.query('SELECT * FROM repair_history ORDER BY repair_date DESC');
        return rows;
    }

    static async getByRFID(rfidTag) {
        const [rows] = await pool.query('SELECT * FROM repair_history WHERE rfid_tag = ?', [rfidTag]);
        return rows[0];
    }

    static async create(repairData) {
        const {
            customer_name,
            contact_number,
            appliance_type,
            brand,
            model,
            issue_description,
            repair_status,
            rfid_tag
        } = repairData;

        const [result] = await pool.query(
            `INSERT INTO repair_history 
            (customer_name, contact_number, appliance_type, brand, model, 
             issue_description, repair_status, rfid_tag) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [customer_name, contact_number, appliance_type, brand, model, 
             issue_description, repair_status, rfid_tag]
        );
        return result.insertId;
    }

    static async update(id, repairData) {
        const {
            customer_name,
            contact_number,
            appliance_type,
            brand,
            model,
            issue_description,
            repair_status,
            rfid_tag
        } = repairData;

        const [result] = await pool.query(
            `UPDATE repair_history 
             SET customer_name = ?, contact_number = ?, appliance_type = ?,
                 brand = ?, model = ?, issue_description = ?, 
                 repair_status = ?, rfid_tag = ?
             WHERE id = ?`,
            [customer_name, contact_number, appliance_type, brand, model,
             issue_description, repair_status, rfid_tag, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await pool.query('DELETE FROM repair_history WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async search(query) {
        const searchTerm = `%${query}%`;
        const [rows] = await pool.query(
            `SELECT * FROM repair_history 
             WHERE customer_name LIKE ? 
             OR rfid_tag LIKE ? 
             OR appliance_type LIKE ?
             ORDER BY repair_date DESC`,
            [searchTerm, searchTerm, searchTerm]
        );
        return rows;
    }

    static async getByStatus(status) {
        const [rows] = await pool.query(
            'SELECT * FROM repair_history WHERE repair_status = ? ORDER BY repair_date DESC',
            [status]
        );
        return rows;
    }

    static async getById(id) {
        const [rows] = await pool.query('SELECT * FROM repair_history WHERE id = ?', [id]);
        return rows[0];
    }
}

module.exports = RepairModel; 