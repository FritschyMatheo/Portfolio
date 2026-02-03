// Modal pour agrandissement d'images
document.addEventListener('DOMContentLoaded', function () {
    // Créer le modal
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <span class="close-modal">&times;</span>
        <img src="" alt="Image agrandie">
    `;
    document.body.appendChild(modal);

    const modalImg = modal.querySelector('img');
    const closeBtn = modal.querySelector('.close-modal');

    // Ajouter le click sur toutes les images de projet
    document.querySelectorAll('.project-images img').forEach(img => {
        img.addEventListener('click', function () {
            modal.classList.add('active');
            modalImg.src = this.src;
            modalImg.alt = this.alt;
        });
    });

    // Fermer le modal
    function closeModal() {
        modal.classList.remove('active');
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Fermer avec Echap
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});
