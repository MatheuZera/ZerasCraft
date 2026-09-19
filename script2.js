// CACHE PARA offline.html
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => {
        console.log('Service Worker registrado com sucesso:', reg.scope);
      })
      .catch((err) => {
        console.log('Falha ao registrar o Service Worker:', err);
      });
  });
}

// SISTEMA PARA manutencao.html
(function () {
  // Evita loop infinito caso o usuário já esteja na página de manutenção
  const currentPath = window.location.pathname;
  if (currentPath.includes('manutencao.html')) {
    return;
  }

  // Faz a checagem do status
  fetch('status.json?' + new Date().getTime()) // O parâmetro evita cache do navegador
    .then(response => response.json())
    .then(data => {
      if (data.manutencao === true) {
        // Redireciona imediatamente para a tela de manutenção
        window.location.href = 'manutencao.html';
      }
    })
    .catch(error => {
      console.error('Erro ao verificar o sistema de manutenção:', error);
    });
})();

/* ============================================================================================= */
/**
 * MÓDULO UNIFICADO DE DADOS, CONTADORES E METAS (TOTAIS, ONLINE e etc..)
 */
const ZerasEngine = {
  guildID: "1390120239588577482",
  inviteCode: "GYGVBqGEwP",

  async init() {
    // Sincroniza a data de criação estaticamente mapeada pelo ID do Discord
    this.syncCreationDate();

    // Busca os dados da API uma única vez para todos os módulos
    try {
      const response = await fetch(
        `https://discord.com/api/v9/invites/${this.inviteCode}?with_counts=true`
      );

      if (!response.ok) throw new Error("Erro ao buscar dados do Discord");
      const data = await response.json();

      const totalMembers = data.approximate_member_count || 5000;
      const onlineMembers = data.approximate_presence_count || 0;

      // 1. Atualiza elementos baseados em classe (Footer e afins)
      this.updateCountersByClass("stat-total", totalMembers);
      this.updateCountersByClass("stat-online", onlineMembers);
      this.updateCountersByClass("discord-count", onlineMembers, " Membros Online agora");

      // 2. Atualiza elementos específicos por ID (Status e Metas)
      this.initStatusDisplay(totalMembers);
      this.initGoalsDisplay(totalMembers);

    } catch (error) {
      console.warn("Zera's Craft: Usando valores padrão devido a restrição de rede/API.", error);

      // Fallbacks de segurança caso a API falhe ou bloqueie (ex: abrindo via file://)
      const fallbackTotal = 5000;
      const fallbackOnline = 150;

      this.updateCountersByClass("stat-total", fallbackTotal);
      this.updateCountersByClass("stat-online", fallbackOnline);
      this.updateCountersByClass("discord-count", fallbackOnline, " Membros Online agora");

      this.initStatusDisplay(fallbackTotal);
      this.initGoalsDisplay(fallbackTotal);
    }
  },

  // Sincroniza a data de criação do servidor (Snowflake ID)
  syncCreationDate() {
    const el = document.getElementById("stat-date");
    if (!el) return;

    const id = BigInt(this.guildID);
    const timestamp = Number((id >> 22n) + 1420070400000n);
    const date = new Date(timestamp);

    const target = {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    };

    const duration = 2000;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const day = Math.floor(progress * target.day);
      const month = Math.floor(progress * target.month);
      const year = Math.floor(2000 + progress * (target.year - 2000));

      el.innerText = `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.innerText = `${String(target.day).padStart(2, "0")}/${String(target.month).padStart(2, "0")}/${target.year}`;
      }
    };

    requestAnimationFrame(step);
  },

  // Função genérica de animação de valores numéricos
  animateValue(obj, start, end, duration, isPercent = false, suffix = "") {
    if (!obj) return;
    let startTimestamp = null;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      // Efeito suave (Ease Out)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeProgress * (end - start) + start);

      let prefix = isPercent && current > 100 ? "+" : "";

      obj.innerText = isPercent
        ? prefix + current + "%"
        : current.toLocaleString("pt-BR") + suffix;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        let finalPrefix = isPercent && end > 100 ? "+" : "";
        obj.innerText = isPercent
          ? finalPrefix + Math.floor(end) + "%"
          : Math.floor(end).toLocaleString("pt-BR") + suffix;
      }
    };
    window.requestAnimationFrame(step);
  },

  updateCountersByClass(className, target, suffix = "") {
    const elements = document.querySelectorAll(`.${className}`);
    if (elements.length === 0) return;

    elements.forEach((el) => {
      this.animateNumberClass(el, target, suffix);
    });
  },

  animateNumberClass(el, target, suffix) {
    const duration = 1500;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeProgress * target);

      el.innerText = `${current.toLocaleString("pt-BR")}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.innerText = `${target.toLocaleString("pt-BR")}${suffix}`;
      }
    };

    requestAnimationFrame(step);
  },

  initStatusDisplay(totalMembers) {
    const statusCountEl = document.getElementById("new-status-count");
    if (statusCountEl) {
      this.animateValue(statusCountEl, 0, totalMembers, 1500, false, " Membros Totais");
    }
  },

  initGoalsDisplay(totalMembers) {
    const membersCountEl = document.getElementById("new-members-count");
    const objectiveEl = document.getElementById("new-objective-val");
    const progressBar = document.getElementById("new-goal-fill");
    const progressText = document.getElementById("new-percent-text");

    if (membersCountEl) {
      this.animateValue(membersCountEl, 0, totalMembers, 1500);
    }

    if (objectiveEl && progressBar && progressText) {
      let rawText = objectiveEl.textContent || "1";
      let objectiveVal = parseFloat(rawText.replace(/\D/g, "")) || 1;

      let realPercentage = (totalMembers / objectiveVal) * 100;
      if (realPercentage < 0) realPercentage = 0;

      let visualPercentage = realPercentage > 100 ? 100 : realPercentage;

      setTimeout(() => {
        progressBar.style.width = visualPercentage + "%";
        this.animateValue(progressText, 0, realPercentage, 1500, true);
      }, 300);
    }
  }
};

// Inicialização segura quando o DOM estiver pronto
if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", () => ZerasEngine.init());
} else {
  ZerasEngine.init();
}














function switchMkTab(evt, tabId) {
  // Esconde todos os conteúdos de abas
  const tabContents = document.querySelectorAll(".mk-tab-content");
  tabContents.forEach(content => {
    content.classList.remove("active");
  });

  // Remove a classe 'active' de todos os botões
  const tabButtons = document.querySelectorAll(".mk-tab-btn");
  tabButtons.forEach(btn => {
    btn.classList.remove("active");
    btn.setAttribute("aria-selected", "false");
  });

  // Mostra o painel alvo e ativa o botão correspondente
  const targetTab = document.getElementById(tabId);
  if (targetTab) {
    targetTab.classList.add("active");
  }

  evt.currentTarget.classList.add("active");
  evt.currentTarget.setAttribute("aria-selected", "true");
}

