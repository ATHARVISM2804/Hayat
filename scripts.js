document.addEventListener('DOMContentLoaded', function () {
    initMobileNav();
    initNavbarScroll();
    initModals();
    initGalleryFilters();
    initBackToTop();
    initSmoothScrolling();
    initCommunityModals();
    initEnquireModal();
    initPhoneInputsAndBrochureModal();
    initMap();
    initFormHandling(); 
});

function initFormHandling() {
    const forms = document.querySelectorAll('form[action="https://api.web3forms.com/submit"]');

    forms.forEach(form => {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

           
            const brochureForm = document.getElementById('brochureForm');
            if (this === brochureForm) return;

            const submitButton = this.querySelector('button[type="submit"]');
            if (!submitButton) return;

            const originalButtonText = submitButton.innerHTML;
            const formFields = this.querySelectorAll('input, textarea, select');

            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            formFields.forEach(field => field.disabled = true);

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: new FormData(this)
                });

                const data = await response.json();

                if (data.success) {
                    
                    const successDiv = document.createElement('div');
                    successDiv.className = 'text-center py-4';
                    successDiv.innerHTML = `
                        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-check text-green-500 text-2xl"></i>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-800 mb-2">Thank You!</h3>
                        <p class="text-gray-600">Your message has been sent successfully.</p>
                    `;

                   
                    this.reset();
                    const formContent = this.innerHTML;
                    this.innerHTML = '';
                    this.appendChild(successDiv);

                    
                    setTimeout(() => {
                        this.innerHTML = formContent;
                        const newSubmitButton = this.querySelector('button[type="submit"]');
                        if (newSubmitButton) {
                            newSubmitButton.disabled = false;
                            newSubmitButton.innerHTML = originalButtonText;
                        }
                    }, 3000);
                } else {
                    throw new Error('Submission failed');
                }
            } catch (error) {
                console.error('Error:', error);
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
                formFields.forEach(field => field.disabled = false);
                alert('There was an error sending your message. Please try again.');
            }
        });
    });
}

