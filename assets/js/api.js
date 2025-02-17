const API_BASE_URL = 'http://localhost:3000/api';

const api = {
    // Product endpoints
    products: {
        getAll: async () => {
            const response = await fetch(`${API_BASE_URL}/products`);
            return await response.json();
        },

        getByRFID: async (rfidTag) => {
            const response = await fetch(`${API_BASE_URL}/products/rfid/${rfidTag}`);
            return await response.json();
        },

        getByCategory: async (category) => {
            const response = await fetch(`${API_BASE_URL}/products/category/${category}`);
            return await response.json();
        },

        getByBrand: async (brand) => {
            const response = await fetch(`${API_BASE_URL}/products/brand/${brand}`);
            return await response.json();
        },

        getByLocation: async (locationId) => {
            const response = await fetch(`${API_BASE_URL}/products/location/${locationId}`);
            return await response.json();
        },

        create: async (productData) => {
            const response = await fetch(`${API_BASE_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });
            return await response.json();
        },

        update: async (rfidTag, productData) => {
            const response = await fetch(`${API_BASE_URL}/products/${rfidTag}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });
            return await response.json();
        },

        delete: async (rfidTag) => {
            const response = await fetch(`${API_BASE_URL}/products/${rfidTag}`, {
                method: 'DELETE',
            });
            return await response.json();
        },

        getHistory: async (rfidTag) => {
            const response = await fetch(`${API_BASE_URL}/products/${rfidTag}/history`);
            return await response.json();
        },
    },

    // Transaction endpoints
    transactions: {
        getAll: async () => {
            const response = await fetch(`${API_BASE_URL}/transactions`);
            return await response.json();
        },

        getById: async (transactionId) => {
            const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`);
            return await response.json();
        },

        getByType: async (type) => {
            const response = await fetch(`${API_BASE_URL}/transactions/type/${type}`);
            return await response.json();
        },

        getByDateRange: async (startDate, endDate) => {
            const response = await fetch(
                `${API_BASE_URL}/transactions/date-range?startDate=${startDate}&endDate=${endDate}`
            );
            return await response.json();
        },

        getByProduct: async (rfidTag) => {
            const response = await fetch(`${API_BASE_URL}/transactions/product/${rfidTag}`);
            return await response.json();
        },

        create: async (transactionData) => {
            const response = await fetch(`${API_BASE_URL}/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transactionData),
            });
            return await response.json();
        },

        createStockIntake: async (data) => {
            const response = await fetch(`${API_BASE_URL}/transactions/intake`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            return await response.json();
        },

        createStockOutput: async (data) => {
            const response = await fetch(`${API_BASE_URL}/transactions/output`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            return await response.json();
        },
    },
};
