// Modal Management
class ModalManager {
    constructor() {
        this.activeModal = null;
        this.initializeModals();
    }

    initializeModals() {
        // Close button functionality for all modals
        document.querySelectorAll('.modal .close, .modal .cancel-btn').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => this.closeModal());
        });

        // Close modal when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModal();
            });
        });

        // Reset form on modal close
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('reset', () => this.closeModal());
        });
    }

    openModal(modalId) {
        this.closeModal(); // Close any open modal first
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            this.activeModal = modal;
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    }

    closeModal() {
        if (this.activeModal) {
            this.activeModal.style.display = 'none';
            this.activeModal = null;
            document.body.style.overflow = '';
        }
    }

    // Custom confirmation modal
    showConfirmation(message, onConfirm, onCancel) {
        const confirmModal = document.createElement('div');
        confirmModal.className = 'modal';
        confirmModal.innerHTML = `
            <div class="modal-content">
                <h2>Confirm Action</h2>
                <p>${message}</p>
                <div class="form-actions">
                    <button class="button primary confirm-btn">Confirm</button>
                    <button class="button secondary cancel-btn">Cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(confirmModal);
        confirmModal.style.display = 'block';

        const handleConfirm = () => {
            onConfirm?.();
            document.body.removeChild(confirmModal);
        };

        const handleCancel = () => {
            onCancel?.();
            document.body.removeChild(confirmModal);
        };

        confirmModal.querySelector('.confirm-btn').addEventListener('click', handleConfirm);
        confirmModal.querySelector('.cancel-btn').addEventListener('click', handleCancel);
        confirmModal.addEventListener('click', (e) => {
            if (e.target === confirmModal) handleCancel();
        });
    }

    // Custom notification modal
    showNotification(message, type = 'info') {
        const notificationModal = document.createElement('div');
        notificationModal.className = 'modal';
        notificationModal.innerHTML = `
            <div class="modal-content notification ${type}">
                <span class="close">&times;</span>
                <p>${message}</p>
            </div>
        `;

        document.body.appendChild(notificationModal);
        notificationModal.style.display = 'block';

        const close = () => {
            // Check if modal still exists before removing
            if (document.body.contains(notificationModal)) {
                document.body.removeChild(notificationModal);
            }
        };

        notificationModal.querySelector('.close').addEventListener('click', close);
        notificationModal.addEventListener('click', (e) => {
            if (e.target === notificationModal) close();
        });

        // Auto close after 3 seconds for non-error notifications
        if (type !== 'error') {
            setTimeout(close, 3000);
        }
    }
}

// API Service
class ApiService {
    constructor() {
        this.baseUrl = 'http://localhost:3000/api';
    }

    async getAllRepairs() {
        const response = await fetch(`${this.baseUrl}/repairs`);
        if (!response.ok) throw new Error('Failed to fetch repairs');
        return response.json();
    }

    async createRepair(repairData) {
        const response = await fetch(`${this.baseUrl}/repairs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(repairData)
        });
        if (!response.ok) throw new Error('Failed to create repair');
        return response.json();
    }

    async updateRepair(id, repairData) {
        const response = await fetch(`${this.baseUrl}/repairs/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(repairData)
        });
        if (!response.ok) throw new Error('Failed to update repair');
        return response.json();
    }

    async deleteRepair(id) {
        const response = await fetch(`${this.baseUrl}/repairs/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete repair');
        return response.json();
    }

    async searchRepairs(query) {
        const response = await fetch(`${this.baseUrl}/repairs/search?q=${query}`);
        if (!response.ok) throw new Error('Failed to search repairs');
        return response.json();
    }

    async getRepairsByStatus(status) {
        const response = await fetch(`${this.baseUrl}/repairs/status/${status}`);
        if (!response.ok) throw new Error('Failed to fetch repairs by status');
        return response.json();
    }

    async getRepairByRFID(rfid) {
        const response = await fetch(`${this.baseUrl}/repairs/rfid/${rfid}`);
        if (!response.ok) throw new Error('Failed to fetch repair by RFID');
        return response.json();
    }

    async getRepairById(id) {
        const response = await fetch(`${this.baseUrl}/repairs/${id}`);
        if (!response.ok) throw new Error('Failed to fetch repair');
        return response.json();
    }
}

