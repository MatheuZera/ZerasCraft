// Função para alternar entre as abas/sub-páginas de forma suave
function switchTab(tabId, event) {
    if (event) {
        event.preventDefault();
    }

    // Ocultar todas as seções
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Mostrar a seção alvo
    const targetSection = document.getElementById('tab-' + tabId);
    if (targetSection) {
        targetSection.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Atualizar classe ativa nos links da navbar
    const navLinks = document.querySelectorAll('.nav-links .nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(tabId)) {
            link.classList.add('active');
        }
    });

    // Fechar o menu mobile automaticamente ao clicar em um link
    const navMenu = document.getElementById('navLinks');
    if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
    }
}

// Lógica de funcionamento do Menu Hamburguer Mobile
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
});