document.addEventListener('DOMContentLoaded', function () {
    // Mobile navigation toggle
    initMobileNav();

    // Handle navbar on scroll
    initNavbarScroll();

    // Initialize modals
    initModals();

    // Gallery filters
    initGalleryFilters();

    // Back to top button
    initBackToTop();

    // Smooth scrolling
    initSmoothScrolling();

    // Community modals
    initCommunityModals();

    // Enquire modal
    initEnquireModal();

    // Initialize phone inputs and brochure modal
    initPhoneInputsAndBrochureModal();

    // Initialize Google Maps
    initMap();
});

function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', function () {
            // Toggle mobile navigation
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('active');

            // Animate toggle button
            const spans = navToggle.querySelectorAll('span');
            if (mobileMenu.classList.contains('hidden')) {
                // Reset to hamburger
                spans[0].classList.remove('rotate-45', 'translate-y-1.5', 'absolute');
                spans[1].classList.remove('opacity-0');
                spans[2].classList.remove('-rotate-45', '-translate-y-1.5', 'absolute');
            } else {
                // Transform to X
                spans[0].classList.add('rotate-45', 'translate-y-1.5', 'absolute');
                spans[1].classList.add('opacity-0');
                spans[2].classList.add('-rotate-45', '-translate-y-1.5', 'absolute');
            }
        });

        // Close mobile menu when clicking on a navigation link
        const mobileNavLinks = mobileMenu.querySelectorAll('a.mobile-nav-item');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function (event) {
                event.preventDefault(); // ✅ Fix: properly reference event

                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('active');

                // Reset toggle button to hamburger
                const spans = navToggle.querySelectorAll('span');
                spans[0].classList.remove('rotate-45', 'translate-y-1.5', 'absolute');
                spans[1].classList.remove('opacity-0');
                spans[2].classList.remove('-rotate-45', '-translate-y-1.5', 'absolute');

                // Scroll to section with offset for fixed header
                const targetId = this.getAttribute('href');
                if (targetId && targetId.startsWith('#')) {
                    const targetSection = document.querySelector(targetId);
                    const headerHeight = document.querySelector('header').offsetHeight;
                    if (targetSection) {
                        const topOffset =
                            targetSection.getBoundingClientRect().top +
                            window.pageYOffset -
                            headerHeight;
                        window.scrollTo({
                            top: topOffset,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
}

function initNavbarScroll() {
    const header = document.querySelector('header');

    if (header) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 100) {
                header.classList.add('py-2');
                header.classList.remove('py-4');
            } else {
                header.classList.add('py-4');
                header.classList.remove('py-2');
            }
        });
    }
}

function initModals() {
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    const modalOverlays = document.querySelectorAll('.modal-overlay');

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.getAttribute('data-modal');
            const modal = document.getElementById(modalId);

            if (modal) {
                modal.classList.remove('hidden');
                setTimeout(() => {
                    const modalContent = modal.querySelector('.transform');
                    if (modalContent) {
                        modalContent.classList.remove('scale-95', 'opacity-0');
                        modalContent.classList.add('scale-100', 'opacity-100');
                    }
                }, 10);
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeModal(modalContainer) {
        const modalContent = modalContainer.querySelector('.transform');
        if (modalContent) {
            modalContent.classList.remove('scale-100', 'opacity-100');
            modalContent.classList.add('scale-95', 'opacity-0');
        }

        setTimeout(() => {
            modalContainer.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);
    }

    modalCloseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalContainer = button.closest('.modal-container');
            if (modalContainer) {
                closeModal(modalContainer);
            }
        });
    });

    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            const modalContainer = overlay.closest('.modal-container');
            if (modalContainer) {
                closeModal(modalContainer);
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const visibleModal = document.querySelector('.modal-container:not(.hidden)');
            if (visibleModal) {
                closeModal(visibleModal);
            }
        }
    });
}