// GARANTIA DE ESCOPO GLOBAL ABSOLUTO - COLOQUE FORA DE QUALQUER OUTRA FUNÇÃO
window.changeGuideStep = function (stepNum) {
  // Procura por todas as abas e cards utilizando as classes do seu novo elemento
  const tabs = document.querySelectorAll('.mc-guide-tab');
  const cards = document.querySelectorAll('.mc-guide-card');

  tabs.forEach(tab => {
    // Se o botão tiver o atributo correspondente ao passo clicado
    if (tab.getAttribute('onclick') && tab.getAttribute('onclick').includes(stepNum)) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  cards.forEach(card => {
    // Valida se o ID do card corresponde ao passo ativo
    if (card.id === 'card-step-' + stepNum) {
      card.classList.add('active');
      card.style.display = 'block';
    } else {
      card.classList.remove('active');
      card.style.display = 'none';
    }
  });
};

/* ============================================================================================= */
/* ==========================================
   ELEMENTO
========================================== */

window.copyGuideIp = function (element) {
  const ipText = "jogar.zerascraft.net";

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(ipText).then(() => {
      sucessoCopia(element);
    }).catch(err => {
      fallbackCopy(ipText, element);
    });
  } else {
    fallbackCopy(ipText, element);
  }
};

// Funções auxiliares para animação do botão de copiar
function sucessoCopia(element) {
  const icon = element.querySelector('i');
  if (icon) {
    const originalClass = icon.className;
    icon.className = "fas fa-check";
    icon.style.color = "#4ade80";

    setTimeout(() => {
      icon.className = originalClass;
      icon.style.color = "";
    }, 2000);
  }

  if (typeof showMessage === "function") {
    showMessage("fa-check");
  } else {
    //alert("IP Copiado! Te esperamos no servidor.");
  }
}

function fallbackCopy(text, element) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    sucessoCopia(element);
  } catch (err) {
    console.error('Erro crítico ao copiar IP: ', err);
  }
  document.body.removeChild(textArea);
}









// =========================================================
// INTERAÇÃO DO SISTEMA DE CONTROLE DE RANKINGS
// =========================================================

// Função para mudar a categoria ativa (Money, Clãs, Kills, Online)
window.switchRankCategory = function (categoryName, buttonElement) {
  // 1. Alterna a classe ativa nos botões
  const buttons = document.querySelectorAll('.rank-filter-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  buttonElement.classList.add('active');

  // 2. Controla quais valores dinâmicos serão exibidos em cada linha
  const allValues = document.querySelectorAll('.rank-dynamic-value');
  allValues.forEach(val => {
    if (val.getAttribute('data-type') === categoryName) {
      val.classList.remove('d-none');
    } else {
      val.classList.add('d-none');
    }
  });
};

// Função de Busca/Filtro em tempo real digitando o Nickname
window.filterRankTable = function () {
  const input = document.getElementById('rankPlayerSearch');
  const filterText = input.value.toLowerCase().trim();
  const rows = document.querySelectorAll('.rank-data-row');

  rows.forEach(row => {
    const playerNick = row.getAttribute('data-player');

    // Se o nick do jogador contiver o termo pesquisado, exibe a linha, caso contrário esconde
    if (playerNick && playerNick.includes(filterText)) {
      row.style.display = 'flex';
    } else {
      row.style.display = 'none';
    }
  });
};








/* ============================================================================================= */
/* ==========================================
   ELEMENTO
========================================== */

/**
 * ECOSSISTEMA ZERA'S CRAFT - MOTOR DE SINCRONIZAÇÃO DO CRONOGRAMA
 */
document.addEventListener("DOMContentLoaded", () => {
  const gameplayButtons = document.querySelectorAll(".mc-gameplay-btn");
  const gameplayCards = document.querySelectorAll(".gameplay-info-card");
  const currentIndicator = document.getElementById("gp-current");
  const totalSteps = gameplayButtons.length;
  let activeStepIndex = 1;

  // Função central que realiza as alterações de estado das abas e cards
  window.changeGameplayStep = function (stepNum) {
    activeStepIndex = parseInt(stepNum);

    // 1. Atualiza as classes dos botões soltos do menu
    gameplayButtons.forEach(btn => {
      const btnTarget = parseInt(btn.getAttribute("data-step"));
      if (btnTarget === activeStepIndex) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // 2. Controla a exibição direta dos blocos informativos (Cards)
    gameplayCards.forEach(card => {
      if (card.id === `gameplay-card-${activeStepIndex}`) {
        card.classList.add("active");
        card.style.display = "block";
      } else {
        card.classList.remove("active");
        card.style.display = "none";
      }
    });

    // 3. Modifica os numerais do contador nativo
    if (currentIndicator) {
      currentIndicator.textContent = activeStepIndex;
    }
  };

  // Configuração dos eventos de clique nas setas direcionais auxiliares
  const btnNext = document.getElementById("gameplay-next");
  const btnPrev = document.getElementById("gameplay-prev");

  if (btnNext) {
    btnNext.addEventListener("click", () => {
      let nextStep = activeStepIndex + 1;
      if (nextStep > totalSteps) nextStep = 1; // Cria um comportamento circular de loop
      window.changeGameplayStep(nextStep);
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener("click", () => {
      let prevStep = activeStepIndex - 1;
      if (prevStep < 1) prevStep = totalSteps; // Retorna ao último elemento da lista
      window.changeGameplayStep(prevStep);
    });
  }
});


function switchChangelog(type) {
  // Alterna abas
  document.querySelectorAll('.cl-tab').forEach(btn => btn.classList.remove('active'));
  event.currentTarget.classList.add('active');

  // Alterna listas de conteúdo
  document.querySelectorAll('.changelog-list').forEach(list => list.classList.remove('active'));
  document.getElementById('cl-' + type).classList.add('active');
}


// Exibe o modal automaticamente 0.8 Segundos após a página carregar
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const modal = document.getElementById('importantModal');
    if (modal) {
      modal.classList.add('active');
      lockScroll();
    }
  }, 800);
});

// Fecha o modal suavemente
function closeMcModal() {
  const modal = document.getElementById('importantModal');
  if (modal) {
    modal.classList.remove('active');
    unlockScroll();
  }
}







/* ============================================================================================= */
/* ==========================================
   ELEMENTO
========================================== */

/**
 * GERENCIADOR DE METAS DA COMUNIDADE - ZERA'S CRAFT
 * Controla e renderiza dinamicamente as barras de progresso do servidor.
 */
function updateCommunityGoals() {
  // Seleciona todos os cards de meta presentes na página
  const goalCards = document.querySelectorAll('.mc-goal-card');

  goalCards.forEach(card => {
    // Pega os valores atuais e metas direto do HTML
    const current = parseFloat(card.getAttribute('data-current')) || 0;
    const target = parseFloat(card.getAttribute('data-target')) || 100;

    // Calcula a porcentagem real
    let percentage = Math.round((current / target) * 100);

    // Segurança: Não deixa passar de 100% e nem ser menor que 0%
    if (percentage > 100) percentage = 100;
    if (percentage < 0) percentage = 0;

    // Captura os elementos internos deste card específico
    const barFill = card.querySelector('.goal-bar-fill');
    const textPct = card.querySelector('.goal-percentage');

    // Aplica os valores com um leve delay para gerar efeito de carregamento
    if (barFill && textPct) {
      setTimeout(() => {
        barFill.style.width = `${percentage}%`;
        textPct.textContent = `${percentage}%`;
      }, 150);
    }
  });
}

// Executa a função assim que toda a estrutura do site estiver pronta
window.addEventListener('DOMContentLoaded', updateCommunityGoals);



// Garante o funcionamento limpo do slider infinito sem dessincronizar
document.addEventListener("visibilitychange", () => {
  const tracks = document.querySelectorAll(".reviews-track");
  if (document.visibilityState === "visible") {
    tracks.forEach(track => track.style.animationPlayState = "running");
  } else {
    tracks.forEach(track => track.style.animationPlayState = "paused");
  }
});


document.addEventListener('DOMContentLoaded', () => {
  const paymentOptions = document.querySelectorAll('.payment-option');

  paymentOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Remove o estado ativo de todas as opções
      paymentOptions.forEach(opt => opt.classList.remove('active'));

      // Ativa apenas a que recebeu o clique
      option.classList.add('active');

      // Sincroniza o radio button escondido interno
      const radio = option.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });
});




