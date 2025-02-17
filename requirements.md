# Requirements Document for RFID-Based Motor Parts Management System
## Purpose
The purpose of this RFID-based web application is to efficiently manage and track motor parts inventory in a shop setting. The system uses RFID technology to monitor product locations, stock levels, and movement within the storage facility. This system aims to streamline inventory management, reduce manual tracking errors, and provide real-time stock visibility for academic demonstration purposes.

## Features
### Product Management
- Products can be registered with RFID tags and stored in the database
- Product information includes:
  - RFID Tag ID (unique identifier)
  - Part Name
  - Brand/Manufacturer
  - Category
  - Location (Area and Section where the part is stored)
  - Quantity
  - Price
  - Description

### Transaction Management
- Track all inventory movements with detailed transaction records
- Transaction types include:
  - Stock Intake (receiving new inventory)
  - Stock Output (sales or service usage)
  - Stock Transfer (movement between locations)
  - Stock Adjustment (corrections and audits)
- Each transaction records:
  - Transaction ID
  - Transaction Type
  - Product RFID
  - Date and Time
  - Reference Number (for purchase orders or sales invoices)
- Transaction history viewable for each product

### Inventory Tracking System
- Automatic updates when parts are:
  - Received into inventory
  - Removed for sale or service
- Transaction logging for all inventory changes

### Homepage and User Interface
- Design theme
  - Similar to New York style by ShadCDN UI
  - Light mode only
- Management tools including:
  - **Product Table:** Shows all product details
  - **Add Product Button:** Opens form for new product registration
  - **Edit Button:** Opens form for updates to the product
  - **Delete Button:** Deletes the product from the database
  - **Transaction History:** View and filter transaction records
  - **New Transaction Button:** Create new transaction entries
- Search bar to search for a product using the RFID Tag
- Transaction filtering and sorting capabilities

### CRUD Operations
- **Products Table:** Full CRUD functionality
- **Transactions Table:** Create and Read operations (Updates and Deletes restricted for audit purposes)

## Database Design
### Tables
1. **Products Table:**
   - Fields:
     - RFID_Tag_ID (Primary Key)
     - Part_Name
     - Part_Number
     - Brand
     - Category
     - Current_Location_ID (Foreign Key)
     - Quantity
     - Price
     - Description

2. **Transactions Table:**
   - Fields:
     - Transaction_ID (Primary Key, Auto-increment)
     - Transaction_Type (ENUM: 'SUPPLY', 'SALE_OUT')
     - RFID_Tag_ID (Foreign Key)
     - Transaction_Date (Timestamp)
     - Reference_Number (VARCHAR)

## Tech Stack
- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Backend:** Node.js with Express
- **Database:** MariaDB
- NO TAILWIND!!

## Implementation Notes
- This is an academic project focusing on demonstrating RFID inventory management concepts
- All transactions must be logged for audit purposes
- System should maintain running totals of inventory levels based on transaction history

## Database

Database: elmer_motor_parts
├── products table
│   ├── rfid_tag_id (PK, VARCHAR(50))
│   ├── part_name (VARCHAR(100))
│   ├── brand (VARCHAR(100))
│   ├── category (VARCHAR(50))
│   ├── location_area (VARCHAR(50))
│   ├── location_section (VARCHAR(50))
│   ├── quantity (INT)
│   ├── price (DECIMAL(10,2))
│   └── description (TEXT)
│
└── transactions table
    ├── transaction_id (PK, AUTO_INCREMENT)
    ├── transaction_type (ENUM: 'SUPPLY', 'SALE_OUT')
    ├── rfid_tag_id (FK -> products)
    ├── quantity (INT)
    ├── transaction_date (TIMESTAMP)
    └── reference_number (VARCHAR(50))