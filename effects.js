/**
 * ZERA'S CRAFT - MOTOR DE ÁUDIO GLOBAL
 * Versão: Correção para Mega Menu (Capture Phase)
 */

const AUDIO_PATH = "assets/audios/effects/";

const sounds = {
  button: new Audio(AUDIO_PATH + "button.mp3"),
  buttonClick: new Audio(AUDIO_PATH + "button-click.mp3"),
  card: new Audio(AUDIO_PATH + "card.mp3"),
  link: new Audio(AUDIO_PATH + "link.mp3"),
  select: new Audio(AUDIO_PATH + "select.mp3")
};

// Pré-carregamento
Object.values(sounds).forEach(s => s.preload = "auto");

function play(key, vol = 0.3) {
  try {
    const s = sounds[key].cloneNode();
    s.volume = vol;
    s.play().catch(() => { });
  } catch (e) { }
}

// =========================================================
// LISTAS DE CLASSES (SINCRONIZADAS)
// =========================================================

// 1. Som 'button' no HOVER
const HOVER_BUTTON = [".back-to-top", ".btn-primary", ".btn-outline", ".btn-hero-outline", ".znav-tab", ".mc-arrow", ".tab-btn", ".burger", ".faq-item", ".zmob-has-dropdown", ".btn-price", ".btn-hero-green", ".video-frame", ".acc-btn", ".w-arrow", ".mc-tab", ".h-arrow", ".btn-elite-plus", ".tip-close-btn", ".special-link", ".btn-abrir", ".checkout-btn", ".feat-tab", ".nav-tab-btn", ".thumb-item", ".btn-toggle-text", ".btn-next-img", ".bundle-btn", ".d-thumb", ".znav-tab", ".znav-btn-outline", ".znav-icon-wrapper", ".znav-links", ".small-links"];

// 2. Som 'button_click' no CLIQUE (Acordeões e Botões)
const CLICK_ACTION = [".btn-outline", ".btn-sidebar", ".znav-tab", ".znav-item", ".faq-item", ".zmob-has-dropdown", ".btn-primary", ".btn-green", ".tab-btn", ".btn-price", ".btn-hero-green", ".play-btn", ".mc-arrow", ".acc-btn", ".w-arrow", ".mc-tab", ".h-arrow", ".btn-elite-plus", ".tip-close-btn", ".btn-abrir", ".checkout-btn", ".feat-tab", ".thumb-item", ".d-thumb", ".mc-acc-item", ".znav-icon-wrapper"];

// 3. Som 'card' no HOVER
const HOVER_CARD = [".mc-collectible-card", ".gallery-item2", ".game-card2", ".mode-card", ".mc-news-card", ".f-card", ".w-item", ".game-card-simple", ".content-item", ".link-item", ".game-card", ".collectible-unit", ".quest-card"];

// 4. Som 'select' no HOVER (Links de texto)
const HOVER_SELECT = [".znav-item-img", ".znav-banner", ".footer-col", ".mc-link-all", ".promo-box", ".link-btn-card", ".dl-card", ".testi-card", ".news-card", ".t-row-elite", ".sidebar-link", ".feature-tag", ".btn-demo ", ".dropdown-link", ".table-item", ".discord-link", ".znav-mixed-top", ".znav-btn-outline", ".small-links", ".vault-action-link", ".faq-card"];

// =========================================================
// SISTEMA DE ESCUTA GLOBAL
// =========================================================
// Lógica Global de Links Externos (Som link)
document.addEventListener("click", (e) => {
  const a = e.target.closest("a");
  if (a && a.href && !a.href.startsWith("#") && !a.href.includes("javascript:")) {
    e.preventDefault();
    play("link", 0.6);
    setTimeout(() => window.location.href = a.href, 400);
  }
});

// HOVER: Monitora a entrada do mouse com trava de repetição
document.addEventListener("mouseover", (e) => {
  const target = e.target;
  if (!target) return;

  // Função auxiliar para verificar e aplicar a trava
  const handleHover = (selectors, soundKey, volume) => {
    const el = target.closest(selectors.join(','));
    if (el && !el.dataset.soundActive) {
      play(soundKey, volume);
      el.dataset.soundActive = "true";

      // Remove a trava quando o mouse sair do elemento pai
      el.addEventListener("mouseleave", () => {
        delete el.dataset.soundActive;
      }, { once: true });
      return true;
    }
    return false;
  };

  // 1. Verifica Cards (Prioridade)
  if (handleHover(HOVER_CARD, "card", 0.15)) return;

  // 2. Verifica Botões
  if (handleHover(HOVER_BUTTON, "button", 0.15)) return;

  // 3. Verifica Select/Links (Onde o problema do texto interno ocorre muito)
  if (handleHover(HOVER_SELECT, "select", 0.2)) return;
});

function markActive(el) {
  el.dataset.soundActive = "true";
  el.addEventListener("mouseleave", () => { delete el.dataset.soundActive; }, { once: true });
}

function markActive(el) {
  el.dataset.soundActive = "true";
  el.addEventListener("mouseleave", () => { delete el.dataset.soundActive; }, { once: true });
}

// CLIQUE: O segredo está no "true" no final para ignorar o stopPropagation
document.addEventListener("click", (e) => {
  const target = e.target;
  const isClickable = CLICK_ACTION.some(selector => target.closest(selector));

  if (isClickable) {
    play("buttonClick", 0.5);
  }
}, true); // <--- Este "true" faz o som tocar mesmo dentro do Mega Menu