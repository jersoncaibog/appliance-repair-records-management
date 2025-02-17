const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactionsController');

// Get all transactions
router.get('/', transactionsController.getAllTransactions);

// Get transactions by type
router.get('/type/:type', transactionsController.getTransactionsByType);

// Get transactions by date range
router.get('/date-range', transactionsController.getTransactionsByDateRange);

// Get transactions by RFID tag
router.get('/product/:rfidTag', transactionsController.getTransactionsByProduct);

// Get transaction by ID
router.get('/:transactionId', transactionsController.getTransactionById);

// Create new transaction
router.post('/', transactionsController.createTransaction);

// Create stock intake transaction
router.post('/intake', transactionsController.createStockIntake);

// Create stock output transaction
router.post('/output', transactionsController.createStockOutput);

module.exports = router;
