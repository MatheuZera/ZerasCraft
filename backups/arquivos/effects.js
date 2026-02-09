// =====================================
// Configuração de Áudio
// =====================================

const AUDIO_BASE_PATH = 'assets/audios/effects/';

// Sistema de volumes individuais (0 a 100)
const EFFECT_VOLUMES = {
    link: 70,        // Volume para sons de navegação
    card: 50,        // Volume para hover em cards
    button: 15,      // Volume para hover em botões
    select:80,      // Volume para hover em links de texto
    click: 30         // Volume para cliques em botões
};

// Define os caminhos e pre-carrega os sons
const linkSound = new Audio(AUDIO_BASE_PATH + 'link.mp3');
const cardSound = new Audio(AUDIO_BASE_PATH + 'card.mp3');
const buttonSound = new Audio(AUDIO_BASE_PATH + 'button.mp3');
const selectSound = new Audio(AUDIO_BASE_PATH + 'select.mp3');
const buttonClickSound = new Audio(AUDIO_BASE_PATH + 'button-click.mp3');

[linkSound, cardSound, buttonSound, selectSound, buttonClickSound].forEach(s => s.preload = 'auto');

/**
 * Toca um som de forma controlada com volume específico.
 * @param {HTMLAudioElement} sound - O objeto de áudio.
 * @param {number} volumePercentage - Porcentagem de 0 a 100.
 */
function playSound(sound, volumePercentage) {
    const clonedSound = sound.cloneNode();
    
    // Converte a porcentagem (ex: 70) para o valor decimal do JS (ex: 0.7)
    clonedSound.volume = volumePercentage / 100;
    
    clonedSound.play().catch(e => console.error("Erro ao tocar o áudio:", e));
}

// =====================================
// Gerenciamento de Eventos de Clique
// =====================================

document.addEventListener('click', (event) => {
    const target = event.target.closest('a, button');

    if (!target) return;

    // Ignora os botões do player principal para evitar sons duplicados
    if (target.id === 'audioControlButton' || target.id === 'audioPrevButton' || target.id === 'audioNextButton') return;

    const isNavLink = target.tagName === 'A' && target.href && !target.href.startsWith('#') && !target.href.includes('javascript:');
    const isSpecialButton = target.tagName === 'BUTTON' || (target.tagName === 'A' && target.href.startsWith('#'));

    if (isNavLink) {
        event.preventDefault();
        playSound(linkSound, EFFECT_VOLUMES.link);
        setTimeout(() => {
            window.location.href = target.href;
        }, 300);
    } else if (isSpecialButton) {
        playSound(buttonClickSound, EFFECT_VOLUMES.click);
    }
});

// =====================================
// Gerenciamento de Eventos de Hover
// =====================================

const cardElements = document.querySelectorAll('.market-card, .dl-card, .rank-card, .gallery-item, .faq-item');
const buttonElements = document.querySelectorAll('.btn-green, .btn-sidebar, .tab-btn, .pill-btn, .social-box, .back-to-top, .burger');
const textLinkElements = document.querySelectorAll('.footer-col a, .sidebar-links a, p a');

cardElements.forEach(element => {
    element.addEventListener('mouseenter', () => playSound(cardSound, EFFECT_VOLUMES.card));
});

buttonElements.forEach(element => {
    element.addEventListener('mouseenter', () => playSound(buttonSound, EFFECT_VOLUMES.button));
});

textLinkElements.forEach(element => {
    element.addEventListener('mouseenter', () => playSound(selectSound, EFFECT_VOLUMES.select));
});