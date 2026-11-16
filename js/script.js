// --- PORTFOLIO JAVASCRIPT ---

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initSmoothScroll();
    initScrollAnimations();
    initThemeSwitcher();
    initBotScroller();
    initCurrentYear();
    initTypingAnimation();
    initParallaxEffect();
});

// --- Navbar ---
function initNavbar() {
    const header = document.querySelector('.header-container');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    const closeMobileMenu = () => {
        if (mobileMenu) mobileMenu.classList.remove('active');
        if (mobileMenuToggle) {
            mobileMenuToggle.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
    };

    if (mobileMenuToggle) {
        // The toggle is a <div>; make it reachable and operable by keyboard
        mobileMenuToggle.setAttribute('role', 'button');
        mobileMenuToggle.setAttribute('tabindex', '0');
        mobileMenuToggle.setAttribute('aria-label', 'Toggle navigation menu');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');

        const toggle = () => {
            const open = mobileMenuToggle.classList.toggle('active');
            if (mobileMenu) mobileMenu.classList.toggle('active', open);
            mobileMenuToggle.setAttribute('aria-expanded', String(open));
        };
        mobileMenuToggle.addEventListener('click', toggle);
        mobileMenuToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle();
            }
        });
    }

    navLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

    document.addEventListener('click', (e) => {
        if (mobileMenu && mobileMenuToggle &&
            !mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileMenu();
    });

    // Sticky header + active link highlighting, throttled to one update per frame
    let ticking = false;
    const onScroll = () => {
        if (header) header.classList.toggle('sticky', window.scrollY > 50);

        if (sections.length) {
            const scrollPosition = window.scrollY + 150;
            sections.forEach(section => {
                const top = section.offsetTop;
                if (scrollPosition >= top && scrollPosition < top + section.offsetHeight) {
                    const id = section.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(onScroll);
        }
    }, { passive: true });
    onScroll();
}

// --- Smooth scrolling for in-page anchor links (offset for the fixed header) ---
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            const navbar = document.getElementById('navbar');
            const navHeight = navbar ? navbar.getBoundingClientRect().height + 20 : 80;
            const targetTop = target.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: Math.max(targetTop - navHeight, 0),
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
            history.replaceState(null, '', href);
        });
    });
}

// --- Scroll reveal animations ---
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.skill-card, .project-card, .timeline-item, .education-card, .certification-card, .detail-block, .section-title'
    );

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        animatedElements.forEach(el => el.classList.add('fade-in', 'visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// --- Theme switcher (saved choice > system preference) ---
function initThemeSwitcher() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;
    const icon = toggleBtn.querySelector('i');

    let savedTheme = null;
    try {
        savedTheme = localStorage.getItem('theme');
    } catch (e) { /* storage unavailable */ }

    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        if (icon) icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        toggleBtn.setAttribute('aria-pressed', String(theme === 'dark'));
    };

    applyTheme(savedTheme || (systemPrefersDark ? 'dark' : 'light'));

    toggleBtn.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        try {
            localStorage.setItem('theme', next);
        } catch (e) { /* storage unavailable */ }
    });
}

// --- Bot emoji scrollbar (mouse, pen and touch via Pointer Events) ---
function initBotScroller() {
    const track = document.getElementById('bot-scrollbar');
    const thumb = document.getElementById('bot-thumb');
    if (!track || !thumb) return;

    track.setAttribute('aria-hidden', 'true'); // decorative; native scrolling still works

    let isDragging = false;
    let startY = 0;
    let startScrollTop = 0;

    const scrollable = () => Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const trackRange = () => track.clientHeight - thumb.clientHeight;

    const setThumb = (fraction) => {
        const clamped = Math.min(Math.max(fraction, 0), 1);
        thumb.style.transform = `translateY(${clamped * trackRange()}px)`;
    };

    const updateThumbPosition = () => {
        if (!isDragging) setThumb(window.scrollY / scrollable());
    };

    thumb.addEventListener('pointerdown', (e) => {
        isDragging = true;
        startY = e.clientY;
        startScrollTop = window.scrollY;
        thumb.setPointerCapture(e.pointerId);
        document.body.style.userSelect = 'none';
    });

    thumb.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        const scrollTo = startScrollTop + ((e.clientY - startY) / trackRange()) * scrollable();
        window.scrollTo(0, scrollTo);
        setThumb(scrollTo / scrollable());
    });

    const endDrag = () => {
        isDragging = false;
        document.body.style.userSelect = '';
    };
    thumb.addEventListener('pointerup', endDrag);
    thumb.addEventListener('pointercancel', endDrag);

    window.addEventListener('scroll', updateThumbPosition, { passive: true });
    window.addEventListener('resize', updateThumbPosition);
    updateThumbPosition();
}

// --- Current year ---
function initCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) yearElement.textContent = new Date().getFullYear();
}

// --- Typing animation for the hero title ---
// Screen readers and crawlers get the full text via aria-label; the typed text is aria-hidden.
function initTypingAnimation() {
    const titleElement = document.querySelector('.hero-title');
    if (!titleElement || prefersReducedMotion) return;

    const text = titleElement.textContent.trim();
    titleElement.setAttribute('aria-label', text);

    // Reserve the final height so the layout doesn't jump while typing
    titleElement.style.minHeight = `${titleElement.offsetHeight}px`;

    const typed = document.createElement('span');
    typed.setAttribute('aria-hidden', 'true');
    titleElement.textContent = '';
    titleElement.appendChild(typed);

    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            typed.textContent += text.charAt(i++);
            setTimeout(typeWriter, 80);
        } else {
            titleElement.style.minHeight = '';
        }
    };
    setTimeout(typeWriter, 400);
}

// --- Parallax effect for the hero accent ---
function initParallaxEffect() {
    const aiAccent = document.querySelector('.ai-accent');
    if (!aiAccent || prefersReducedMotion) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            aiAccent.style.transform = `translateY(${window.scrollY * -0.5}px)`;
            ticking = false;
        });
    }, { passive: true });
}