function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('active');
            const spans = navToggle.querySelectorAll('span');
            if (mobileMenu.classList.contains('hidden')) {
                spans[0].classList.remove('rotate-45', 'translate-y-1.5', 'absolute');
                spans[1].classList.remove('opacity-0');
                spans[2].classList.remove('-rotate-45', '-translate-y-1.5', 'absolute');
            } else {
                spans[0].classList.add('rotate-45', 'translate-y-1.5', 'absolute');
                spans[1].classList.add('opacity-0');
                spans[2].classList.add('-rotate-45', '-translate-y-1.5', 'absolute');
            }
        });

        const mobileNavLinks = mobileMenu.querySelectorAll('a.mobile-nav-item');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function (event) {
                event.preventDefault(); 

                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('active');

                const spans = navToggle.querySelectorAll('span');
                spans[0].classList.remove('rotate-45', 'translate-y-1.5', 'absolute');
                spans[1].classList.remove('opacity-0');
                spans[2].classList.remove('-rotate-45', '-translate-y-1.5', 'absolute');

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
    var enquirePopupPhone = document.getElementById('enquire-popup-phone');
    if (enquirePopupPhone && window.intlTelInput) {
        window.intlTelInput(enquirePopupPhone, {
            initialCountry: "ae",
            utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js"
        });
    }

    var enquirePhone = document.getElementById('enquire-phone');
    if (enquirePhone && window.intlTelInput) {
        window.intlTelInput(enquirePhone, {
            initialCountry: "ae",
            utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js"
        });
    }

    var contactPhone = document.getElementById('contact-phone');
    if (contactPhone && window.intlTelInput) {
        window.intlTelInput(contactPhone, {
            initialCountry: "ae",
            utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js"
        });
    }

    var brochurePhone = document.getElementById('brochure-phone');
    if (brochurePhone && window.intlTelInput) {
        window.intlTelInput(brochurePhone, {
            initialCountry: "ae",
            utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js"
        });
    }

    function openBrochureModal(downloadType = 'brochure') {
        document.getElementById('brochureModal').classList.remove('hidden');
        document.body.classList.add('overflow-hidden');

        if (downloadType === 'masterplan') {
            document.getElementById('brochureModalTitle').textContent = 'Download Master Plan';
            document.getElementById('brochureModalDescription').textContent = 'Get the detailed master plan after submitting your details';
            document.getElementById('downloadTypeField').value = 'masterplan';
        } else if (downloadType === 'paymentplan') {
            document.getElementById('brochureModalTitle').textContent = 'Download Payment Plan';
            document.getElementById('brochureModalDescription').textContent = 'Get the detailed payment plan after submitting your details';
            document.getElementById('downloadTypeField').value = 'paymentplan';
        } else if (downloadType === 'locationguide') {
            document.getElementById('brochureModalTitle').textContent = 'Download Location Guide';
            document.getElementById('brochureModalDescription').textContent = 'Get the detailed location and connectivity guide after submitting your details';
            document.getElementById('downloadTypeField').value = 'locationguide';
        } else {
            document.getElementById('brochureModalTitle').textContent = 'Download Brochure';
            document.getElementById('brochureModalDescription').textContent = 'Get the full project brochure after submitting your details';
            document.getElementById('downloadTypeField').value = 'brochure';
        }
    }

    function closeBrochureModal() {
        document.getElementById('brochureModal').classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
        document.getElementById('brochureForm').reset();
        document.getElementById('brochureForm').classList.remove('hidden');
        document.getElementById('brochureSuccess').classList.add('hidden');
    }

    document.getElementById('downloadBrochureNavBtn')?.addEventListener('click', function (e) {
        e.preventDefault();
        openBrochureModal('brochure');
    });

    document.getElementById('downloadBrochureNavBtnMobile')?.addEventListener('click', function (e) {
        e.preventDefault();
        openBrochureModal('brochure');
    });

    document.getElementById('open-popup')?.addEventListener('click', function (e) {
        e.preventDefault();
        openBrochureModal('locationguide');
    });

    document.getElementById('explore-amenities')?.addEventListener('click', function (e) {
        e.preventDefault();
        const enquireModal = document.getElementById('enquireModal');
        const enquireModalContent = document.getElementById('enquireModalContent');
        enquireModal.classList.remove('hidden');
        setTimeout(() => {
            enquireModalContent.classList.remove('scale-95', 'opacity-0');
            enquireModalContent.classList.add('scale-100', 'opacity-100');
        }, 10);
        document.body.classList.add('overflow-hidden');
    });

    document.querySelectorAll('.download-master-plan').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            openBrochureModal('masterplan');
        });
    });

    document.getElementById('brochureModalClose')?.addEventListener('click', closeBrochureModal);
    document.querySelector('#brochureModal .modal-overlay')?.addEventListener('click', closeBrochureModal);

    document.getElementById('brochureForm')?.addEventListener('submit', async function (e) {
        e.preventDefault();

        const submitButton = this.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

        const formData = new FormData(this);
        const downloadType = document.getElementById('downloadTypeField').value;

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                document.getElementById('brochureForm').classList.add('hidden');
                document.getElementById('brochureSuccess').classList.remove('hidden');
                const downloadLink = document.getElementById('brochurePdfLink');
                if (downloadType === 'masterplan') {
                    downloadLink.href = "./Assets/FACTSHEET-1.pdf";
                    downloadLink.setAttribute('download', 'HAYAT-FACTSHEET.pdf');
                } else if (downloadType === 'paymentplan') {
                    downloadLink.href = "./Assets/HAYAT-PaymentPlan.pdf";
                    downloadLink.setAttribute('download', 'HAYAT-PaymentPlan.pdf');
                } else if (downloadType === 'locationguide') {
                    downloadLink.href = "./Assets/HAYAT-LocationGuide.pdf";
                    downloadLink.setAttribute('download', 'HAYAT-LocationGuide.pdf');
                } else {
                    downloadLink.href = "./Assets/HAYATbyDubaiSouth-brochure.pdf";
                    downloadLink.setAttribute('download', 'HAYATbyDubaiSouth-brochure.pdf');
                }
                downloadLink.click();
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText;
                }, 1000);
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error processing your request. Please try again.');
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });

    document.getElementById('brochureModalClose')?.addEventListener('click', function () {
        const submitButton = document.querySelector('#brochureForm button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Download Now';
        }
    });
    document.querySelector('#brochureModal .modal-overlay')?.addEventListener('click', function () {
        const submitButton = document.querySelector('#brochureForm button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Download Now';
        }
    });
}

function initMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

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
                "stylers": [{ "color": "#444444" }]
            },
            {
                "featureType": "administrative.locality",
                "elementType": "labels.text.fill",
                "stylers": [{ "color": "#2c3e50" }]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [{ "visibility": "off" }]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [{ "saturation": -100 }, { "lightness": 45 }]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [{ "color": "#c8a876" }, { "visibility": "on" }]
            }
        ]
    };

    const map = new google.maps.Map(mapElement, mapOptions);
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

    const infoWindow = new google.maps.InfoWindow({
        content: '<div style="padding: 8px; text-align: center;"><strong>Hayat Real Estate</strong><br>403, our nest real estate galadari building<br>Dubai Production City, Dubai, UAE</div>'
    });

    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });
}

window.initMap = initMap;


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('popupContainer').classList.remove('hidden');
});

function closePopup() {
    document.getElementById('popupContainer').classList.add('hidden');
}

