/**
 * ZERA'S CRAFT - MOTOR DE ÁUDIO GLOBAL CONFIGURÁVEL
 * Versão Prática e Ajustável por Efeito
 */

// Descobre automaticamente o diretório de onde o script foi chamado
const currentScript = document.currentScript;
let scriptDir = "";

if (currentScript) {
  const src = currentScript.getAttribute("src");
  const lastSlash = src.lastIndexOf("/");
  if (lastSlash !== -1) {
    scriptDir = src.substring(0, lastSlash + 1); // Extrai o caminho (ex: "../")
  }
}

// O caminho dos áudios adaptado automaticamente ao local da página
const AUDIO_PATH = scriptDir + "../assets/audios/effects/";

// =========================================================
// CONFIGURAÇÃO CENTRAL DE EFEITOS (FÁCIL DE AJUSTAR E EXPANDIR)
// Podes adicionar novos efeitos, mudar o som ou as classes aqui!
// =========================================================
const EFFECT_CONFIGS = {

  // Efeito 1: Hover padrão em botões e menus
  hoverButton: {
    file: "button.mp3",
    volume: 0.15,
    trigger: "mouseover", // Dispara ao passar o rato
    selectors: [
      ".back-to-top", ".znav-mega-btn", ".btn-primary", ".btn-outline",
      ".btn-hero-outline", ".znav-tab", ".mc-arrow", ".tab-btn", ".burger",
      ".faq-item", ".zmob-has-dropdown", ".btn-price", ".btn-hero-green",
      ".video-frame", ".acc-btn", ".w-arrow", ".mc-tab", ".h-arrow",
      ".btn-elite-plus", ".tip-close-btn", ".special-link", ".btn-abrir",
      ".checkout-btn", ".feat-tab", ".nav-tab-btn", ".thumb-item",
      ".btn-toggle-text", ".btn-next-img", ".bundle-btn", ".d-thumb",
      ".znav-tab", ".znav-btn-outline", ".znav-icon-wrapper", ".znav-links",
      ".small-links", ".zmob-close-btn", ".panel-links", ".zmob-burger",
      ".social-icons", ".z-hud-close", ".guide-tab-btn", ".zsearch-list",
      ".zmob-item-list",
    ]
  },

  // Efeito 2: Hover em Cards
  hoverCard: {
    file: "card.mp3",
    volume: 0.15,
    trigger: "mouseover",
    selectors: [
      ".mc-collectible-card", ".gallery-item2", ".game-card2", ".mode-card",
      ".mc-news-card", ".f-card", ".w-item", ".game-card-simple", ".button-zmob",
      ".content-item", ".link-item", ".game-card", ".collectible-unit", ".quest-card"
    ]
  },

  // Efeito 3: Hover de Seleção/Imagens
  hoverSelect: {
    file: "select.mp3",
    volume: 0.2,
    trigger: "mouseover",
    selectors: [
      ".znav-item-img", ".znav-banner", ".mc-link-all", ".promo-box",
      ".link-btn-card", ".dl-card", ".testi-card", ".news-card", ".close-search",
      ".t-row-elite", ".sidebar-link", ".feature-tag", ".btn-demo",
      ".dropdown-link", ".table-item", ".discord-link", ".znav-mixed-top",
      ".znav-btn-outline", ".small-links", ".vault-action-link", ".faq-card",
      ".pages-links", ".info-links", ".software-card", ".guide-link", ".zmob-list-links",
      ".zmob-button-section",
    ]
  },

  // Efeito 4: Ações de Clique (Equivalente ao antigo CLICK_ACTION)
  clickAction: {
    file: "button-click.mp3",
    volume: 0.5,
    trigger: "click", // Dispara ao clicar
    selectors: [
      ".btn-outline", ".btn-sidebar", ".znav-tab", ".znav-item",
      ".faq-item", ".zmob-has-dropdown", ".btn-primary", ".btn-green",
      ".tab-btn", ".btn-price", ".btn-hero-green", ".play-btn",
      ".mc-arrow", ".acc-btn", ".w-arrow", ".mc-tab", ".h-arrow",
      ".btn-elite-plus", ".tip-close-btn", ".btn-abrir", ".checkout-btn",
      ".feat-tab", ".thumb-item", ".d-thumb", ".mc-acc-item",
      ".znav-icon-wrapper", ".close-search", ".zsearch-list",
      ".panel-links", ".z-hud-close", ".guide-tab-btn", ".guide-link"
    ]
  },

  // Efeito: Abrir Baú
  clickBauAbrir: {
    file: "bau-abrir.mp3",
    volume: 0.15,
    trigger: "click",
    selectors: [
      ".zmob-button-section", ".zmob-burger", ".zmob-item-list",
    ]
  },

  // Efeito: Fechar Baú
  clickBauFechar: {
    file: "bau-fechar.mp3",
    volume: 0.15,
    trigger: "click",
    selectors: [
      ".zmob-back-btn", ".zmob-close-btn"
    ]
  },

  // Podes adicionar novos efeitos aqui livremente seguindo o mesmo padrão!
};

// =========================================================
// MOTOR AUTOMÁTICO DE GESTÃO DE ÁUDIO E EVENTOS
// =========================================================
const audioCache = {};

// Pré-carregamento automático de todos os sons definidos no objeto acima
Object.keys(EFFECT_CONFIGS).forEach(key => {
  const config = EFFECT_CONFIGS[key];
  const audio = new Audio(AUDIO_PATH + config.file);
  audio.preload = "auto";
  audioCache[key] = audio;
});

function playSound(key, vol = 0.3) {
  const template = audioCache[key];
  if (!template) return;
  try {
    const s = template.cloneNode();
    s.volume = vol;
    s.play().catch(() => { });
  } catch (e) { }
}

// Lógica Global de Links Externos
document.addEventListener("click", (e) => {
  const a = e.target.closest("a");
  if (a && a.href && !a.href.startsWith("#") && !a.href.includes("javascript:")) {
    e.preventDefault();
    const linkAudio = new Audio(AUDIO_PATH + "link.mp3");
    linkAudio.volume = 0.6;
    linkAudio.play().catch(() => { });
    setTimeout(() => window.location.href = a.href, 400);
  }
});

// Processador Global Dinâmico para eventos de Mouseover (Hover)
document.addEventListener("mouseover", (e) => {
  const target = e.target;
  if (!target) return;

  for (const [key, config] of Object.entries(EFFECT_CONFIGS)) {
    if (config.trigger !== "mouseover") continue;

    const el = target.closest(config.selectors.join(','));
    if (el && !el.dataset[key + "Active"]) {
      playSound(key, config.volume);
      el.dataset[key + "Active"] = "true";
      el.addEventListener("mouseleave", () => {
        delete el.dataset[key + "Active"];
      }, { once: true });
      break;
    }
  }
});

// Processador Global Dinâmico para eventos de Click
document.addEventListener("click", (e) => {
  const target = e.target;
  if (!target) return;

  for (const [key, config] of Object.entries(EFFECT_CONFIGS)) {
    if (config.trigger !== "click") continue;

    const isMatch = config.selectors.some(selector => target.closest(selector));
    if (isMatch) {
      playSound(key, config.volume);
      break;
    }
  }
}, true);