/* ==========================================
   CARREGADOR - MENU DESKTOP & BUSCA
========================================== */
if (typeof window.lockScroll !== "function") {
  window.lockScroll = () => {
    document.documentElement.classList.add("z-lock-scroll");
    document.body.classList.add("z-lock-scroll");
  };
}

if (typeof window.unlockScroll !== "function") {
  window.unlockScroll = () => {
    document.documentElement.classList.remove("z-lock-scroll");
    document.body.classList.remove("z-lock-scroll");
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const placeholder = document.getElementById("nav-placeholder-pc");
  if (!placeholder) return;

  fetch("html-nav-pc.html")
    .then((res) => (res.ok ? res : fetch("../html-nav-pc.html")))
    .then((res) => {
      if (!res.ok) throw new Error("Falha ao carregar html-nav-pc.html");
      return res.text();
    })
    .then((html) => {
      placeholder.innerHTML = html;
      const scripts = placeholder.querySelectorAll("script");
      scripts.forEach((oldScript) => {
        const newScript = document.createElement("script");
        Array.from(oldScript.attributes).forEach((attr) =>
          newScript.setAttribute(attr.name, attr.value)
        );
        if (!oldScript.src) newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        oldScript.parentNode.replaceChild(newScript, oldScript);
      });
    })
    .catch((err) => console.error("Erro no Menu PC:", err));
});

function toggleMegaMenu(evt) {
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
}

function switchZnavTab(evt, targetId) {
  evt.preventDefault();
  evt.stopPropagation();
  const parentGrid = evt.currentTarget.closest(".znav-mega-grid");
  if (!parentGrid) return;

  parentGrid.querySelectorAll(".znav-tab").forEach((tab) => tab.classList.remove("active"));
  parentGrid.querySelectorAll(".znav-tab-content").forEach((content) => content.classList.remove("active"));

  evt.currentTarget.classList.add("active");
  const target = parentGrid.querySelector(`#${targetId}`);
  if (target) target.classList.add("active");
}

const zcIndex = [
  { name: "CraftJam", link: "craftjam.html" },
  { name: "Eventos", link: "eventos.html" },
  { name: "Loja VIP", link: "loja.html" },
];

function openSearch() {
  const searchModal = document.getElementById("zSearchModal");
  if (!searchModal) return;

  if (typeof closeMobileMenu === "function") closeMobileMenu();

  searchModal.classList.add("active");
  window.lockScroll();

  const input = document.getElementById("zSearchInput");
  if (input) {
    input.value = "";
    input.focus();
  }
  runSearch();
}

function closeSearch() {
  const searchModal = document.getElementById("zSearchModal");
  if (searchModal) {
    searchModal.classList.remove("active");
    window.unlockScroll();
  }
}

function runSearch() {
  const input = document.getElementById("zSearchInput");
  const resultList = document.getElementById("zSearchResults");
  if (!input || !resultList) return;

  const query = input.value.toLowerCase();
  resultList.innerHTML = "";

  const filtered = query === "" ? zcIndex.slice(0, 3) : zcIndex.filter((p) => p.name.toLowerCase().includes(query));

  if (filtered.length === 0) {
    resultList.innerHTML = '<li><a href="#" style="color:#555; pointer-events:none;">Sem resultados.</a></li>';
    return;
  }

  filtered.forEach((p) => {
    resultList.innerHTML += `<li><a href="${p.link}"><i class="fas fa-search"></i> ${p.name}</a></li>`;
  });
}

document.addEventListener("click", (e) => {
  if (!e.target.closest(".znav-mega-btn")) {
    const openedMenus = document.querySelectorAll(".znav-mega-btn.open");
    if (openedMenus.length > 0) {
      openedMenus.forEach((menu) => menu.classList.remove("open"));
      window.unlockScroll();
    }
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
      closeSearch();
    }
  }
});

/* ==========================================
   CARREGADOR - MENU MOBILE
========================================== */
if (typeof window.lockScroll !== "function") {
  window.lockScroll = () => {
    document.documentElement.classList.add("z-lock-scroll");
    document.body.classList.add("z-lock-scroll");
  };
}

