/* ============================================================
   ZERA'S CRAFT - ENGINE DE AUTOLOAD & NAVEGAÇÃO (PC + MOBILE)
   Compatível com Raiz e Sub-pastas (GitHub Pages / Local)
============================================================ */

// 1. Detecção Dinâmica da Raiz do Projeto
const getProjectRoot = () => {
  const script = document.currentScript || Array.from(document.querySelectorAll('script')).find(s => s.src && s.src.includes('load-html.js'));
  if (script && script.src) {
    return new URL('../', script.src).href;
  }
  return window.location.origin + '/';
};

const ROOT_PATH = getProjectRoot();

// 2. Trava e Destrava de Scroll (Escopo Global)
window.lockScroll = window.lockScroll || function() {
  document.documentElement.classList.add("z-lock-scroll");
  document.body.classList.add("z-lock-scroll");
};

window.unlockScroll = window.unlockScroll || function() {
  document.documentElement.classList.remove("z-lock-scroll");
  document.body.classList.remove("z-lock-scroll");
};

// 3. Injeção Dinâmica de CSS
function injectCSS(cssRelativePath) {
  if (!cssRelativePath) return;
  const fullCssUrl = new URL(cssRelativePath, ROOT_PATH).href;
  if (!document.querySelector(`link[href="${fullCssUrl}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = fullCssUrl;
    document.head.appendChild(link);
  }
}

// 4. Carregador Universal de Componentes HTML
function loadComponent({ placeholderId, htmlPath, cssPath, onLoaded }) {
  const placeholder = document.getElementById(placeholderId);
  if (!placeholder) return;

  if (cssPath) injectCSS(cssPath);

  const fullHtmlUrl = new URL(htmlPath, ROOT_PATH).href;

  fetch(fullHtmlUrl)
    .then((res) => {
      if (!res.ok) throw new Error(`Falha ao carregar ${fullHtmlUrl}`);
      return res.text();
    })
    .then((html) => {
      placeholder.innerHTML = html;

      // Re-executa scripts que vierem dentro do HTML injetado
      const scripts = placeholder.querySelectorAll("script");
      scripts.forEach((oldScript) => {
        const newScript = document.createElement("script");
        Array.from(oldScript.attributes).forEach((attr) =>
          newScript.setAttribute(attr.name, attr.value)
        );
        if (!oldScript.src) {
          newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        }
        oldScript.parentNode.replaceChild(newScript, oldScript);
      });

      if (typeof onLoaded === "function") {
        onLoaded();
      }
    })
    .catch((err) => console.error(`[Autoload Error - ${placeholderId}]:`, err));
}

/* ============================================================
   5. FUNÇÕES DO MENU DESKTOP (PC) - EXPOSTAS NO WINDOW
============================================================ */

window.toggleMegaMenu = function(evt) {
  if (!evt) return;
  if (evt.target.closest(".znav-mega-panel") || evt.target.closest(".znav-simple-drop")) return;

  const clickedBtn = evt.currentTarget;
  const isOpen = clickedBtn.classList.contains("open");

  document.querySelectorAll(".znav-mega-btn").forEach((btn) => btn.classList.remove("open"));
  window.unlockScroll();

  if (!isOpen) {
    clickedBtn.classList.add("open");
    window.lockScroll();

    const panel = clickedBtn.querySelector(".znav-mega-grid");
    if (panel) {
      const tabs = panel.querySelectorAll(".znav-tab");
      const contents = panel.querySelectorAll(".znav-tab-content");
      if (tabs.length > 0 && contents.length > 0) {
        tabs.forEach((t) => t.classList.remove("active"));
        contents.forEach((c) => c.classList.remove("active"));
        tabs[0].classList.add("active");
        contents[0].classList.add("active");
      }
    }
  }
};

window.switchZnavTab = function(evt, targetId) {
  if (!evt) return;
  evt.preventDefault();
  evt.stopPropagation();
  const parentGrid = evt.currentTarget.closest(".znav-mega-grid");
  if (!parentGrid) return;

  parentGrid.querySelectorAll(".znav-tab").forEach((tab) => tab.classList.remove("active"));
  parentGrid.querySelectorAll(".znav-tab-content").forEach((content) => content.classList.remove("active"));

  evt.currentTarget.classList.add("active");
  const target = parentGrid.querySelector(`#${targetId}`);
  if (target) target.classList.add("active");
};

/* ============================================================
   6. PESQUISA E MODAL
============================================================ */

window.zcIndex = [
  { name: "CraftJam", link: "craftjam.html" },
  { name: "Eventos", link: "eventos.html" },
  { name: "Loja VIP", link: "loja.html" },
];

window.openSearch = function() {
  const searchModal = document.getElementById("zSearchModal");
  if (!searchModal) return;

  if (typeof window.closeMobileMenu === "function") window.closeMobileMenu();

  searchModal.classList.add("active");
  window.lockScroll();

  const input = document.getElementById("zSearchInput");
  if (input) {
    input.value = "";
    input.focus();
  }
  window.runSearch();
};

window.closeSearch = function() {
  const searchModal = document.getElementById("zSearchModal");
  if (searchModal) {
    searchModal.classList.remove("active");
    window.unlockScroll();
  }
};

window.runSearch = function() {
  const input = document.getElementById("zSearchInput");
  const resultList = document.getElementById("zSearchResults");
  if (!input || !resultList) return;

  const query = input.value.toLowerCase();
  resultList.innerHTML = "";

  const filtered = query === "" ? window.zcIndex.slice(0, 3) : window.zcIndex.filter((p) => p.name.toLowerCase().includes(query));

  if (filtered.length === 0) {
    resultList.innerHTML = '<li><a href="#" style="color:#555; pointer-events:none;">Sem resultados.</a></li>';
    return;
  }

  filtered.forEach((p) => {
    resultList.innerHTML += `<li><a href="${p.link}"><i class="fas fa-search"></i> ${p.name}</a></li>`;
  });
};

/* ============================================================
   7. FUNÇÕES DO MENU MOBILE
============================================================ */

window.openMobileMenu = function(evt) {
  if (evt) evt.preventDefault();
  const sidebar = document.getElementById("zmobSidebar");
  const overlay = document.getElementById("zmobOverlay");
  if (sidebar) sidebar.classList.add("active");
  if (overlay) overlay.classList.add("active");
  window.lockScroll();
};

window.closeMobileMenu = function() {
  const sidebar = document.getElementById("zmobSidebar");
  const overlay = document.getElementById("zmobOverlay");
  if (sidebar) sidebar.classList.remove("active");
  if (overlay) overlay.classList.remove("active");
  window.unlockScroll();
  setTimeout(window.slideBack, 300);
};

window.slideMobile = function(panelId) {
  const mainPanel = document.getElementById("zpanel-main");
  const targetPanel = document.getElementById(panelId);
  if (mainPanel) mainPanel.classList.add("slide-left");
  if (targetPanel) targetPanel.classList.add("active");
};

window.slideBack = function() {
  const mainPanel = document.getElementById("zpanel-main");
  if (mainPanel) mainPanel.classList.remove("slide-left");
  document.querySelectorAll(".zpanel-sub").forEach((p) => p.classList.remove("active"));
};

window.toggleDropdown = function(element) {
  const parentLi = element.closest(".zmob-has-dropdown");
  if (!parentLi) return;
  const content = parentLi.querySelector(".zmob-dropdown-content");
  if (!content) return;
  const isActive = parentLi.classList.toggle("active");
  content.style.maxHeight = isActive ? `${content.scrollHeight}px` : "0px";
};

/* ============================================================
   8. EVENTOS GLOBAIS (FECHAR AO CLICAR FORA / TECLA ESC)
============================================================ */

document.addEventListener("click", (e) => {
  if (!e.target.closest(".znav-mega-btn")) {
    const openedMenus = document.querySelectorAll(".znav-mega-btn.open");
    if (openedMenus.length > 0) {
      openedMenus.forEach((menu) => menu.classList.remove("open"));
      window.unlockScroll();
    }
  }
  if (e.target.id === "zmobOverlay") {
    window.closeMobileMenu();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" || e.keyCode === 27) {
    const openedMenus = document.querySelectorAll(".znav-mega-btn.open");
    if (openedMenus.length > 0) {
      openedMenus.forEach((menu) => menu.classList.remove("open"));
      window.unlockScroll();
    }

    const searchModal = document.getElementById("zSearchModal");
    if (searchModal && searchModal.classList.contains("active")) {
      window.closeSearch();
    }

    const mobileSidebar = document.getElementById("zmobSidebar");
    if (mobileSidebar && mobileSidebar.classList.contains("active")) {
      window.closeMobileMenu();
    }
  }
});

/* ============================================================
   9. EXECUÇÃO DO CARREGAMENTO AUTOMÁTICO
============================================================ */

const initAutoload = () => {
  // Menu PC
  loadComponent({
    placeholderId: "nav-placeholder-pc",
    htmlPath: "HTML/html-nav-pc.html",
    cssPath: "CSS/nav-header.css"
  });

  // Menu Mobile
  loadComponent({
    placeholderId: "nav-placeholder-mobile",
    htmlPath: "HTML/html-nav-mobile.html",
    cssPath: "CSS/nav-header.css"
  });

  // Footer
  loadComponent({
    placeholderId: "footer-placeholder",
    htmlPath: "HTML/html-footer.html",
    cssPath: "CSS/style.css"
  });

  // Player Jukebox
  loadComponent({
    placeholderId: "player-container",
    htmlPath: "HTML/html-player.html",
    cssPath: "CSS/jukebox.css",
    onLoaded: () => {
      if (typeof window.initJukeboxPlayer === "function") {
        window.initJukeboxPlayer();
      }
    }
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAutoload);
} else {
  initAutoload();
}