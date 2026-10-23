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
// Retorna uma Promise que resolve quando o componente termina de ser injetado
// (inclui re-execução de scripts internos). Isso permite que o resto do site
// saiba com certeza o momento em que TODO o HTML dinâmico já está no DOM —
// o que é essencial, por exemplo, para widgets de tradução (ver seção 10).
function loadComponent({ placeholderId, htmlPath, cssPath, onLoaded }) {
  const placeholder = document.getElementById(placeholderId);
  if (!placeholder) return Promise.resolve();

  if (cssPath) injectCSS(cssPath);

  const fullHtmlUrl = new URL(htmlPath, ROOT_PATH).href;

  return fetch(fullHtmlUrl)
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

      // Avisa o resto da página que ESTE componente específico já foi injetado
      document.dispatchEvent(
        new CustomEvent("zc:componentLoaded", { detail: { placeholderId } })
      );
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
  // Dropdown do menu mobile (injetado por este arquivo)
  const parentLi = element.closest(".zmob-has-dropdown");
  if (parentLi) {
    const content = parentLi.querySelector(".zmob-dropdown-content");
    if (!content) return;
    const isActive = parentLi.classList.toggle("active");
    content.style.maxHeight = isActive ? `${content.scrollHeight}px` : "0px";
    return;
  }

  // Dropdown genérico usado em outras partes do site (fora do menu mobile).
  // Unificado aqui para que "toggleDropdown" tenha uma única definição global
  // e não seja sobrescrita por outro script (ex: script.js).
  if (window.innerWidth <= 768) {
    element.classList.toggle("active");
  }
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
  const pending = [];

  // Menu PC
  pending.push(loadComponent({
    placeholderId: "nav-placeholder-pc",
    htmlPath: "HTML/html-nav-pc.html",
    cssPath: "CSS/nav-header.css"
  }));

  // Menu Mobile
  pending.push(loadComponent({
    placeholderId: "nav-placeholder-mobile",
    htmlPath: "HTML/html-nav-mobile.html",
    cssPath: "CSS/nav-header.css"
  }));

  // Footer
  pending.push(loadComponent({
    placeholderId: "footer-placeholder",
    htmlPath: "HTML/html-footer.html",
    cssPath: "CSS/style.css"
  }));

  // Player Jukebox
  pending.push(loadComponent({
    placeholderId: "player-container",
    htmlPath: "HTML/html-player.html",
    cssPath: "CSS/jukebox.css",
    onLoaded: () => {
      if (typeof window.initJukeboxPlayer === "function") {
        window.initJukeboxPlayer();
      }
    }
  }));

  // Quando TODOS os componentes dinâmicos (nav, footer, player) já
  // estiverem no DOM, marca a página como "pronta" e avisa quem estiver
  // esperando (ex: o inicializador do widget de tradução — ver seção 10).
  Promise.all(pending).then(() => {
    window.zcAllLoaded = true;
    document.dispatchEvent(new CustomEvent("zc:allLoaded"));
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAutoload);
} else {
  initAutoload();
}

/* ============================================================
   10. TRADUÇÃO DO CONTEÚDO INJETADO (Nav/Footer/Player)
   ------------------------------------------------------------
   Problema: widgets de tradução de página (ex: Google Website
   Translator, Weglot, GTranslate) normalmente fazem a varredura
   do texto assim que a página carrega. Como o menu, o rodapé e o
   player são injetados DEPOIS via fetch()+innerHTML, esse HTML
   ainda não existe no DOM no momento da varredura — por isso ele
   fica sem tradução.

   Solução: não inicialize o widget de tradução no <head>/estático.
   Em vez disso, chame `window.zcReady(callback)` a partir do seu
   próprio script de tradução. O callback só roda depois que TODO
   o HTML dinâmico (nav, footer, player) já estiver no DOM, então
   a varredura do widget já encontra tudo.

   Exemplo (Google Website Translator):

     <div id="google_translate_element"></div>
     <script>
       window.zcReady(function () {
         function googleTranslateElementInit() {
           new google.translate.TranslateElement(
             { pageLanguage: "pt" },
             "google_translate_element"
           );
         }
         const s = document.createElement("script");
         s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
         window.googleTranslateElementInit = googleTranslateElementInit;
         document.body.appendChild(s);
       });
     </script>

   Para Weglot/GTranslate: troque a chamada de inicialização do
   plugin (geralmente algo como `Weglot.initialize(...)`) para
   dentro de `window.zcReady(function () { ... })` da mesma forma.
============================================================ */

window.zcReady = function(callback) {
  if (typeof callback !== "function") return;
  if (window.zcAllLoaded) {
    callback();
  } else {
    document.addEventListener("zc:allLoaded", callback, { once: true });
  }
};