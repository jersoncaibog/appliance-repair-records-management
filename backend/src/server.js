require('dotenv').config({ path: 'backend/.env' });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Database connection
const db = require('./config/database');

// Import routes
const productRoutes = require('./routes/productRoutes');
const recordRoutes = require('./routes/recordRoutes');

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // HTTP request logger

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '../../')));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

// API routes
app.use('/api/products', productRoutes);
app.use('/api/transactions', recordRoutes);

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../index.html'));
});

// Serve transactions.html for /transactions route
app.get('/transactions', (req, res) => {
    res.sendFile(path.join(__dirname, '../../transactions.html'));
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'development' 
            ? err.message 
            : 'An error occurred while processing your request'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Start server
const PORT = process.env.PORT || 3000;

// Test database connection before starting server
db.getConnection()
    .then(connection => {
        console.log('Database connected successfully');
        connection.release();
        
        // Start server after successful database connection
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Access the application at http://localhost:${PORT}`);
        });
    })
    .catch(error => {
        console.error('Error connecting to the database:', error.message);
        process.exit(1); // Exit if database connection fails
    });
