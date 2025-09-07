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