function initGalleryFilters() {
    const galleryFilters = document.querySelectorAll('.gallery-filter');
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            // Update active state
            galleryFilters.forEach(f => f.classList.remove('active', 'bg-Hayat-gold', 'text-white'));
            galleryFilters.forEach(f => f.classList.add('bg-white', 'border', 'border-Hayat-gold', 'text-Hayat-gold'));
            filter.classList.remove('bg-white', 'border', 'border-Hayat-gold', 'text-Hayat-gold');
            filter.classList.add('active', 'bg-Hayat-gold', 'text-white');

            const filterValue = filter.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    const propertyFilters = document.querySelectorAll('.filter-btn');
    const propertyCards = document.querySelectorAll('.property-card');

    propertyFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            // Update active state
            propertyFilters.forEach(f => f.classList.remove('active', 'bg-Hayat-dark', 'text-white'));
            filter.classList.add('active', 'bg-Hayat-dark', 'text-white');

            const filterValue = filter.getAttribute('data-filter');

            propertyCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTopBtn');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('opacity-100');
                backToTopBtn.classList.remove('opacity-0');
            } else {
                backToTopBtn.classList.add('opacity-0');
                backToTopBtn.classList.remove('opacity-100');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

function initSmoothScrolling() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]:not(.mobile-nav-item)').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const topOffset =
                    targetSection.getBoundingClientRect().top +
                    window.pageYOffset -
                    headerHeight;

                window.scrollTo({
                    top: topOffset,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initCommunityModals() {
    const communityCards = document.querySelectorAll('.community-card');
    const modalContainers = document.querySelectorAll('.modal-container');
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    const modalCloseButtons = document.querySelectorAll('.modal-close');

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');

        setTimeout(() => {
            const modalContent = modal.querySelector('.transform');
            if (modalContent) {
                modalContent.classList.remove('scale-95', 'opacity-0');
                modalContent.classList.add('scale-100', 'opacity-100');
            }
        }, 10);
    }

    function closeModal(modal) {
        const modalContent = modal.querySelector('.transform');
        if (modalContent) {
            modalContent.classList.remove('scale-100', 'opacity-100');
            modalContent.classList.add('scale-95', 'opacity-0');
        }

        setTimeout(() => {
            modal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        }, 300);
    }

    communityCards.forEach(card => {
        card.addEventListener('click', function () {
            const modalId = this.getAttribute('data-modal');
            openModal(modalId);
        });
    });

    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', function () {
            const modal = this.closest('.modal-container');
            closeModal(modal);
        });
    });

    modalCloseButtons.forEach(button => {
        button.addEventListener('click', function () {
            const modal = this.closest('.modal-container');
            closeModal(modal);
        });
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            modalContainers.forEach(modal => {
                if (!modal.classList.contains('hidden')) {
                    closeModal(modal);
                }
            });
        }
    });
}

function initEnquireModal() {
    const enquireModal = document.getElementById('enquireModal');
    const enquireModalContent = document.getElementById('enquireModalContent');
    const enquireModalOverlay = document.getElementById('enquireModalOverlay');
    const enquireModalClose = document.getElementById('enquireModalClose');
    const heroEnquireBtn = document.getElementById('heroEnquireBtn');
    const floatingEnquireBtn = document.getElementById('floatingEnquireBtn');

    function openEnquireModal() {
        enquireModal.classList.remove('hidden');
        setTimeout(() => {
            enquireModalContent.classList.remove('scale-95', 'opacity-0');
            enquireModalContent.classList.add('scale-100', 'opacity-100');
        }, 10);
        document.body.classList.add('overflow-hidden');
    }

    function closeEnquireModal() {
        enquireModalContent.classList.remove('scale-100', 'opacity-100');
        enquireModalContent.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            enquireModal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        }, 300);
    }

    if (heroEnquireBtn) heroEnquireBtn.addEventListener('click', openEnquireModal);
    if (floatingEnquireBtn) floatingEnquireBtn.addEventListener('click', openEnquireModal);
    if (enquireModalClose) enquireModalClose.addEventListener('click', closeEnquireModal);
    if (enquireModalOverlay) enquireModalOverlay.addEventListener('click', closeEnquireModal);
}

