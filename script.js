/**
 * LORD REAL ESTATE - Premium Interactive Features
 * Modern luxury real estate website JavaScript
 *
 * Features:
 * - Smooth scroll navigation
 * - Sticky navbar with scroll effects
 * - Mobile hamburger menu
 * - Testimonials slider
 * - Scroll reveal animations
 * - Property filtering (demo)
 * - Form handling
 * - Favorite toggle
 */

// ============================================
// DOM CONTENT LOADED
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initMobileMenu();
    initTestimonialsSlider();
    initScrollReveal();
    initPropertyFilter();
    initFavorites();
    initForms();
    initSmoothScroll();
});

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    let lastScroll = 0;

    // Navbar scroll effect
    function handleScroll() {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }

    // Throttle scroll events for performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(handleScroll);
    });

    // Active link on scroll
    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.pageYOffset + 100;

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

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();
}

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        body.style.overflow = '';
    }

    hamburger.addEventListener('click', toggleMenu);

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // Close menu when clicking outside
    navMenu.addEventListener('click', function(e) {
        if (e.target === navMenu) {
            closeMenu();
        }
    });
}

// ============================================
// TESTIMONIALS SLIDER
// ============================================
function initTestimonialsSlider() {
    const track = document.getElementById('testimonialsTrack');
    const dotsContainer = document.getElementById('testimonialsDots');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!track) return;

    const cards = track.querySelectorAll('.testimonial-card');
    const totalSlides = cards.length;
    let currentSlide = 0;
    let autoplayInterval;

    // Create dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.classList.add('testimonial-dot');
        dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }

    const dots = dotsContainer.querySelectorAll('.testimonial-dot');

    function updateSlider() {
        // Update track position
        track.style.transform = `translateX(-${currentSlide * 100}%)`;

        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function goToSlide(index) {
        currentSlide = index;
        updateSlider();
        resetAutoplay();
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    }

    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }

    // Event listeners
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoplay();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoplay();
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            resetAutoplay();
        }
    }

    // Pause autoplay on hover
    track.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    track.addEventListener('mouseleave', startAutoplay);

    // Keyboard navigation
    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoplay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoplay();
        }
    });

    // Start autoplay
    startAutoplay();
}

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-fade, .reveal-up');

    // Skip hero elements - they have CSS animations
    const heroElements = document.querySelectorAll('.hero-content .reveal-fade');
    heroElements.forEach(el => el.classList.add('revealed'));

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(element => {
        // Skip hero elements
        if (!element.closest('.hero-content')) {
            observer.observe(element);
        }
    });
}

// ============================================
// PROPERTY FILTER (Demo)
// ============================================
function initPropertyFilter() {
    const searchBtn = document.getElementById('searchBtn');
    const locationSelect = document.getElementById('location');
    const typeSelect = document.getElementById('propertyType');
    const priceSelect = document.getElementById('priceRange');
    const bedroomsSelect = document.getElementById('bedrooms');
    const propertiesGrid = document.getElementById('propertiesGrid');

    if (!searchBtn || !propertiesGrid) return;

    const propertyCards = propertiesGrid.querySelectorAll('.property-card');

    function filterProperties() {
        const location = locationSelect.value;
        const type = typeSelect.value;
        const priceRange = priceSelect.value;

        let visibleCount = 0;

        propertyCards.forEach(card => {
            const cardLocation = card.dataset.location || '';
            const cardType = card.dataset.type || '';
            const cardPrice = parseInt(card.dataset.price) || 0;

            let showCard = true;

            // Location filter
            if (location && cardLocation !== location) {
                showCard = false;
            }

            // Type filter
            if (type && cardType !== type) {
                showCard = false;
            }

            // Price range filter
            if (priceRange) {
                const [minStr, maxStr] = priceRange.split('-');
                const min = parseInt(minStr) || 0;
                const max = maxStr === '+' ? Infinity : parseInt(maxStr) || Infinity;

                if (cardPrice < min || cardPrice > max) {
                    showCard = false;
                }
            }

            // Show/hide card with animation
            if (showCard) {
                card.style.display = '';
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';

                setTimeout(() => {
                    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50 * visibleCount);

                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Show message if no results
        const existingMessage = propertiesGrid.querySelector('.no-results');
        if (existingMessage) {
            existingMessage.remove();
        }

        if (visibleCount === 0) {
            const message = document.createElement('div');
            message.className = 'no-results';
            message.style.cssText = `
                grid-column: 1 / -1;
                text-align: center;
                padding: 60px 20px;
                color: #6b7280;
                font-size: 1.125rem;
            `;
            message.innerHTML = `
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin: 0 auto 16px; display: block; opacity: 0.5;">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                </svg>
                <p>No properties match your criteria.</p>
                <p style="font-size: 0.875rem; margin-top: 8px;">Try adjusting your filters.</p>
            `;
            propertiesGrid.appendChild(message);
        }
    }

    // Search button click
    searchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        filterProperties();

        // Scroll to properties section
        const propertiesSection = document.getElementById('properties');
        if (propertiesSection) {
            propertiesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    // Filter on change (optional - for live filtering)
    // [locationSelect, typeSelect, priceSelect, bedroomsSelect].forEach(select => {
    //     select.addEventListener('change', filterProperties);
    // });
}

// ============================================
// FAVORITES TOGGLE
// ============================================
function initFavorites() {
    const favoriteButtons = document.querySelectorAll('.property-favorite');

    favoriteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.toggle('active');

            // Add heart fill animation
            const svg = this.querySelector('svg');
            if (this.classList.contains('active')) {
                svg.style.fill = '#ef4444';
                svg.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    svg.style.transform = 'scale(1)';
                }, 200);
            } else {
                svg.style.fill = 'none';
            }

            // Show toast notification
            showToast(this.classList.contains('active') ? 'Added to favorites' : 'Removed from favorites');
        });
    });
}