/* ============================================================================================= */
/* ==========================================
   ELEMENTO
========================================== */

/**
 * GERENCIADOR DE LIGAS E RANKING - RUSTICAL PVP
 * Script estrutural para ordenação e efeitos visuais
 */
document.addEventListener('DOMContentLoaded', () => {
  const tableRows = document.querySelectorAll('.leaderboard-table .table-row');

  tableRows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      // Efeito sutil ao passar o mouse nas linhas secundárias
      const link = row.querySelector('.row-link');
      if (link) link.style.color = '#ffffff';
    });

    row.addEventListener('mouseleave', () => {
      const link = row.querySelector('.row-link');
      if (link) link.style.color = '#3f3f46';
    });
  });
});



document.addEventListener('DOMContentLoaded', () => {
  // Código para colapsar recursos em telas menores, se desejado
  const adjustMobileAccordions = () => {
    if (window.innerWidth <= 650) {
      // Lógica para transformar as listas em blocos clicáveis expansíveis
      console.log("Modo mobile ativado: Accordions prontos para colapso.");
    }
  };

  window.addEventListener('resize', adjustMobileAccordions);
  adjustMobileAccordions();
});



document.addEventListener('DOMContentLoaded', () => {
  const faqTriggers = document.querySelectorAll('.rt-faq-trigger');

  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', function () {
      const item = this.parentElement;
      const panel = this.nextElementSibling;

      // Fecha outros itens abertos se desejar comportamento único
      const activeItem = document.querySelector('.rt-faq-item.rt-faq-active');
      if (activeItem && activeItem !== item) {
        activeItem.classList.remove('rt-faq-active');
        activeItem.querySelector('.rt-faq-panel').style.maxHeight = null;
      }

      // Alterna o estado atual
      item.classList.toggle('rt-faq-active');

      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });
});



/* ============================================================================================= */
/* ==========================================
   ELEMENTO
========================================== */

// 1. Carrega a API de Iframe do YouTube de forma assíncrona global
if (!window.YT) {
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

let ytPlayer;
let targetVideoId = "";
const playerContainer = document.getElementById("mcYoutubePlayer");
const rawVideoUrl = playerContainer ? playerContainer.getAttribute("data-raw-url") : "";

function extractYoutubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

targetVideoId = extractYoutubeId(rawVideoUrl);

// 2. Inicializador da API do YouTube
function onYouTubeIframeAPIReady() {
  if (!targetVideoId || !playerContainer) return;

  ytPlayer = new YT.Player('mcYoutubePlayer', {
    height: '100%',
    width: '100%',
    videoId: targetVideoId,
    playerVars: {
      'autoplay': 0,
      'rel': 0,
      'modestbranding': 1,
      'enablejsapi': 1,
      'origin': window.location.origin
    },
    events: {
      'onStateChange': onPlayerStateChange
    }
  });
}

// 3. Ocultar/Exibir mini-card baseado no vídeo tocando
function onPlayerStateChange(event) {
  const miniCard = document.getElementById("mcVideoCallout");
  if (!miniCard) return;

  if (event.data === YT.PlayerState.PLAYING) {
    miniCard.classList.add("mc-hide-callout");
  } else {
    miniCard.classList.remove("mc-hide-callout");
  }
}

// 4. Lógica de clique dos botões superiores (Funcionando independente da posição no DOM)
document.addEventListener("DOMContentLoaded", function () {
  const btnCopy = document.getElementById("mcBtnCopyLink");
  const btnReset = document.getElementById("mcBtnResetVideo");

  if (btnCopy) {
    btnCopy.addEventListener("click", function () {
      navigator.clipboard.writeText(rawVideoUrl).then(() => {
        btnCopy.classList.add("mc-copied-active");
        setTimeout(() => {
          btnCopy.classList.remove("mc-copied-active");
        }, 2000);
      }).catch(err => console.error("Falha ao copiar link: ", err));
    });
  }

  if (btnReset) {
    btnReset.addEventListener("click", function () {
      if (ytPlayer && typeof ytPlayer.cueVideoById === 'function') {
        ytPlayer.cueVideoById(targetVideoId);
        const miniCard = document.getElementById("mcVideoCallout");
        if (miniCard) miniCard.classList.remove("mc-hide-callout");
      }
    });
  }
});


/* ============================================================================================= */
/* ==========================================
   ELEMENTO
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  const bgImages = document.querySelectorAll(".rt-hero-bg-img");
  const slides = document.querySelectorAll(".rt-hero-slide");
  const dots = document.querySelectorAll("#hero-dots-container .rt-dot");

  function goToSlide(index) {
    // 1. Remove a classe active de absolutamente todos os elementos
    bgImages.forEach(img => img.classList.remove("active"));
    slides.forEach(slide => slide.classList.remove("active"));
    dots.forEach(dot => dot.classList.remove("active"));

    // 2. Aplica simultaneamente o active com base no index correspondente
    if (bgImages[index] && slides[index] && dots[index]) {
      bgImages[index].classList.add("active");
      slides[index].classList.add("active");
      dots[index].classList.add("active");
    }
  }

  // Gerencia os cliques nos dots laterais de navegação
  dots.forEach(dot => {
    dot.addEventListener("click", (e) => {
      const targetIndex = parseInt(e.target.getAttribute("data-target"));
      goToSlide(targetIndex);
    });
  });

  // Inicializa carregando instantaneamente o primeiro slide configurado no HTML
  goToSlide(0);
});











































/* ============================================================================================= */
/* ==========================================
   ELEMENTO
========================================== */
document.addEventListener("DOMContentLoaded", () => {
  const statValues = document.querySelectorAll(".z-stat-value");

  statValues.forEach((el) => {
    const target = parseFloat(el.getAttribute("data-target"));
    let current = 0;
    const increment = target / 50;

    const updateCount = () => {
      current += increment;
      if (current < target) {
        el.textContent = current.toFixed(1) + "%";
        setTimeout(updateCount, 30);
      } else {
        el.textContent = target + "%";
      }
    };
    updateCount();
  });
});

/* ============================================================================================= */
/* ==========================================
   ELEMENTO
========================================== */
document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('mpTrack');
  const prevBtn = document.getElementById('mpPrevBtn');
  const nextBtn = document.getElementById('mpNextBtn');

  if (!track || !prevBtn || !nextBtn) return;

  let isAnimating = false;

  // Calcula a largura exata de 1 card + o espaçamento (gap)
  function getStep() {
    const card = track.querySelector('.mp-card');
    const gap = parseFloat(window.getComputedStyle(track).gap) || 16;
    return card.offsetWidth + gap;
  }

  // Avançar 1 card
  nextBtn.addEventListener('click', () => {
    if (isAnimating) return;
    isAnimating = true;

    const step = getStep();
    track.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
    track.style.transform = `translateX(-${step}px)`;

    track.addEventListener('transitionend', function handler() {
      track.removeEventListener('transitionend', handler);
      track.style.transition = 'none';
      track.appendChild(track.firstElementChild); // Joga o primeiro card para o final
      track.style.transform = 'translateX(0)';
      isAnimating = false;
    });
  });

  // Voltar 1 card
  prevBtn.addEventListener('click', () => {
    if (isAnimating) return;
    isAnimating = true;

    const step = getStep();
    track.style.transition = 'none';
    track.prepend(track.lastElementChild); // Puxa o último card para a primeira posição
    track.style.transform = `translateX(-${step}px)`;

    // Força o reflow do navegador para aplicar o deslocamento instantâneo
    track.offsetHeight;

    track.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
    track.style.transform = 'translateX(0)';

    track.addEventListener('transitionend', function handler() {
      track.removeEventListener('transitionend', handler);
      isAnimating = false;
    });
  });
});

