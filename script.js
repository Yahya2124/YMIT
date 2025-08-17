// Sample data and courses
const attendanceData = {
    'Web Development': {
        totalClasses: 45,
        attendance: [
            { date: '2025-08-16', status: 'present' },
            { date: '2025-08-15', status: 'present' },
            { date: '2025-08-14', status: 'absent' },
            { date: '2025-08-13', status: 'leave' },
            { date: '2025-08-12', status: 'present' }
        ]
    },
    'Mobile App Development': {
        totalClasses: 32,
        attendance: [
            { date: '2025-08-16', status: 'present' },
            { date: '2025-08-15', status: 'absent' },
            { date: '2025-08-14', status: 'present' },
            { date: '2025-08-13', status: 'present' },
            { date: '2025-08-12', status: 'present' }
        ]
    },
    'Graphic Design': {
        totalClasses: 28,
        attendance: [
            { date: '2025-08-16', status: 'leave' },
            { date: '2025-08-15', status: 'leave' },
            { date: '2025-08-14', status: 'present' },
            { date: '2025-08-13', status: 'present' },
            { date: '2025-08-12', status: 'present' }
        ]
    }
};

const courses = [
    {
        title: 'Web Development',
        instructor: 'Sir Ghous Ahmed',
        progress: 75,
        status: 'In Progress'
    },
    {
        title: 'Mobile App Development',
        instructor: 'Sir Inzamam ul Haq',
        progress: 45,
        status: 'In Progress'
    },
    {
        title: 'Graphic Design',
        instructor: 'Mam Hira Khan',
        progress: 90,
        status: 'Near Completion'
    }
];

// DOM Elements
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const cancelLogin = document.getElementById('cancelLogin');
const searchInput = document.getElementById('courseSearch');

// User state
let isLoggedIn = false;
let currentUser = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigationHandlers();
    setupLoginHandlers();
    setupSearchHandlers();
    setupButtonEffects();
    setupProgressAnimations();
    updateGreeting();
    
    // Animate progress bars after page load
    setTimeout(animateProgress, 1000);
}

// Navigation functionality
function setupNavigationHandlers() {
    document.querySelectorAll('.nav-links a, .sidebar a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links in the same container
            const container = this.closest('.nav-links, .sidebar');
            container.querySelectorAll('a').forEach(a => a.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Update content based on clicked link
            updateContent(this.textContent.trim());
        });
    });
}

