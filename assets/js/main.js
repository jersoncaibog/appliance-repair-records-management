// Utility functions
const utils = {
    // Format currency in PHP
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(amount);
    },

    // Format date
    formatDate: (dateString) => {
        return new Date(dateString).toLocaleString('en-PH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Show toast notification
    showToast: (message, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Trigger reflow
        toast.offsetHeight;
        
        // Add show class
        toast.classList.add('show');
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // Validate RFID format (8 digits)
    validateRFID: (rfid) => {
        return /^\d{8}$/.test(rfid);
    },

    // Generate reference number
    generateReferenceNumber: (type) => {
        const prefix = type === 'SUPPLY' ? 'PO' : 'SO';
        const date = new Date().toISOString().slice(2,4);
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `${prefix}-${date}-${random}`;
    },

    // Handle API errors
    handleError: (error) => {
        console.error('API Error:', error);
        utils.showToast(error.message || 'An error occurred', 'error');
    },

    // Load categories for dropdown
    loadCategories: async (selectElement) => {
        try {
            const response = await api.products.getAll();
            if (response.success) {
                const categories = [...new Set(response.data.map(product => product.category))];
                categories.sort();
                
                selectElement.innerHTML = '<option value="">Select Category</option>' +
                    categories.map(category => 
                        `<option value="${category}">${category}</option>`
                    ).join('');
            }
        } catch (error) {
            utils.handleError(error);
        }
    },

    // Load brands for dropdown
    loadBrands: async (selectElement) => {
        try {
            const response = await api.products.getAll();
            if (response.success) {
                const brands = [...new Set(response.data.map(product => product.brand))];
                brands.sort();
                
                selectElement.innerHTML = '<option value="">Select Brand</option>' +
                    brands.map(brand => 
                        `<option value="${brand}">${brand}</option>`
                    ).join('');
            }
        } catch (error) {
            utils.handleError(error);
        }
    },

    // Load locations for dropdown
    loadLocations: async (selectElement) => {
        try {
            const response = await api.products.getAll();
            if (response.success) {
                const locations = [...new Set(response.data.map(product => product.location_area))];
                locations.sort();
                
                selectElement.innerHTML = '<option value="">Select Location</option>' +
                    locations.map(location => 
                        `<option value="${location}">${location}</option>`
                    ).join('');
            }
        } catch (error) {
            utils.handleError(error);
        }
    }
};

// Export utils for other modules
window.utils = utils;
