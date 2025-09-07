// Digital Business Card - JavaScript Functionality
// Author: Alex Johnson
// Description: Interactive features for the digital business card

(function() {
    'use strict';

    // Configuration and data
    const CONFIG = {
        personalInfo: {
            name: 'Alex Johnson',
            title: 'Full Stack Developer & UI/UX Designer',
            company: 'TechCorp Solutions',
            email: 'alex.johnson@example.com',
            phone: '+1 (555) 123-4567',
            location: 'San Francisco, CA',
            website: 'https://alexjohnson.dev'
        },
        socialLinks: {
            linkedin: 'https://linkedin.com/in/alexjohnson',
            github: 'https://github.com/alexjohnson',
            twitter: 'https://twitter.com/alexjohnson',
            instagram: 'https://instagram.com/alexjohnson'
        },
        qrOptions: {
            width: 200,
            height: 200,
            colorDark: '#2c3e50',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.M
        }
    };

    // DOM elements
    let elements = {};

    // Initialize the application
    function init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeApp);
        } else {
            initializeApp();
        }
    }

    function initializeApp() {
        // Cache DOM elements
        cacheElements();
        
        // Set up event listeners
        setupEventListeners();
        
        // Generate QR code
        generateQRCode();
        
        // Add smooth scroll behavior
        setupSmoothScrolling();
        
        console.log('Digital Business Card initialized successfully');
    }

    function cacheElements() {
        elements = {
            copyEmailBtn: document.getElementById('copyEmailBtn'),
            saveContactBtn: document.getElementById('saveContactBtn'),
            qrcode: document.getElementById('qrcode'),
            toast: document.getElementById('toast'),
            toastMessage: document.getElementById('toastMessage')
        };
    }

    function setupEventListeners() {
        // Copy email button
        if (elements.copyEmailBtn) {
            elements.copyEmailBtn.addEventListener('click', handleCopyEmail);
        }

        // Save contact button
        if (elements.saveContactBtn) {
            elements.saveContactBtn.addEventListener('click', handleSaveContact);
        }

        // Add keyboard support for buttons
        document.addEventListener('keydown', handleKeyboardNavigation);

        // Add click feedback for all buttons
        document.querySelectorAll('.btn, .social-link').forEach(button => {
            button.addEventListener('click', addClickFeedback);
        });
    }

    function handleCopyEmail(event) {
        event.preventDefault();
        
        const email = CONFIG.personalInfo.email;
        
        // Use the modern clipboard API if available
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(email).then(() => {
                showToast('Email address copied to clipboard!', 'success');
            }).catch(err => {
                console.error('Failed to copy email:', err);
                fallbackCopyEmail(email);
            });
        } else {
            // Fallback for older browsers or non-secure contexts
            fallbackCopyEmail(email);
        }
    }

    function fallbackCopyEmail(email) {
        // Create a temporary textarea element
        const textArea = document.createElement('textarea');
        textArea.value = email;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        
        try {
            textArea.focus();
            textArea.select();
            const successful = document.execCommand('copy');
            
            if (successful) {
                showToast('Email address copied to clipboard!', 'success');
            } else {
                showToast('Unable to copy email. Please copy manually: ' + email, 'error');
            }
        } catch (err) {
            console.error('Fallback copy failed:', err);
            showToast('Unable to copy email. Please copy manually: ' + email, 'error');
        } finally {
            document.body.removeChild(textArea);
        }
    }

    function handleSaveContact(event) {
        event.preventDefault();
        
        try {
            const vCardData = generateVCard();
            downloadVCard(vCardData);
            showToast('Contact saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving contact:', error);
            showToast('Error saving contact. Please try again.', 'error');
        }
    }

    function generateVCard() {
        const { personalInfo } = CONFIG;
        
        // Generate vCard 3.0 format
        const vCard = [
            'BEGIN:VCARD',
            'VERSION:3.0',
            `FN:${personalInfo.name}`,
            `N:${personalInfo.name.split(' ').reverse().join(';')};;;`,
            `ORG:${personalInfo.company}`,
            `TITLE:${personalInfo.title}`,
            `EMAIL:${personalInfo.email}`,
            `TEL:${personalInfo.phone}`,
            `ADR:;;;;;;${personalInfo.location}`,
            `URL:${personalInfo.website}`,
            'END:VCARD'
        ].join('\r\n');
        
        return vCard;
    }

    function downloadVCard(vCardData) {
        const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `${CONFIG.personalInfo.name.replace(/\s+/g, '_')}_contact.vcf`;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the URL object
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
        }, 100);
    }

    function generateQRCode() {
        if (!elements.qrcode) return;
        
        // Clear any existing QR code
        elements.qrcode.innerHTML = '';
        
        try {
            // Get current page URL
            const currentUrl = window.location.href;
            
            // Generate QR code
            new QRCode(elements.qrcode, {
                text: currentUrl,
                width: CONFIG.qrOptions.width,
                height: CONFIG.qrOptions.height,
                colorDark: CONFIG.qrOptions.colorDark,
                colorLight: CONFIG.qrOptions.colorLight,
                correctLevel: CONFIG.qrOptions.correctLevel
            });
            
            console.log('QR Code generated successfully for URL:', currentUrl);
        } catch (error) {
            console.error('Error generating QR code:', error);
            elements.qrcode.innerHTML = '<p style="color: #666; font-size: 14px;">QR code unavailable</p>';
        }
    }

    function showToast(message, type = 'info') {
        if (!elements.toast || !elements.toastMessage) return;
        
        elements.toastMessage.textContent = message;
        elements.toast.className = `toast show ${type}`;
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            elements.toast.className = 'toast hidden';
        }, 3000);
    }

    function addClickFeedback(event) {
        const button = event.currentTarget;
        
        // Add a visual click effect
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }

    function handleKeyboardNavigation(event) {
        // Handle Enter key on buttons for accessibility
        if (event.key === 'Enter') {
            const target = event.target;
            
            if (target.id === 'copyEmailBtn') {
                handleCopyEmail(event);
            } else if (target.id === 'saveContactBtn') {
                handleSaveContact(event);
            }
        }
    }

    function setupSmoothScrolling() {
        // Add smooth scrolling to anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Utility functions
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

    // Handle window resize for responsive QR code
    function handleResize() {
        // Debounced resize handler
        const debouncedResize = debounce(() => {
            // Re-generate QR code on significant resize
            if (window.innerWidth !== window.lastWidth) {
                generateQRCode();
                window.lastWidth = window.innerWidth;
            }
        }, 250);
        
        window.addEventListener('resize', debouncedResize);
        window.lastWidth = window.innerWidth;
    }

    // Enhanced error handling
    window.addEventListener('error', (event) => {
        console.error('Global error caught:', event.error);
        
        // Show user-friendly error message for critical failures
        if (event.error && event.error.message) {
            showToast('An unexpected error occurred. Please refresh the page.', 'error');
        }
    });

    // Handle offline/online status
    function handleConnectionStatus() {
        window.addEventListener('online', () => {
            showToast('Connection restored!', 'success');
        });
        
        window.addEventListener('offline', () => {
            showToast('You are currently offline', 'warning');
        });
    }

    // Performance monitoring
    function logPerformanceMetrics() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.timing;
                    const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                    console.log(`Page loaded in ${loadTime}ms`);
                    
                    // Log if load time is slower than 3 seconds
                    if (loadTime > 3000) {
                        console.warn('Page load time exceeded 3 seconds');
                    }
                }, 0);
            });
        }
    }

    // Initialize additional features
    function initializeEnhancements() {
        handleResize();
        handleConnectionStatus();
        logPerformanceMetrics();
    }

    // Start the application
    init();
    
    // Initialize enhancements after main initialization
    setTimeout(initializeEnhancements, 100);

})();