window.addEventListener('message', (event) => {
    if (event.data === 'closePopup') {
        closePopup();
        const enquireModal = document.getElementById('enquireModal');
        const enquireModalContent = document.getElementById('enquireModalContent');
        if (enquireModal && enquireModalContent) {
            enquireModal.classList.remove('hidden');
            setTimeout(() => {
                enquireModalContent.classList.remove('scale-95', 'opacity-0');
                enquireModalContent.classList.add('scale-100', 'opacity-100');
            }, 10);
            document.body.classList.add('overflow-hidden');
        }
    } else if (event.data === 'closePopupOnly') {
        closePopup();
    }
});

document.addEventListener('DOMContentLoaded', function () {
    var enquirePopupPhone = document.getElementById('enquire-popup-phone');
    if (enquirePopupPhone && window.intlTelInput) {
        window.intlTelInput(enquirePopupPhone, {
            initialCountry: "ae",
            utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js"
        });
    }
    var enquirePhone = document.getElementById('enquire-phone');
    if (enquirePhone && window.intlTelInput) {
        window.intlTelInput(enquirePhone, {
            initialCountry: "ae",
            utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js"
        });
    }
    var contactPhone = document.getElementById('contact-phone');
    if (contactPhone && window.intlTelInput) {
        window.intlTelInput(contactPhone, {
            initialCountry: "ae",
            utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js"
        });
    }
    function openBrochureModal(downloadType = 'brochure') {
        document.getElementById('brochureModal').classList.remove('hidden');
        document.body.classList.add('overflow-hidden');

        if (downloadType === 'masterplan') {
            document.getElementById('brochureModalTitle').textContent = 'Download Master Plan/';
            document.getElementById('brochureModalDescription').textContent = 'Get the detailed master plan after submitting your details';
            document.getElementById('downloadTypeField').value = 'masterplan';
        } else {
            document.getElementById('brochureModalTitle').textContent = 'Download Brochure';
            document.getElementById('brochureModalDescription').textContent = 'Get the full project brochure after submitting your details';
            document.getElementById('downloadTypeField').value = 'brochure';
        }
    }

    function closeBrochureModal() {
        document.getElementById('brochureModal').classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
        document.getElementById('brochureForm').reset();
        document.getElementById('brochureForm').classList.remove('hidden');
        document.getElementById('brochureSuccess').classList.add('hidden');
    }

    document.getElementById('downloadBrochureNavBtn')?.addEventListener('click', function (e) {
        e.preventDefault();
        openBrochureModal('brochure');
    });

    document.getElementById('downloadBrochureNavBtnMobile')?.addEventListener('click', function (e) {
        e.preventDefault();
        openBrochureModal('brochure');
    });

    document.querySelectorAll('.download-master-plan').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            openBrochureModal('masterplan');
        });
    });

    document.getElementById('brochureModalClose')?.addEventListener('click', closeBrochureModal);
    document.querySelector('#brochureModal .modal-overlay')?.addEventListener('click', closeBrochureModal);

    var brochurePhone = document.getElementById('brochure-phone');
    if (brochurePhone && window.intlTelInput) {
        window.intlTelInput(brochurePhone, {
            initialCountry: "ae",
            utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js"
        });
    }

    const forms = document.querySelectorAll('form[action="https://api.web3forms.com/submit"]');
    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            const brochureForm = document.getElementById('brochureForm');
            if (this === brochureForm) return;

            e.preventDefault();

            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;

            const formData = new FormData(this);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        this.innerHTML = `
                                <div class="text-center py-8">
                                    <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <i class="fas fa-check text-green-500 text-2xl"></i>
                                    </div>
                                    <h3 class="text-xl font-semibold text-gray-800 mb-2">Thank You!</h3>
                                    <p class="text-gray-600">Your message has been sent successfully. We'll get back to you soon.</p>
                                </div>
                            `;

                        const modal = this.closest('.fixed[id*="Modal"]');
                        if (modal) {
                            setTimeout(() => {
                                modal.classList.add('hidden');
                                document.body.classList.remove('overflow-hidden');
                                setTimeout(() => {
                                    this.reset();
                                    submitButton.innerHTML = originalText;
                                    submitButton.disabled = false;
                                    this.innerHTML = this.innerHTML; 
                                }, 300);
                            }, 2000);
                        }
                    } else {
                        throw new Error('Form submission failed');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                    alert('There was an error sending your message. Please try again.');
                });
        });
    });
});


function initMap() {
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
                "stylers": [{ "color": "#444444" }]
            },
            {
                "featureType": "administrative.locality",
                "elementType": "labels.text.fill",
                "stylers": [{ "color": "#2c3e50" }]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [{ "visibility": "off" }]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [{ "saturation": -100 }, { "lightness": 45 }]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [{ "color": "#c8a876" }, { "visibility": "on" }]
            }
        ]
    };

    const map = new google.maps.Map(document.getElementById('map'), mapOptions);

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
    const infoWindow = new google.maps.InfoWindow({
        content: '<div style="padding: 8px; text-align: center;"><strong>Hayat Real Estate</strong><br>123 Real Estate Ave<br>Business District, Sharjah, UAE</div>'
    });

    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });
}