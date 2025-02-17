const Transaction = require('../models/transaction');
const Product = require('../models/product');

const transactionsController = {
    // Get all transactions
    async getAllTransactions(req, res) {
        try {
            const transactions = await Transaction.findAll();
            res.json({ 
                success: true, 
                data: transactions.map(transaction => ({
                    transaction_id: transaction.transaction_id,
                    transaction_type: transaction.transaction_type,
                    rfid_tag_id: transaction.rfid_tag_id,
                    part_name: transaction.part_name,
                    brand: transaction.brand,
                    transaction_date: transaction.transaction_date,
                    reference_number: transaction.reference_number,
                    quantity: transaction.quantity
                }))
            });
        } catch (error) {
            console.error('Error in getAllTransactions:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Error fetching transactions: ' + error.message 
            });
        }
    },

    // Get transaction by ID
    async getTransactionById(req, res) {
        try {
            const transaction = await Transaction.findById(req.params.transactionId);
            if (!transaction) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'Transaction not found' 
                });
            }
            res.json({ success: true, data: transaction });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: 'Error fetching transaction: ' + error.message 
            });
        }
    },

    // Get transactions by type
    async getTransactionsByType(req, res) {
        try {
            const transactions = await Transaction.findByType(req.params.type);
            res.json({ success: true, data: transactions });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: 'Error fetching transactions by type: ' + error.message 
            });
        }
    },

    // Get transactions by date range
    async getTransactionsByDateRange(req, res) {
        try {
            const { startDate, endDate } = req.query;
            if (!startDate || !endDate) {
                return res.status(400).json({
                    success: false,
                    error: 'Start date and end date are required'
                });
            }

            const transactions = await Transaction.findByDateRange(startDate, endDate);
            res.json({ success: true, data: transactions });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: 'Error fetching transactions by date range: ' + error.message 
            });
        }
    },

    // Get transactions by product
    async getTransactionsByProduct(req, res) {
        try {
            const transactions = await Transaction.findByProduct(req.params.rfidTag);
            res.json({ success: true, data: transactions });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: 'Error fetching transactions by product: ' + error.message 
            });
        }
    },

    // Create new transaction
    async createTransaction(req, res) {
        try {
            const { rfid_tag_id, quantity, reference_number } = req.body;

            // Basic validation
            if (!rfid_tag_id || !quantity || !reference_number) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields'
                });
            }

            const result = await Transaction.create(req.body);
            res.status(201).json({ 
                success: true, 
                message: 'Transaction created successfully',
                data: result 
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: 'Error creating transaction: ' + error.message 
            });
        }
    },

    // Create stock intake transaction
    async createStockIntake(req, res) {
        try {
            const { rfid_tag_id, quantity, reference_number } = req.body;

            // Basic validation
            if (!rfid_tag_id || !quantity || !reference_number) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields'
                });
            }

            const result = await Transaction.createSupply({
                rfid_tag_id,
                quantity,
                reference_number
            });

            res.status(201).json({ 
                success: true, 
                message: 'Stock intake recorded successfully',
                data: result 
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: 'Error recording stock intake: ' + error.message 
            });
        }
    },

    // Create stock output transaction
    async createStockOutput(req, res) {
        try {
            const { rfid_tag_id, quantity, reference_number } = req.body;

            // Basic validation
            if (!rfid_tag_id || !quantity || !reference_number) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields'
                });
            }

            const result = await Transaction.createSaleOut({
                rfid_tag_id,
                quantity,
                reference_number
            });

            res.status(201).json({ 
                success: true, 
                message: 'Stock output recorded successfully',
                data: result 
            });
        } catch (error) {
            if (error.message === 'Insufficient stock') {
                return res.status(400).json({
                    success: false,
                    error: 'Insufficient stock available'
                });
            }
            res.status(500).json({ 
                success: false, 
                error: 'Error recording stock output: ' + error.message 
            });
        }
    }
};

module.exports = transactionsController;