function initPhoneInputsAndBrochureModal() {
    // Initialize intl-tel-input for popup (modal)
    var enquirePopupPhone = document.getElementById('enquire-popup-phone');
    if (enquirePopupPhone && window.intlTelInput) {
        window.intlTelInput(enquirePopupPhone, {
            initialCountry: "ae",
            utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js"
        });
    }
    
    // Initialize intl-tel-input for right inquiry form
    var enquirePhone = document.getElementById('enquire-phone');
    if (enquirePhone && window.intlTelInput) {
        window.intlTelInput(enquirePhone, {
            initialCountry: "ae",
            utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js"
        });
    }
    
    // Initialize intl-tel-input for contact page
    var contactPhone = document.getElementById('contact-phone');
    if (contactPhone && window.intlTelInput) {
        window.intlTelInput(contactPhone, {
            initialCountry: "ae",
            utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js"
        });
    }

    // Initialize intl-tel-input for brochure form
    var brochurePhone = document.getElementById('brochure-phone');
    if (brochurePhone && window.intlTelInput) {
        window.intlTelInput(brochurePhone, {
            initialCountry: "ae",
            utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js"
        });
    }

    // Brochure Modal logic
    function openBrochureModal(downloadType = 'brochure') {
        document.getElementById('brochureModal').classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
        
        // Update modal content based on download type
        if (downloadType === 'masterplan') {
            document.getElementById('brochureModalTitle').textContent = 'Download Master Plan';
            document.getElementById('brochureModalDescription').textContent = 'Get the detailed master plan after submitting your details';
            document.getElementById('downloadTypeField').value = 'masterplan';
        } else if (downloadType === 'paymentplan') {
            document.getElementById('brochureModalTitle').textContent = 'Download Payment Plan';
            document.getElementById('brochureModalDescription').textContent = 'Get the detailed payment plan after submitting your details';
            document.getElementById('downloadTypeField').value = 'paymentplan';
        } else {
            document.getElementById('brochureModalTitle').textContent = 'Download Brochure';
            document.getElementById('brochureModalDescription').textContent = 'Get the full project brochure after submitting your details';
            document.getElementById('downloadTypeField').value = 'brochure';
        }
    }
    
    function closeBrochureModal() {
        document.getElementById('brochureModal').classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
        // Reset form and success message
        document.getElementById('brochureForm').reset();
        document.getElementById('brochureForm').classList.remove('hidden');
        document.getElementById('brochureSuccess').classList.add('hidden');
    }
    
    // Download brochure navigation buttons
    document.getElementById('downloadBrochureNavBtn')?.addEventListener('click', function(e) {
        e.preventDefault();
        openBrochureModal('brochure');
    });
    
    document.getElementById('downloadBrochureNavBtnMobile')?.addEventListener('click', function(e) {
        e.preventDefault();
        openBrochureModal('brochure');
    });
    
    // Payment Plan popup button
    document.getElementById('open-popup')?.addEventListener('click', function(e) {
        e.preventDefault();
        openBrochureModal('paymentplan');
    });
    
    // Master Plan download buttons
    document.querySelectorAll('.download-master-plan').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            openBrochureModal('masterplan');
        });
    });
    
    // Modal close events
    document.getElementById('brochureModalClose')?.addEventListener('click', closeBrochureModal);
    document.querySelector('#brochureModal .modal-overlay')?.addEventListener('click', closeBrochureModal);

    // Brochure form submit handler
    document.getElementById('brochureForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get the download type
        const downloadType = document.getElementById('downloadTypeField').value;
        
        // Hide form, show success
        document.getElementById('brochureForm').classList.add('hidden');
        document.getElementById('brochureSuccess').classList.remove('hidden');
        
        // Set the correct download link based on type
        const downloadLink = document.getElementById('brochurePdfLink');
        if (downloadType === 'masterplan') {
            downloadLink.href = "./Assets/FACTSHEET-1.pdf";
            downloadLink.setAttribute('download', 'HAYAT-FACTSHEET.pdf');
        } else if (downloadType === 'paymentplan') {
            downloadLink.href = "./Assets/HAYAT-PaymentPlan.pdf";
            downloadLink.setAttribute('download', 'HAYAT-PaymentPlan.pdf');
        } else {
            downloadLink.href = "./Assets/HAYATbyDubaiSouth-brochure.pdf";
            downloadLink.setAttribute('download', 'HAYATbyDubaiSouth-brochure.pdf');
        }
        
        // Start download automatically
        setTimeout(function() {
            downloadLink.click();
        }, 500);
    });
}

// Google Maps initialization
function initMap() {
    // Only initialize if map element exists
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    // Map options - centered at Dubai Production City
    const mapOptions = {
        center: { lat: 25.3463, lng: 55.4209 },
        zoom: 14,
        mapId: 'standard_map',
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        styles: [
            {
                "featureType": "all",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#444444"}]
            },
            {
                "featureType": "administrative.locality",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#2c3e50"}]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [{"visibility": "off"}]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [{"saturation": -100}, {"lightness": 45}]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [{"color": "#c8a876"}, {"visibility": "on"}]
            }
        ]
    };

    // Create the map
    const map = new google.maps.Map(mapElement, mapOptions);

    // Add a marker
    const marker = new google.maps.Marker({
        position: { lat: 25.3463, lng: 55.4209 },
        map: map,
        title: 'Hayat Real Estate',
        animation: google.maps.Animation.DROP,
        icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
            scaledSize: new google.maps.Size(40, 40)
        }
    });

    // Add an info window
    const infoWindow = new google.maps.InfoWindow({
        content: '<div style="padding: 8px; text-align: center;"><strong>Hayat Real Estate</strong><br>403, our nest real estate galadari building<br>Dubai Production City, Dubai, UAE</div>'
    });

    // Open info window when marker is clicked
    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });
}

// Make initMap globally available for Google Maps API callback
window.initMap = initMap;

