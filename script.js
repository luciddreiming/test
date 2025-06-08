document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const containers = document.querySelectorAll(".container");
  const showSignupLink = document.getElementById("show-signup");
  const showLoginLink = document.getElementById("show-login");
  const loginContainer = document.getElementById("login-container");
  const signupContainer = document.getElementById("signup-container");
  const roleSelectionContainer = document.getElementById("role-selection-container");
  const residentContainer = document.getElementById("resident-container");
  const staffContainer = document.getElementById("staff-container");
  const adminContainer = document.getElementById("admin-container");
  const staffDashboard = document.getElementById("staff-dashboard");
  const adminDashboard = document.getElementById("admin-dashboard");
  const requestFormContainer = document.getElementById("request-form-container");
  const complaintFormContainer = document.getElementById("complaint-form-container");
  const othersFormContainer = document.getElementById("other-form-container");
  const trackingContainer = document.getElementById("tracking-container");
  const trackingBtns = document.querySelectorAll("#tracking-btn, .tracking-btn");
  const togglePasswordBtns = document.querySelectorAll(".toggle-password");
  const notifIcon = document.getElementById("notif-icon");
  const notifPanel = document.getElementById("notif-panel");
  const splitScreenContainer = document.getElementById("split-screen-container");
  const fullScreenContainer = document.getElementById("full-screen-container");
  const statusBar = document.querySelector(".status-bar");

  // Other Services Elements - Check if elements exist before using them
  const serviceType = document.getElementById("serviceType");
  const serviceDetails = document.getElementById("serviceDetails");
  const donationAmountGroup = document.getElementById("donationAmountGroup");
  const donationAmount = document.getElementById("donationAmount");
  const otherServicesForm = document.getElementById("otherServicesForm");
  const backToServicesFromOthers = document.getElementById("backToServicesFromOthers");
  const serviceTypeFilter = document.getElementById("serviceTypeFilter");
  const servicesList = document.getElementById("servicesList");

  // Data storage
  let selectedRole = null;
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let currentUser = null;
  let requests = JSON.parse(localStorage.getItem("requests")) || [];
  let complaints = JSON.parse(localStorage.getItem("complaints")) || [];
  let otherServices = JSON.parse(localStorage.getItem("otherServices")) || [];

  // Utility function to hide all containers
  function hideAllContainers() {
    containers.forEach((container) => {
      if (container) container.style.display = "none";
    });
    if (notifIcon) notifIcon.style.display = "none";
  }

  // Toggle between split-screen and full-screen views
  function showSplitScreen() {
    if (splitScreenContainer) splitScreenContainer.style.display = "block";
    if (fullScreenContainer) fullScreenContainer.style.display = "none";
    if (statusBar) statusBar.style.display = "none";
  }

  function showFullScreen() {
    if (splitScreenContainer) splitScreenContainer.style.display = "none";
    if (fullScreenContainer) fullScreenContainer.style.display = "block";
    if (statusBar) statusBar.style.display = "block";
  }

  // Toggle password visibility
  function togglePasswordVisibility(inputId, toggleBtn) {
    const input = document.getElementById(inputId);
    if (!input || !toggleBtn) return;
    
    if (input.type === "password") {
      input.type = "text";
      toggleBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 6c-3.95 0-7.2 2.3-9 6 1.8 3.7 5.05 6 9 6s7.2-2.3 9-6c-1.8-3.7-5.05-6-9-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6.5A2.5 2.5 0 0 0 9.5 12 2.5 2.5 0 0 0 12 14.5 2.5 2.5 0 0 0 14.5 12 2.5 2.5 0 0 0 12 9.5z"/>
        </svg>
      `;
    } else {
      input.type = "password";
      toggleBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 6c-3.95 0-7.2 2.3-9 6 1.8 3.7 5.05 6 9 6s7.2-2.3 9-6c-1.8-3.7-5.05-6-9-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6.5A2.5 2.5 0 0 0 9.5 12 2.5 2.5 0 0 0 12 14.5 2.5 2.5 0 0 0 14.5 12 2.5 2.5 0 0 0 12 9.5z"/>
          <path d="M22 2L2 22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `;
    }
  }

  // Setup password toggle buttons
  togglePasswordBtns.forEach(btn => {
    if (!btn) return;
    const inputId = btn.closest('.password-container')?.querySelector('input')?.id;
    if (inputId) {
      btn.addEventListener("click", function() {
        togglePasswordVisibility(inputId, this);
      });
    }
  });

  // Initialize - show role selection first
  hideAllContainers();
  showSplitScreen();
  if (roleSelectionContainer) roleSelectionContainer.style.display = "block";

  // Role selection handler
  document.querySelectorAll(".role-card").forEach((card) => {
    if (!card) return;
    card.addEventListener("click", function () {
      selectedRole = this.getAttribute("data-role");
      hideAllContainers();

      if (selectedRole === "staff" || selectedRole === "admin") {
        if (loginContainer) loginContainer.style.display = "block";
        if (document.getElementById("email")) document.getElementById("email").value = "";
        if (document.getElementById("password")) document.getElementById("password").value = "";
      } else {
        if (loginContainer) loginContainer.style.display = "block";
        if (document.getElementById("email")) document.getElementById("email").value = "";
        if (document.getElementById("password")) document.getElementById("password").value = "";
      }
    });
  });

  // Toggle between login and signup forms
  showSignupLink?.addEventListener("click", function (e) {
    e.preventDefault();
    if (loginContainer) loginContainer.style.display = "none";
    if (signupContainer) signupContainer.style.display = "block";
  });

  showLoginLink?.addEventListener("click", function (e) {
    e.preventDefault();
    if (signupContainer) signupContainer.style.display = "none";
    if (loginContainer) loginContainer.style.display = "block";
  });

  // Signup form submission
  document.getElementById("signup-form")?.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("signup-email")?.value.trim();
    const firstName = document.getElementById("first-name")?.value.trim();
    const lastName = document.getElementById("last-name")?.value.trim();
    const userType = document.getElementById("user-type")?.value;
    const password = document.getElementById("signup-password")?.value;
    const confirmPassword = document.getElementById("confirm-password")?.value;

    // Validation
    if (!email || !firstName || !lastName || !userType || !password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (users.some((user) => user.email === email)) {
      alert("User with this email already exists!");
      return;
    }

    // Create new user
    const newUser = {
      email,
      firstName,
      lastName,
      userType,
      password,
      dateCreated: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Show role-specific instructions
    if (userType === "staff") {
      alert('Account created successfully! As staff, you will need to verify with "brgystff" after login.');
    } else if (userType === "admin") {
      alert('Account created successfully! As admin, you will need to verify with "admin" after login.');
    } else {
      alert("Account created successfully!");
    }

    // Clear form and show login
    this.reset();
    if (signupContainer) signupContainer.style.display = "none";
    if (loginContainer) loginContainer.style.display = "block";
  });

  // Login form submission
  document.getElementById("login-form")?.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value;

    // Find user
    const user = users.find((u) => u.email === email);

    // Validate credentials - only check against stored password
    if (!user || user.password !== password) {
      alert("Invalid email or password!");
      return;
    }

    currentUser = user;
    localStorage.setItem("loggedInResident", user.email);
    hideAllContainers();
    showFullScreen();

    // Redirect based on role
    switch (user.userType) {
      case "resident":
        if (residentContainer) residentContainer.style.display = "block";
        if (notifIcon )notifIcon.style.display = "inline-block";
        showResidentNotifications(user.email);
        break;
      case "staff":
        if (staffContainer) staffContainer.style.display = "block";
        break;
      case "admin":
        if (adminContainer) adminContainer.style.display = "block";
        break;
      default:
        if (roleSelectionContainer) roleSelectionContainer.style.display = "block";
    }
  });

  // Staff verification
  document.getElementById("staff-auth-form")?.addEventListener("submit", function (e) {
    e.preventDefault();
    const password = document.getElementById("staff-password")?.value;

    // Verify current user is actually staff
    if (!currentUser || currentUser.userType !== "staff") {
      alert("Invalid user session!");
      hideAllContainers();
      showSplitScreen();
      if (roleSelectionContainer) roleSelectionContainer.style.display = "block";
      return;
    }

    if (password === "brgystff") {
      hideAllContainers();
      if (staffDashboard) staffDashboard.style.display = "block";
      loadStaffDashboard();
    } else {
      alert("Invalid staff verification password!");
    }
  });

  // Admin verification
  document.getElementById("admin-auth-form")?.addEventListener("submit", function (e) {
    e.preventDefault();
    const password = document.getElementById("admin-password")?.value;

    // Verify current user is actually admin
    if (!currentUser || currentUser.userType !== "admin") {
      alert("Invalid user session!");
      hideAllContainers();
      showSplitScreen();
      if (roleSelectionContainer) roleSelectionContainer.style.display = "block";
      return;
    }

    if (password === "admin") {
      hideAllContainers();
      if (adminDashboard) adminDashboard.style.display = "block";
      loadAdminDashboard();
    } else {
      alert("Invalid admin verification password!");
    }
  });

  // Service card click handlers
  document.querySelectorAll(".service-btn").forEach((btn) => {
    if (!btn) return;
    btn.addEventListener("click", function () {
      const serviceType = this.getAttribute("data-service");
      hideAllContainers();

      switch (serviceType) {
        case "request":
          if (requestFormContainer) requestFormContainer.style.display = "block";
          break;
        case "complaint":
          if (complaintFormContainer) complaintFormContainer.style.display = "block";
          break;
        case "other":
          if (othersFormContainer) othersFormContainer.style.display = "block";
          updateServicesTable();
          break;
      }
    });
  });

  // My Submissions button handlers
