// Product management functionality
const products = {
    // Add pagination state
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    allProducts: [],

    // Initialize product page
    init: async () => {
        await products.loadProducts();
        products.setupEventListeners();
        products.setupPagination();
    },

    // Load all products
    loadProducts: async () => {
        try {
            const response = await api.products.getAll();
            if (response.success) {
                products.allProducts = response.data;
                products.totalItems = response.data.length;
                products.displayProducts(response.data);
                products.updatePagination();
            }
        } catch (error) {
            utils.handleError(error);
        }
    },

    // Display products in table with pagination
    displayProducts: (productsData) => {
        const startIndex = (products.currentPage - 1) * products.itemsPerPage;
        const endIndex = startIndex + products.itemsPerPage;
        const paginatedProducts = productsData.slice(startIndex, endIndex);

        const tbody = document.getElementById('productsTableBody');
        tbody.innerHTML = paginatedProducts.map(product => `
            <tr>
                <td>${product.rfid_tag_id}</td>
                <td>${product.part_name}</td>
                <td>${product.brand}</td>
                <td>${product.category}</td>
                <td>${product.location_area}<br>${product.location_section}</td>
                <td>${product.quantity}</td>
                <td>${utils.formatCurrency(product.price)}</td>
                <td class="">
                    <button onclick="products.viewHistory('${product.rfid_tag_id}')" class="secondary-btn view-hover">History</button>
                    <button onclick="products.editProduct('${product.rfid_tag_id}')" class="secondary-btn edit-hover">Edit</button>
                    <button onclick="products.deleteProduct('${product.rfid_tag_id}')" class="secondary-btn delete-hover">Delete</button>
                </td>
            </tr>
        `).join('');
    },

    // Setup pagination
    setupPagination: () => {
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        const pageInfo = document.getElementById('pageInfo');

        prevBtn.addEventListener('click', () => {
            if (products.currentPage > 1) {
                products.currentPage--;
                products.displayProducts(products.allProducts);
                products.updatePagination();
            }
        });

        nextBtn.addEventListener('click', () => {
            const maxPage = Math.ceil(products.totalItems / products.itemsPerPage);
            if (products.currentPage < maxPage) {
                products.currentPage++;
                products.displayProducts(products.allProducts);
                products.updatePagination();
            }
        });
    },

    // Update pagination controls
    updatePagination: () => {
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        const pageInfo = document.getElementById('pageInfo');
        const maxPage = Math.ceil(products.totalItems / products.itemsPerPage);

        prevBtn.disabled = products.currentPage === 1;
        nextBtn.disabled = products.currentPage === maxPage;
        pageInfo.textContent = `Page ${products.currentPage} of ${maxPage}`;
    },

    // Setup event listeners
    setupEventListeners: () => {
        // Add product button
        document.getElementById('addProductBtn').addEventListener('click', () => {
            document.getElementById('productModal').style.display = 'flex';
            document.getElementById('modalTitle').textContent = 'Add New Product';
            document.getElementById('productForm').reset();
        });

        // Close modals when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                // Check if the click was on the modal background (not the content)
                if (e.target === modal) {
                    modal.style.display = 'none';
                    // If it's the delete modal, clean up the event listener
                    if (modal.id === 'deleteModal') {
                        const confirmBtn = document.getElementById('confirmDelete');
                        confirmBtn.replaceWith(confirmBtn.cloneNode(true));
                    }
                }
            });
        });

        // New transaction button
        document.getElementById('newTransactionBtn').addEventListener('click', () => {
            window.location.href = 'transactions.html';
        });

        // Product form submission
        document.getElementById('productForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = {
                rfid_tag_id: document.getElementById('rfidTag').value,
                part_name: document.getElementById('partName').value,
                brand: document.getElementById('brand').value,
                category: document.getElementById('category').value,
                location_area: document.getElementById('location').value,
                location_section: document.getElementById('location').value,
                quantity: document.getElementById('quantity').value,
                price: document.getElementById('price').value,
                description: document.getElementById('description').value
            };

            try {
                const response = await api.products.create(formData);
                if (response.success) {
                    utils.showToast('Product added successfully');
                    await products.loadProducts();
                    document.getElementById('productModal').style.display = 'none';
                }
            } catch (error) {
                utils.handleError(error);
            }
        });

        // Search functionality
        const searchInput = document.getElementById('rfidSearch');

        // Clear search on backspace
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace') {
                e.preventDefault();
                searchInput.value = '';
                products.currentPage = 1;
                products.loadProducts();
            }
        });

        searchInput.addEventListener('input', async (e) => {
            const search = e.target.value.toLowerCase();
            if (search.length >= 3) {
                try {
                    const response = await api.products.getAll();
                    if (response.success) {
                        const filteredProducts = response.data.filter(product =>
                            product.rfid_tag_id.toLowerCase().includes(search) ||
                            product.part_name.toLowerCase().includes(search) ||
                            product.brand.toLowerCase().includes(search) ||
                            product.category.toLowerCase().includes(search)
                        );
                        products.allProducts = filteredProducts;
                        products.totalItems = filteredProducts.length;
                        products.currentPage = 1;
                        products.displayProducts(filteredProducts);
                        products.updatePagination();
                    }
                } catch (error) {
                    utils.handleError(error);
                }
            } else if (search.length === 0) {
                products.currentPage = 1;
                products.loadProducts();
            }
        });

        // Search button click
        document.getElementById('searchBtn').addEventListener('click', () => {
            const search = document.getElementById('rfidSearch').value;
            if (search) {
                document.getElementById('rfidSearch').dispatchEvent(new Event('input'));
            }
        });
    },

    // Edit product
    editProduct: async (rfidTag) => {
        try {
            const response = await api.products.getByRFID(rfidTag);
            if (response.success) {
                const product = response.data;
                
                // Populate form
                document.getElementById('rfidTag').value = product.rfid_tag_id;
                document.getElementById('partName').value = product.part_name;
                document.getElementById('brand').value = product.brand;
                document.getElementById('category').value = product.category;
                document.getElementById('location').value = product.location_area;
                document.getElementById('quantity').value = product.quantity;
                document.getElementById('price').value = product.price;
                document.getElementById('description').value = product.description;
                
                // Update modal title and show
                document.getElementById('modalTitle').textContent = 'Edit Product';
                document.getElementById('productModal').style.display = 'block';
                
                // Update form submission handler
                const form = document.getElementById('productForm');
                form.onsubmit = async (e) => {
                    e.preventDefault();
                    const formData = {
                        rfid_tag_id: document.getElementById('rfidTag').value,
                        part_name: document.getElementById('partName').value,
                        brand: document.getElementById('brand').value,
                        category: document.getElementById('category').value,
                        location_area: document.getElementById('location').value,
                        location_section: document.getElementById('location').value,
                        quantity: document.getElementById('quantity').value,
                        price: document.getElementById('price').value,
                        description: document.getElementById('description').value
                    };
                    
                    try {
                        const updateResponse = await api.products.update(rfidTag, formData);
                        if (updateResponse.success) {
                            utils.showToast('Product updated successfully');
                            await products.loadProducts();
                            document.getElementById('productModal').style.display = 'none';
                        }
                    } catch (error) {
                        utils.handleError(error);
                    }
                };
            }
        } catch (error) {
            utils.handleError(error);
        }
    },

    // Delete product
    deleteProduct: async (rfidTag) => {
        const modal = document.getElementById('deleteModal');
        const confirmBtn = document.getElementById('confirmDelete');
        
        // Show the modal
        modal.style.display = 'flex';
        
        // Setup one-time click handler for delete confirmation
        const handleDelete = async () => {
            try {
                const response = await api.products.delete(rfidTag);
                if (response.success) {
                    utils.showToast('Product deleted successfully');
                    await products.loadProducts();
                    modal.style.display = 'none';
                }
            } catch (error) {
                utils.handleError(error);
            } finally {
                // Clean up event listener
                confirmBtn.removeEventListener('click', handleDelete);
            }
        };
        
        // Add click handler
        confirmBtn.addEventListener('click', handleDelete);
    },

    // View product history
    viewHistory: async (rfidTag) => {
        try {
            const [productResponse, historyResponse] = await Promise.all([
                api.products.getByRFID(rfidTag),
                api.products.getHistory(rfidTag)
            ]);

            if (productResponse.success && historyResponse.success) {
                const product = productResponse.data;
                const history = historyResponse.data;

                // Update product info in modal
                document.getElementById('historyProductName').textContent = `${product.part_name} (${product.brand})`;
                document.getElementById('historyProductDetails').textContent = 
                    `RFID: ${product.rfid_tag_id} | Current Stock: ${product.quantity} | Location: ${product.location_area}`;

                // Update history table
                const tbody = document.getElementById('historyTableBody');
                tbody.innerHTML = history.map(record => `
                    <tr>
                        <td>${utils.formatDate(record.transaction_date)}</td>
                        <td>${record.transaction_type}</td>
                        <td>${record.transaction_type === 'SUPPLY' ? '+' : '-'}${record.quantity}</td>
                        <td>${record.reference_number}</td>
                    </tr>
                `).join('');

                // Show modal
                document.getElementById('historyModal').style.display = 'flex';
            }
        } catch (error) {
            utils.handleError(error);
        }
    }
};

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', products.init);

// Close product modal function (referenced in HTML)
window.closeModal = function() {
    document.getElementById('productModal').style.display = 'none';
};

// Close delete modal function (referenced in HTML)
window.closeDeleteModal = function() {
    const modal = document.getElementById('deleteModal');
    const confirmBtn = document.getElementById('confirmDelete');
    
    // Remove any existing click handlers to prevent memory leaks
    confirmBtn.replaceWith(confirmBtn.cloneNode(true));
    modal.style.display = 'none';
};

// Close history modal function (referenced in HTML)
window.closeHistoryModal = function() {
    document.getElementById('historyModal').style.display = 'none';
};