// Table Management with API Integration
class TableManager {
    constructor(modalManager) {
        this.modalManager = modalManager;
        this.apiService = new ApiService();
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.totalItems = 0;
        this.repairs = [];
        this.initializeTable();
    }

    async initializeTable() {
        this.setupSearch();
        this.setupFilters();
        this.setupPagination();
        await this.loadTableData();
    }

    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            let debounceTimer;
            
            // Handle normal search with debounce
            searchInput.addEventListener('input', (e) => {
                if (!searchInput.matches(':focus')) return;
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => this.handleSearch(e.target.value), 300);
            });

            // Handle RFID scan (Enter key)
            searchInput.addEventListener('keypress', async (e) => {
                if (e.key === 'Enter' && searchInput.value.trim()) {
                    e.preventDefault();
                    clearTimeout(debounceTimer);
                    
                    try {
                        const response = await this.apiService.getRepairByRFID(searchInput.value.trim());
                        if (response.success) {
                            // Show repair details in modal
                            this.showRepairDetailsModal(response.data);
                        } else {
                            this.modalManager.showNotification('No repair record found for this RFID tag', 'error');
                        }
                    } catch (error) {
                        this.modalManager.showNotification(error.message, 'error');
                    }
                }
            });
        }
    }

    setupFilters() {
        const filterStatus = document.getElementById('filterStatus');
        if (filterStatus) {
            filterStatus.addEventListener('change', (e) => this.handleStatusFilter(e.target.value));
        }
    }

    setupPagination() {
        document.getElementById('prevPage')?.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderTable(this.repairs);
            }
        });

        document.getElementById('nextPage')?.addEventListener('click', () => {
            const maxPages = Math.ceil(this.repairs.length / this.itemsPerPage);
            if (this.currentPage < maxPages) {
                this.currentPage++;
                this.renderTable(this.repairs);
            }
        });
    }

    updatePaginationControls() {
        const maxPages = Math.ceil(this.repairs.length / this.itemsPerPage);
        const pageInfo = document.getElementById('pageInfo');
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');

        if (pageInfo) pageInfo.textContent = `Page ${this.currentPage} of ${maxPages}`;
        if (prevBtn) prevBtn.disabled = this.currentPage === 1;
        if (nextBtn) nextBtn.disabled = this.currentPage === maxPages;
    }

    async loadTableData() {
        try {
            const response = await this.apiService.getAllRepairs();
            if (response.success) {
                this.repairs = response.data;
                this.totalItems = this.repairs.length;
                this.renderTable(this.repairs);
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            this.modalManager.showNotification(error.message, 'error');
        }
    }

    async handleSearch(query) {
        if (!query) {
            await this.loadTableData();
            return;
        }
        try {
            const response = await this.apiService.searchRepairs(query);
            if (response.success) {
                this.repairs = response.data;
                this.totalItems = this.repairs.length;
                this.renderTable(this.repairs);
            }
        } catch (error) {
            this.modalManager.showNotification(error.message, 'error');
        }
    }

    async handleStatusFilter(status) {
        try {
            const response = status 
                ? await this.apiService.getRepairsByStatus(status)
                : await this.apiService.getAllRepairs();
            
            if (response.success) {
                this.repairs = response.data;
                this.totalItems = this.repairs.length;
                this.renderTable(this.repairs);
            }
        } catch (error) {
            this.modalManager.showNotification(error.message, 'error');
        }
    }

    renderTable(repairs) {
        this.repairs = repairs; // Store the full dataset
        const tbody = document.getElementById('repairTableBody');
        if (!tbody) return;

        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const paginatedRepairs = repairs.slice(startIndex, endIndex);

        // Update pagination controls
        this.updatePaginationControls();

        // Define SVG icons as template strings
        const editIcon = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.5 2.5L13.5 4.5M7.5 12.5H13.5M2.5 9.5L10.5 1.5L13.5 4.5L5.5 12.5H2.5V9.5Z" 
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;

        const deleteIcon = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 4.5H13.5M5.5 4.5V3.5C5.5 2.94772 5.94772 2.5 6.5 2.5H9.5C10.0523 2.5 10.5 2.94772 10.5 3.5V4.5M6.5 7.5V11.5M9.5 7.5V11.5M3.5 4.5V12.5C3.5 13.0523 3.94772 13.5 4.5 13.5H11.5C12.0523 13.5 12.5 13.0523 12.5 12.5V4.5" 
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;

        tbody.innerHTML = paginatedRepairs.map(repair => `
            <tr>
                <td>${repair.rfid_tag}</td>
                <td>${repair.customer_name}</td>
                <td>${repair.contact_number}</td>
                <td>${repair.appliance_type}</td>
                <td>${repair.brand}</td>
                <td>${repair.model}</td>
                <td>${repair.issue_description}</td>
                <td><span class="status-badge status-${repair.repair_status.toLowerCase()}">${repair.repair_status}</span></td>
                <td>${new Date(repair.repair_date).toLocaleDateString()}</td>
                <td class="action-buttons">
                    <button onclick="handleEditRepair(${repair.id})" class="icon-button" title="Edit">
                        ${editIcon}
                    </button>
                    <button onclick="handleDeleteRepair(${repair.id})" class="icon-button" title="Delete">
                        ${deleteIcon}
                    </button>
                </td>
            </tr>
        `).join('');
    }

    showRepairDetailsModal(repair) {
        const modalContent = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Repair Details</h2>
                <div class="repair-details">
                    <div class="detail-group">
                        <label>RFID Tag:</label>
                        <span>${repair.rfid_tag}</span>
                    </div>
                    <div class="detail-group">
                        <label>Customer:</label>
                        <span>${repair.customer_name}</span>
                    </div>
                    <div class="detail-group">
                        <label>Contact:</label>
                        <span>${repair.contact_number}</span>
                    </div>
                    <div class="detail-group">
                        <label>Appliance:</label>
                        <span>${repair.appliance_type} - ${repair.brand} ${repair.model}</span>
                    </div>
                    <div class="detail-group">
                        <label>Issue:</label>
                        <span>${repair.issue_description}</span>
                    </div>
                    <div class="detail-group">
                        <label>Status:</label>
                        <div class="status-update">
                            <select id="statusUpdate" class="status-select">
                                <option value="Pending" ${repair.repair_status === 'Pending' ? 'selected' : ''}>Pending</option>
                                <option value="In Progress" ${repair.repair_status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                                <option value="Completed" ${repair.repair_status === 'Completed' ? 'selected' : ''}>Completed</option>
                            </select>
                            <button id="updateStatusBtn" class="button primary">Update Status</button>
                        </div>
                    </div>
                    <div class="detail-group">
                        <label>Date:</label>
                        <span>${new Date(repair.repair_date).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="form-actions">
                    <button onclick="handleEditRepair(${repair.id})" class="button primary">Edit</button>
                    <button onclick="this.closest('.modal').remove()" class="button secondary">Close</button>
                </div>
            </div>
        `;

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = modalContent;
        document.body.appendChild(modal);
        modal.style.display = 'block';

        // Add status update handler
        const updateStatusBtn = modal.querySelector('#updateStatusBtn');
        updateStatusBtn?.addEventListener('click', async () => {
            const newStatus = modal.querySelector('#statusUpdate').value;
            try {
                const response = await this.apiService.updateRepair(repair.id, {
                    ...repair,
                    repair_status: newStatus
                });
                
                if (response.success) {
                    this.modalManager.showNotification('Status updated successfully', 'success');
                    await this.loadTableData();
                    modal.remove();
                }
            } catch (error) {
                this.modalManager.showNotification(error.message, 'error');
            }
        });

        // Function to handle modal cleanup
        const handleModalClose = async () => {
            modal.remove();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = ''; // Clear search input
                searchInput.blur(); // Remove focus
            }
            await this.loadTableData(); // Reset table to show all repairs
        };

        // Close modal handlers
        const closeBtn = modal.querySelector('.close');
        closeBtn?.addEventListener('click', handleModalClose);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) handleModalClose();
        });
        modal.querySelector('.button.secondary')?.addEventListener('click', handleModalClose);
    }
}

// Form Management with API Integration
class FormManager {
    constructor(modalManager) {
        this.modalManager = modalManager;
        this.apiService = new ApiService();
        this.initializeForms();
    }

    initializeForms() {
        const repairForm = document.getElementById('repairForm');
        if (repairForm) {
            repairForm.addEventListener('submit', (e) => this.handleRepairFormSubmit(e));
            
            const cancelBtn = repairForm.querySelector('#cancelBtn');
            cancelBtn?.addEventListener('click', () => {
                repairForm.reset();
                this.modalManager.closeModal();
            });
        }

        const scannerForm = document.getElementById('scannerModal');
        if (scannerForm) {
            const scanButton = scannerForm.querySelector('#scanButton');
            scanButton?.addEventListener('click', () => this.handleRFIDScan());
        }
    }

    async handleRepairFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        
        // Map form fields to database columns
        const repairData = {
            customer_name: form.customerName.value,
            contact_number: form.contactNumber.value,
            appliance_type: form.applianceType.value,
            brand: form.brand.value,
            model: form.model.value,
            issue_description: form.issueDescription.value,
            repair_status: form.repairStatus.value,
            rfid_tag: form.rfidTag.value,
            repair_date: new Date().toISOString() // Add current date
        };

        try {
            const isEdit = form.dataset.repairId;
            const response = isEdit
                ? await this.apiService.updateRepair(form.dataset.repairId, repairData)
                : await this.apiService.createRepair(repairData);

            if (response.success) {
                this.modalManager.closeModal();
                this.modalManager.showNotification(
                    `Repair record ${isEdit ? 'updated' : 'created'} successfully!`,
                    'success'
                );
                form.reset();
                await tableManager.loadTableData();
            }
        } catch (error) {
            this.modalManager.showNotification(error.message, 'error');
        }
    }

    async handleRFIDScan() {
        try {
            const rfidInput = document.getElementById('rfidInput');
            const rfidStatus = document.getElementById('rfidStatus');
            
            if (!rfidInput.value) {
                throw new Error('Please enter an RFID tag');
            }

            rfidStatus.textContent = 'Scanning...';
            
            const response = await this.apiService.getRepairByRFID(rfidInput.value);
            
            if (response.success) {
                rfidStatus.textContent = 'Tag found! Loading repair details...';
                // TODO: Handle found repair record (e.g., open edit modal with data)
            } else {
                rfidStatus.textContent = 'No repair record found for this tag.';
            }
        } catch (error) {
            this.modalManager.showNotification(error.message, 'error');
        }
    }
}

// Initialize Application with API Integration
let tableManager; // Make it accessible globally for the edit/delete handlers

document.addEventListener('DOMContentLoaded', () => {
    const modalManager = new ModalManager();
    const formManager = new FormManager(modalManager);
    tableManager = new TableManager(modalManager);

    // Button Event Listeners
    document.getElementById('addRepairBtn')?.addEventListener('click', () => {
        const form = document.getElementById('repairForm');
        if (form) {
            form.reset();
            delete form.dataset.repairId;
            document.getElementById('modalTitle').textContent = 'Add New Repair';
        }
        modalManager.openModal('repairModal');
    });

    document.getElementById('openScannerBtn')?.addEventListener('click', () => {
        modalManager.openModal('scannerModal');
    });
});

// Global handlers for table actions
window.handleEditRepair = async (id) => {
    try {
        const response = await tableManager.apiService.getRepairById(id);
        if (response.success) {
            const form = document.getElementById('repairForm');
            if (form) {
                form.dataset.repairId = id;
                Object.entries(response.data).forEach(([key, value]) => {
                    const input = form.elements[key];
                    if (input) input.value = value;
                });
                document.getElementById('modalTitle').textContent = 'Edit Repair';
                tableManager.modalManager.openModal('repairModal');
            }
        }
    } catch (error) {
        tableManager.modalManager.showNotification(error.message, 'error');
    }
};

window.handleDeleteRepair = (id) => {
    tableManager.modalManager.showConfirmation(
        'Are you sure you want to delete this repair record?',
        async () => {
            try {
                const response = await tableManager.apiService.deleteRepair(id);
                if (response.success) {
                    tableManager.modalManager.showNotification('Repair record deleted successfully', 'success');
                    await tableManager.loadTableData();
                }
            } catch (error) {
                tableManager.modalManager.showNotification(error.message, 'error');
            }
        }
    );
};