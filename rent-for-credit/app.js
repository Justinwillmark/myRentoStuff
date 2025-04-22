// Initialize AOS animations with mobile optimization
AOS.init({
    duration: 800,
    easing: 'ease',
    once: true,
    offset: 100,
    disable: window.innerWidth < 768
});

// Re-init AOS on window resize to handle mobile/desktop switches
window.addEventListener('resize', function() {
    AOS.refresh();
});

// ============================================
// Enhanced Rent Credit Calculator
// ============================================
const annualRentInput = document.getElementById('annualRent');
const monthButtons = document.querySelectorAll('.month-btn');
const creditResultDiv = document.getElementById('creditResult');

// Auto-calculate when month is selected
if (monthButtons.length && creditResultDiv) {
    monthButtons.forEach(button => {
        button.addEventListener('click', function() {
            monthButtons.forEach(btn => btn.classList.remove('active', 'btn-primary'));
            this.classList.add('active', 'btn-primary');
            this.classList.remove('btn-outline-primary');
            if (annualRentInput.value.trim() !== '') calculateCredit(this.dataset.month);
        });
    });

    // Real-time formatting + calculation
    annualRentInput.addEventListener('input', function(e) {
        let cursorPosition = this.selectionStart;
        let originalLength = this.value.length;
        let cleanedValue = this.value.replace(/[^0-9]/g, '');
        let formattedValue = cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        
        this.value = formattedValue;
        this.setSelectionRange(
            cursorPosition + (this.value.length - originalLength), 
            cursorPosition + (this.value.length - originalLength)
        );
        
        if (this.value.trim() !== '') {
            const activeMonth = document.querySelector('.month-btn.active');
            if (activeMonth) calculateCredit(activeMonth.dataset.month);
        }
    });

    // Main calculation function
function calculateCredit(currentMonth) {
    const annualRent = parseFloat(annualRentInput.value.replace(/[^0-9]/g, ''));

    if (isNaN(annualRent)) {
        creditResultDiv.innerHTML = `
            <div class="alert alert-danger fade-in" role="alert">
                <i class="fas fa-exclamation-circle me-2"></i>
                Please enter a valid annual rent amount
            </div>`;
        return;
    }
    

    if (annualRent <= 0) {
        creditResultDiv.innerHTML = `
            <div class="alert alert-danger fade-in" role="alert">
                <i class="fas fa-exclamation-circle me-2"></i>
                Annual rent must be greater than 0
            </div>`;
        return;
    }

    // Loading state
    creditResultDiv.innerHTML = `
        <div class="calculation-loading text-center py-4">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-3">Calculating...</p>
        </div>`;

    setTimeout(() => {
        const monthlyRent = annualRent / 12;
        const remainingMonths = 12 - (currentMonth - 1);
        const remainingRent = monthlyRent * remainingMonths;
        const availableCredit = Math.floor(remainingRent * 0.6);
        const creditPercentage = Math.min(60, Math.floor((availableCredit / annualRent) * 100));

        creditResultDiv.innerHTML = `
            <div class="credit-result-card p-4 fade-in">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="mb-0">Available Credit in Month ${currentMonth}</h5>
                    <span class="badge bg-primary">${creditPercentage}% of rent</span>
                </div>
                <div class="credit-amount display-4 fw-bold text-primary my-3">
                    ₦${availableCredit.toLocaleString()}
                </div>
                <div class="progress mb-4" style="height: 8px;">
                    <div class="progress-bar bg-primary" style="width: ${creditPercentage}%"></div>
                </div>
                <div class="credit-details">
                    <p><i class="fas fa-calendar-check text-primary me-2"></i> <strong>${remainingMonths} months</strong> remaining in your tenancy</p>
                    <p><i class="fas fa-money-bill-alt text-primary me-2"></i> <strong>₦${remainingRent.toLocaleString()}</strong> remaining rent value</p>
                    <p><i class="fas fa-percentage text-primary me-2"></i> <strong>${creditPercentage}%</strong> of remaining rent available as credit</p>
                </div>
                <button class="btn btn-primary w-100 mt-3" id="applyNowBtn">
                    <i class="fas fa-paper-plane me-2"></i> Pay Rent Now
                </button>
            </div>`;
            
        document.getElementById('applyNowBtn')?.addEventListener('click', () => {
            // Replace with actual application flow
            console.log("Credit application started for Month", currentMonth);
        });
    }, 600);
}
}

