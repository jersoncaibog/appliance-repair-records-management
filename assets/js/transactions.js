// Transaction management functionality
const transactions = {
    // Add pagination state
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    allTransactions: [],

    // Initialize transaction page
    init: async () => {
        await transactions.loadTransactions();
        transactions.setupEventListeners();
        transactions.setupPagination();
    },

    // Load all transactions
    loadTransactions: async () => {
        try {
            const response = await api.transactions.getAll();
            if (response.success) {
                transactions.allTransactions = response.data;
                transactions.totalItems = response.data.length;
                transactions.displayTransactions(response.data);
                transactions.updatePagination();
            }
        } catch (error) {
            utils.handleError(error);
        }
    },

    // Display transactions in table with pagination
    displayTransactions: (transactionsData) => {
        const startIndex = (transactions.currentPage - 1) * transactions.itemsPerPage;
        const endIndex = startIndex + transactions.itemsPerPage;
        const paginatedTransactions = transactionsData.slice(startIndex, endIndex);

        const tbody = document.getElementById('transactionsTableBody');
        if (!Array.isArray(paginatedTransactions) || paginatedTransactions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">No transactions found</td></tr>';
            return;
        }

        tbody.innerHTML = paginatedTransactions.map(transaction => {
            // Ensure all values are defined, use fallbacks if not
            const id = transaction.transaction_id || 'N/A';
            const type = transaction.transaction_type || 'N/A';
            const rfid = transaction.rfid_tag_id || 'N/A';
            const partName = transaction.part_name || 'N/A';
            const brand = transaction.brand || 'N/A';
            const date = transaction.transaction_date ? utils.formatDate(transaction.transaction_date) : 'N/A';
            const refNum = transaction.reference_number || 'N/A';
            const quantity = transaction.quantity || 0;

            return `
                <tr>
                    <td>${id}</td>
                    <td>${type}</td>
                    <td>${rfid}</td>
                    <td>${partName} (${brand})</td>
                    <td>${date}</td>
                    <td>${refNum}</td>
                    <td>${quantity}</td>
                </tr>
            `;
        }).join('');
    },

    // Setup pagination
    setupPagination: () => {
        const prevBtn = document.getElementById('prevPageTrans');
        const nextBtn = document.getElementById('nextPageTrans');
        const pageInfo = document.getElementById('pageInfoTrans');

        prevBtn.addEventListener('click', () => {
            if (transactions.currentPage > 1) {
                transactions.currentPage--;
                transactions.displayTransactions(transactions.allTransactions);
                transactions.updatePagination();
            }
        });

        nextBtn.addEventListener('click', () => {
            const maxPage = Math.ceil(transactions.totalItems / transactions.itemsPerPage);
            if (transactions.currentPage < maxPage) {
                transactions.currentPage++;
                transactions.displayTransactions(transactions.allTransactions);
                transactions.updatePagination();
            }
        });
    },

    // Update pagination controls
    updatePagination: () => {
        const prevBtn = document.getElementById('prevPageTrans');
        const nextBtn = document.getElementById('nextPageTrans');
        const pageInfo = document.getElementById('pageInfoTrans');
        const maxPage = Math.ceil(transactions.totalItems / transactions.itemsPerPage);

        prevBtn.disabled = transactions.currentPage === 1;
        nextBtn.disabled = transactions.currentPage === maxPage;
        pageInfo.textContent = `Page ${transactions.currentPage} of ${maxPage}`;
    },

    // Setup event listeners with pagination support
    setupEventListeners: () => {
        // New transaction button
        document.getElementById('newTransactionBtn').addEventListener('click', () => {
            document.getElementById('transactionModal').style.display = 'block';
            document.getElementById('transactionForm').reset();
            
            // Generate reference number based on type
            const type = document.getElementById('transType').value;
            document.getElementById('referenceNumber').value = utils.generateReferenceNumber(type);
        });

        // Transaction form submission
        document.getElementById('transactionForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = {
                transaction_type: document.getElementById('transType').value,
                rfid_tag_id: document.getElementById('productRfid').value,
                quantity: parseInt(document.getElementById('transQuantity').value),
                reference_number: document.getElementById('referenceNumber').value
            };

            try {
                let response;
                if (formData.transaction_type === 'SUPPLY') {
                    response = await api.transactions.createStockIntake(formData);
                } else {
                    response = await api.transactions.createStockOutput(formData);
                }

                if (response.success) {
                    utils.showToast('Transaction recorded successfully');
                    await transactions.loadTransactions();
                    document.getElementById('transactionModal').style.display = 'none';
                }
            } catch (error) {
                utils.handleError(error);
            }
        });

        // Transaction type change (for reference number generation)
        document.getElementById('transType').addEventListener('change', (e) => {
            const refNumber = utils.generateReferenceNumber(e.target.value);
            document.getElementById('referenceNumber').value = refNumber;
        });

        // RFID input validation
        document.getElementById('productRfid').addEventListener('input', async (e) => {
            const rfidTag = e.target.value;
            if (utils.validateRFID(rfidTag)) {
                try {
                    const response = await api.products.getByRFID(rfidTag);
                    if (response.success) {
                        const product = response.data;
                        utils.showToast(`Selected: ${product.part_name} (${product.brand}) - Stock: ${product.quantity}`, 'info');
                    }
                } catch (error) {
                    utils.handleError(error);
                }
            }
        });

        // Filter by transaction type with pagination
        document.getElementById('transactionType').addEventListener('change', async (e) => {
            const type = e.target.value;
            try {
                let response;
                if (type === 'all') {
                    response = await api.transactions.getAll();
                } else {
                    response = await api.transactions.getByType(type);
                }
                
                if (response.success) {
                    const formattedData = response.data.map(transaction => ({
                        transaction_id: transaction.transaction_id,
                        transaction_type: transaction.transaction_type,
                        rfid_tag_id: transaction.rfid_tag_id,
                        part_name: transaction.part_name,
                        brand: transaction.brand,
                        transaction_date: transaction.transaction_date,
                        reference_number: transaction.reference_number,
                        quantity: transaction.quantity
                    }));
                    transactions.allTransactions = formattedData;
                    transactions.totalItems = formattedData.length;
                    transactions.currentPage = 1;
                    transactions.displayTransactions(formattedData);
                    transactions.updatePagination();
                }
            } catch (error) {
                utils.handleError(error);
            }
        });
    }
};

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', transactions.init);

// Close modal function (referenced in HTML)
window.closeModal = function() {
    document.getElementById('transactionModal').style.display = 'none';
};
