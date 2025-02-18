const express = require('express');
const RepairController = require('../controllers/repairController');

const router = express.Router();

// Get all repairs
router.get('/', RepairController.getAllRepairs);

// Search repairs
router.get('/search', RepairController.searchRepairs);

// Get repairs by status
router.get('/status/:status', RepairController.getRepairsByStatus);

// Get repair by RFID
router.get('/rfid/:rfid', RepairController.getRepairByRFID);

// Get repair by ID
router.get('/:id', RepairController.getRepairById);

// Create new repair
router.post('/', RepairController.createRepair);

// Update repair
router.put('/:id', RepairController.updateRepair);

// Delete repair
router.delete('/:id', RepairController.deleteRepair);

module.exports = router; 