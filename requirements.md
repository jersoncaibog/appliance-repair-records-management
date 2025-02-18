# Project Requirements: RFID-Based Web App for Appliance Repair Shop

## 1. Overview
This project is an RFID-based web application for an appliance repair shop. It features a single-page interface displaying the repair history table with full CRUD (Create, Read, Update, Delete) functionality.

## 2. Pages
- **Home Page**: Displays the repair history table and allows CRUD operations.

## 3. Tech Stack
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Express.js (Node.js framework)
- **Database**: MySQL

## 4. Database Schema
The database consists of a single table to store repair records.

### Create Table Query
```sql
CREATE TABLE repair_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    appliance_type VARCHAR(100) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    issue_description TEXT NOT NULL,
    repair_status ENUM('Pending', 'In Progress', 'Completed') NOT NULL DEFAULT 'Pending',
    repair_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rfid_tag VARCHAR(50) UNIQUE NOT NULL
);
```

## 5. Features
- **RFID Integration**: Scan RFID tags to fetch customer repair history.
- **CRUD Functionality**:
  - **Create**: Add new repair records.
  - **Read**: Display repair history in a table.
  - **Update**: Modify existing records.
  - **Delete**: Remove repair entries.
- **Search & Filter**: Search records by customer name, appliance type, or repair status.

## 6. API Endpoints
- `GET /repairs` - Fetch all repair records
- `POST /repairs` - Add a new repair record
- `PUT /repairs/:id` - Update a specific repair record
- `DELETE /repairs/:id` - Delete a repair record
- `GET /repairs/:rfid` - Fetch a repair record by RFID tag

## 7. Other Considerations
- **design style** modern and clean, similar to new york style by shadcdn/ui (no dark mode)
- **UI Framework** (Basic CSS for styling)


---
This document outlines the fundamental requirements for the RFID-based appliance repair shop web application.