/* ============================================================================================= */
/* ==========================================
   ELEMENTO
========================================== */
document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('mccTrack');
  const prevBtn = document.getElementById('mccPrev');
  const nextBtn = document.getElementById('mccNext');

  if (!track || !prevBtn || !nextBtn) return;

  let isAnimating = false;

  // Retorna o valor exato do passo (card + gap) convertido para inteiro perfeito
  const getStep = () => {
    const card = track.querySelector('.mcc-card');
    if (!card) return 0;
    const cardWidth = card.getBoundingClientRect().width;
    const gap = parseFloat(window.getComputedStyle(track).gap) || 16;
    return Math.round(cardWidth + gap);
  };

  // AVANÇAR (NEXT)
  nextBtn.addEventListener('click', () => {
    if (isAnimating) return;
    isAnimating = true;

    const step = getStep();
    track.classList.add('is-animating');

    track.style.transition = 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)';
    track.style.transform = `translate3d(-${step}px, 0, 0)`;

    const onNextEnd = (e) => {
      if (e && e.target !== track) return;
      track.removeEventListener('transitionend', onNextEnd);

      track.style.transition = 'none';
      track.appendChild(track.firstElementChild);
      track.style.transform = 'translate3d(0, 0, 0)';

      // Força o reflow instantâneo do navegador
      void track.offsetWidth;

      track.classList.remove('is-animating');
      isAnimating = false;
    };

    track.addEventListener('transitionend', onNextEnd);
  });

  // VOLTAR (PREV)
  prevBtn.addEventListener('click', () => {
    if (isAnimating) return;
    isAnimating = true;

    const step = getStep();
    track.classList.add('is-animating');

    // 1. Move o último elemento para o início antes da animação sem efeito visual
    track.style.transition = 'none';
    track.prepend(track.lastElementChild);
    track.style.transform = `translate3d(-${step}px, 0, 0)`;

    // 2. Sincroniza o DOM instantaneamente
    void track.offsetWidth;

    // 3. Executa o deslizamento suave de volta à origem
    requestAnimationFrame(() => {
      track.style.transition = 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)';
      track.style.transform = 'translate3d(0, 0, 0)';
    });

    const onPrevEnd = (e) => {
      if (e && e.target !== track) return;
      track.removeEventListener('transitionend', onPrevEnd);

      track.style.transition = 'none';
      track.classList.remove('is-animating');
      isAnimating = false;
    };

    track.addEventListener('transitionend', onPrevEnd);
  });
});

/* ============================================================================================= */
/* ==========================================
   ELEMENTO
========================================== */
document.addEventListener("DOMContentLoaded", function () {
  const thumbs = document.querySelectorAll(".hero-thumb");
  const heroBgImg = document.getElementById("heroBgImg");
  const heroSideImg = document.getElementById("heroSideImg");
  const heroTitle = document.getElementById("heroTitle");
  const heroSubtitle = document.getElementById("heroSubtitle");
  const heroDescription = document.getElementById("heroDescription");
  const heroCta = document.getElementById("heroCta");

  if (thumbs.length === 0) return;

  thumbs.forEach(thumb => {
    thumb.addEventListener("click", function () {
      // Remove a classe ativa de todas e adiciona na clicada
      thumbs.forEach(t => t.classList.remove("active"));
      this.classList.add("active");

      // Captura os dados diretamente dos atributos data-* do HTML
      const bg = this.getAttribute("data-bg");
      const side = this.getAttribute("data-side");
      const title = this.getAttribute("data-title");
      const subtitle = this.getAttribute("data-subtitle");
      const description = this.getAttribute("data-description");
      const ctaText = this.getAttribute("data-cta-text");
      const ctaLink = this.getAttribute("data-cta-link");

      // Efeito suave de transição trocando os elementos
      heroBgImg.style.opacity = "0";
      setTimeout(() => {
        heroBgImg.src = bg;
        if (heroSideImg) heroSideImg.src = side;
        heroTitle.textContent = title;
        heroSubtitle.textContent = subtitle;
        heroDescription.textContent = description;
        heroCta.innerHTML = `${ctaText} <i class="fas fa-chevron-right"></i>`;
        heroCta.href = ctaLink;

        heroBgImg.style.opacity = "1";
      }, 200);
    });
  });
});
/* ============================================================================================= */
/* ==========================================
   ELEMENTO
========================================== */
document.addEventListener("DOMContentLoaded", function () {
  const yearButtons = document.querySelectorAll(".year-btn");
  const timelineGrid = document.getElementById("timelineGrid");

  function renderCards(spanData) {
    const c1Title = spanData.getAttribute("data-c1-title");
    const c1Date = spanData.getAttribute("data-c1-date");
    const c1Desc = spanData.getAttribute("data-c1-desc");
    const c1Main = spanData.getAttribute("data-c1-main");
    const c1T1 = spanData.getAttribute("data-c1-t1");
    const c1T2 = spanData.getAttribute("data-c1-t2");
    const c1T3 = spanData.getAttribute("data-c1-t3");

    const c2Title = spanData.getAttribute("data-c2-title");
    const c2Date = spanData.getAttribute("data-c2-date");
    const c2Desc = spanData.getAttribute("data-c2-desc");
    const c2Main = spanData.getAttribute("data-c2-main");
    const c2T1 = spanData.getAttribute("data-c2-t1");
    const c2T2 = spanData.getAttribute("data-c2-t2");
    const c2T3 = spanData.getAttribute("data-c2-t3");

    timelineGrid.style.opacity = "0";

    setTimeout(() => {
      timelineGrid.innerHTML = `
              <!-- Card 1 -->
              <div class="timeline-card">
                <div class="timeline-preview-wrapper">
                  <div class="timeline-main-img">
                    <img src="${c1Main}" alt="${c1Title}" id="mainImg-1" />
                  </div>
                  <div class="timeline-thumbs-list">
                    <button class="thumb-item active" data-target="1" data-img="${c1T1}"><img src="${c1T1}" alt="Thumb 1"></button>
                    <button class="thumb-item" data-target="1" data-img="${c1T2}"><img src="${c1T2}" alt="Thumb 2"></button>
                    <button class="thumb-item" data-target="1" data-img="${c1T3}"><img src="${c1T3}" alt="Thumb 3"></button>
                  </div>
                </div>
                <div class="timeline-card-info">
                  <div class="card-info-top">
                    <div>
                      <h3>${c1Title}</h3>
                      <span class="card-date">${c1Date}</span>
                    </div>
                    <button class="toggle-more-btn" type="button">Mostrar mais ∨</button>
                  </div>
                  <p class="card-text">${c1Desc}</p>
                  <div class="card-highlights"><span>Destaques do conteúdo...</span></div>
                </div>
              </div>

              <!-- Card 2 -->
              <div class="timeline-card">
                <div class="timeline-preview-wrapper">
                  <div class="timeline-main-img">
                    <img src="${c2Main}" alt="${c2Title}" id="mainImg-2" />
                  </div>
                  <div class="timeline-thumbs-list">
                    <button class="thumb-item active" data-target="2" data-img="${c2T1}"><img src="${c2T1}" alt="Thumb 1"></button>
                    <button class="thumb-item" data-target="2" data-img="${c2T2}"><img src="${c2T2}" alt="Thumb 2"></button>
                    <button class="thumb-item" data-target="2" data-img="${c2T3}"><img src="${c2T3}" alt="Thumb 3"></button>
                  </div>
                </div>
                <div class="timeline-card-info">
                  <div class="card-info-top">
                    <div>
                      <h3>${c2Title}</h3>
                      <span class="card-date">${c2Date}</span>
                    </div>
                    <button class="toggle-more-btn" type="button">Mostrar mais ∨</button>
                  </div>
                  <p class="card-text">${c2Desc}</p>
                  <div class="card-highlights"><span>Destaques do conteúdo...</span></div>
                </div>
              </div>
            `;
      timelineGrid.style.opacity = "1";
      attachCardEvents();
    }, 200);
  }

  function attachCardEvents() {
    // Eventos das miniaturas laterais
    const thumbItems = timelineGrid.querySelectorAll(".thumb-item");
    thumbItems.forEach(thumb => {
      thumb.addEventListener("click", function () {
        const targetCardId = this.getAttribute("data-target");
        const newImgSrc = this.getAttribute("data-img");

        const parentList = this.closest(".timeline-thumbs-list");
        parentList.querySelectorAll(".thumb-item").forEach(t => t.classList.remove("active"));
        this.classList.add("active");

        const mainImg = document.getElementById(`mainImg-${targetCardId}`);
        if (mainImg) {
          mainImg.style.opacity = "0";
          setTimeout(() => {
            mainImg.src = newImgSrc;
            mainImg.style.opacity = "1";
          }, 150);
        }
      });
    });

    // Evento do botão Mostrar Mais / Mostrar Menos
    const toggleButtons = timelineGrid.querySelectorAll(".toggle-more-btn");
    toggleButtons.forEach(btn => {
      btn.addEventListener("click", function () {
        const cardInfo = this.closest(".timeline-card-info");
        const cardText = cardInfo.querySelector(".card-text");

        cardText.classList.toggle("expanded");

        if (cardText.classList.contains("expanded")) {
          this.textContent = "Mostrar menos ∧";
        } else {
          this.textContent = "Mostrar mais ∨";
        }
      });
    });
  }

  // Clique nas abas de anos
  yearButtons.forEach(btn => {
    btn.addEventListener("click", function () {
      yearButtons.forEach(b => b.classList.remove("active"));
      this.classList.add("active");

      const spanData = this.querySelector(".year-data");
      if (spanData) {
        renderCards(spanData);
      }
    });
  });

  // Inicialização padrão (2024)
  const activeBtn = document.querySelector(".year-btn.active");
  if (activeBtn) {
    const initialSpan = activeBtn.querySelector(".year-data");
    if (initialSpan) renderCards(initialSpan);
  }
});

