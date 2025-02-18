const RepairModel = require('../models/repair');

class RepairController {
    // Get all repairs
    static async getAllRepairs(req, res) {
        try {
            const repairs = await RepairModel.getAll();
            res.json({ success: true, data: repairs });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // Get repair by RFID
    static async getRepairByRFID(req, res) {
        try {
            const repair = await RepairModel.getByRFID(req.params.rfid);
            if (!repair) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'Repair record not found' 
                });
            }
            res.json({ success: true, data: repair });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // Create new repair
    static async createRepair(req, res) {
        try {
            const id = await RepairModel.create(req.body);
            res.status(201).json({ 
                success: true, 
                message: 'Repair record created successfully',
                data: { id } 
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // Update repair
    static async updateRepair(req, res) {
        try {
            const success = await RepairModel.update(req.params.id, req.body);
            if (!success) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'Repair record not found' 
                });
            }
            res.json({ 
                success: true, 
                message: 'Repair record updated successfully' 
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // Delete repair
    static async deleteRepair(req, res) {
        try {
            const success = await RepairModel.delete(req.params.id);
            if (!success) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'Repair record not found' 
                });
            }
            res.json({ 
                success: true, 
                message: 'Repair record deleted successfully' 
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // Search repairs
    static async searchRepairs(req, res) {
        try {
            const repairs = await RepairModel.search(req.query.q);
            res.json({ success: true, data: repairs });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // Filter by status
    static async getRepairsByStatus(req, res) {
        try {
            const repairs = await RepairModel.getByStatus(req.params.status);
            res.json({ success: true, data: repairs });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // Get repair by ID
    static async getRepairById(req, res) {
        try {
            const repair = await RepairModel.getById(req.params.id);
            if (!repair) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'Repair record not found' 
                });
            }
            res.json({ success: true, data: repair });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = RepairController; 