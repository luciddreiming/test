document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
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

    // Data
    let userAccounts = JSON.parse(localStorage.getItem('userAccounts')) || [
        { 
            username: 'admin', 
            password: 'admin123', 
            name: 'Administrator', 
            email: 'admin@barangay.gov',
            role: 'admin'
        },
        { 
            username: 'staff', 
            password: 'staff123', 
            name: 'Barangay Staff', 
            email: 'staff@barangay.gov',
            role: 'staff'
        },
        { 
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
            residentUsername: 'resident',
            type: 'Garbage Collection',
            details: 'Garbage has not been collected for 3 days in our area',
            location: 'Purok 5, near basketball court',
            date: new Date().toISOString().split('T')[0],
            status: 'Resolved',
            photo: null,
            assignedStaff: 'Staff 1',
            resolutionNotes: 'Garbage was collected the following day',
            createdBy: 'resident'
        },
        {
            id: 2,
            residentName: 'Maria Santos',
            residentUsername: 'resident',
            type: 'Road Repair',
            details: 'Large pothole causing traffic and accidents',
            location: 'Main road near barangay hall',
            date: new Date().toISOString().split('T')[0],
            status: 'In Progress',
            photo: null,
            assignedStaff: 'Staff 2',
            resolutionNotes: '',
            createdBy: 'resident'
        },
        {
            id: 3,
            residentName: 'Pedro Reyes',
            residentUsername: 'resident',
            type: 'Streetlight Repair',
            details: 'Streetlight not working for 1 week',
            location: 'Corner of Purok 3 and Purok 4',
            date: new Date().toISOString().split('T')[0],
            status: 'Pending',
            photo: null,
            assignedStaff: '',
            resolutionNotes: '',
            createdBy: 'resident'
        }
    ];

    // Initialize
    function init() {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (currentUser) {
            showDashboard(currentUser);
        }
        initEventListeners();
    }

    function initEventListeners() {
        // Login/Signup
        showSignup.addEventListener('click', function(e) {
            e.preventDefault();
            loginPage.style.display = 'none';
            signupPage.style.display = 'flex';
        });

        showLogin.addEventListener('click', function(e) {
            e.preventDefault();
            signupPage.style.display = 'none';
            loginPage.style.display = 'flex';
        });

        togglePasswordLogin.addEventListener('click', function() {
            togglePasswordVisibility(passwordLogin, togglePasswordLogin);
        });

        togglePasswordSignup.addEventListener('click', function() {
            togglePasswordVisibility(passwordSignup, togglePasswordSignup);
        });

        toggleConfirmPassword.addEventListener('click', function() {
            togglePasswordVisibility(confirmPassword, toggleConfirmPassword);
        });

        passwordLogin.addEventListener('keyup', checkCapsLock);
        passwordLogin.addEventListener('keydown', checkCapsLock);
        passwordSignup.addEventListener('keyup', checkCapsLock);
        passwordSignup.addEventListener('keydown', checkCapsLock);
        confirmPassword.addEventListener('keyup', checkCapsLock);
        confirmPassword.addEventListener('keydown', checkCapsLock);

        loginForm.addEventListener('submit', handleLogin);
        signupForm.addEventListener('submit', handleSignup);
        logoutBtn.addEventListener('click', logout);

        // Complaint system
        complaintForm.addEventListener('submit', handleComplaintSubmit);
        adminReportForm.addEventListener('submit', handleAdminReportSubmit);
        statusFilter.addEventListener('change', updateComplaintsTable);
        manageStatusFilter.addEventListener('change', updateManageComplaintsTable);
        searchComplaints.addEventListener('input', updateManageComplaintsTable);
        generateReportBtn.addEventListener('click', generateReport);
        publicTypeFilter.addEventListener('change', updateResolvedComplaintsGrid);
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Helper functions
    function togglePasswordVisibility(inputField, toggleButton) {
        if (inputField.type === 'password') {
            inputField.type = 'text';
            toggleButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 6c-3.95 0-7.2 2.3-9 6 1.8 3.7 5.05 6 9 6s7.2-2.3 9-6c-1.8-3.7-5.05-6-9-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6.5A2.5 2.5 0 0 0 9.5 12 2.5 2.5 0 0 0 12 14.5 2.5 2.5 0 0 0 14.5 12 2.5 2.5 0 0 0 12 9.5z"/>
                    <path d="M22 2L2 22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            `;
        } else {
            inputField.type = 'password';
            toggleButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 6c-3.95 0-7.2 2.3-9 6 1.8 3.7 5.05 6 9 6s7.2-2.3 9-6c-1.8-3.7-5.05-6-9-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6.5A2.5 2.5 0 0 0 9.5 12 2.5 2.5 0 0 0 12 14.5 2.5 2.5 0 0 0 14.5 12 2.5 2.5 0 0 0 12 9.5z"/>
                </svg>
            `;
        }
    }

    function checkCapsLock(e) {
        const isCapsLockOn = e.getModifierState && e.getModifierState('CapsLock');

        if (e.target === passwordLogin) {
            capsWarningLogin.style.display = isCapsLockOn ? 'block' : 'none';
        } else if (e.target === passwordSignup || e.target === confirmPassword) {
            capsWarningSignup.style.display = isCapsLockOn ? 'block' : 'none';
        }
    }

    function handleLogin(e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        // Basic validation
        if (!username || !password) {
            alert('Please enter both username and password');
            return;
        }

        const user = userAccounts.find(account => 
            account.username === username && account.password === password
        );

        if (user) {
            // Store user in sessionStorage
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            
            showDashboard(user);
            
            // Reset the form
            loginForm.reset();
        } else {
            alert('Invalid username or password');
            // Clear password field for security
            document.getElementById('password').value = '';
        }
    }

    function showDashboard(user) {
        // Hide login/signup, show dashboard
        loginPage.style.display = 'none';
        signupPage.style.display = 'none';
        dashboardPage.style.display = 'block';
        
        // Update UI based on user role
        updateUIForUserRole(user.role);
        
        // Initialize complaint tables and grid
        updateComplaintsTable();
        updateManageComplaintsTable();
        updateResolvedComplaintsGrid();
    }

    function updateUIForUserRole(role) {
        const userRoleDisplay = document.getElementById('userRoleDisplay');
        const staffDashboard = document.getElementById('staffDashboard');
        const complaintFormSection = document.getElementById('complaintFormSection');
        const adminReportFormSection = document.getElementById('adminReportFormSection');
        const generateReportBtn = document.getElementById('generateReportBtn');
        
        userRoleDisplay.textContent = role.charAt(0).toUpperCase() + role.slice(1);
        
        // Update management title for admin
        if (role === 'admin') {
            managementTitle.textContent = 'All Complaints/Requests';
        }
        
        // Show/hide sections based on role
        if (role === 'resident') {
            staffDashboard.style.display = 'none';
            complaintFormSection.style.display = 'block';
            adminReportFormSection.style.display = 'none';
            generateReportBtn.style.display = 'none';
        } 
        else if (role === 'staff') {
            staffDashboard.style.display = 'block';
            complaintFormSection.style.display = 'none';
            adminReportFormSection.style.display = 'none';
            generateReportBtn.style.display = 'none';
        } 
        else if (role === 'admin') {
            staffDashboard.style.display = 'block';
            complaintFormSection.style.display = 'none';
            adminReportFormSection.style.display = 'block';
            generateReportBtn.style.display = 'block';
        }
    }

    function handleSignup(e) {
        e.preventDefault();
    
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const username = document.getElementById('signupUsername').value.trim();
        const password = document.getElementById('signupPassword').value;
        const confirmPasswordValue = document.getElementById('signupConfirmPassword').value;
        const role = document.getElementById('userRole').value;
    
        // Validation
        if (!name || !email || !username || !password || !confirmPasswordValue || !role) {
            alert('Please fill in all fields');
            return;
        }
    
        if (password !== confirmPasswordValue) {
            alert('Passwords do not match');
            return;
        }
    
        if (userAccounts.some(account => account.username === username)) {
            alert('Username already exists');
            return;
        }
    
        if (userAccounts.some(account => account.email === email)) {
            alert('Email already registered');
            return;
        }
    
        // Validate password strength (optional)
        if (password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }
    
        const newUser = { 
            username, 
            password, 
            name, 
            email,
            role 
        };
    
        userAccounts.push(newUser);
        localStorage.setItem('userAccounts', JSON.stringify(userAccounts));
    
        signupPage.style.display = 'none';
        loginPage.style.display = 'flex';
        signupForm.reset();
        alert('Account created successfully! Please login.');
    }

    function logout() {
        sessionStorage.removeItem('currentUser');
        loginPage.style.display = 'flex';
        signupPage.style.display = 'none';
        dashboardPage.style.display = 'none';
        
        loginForm.reset();
        signupForm.reset();
        complaintForm.reset();
        adminReportForm.reset();
    }

    // Complaint system functions
    function handleComplaintSubmit(e) {
        e.preventDefault();
        
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (!currentUser) {
            alert('Please login to submit a complaint');
            return;
        }
        
        // Only residents can submit complaints
        if (currentUser.role !== 'resident') {
            alert('Only residents can submit complaints');
            return;
        }
        
        const type = document.getElementById('complaintType').value;
        const details = document.getElementById('complaintDetails').value.trim();
        const location = document.getElementById('complaintLocation').value.trim();
        const photoFile = document.getElementById('photoUpload').files[0];
        
        if (!type || !details || !location) {
            alert('Please fill in all required fields');
            return;
        }
        
        const newComplaint = {
            id: complaints.length > 0 ? Math.max(...complaints.map(c => c.id)) + 1 : 1,
            residentName: currentUser.name,
            residentUsername: currentUser.username,
            type: type,
            details: details,
            location: location,
            date: new Date().toISOString().split('T')[0],
            status: 'Pending',
            photo: photoFile ? URL.createObjectURL(photoFile) : null,
            assignedStaff: '',
            resolutionNotes: '',
            createdBy: currentUser.username
        };
        
        complaints.push(newComplaint);
        localStorage.setItem('complaints', JSON.stringify(complaints));
        
        updateComplaintsTable();
        updateManageComplaintsTable();
        updateResolvedComplaintsGrid();
        
        alert('Your complaint/request has been submitted successfully!');
        complaintForm.reset();
    }

    function handleAdminReportSubmit(e) {
        e.preventDefault();
        
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (!currentUser || currentUser.role !== 'admin') {
            alert('Only admin can submit reports');
            return;
        }
        
        const type = document.getElementById('adminReportType').value;
        const details = document.getElementById('adminReportDetails').value.trim();
        const location = document.getElementById('adminReportLocation').value.trim();
        const feedback = document.getElementById('adminReportFeedback').value.trim();
        const photoFile = document.getElementById('adminPhotoUpload').files[0];
        
        if (!type || !details || !location || !feedback) {
            alert('Please fill in all required fields');
            return;
        }
        
        const newComplaint = {
            id: complaints.length > 0 ? Math.max(...complaints.map(c => c.id)) + 1 : 1,
            residentName: 'Barangay Administration',
            residentUsername: 'admin',
            type: type,
            details: details,
            location: location,
            date: new Date().toISOString().split('T')[0],
            status: 'Pending',
            photo: photoFile ? URL.createObjectURL(photoFile) : null,
            assignedStaff: '',
            resolutionNotes: feedback,
            createdBy: currentUser.username,
            isAdminReport: true
        };
        
        complaints.push(newComplaint);
        localStorage.setItem('complaints', JSON.stringify(complaints));
        
        updateComplaintsTable();
        updateManageComplaintsTable();
        updateResolvedComplaintsGrid();
        
        alert('Report submitted successfully for staff processing!');
        adminReportForm.reset();
    }

    function updateComplaintsTable() {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (!currentUser) return;
        
        const statusFilterValue = statusFilter.value;
        const complaintsList = document.getElementById('complaintsList');
        complaintsList.innerHTML = '';
        
        let filteredComplaints = complaints.filter(complaint => 
            complaint.residentUsername === currentUser.username
        );
        
        if (statusFilterValue !== 'all') {
            filteredComplaints = filteredComplaints.filter(complaint => 
                complaint.status === statusFilterValue
            );
        }
        
        if (filteredComplaints.length === 0) {
            complaintsList.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center;">No complaints found</td>
                </tr>
            `;
            return;
        }
        
        filteredComplaints.forEach(complaint => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${complaint.id}</td>
                <td>${complaint.type}</td>
                <td>${complaint.date}</td>
                <td><span class="status-badge status-${complaint.status.toLowerCase().replace(' ', '-')}">${complaint.status}</span></td>
                <td>${complaint.location}</td>
                <td>
                    <button class="action-btn view-btn" data-id="${complaint.id}">View</button>
                </td>
            `;
            complaintsList.appendChild(row);
        });
        
        // Add event listeners to view buttons
        document.querySelectorAll('.view-btn').forEach(button => {
            button.addEventListener('click', function() {
                const complaintId = parseInt(this.getAttribute('data-id'));
                showComplaintDetails(complaintId);
            });
        });
    }

    function updateManageComplaintsTable() {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'staff')) {
            return;
        }
        
        const statusFilterValue = manageStatusFilter.value;
        const searchValue = searchComplaints.value.toLowerCase();
        const manageComplaintsList = document.getElementById('manageComplaintsList');
        manageComplaintsList.innerHTML = '';
        
        let filteredComplaints = [...complaints];
        
        if (statusFilterValue !== 'all') {
            filteredComplaints = filteredComplaints.filter(complaint => 
                complaint.status === statusFilterValue
            );
        }
        
        if (searchValue) {
            filteredComplaints = filteredComplaints.filter(complaint => 
                complaint.type.toLowerCase().includes(searchValue) ||
                complaint.residentName.toLowerCase().includes(searchValue) ||
                complaint.location.toLowerCase().includes(searchValue)
            );
        }
        
        if (filteredComplaints.length === 0) {
            manageComplaintsList.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center;">No complaints found</td>
                </tr>
            `;
            return;
        }
        
        filteredComplaints.forEach(complaint => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${complaint.id}</td>
                <td>${complaint.type}</td>
                <td>${complaint.residentName}</td>
                <td>${complaint.date}</td>
                <td><span class="status-badge status-${complaint.status.toLowerCase().replace(' ', '-')}">${complaint.status}</span></td>
                <td>${complaint.location}</td>
                <td>
                    <button class="action-btn view-btn" data-id="${complaint.id}">View</button>
                    ${currentUser.role === 'admin' ? `<button class="action-btn delete-btn" data-id="${complaint.id}">Delete</button>` : ''}
                </td>
            `;
            manageComplaintsList.appendChild(row);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.view-btn').forEach(button => {
            button.addEventListener('click', function() {
                const complaintId = parseInt(this.getAttribute('data-id'));
                showComplaintDetails(complaintId);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function() {
                const complaintId = parseInt(this.getAttribute('data-id'));
                deleteComplaint(complaintId);
            });
        });
    }

    function updateResolvedComplaintsGrid() {
        const typeFilterValue = publicTypeFilter.value;
        const resolvedComplaintsGrid = document.getElementById('resolvedComplaintsGrid');
        resolvedComplaintsGrid.innerHTML = '';
        
        let filteredComplaints = complaints.filter(complaint => 
            complaint.status === 'Resolved'
        );
        
        if (typeFilterValue !== 'all') {
            filteredComplaints = filteredComplaints.filter(complaint => 
                complaint.type === typeFilterValue
            );
        }
        
        if (filteredComplaints.length === 0) {
            resolvedComplaintsGrid.innerHTML = `
                <div class="no-complaints">
                    <p>No resolved complaints to display</p>
                </div>
            `;
            return;
        }
        
        filteredComplaints.forEach(complaint => {
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
        
        // Add event listeners to view buttons
        document.querySelectorAll('.view-btn').forEach(button => {
            button.addEventListener('click', function() {
                const complaintId = parseInt(this.getAttribute('data-id'));
                showComplaintDetails(complaintId);
            });
        });
    }

    function showComplaintDetails(complaintId) {
        const complaint = complaints.find(c => c.id === complaintId);
        if (!complaint) return;
        
        const modal = document.getElementById('complaintDetailsModal');
        const modalTitle = document.getElementById('modalComplaintTitle');
        const modalBody = document.getElementById('modalComplaintBody');
        const modalActions = document.getElementById('modalActions');
        
        modalTitle.textContent = `${complaint.type} (ID: ${complaint.id})`;
        
        // Check if this is an admin report to show the feedback differently
        const isAdminReport = complaint.isAdminReport || false;
        
        modalBody.innerHTML = `
            <div class="complaint-detail">
                <h3>Complaint Details</h3>
                <p>${complaint.details}</p>
            </div>
            <div class="complaint-meta">
                <div>
                    <strong>Submitted by:</strong> ${complaint.residentName}
                </div>
                <div>
                    <strong>Date:</strong> ${complaint.date}
                </div>
                <div>
                    <strong>Location:</strong> ${complaint.location}
                </div>
                <div>
                    <strong>Status:</strong> <span class="status-badge status-${complaint.status.toLowerCase().replace(' ', '-')}">${complaint.status}</span>
                </div>
                ${complaint.assignedStaff ? `<div><strong>Assigned Staff:</strong> ${complaint.assignedStaff}</div>` : ''}
                ${isAdminReport ? `
                <div class="admin-feedback">
                    <h3>Admin Feedback/Solution</h3>
                    <p>${complaint.resolutionNotes}</p>
                </div>
                ` : ''}
                ${!isAdminReport && complaint.resolutionNotes ? `
                <div class="resolution-notes">
                    <strong>Resolution Notes:</strong> ${complaint.resolutionNotes}
                </div>
                ` : ''}
            </div>
            ${complaint.photo ? `<div class="complaint-photo">
                <img src="${complaint.photo}" alt="Complaint photo">
            </div>` : ''}
        `;
        
        // Update action buttons based on user role
        modalActions.innerHTML = '';
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        
        if (currentUser) {
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
                
                // Only admin can delete complaints
                if (currentUser.role === 'admin') {
                    modalActions.innerHTML += `
                        <button class="action-btn delete-btn" id="deleteBtn" data-id="${complaint.id}">Delete</button>
                    `;
                }
                
                document.getElementById('assignToMeBtn')?.addEventListener('click', function() {
                    assignComplaintToMe(complaintId);
                });
                
                document.getElementById('startProgressBtn')?.addEventListener('click', function() {
                    updateComplaintStatus(complaintId, 'In Progress');
                });
                
                document.getElementById('resolveBtn')?.addEventListener('click', function() {
                    // Skip resolution notes prompt for admin reports since they already have feedback
                    if (isAdminReport) {
                        updateComplaintStatus(complaintId, 'Resolved');
                    } else {
                        const resolutionNotes = prompt('Enter resolution notes:');
                        if (resolutionNotes !== null) {
                            updateComplaintStatus(complaintId, 'Resolved', resolutionNotes);
                        }
                    }
                });
                
                document.getElementById('deleteBtn')?.addEventListener('click', function() {
                    deleteComplaint(complaintId);
                });
            }
        }
        
        modal.style.display = 'block';
    }

    function closeModal() {
        const modal = document.getElementById('complaintDetailsModal');
        modal.style.display = 'none';
    }

    function assignComplaintToMe(complaintId) {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const complaint = complaints.find(c => c.id === complaintId);
        
        if (complaint) {
            complaint.assignedStaff = currentUser.name;
            complaint.status = 'In Progress';
            localStorage.setItem('complaints', JSON.stringify(complaints));
            
            updateComplaintsTable();
            updateManageComplaintsTable();
            updateResolvedComplaintsGrid();
            closeModal();
            
            alert('Complaint has been assigned to you and marked as In Progress');
        }
    }

    function updateComplaintStatus(complaintId, status, resolutionNotes = '') {
        const complaint = complaints.find(c => c.id === complaintId);
        
        if (complaint) {
            complaint.status = status;
            if (resolutionNotes && !complaint.isAdminReport) {
                complaint.resolutionNotes = resolutionNotes;
            }
            localStorage.setItem('complaints', JSON.stringify(complaints));
            
            updateComplaintsTable();
            updateManageComplaintsTable();
            updateResolvedComplaintsGrid();
            closeModal();
            
            alert(`Complaint status updated to ${status}`);
        }
    }

    function deleteComplaint(complaintId) {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (!currentUser || currentUser.role !== 'admin') {
            alert('Only admin can delete complaints');
            return;
        }
        
        if (confirm('Are you sure you want to delete this complaint?')) {
            complaints = complaints.filter(c => c.id !== complaintId);
            localStorage.setItem('complaints', JSON.stringify(complaints));
            
            updateComplaintsTable();
            updateManageComplaintsTable();
            updateResolvedComplaintsGrid();
            
            alert('Complaint deleted successfully');
        }
    }

    function generateReport() {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (!currentUser || currentUser.role !== 'admin') {
            alert('Only admin can generate reports');
            return;
        }
        
        const currentDate = new Date().toLocaleDateString();
        const statusFilterValue = manageStatusFilter.value;
        const searchValue = searchComplaints.value.toLowerCase();
        
        let filteredComplaints = [...complaints];
        
        if (statusFilterValue !== 'all') {
            filteredComplaints = filteredComplaints.filter(complaint => 
                complaint.status === statusFilterValue
            );
        }
        
        if (searchValue) {
            filteredComplaints = filteredComplaints.filter(complaint => 
                complaint.type.toLowerCase().includes(searchValue) ||
                complaint.residentName.toLowerCase().includes(searchValue) ||
                complaint.location.toLowerCase().includes(searchValue)
            );
        }
        
        const reportHtml = `
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
                        ${filteredComplaints.map(complaint => `
                            <tr>
                                <td>${complaint.id}</td>
                                <td>${complaint.type}</td>
                                <td>${complaint.residentName}</td>
                                <td>${complaint.date}</td>
                                <td><span class="status-badge status-${complaint.status.toLowerCase().replace(' ', '-')}">${complaint.status}</span></td>
                                <td>${complaint.location}</td>
                                <td>${complaint.assignedStaff || 'Not assigned'}</td>
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
        `;
        
        const reportWindow = window.open('', '_blank');
        reportWindow.document.open();
        reportWindow.document.write(reportHtml);
        reportWindow.document.close();
    }

    // Initialize the application
    init();
});