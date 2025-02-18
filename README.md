# Appliance Repair Shop RFID System

A web-based RFID system for tracking appliance repairs, developed as an academic requirement for Angelo Capagalan.

## Project Overview

This system helps appliance repair shops track repair jobs using RFID tags. It provides:
- RFID scanning functionality
- Repair history tracking
- Status updates
- Customer information management
- Search and filter capabilities

## Features

1. **RFID Integration**
   - Quick scanning of repair items
   - Instant access to repair details
   - Real-time status updates

2. **Repair Management**
   - Create new repair records
   - Update repair status
   - Track repair history
   - Delete repair records

3. **Search & Filter**
   - Search by RFID tag
   - Filter by repair status
   - Pagination for large datasets

4. **User Interface**
   - Clean, responsive design
   - Modal-based interactions
   - Status indicators
   - Icon-based actions

## Technology Stack

- **Frontend:**
  - HTML5
  - CSS3
  - Vanilla JavaScript
  - SVG Icons

- **Backend:**
  - Node.js
  - Express.js
  - MySQL

## Installation

1. Clone the repository:
```bash
git clone https://github.com/jersoncaibog/appliance-repair-records-management.git
```

2. Install dependencies:
```bash
cd backend
npm install
```

3. Set up the database:
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE repair_shop;

# Import schema and sample data
mysql -u root -p repair_shop < backend/src/config/schema.sql
mysql -u root -p repair_shop < backend/src/config/sample-data.sql
```

4. Configure environment variables:
```bash
# Create .env file in backend directory
cp .env.example .env
# Edit .env with your database credentials
```

5. Start the server:
```bash
npm start
```

6. Access the application at `http://localhost:3000`

## Usage

1. **Scanning RFID Tags**
   - Enter RFID tag in the search bar
   - Press Enter to view repair details
   - Update status directly from the details modal

2. **Managing Repairs**
   - Click "Add New Repair" to create records
   - Use edit/delete icons for existing records
   - Filter repairs by status using the dropdown

## Project Context

This project was developed as a freelance academic requirement for Angelo Capagalan. It demonstrates the practical application of RFID technology in business operations while fulfilling educational objectives.

## Credits

Developed by Jerson Caibog
For: Angelo Capagalan
Academic Institution: Eastern Samar State University Guiuan Campus
Year: 2024

## License

This project is proprietary and was developed specifically for academic purposes. All rights reserved.

