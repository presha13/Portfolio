document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    function applyTheme(theme) {
        if (theme === 'dark-theme') {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
        } else {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
        }
    }

    if (currentTheme) {
        applyTheme(currentTheme);
    } else {
        // Default to light theme if no preference saved or system preference not checked
        applyTheme('light-theme');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            let newTheme;
            if (document.body.classList.contains('light-theme')) {
                newTheme = 'dark-theme';
            } else {
                newTheme = 'light-theme';
            }
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const mainHeader = document.getElementById('main-header'); // Get header for blur effect

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive);
            if(mainHeader) mainHeader.classList.toggle('menu-open', isActive); // For potential styling changes when menu is open
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    if(mainHeader) mainHeader.classList.remove('menu-open');
                }
            });
        });
    }

    // Active Nav Link on Scroll
    const sections = document.querySelectorAll('main section[id]');
    const navLiAnchors = document.querySelectorAll('#main-header nav .nav-links li a');
    const headerHeight = mainHeader?.offsetHeight || 75;

    function updateActiveNavLink() {
        let currentSectionId = '';
        const scrollPosition = pageYOffset + headerHeight + 60; // Adjust detection point

        sections.forEach(section => {
            if (section.offsetTop <= scrollPosition && (section.offsetTop + section.offsetHeight) > scrollPosition) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLiAnchors.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === `#${currentSectionId}`) {
                a.classList.add('active');
            }
        });
        
        if (currentSectionId === '' && pageYOffset < (sections[0]?.offsetTop - headerHeight - 50 || 0)){
            const homeLink = document.querySelector('#main-header nav .nav-links li a[href="#hero"]');
            if(homeLink) homeLink.classList.add('active');
        }
    }
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Initial call

    // Footer: Current Year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Contact Form Submission (using Web3Forms)
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            const formData = new FormData(form);
            const object = {};
            formData.forEach((value, key) => { object[key] = value; });
            const json = JSON.stringify(object);
            
            if (formStatus) {
                formStatus.innerHTML = "Sending...";
                formStatus.style.color = "var(--secondary-color)";
            }

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: json
                });
                const result = await response.json();
                if (result.success) {
                    if (formStatus) {
                        formStatus.innerHTML = "Message sent successfully! Thank you.";
                        formStatus.style.color = "var(--secondary-color)";
                    }
                    form.reset();
                } else {
                    console.error('Form submission error:', result);
                    if (formStatus) {
                        formStatus.innerHTML = `Error: ${result.message || "Could not send message."}`;
                        formStatus.style.color = "var(--accent-color)";
                    }
                }
            } catch (error) {
                console.error('Network or other error:', error);
                if (formStatus) {
                    formStatus.innerHTML = "Oops! Something went wrong. Please try again.";
                    formStatus.style.color = "var(--accent-color)";
                }
            } finally {
                setTimeout(() => { if (formStatus) formStatus.innerHTML = ''; }, 6000);
            }
        });
    }
});