/* ==========================================================================
   PORTFOLIO - JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollEffects();
    initActiveNavLink();
    initCompetenceModal();
    initImageLightbox();
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

/* --------------------------------------------------------------------------
   COMPETENCE MODAL - Page Matrice
   -------------------------------------------------------------------------- */
let competencesData = null;

async function loadCompetencesData() {
    if (competencesData) return competencesData;
    try {
        const response = await fetch('js/data/competences.json');
        competencesData = await response.json();
        return competencesData;
    } catch (error) {
        console.error('Erreur chargement compétences:', error);
        return null;
    }
}

function initCompetenceModal() {
    // Vérifie si on est sur la page matrice
    if (!document.querySelector('.competence-group')) return;

    // Créer la modal si elle n'existe pas
    if (!document.getElementById('competence-modal')) {
        createModalHTML();
    }

    // Charger les données et configurer les clics
    loadCompetencesData().then(data => {
        if (!data) return;
        setupClickableYearSections(data);
    });

    // Gérer la fermeture de la modal
    setupModalClose();
}

function createModalHTML() {
    const modalHTML = `
        <div id="competence-modal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-header-info">
                        <div class="competence-icon" id="modal-icon"></div>
                        <div>
                            <h3 id="modal-title"></h3>
                            <p id="modal-subtitle"></p>
                        </div>
                    </div>
                    <button class="modal-close" aria-label="Fermer">✕</button>
                </div>
                <div class="modal-body">
                    <ul class="modal-ac-list" id="modal-ac-list"></ul>
                    <div class="modal-situations" id="modal-situations" style="display: none;">
                        <h4>📋 Situations Professionnelles</h4>
                        <ul id="modal-situations-list"></ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function setupClickableYearSections(data) {
    const competenceGroups = document.querySelectorAll('.competence-group');

    competenceGroups.forEach(group => {
        const yearSections = group.querySelectorAll('.matrix-year-section');
        const header = group.querySelector('.competence-header');
        const icon = header?.querySelector('.competence-icon');
        const title = header?.querySelector('.competence-title h3')?.textContent;
        const subtitle = header?.querySelector('.competence-title p')?.textContent;

        // Trouver la compétence correspondante
        let competenceId = null;
        if (icon?.classList.contains('administrer')) competenceId = 'administrer';
        else if (icon?.classList.contains('connecter')) competenceId = 'connecter';
        else if (icon?.classList.contains('programmer')) competenceId = 'programmer';
        else if (icon?.classList.contains('securiser')) competenceId = 'securiser';
        else if (icon?.classList.contains('surveiller')) competenceId = 'surveiller';

        const competence = data.competences.find(c => c.id === competenceId);
        if (!competence) return;

        yearSections.forEach(section => {
            const yearTitle = section.querySelector('.matrix-year-title')?.textContent?.trim();
            let yearKey = null;
            if (yearTitle === 'BUT 1') yearKey = 'but1';
            else if (yearTitle === 'BUT 2') yearKey = 'but2';
            else if (yearTitle === 'BUT 3') yearKey = 'but3';

            if (!yearKey || !competence.acs[yearKey]) return;

            // Rendre cliquable
            section.classList.add('clickable');
            section.addEventListener('click', (e) => {
                // Ignorer si on clique sur un lien SAÉ
                if (e.target.closest('.sae-btn')) return;
                openCompetenceModal(competence, yearKey, title, subtitle, icon?.textContent);
            });
        });
    });
}

function openCompetenceModal(competence, yearKey, title, subtitle, iconEmoji) {
    const modal = document.getElementById('competence-modal');
    const modalIcon = document.getElementById('modal-icon');
    const modalTitle = document.getElementById('modal-title');
    const modalSubtitle = document.getElementById('modal-subtitle');
    const modalACList = document.getElementById('modal-ac-list');
    const modalSituations = document.getElementById('modal-situations');
    const modalSituationsList = document.getElementById('modal-situations-list');

    // Mise à jour de l'en-tête
    modalIcon.textContent = iconEmoji || '📦';
    modalIcon.className = `competence-icon ${competence.id}`;
    modalTitle.textContent = `${title} — ${yearKey.toUpperCase().replace('BUT', 'BUT ')}`;
    modalSubtitle.textContent = subtitle;

    // Générer la liste des AC
    const acs = competence.acs[yearKey] || [];
    modalACList.innerHTML = acs.map(ac => `
        <li class="modal-ac-item">
            <span class="modal-ac-code">${ac.code}</span>
            <div class="modal-ac-content">
                <div class="modal-ac-name">${ac.shortName}</div>
                <div class="modal-ac-description">${ac.description}</div>
            </div>
        </li>
    `).join('');

    // Situations professionnelles (BUT2+ uniquement)
    const situations = competence.situations?.[yearKey] || [];
    if (situations.length > 0) {
        modalSituations.style.display = 'block';
        modalSituationsList.innerHTML = situations.map(s => `<li>${s}</li>`).join('');
    } else {
        modalSituations.style.display = 'none';
    }

    // Afficher la modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCompetenceModal() {
    const modal = document.getElementById('competence-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function setupModalClose() {
    // Fermer au clic sur overlay
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeCompetenceModal();
        }
    });

    // Fermer au clic sur bouton X
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-close')) {
            closeCompetenceModal();
        }
    });

    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCompetenceModal();
        }
    });
}

/* --------------------------------------------------------------------------
   IMAGE LIGHTBOX (ZOOM AU CLIC)
   -------------------------------------------------------------------------- */
function initImageLightbox() {
    // Créer la lightbox si elle n'existe pas
    if (!document.querySelector('.image-lightbox')) {
        const lightbox = document.createElement('div');
        lightbox.className = 'image-lightbox';
        lightbox.innerHTML = `
            <button class="lightbox-close">&times;</button>
            <img src="" alt="Image agrandie">
        `;
        document.body.appendChild(lightbox);

        // Fermer au clic sur la lightbox ou le bouton
        lightbox.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });

        // Fermer avec Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                lightbox.classList.remove('active');
            }
        });
    }

    // Ajouter les événements sur toutes les images zoomables
    const lightbox = document.querySelector('.image-lightbox');
    const lightboxImg = lightbox.querySelector('img');

    document.querySelectorAll('.zoomable-image').forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
        });
    });
}