/* ============================================================================================= */
/* ==========================================
   ELEMENTO
========================================== */
document.addEventListener("DOMContentLoaded", function () {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".realms-tab-content");

  tabButtons.forEach(button => {
    button.addEventListener("click", function () {
      const targetTab = this.getAttribute("data-tab");

      tabButtons.forEach(btn => btn.classList.remove("active"));
      tabContents.forEach(content => content.classList.remove("active"));

      this.classList.add("active");
      document.getElementById(`${targetTab}-content`).classList.add("active");
    });
  });

  const tooltips = document.querySelectorAll(".tooltip-trigger");
  const globalTooltip = document.getElementById("globalTooltip");

  tooltips.forEach(trigger => {
    trigger.addEventListener("mouseenter", function () {
      const text = this.getAttribute("data-tooltip");
      globalTooltip.textContent = text;
      globalTooltip.classList.add("show");

      const rect = this.getBoundingClientRect();
      const tooltipWidth = 280;

      let leftPos = rect.left + window.scrollX - (tooltipWidth / 2) + (rect.width / 2);
      let topPos = rect.top + window.scrollY - globalTooltip.offsetHeight - 10;

      if (leftPos < 10) leftPos = 10;

      globalTooltip.style.left = `${leftPos}px`;
      globalTooltip.style.top = `${topPos}px`;
    });

    trigger.addEventListener("mouseleave", function () {
      globalTooltip.classList.remove("show");
    });
  });
});

/* ============================================================================================= */
/* ==========================================
   ELEMENTO
========================================== */
document.addEventListener("DOMContentLoaded", function () {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    const questionBtn = item.querySelector(".faq-question");

    questionBtn.addEventListener("click", function () {
      const isActive = item.classList.contains("active");

      // Fecha todos os outros itens do acordeão
      faqItems.forEach(otherItem => {
        otherItem.classList.remove("active");
      });

      // Se não estava ativo, abre o atual
      if (!isActive) {
        item.classList.add("active");
      }
    });
  });
});