trackingBtns.forEach(btn => {
  if (!btn) return;
  btn.addEventListener("click", function() {
    hideAllContainers();
    if (trackingContainer) trackingContainer.style.display = "block";
    loadResidentTracking();
    
    // Set the first tab as active by default
    const firstTabBtn = document.querySelector(".tracking-tabs .tab-btn[data-tab='requests']");
    if (firstTabBtn) firstTabBtn.click();
  });
});

  // Form submission handlers
  document.getElementById("request-form")?.addEventListener("submit", function (e) {
    e.preventDefault();
    submitRequest();
  });

  document.getElementById("complaint-form")?.addEventListener("submit", function (e) {
    e.preventDefault();
    submitComplaint();
  });

  // Other Services Form submission handler
  if (otherServicesForm) {
    otherServicesForm.addEventListener("submit", handleOtherServicesSubmit);
  }

  // Event listener for service type change to show/hide donation amount field
  if (serviceType) {
    serviceType.addEventListener("change", function() {
      if (donationAmountGroup) {
        donationAmountGroup.style.display = this.value === 'Donation' ? 'block' : 'none';
      }
    });
  }

  // Event listener for back button
  if (backToServicesFromOthers) {
    backToServicesFromOthers.addEventListener("click", function() {
      hideAllContainers();
      if (residentContainer) residentContainer.style.display = "block";
    });
  }

  // Event listener for filter change
  if (serviceTypeFilter) {
    serviceTypeFilter.addEventListener("change", updateServicesTable);
  }

  // Tab switching for resident tracking
  document.querySelectorAll(".tracking-tabs .tab-btn").forEach((btn) => {
    if (!btn) return;
    btn.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab");

      // Update active tab button
      document.querySelectorAll(".tracking-tabs .tab-btn").forEach((b) => {
        if (b) b.classList.remove("active");
      });
      this.classList.add("active");

      // Update active tab content
      document.querySelectorAll(".tracking-content .tab-content").forEach((content) => {
        if (content) content.classList.remove("active");
      });
      const tabContent = document.getElementById(`${tabId}-tab`);
      if (tabContent) tabContent.classList.add("active");
    });
  });

  // Logout functionality
  document.querySelectorAll(".logout-btn").forEach((btn) => {
    if (!btn) return;
    btn.addEventListener("click", function () {
      currentUser = null;
      selectedRole = null;
      localStorage.removeItem("loggedInResident");
      hideAllContainers();
      showSplitScreen();
      if (roleSelectionContainer) roleSelectionContainer.style.display = "block";
    });
  });

  // Back button functionality
  document.querySelectorAll("#back-btn").forEach((btn) => {
    if (!btn) return;
    btn.addEventListener("click", function () {
      hideAllContainers();

      if (currentUser) {
        switch (currentUser.userType) {
          case "resident":
            if (residentContainer) residentContainer.style.display = "block";
            break;
          case "staff":
            if (staffContainer) staffContainer.style.display = "block";
            break;
          case "admin":
            if (adminContainer) adminContainer.style.display = "block";
            break;
          default:
            if (loginContainer) loginContainer.style.display = "block";
        }
      } else {
        showSplitScreen();
        if (roleSelectionContainer) roleSelectionContainer.style.display = "block";
      }
    });
  });

  // Other Services Handling Functions
  function handleOtherServicesSubmit(e) {
    e.preventDefault();
    try {
      const currentUser = getCurrentUser();
      if (!currentUser || currentUser.userType !== 'resident') { 
        throw new Error('Only residents can submit other services');
      }

      const formData = collectOtherServicesFormData();
      validateOtherServicesForm(formData);
      
      const newService = createOtherService(formData, currentUser);
      otherServices.push(newService);
      localStorage.setItem('otherServices', JSON.stringify(otherServices));
      
      updateServicesTable();
      updateManageServicesTable();
      if (otherServicesForm) otherServicesForm.reset();
      if (donationAmountGroup) donationAmountGroup.style.display = 'none';
      
      console.log("Service submitted:", newService.id);
      alert('Service submitted successfully!');
    } catch (error) {
      console.error("Service submission error:", error.message);
      alert(error.message);
    }
  }

  function collectOtherServicesFormData() {
    return {
      serviceType: document.getElementById("serviceType")?.value,
      details: document.getElementById("serviceDetails")?.value.trim(),
      donationAmount: document.getElementById("donationAmount")?.value
    };
  }

  function validateOtherServicesForm(formData) {
    if (!formData.serviceType || !formData.details) {
      throw new Error('Please fill in all required fields');
    }
    
    if (formData.serviceType === 'Donation' && (!formData.donationAmount || formData.donationAmount <= 0)) {
      throw new Error('Please enter a valid donation amount');
    }
  }

  function createOtherService(formData, currentUser) {
    return {
      id: "SRV-" + Date.now(),
      email: currentUser.email,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      serviceType: formData.serviceType,
      details: formData.details,
      donationAmount: formData.serviceType === 'Donation' ? parseFloat(formData.donationAmount) : null,
      date: new Date().toISOString(),
      status: "Received",
      verifiedBy: '',
      verifiedAt: '',
      createdBy: currentUser.email,
      isVerified: false
    };
  }

  function updateServicesTable() {
    const currentUser = getCurrentUser();
    if (!currentUser || !servicesList) return;

    const typeFilterValue = serviceTypeFilter ? serviceTypeFilter.value : 'all';
    let filteredServices = otherServices.filter(s => 
      s.createdBy === currentUser.email
    );

    if (typeFilterValue !== 'all') {
      filteredServices = filteredServices.filter(s => s.serviceType === typeFilterValue);
    }

    servicesList.innerHTML = filteredServices
      .map(service => `
        <tr>
          <td>${service.id}</td>
          <td>${service.serviceType}</td>
          <td>${new Date(service.date).toLocaleDateString()}</td>
          <td class="status-${service.status.toLowerCase()}">${service.status}</td>
          <td>${service.details.substring(0, 30)}${service.details.length > 30 ? '...' : ''}</td>
          <td>
            <button class="action-btn view-btn" data-id="${service.id}" data-type="others"><img src="images/view.png" alt="View" style="width: 25px; height: auto;"></button>
          </td>
        </tr>
      `)
      .join('');

    // Add event listeners to view buttons
    document.querySelectorAll(".view-btn").forEach(btn => {
      if (!btn) return;
      btn.addEventListener("click", function() {
        const itemId = this.getAttribute("data-id");
        const itemType = this.getAttribute("data-type");
        showDetailsModal(itemId, itemType);
      });
    });
  }

  function updateManageServicesTable() {
    // This would be called from the staff or admin dashboard to update their view
    // Implementation would be similar to updateServicesTable but with more columns/actions
  }

  function getCurrentUser() {
    return currentUser;
  }

  // Load resident tracking data
  function loadResidentTracking() {
    if (!currentUser) return;

    // Filter for current user's submissions
    const userRequests = requests.filter((req) => req.email === currentUser.email);
    const userComplaints = complaints.filter((comp) => comp.email === currentUser.email);
    const userOtherServices = otherServices.filter((service) => service.createdBy === currentUser.email);

    // Populate requests table
    const requestsList = document.getElementById("requests-list");
    if (requestsList) {
      requestsList.innerHTML = userRequests
        .map(
          (req) => `
        <tr>
          <td>${req.id}</td>
          <td>${req.type}</td>
          <td>${new Date(req.date).toLocaleDateString()}</td>
          <td class="status-${req.status}">${req.status}</td>
          <td>
            <button class="action-btn view-btn" data-id="${req.id}" data-type="request"><img src="images/view.png" alt="View" style="width: 25px; height: auto;"></button>
          </td>
        </tr>
      `
        )
        .join("");
    }

    // Populate complaints table
    const complaintsList = document.getElementById("complaints-list");
    if (complaintsList) {
      complaintsList.innerHTML = userComplaints
        .map(
          (comp) => `
        <tr>
          <td>${comp.id}</td>
          <td>${comp.type}</td>
          <td>${new Date(comp.date).toLocaleDateString()}</td>
          <td class="status-${comp.status}">${comp.status}</td>
          <td>
            <button class="action-btn view-btn" data-id="${comp.id}" data-type="complaint"><img src="images/view.png" alt="View" style="width: 25px; height: auto;"></button>
          </td>
        </tr>
      `
        )
        .join("");
    }

    // Populate other services table
    const othersList = document.getElementById("others-list");
    if (othersList) {
      othersList.innerHTML = userOtherServices
        .map(
          (service) => `
        <tr>
          <td>${service.id}</td>
          <td>${service.serviceType}</td>
          <td>${new Date(service.date).toLocaleDateString()}</td>
          <td class="status-${service.status.toLowerCase()}">${service.status}</td>
          <td>
            <button class="action-btn view-btn" data-id="${service.id}" data-type="others"><img src="images/view.png" alt="View" style="width: 25px; height: auto;"></button>
          </td>
        </tr>
      `
        )
        .join("");
    }

    // Add event listeners to view buttons
    document.querySelectorAll(".view-btn").forEach(btn => {
      if (!btn) return;
      btn.addEventListener("click", function() {
        const itemId = this.getAttribute("data-id");
        const itemType = this.getAttribute("data-type");
        showDetailsModal(itemId, itemType);
      });
    });
  }

  // Show details in modal
  function showDetailsModal(itemId, itemType) {
    let item;
    let collection;
    
    switch(itemType) {
      case "request":
        collection = requests;
        item = requests.find(r => r.id === itemId);
        break;
      case "complaint":
        collection = complaints;
        item = complaints.find(c => c.id === itemId);
        break;
      case "others":
        collection = otherServices;
        item = otherServices.find(s => s.id === itemId);
        break;
      default:
        alert("Invalid item type");
        return;
    }
    
    if (!item) {
      alert("Item not found");
      return;
    }
    
    // Create modal
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.id = "details-modal";
    
    // Modal content
    const modalContent = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>${itemType === 'request' ? 'Request' : 
                itemType === 'complaint' ? 'Complaint' : 'Other Service'} Details</h2>
          <span class="close-btn">&times;</span>
        </div>
        <div class="modal-body">
          <div class="item-details">
            <p><strong>ID:</strong> ${item.id}</p>
            <p><strong>Status:</strong> <span class="tracking-btn-${item.status.toLowerCase()}">${item.status}</span></p>
            <p><strong>Date Submitted:</strong> ${new Date(item.date).toLocaleDateString()}</p>
            ${getItemSpecificDetails(item, itemType)}
          </div>
        </div>
        <div class="modal-footer">
          ${currentUser?.userType === 'admin' || 'staff' ? 
            `<button class="btn print-btn" data-id="${itemId}" data-type="${itemType}">Print</button>` : ''}
          ${currentUser?.userType === 'staff' ? 
            `<button class="btn delete-btn" data-id="${itemId}" data-type="${itemType}"><img src="images/delete.png" alt="Delete" style="width: auto; height: 16px;"></button>` : ''}
        </div>
      </div>
    `;
    
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    
    // Close modal when clicking X
    modal.querySelector(".close-btn")?.addEventListener("click", function() {
      modal.remove();
    });
    
    // Close modal when clicking outside
    modal.addEventListener("click", function(event) {
      if (event.target === modal) {
        modal.remove();
      }
    });
    
    // Print button handler
    modal.querySelector(".print-btn")?.addEventListener("click", function() {
      printItemDetails(item, itemType);
    });
    
    // Delete button handler (admin only)
    modal.querySelector(".delete-btn")?.addEventListener("click", function() {
      if (confirm("Are you sure you want to delete this item?")) {
        const index = collection.findIndex(i => i.id === itemId);
        if (index !== -1) {
          collection.splice(index, 1);
          localStorage.setItem(`${itemType === 'others' ? 'otherServices' : itemType + 's'}`, JSON.stringify(collection));
          
          // Update the appropriate collection variable
          if (itemType === "request") {
            requests = collection;
          } else if (itemType === "complaint") {
            complaints = collection;
          } else if (itemType === "others") {
            otherServices = collection;
          }
          
          // Reload the tracking view if we're there
          if (trackingContainer && trackingContainer.style.display === "block") {
            loadResidentTracking();
          }
          
          // Close modal
          modal.remove();
          alert("Item deleted successfully");
        }
      }
    });
    
    // Show modal
    modal.style.display = "block";
  }

  // Helper function to get item-specific details
  function getItemSpecificDetails(item, itemType) {
    let details = '';
    
    if (itemType === "request") {
      details = `
        <p><strong>Type:</strong> ${item.type}</p>
        <p><strong>Name:</strong> ${item.firstName} ${item.lastName}</p>
        <p><strong>Address:</strong> ${item.address}</p>
        <p><strong>Contact:</strong> ${item.contactNumber}</p>
        <p><strong>Date of Birth:</strong> ${item.dob}</p>
        <p><strong>Gender:</strong> ${item.gender}</p>
      `;
    } else if (itemType === "complaint") {
      details = `
        <p><strong>Type:</strong> ${item.type}</p>
        <p><strong>Name:</strong> ${item.firstName} ${item.lastName}</p>
        <p><strong>Address:</strong> ${item.address}</p>
        <p><strong>Contact:</strong> ${item.contactNumber}</p>
        <p><strong>Details:</strong> ${item.details}</p>
      `;
    } else if (itemType === "others") {
      details = `
        <p><strong>Service Type:</strong> ${item.serviceType}</p>
        <p><strong>Name:</strong> ${item.firstName} ${item.lastName}</p>
        <p><strong>Details:</strong> ${item.details}</p>
        ${item.serviceType === 'Donation' ? `<p><strong>Donation Amount:</strong> PHP ${item.donationAmount}</p>` : ''}
      `;
    }
    
    return details;
  }

  // Print item details
  function printItemDetails(item, itemType) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${itemType === 'request' ? 'Request' : 
                 itemType === 'complaint' ? 'Complaint' : 'Other Service'} Details #${item.id}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #166088; }
          .item-info { margin-bottom: 20px; }
          .status-badge { 
            display: inline-block;
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 0.9em;
            font-weight: bold;
          }
          .status-pending { background-color: #f39c12; color: black; }
          .status-received { background-color: #17a2b8; color: white; }
          .status-processing { background-color: #3498db; color: white; }
          .status-completed { background-color: #2ecc71; color: white; }
        </style>
      </head>
      <body>
        <h1>${itemType === 'request' ? 'Request' : 
              itemType === 'complaint' ? 'Complaint' : 'Other Service'} Details #${item.id}</h1>
        <div class="item-info">
          <p><strong>Status:</strong> <span class="status-badge status-${item.status.toLowerCase()}">${item.status}</span></p>
          <p><strong>Date Submitted:</strong> ${new Date(item.date).toLocaleDateString()}</p>
          ${getItemSpecificDetails(item, itemType)}
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

  // Submit request function
  function submitRequest() {
    const requestData = {
      id: "REQ-" + Date.now(),
      email: currentUser.email,
      type: document.getElementById("request")?.value,
      firstName: document.getElementById("first-name-req")?.value,
      lastName: document.getElementById("last-name-req")?.value,
      address: document.getElementById("address")?.value,
      contactNumber: document.getElementById("contact-number")?.value,
      dob: document.getElementById("dob")?.value,
      gender: document.getElementById("gender")?.value,
      date: new Date().toISOString(),
      status: "pending",
    };

    requests.push(requestData);
    localStorage.setItem("requests", JSON.stringify(requests));
    alert("Request submitted successfully!");

    hideAllContainers();
    if (residentContainer) residentContainer.style.display = "block";
  }

  // Submit complaint function
  function submitComplaint() {
    const complaintData = {
      id: "COMP-" + Date.now(),
      email: currentUser.email,
      type: document.getElementById("complaint-type")?.value,
      firstName: document.getElementById("first-name-comp")?.value,
      lastName: document.getElementById("last-name-comp")?.value,
      address: document.getElementById("address-comp")?.value,
      contactNumber: document.getElementById("contact-number-comp")?.value,
      details: document.getElementById("complaint-details")?.value,
      date: new Date().toISOString(),
      status: "pending",
    };

    complaints.push(complaintData);
    localStorage.setItem("complaints", JSON.stringify(complaints));
    alert("Complaint submitted successfully!");

    hideAllContainers();
    if (residentContainer) residentContainer.style.display = "block";
  }

  // Load staff dashboard function
  function loadStaffDashboard() {
    // Get all submissions
    requests = JSON.parse(localStorage.getItem("requests")) || [];
    complaints = JSON.parse(localStorage.getItem("complaints")) || [];
    otherServices = JSON.parse(localStorage.getItem("otherServices")) || [];
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];

    // Update counts
    const pendingCount = document.getElementById("pending-count");
    if (pendingCount) {
      pendingCount.textContent =
        requests.filter((r) => r.status === "pending").length +
        complaints.filter((c) => c.status === "pending").length +
        otherServices.filter((s) => s.status === "Received").length;
    }

    const processingCount = document.getElementById("processing-count");
    if (processingCount) {
      processingCount.textContent =
        requests.filter((r) => r.status === "processing").length +
        complaints.filter((c) => c.status === "processing").length +
        otherServices.filter((s) => s.status === "Processing").length;
    }

    const completedCount = document.getElementById("completed-count");
    if (completedCount) {
      completedCount.textContent =
        requests.filter((r) => r.status === "completed").length +
        complaints.filter((c) => c.status === "completed").length +
        otherServices.filter((s) => s.status === "Completed").length;
    }

    // Populate requests table
    const requestsList = document.getElementById("staff-requests-list");
    if (requestsList) {
      requestsList.innerHTML = requests
        .map((req) => {
          const user = allUsers.find((u) => u.email === req.email) || {};
          return `
        <tr>
          <td>${req.id}</td>
          <td>${user.firstName || ""} ${user.lastName || ""}</td>
          <td>${req.type}</td>
          <td>${new Date(req.date).toLocaleDateString()}</td>
          <td class="status-${req.status}">${req.status}</td>
          <td>
            <select class="status-select" data-type="request" data-id="${req.id}">
              <option value="pending" ${req.status === "pending" ? "selected" : ""}>Pending</option>
              <option value="processing" ${req.status === "processing" ? "selected" : ""}>Processing</option>
              <option value="completed" ${req.status === "completed" ? "selected" : ""}>Completed</option>
            </select>
          </td>
          <td>
            <button class="update-btn" data-type="request" data-id="${req.id}"><img src="images/update.png" alt="Update" style="width: 22px; height: auto;"></button>
            <button class="view-btn" data-type="request" data-id="${req.id}"><img src="images/view.png" alt="View" style="width: 25px; height: auto;"></button>
            <button class="delete-btn" data-type="request" data-id="${req.id}"><img src="images/delete.png" alt="Delete" style="width: auto; height: 16px;"></button>
          </td>
        </tr>
      `;
        })
        .join("");
    }

    // Populate complaints table
    const complaintsList = document.getElementById("staff-complaints-list");
    if (complaintsList) {
      complaintsList.innerHTML = complaints
        .map((comp) => {
          const user = allUsers.find((u) => u.email === comp.email) || {};
          return `
        <tr>
          <td>${comp.id}</td>
          <td>${user.firstName || ""} ${user.lastName || ""}</td>
          <td>${comp.type}</td>
          <td>${new Date(comp.date).toLocaleDateString()}</td>
          <td class="status-${comp.status}">${comp.status}</td>
          <td>
            <select class="status-select" data-type="complaint" data-id="${comp.id}">
              <option value="pending" ${comp.status === "pending" ? "selected" : ""}>Pending</option>
              <option value="processing" ${comp.status === "processing" ? "selected" : ""}>Processing</option>
              <option value="completed" ${comp.status === "completed" ? "selected" : ""}>Completed</option>
            </select>
          </td>
          <td>
            <button class="update-btn" data-type="complaint" data-id="${comp.id}"><img src="images/update.png" alt="Update" style="width: 22px; height: auto;"></button>
            <button class="view-btn" data-type="complaint" data-id="${comp.id}"><img src="images/view.png" alt="View" style="width: 25px; height: auto;"></button>
            <button class="delete-btn" data-type="complaint" data-id="${comp.id}"><img src="images/delete.png" alt="Delete" style="width: auto; height: 16px;"></button>
          </td>
        </tr>
      `;
        })
        .join("");
    }

    // Populate other services table
    const othersList = document.getElementById("staff-others-list");
    if (othersList) {
      othersList.innerHTML = otherServices
        .map((service) => {
          const user = allUsers.find((u) => u.email === service.createdBy) || {};
          return `
        <tr>
          <td>${service.id}</td>
          <td>${user.firstName || ""} ${user.lastName || ""}</td>
          <td>${service.serviceType}</td>
          <td>${new Date(service.date).toLocaleDateString()}</td>
          <td class="status-${service.status.toLowerCase()}">${service.status}</td>
          <td>
            <select class="status-select" data-type="others" data-id="${service.id}">
              <option value="Received" ${service.status === "Received" ? "selected" : ""}>Received</option>
              <option value="Processing" ${service.status === "Processing" ? "selected" : ""}>Processing</option>
              <option value="Completed" ${service.status === "Completed" ? "selected" : ""}>Completed</option>
            </select>
          </td>
          <td>
            <button class="update-btn" data-type="others" data-id="${service.id}"><img src="images/update.png" alt="Update" style="width: 22px; height: auto;"></button>
            <button class="view-btn" data-type="others" data-id="${service.id}"><img src="images/view.png" alt="View" style="width: 25px; height: auto;"></button>
            <button class="delete-btn" data-type="others" data-id="${service.id}"><img src="images/delete.png" alt="Delete" style="width: auto; height: 16px;"></button>
          </td>
        </tr>
      `;
        })
        .join("");
    }

    // Set up tab switching for staff dashboard
    document.querySelectorAll(".submission-tabs .tab-btn").forEach((btn) => {
      if (!btn) return;
      btn.addEventListener("click", function () {
        const tabId = this.getAttribute("data-tab");

        // Update active tab button
        document.querySelectorAll(".submission-tabs .tab-btn").forEach((b) => {
          if (b) b.classList.remove("active");
        });
        this.classList.add("active");

        // Update active tab content
        document.querySelectorAll(".submission-content .tab-content").forEach((content) => {
          if (content) content.classList.remove("active");
        });
        const tabContent = document.getElementById(`${tabId}-tab-staff`);
        if (tabContent) tabContent.classList.add("active");
      });
    });

    // Add event listeners to view buttons
    document.querySelectorAll(".view-btn").forEach(btn => {
      if (!btn) return;
      btn.addEventListener("click", function() {
        const itemId = this.getAttribute("data-id");
        const itemType = this.getAttribute("data-type");
        showDetailsModal(itemId, itemType);
      });
    });

    // Add event listeners to update buttons
    document.querySelectorAll(".update-btn").forEach(btn => {
      if (!btn) return;
      btn.addEventListener("click", function() {
        const type = this.getAttribute("data-type");
        const id = this.getAttribute("data-id");
        const select = document.querySelector(`.status-select[data-type="${type}"][data-id="${id}"]`);
        if (!select) return;
        
        const newStatus = select.value;

        // Update in localStorage
        let items;
        if (type === "request") {
          items = requests;
        } else if (type === "complaint") {
          items = complaints;
        } else if (type === "others") {
          items = otherServices;
        }

        const itemIndex = items.findIndex((item) => item.id === id);
        if (itemIndex !== -1) {
          items[itemIndex].status = newStatus;
          // Add who updated this
          items[itemIndex].updatedBy = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Staff";

          // Save back to localStorage
          if (type === "request") {
            localStorage.setItem("requests", JSON.stringify(items));
          } else if (type === "complaint") {
            localStorage.setItem("complaints", JSON.stringify(items));
          } else if (type === "others") {
            localStorage.setItem("otherServices", JSON.stringify(items));
          }

          alert("Status updated successfully!");
          loadStaffDashboard();
        }
      });
    });
  }

  // Load admin dashboard
  function loadAdminDashboard() {
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    requests = JSON.parse(localStorage.getItem("requests")) || [];
    complaints = JSON.parse(localStorage.getItem("complaints")) || [];
    otherServices = JSON.parse(localStorage.getItem("otherServices")) || [];

    // Update counts
    const totalUsers = document.getElementById("total-users");
    if (totalUsers) totalUsers.textContent = allUsers.length;

    const activeStaff = document.getElementById("active-staff");
    if (activeStaff) {
      activeStaff.textContent = allUsers.filter(
        (u) => u.userType === "staff"
      ).length;
    }

    const pendingIssues = document.getElementById("pending-issues");
    if (pendingIssues) {
      pendingIssues.textContent =
        requests.filter((r) => r.status === "pending").length +
        complaints.filter((c) => c.status === "pending").length +
        otherServices.filter((s) => s.status === "Received").length;
    }

    // Populate resident email dropdown
    const residentEmailSelect = document.getElementById("resident-email");
    if (residentEmailSelect) {
      residentEmailSelect.innerHTML =
        '<option value="">Select Resident</option>' +
        allUsers
          .filter((u) => u.userType === "resident")
          .map(
            (user) =>
              `<option value="${user.email}">${user.firstName} ${user.lastName} (${user.email})</option>`
          )
          .join("");
    }

    // Load status board
    loadAdminStatusBoard();

    // Admin navigation button handlers
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      if (!btn) return;
      btn.addEventListener("click", function() {
        const page = this.getAttribute("data-page");
        
        // Update active button
        document.querySelectorAll(".nav-btn").forEach(b => {
          if (b) b.classList.remove("active");
        });
        this.classList.add("active");
        
        // Show the correct page
        const adminActions = document.querySelector(".admin-actions");
        const statusBoard = document.getElementById("admin-status-board");
        
        if (page === "dashboard") {
          if (adminActions) adminActions.style.display = "block";
          if (statusBoard) statusBoard.style.display = "none";
        } else {
          if (adminActions) adminActions.style.display = "none";
          if (statusBoard) statusBoard.style.display = "block";
          loadAdminStatusBoard();
        }
      });
    });

    // Tab switching for admin status board
    document.querySelectorAll("#admin-status-board .tab-btn").forEach((btn) => {
      if (!btn) return;
      btn.addEventListener("click", function() {
        const tabId = this.getAttribute("data-tab");

        // Update active tab button
        document.querySelectorAll("#admin-status-board .tab-btn").forEach((b) => {
          if (b) b.classList.remove("active");
        });
        this.classList.add("active");

        // Update active tab content
        document.querySelectorAll("#admin-status-board .tab-content").forEach((content) => {
          if (content) content.classList.remove("active");
        });
        const tabContent = document.getElementById(`${tabId}-tab-admin`);
        if (tabContent) tabContent.classList.add("active");
      });
    });
  }

  // Load admin status board function
  function loadAdminStatusBoard() {
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    requests = JSON.parse(localStorage.getItem("requests")) || [];
    complaints = JSON.parse(localStorage.getItem("complaints")) || [];
    otherServices = JSON.parse(localStorage.getItem("otherServices")) || [];

    // Populate requests table
    const requestsList = document.getElementById("admin-requests-list");
    if (requestsList) {
      requestsList.innerHTML = requests
        .map((req) => {
          const user = allUsers.find((u) => u.email === req.email) || {};
          return `
            <tr>
              <td>${req.id}</td>
              <td>${user.firstName || ""} ${user.lastName || ""}</td>
              <td>${req.type}</td>
              <td>${new Date(req.date).toLocaleDateString()}</td>
              <td class="status-${req.status}">${req.status}</td>
              <td>${req.updatedBy || "N/A"}</td>
              <td>
                <button class="view-btn" data-type="request" data-id="${req.id}"><img src="images/view.png" alt="View" style="width: 25px; height: auto;"></button>
              </td>
            </tr>
          `;
        })
        .join("");
    }

    // Populate complaints table
    const complaintsList = document.getElementById("admin-complaints-list");
    if (complaintsList) {
      complaintsList.innerHTML = complaints
        .map((comp) => {
          const user = allUsers.find((u) => u.email === comp.email) || {};
          return `
            <tr>
              <td>${comp.id}</td>
              <td>${user.firstName || ""} ${user.lastName || ""}</td>
              <td>${comp.type}</td>
              <td>${new Date(comp.date).toLocaleDateString()}</td>
              <td class="status-${comp.status}">${comp.status}</td>
              <td>${comp.updatedBy || "N/A"}</td>
              <td>
                <button class="view-btn" data-type="complaint" data-id="${comp.id}"><img src="images/view.png" alt="View" style="width: 25px; height: auto;"></button>
              </td>
            </tr>
          `;
        })
        .join("");
    }

    // Populate other services table
    const othersList = document.getElementById("admin-others-list");
    if (othersList) {
      othersList.innerHTML = otherServices
        .map((service) => {
          const user = allUsers.find((u) => u.email === service.createdBy) || {};
          return `
            <tr>
              <td>${service.id}</td>
              <td>${user.firstName || ""} ${user.lastName || ""}</td>
              <td>${service.serviceType}</td>
              <td>${new Date(service.date).toLocaleDateString()}</td>
              <td class="status-${service.status.toLowerCase()}">${service.status}</td>
              <td>${service.updatedBy || "N/A"}</td>
              <td>
                <button class="view-btn" data-type="others" data-id="${service.id}"><img src="images/view.png" alt="View" style="width: 25px; height: auto;"></button>
              </td>
            </tr>
          `;
        })
        .join("");
    }

    // Add event listeners to view buttons
    document.querySelectorAll(".view-btn").forEach(btn => {
      if (!btn) return;
      btn.addEventListener("click", function() {
        const itemId = this.getAttribute("data-id");
        const itemType = this.getAttribute("data-type");
        showDetailsModal(itemId, itemType);
      });
    });

    // Add event listeners to delete buttons
    document.querySelectorAll(".delete-btn").forEach(btn => {
      if (!btn) return;
      btn.addEventListener("click", function() {
        const itemId = this.getAttribute("data-id");
        const itemType = this.getAttribute("data-type");
        
        if (confirm("Are you sure you want to delete this item?")) {
          let collection;
          if (itemType === "request") {
            collection = requests;
          } else if (itemType === "complaint") {
            collection = complaints;
          } else if (itemType === "others") {
            collection = otherServices;
          }
          
          const index = collection.findIndex(i => i.id === itemId);
          if (index !== -1) {
            collection.splice(index, 1);
            localStorage.setItem(`${itemType === 'others' ? 'otherServices' : itemType + 's'}`, JSON.stringify(collection));
            
            // Update the appropriate collection variable
            if (itemType === "request") {
              requests = collection;
            } else if (itemType === "complaint") {
              complaints = collection;
            } else if (itemType === "others") {
              otherServices = collection;
            }
            
            // Reload the staff dashboard
            loadStaffDashboard();
            alert("Item deleted successfully");
          }
        }
      });
    });
  }
  
  // Store new notification
  function addResidentNotification(email, subject, message) {
    const current = JSON.parse(localStorage.getItem("residentNotifications") || "[]");
    const newNotif = {
      email,
      subject,
      message,
      time: new Date().toLocaleString()
    };
    current.push(newNotif);
    localStorage.setItem("residentNotifications", JSON.stringify(current));

    // If resident is currently logged in and matches, show popup
    const active = localStorage.getItem("loggedInResident");
    if (active && active === email) {
      alert(`📬 New Notification:\n${subject}\n${message}`);
      showResidentNotifications(email); // Refresh panel
    }
  }

  // Display notifications for a resident
  function showResidentNotifications(currentEmail) {
    const notifList = document.getElementById("notif-list");
    const notifCount = document.getElementById("notif-count");
    if (!notifList || !notifCount) return;
    
    const all = JSON.parse(localStorage.getItem("residentNotifications") || "[]");
    const userNotifs = all.filter(n => n.email === currentEmail);

    notifList.innerHTML = "";
    if (userNotifs.length > 0) {
      notifCount.textContent = userNotifs.length;
      userNotifs.reverse().forEach(n => {
        const li = document.createElement("li");
        li.textContent = `${n.subject}: ${n.message} (${n.time})`;
        notifList.appendChild(li);
      });
    } else {
      notifList.innerHTML = "<li>No notifications.</li>";
      notifCount.textContent = "0";
    }
  }

  // Toggle notification dropdown
  if (notifIcon) {
    notifIcon.addEventListener("click", () => {
      if (notifPanel) {
        notifPanel.style.display = notifPanel.style.display === "none" ? "block" : "none";
      }
    });
  }

  // Admin email form listener
  const waitForAdminForm = setInterval(() => {
    const emailForm = document.getElementById("email-form");
    if (emailForm && !emailForm.dataset.listenerAdded) {
      emailForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("resident-email")?.value.trim();
        const subject = document.getElementById("email-subject")?.value.trim();
        const message = document.getElementById("email-message")?.value.trim();

        if (email && subject && message) {
          addResidentNotification(email, subject, message);
          alert(`📧 Simulated Email Sent to: ${email}`);
          emailForm.reset();
        } else {
          alert("⚠️ Please fill all fields.");
        }
      });

      emailForm.dataset.listenerAdded = "true";
      clearInterval(waitForAdminForm);
    }
  }, 500);
});
