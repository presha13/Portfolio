// --- MINIMALISTIC AI/ML PORTFOLIO JAVASCRIPT ---

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all functionality
    initNavbar();
    initScrollAnimations();
    initThemeSwitcher();
    initBotScroller();
    initContactForm();
    initCurrentYear();
});

// --- Navbar Functionality ---
function initNavbar() {
    // Target the main header container for the sticky effect
    const header = document.querySelector('.header-container');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { // Trigger earlier for smoother feel
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    // Mobile menu toggle functionality
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            // Toggle mobile menu visibility
            const mobileMenu = document.querySelector('.mobile-menu');
            if (mobileMenu) {
                mobileMenu.classList.toggle('active');
            }
        });
    }

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const mobileMenu = document.querySelector('.mobile-menu');
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
            }
            if (mobileMenuToggle) {
                mobileMenuToggle.classList.remove('active');
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        const mobileMenu = document.querySelector('.mobile-menu');
        const navbar = document.querySelector('.navbar');
        if (mobileMenu && !mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            mobileMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Initial call
}

// --- Scroll Animations (AOS-like) ---
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once visible if you want it to happen only once
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.skill-card, .project-card, .timeline-item, .education-card, .certification-card, .detail-block, .section-title');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}



// --- Theme Switcher ---
function initThemeSwitcher() {
    const toggleBtn = document.getElementById('theme-toggle');
    const icon = toggleBtn.querySelector('i');

    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    // Default to LIGHT in this new design system
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        icon.className = 'fas fa-moon';
    } else {
        // Enforce light by default if no preference or explicitly light
        document.documentElement.setAttribute('data-theme', 'light');
        icon.className = 'fas fa-sun';
    }

    toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');

        if (currentTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            icon.className = 'fas fa-moon';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            icon.className = 'fas fa-sun';
        }
    });
}


// --- Bot Emoji Scrollbar ---
function initBotScroller() {
    const track = document.getElementById('bot-scrollbar');
    const thumb = document.getElementById('bot-thumb');

    if (!track || !thumb) return;

    let isDragging = false;
    let startY, startScrollTop;

    function updateThumbPosition() {
        if (!isDragging) {
            const scrollPercentage = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            const trackHeight = track.clientHeight - thumb.clientHeight;
            thumb.style.transform = `translateY(${scrollPercentage * trackHeight}px)`;
        }
    }

    // Drag Logic
    thumb.addEventListener('mousedown', (e) => {
        isDragging = true;
        startY = e.clientY;
        startScrollTop = window.scrollY;
        thumb.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none'; // Prevent text selection
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const deltaY = e.clientY - startY;
        const trackHeight = track.clientHeight - thumb.clientHeight;
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollAmount = (deltaY / trackHeight) * scrollableHeight;

        window.scrollTo(0, startScrollTop + scrollAmount);

        // Update visual position immediately for smoothness
        const scrollPercentage = (startScrollTop + scrollAmount) / scrollableHeight;
        thumb.style.transform = `translateY(${Math.min(Math.max(scrollPercentage, 0), 1) * trackHeight}px)`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        thumb.style.cursor = 'grab';
        document.body.style.userSelect = '';
    });

    window.addEventListener('scroll', updateThumbPosition);
    window.addEventListener('resize', updateThumbPosition);

    // Initial call
    updateThumbPosition();
}

// --- Contact Form ---
function initContactForm() {
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const object = {};
            formData.forEach((value, key) => {
                object[key] = value;
            });

            const json = JSON.stringify(object);

            // Show loading state
            if (formStatus) {
                formStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                formStatus.style.color = 'var(--primary-color)';
            }

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: json
                });

                const result = await response.json();

                if (result.success) {
                    if (formStatus) {
                        formStatus.innerHTML = '<i class="fas fa-check"></i> Message sent successfully!';
                        formStatus.style.color = 'var(--accent-color)';
                    }
                    form.reset();
                } else {
                    throw new Error(result.message || 'Failed to send message');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                if (formStatus) {
                    formStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error sending message. Please try again.';
                    formStatus.style.color = '#ef4444';
                }
            } finally {
                // Clear status after 5 seconds
                setTimeout(() => {
                    if (formStatus) {
                        formStatus.innerHTML = '';
                    }
                }, 5000);
            }
        });
    }
}

// --- Current Year ---
function initCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// --- Smooth Scrolling for Anchor Links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navbar = document.getElementById('navbar');
            const navHeight = navbar ? navbar.getBoundingClientRect().height + 20 : 80; // include top gap
            const targetTop = target.getBoundingClientRect().top + window.pageYOffset;
            const offsetTop = Math.max(targetTop - navHeight, 0);
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// --- Typing Animation for Hero Title ---
function initTypingAnimation() {
    const titleElement = document.querySelector('.hero-title');
    if (titleElement) {
        const text = titleElement.textContent;
        titleElement.textContent = '';

        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                titleElement.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };

        // Start typing animation after a short delay
        setTimeout(typeWriter, 500);
    }
}

// --- Parallax Effect for AI Accent ---
function initParallaxEffect() {
    const aiAccent = document.querySelector('.ai-accent');
    if (aiAccent) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            aiAccent.style.transform = `translateY(${rate}px)`;
        });
    }
}

// --- Initialize additional features ---
document.addEventListener('DOMContentLoaded', () => {
    initTypingAnimation();
    initParallaxEffect();
});

// --- Utility Functions ---
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// --- Performance Optimization ---
const debouncedScrollHandler = debounce(() => {
    // Handle scroll events efficiently
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);