/* ============================================================================================= */
/* ==========================================
   ELEMENTO
========================================== */
document.addEventListener("DOMContentLoaded", function () {
  const pauseButton = document.querySelector(".pause-btn");

  if (pauseButton) {
    pauseButton.addEventListener("click", function () {
      this.classList.toggle("paused");
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  let currentPage = 1;
  const cardsPerPage = 8; // Define 8 cards por página

  const paginationNumbers = document.getElementById("pagination-numbers");
  const prevBtn = document.getElementById("prev-page-btn");
  const nextBtn = document.getElementById("next-page-btn");
  const totalPagesLabel = document.getElementById("total-pages-label");
  const paginationBar = document.getElementById("pagination-bar");
  const allCards = document.querySelectorAll(".minecraft-news-grid-card");
  const totalNewsCount = document.getElementById("total-news-count");

  // Configura o contador real de cards na seção (2.979)
  totalNewsCount.textContent = "2.979";

  // Toggle Sort Dropdown
  const sortContainer = document.querySelector(".minecraft-sort-dropdown-container");
  const sortToggle = document.getElementById("sort-dropdown-toggle");
  const sortItems = document.querySelectorAll(".minecraft-dropdown-item");
  const currentSortText = document.getElementById("current-sort-text");

  sortToggle.addEventListener("click", () => {
    sortContainer.classList.toggle("active");
  });

  document.addEventListener("click", (e) => {
    if (!sortContainer.contains(e.target)) {
      sortContainer.classList.remove("active");
    }
  });

  sortItems.forEach(item => {
    item.addEventListener("click", () => {
      sortItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      currentSortText.textContent = item.textContent;
      sortContainer.classList.remove("active");
    });
  });

  // Toggle Filters Drawer
  const filtersToggle = document.getElementById("filters-modal-toggle");
  const filtersDrawer = document.getElementById("filters-drawer");
  const applyFiltersBtn = document.getElementById("apply-filters-btn");
  const filterCheckboxes = document.querySelectorAll(".filter-checkbox");

  filtersToggle.addEventListener("click", () => {
    filtersDrawer.classList.toggle("open");
  });

  // Função central que gerencia filtros, paginação e exibição dos cards
  function updateView() {
    // 1. Pega as categorias ativas dos checkboxes
    const activeCategories = Array.from(filterCheckboxes)
      .filter(chk => chk.checked)
      .map(chk => chk.value);

    // 2. Filtra quais cards estão visíveis após o filtro de tags
    const visibleCards = Array.from(allCards).filter(card => {
      const cardCategory = card.getAttribute("data-category");
      return activeCategories.includes(cardCategory);
    });

    // ATUALIZAÇÃO: O contador agora mostra a quantidade exata de cards filtrados na tela
    totalNewsCount.textContent = visibleCards.length;

    // 3. Calcula o total de páginas com base nos cards filtrados (8 por página)
    const totalPages = Math.ceil(visibleCards.length / cardsPerPage) || 1;

    // Garante que a página atual não ultrapasse o novo limite total
    if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    // Atualiza label do total de páginas
    totalPagesLabel.textContent = totalPages;

    // Se houver 8 cards ou menos, esconde a barra de paginação (ou mostra se tiver mais)
    if (visibleCards.length <= cardsPerPage) {
      paginationBar.classList.add("hidden");
    } else {
      paginationBar.classList.remove("hidden");
    }

    // 4. Aplica a paginação nos cards filtrados
    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;

    allCards.forEach(card => {
      const cardCategory = card.getAttribute("data-category");
      const passesFilter = activeCategories.includes(cardCategory);

      if (!passesFilter) {
        card.classList.add("hidden-by-filter");
        card.classList.remove("hidden-by-pagination");
      } else {
        card.classList.remove("hidden-by-filter");
        // Verifica se está no intervalo da página atual
        const indexInVisible = visibleCards.indexOf(card);
        if (indexInVisible >= startIndex && indexInVisible < endIndex) {
          card.classList.remove("hidden-by-pagination");
        } else {
          card.classList.add("hidden-by-pagination");
        }
      }
    });

    renderPaginationControls(totalPages);
  }

  // Renderiza os números das páginas e reticências sem rolar para o topo
  function renderPaginationControls(totalPages) {
    paginationNumbers.innerHTML = "";

    let pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages = [1, 2, 3, 4, 5, '...', totalPages];
      } else if (currentPage >= totalPages - 3) {
        pages = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
      }
    }

    pages.forEach(p => {
      if (p === '...') {
        const ellipsis = document.createElement("span");
        ellipsis.className = "minecraft-page-ellipsis";
        ellipsis.textContent = "...";
        paginationNumbers.appendChild(ellipsis);
      } else {
        const pageBtn = document.createElement("button");
        pageBtn.className = `minecraft-page-num ${p === currentPage ? "active" : ""}`;
        pageBtn.textContent = p;
        pageBtn.addEventListener("click", (e) => {
          e.preventDefault(); // Evita scroll para o topo
          currentPage = p;
          updateView();
        });
        paginationNumbers.appendChild(pageBtn);
      }
    });

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
  }

  applyFiltersBtn.addEventListener("click", (e) => {
    e.preventDefault();
    filtersDrawer.classList.remove("open");
    currentPage = 1; // Reseta para a primeira página ao aplicar filtros
    updateView();
  });

  prevBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      updateView();
    }
  });

  nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const activeCategories = Array.from(filterCheckboxes).filter(chk => chk.checked).map(chk => chk.value);
    const visibleCardsCount = Array.from(allCards).filter(card => activeCategories.includes(card.getAttribute("data-category"))).length;
    const totalPages = Math.ceil(visibleCardsCount / cardsPerPage) || 1;

    if (currentPage < totalPages) {
      currentPage++;
      updateView();
    }
  });

  // Inicialização
  updateView();
});


/* ============================================================================================= */
/* ==========================================
   ELEMENTO
========================================== */
document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".guide-tab-btn");
  const tabPanels = document.querySelectorAll(".guide-panel");

  tabButtons.forEach(button => {
    button.addEventListener("click", () => {
      // Remove a classe 'active' de todos os botões e painéis
      tabButtons.forEach(btn => btn.classList.remove("active"));
      tabPanels.forEach(panel => panel.classList.remove("active"));

      // Adiciona a classe 'active' no botão clicado
      button.classList.add("active");

      // Pega o ID alvo através do data-attribute e ativa o painel correspondente
      const targetPanelId = button.getAttribute("data-tab");
      const targetPanel = document.getElementById(targetPanelId);

      if (targetPanel) {
        targetPanel.classList.add("active");
      }
    });
  });
});

/**
 * Alterna entre as abas de Downloads e Suporte
 */
function switchSupportTab(event, tabId) {
  // Remove a classe active de todos os botões e conteúdos
  const buttons = document.querySelectorAll('.dl-tab-btn');
  const contents = document.querySelectorAll('.dl-tab-content');

  buttons.forEach(btn => btn.classList.remove('active'));
  contents.forEach(content => content.classList.remove('active'));

  // Adiciona a classe active no botão clicado e na aba correspondente
  event.currentTarget.classList.add('active');
  document.getElementById(tabId).classList.add('active');
}

/**
 * Controla a abertura e fechamento dos itens de acordeão (FAQ)
 */
function toggleAccordion(headerElement) {
  const accordionItem = headerElement.parentElement;
  const isActive = accordionItem.classList.contains('active');

  // Opcional: Fecha todos os outros itens antes de abrir o atual (comportamento de sanfona única)
  // document.querySelectorAll('.dl-accordion-item').forEach(item => item.classList.remove('active'));

  if (!isActive) {
    accordionItem.classList.add('active');
  } else {
    accordionItem.classList.remove('active');
  }
}

/* ============================================================================================= */
/* ==========================================
   FUNÇÃO ABRIR GALERIA E FECHAR COM ZOOM
========================================== */
document.addEventListener("DOMContentLoaded", function () {
  const galleryItems = document.querySelectorAll(".mk-moments-item");
  const lightbox = document.querySelector(".mk-lightbox");
  const lightboxImg = document.querySelector(".mk-lightbox-img");
  const lightboxClose = document.querySelector(".mk-lightbox-close");

  if (!lightbox || !lightboxImg) return;

  galleryItems.forEach(function (item) {
    item.addEventListener("click", function () {
      const img = item.querySelector("img");
      if (img) {
        lightboxImg.src = img.src;
        lightbox.classList.add("active");
      }
    });
  });

  function closeLightbox() {
    lightbox.classList.remove("active");
  }

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeLightbox();
    }
  });
});
/* ============================================================================================= */
/* ==========================================
   CARD DE SERVIDOR DEDICADO BEDROCK (Muda o Link do Check do Card no Botão de Baixar)
========================================== */
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.mc-bedrock-card');

  cards.forEach(card => {
    const checkbox = card.querySelector('.mc-terms-checkbox');
    const radios = card.querySelectorAll('input[type="radio"]');
    const downloadBtn = card.querySelector('.mc-btn-submit');

    function updateCardState() {
      const isAccepted = checkbox.checked;
      const selectedRadio = card.querySelector('input[type="radio"]:checked');

      if (isAccepted && selectedRadio) {
        // Remove estado desativado e injeta o valor do radio (URL) no href
        downloadBtn.classList.remove('disabled');
        downloadBtn.setAttribute('href', selectedRadio.value);
      } else {
        // Desativa o botão e limpa a URL
        downloadBtn.classList.add('disabled');
        downloadBtn.setAttribute('href', '#');
      }
    }

    checkbox.addEventListener('change', updateCardState);
    radios.forEach(radio => radio.addEventListener('change', updateCardState));

    updateCardState();
  });
});

