document.addEventListener('DOMContentLoaded', function() {
    const loginPage = document.getElementById('loginPage');
    const signupPage = document.getElementById('signupPage');
    const dashboardPage = document.getElementById('dashboardPage');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const showSignup = document.getElementById('showSignup');
    const showLogin = document.getElementById('showLogin');
    const togglePasswordLogin = document.getElementById('togglePasswordLogin');
    const togglePasswordSignup = document.getElementById('togglePasswordSignup');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const capsWarningLogin = document.getElementById('capsWarningLogin');
    const capsWarningSignup = document.getElementById('capsWarningSignup');
    const passwordLogin = document.getElementById('password');
    const passwordSignup = document.getElementById('signupPassword');
    const confirmPassword = document.getElementById('signupConfirmPassword');
    const complaintForm = document.getElementById('complaintForm');
    const adminReportForm = document.getElementById('adminReportForm');
    const complaintFormSection = document.getElementById('complaintFormSection');
    const adminReportFormSection = document.getElementById('adminReportFormSection');
    const statusFilter = document.getElementById('statusFilter');
    const manageStatusFilter = document.getElementById('manageStatusFilter');
    const searchComplaints = document.getElementById('searchComplaints');
    const generateReportBtn = document.getElementById('generateReportBtn');
    const publicTypeFilter = document.getElementById('publicTypeFilter');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const managementTitle = document.getElementById('managementTitle');
    const adminComplaintSelect = document.getElementById('adminComplaintSelect');
    const complaintsList = document.getElementById('complaintsList');
    const manageComplaintsList = document.getElementById('manageComplaintsList');
    const resolvedComplaintsGrid = document.getElementById('resolvedComplaintsGrid');
    const userRoleDisplay = document.getElementById('userRoleDisplay');
    const staffDashboard = document.getElementById('staffDashboard');
    const trackingDashboard = document.querySelector('.tracking-dashboard');
    const modal = document.getElementById('complaintDetailsModal');
    const modalTitle = document.getElementById('modalComplaintTitle');
    const modalBody = document.getElementById('modalComplaintBody');
    const modalActions = document.getElementById('modalActions');

    let userAccounts = JSON.parse(localStorage.getItem('userAccounts')) || [
        { 
            id: '1',
            username: 'admin', 
            password: 'admin123', 
            name: 'Administrator', 
            email: 'admin@barangay.gov',
            role: 'admin'
        },
        { 
            id: '2',
            username: 'staff', 
            password: 'staff123', 
            name: 'Barangay Staff', 
            email: 'staff@barangay.gov',
            role: 'staff'
        },
        { 
            id: '3',
            username: 'resident', 
            password: 'resident123', 
            name: 'Resident User', 
            email: 'resident@barangay.gov',
            role: 'resident'
        }
    ];

    let complaints = JSON.parse(localStorage.getItem('complaints')) || [
        {
            id: 1,
            residentName: 'Juan Dela Cruz',
            residentAge: '35',
            residentAddress: '123 Main St, Purok 5',
            residentEmail: 'juan@example.com',
            residentContact: '09123456789',
            residentUsername: 'resident',
            residentId: '3',
            type: 'Garbage Collection',
            details: 'Garbage has not been collected for 3 days in our area',
            location: 'Purok 5, near basketball court',
            date: new Date().toISOString().split('T')[0],
            status: 'Resolved',
            photo: null,
            assignedStaff: 'Staff 1',
            resolutionNotes: 'Garbage was collected the following day',
            createdBy: 'resident',
            createdById: '3'
        },
        {
            id: 2,
            residentName: 'Maria Santos',
            residentAge: '28',
            residentAddress: '456 Oak St, Purok 3',
            residentEmail: 'maria@example.com',
            residentContact: '09234567890',
            residentUsername: 'resident',
            residentId: '3',
            type: 'Road Repair',
            details: 'Large pothole causing traffic and accidents',
            location: 'Main road near barangay hall',
            date: new Date().toISOString().split('T')[0],
            status: 'In Progress',
            photo: null,
            assignedStaff: 'Staff 2',
            resolutionNotes: '',
            createdBy: 'resident',
            createdById: '3'
        },
        {
            id: 3,
            residentName: 'Pedro Reyes',
            residentAge: '42',
            residentAddress: '789 Pine St, Purok 4',
            residentEmail: 'pedro@example.com',
            residentContact: '09345678901',
            residentUsername: 'resident',
            residentId: '3',
            type: 'Streetlight Repair',
            details: 'Streetlight not working for 1 week',
            location: 'Corner of Purok 3 and Purok 4',
            date: new Date().toISOString().split('T')[0],
            status: 'Pending',
            photo: null,
            assignedStaff: '',
            resolutionNotes: '',
            createdBy: 'resident',
            createdById: '3'
        }
    ];

    function init() {
        console.log("Initializing Barangay Complaint System...");
        try {
            const currentUser = getCurrentUser();
            if (currentUser) {
                showDashboard(currentUser);
            } else {
                showLoginPage();
            }
            setupEventListeners();
            updateAllViews();
        } catch (error) {
            console.error("Initialization failed:", error);
            alert("System initialization error. Please refresh.");
        }
    }

    function handleLogin(e) {
        e.preventDefault();
        try {
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();

            if (!username || !password) {
                throw new Error('Username and password are required');
            }

            const user = authenticateUser(username, password);
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            
            showDashboard(user);
            loginForm.reset();
            
            console.log("Login successful:", username);
        } catch (error) {
            console.error("Login error:", error.message);
            document.getElementById('password').value = '';
            alert(error.message);
        }
    }

    function authenticateUser(username, password) {
        const user = userAccounts.find(account => 
            account.username === username && account.password === password
        );
        
        if (!user) {
            throw new Error('Invalid username or password');
        }
        return user;
    }

    function handleSignup(e) {
        e.preventDefault();
        try {
            const formData = {
                name: document.getElementById('signupName').value.trim(),
                email: document.getElementById('signupEmail').value.trim(),
                username: document.getElementById('signupUsername').value.trim(),
                password: document.getElementById('signupPassword').value,
                confirmPassword: document.getElementById('signupConfirmPassword').value,
                role: document.getElementById('userRole').value
            };

            validateSignup(formData);
            const newUser = createUserAccount(formData);
            
            userAccounts.push(newUser);
            localStorage.setItem('userAccounts', JSON.stringify(userAccounts));
            
            showLoginPage();
            signupForm.reset();
            
            console.log("Signup successful:", newUser.username);
            alert('Account created successfully! Please login.');
        } catch (error) {
            console.error("Signup error:", error.message);
            alert(error.message);
        }
    }

    function validateSignup(formData) {
        if (!formData.name || !formData.email || !formData.username || 
            !formData.password || !formData.confirmPassword || !formData.role) {
            throw new Error('Please fill in all fields');
        }

        if (formData.password !== formData.confirmPassword) {
            throw new Error('Passwords do not match');
        }

        if (userAccounts.some(account => account.username.toLowerCase() === formData.username.toLowerCase())) {
            throw new Error('Username already exists');
        }

        if (userAccounts.some(account => account.email.toLowerCase() === formData.email.toLowerCase())) {
            throw new Error('Email already registered');
        }

        if (formData.password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }
    }

    function createUserAccount(formData) {
        return { 
            id: Date.now().toString(),
            username: formData.username, 
            password: formData.password, 
            name: formData.name, 
            email: formData.email,
            role: formData.role 
        };
    }

    function logout() {
        const currentUser = getCurrentUser();
        if (currentUser) {
            console.log("Logging out user:", currentUser.username);
        }
        
        sessionStorage.removeItem('currentUser');
        showLoginPage();
        resetAllForms();
    }

    function handleComplaintSubmit(e) {
        e.preventDefault();
        try {
            const currentUser = getCurrentUser();
            if (!currentUser || currentUser.role !== 'resident') {
                throw new Error('Only residents can submit complaints');
            }

            const formData = collectComplaintFormData();
            validateComplaintForm(formData);
            
            const newComplaint = createComplaint(formData, currentUser);
            complaints.push(newComplaint);
            localStorage.setItem('complaints', JSON.stringify(complaints));
            
            updateAllViews();
            complaintForm.reset();
            
            console.log("Complaint submitted:", newComplaint.id);
            alert('Complaint submitted successfully!');
        } catch (error) {
            console.error("Complaint submission error:", error.message);
            alert(error.message);
        }
    }

    function collectComplaintFormData() {
        return {
            name: document.getElementById('residentName').value.trim(),
            age: document.getElementById('residentAge').value.trim(),
            address: document.getElementById('residentAddress').value.trim(),
            email: document.getElementById('residentEmail').value.trim(),
            contact: document.getElementById('residentContact').value.trim(),
            type: document.getElementById('complaintType').value,
            details: document.getElementById('complaintDetails').value.trim(),
            location: document.getElementById('complaintLocation').value.trim(),
            photoFile: document.getElementById('photoUpload').files[0]
        };
    }

    function validateComplaintForm(formData) {
        if (!formData.name || !formData.age || !formData.address || 
            !formData.email || !formData.contact || !formData.type || 
            !formData.details || !formData.location) {
            throw new Error('Please fill in all required fields');
        }
    }

    function createComplaint(formData, currentUser) {
        return {
            id: complaints.length > 0 ? Math.max(...complaints.map(c => c.id)) + 1 : 1,
            residentName: formData.name,
            residentAge: formData.age,
            residentAddress: formData.address,
            residentEmail: formData.email,
            residentContact: formData.contact,
            residentUsername: currentUser.username,
            residentId: currentUser.id,
            type: formData.type,
            details: formData.details,
            location: formData.location,
            date: new Date().toISOString().split('T')[0],
            status: 'Pending',
            photo: formData.photoFile ? URL.createObjectURL(formData.photoFile) : null,
            assignedStaff: '',
            resolutionNotes: '',
            createdBy: currentUser.username,
            createdById: currentUser.id
        };
    }

    function handleAdminReportSubmit(e) {
        e.preventDefault();
        try {
            const currentUser = getCurrentUser();
            if (!currentUser || currentUser.role !== 'admin') {
                throw new Error('Only admin can submit reports');
            }

            const complaintId = parseInt(adminComplaintSelect.value);
            const feedback = document.getElementById('adminReportFeedback').value.trim();

            if (!complaintId || !feedback) {
                throw new Error('Please select a complaint and provide feedback');
            }

            updateComplaintResolution(complaintId, feedback, currentUser.name);
            updateAllViews();
            adminReportForm.reset();
            populateAdminComplaintDropdown();
            
            console.log("Admin report submitted for complaint:", complaintId);
            alert('Feedback submitted successfully!');
        } catch (error) {
            console.error("Admin report error:", error.message);
            alert(error.message);
        }
    }

    function updateComplaintResolution(complaintId, feedback, staffName) {
        const complaint = complaints.find(c => c.id === complaintId);
        if (complaint) {
            complaint.resolutionNotes = feedback;
            complaint.status = 'Resolved';
            complaint.assignedStaff = staffName;
            localStorage.setItem('complaints', JSON.stringify(complaints));
        } else {
            throw new Error('Complaint not found');
        }
    }

    function showDashboard(user) {
        loginPage.style.display = 'none';
        signupPage.style.display = 'none';
        dashboardPage.style.display = 'block';
        updateUIForUserRole(user.role);
    }

    function showLoginPage() {
        loginPage.style.display = 'flex';
        signupPage.style.display = 'none';
        dashboardPage.style.display = 'none';
    }

    function updateUIForUserRole(role) {
        userRoleDisplay.textContent = role.charAt(0).toUpperCase() + role.slice(1);
        
        staffDashboard.style.display = 'none';
        complaintFormSection.style.display = 'none';
        adminReportFormSection.style.display = 'none';
        trackingDashboard.style.display = 'none';
        generateReportBtn.style.display = 'none';
        
        if (role === 'resident') {
            complaintFormSection.style.display = 'block';
            trackingDashboard.style.display = 'block';
        } else if (role === 'staff') {
            staffDashboard.style.display = 'block';
        } else if (role === 'admin') {
            staffDashboard.style.display = 'block';
            adminReportFormSection.style.display = 'block';
            generateReportBtn.style.display = 'block';
        }
    }

    function updateAllViews() {
        updateComplaintsTable();
        updateManageComplaintsTable();
        updateResolvedComplaintsGrid();
        populateAdminComplaintDropdown();
    }

    function updateComplaintsTable() {
        const currentUser = getCurrentUser();
        if (!currentUser) return;

        const statusFilterValue = statusFilter.value;
        let filteredComplaints = complaints.filter(c => 
            c.createdById === currentUser.id && 
            c.createdBy === currentUser.username
        );

        if (statusFilterValue !== 'all') {
            filteredComplaints = filteredComplaints.filter(c => c.status === statusFilterValue);
        }

        renderTable(
            complaintsList,
            filteredComplaints,
            ['id', 'type', 'date', 'status', 'location'],
            ['ID', 'Type', 'Date', 'Status', 'Location'],
            true
        );
    }

    function updateManageComplaintsTable() {
        const currentUser = getCurrentUser();
        if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'staff')) return;

        const statusFilterValue = manageStatusFilter.value;
        const searchValue = searchComplaints.value.toLowerCase();
        
        let filteredComplaints = [...complaints];
        
        if (statusFilterValue !== 'all') {
            filteredComplaints = filteredComplaints.filter(c => c.status === statusFilterValue);
        }
        
        if (searchValue) {
            filteredComplaints = filteredComplaints.filter(c => 
                c.type.toLowerCase().includes(searchValue) ||
                c.residentName.toLowerCase().includes(searchValue) ||
                c.location.toLowerCase().includes(searchValue)
            );
        }

        renderTable(
            manageComplaintsList,
            filteredComplaints,
            ['id', 'type', 'residentName', 'date', 'status', 'location'],
            ['ID', 'Type', 'Resident', 'Date', 'Status', 'Location'],
            currentUser.role === 'admin'
        );
    }

    function renderTable(container, data, properties, headers, showActions) {
        container.innerHTML = '';

        if (data.length === 0) {
            container.innerHTML = `<tr><td colspan="${headers.length + 1}" style="text-align: center;">No complaints found</td></tr>`;
            return;
        }

        data.forEach(item => {
            const row = document.createElement('tr');
            
            properties.forEach(prop => {
                const cell = document.createElement('td');
                if (prop === 'status') {
                    cell.innerHTML = `<span class="status-badge status-${item[prop].toLowerCase().replace(' ', '-')}">${item[prop]}</span>`;
                } else {
                    cell.textContent = item[prop];
                }
                row.appendChild(cell);
            });

            const actionCell = document.createElement('td');
            actionCell.innerHTML = `
                <button class="action-btn view-btn" data-id="${item.id}">View</button>
                ${showActions ? `<button class="action-btn delete-btn" data-id="${item.id}">Delete</button>` : ''}
            `;
            row.appendChild(actionCell);

            container.appendChild(row);
        });

        container.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => showComplaintDetails(parseInt(btn.dataset.id)));
        });

        container.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteComplaint(parseInt(btn.dataset.id)));
        });
    }

    function updateResolvedComplaintsGrid() {
        const typeFilterValue = publicTypeFilter.value;
        let filteredComplaints = complaints.filter(c => c.status === 'Resolved');
        
        if (typeFilterValue !== 'all') {
            filteredComplaints = filteredComplaints.filter(c => c.type === typeFilterValue);
        }

        renderComplaintCards(filteredComplaints);
    }

    function renderComplaintCards(complaints) {
        resolvedComplaintsGrid.innerHTML = '';

        if (complaints.length === 0) {
            resolvedComplaintsGrid.innerHTML = `
                <div class="no-complaints">
                    <p>No resolved complaints to display</p>
                </div>
            `;
            return;
        }

        complaints.forEach(complaint => {
            const card = document.createElement('div');
            card.className = 'complaint-card';
            card.innerHTML = `
                <h3>${complaint.type}</h3>
                <div class="complaint-meta">
                    <span>${complaint.date}</span>
                    <span>${complaint.location}</span>
                </div>
                <div class="complaint-description">
                    <p>${complaint.details.substring(0, 100)}${complaint.details.length > 100 ? '...' : ''}</p>
                </div>
                ${complaint.photo ? `<img src="${complaint.photo}" alt="Complaint photo" class="complaint-image">` : ''}
                <button class="action-btn view-btn" data-id="${complaint.id}">View Details</button>
            `;
            resolvedComplaintsGrid.appendChild(card);
        });

        resolvedComplaintsGrid.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => showComplaintDetails(parseInt(btn.dataset.id)));
        });
    }

    function showComplaintDetails(complaintId) {
        const complaint = complaints.find(c => c.id === complaintId);
        if (!complaint) return;

        modalTitle.textContent = `${complaint.type} (ID: ${complaint.id})`;
        
        modalBody.innerHTML = `
            <div class="complaint-detail">
                <h3>Complaint Details</h3>
                <p>${complaint.details}</p>
            </div>
            <div class="complaint-meta">
                <div><strong>Submitted by:</strong> ${complaint.residentName}</div>
                <div><strong>Date:</strong> ${complaint.date}</div>
                <div><strong>Location:</strong> ${complaint.location}</div>
                <div><strong>Status:</strong> <span class="status-badge status-${complaint.status.toLowerCase().replace(' ', '-')}">${complaint.status}</span></div>
                ${complaint.assignedStaff ? `<div><strong>Assigned Staff:</strong> ${complaint.assignedStaff}</div>` : ''}
                ${complaint.resolutionNotes ? `
                <div class="admin-feedback">
                    <h3>Admin Feedback/Solution</h3>
                    <p>${complaint.resolutionNotes}</p>
                </div>
                ` : ''}
            </div>
            ${complaint.photo ? `<div class="complaint-photo">
                <img src="${complaint.photo}" alt="Complaint photo">
            </div>` : ''}
        `;

        updateModalActions(complaint);
        modal.style.display = 'block';
    }

    function updateModalActions(complaint) {
        modalActions.innerHTML = '';
        const currentUser = getCurrentUser();
        
        if (!currentUser) return;

        if (currentUser.role === 'staff' && complaint.resolutionNotes) {
            modalActions.innerHTML += `
                <button class="action-btn print-btn" id="printFeedbackBtn" data-id="${complaint.id}">Print Feedback</button>
            `;
            
            document.getElementById('printFeedbackBtn').addEventListener('click', () => printFeedback(complaint));
        }

        if (currentUser.role === 'staff' || currentUser.role === 'admin') {
            if (complaint.status === 'Pending') {
                modalActions.innerHTML += `
                    <button class="action-btn edit-btn" id="assignToMeBtn" data-id="${complaint.id}">Assign to Me</button>
                    <button class="action-btn edit-btn" id="startProgressBtn" data-id="${complaint.id}">Start Progress</button>
                `;
            } else if (complaint.status === 'In Progress') {
                modalActions.innerHTML += `
                    <button class="action-btn edit-btn" id="resolveBtn" data-id="${complaint.id}">Mark as Resolved</button>
                `;
            }
            
            document.getElementById('assignToMeBtn')?.addEventListener('click', () => assignComplaintToMe(complaint.id));
            document.getElementById('startProgressBtn')?.addEventListener('click', () => updateComplaintStatus(complaint.id, 'In Progress'));
            document.getElementById('resolveBtn')?.addEventListener('click', () => {
                const resolutionNotes = prompt('Enter resolution notes:');
                if (resolutionNotes !== null) {
                    updateComplaintStatus(complaint.id, 'Resolved', resolutionNotes);
                }
            });
        }

        if (currentUser.role === 'admin') {
            modalActions.innerHTML += `
                <button class="action-btn delete-btn" id="deleteBtn" data-id="${complaint.id}">Delete</button>
            `;
            
            document.getElementById('deleteBtn')?.addEventListener('click', () => deleteComplaint(complaint.id));
        }
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    function assignComplaintToMe(complaintId) {
        const currentUser = getCurrentUser();
        const complaint = complaints.find(c => c.id === complaintId);
        
        if (complaint && currentUser) {
            complaint.assignedStaff = currentUser.name;
            complaint.status = 'In Progress';
            localStorage.setItem('complaints', JSON.stringify(complaints));
            
            updateAllViews();
            closeModal();
            alert('Complaint has been assigned to you and marked as In Progress');
        }
    }

    function updateComplaintStatus(complaintId, status, resolutionNotes = '') {
        const complaint = complaints.find(c => c.id === complaintId);
        
        if (complaint) {
            complaint.status = status;
            if (resolutionNotes) {
                complaint.resolutionNotes = resolutionNotes;
            }
            localStorage.setItem('complaints', JSON.stringify(complaints));
            
            updateAllViews();
            closeModal();
            alert(`Complaint status updated to ${status}`);
        }
    }

    function deleteComplaint(complaintId) {
        const currentUser = getCurrentUser();
        if (!currentUser || currentUser.role !== 'admin') {
            alert('Only admin can delete complaints');
            return;
        }
        
        if (confirm('Are you sure you want to delete this complaint?')) {
            complaints = complaints.filter(c => c.id !== complaintId);
            localStorage.setItem('complaints', JSON.stringify(complaints));
            
            updateAllViews();
            closeModal();
            alert('Complaint deleted successfully');
        }
    }

    function printFeedback(complaint) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Feedback for Complaint #${complaint.id}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h1 { color: #166088; }
                    .complaint-info { margin-bottom: 20px; }
                    .feedback { margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #166088; }
                </style>
            </head>
            <body>
                <h1>Feedback for Complaint #${complaint.id}</h1>
                <div class="complaint-info">
                    <p><strong>Type:</strong> ${complaint.type}</p>
                    <p><strong>Submitted by:</strong> ${complaint.residentName}</p>
                    <p><strong>Date:</strong> ${complaint.date}</p>
                    <p><strong>Location:</strong> ${complaint.location}</p>
                </div>
                <div class="feedback">
                    <h3>Admin Feedback/Solution</h3>
                    <p>${complaint.resolutionNotes}</p>
                </div>
                <script>
                    setTimeout(function() {
                        window.print();
                        window.close();
                    }, 500);
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    }

    function generateReport() {
        const currentUser = getCurrentUser();
        if (!currentUser || currentUser.role !== 'admin') {
            alert('Only admin can generate reports');
            return;
        }
        
        const currentDate = new Date().toLocaleDateString();
        const statusFilterValue = manageStatusFilter.value;
        const searchValue = searchComplaints.value.toLowerCase();
        
        let filteredComplaints = [...complaints];
        
        if (statusFilterValue !== 'all') {
            filteredComplaints = filteredComplaints.filter(c => c.status === statusFilterValue);
        }
        
        if (searchValue) {
            filteredComplaints = filteredComplaints.filter(c => 
                c.type.toLowerCase().includes(searchValue) ||
                c.residentName.toLowerCase().includes(searchValue) ||
                c.location.toLowerCase().includes(searchValue)
            );
        }
        
        const reportWindow = window.open('', '_blank');
        reportWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Barangay Complaints Report</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h1 { color: #166088; text-align: center; }
                    .report-info { margin-bottom: 20px; text-align: center; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #166088; color: white; }
                    .status-badge { padding: 3px 8px; border-radius: 3px; font-size: 0.8em; }
                    .status-pending { background-color: #ffc107; color: black; }
                    .status-in-progress { background-color: #17a2b8; color: white; }
                    .status-resolved { background-color: #28a745; color: white; }
                    .footer { margin-top: 30px; text-align: right; font-style: italic; }
                    @page { size: landscape; }
                </style>
            </head>
            <body>
                <h1>Barangay Complaints Report</h1>
                <div class="report-info">
                    <p>Generated on: ${currentDate}</p>
                    <p>Total Complaints: ${filteredComplaints.length}</p>
                    ${statusFilterValue !== 'all' ? `<p>Filtered by status: ${statusFilterValue}</p>` : ''}
                    ${searchValue ? `<p>Search term: "${searchValue}"</p>` : ''}
                </div>
                
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Type</th>
                            <th>Resident</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Location</th>
                            <th>Assigned Staff</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredComplaints.map(c => `
                            <tr>
                                <td>${c.id}</td>
                                <td>${c.type}</td>
                                <td>${c.residentName}</td>
                                <td>${c.date}</td>
                                <td><span class="status-badge status-${c.status.toLowerCase().replace(' ', '-')}">${c.status}</span></td>
                                <td>${c.location}</td>
                                <td>${c.assignedStaff || 'Not assigned'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="footer">
                    <p>Barangay Complaint & Request Management System</p>
                </div>
                
                <script>
                    setTimeout(function() {
                        window.print();
                        window.close();
                    }, 500);
                </script>
            </body>
            </html>
        `);
        reportWindow.document.close();
    }

    function getCurrentUser() {
        return JSON.parse(sessionStorage.getItem('currentUser'));
    }

    function resetAllForms() {
        [loginForm, signupForm, complaintForm, adminReportForm].forEach(form => form?.reset());
    }

    function populateAdminComplaintDropdown() {
        adminComplaintSelect.innerHTML = '<option value="" disabled selected>Select a complaint to respond to</option>';
        
        const pendingComplaints = complaints.filter(c => c.status === 'Pending' || c.status === 'In Progress');
        
        pendingComplaints.forEach(c => {
            const option = document.createElement('option');
            option.value = c.id;
            option.textContent = `ID: ${c.id} - ${c.type} (${c.residentName})`;
            adminComplaintSelect.appendChild(option);
        });
    }

    function setupEventListeners() {
        showSignup.addEventListener('click', (e) => {
            e.preventDefault();
            loginPage.style.display = 'none';
            signupPage.style.display = 'flex';
        });

        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            signupPage.style.display = 'none';
            loginPage.style.display = 'flex';
        });

        togglePasswordLogin.addEventListener('click', () => 
            togglePasswordVisibility(passwordLogin, togglePasswordLogin));
        
        togglePasswordSignup.addEventListener('click', () => 
            togglePasswordVisibility(passwordSignup, togglePasswordSignup));
        
        toggleConfirmPassword.addEventListener('click', () => 
            togglePasswordVisibility(confirmPassword, toggleConfirmPassword));

        loginForm.addEventListener('submit', handleLogin);
        signupForm.addEventListener('submit', handleSignup);
        complaintForm.addEventListener('submit', handleComplaintSubmit);
        adminReportForm.addEventListener('submit', handleAdminReportSubmit);

        logoutBtn.addEventListener('click', logout);
        statusFilter.addEventListener('change', updateComplaintsTable);
        manageStatusFilter.addEventListener('change', updateManageComplaintsTable);
        searchComplaints.addEventListener('input', updateManageComplaintsTable);
        generateReportBtn.addEventListener('click', generateReport);
        publicTypeFilter.addEventListener('change', updateResolvedComplaintsGrid);
        closeModalBtn.addEventListener('click', closeModal);
    }

    function togglePasswordVisibility(inputField, toggleButton) {
        if (inputField.type === 'password') {
            inputField.type = 'text';
            toggleButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 6c-3.95 0-7.2 2.3-9 6 1.8 3.7 5.05 6 9 6s7.2-2.3 9-6c-1.8-3.7-5.05-6-9-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6.5A2.5 2.5 0 0 0 9.5 12 2.5 2.5 0 0 0 12 14.5 2.5 2.5 0 0 0 14.5 12 2.5 2.5 0 0 0 12 9.5z"/>
                    <path d="M22 2L2 22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            `;
        } else {
            inputField.type = 'password';
            toggleButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 6c-3.95 0-7.2 2.3-9 6 1.8 3.7 5.05 6 9 6s7.2-2.3 9-6c-1.8-3.7-5.05-6-9-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6.5A2.5 2.5 0 0 0 9.5 12 2.5 2.5 0 0 0 12 14.5 2.5 2.5 0 0 0 14.5 12 2.5 2.5 0 0 0 12 9.5z"/>
                </svg>
            `;
        }
    }

    init();
});
