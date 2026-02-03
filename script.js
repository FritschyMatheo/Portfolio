document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Select elements inside the button
    const iconSpan = themeToggle.querySelector('.icon');
    const textSpan = themeToggle.querySelector('.text');

    // Function to update UI based on theme
    function updateUI(isLight) {
        if (isLight) {
            iconSpan.textContent = '☀️';
            textSpan.textContent = 'Clair';
        } else {
            iconSpan.textContent = '🌙';
            textSpan.textContent = 'Sombre';
        }
    }

    // Check local storage - Default is Dark (no class)
    // If 'light', add class
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        updateUI(true);
    } else {
        updateUI(false);
    }

    themeToggle.addEventListener('click', () => {
        // Toggle light-mode class
        body.classList.toggle('light-mode');
        const isLight = body.classList.contains('light-mode');

        // Save preference
        if (isLight) {
            localStorage.setItem('theme', 'light');
        } else {
            localStorage.setItem('theme', 'dark');
        }

        // Update Text & Icon
        updateUI(isLight);
    });
});