/* ==========================================================================
   CARROSSEL INFINITO "COMEMORAÇÕES E PARCERIAS"
   ========================================================================== */
(() => {
  function initCelebrationsCarousel() {
    const track = document.querySelector('.mc-celebrations-track');
    const prevBtn = document.querySelector('.mc-celebrations-arrow-prev');
    const nextBtn = document.querySelector('.mc-celebrations-arrow-next');
    const viewport = document.querySelector('.mc-celebrations-viewport');

    if (!track || !prevBtn || !nextBtn || !viewport) return;

    if (track.dataset.initialized === 'true') return;

    const originalCards = Array.from(track.children);
    if (originalCards.length === 0) return;

    // Duplicação múltipla dos cartões para permitir navegação infinita e fluida
    const cloneCount = 3;
    for (let i = 0; i < cloneCount; i++) {
      originalCards.forEach(card => track.appendChild(card.cloneNode(true)));
      originalCards.slice().reverse().forEach(card => track.insertBefore(card.cloneNode(true), track.firstChild));
    }

    const allCards = Array.from(track.children);
    let activeIndex = originalCards.length * cloneCount;

    // Recalcula e aplica o posicionamento central
    function updateCarousel(smooth = true) {
      const cardWidth = allCards[0].offsetWidth;
      const gap = parseFloat(window.getComputedStyle(track).gap) || 60;
      const viewportWidth = viewport.offsetWidth;

      track.style.transition = smooth ? 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)' : 'none';

      // Cálculo do deslocamento necessário para centralizar o cartão ativo
      const targetPosition = (activeIndex * (cardWidth + gap)) + (cardWidth / 2) - (viewportWidth / 2);
      track.style.transform = `translateX(-${targetPosition}px)`;

      // Atualiza a opacidade/destaque visual do cartão ativo
      allCards.forEach((card, idx) => {
        card.classList.toggle('is-active', idx === activeIndex);
      });
    }

    // Reinicia a posição de forma invisível quando chega aos limites clonados
    function handleLoop() {
      const total = originalCards.length;
      if (activeIndex < total) {
        activeIndex += total;
        updateCarousel(false);
      } else if (activeIndex >= allCards.length - total) {
        activeIndex -= total;
        updateCarousel(false);
      }
    }

    // Controlo dos botões
    nextBtn.addEventListener('click', () => {
      activeIndex++;
      updateCarousel(true);
    });

    prevBtn.addEventListener('click', () => {
      activeIndex--;
      updateCarousel(true);
    });

    track.addEventListener('transitionend', handleLoop);
    window.addEventListener('resize', () => updateCarousel(false));

    // Ajusta a posição inicial sem animação
    updateCarousel(false);

    // Exibe a viewport perfeitamente centralizada
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        viewport.classList.add('is-ready');
        track.dataset.initialized = 'true';
      });
    });
  }

  if (document.readyState === 'complete') {
    initCelebrationsCarousel();
  } else {
    window.addEventListener('load', initCelebrationsCarousel);
  }
})();

/* ==========================================================================
   LÓGICA DO CARROSSEL "UM FILME MINECRAFT" - FINAL E COMPLETO
   ========================================================================== */
