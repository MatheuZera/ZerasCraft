/**
 * ZERA'S CRAFT - SISTEMA DE ÁUDIO SINCRONIZADO
 */

const AUDIO_PATH = "assets/audios/effects/";

const sounds = {
    button: new Audio(AUDIO_PATH + "button.mp3"),
    buttonClick: new Audio(AUDIO_PATH + "button-click.mp3"),
    card: new Audio(AUDIO_PATH + "card.mp3"),
    link: new Audio(AUDIO_PATH + "link.mp3"),
    select: new Audio(AUDIO_PATH + "select.mp3")
};

// Pré-carrega todos
Object.values(sounds).forEach(s => s.preload = "auto");

function play(key, vol = 0.4) {
    const s = sounds[key].cloneNode();
    s.volume = vol;
    s.play().catch(() => { });
}

// =====================================
// LISTAS DE CLASSES
// =====================================

// 1. Som 'button' no HOVER
const HOVER_BUTTON = [".back-to-top", ".btn-primary", ".btn-outline", ".znav-tab", ".mc-arrow", ".tab-btn", ".burger", ".faq-item", ".zmob-has-dropdown", ".btn-price", ".btn-hero-green", ".video-frame", ".acc-btn", ".w-arrow", ".mc-tab", ".h-arrow", ".btn-elite-plus", ".tip-close-btn", ".special-link", ".btn-abrir", ".checkout-btn", ".feat-tab", ".nav-tab-btn", ".thumb-item", ".btn-toggle-text", ".btn-next-img", ".nav-arrow", ".d-thumb"];

// 2. Som 'button_click' no CLIQUE (Acordeões e Botões)
const CLICK_ACTION = [".btn-outline", ".btn-sidebar", ".znav-tab", ".faq-item", ".zmob-has-dropdown", ".btn-primary", ".btn-green", ".tab-btn", ".btn-price", ".btn-hero-green", ".play-btn", ".mc-arrow", ".acc-btn", ".w-arrow", ".mc-tab", ".h-arrow", ".btn-elite-plus", ".tip-close-btn", ".btn-abrir", ".checkout-btn", ".feat-tab", ".nav-tab-btn", ".thumb-item", ".btn-toggle-text", ".nav-arrow", ".d-thumb", ".mc-acc-item"];

// 3. Som 'card' no HOVER
const HOVER_CARD = [".mc-collectible-card", ".gallery-item", ".game-card2", ".mode-card", ".mc-news-card", ".f-card", ".w-item", ".game-card-simple", ".content-item", ".link-item", ".game-card"];

// 4. Som 'select' no HOVER (Links de texto)
const HOVER_SELECT = [".znav-item", ".footer-col a", ".mc-link-all", "p a", ".promo-box", ".link-btn-card", ".dl-card", ".testi-card", ".news-card", ".t-row-elite", ".sidebar-link", ".feature-tag", ".btn-demo ", ".dropdown-link", ".table-item", ".fab-button", ".znav-item"];

// =====================================
// APLICAÇÃO DOS EVENTOS
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    // Aplica HOVER (Som button)
    HOVER_BUTTON.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
            el.addEventListener("mouseenter", () => play("button", 0.2));
        });
    });

    // Aplica CLIQUE (Som buttonClick) - ESSENCIAL PARA O ACORDEÃO
    CLICK_ACTION.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
            el.addEventListener("click", () => play("buttonClick", 0.5));
        });
    });

    // Aplica HOVER (Som card)
    HOVER_CARD.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
            el.addEventListener("mouseenter", () => play("card", 0.15));
        });
    });

    // Aplica HOVER (Som select)
    HOVER_SELECT.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
            el.addEventListener("mouseenter", () => play("select", 0.2));
        });
    });

    // Lógica Global de Links Externos (Som link)
    document.addEventListener("click", (e) => {
        const a = e.target.closest("a");
        if (a && a.href && !a.href.startsWith("#") && !a.href.includes("javascript:")) {
            e.preventDefault();
            play("link", 0.6);
            setTimeout(() => window.location.href = a.href, 400);
        }
    });
});