USE elmer_motor_parts;

-- Delete existing data
DELETE FROM transactions;
DELETE FROM products;
-- Sample Products
INSERT INTO products (
        rfid_tag_id,
        part_name,
        brand,
        category,
        location_area,
        location_section,
        quantity,
        price,
        description
    )
VALUES (
        '12345678',
        'Timing Belt',
        'Toyota',
        'Engine Parts',
        'Storage Room 1',
        'Shelf A1, Rack 03, Bin 2',
        15,
        2499.99,
        'Genuine Toyota timing belt for Vios 2018-2022'
    ),
    (
        '23456789',
        'Brake Pad Set',
        'Honda',
        'Brake System',
        'Storage Room 2',
        'Shelf B3, Rack 12, Bin 4',
        25,
        1899.50,
        'Front brake pad set for Honda Civic 2019-2023'
    ),
    (
        '34567890',
        'Oil Filter',
        'Mitsubishi',
        'Filters',
        'Storage Room 1',
        'Shelf A2, Rack 05, Bin 1',
        50,
        399.99,
        'Genuine Mitsubishi oil filter for Montero Sport'
    ),
    (
        '45678901',
        'Spark Plug Set',
        'NGK',
        'Ignition',
        'Storage Room 3',
        'Shelf C1, Rack 02, Bin 3',
        30,
        799.99,
        'Set of 4 iridium spark plugs'
    ),
    (
        '56789012',
        'Air Filter',
        'Nissan',
        'Filters',
        'Storage Room 2',
        'Shelf B1, Rack 08, Bin 5',
        20,
        649.50,
        'Air filter for Nissan Navara 2020-2023'
    ),
    (
        '67890123',
        'Alternator',
        'Denso',
        'Electrical',
        'Storage Room 1',
        'Shelf A3, Rack 01, Bin 4',
        8,
        12999.99,
        'Remanufactured alternator for Toyota Fortuner'
    ),
    (
        '78901234',
        'Radiator',
        'Keihin',
        'Cooling System',
        'Storage Room 3',
        'Shelf C2, Rack 06, Bin 1',
        5,
        8499.99,
        'Aluminum radiator for Honda City 2018-2022'
    ),
    (
        '89012345',
        'Fuel Pump',
        'Bosch',
        'Fuel System',
        'Storage Room 2',
        'Shelf B2, Rack 09, Bin 2',
        12,
        4999.99,
        'Electric fuel pump assembly'
    ),
    (
        '90123456',
        'Clutch Kit',
        'Exedy',
        'Transmission',
        'Storage Room 1',
        'Shelf A4, Rack 04, Bin 3',
        6,
        15999.99,
        'Complete clutch kit for Mitsubishi L300'
    ),
    (
        '01234567',
        'Water Pump',
        'Aisin',
        'Cooling System',
        'Storage Room 3',
        'Shelf C3, Rack 07, Bin 4',
        10,
        3499.99,
        'Water pump for Toyota Innova diesel'
    );
-- Sample Transactions
INSERT INTO transactions (
        transaction_type,
        rfid_tag_id,
        quantity,
        reference_number
    )
VALUES -- Initial stock supplies
    ('SUPPLY', '12345678', 20, 'PO-2024-001'),
    ('SUPPLY', '23456789', 30, 'PO-2024-001'),
    ('SUPPLY', '34567890', 60, 'PO-2024-001'),
    ('SUPPLY', '45678901', 40, 'PO-2024-002'),
    ('SUPPLY', '56789012', 25, 'PO-2024-002'),
    ('SUPPLY', '67890123', 10, 'PO-2024-003'),
    ('SUPPLY', '78901234', 8, 'PO-2024-003'),
    ('SUPPLY', '89012345', 15, 'PO-2024-004'),
    ('SUPPLY', '90123456', 10, 'PO-2024-004'),
    ('SUPPLY', '01234567', 15, 'PO-2024-004'),
    -- Sales transactions
    ('SALE_OUT', '12345678', 5, 'SO-2024-001'),
    ('SALE_OUT', '23456789', 5, 'SO-2024-002'),
    ('SALE_OUT', '34567890', 10, 'SO-2024-003'),
    ('SALE_OUT', '45678901', 10, 'SO-2024-004'),
    ('SALE_OUT', '56789012', 5, 'SO-2024-005'),
    ('SALE_OUT', '67890123', 2, 'SO-2024-006'),
    ('SALE_OUT', '78901234', 3, 'SO-2024-007'),
    ('SALE_OUT', '89012345', 3, 'SO-2024-008'),
    ('SALE_OUT', '90123456', 4, 'SO-2024-009'),
    ('SALE_OUT', '01234567', 5, 'SO-2024-010'),
    -- Additional supplies
    ('SUPPLY', '12345678', 10, 'PO-2024-005'),
    ('SUPPLY', '34567890', 20, 'PO-2024-005'),
    ('SUPPLY', '56789012', 10, 'PO-2024-006'),
    ('SUPPLY', '78901234', 5, 'PO-2024-006'),
    ('SUPPLY', '90123456', 5, 'PO-2024-007'),
    -- Additional sales
    ('SALE_OUT', '12345678', 10, 'SO-2024-011'),
    ('SALE_OUT', '34567890', 20, 'SO-2024-012'),
    ('SALE_OUT', '56789012', 10, 'SO-2024-013'),
    ('SALE_OUT', '78901234', 5, 'SO-2024-014'),
    ('SALE_OUT', '90123456', 5, 'SO-2024-015');