(() => {
  function initMovieCarousel() {
    const track = document.querySelector('.mc-movie-track');
    const prevBtn = document.querySelector('.mc-movie-arrow-prev');
    const nextBtn = document.querySelector('.mc-movie-arrow-next');
    const viewport = document.querySelector('.mc-movie-viewport');

    if (!track || !prevBtn || !nextBtn || !viewport) return;

    // Evita reinicialização duplicada
    if (track.dataset.initialized === 'true') return;

    const originalCards = Array.from(track.children);
    if (originalCards.length === 0) return;

    // Duplica os cartões para criar o loop infinito contínuo
    const cloneCount = 3;
    for (let i = 0; i < cloneCount; i++) {
      originalCards.forEach(card => track.appendChild(card.cloneNode(true)));
      originalCards.slice().reverse().forEach(card => track.insertBefore(card.cloneNode(true), track.firstChild));
    }

    const allCards = Array.from(track.children);
    let activeIndex = originalCards.length * cloneCount;

    // Atualiza a posição da faixa e centraliza o cartão ativo
    function updateCarousel(smooth = true) {
      const cardWidth = allCards[0].offsetWidth;
      const gap = parseFloat(window.getComputedStyle(track).gap) || 70;
      const viewportWidth = viewport.offsetWidth;

      // Aplica a transição suave apenas durante a navegação manual
      track.style.transition = smooth ? 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)' : 'none';

      // Posição exata do cartão central na tela
      const targetPosition = (activeIndex * (cardWidth + gap)) + (cardWidth / 2) - (viewportWidth / 2);
      track.style.transform = `translateX(-${targetPosition}px)`;

      // Marca o cartão central como ativo
      allCards.forEach((card, idx) => {
        card.classList.toggle('is-active', idx === activeIndex);
      });
    }

    // Efetua o salto invisível ao atingir as extremidades clonadas
    function handleLoop() {
      const total = originalCards.length;
      if (activeIndex < total) {
        activeIndex += total;
        updateCarousel(false);
      } else if (activeIndex >= allCards.length - total) {
        activeIndex -= total;
        updateCarousel(false);
      }
    }

    // Cliques nas setas
    nextBtn.addEventListener('click', () => {
      activeIndex++;
      updateCarousel(true);
    });

    prevBtn.addEventListener('click', () => {
      activeIndex--;
      updateCarousel(true);
    });

    track.addEventListener('transitionend', handleLoop);
    window.addEventListener('resize', () => updateCarousel(false));

    // Posiciona instantaneamente antes de exibir
    updateCarousel(false);

    // Revela a viewport no próximo ciclo de renderização já perfeitamente ajustada
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        viewport.classList.add('is-ready');
        track.dataset.initialized = 'true';
      });
    });
  }

  // Garante que o cálculo ocorra apenas com todas as imagens e fontes prontas
  if (document.readyState === 'complete') {
    initMovieCarousel();
  } else {
    window.addEventListener('load', initMovieCarousel);
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  // 1. SISTEMA DE GERENCIAMENTO DE ABAS
  const tabButtons = document.querySelectorAll('.mc-tab-btn');
  const tabPanels = document.querySelectorAll('.mc-tab-panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');

      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanels.forEach(panel => panel.classList.remove('active'));

      button.classList.add('active');
      const activePanel = document.getElementById(`tab-${targetTab}`);
      if (activePanel) {
        activePanel.classList.add('active');
      }
    });
  });

  // 2. CARROSSEL COM ROLAGEM INFINITA SEM COSTURAS
  const track = document.querySelector('.mc-carousel-track');
  const prevBtn = document.querySelector('.mc-arrow-prev');
  const nextBtn = document.querySelector('.mc-arrow-next');

  if (track && prevBtn && nextBtn) {
    const originalCards = Array.from(track.children);
    const totalOriginal = originalCards.length;

    // Duplica os cards para frente e para trás garantindo o efeito infinito
    originalCards.forEach(card => track.appendChild(card.cloneNode(true)));
    originalCards.slice().reverse().forEach(card => track.insertBefore(card.cloneNode(true), track.firstChild));

    const allCards = Array.from(track.children);
    let currentIndex = totalOriginal; // Ponto inicial no conjunto central
    let isTransitioning = false;

    const getOffset = () => {
      const cardWidth = allCards[0].offsetWidth;
      const gap = parseFloat(window.getComputedStyle(track).gap) || 40;
      return cardWidth + gap;
    };

    const updatePosition = (smooth = true) => {
      const offset = getOffset();
      track.style.transition = smooth ? 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)' : 'none';
      track.style.transform = `translate3d(-${currentIndex * offset}px, 0, 0)`;
    };

    // Teleporta a posição para o centro sem animação ao atingir as bordas clonadas
    track.addEventListener('transitionend', () => {
      isTransitioning = false;
      if (currentIndex >= totalOriginal * 2) {
        currentIndex -= totalOriginal;
        updatePosition(false);
      } else if (currentIndex < totalOriginal) {
        currentIndex += totalOriginal;
        updatePosition(false);
      }
    });

    nextBtn.addEventListener('click', () => {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex++;
      updatePosition(true);
    });

    prevBtn.addEventListener('click', () => {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex--;
      updatePosition(true);
    });

    // Reajuste automático ao redimensionar a tela
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => updatePosition(false), 50);
    });

    // Posição inicial inicializada
    requestAnimationFrame(() => updatePosition(false));
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".mg-thumb-card");
  const activeImage = document.getElementById("mgActiveImage");
  const activeDesc = document.getElementById("mgActiveDescription");
  const videoLink = document.getElementById("mgVideoLink");
  const track = document.getElementById("mgCarouselTrack");
  const viewport = document.getElementById("mgCarouselViewport");
  const prevBtn = document.getElementById("mgPrevBtn");
  const nextBtn = document.getElementById("mgNextBtn");

  let currentIndex = 0;
  const totalCards = cards.length;

  let currentTranslate = 0;
  let targetTranslate = 0;
  let isAnimating = false;

  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  function smoothScrollToCard(cardEl) {
    const offsetLeft = cardEl.offsetLeft - (viewport.clientWidth / 2) + (cardEl.clientWidth / 2);
    targetTranslate = Math.max(0, Math.min(offsetLeft, track.scrollWidth - viewport.clientWidth));

    if (!isAnimating) {
      runLerpAnimation();
    }
  }

  function runLerpAnimation() {
    isAnimating = true;
    currentTranslate = lerp(currentTranslate, targetTranslate, 0.12);
    viewport.scrollLeft = currentTranslate;

    if (Math.abs(targetTranslate - currentTranslate) > 0.5) {
      requestAnimationFrame(runLerpAnimation);
    } else {
      isAnimating = false;
    }
  }

  function selectCard(index) {
    // Loop infinito perfeito nas pontas
    currentIndex = (index + totalCards) % totalCards;

    cards.forEach((c) => c.classList.remove("active"));
    const selected = cards[currentIndex];
    selected.classList.add("active");

    const newImg = selected.getAttribute("data-img");
    const newDesc = selected.getAttribute("data-desc");
    const newYt = selected.getAttribute("data-yt");

    // Transição suave de opacidade no ecrã principal
    activeImage.style.opacity = "0";
    setTimeout(() => {
      activeImage.src = newImg;
      activeDesc.textContent = newDesc;
      videoLink.href = newYt;
      activeImage.style.opacity = "1";
    }, 120);

    smoothScrollToCard(selected);
  }

  cards.forEach((card, idx) => {
    card.addEventListener("click", () => {
      selectCard(idx);
    });
  });

  prevBtn.addEventListener("click", () => {
    selectCard(currentIndex - 1);
  });

  nextBtn.addEventListener("click", () => {
    selectCard(currentIndex + 1);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("mzBannerTrack");
  const originalSlides = Array.from(track.children);
  const nextBtn = document.getElementById("mzBannerNext");
  const prevBtn = document.getElementById("mzBannerPrev");
  const bannerSection = document.querySelector(".mz-superbanner-section");

  // 1. Pré-carregamento imediato em cache de todas as imagens para evitar travadas de rede/renderização
  originalSlides.forEach(slide => {
    const img = slide.querySelector("img");
    if (img && img.src) {
      const preloadImg = new Image();
      preloadImg.src = img.src;
    }
  });

  const totalSlides = originalSlides.length;

  // 2. Clonagem em ambas as pontas (Permite loop contínuo e suave para a esquerda e para a direita)
  const firstClone = originalSlides[totalSlides - 1].cloneNode(true);
  const lastClone = originalSlides[0].cloneNode(true);

  track.insertBefore(firstClone, originalSlides[0]);
  track.appendChild(lastClone);

  let currentIndex = 1; // Inicia no primeiro slide real (índice 1 por conta do clone inicial)
  const slideWidth = 100;

  // Ajuste inicial sem transição
  track.style.transition = "none";
  track.style.transform = `translate3d(-${currentIndex * slideWidth}%, 0, 0)`;

  function updateSlidePosition(withTransition = true) {
    if (withTransition) {
      track.style.transition = "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)";
    } else {
      track.style.transition = "none";
    }
    track.style.transform = `translate3d(-${currentIndex * slideWidth}%, 0, 0)`;
  }

  function nextSlide() {
    if (currentIndex >= totalSlides + 1) return;
    currentIndex++;
    updateSlidePosition(true);

    if (currentIndex === totalSlides + 1) {
      setTimeout(() => {
        currentIndex = 1;
        updateSlidePosition(false);
      }, 500);
    }
  }

  function prevSlide() {
    if (currentIndex <= 0) return;
    currentIndex--;
    updateSlidePosition(true);

    if (currentIndex === 0) {
      setTimeout(() => {
        currentIndex = totalSlides;
        updateSlidePosition(false);
      }, 500);
    }
  }

  nextBtn.addEventListener("click", () => {
    nextSlide();
    resetInterval();
  });

  prevBtn.addEventListener("click", () => {
    prevSlide();
    resetInterval();
  });

  let slideInterval = setInterval(nextSlide, 6000);

  function resetInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 6000);
  }

  bannerSection.addEventListener("mouseenter", () => clearInterval(slideInterval));
  bannerSection.addEventListener("mouseleave", () => slideInterval = setInterval(nextSlide, 6000));
});

/* ==========================================
   CONTROLADOR DE FIXAÇÃO DO BANNER
========================================== */
document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.getElementById("checkout-wrapper");
  const banner = document.getElementById("checkout-banner");

  if (!wrapper || !banner) return;

  const checkScroll = () => {
    const wrapperRect = wrapper.getBoundingClientRect();
    const isMobile = window.innerWidth <= 1024;

    // Altura do gatilho baseada no header (60px mobile / 70px pc)
    const triggerPoint = isMobile ? 60 : 70;

    // Se o topo do contentor atingir a linha do cabeçalho fixo
    if (wrapperRect.top <= triggerPoint) {
      // Bloqueia a altura do contentor para a página não dar "pulo"
      wrapper.style.height = banner.offsetHeight + "px";

      if (isMobile) {
        banner.classList.add("is-fixed-mob");
        banner.classList.remove("is-fixed-pc");
      } else {
        banner.classList.add("is-fixed-pc");
        banner.classList.remove("is-fixed-mob");
      }
    } else {
      // Solta o banner quando voltar para cima
      banner.classList.remove("is-fixed-pc", "is-fixed-mob");
      wrapper.style.height = "auto";
    }
  };

  window.addEventListener("scroll", checkScroll);
  window.addEventListener("resize", checkScroll);

  // Executa ao carregar caso a página abra já abaixo
  checkScroll();
});