// [Rest of your existing code remains unchanged...]

// Enhanced Scrolling Functions
const header = document.querySelector('header');
const backToTopButton = document.querySelector('.back-to-top');

// Handle scroll events with throttling for performance
let lastScrollY = window.scrollY;
let ticking = false;

window.addEventListener('scroll', function() {
    lastScrollY = window.scrollY;
    
    if (!ticking) {
        window.requestAnimationFrame(function() {
            handleScroll(lastScrollY);
            ticking = false;
        });
        ticking = true;
    }
});

function handleScroll(scrollY) {
    // Handle header styling on scroll
    if (scrollY > 50) {
        header.classList.add('navbar-scrolled');
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        header.style.padding = '0.5rem 0';
    } else {
        header.classList.remove('navbar-scrolled');
        header.style.backgroundColor = 'transparent';
        header.style.boxShadow = 'none';
        header.style.padding = '1rem 0';
    }

    // Show/hide back-to-top button
    if (scrollY > 300) {
        backToTopButton.classList.add('active');
    } else {
        backToTopButton.classList.remove('active');
    }
}

// Smooth scrolling for anchor links with offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const extraOffset = window.innerWidth < 768 ? 10 : 20;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - (headerHeight + extraOffset);
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                bootstrap.Collapse.getInstance(navbarCollapse).hide();
            }
            
            // Update URL without jumping
            if (history.pushState) {
                history.pushState(null, null, targetId);
            } else {
                location.hash = targetId;
            }
        }
    });
});

// Enhanced back to top button functionality
if (backToTopButton) {
    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize Bootstrap tooltips with animation
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
tooltipTriggerList.map(function(tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl, {
        animation: true,
        trigger: 'hover focus'
    });
});

// Video placeholder with better interaction
const videoPlaceholder = document.querySelector('.video-placeholder');
if (videoPlaceholder) {
    videoPlaceholder.addEventListener('click', function() {
        this.classList.add('video-loading');
        this.innerHTML = `
            <div class="d-flex align-items-center justify-content-center h-100">
                <div class="spinner-border text-white" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>`;
        
        // Simulate video loading
        setTimeout(() => {
            this.classList.remove('video-loading');
            this.innerHTML = `
                <div class="d-flex align-items-center justify-content-center h-100">
                    <div class="text-center">
                        <i class="fas fa-video fa-3x text-white mb-3"></i>
                        <h4 class="text-white">Video Coming Soon</h4>
                        <p class="text-white-50">We're preparing something amazing for you</p>
                    </div>
                </div>`;
        }, 1500);
    });
    
    // Add hover effect
    videoPlaceholder.addEventListener('mouseenter', function() {
        if (!this.classList.contains('video-loading')) {
            this.style.transform = 'scale(1.02)';
        }
    });
    
    videoPlaceholder.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
}

// Mobile menu close on click
document.querySelectorAll('.navbar-nav .nav-link').forEach(navLink => {
    navLink.addEventListener('click', function() {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            bootstrap.Collapse.getInstance(navbarCollapse).hide();
        }
    });
});

// Add animation to hero buttons on page load
document.addEventListener('DOMContentLoaded', function() {
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach((button, index) => {
        setTimeout(() => {
            button.classList.add('bounce');
        }, index * 300);
    });
});

// Video overlay click handler
document.getElementById('video-overlay')?.addEventListener('click', function() {
    const iframe = document.getElementById('rento-video');
    iframe.src = iframe.src.replace('autoplay=0', 'autoplay=1');
    this.style.opacity = '0';
    setTimeout(() => {
        this.style.display = 'none';
    }, 300);
});


// Initialize AOS in your app.js 
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        once: true
    });
});