if (typeof window.unlockScroll !== "function") {
  window.unlockScroll = () => {
    document.documentElement.classList.remove("z-lock-scroll");
    document.body.classList.remove("z-lock-scroll");
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const placeholder = document.getElementById("nav-placeholder-mobile");
  if (!placeholder) return;

  fetch("html-nav-mobile.html")
    .then((res) => (res.ok ? res : fetch("../html-nav-mobile.html")))
    .then((res) => {
      if (!res.ok) throw new Error("Falha ao carregar html-nav-mobile.html");
      return res.text();
    })
    .then((html) => {
      placeholder.innerHTML = html;
      const scripts = placeholder.querySelectorAll("script");
      scripts.forEach((oldScript) => {
        const newScript = document.createElement("script");
        Array.from(oldScript.attributes).forEach((attr) =>
          newScript.setAttribute(attr.name, attr.value)
        );
        if (!oldScript.src) newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        oldScript.parentNode.replaceChild(newScript, oldScript);
      });
    })
    .catch((err) => console.error("Erro no Menu Mobile:", err));
});

function openMobileMenu(evt) {
  if (evt) evt.preventDefault();
  const sidebar = document.getElementById("zmobSidebar");
  const overlay = document.getElementById("zmobOverlay");

  if (sidebar) sidebar.classList.add("active");
  if (overlay) overlay.classList.add("active");

  window.lockScroll();
}

function closeMobileMenu() {
  const sidebar = document.getElementById("zmobSidebar");
  const overlay = document.getElementById("zmobOverlay");

  if (sidebar) sidebar.classList.remove("active");
  if (overlay) overlay.classList.remove("active");

  window.unlockScroll();
  setTimeout(slideBack, 300);
}

function slideMobile(panelId) {
  const mainPanel = document.getElementById("zpanel-main");
  const targetPanel = document.getElementById(panelId);

  if (mainPanel) mainPanel.classList.add("slide-left");
  if (targetPanel) targetPanel.classList.add("active");
}

function slideBack() {
  const mainPanel = document.getElementById("zpanel-main");
  if (mainPanel) mainPanel.classList.remove("slide-left");

  document.querySelectorAll(".zpanel-sub").forEach((p) => p.classList.remove("active"));
}

function toggleDropdown(element) {
  const parentLi = element.closest(".zmob-has-dropdown");
  if (!parentLi) return;

  const content = parentLi.querySelector(".zmob-dropdown-content");
  if (!content) return;

  const isActive = parentLi.classList.toggle("active");
  content.style.maxHeight = isActive ? `${content.scrollHeight}px` : "0px";
}

document.addEventListener("click", (e) => {
  if (e.target.id === "zmobOverlay") {
    closeMobileMenu();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" || e.keyCode === 27) {
    const mobileSidebar = document.getElementById("zmobSidebar");
    if (mobileSidebar && mobileSidebar.classList.contains("active")) {
      closeMobileMenu();
    }
  }
});

/* ==========================================
   ZERA'S CRAFT - CARREGADOR ISOLADO DO FOOTER
========================================== */
(function () {
  "use strict";

  function loadFooterComponent() {
    const placeholder = document.getElementById("footer-placeholder");

    // Interrompe se o elemento não existir na página
    if (!placeholder) return;

    const filePrimary = "html-footer.html";
    const fileFallback = "../html-footer.html";

    fetch(filePrimary)
      .then((res) => (res.ok ? res : fetch(fileFallback)))
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao carregar o arquivo html-footer.html");
        return res.text();
      })
      .then((html) => {
        placeholder.innerHTML = html;

        // Executa scripts que estejam dentro do HTML do footer sem afetar o resto do DOM
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
      })
      .catch((err) => console.error("[Footer Loader]:", err));
  }

  // Garante a execução independentemente de onde o script é chamado na página
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadFooterComponent);
  } else {
    loadFooterComponent();
  }
})();


/* ==========================================
   ZERA'S CRAFT - CARREGADOR ISOLADO DO PLAYER
========================================== */
(function () {
  "use strict";

  function loadPlayerComponent() {
    const placeholder = document.getElementById("player-container");
    if (!placeholder) return;

    const filePrimary = "html-player.html";
    const fileFallback = "../html-player.html";

    fetch(filePrimary)
      .then((res) => (res.ok ? res : fetch(fileFallback)))
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao carregar o arquivo html-player.html");
        return res.text();
      })
      .then((html) => {
        placeholder.innerHTML = html;

        // Executa scripts internos se houver
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

        // Inicializa a lógica da Jukebox logo após a injeção do HTML
        if (typeof window.initJukeboxPlayer === "function") {
          window.initJukeboxPlayer();
        }
      })
      .catch((err) => console.error("[Player Loader]:", err));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadPlayerComponent);
  } else {
    loadPlayerComponent();
  }
})();