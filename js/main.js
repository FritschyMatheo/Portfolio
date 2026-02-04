/* ==========================================================================
   PORTFOLIO - JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollEffects();
    initActiveNavLink();
});

/* --------------------------------------------------------------------------
   NAVIGATION MOBILE
   -------------------------------------------------------------------------- */
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            navToggle.classList.toggle('active');
        });

        // Fermer le menu au clic sur un lien
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                navToggle.classList.remove('active');
            });
        });
    }
}

/* --------------------------------------------------------------------------
   SCROLL EFFECTS
   -------------------------------------------------------------------------- */
function initScrollEffects() {
    const header = document.querySelector('.header');

    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

/* --------------------------------------------------------------------------
   ACTIVE NAV LINK
   -------------------------------------------------------------------------- */
function initActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

/* --------------------------------------------------------------------------
   CHARGEMENT DYNAMIQUE DES PROJETS (si nécessaire)
   -------------------------------------------------------------------------- */
async function loadProjects(year) {
    try {
        const response = await fetch(`js/data/projects.json`);
        const data = await response.json();
        return data.filter(project => project.year === year);
    } catch (error) {
        console.error('Erreur chargement projets:', error);
        return [];
    }
}

/* --------------------------------------------------------------------------
   FILTRAGE PAR AC
   -------------------------------------------------------------------------- */
function filterProjectsByAC(acCode) {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        const cardACs = card.dataset.acs ? card.dataset.acs.split(',') : [];
        if (acCode === 'all' || cardACs.includes(acCode)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

/* --------------------------------------------------------------------------
   ANIMATION INTERSECTION OBSERVER
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}
