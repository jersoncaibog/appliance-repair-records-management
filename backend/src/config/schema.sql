USE elmer_motor_parts;

-- Drop tables if they exist
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS products;
-- Create Products table
CREATE TABLE products (
    rfid_tag_id VARCHAR(50) PRIMARY KEY,
    part_name VARCHAR(100) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    location_area VARCHAR(50) NOT NULL,
    location_section VARCHAR(50) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT
);
-- Create Transactions table
CREATE TABLE transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_type ENUM('SUPPLY', 'SALE_OUT') NOT NULL,
    rfid_tag_id VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reference_number VARCHAR(50),
    FOREIGN KEY (rfid_tag_id) REFERENCES products(rfid_tag_id) ON DELETE RESTRICT,
    INDEX idx_rfid (rfid_tag_id),
    INDEX idx_transaction_type (transaction_type),
    INDEX idx_transaction_date (transaction_date)
);