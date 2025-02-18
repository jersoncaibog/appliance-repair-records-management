-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS repair_shop;
USE repair_shop;
-- Create the repair_history table
CREATE TABLE IF NOT EXISTS repair_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    appliance_type VARCHAR(100) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    issue_description TEXT NOT NULL,
    repair_status ENUM('Pending', 'In Progress', 'Completed') NOT NULL DEFAULT 'Pending',
    repair_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rfid_tag VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- Create indexes
CREATE INDEX idx_rfid_tag ON repair_history(rfid_tag);
CREATE INDEX idx_customer_name ON repair_history(customer_name);
CREATE INDEX idx_repair_status ON repair_history(repair_status);