function updateContent(section, filteredCourses = null) {
    const contentArea = document.querySelector('.content-area');
    const coursesToDisplay = filteredCourses || courses;
    
    switch(section) {
        case 'Courses':
        case 'My Courses':
            contentArea.innerHTML = `
                <div class="welcome-section">
                    <h1>My Courses</h1>
                    <p>Manage and track your enrolled courses.</p>
                </div>
                <div class="courses-grid">
                    ${coursesToDisplay.map(course => `
                        <div class="course-card">
                            <div class="course-header">
                                <h3 class="course-title">${course.title}</h3>
                                <p class="course-instructor">Instructor: ${course.instructor}</p>
                            </div>
                            <div class="course-body">
                                <div class="course-progress">
                                    <div class="progress-label">
                                        <span>Progress</span>
                                        <span>${course.progress}%</span>
                                    </div>
                                    <div class="progress-bar">
                                        <div class="progress-fill" data-progress="${course.progress}"></div>
                                    </div>
                                </div>
                                <div class="course-actions">
                                    <a href="#" class="btn">Continue</a>
                                    <a href="#" class="btn-secondary">Details</a>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            break;
        case 'Assignments':
            contentArea.innerHTML = `
                <div class="welcome-section">
                    <h1>Assignments</h1>
                    <p>View and submit your assignments.</p>
                </div>
                <div style="background: white; padding: 25px; border-radius: 15px; margin-bottom: 20px;">
                    <h3 style="color: #e53e3e; margin-bottom: 15px;">📋 Pending Assignments</h3>
                    <div style="border-left: 4px solid #e53e3e; padding-left: 15px; margin-bottom: 15px;">
                        <h4>React Component Assignment</h4>
                        <p style="color: #718096; margin: 5px 0;">Web Development - Due: August 20, 2025</p>
                    </div>
                    <div style="border-left: 4px solid #38a169; padding-left: 15px;">
                        <h4>Mobile UI Design</h4>
                        <p style="color: #718096; margin: 5px 0;">Mobile App Development - Due: August 25, 2025</p>
                    </div>
                </div>
            `;
            break;
        case 'Progress':
            contentArea.innerHTML = `
                <div class="welcome-section">
                    <h1>Progress Tracking</h1>
                    <p>Monitor your learning journey and achievements.</p>
                </div>
                <div class="stats-grid">
                    <div class="stat-card">
                        <i class="fas fa-chart-line"></i>
                        <h3>85%</h3>
                        <p>Overall Progress</p>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-star"></i>
                        <h3>4.6</h3>
                        <p>Average Grade</p>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-fire"></i>
                        <h3>25</h3>
                        <p>Day Streak</p>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-clock"></i>
                        <h3>120h</h3>
                        <p>Study Time</p>
                    </div>
                </div>
            `;
            break;
        case 'Attendance':
            contentArea.innerHTML = `
                <div class="welcome-section">
                    <h1>Attendance Record</h1>
                    <p>Track your course attendance and manage leaves.</p>
                </div>
                <div class="attendance-stats">
                    ${Object.entries(attendanceData).map(([course, data]) => {
                        const presentCount = data.attendance.filter(a => a.status === 'present').length;
                        const attendancePercentage = (presentCount / data.totalClasses * 100).toFixed(1);
                        return `
                            <div class="attendance-card">
                                <h3>${course}</h3>
                                <div class="attendance-info">
                                    <div class="attendance-stat">
                                        <span class="label">Present</span>
                                        <span class="value">${presentCount}/${data.totalClasses}</span>
                                    </div>
                                    <div class="attendance-stat">
                                        <span class="label">Percentage</span>
                                        <span class="value ${attendancePercentage >= 75 ? 'good' : 'warning'}">${attendancePercentage}%</span>
                                    </div>
                                </div>
                                <div class="attendance-history">
                                    <h4>Recent Attendance</h4>
                                    <div class="attendance-days">
                                        ${data.attendance.map(day => `
                                            <div class="attendance-day ${day.status}">
                                                <div class="date">${new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                                                <div class="status">
                                                    <i class="fas fa-${day.status === 'present' ? 'check' : day.status === 'absent' ? 'times' : 'calendar'}" 
                                                       title="${day.status.charAt(0).toUpperCase() + day.status.slice(1)}"></i>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
            break;
        default:
            // Return to dashboard
            location.reload();
    }
}

// Login/Logout functionality
function setupLoginHandlers() {
    if (!isLoggedIn) {
        loginModal.style.display = 'flex';
    }

    logoutBtn.addEventListener('click', function() {
        isLoggedIn = false;
        currentUser = null;
        loginModal.style.display = 'flex';
        showNotification('Logged out successfully');
        document.querySelector('.user-profile span').textContent = 'Guest';
    });

    cancelLogin.addEventListener('click', function() {
        if (isLoggedIn) {
            loginModal.style.display = 'none';
        }
    });

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (username && password) {
            isLoggedIn = true;
            currentUser = username;
            loginModal.style.display = 'none';
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            document.querySelector('.user-profile span').textContent = username;
            showNotification('Logged in successfully');
            updateGreeting(); // Update greeting with new username
        } else {
            showNotification('Please fill in all fields');
        }
    });

    // Close modal when clicking outside
    loginModal.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });
}



// Search functionality
function setupSearchHandlers() {
    if (searchInput) {
        searchInput.addEventListener('focus', function() {
            this.style.borderColor = '#667eea';
            this.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
        });

        searchInput.addEventListener('blur', function() {
            this.style.borderColor = '#e2e8f0';
            this.style.boxShadow = 'none';
        });

        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            if (query.length > 0) {
                const filteredCourses = courses.filter(course => 
                    course.title.toLowerCase().includes(query) ||
                    course.instructor.toLowerCase().includes(query)
                );
                updateContent('My Courses', filteredCourses);
            } else {
                updateContent('My Courses', courses);
            }
        });
    }
}

// Button effects and interactions
function setupButtonEffects() {
    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.5)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.pointerEvents = 'none';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add click handlers for course actions
    document.addEventListener('click', function(e) {
        if (e.target.textContent === 'Continue') {
            e.preventDefault();
            showNotification('Redirecting to course content...');
        }
        
        if (e.target.textContent === 'Details') {
            e.preventDefault();
            showNotification('Loading course details...');
        }
        
        if (e.target.textContent.includes('Enroll New Course')) {
            e.preventDefault();
            showNotification('Opening course catalog...');
        }
    });

    // Course card hover effects
    document.querySelectorAll('.course-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Progress bar animations
function setupProgressAnimations() {
    // Interactive progress animations
    function animateProgress() {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = progress + '%';
            }, 500);
        });
    }

    // Make animateProgress function accessible globally
    window.animateProgress = animateProgress;
}

// Dynamic time greeting
function updateGreeting() {
    const welcomeSection = document.querySelector('.welcome-section h1');
    const hour = new Date().getHours();
    let greeting = 'Welcome back';
    
    if (hour < 5) greeting = 'Good night';
    else if (hour < 12) greeting = 'Good morning';
    else if (hour < 17) greeting = 'Good afternoon';
    else if (hour < 22) greeting = 'Good evening';
    else greeting = 'Good night';
    
    if (welcomeSection) {
        welcomeSection.textContent = `${greeting}, ${currentUser || 'Guest'}!`;
    }
}

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Utility functions for external access
window.showNotification = showNotification;