// ============================================
// TOAST NOTIFICATION
// ============================================
function showToast(message) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        padding: 12px 24px;
        background: #1f2937;
        color: white;
        border-radius: 8px;
        font-size: 0.875rem;
        font-weight: 500;
        z-index: 9999;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
    `;

    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    // Remove after delay
    setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// ============================================
// FORM HANDLING
// ============================================
function initForms() {
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            // Basic validation
            if (!data.firstName || !data.lastName || !data.email) {
                showToast('Please fill in all required fields');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showToast('Please enter a valid email address');
                return;
            }

            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
                    <circle cx="12" cy="12" r="10" stroke-dasharray="31.4 31.4" stroke-dashoffset="0"/>
                </svg>
                <span>Sending...</span>
            `;
            submitBtn.disabled = true;

            // Add spin animation
            const style = document.createElement('style');
            style.textContent = '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }';
            document.head.appendChild(style);

            // Simulate API call
            setTimeout(() => {
                submitBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    <span>Message Sent!</span>
                `;
                submitBtn.style.background = '#10b981';

                showToast('Thank you! We\'ll be in touch soon.');

                // Reset form
                setTimeout(() => {
                    this.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 2000);
            }, 1500);
        });
    }

    // Newsletter Form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = this.querySelector('input[type="email"]').value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                showToast('Please enter a valid email address');
                return;
            }

            // Simulate subscription
            showToast('Successfully subscribed to our newsletter!');
            this.reset();
        });
    }
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#" or empty
            if (!href || href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();

                const navHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for performance
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Format price with commas
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(price);
}

// ============================================
// LAZY LOADING IMAGES (Performance Enhancement)
// ============================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px'
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// PARALLAX EFFECT (Optional Enhancement)
// ============================================
function initParallax() {
    const hero = document.querySelector('.hero-image');
    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        if (scrolled < window.innerHeight) {
            hero.style.transform = `scale(1.1) translateY(${scrolled * 0.3}px)`;
        }
    }, 16));
}

// Initialize parallax on load
window.addEventListener('load', initParallax);

// ============================================
// COUNTER ANIMATION (For Stats)
// ============================================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const end = parseInt(target);
    const range = end - start;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + range * easeOut);

        element.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = end.toLocaleString();
        }
    }

    requestAnimationFrame(update);
}

// Observe stats for animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(num => {
                const text = num.textContent;
                const value = parseInt(text.replace(/[^0-9]/g, ''));
                const suffix = text.replace(/[0-9,]/g, '');

                if (!isNaN(value)) {
                    num.textContent = '0' + suffix;
                    setTimeout(() => {
                        animateCounter(num, value);
                        setTimeout(() => {
                            num.textContent = text;
                        }, 2100);
                    }, 200);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stats, .about-stats').forEach(el => {
    statsObserver.observe(el);
});
