// Atualizar o ano do copyright automaticamente
document.getElementById('current-year').textContent = new Date().getFullYear();

const backToTop = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    // Aparece quando rolar mais de 400px
    if (window.scrollY > 400) {
        backToTop.classList.add('active');
    } else {
        backToTop.classList.remove('active');
    }
});

// Função de clique suave
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});



/**
 * ZERA'S CRAFT - MOTOR DE NAVEGAÇÃO COMPLETO
 * Autoload + PC Mega Menu + Mobile Menu + Search + Scroll Lock
 */

/* ==========================================
   1. UTILITÁRIOS: TRAVA DE SCROLL
   (Usa a classe .z-lock-scroll definida no CSS)
========================================== */
function lockScroll() {
    document.documentElement.classList.add('z-lock-scroll');
    document.body.classList.add('z-lock-scroll');
}

function unlockScroll() {
    document.documentElement.classList.remove('z-lock-scroll');
    document.body.classList.remove('z-lock-scroll');
}

/* ==========================================
   2. SISTEMA DE AUTOLOAD (nav.html)
========================================== */
document.addEventListener("DOMContentLoaded", () => {
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (navPlaceholder) {
        // Tenta carregar nav.html da raiz ou pasta anterior
        fetch('nav.html')
            .then(res => {
                if (!res.ok) return fetch('../nav.html');
                return res;
            })
            .then(res => res.text())
            .then(html => {
                navPlaceholder.innerHTML = html;
            })
            .catch(err => console.error("Erro ao carregar o menu:", err));
    }
});

/* ==========================================
   FECHAR NAVEGAÇÃO AO CLICAR FORA OU ESC
========================================== */

// 1. Fechar ao clicar fora dos elementos da navegação
document.addEventListener('click', (e) => {
    // Verifica se o clique NÃO aconteceu dentro de um item do menu (botão ou painel)
    if (!e.target.closest('.znav-mega-btn')) {
        const openedMenus = document.querySelectorAll('.znav-mega-btn.open');

        if (openedMenus.length > 0) {
            // Remove a classe 'open' de todos os menus abertos
            openedMenus.forEach(menu => menu.classList.remove('open'));

            // Destrava o scroll da página (função que já existe no seu JS)
            if (typeof unlockScroll === 'function') {
                unlockScroll();
            }
        }
    }
});

// 2. Fechar ao pressionar a tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.keyCode === 27) {

        // --- A. Fecha o Mega Menu ---
        const openedMenus = document.querySelectorAll('.znav-mega-btn.open');
        if (openedMenus.length > 0) {
            openedMenus.forEach(menu => menu.classList.remove('open'));

            if (typeof unlockScroll === 'function') {
                unlockScroll();
            }
        }

        // --- B. Fecha também a Modal de Pesquisa (Bônus) ---
        const searchModal = document.getElementById('zSearchModal');
        if (searchModal && searchModal.classList.contains('active')) {
            if (typeof closeSearch === 'function') {
                closeSearch(); // Chama a sua função existente para fechar a lupa
            }
        }

        // --- C. Fecha também o Menu Mobile se estiver aberto (Bônus) ---
        const mobileSidebar = document.getElementById('zmobSidebar');
        if (mobileSidebar && mobileSidebar.classList.contains('active')) {
            if (typeof closeMobileMenu === 'function') {
                closeMobileMenu();
            }
        }
    }
});

/* ==========================================
   3. DESKTOP: MEGA MENU INTERATIVO
========================================== */
function toggleMegaMenu(evt) {
    // Impede fechar ao clicar dentro do painel ou dropdown simples
    if (evt.target.closest('.znav-mega-panel') || evt.target.closest('.znav-simple-drop')) return;

    const clickedBtn = evt.currentTarget;
    const isOpen = clickedBtn.classList.contains('open');

    // Fecha todos os menus abertos e destrava o scroll antes de checar o próximo
    document.querySelectorAll('.znav-mega-btn').forEach(btn => btn.classList.remove('open'));
    unlockScroll();

    if (!isOpen) {
        clickedBtn.classList.add('open');
        lockScroll(); // Trava a página ao abrir o menu no PC

        // Garante que a primeira aba interna apareça por padrão
        const panel = clickedBtn.querySelector('.znav-mega-grid');
        if (panel) {
            const tabs = panel.querySelectorAll('.znav-tab');
            const contents = panel.querySelectorAll('.znav-tab-content');
            if (tabs.length > 0 && contents.length > 0) {
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                tabs[0].classList.add('active');
                contents[0].classList.add('active');
            }
        }
    }
}

// Fecha o menu ao clicar em qualquer lugar fora dele
document.addEventListener('click', (e) => {
    if (!e.target.closest('.znav-mega-btn')) {
        const opened = document.querySelector('.znav-mega-btn.open');
        if (opened) {
            opened.classList.remove('open');
            unlockScroll();
        }
    }
});

// Troca de Abas dentro do Mega Menu
function switchZnavTab(evt, targetId) {
    evt.preventDefault();
    evt.stopPropagation();
    const parentGrid = evt.currentTarget.closest('.znav-mega-grid');
    parentGrid.querySelectorAll('.znav-tab').forEach(tab => tab.classList.remove('active'));
    parentGrid.querySelectorAll('.znav-tab-content').forEach(content => content.classList.remove('active'));
    evt.currentTarget.classList.add('active');
    const target = parentGrid.querySelector(`#${targetId}`);
    if (target) target.classList.add('active');
}

/* ==========================================
   4. MOBILE: SIDEBAR E SLIDING PANELS
========================================== */
function openMobileMenu(evt) {
    // Se você passar o evento (evt), preventDefault garante que a página não se mova
    if (evt) evt.preventDefault();

    document.getElementById('zmobSidebar').classList.add('active');
    document.getElementById('zmobOverlay').classList.add('active');

    // Aplica a trava
    document.documentElement.classList.add('z-lock-scroll');
    document.body.classList.add('z-lock-scroll');
}

function closeMobileMenu() {
    document.getElementById('zmobSidebar').classList.remove('active');
    document.getElementById('zmobOverlay').classList.remove('active');
    unlockScroll();
    setTimeout(slideBack, 300); // Retorna os painéis para o início após fechar
}

function slideMobile(panelId) {
    document.getElementById('zpanel-main').classList.add('slide-left');
    document.getElementById(panelId).classList.add('active');
}

function slideBack() {
    document.getElementById('zpanel-main').classList.remove('slide-left');
    document.querySelectorAll('.zpanel-sub').forEach(p => p.classList.remove('active'));
}

/* ==========================================
   5. PESQUISA (MODAL)
========================================== */
const zcIndex = [
    { name: "CraftJam", link: "craftjam.html" },
    { name: "Eventos", link: "eventos.html" },
    { name: "Loja VIP", link: "loja.html" }
];

function openSearch() {
    if (document.getElementById('zmobSidebar').classList.contains('active')) closeMobileMenu();
    document.getElementById('zSearchModal').classList.add('active');
    lockScroll();
    const input = document.getElementById('zSearchInput');
    input.value = "";
    input.focus();
    runSearch();
}

function closeSearch() {
    document.getElementById('zSearchModal').classList.remove('active');
    unlockScroll();
}

function runSearch() {
    const query = document.getElementById('zSearchInput').value.toLowerCase();
    const resultList = document.getElementById('zSearchResults');
    resultList.innerHTML = '';

    const filtered = query === "" ? zcIndex.slice(0, 3) : zcIndex.filter(p => p.name.toLowerCase().includes(query));

    if (filtered.length === 0) {
        resultList.innerHTML = '<li><a href="#" style="color:#555; pointer-events:none;">Sem resultados.</a></li>';
        return;
    }

    filtered.forEach(p => {
        resultList.innerHTML += `<li><a href="${p.link}"><i class="fas fa-search"></i> ${p.name}</a></li>`;
    });
}


/**
 * ZERA'S CRAFT ENGINE - MÓDULO DE DATA
 * Converte Snowflake ID em Data e anima a contagem
 */
const ZerasEngine = {
    guildID: '1390120239588577482',
    inviteCode: 'GYGVBqGEwP',

    async syncAll() {
        try {
            const response = await fetch(`https://discord.com/api/v9/invites/${this.inviteCode}?with_counts=true`);
            const data = await response.json();

            // 1. Sincroniza Membros (Online e Total) [cite: 153]
            this.updateCounter('stat-total', data.approximate_member_count || 5000);
            this.updateCounter('stat-online', data.approximate_presence_count || 0);
            // Adicione o complemento como uma string no final
            this.updateCounter('discord-count', data.approximate_presence_count || 0, ' Membros Online agora');

            // 2. Sincroniza Data de Criação via ID (Snowflake)
            this.syncCreationDate();

        } catch (error) {
            console.error("Zera's Craft: Erro de sincronização.");
        }
    },

    // Converte o ID do Discord para Data Real
    syncCreationDate() {
        const id = BigInt(this.guildID);
        // Constante de tempo do Discord (Epoch) 
        const timestamp = Number((id >> 22n) + 1420070400000n);
        const date = new Date(timestamp);

        const targetDate = {
            day: date.getDate(),
            month: date.getMonth() + 1,
            year: date.getFullYear()
        };

        this.animateDate('stat-date', targetDate);
    },

    // Animação de Data dd/mm/aaaa a 60fps [cite: 153]
    animateDate(id, target) {
        const el = document.getElementById(id);
        if (!el) return;

        let current = { day: 0, month: 0, year: 2000 };
        const duration = 2000; // 2 segundos
        const start = performance.now();

        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);

            // Lógica de interpolação linear [cite: 106]
            current.day = Math.floor(progress * target.day);
            current.month = Math.floor(progress * target.month);
            current.year = Math.floor(2000 + (progress * (target.year - 2000)));

            // Formatação com zeros à esquerda (Partial Update) [cite: 190]
            const d = String(current.day).padStart(2, '0');
            const m = String(current.month).padStart(2, '0');
            const y = current.year;

            el.innerText = `${d}/${m}/${y}`;

            if (progress < 1) requestAnimationFrame(step);
            else el.innerText = `${String(target.day).padStart(2, '0')}/${String(target.month).padStart(2, '0')}/${target.year}`;
        };

        requestAnimationFrame(step);
    },

    // 1. Prepara o alvo e define o valor final com o complemento
    updateCounter(id, target, suffix = "") {
        const el = document.getElementById(id);
        if (el) {
            // Define o valor final no atributo para a lógica de animação [cite: 191]
            el.setAttribute('data-target', target);
            this.animateNumber(el, suffix);
        }
    },

    // 2. Executa a animação suave via requestAnimationFrame 
    animateNumber(el, suffix) {
        const target = +el.getAttribute('data-target');

        const update = () => {
            // Remove caracteres não numéricos para calcular o progresso [cite: 191]
            const current = +el.innerText.replace(/\D/g, '') || 0;
            const increment = Math.ceil(target / 100);

            if (current < target) {
                const nextValue = Math.min(target, current + increment);
                // Atualização parcial: número formatado + complemento [cite: 191]
                el.innerText = `${nextValue.toLocaleString()}${suffix}`;
                requestAnimationFrame(update);
            } else {
                // Garante que o valor final exato seja exibido com o sufixo [cite: 191]
                el.innerText = `${target.toLocaleString()}${suffix}`;
            }
        };

        requestAnimationFrame(update);
    }
};

window.addEventListener('DOMContentLoaded', () => ZerasEngine.syncAll());


// SISTEMA DO PLAYER DE MÚSICA DESAPARECER
// SE ESTIVER NO FIM DA PÁGINA
const handlePlayerVisibility = () => {
    const player = document.querySelector('.music-player-container');
    if (!player) return;

    // Altura total do documento
    const totalHeight = document.documentElement.scrollHeight;
    // Posição atual do scroll + altura da janela do navegador
    const currentScroll = window.innerHeight + window.pageYOffset;

    // Distância do fim da página para ativar o desaparecimento (ajuste se necessário)
    const threshold = 150;

    if (currentScroll >= (totalHeight - threshold)) {
        player.classList.add('player-hidden');
    } else {
        player.classList.remove('player-hidden');
    }
};

// Evento de scroll otimizado
let scrollTimer;
window.addEventListener('scroll', () => {
    window.clearTimeout(scrollTimer);
    scrollTimer = setTimeout(handlePlayerVisibility, 10);
}, { passive: true });

// Executa uma vez ao carregar para caso a página já inicie no fim
window.addEventListener('load', handlePlayerVisibility);

// 3. Scroll Animation (Reveal)
const observerOptions = {
    threshold: 0.15, // Ativa quando 15% do elemento estiver visível
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Para de observar após animar
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
});

// 4. Accordion Function
function toggleAcc(element) {
    const content = element.nextElementSibling;
    const icon = element.querySelector('.fa-chevron-down');

    content.classList.toggle('open');

    if (content.classList.contains('open')) {
        icon.style.transform = "rotate(180deg)";
    } else {
        icon.style.transform = "rotate(0deg)";
    }
}

// 5. Contadores Animados (Stats)
const counters = document.querySelectorAll('.counter');
const speed = 200;

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 25);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
            statsObserver.unobserve(counter);
        }
    });
});

counters.forEach(counter => statsObserver.observe(counter));

// Funcionalidade "Ler Mais" nos cards
document.querySelectorAll('.read-more-toggle').forEach(button => {
    button.addEventListener('click', function () {
        const textContent = this.previousElementSibling;
        textContent.classList.toggle('expanded');

        if (textContent.classList.contains('expanded')) {
            this.textContent = 'Ler menos';
        } else {
            this.textContent = 'Ler mais...';
        }
    });
});




// 1. Simulação de Jogadores Online (Número Aleatório para dar vida)
function updatePlayers() {
    const countElement = document.getElementById('online-count');
    const randomCount = Math.floor(Math.random() * (1500 - 1200 + 1)) + 1200;
    if (countElement) countElement.innerText = `${randomCount} JOGADORES ONLINE AGORA`;
}
updatePlayers();

// 2. Filtro de Categorias (Lógica)
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelector('.filter-btn.active').classList.remove('active');
        this.classList.add('active');
        const target = this.getAttribute('data-target');

        // Exemplo: Esconder/Mostrar cards de jogo baseado no target
        document.querySelectorAll('.game-card').forEach(card => {
            if (target === 'todos' || card.innerText.toLowerCase().includes(target)) {
                card.style.display = 'flex';
                card.style.animation = 'fadeIn 0.5s forwards';
            } else {
                card.style.display = 'none';
            }
        });
    });
});



// Lógica de Troca de Abas
window.switchTab = function (evt, tabName) {
    // Impede o navegador de tentar seguir um link ou recarregar
    if (evt) evt.preventDefault();

    const tabContents = document.querySelectorAll(".tab-content");
    const tabBtns = document.querySelectorAll(".tab-btn");

    // 1. Esconde tudo com prioridade máxima
    tabContents.forEach(content => {
        content.style.setProperty('display', 'none', 'important');
        content.classList.remove("active");
    });

    // 2. Reseta botões
    tabBtns.forEach(btn => {
        btn.classList.remove("active");
    });

    // 3. Mostra a aba correta
    const target = document.getElementById(tabName);
    if (target) {
        target.style.setProperty('display', 'block', 'important');
        setTimeout(() => {
            target.classList.add("active");
        }, 10);
    }

    if (evt && evt.currentTarget) {
        evt.currentTarget.classList.add("active");
    }
}

function toggleAccordion(element) {
    const item = element.parentElement; // Pega o .acc-item

    // Opcional: Fecha outros itens abertos (Estilo único)
    const allItems = document.querySelectorAll('.acc-item');
    allItems.forEach(i => {
        if (i !== item) i.classList.remove('active');
    });

    // Alterna o estado do item clicado
    item.classList.toggle('active');
}


function showClickNotification(titulo, mensagem) {
    // Cria o elemento
    const notification = document.createElement('div');
    notification.className = 'click-notification';

    notification.innerHTML = `
        <strong>${titulo}</strong>
        <span>${mensagem}</span>
    `;

    document.body.appendChild(notification);

    // Ativa a animação
    setTimeout(() => {
        notification.classList.add('active');
    }, 100);

    // Remove após 3 segundos
    setTimeout(() => {
        notification.classList.remove('active');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}


/* ==========================================
   CARROSSEL INFINITO (COLECIONÁVEIS)
========================================== */
function moveCarousel(direction) {
    const track = document.getElementById('carouselTrack');
    // Pegamos todos os cards dinamicamente toda vez que a função roda
    const cards = track.querySelectorAll('.mc-collectible-card');

    // Calcula a largura real do card + gap (margem) que você definiu no CSS
    const cardWidth = cards[0].offsetWidth;
    const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
    const moveDistance = cardWidth + gap;

    // Desativa a transição temporariamente para não animar o "teletransporte" do DOM
    track.style.transition = 'none';

    if (direction === 1) {
        // --- MOVER PARA A DIREITA (NEXT) ---
        // Anima o trilho para a esquerda
        track.style.transition = 'transform 0.4s ease-in-out';
        track.style.transform = `translateX(-${moveDistance}px)`;

        // Espera a animação terminar (400ms = 0.4s)
        setTimeout(() => {
            track.style.transition = 'none'; // Tira animação
            // Pega o PRIMEIRO card e joga para o FINAL da lista no HTML
            track.appendChild(cards[0]);
            // Zera a posição do trilho (porque o card que estava escondendo a esquerda já foi pro final)
            track.style.transform = 'translateX(0)';
        }, 400);

    } else if (direction === -1) {
        // --- MOVER PARA A ESQUERDA (PREV) ---
        // Pega o ÚLTIMO card e joga para o INÍCIO da lista no HTML (antes do primeiro)
        const lastCard = cards[cards.length - 1];
        track.insertBefore(lastCard, cards[0]);

        // Empurra o trilho para a esquerda (escondendo o card recém adicionado) sem animar
        track.style.transform = `translateX(-${moveDistance}px)`;

        // Força o navegador a registrar a mudança acima antes de animar (Reflow)
        void track.offsetWidth;

        // Agora sim, liga a animação e desliza de volta para o 0
        track.style.transition = 'transform 0.4s ease-in-out';
        track.style.transform = 'translateX(0)';
    }
}



// Removemos a variável "worldIndex" pois não precisamos mais dela
// let worldIndex = 0; 

/* ==========================================
   1. Lógica Slider "Expanda seu Mundo" (Loop Infinito Liso)
========================================== */
function moveWorld(direction) {
    const track = document.getElementById('worldTrack');
    const items = track.querySelectorAll('.w-item');

    // Calcula o tamanho exato de um item para saber quanto deve andar
    const step = items[0].offsetWidth;

    // Desativa a transição momentaneamente para preparar o terreno
    track.style.transition = 'none';

    if (direction === 1) {
        // --- NEXT (Botão Direito >) ---
        // Ativa a animação e desliza a esteira inteira para a esquerda
        track.style.transition = 'transform 0.4s ease-in-out';
        track.style.transform = `translateX(-${step}px)`;

        // Espera a animação terminar (400ms = 0.4s)
        setTimeout(() => {
            // Desliga a animação para não piscar
            track.style.transition = 'none';

            // Magia: Pega a PRIMEIRA div (que sumiu na esquerda) e "cola" no FINAL da fila
            track.appendChild(items[0]);

            // Zera a posição do trilho (o visual não muda porque a div da ponta já foi pro final)
            track.style.transform = 'translateX(0)';
        }, 400);

    } else if (direction === -1) {
        // --- PREV (Botão Esquerdo <) ---
        // Magia: Pega a ÚLTIMA div da fila e "cola" no começo (antes da primeira)
        const lastItem = items[items.length - 1];
        track.insertBefore(lastItem, items[0]);

        // Imediatamente e sem animar, empurra o trilho pra esquerda (escondendo a div que acabamos de colocar lá)
        track.style.transform = `translateX(-${step}px)`;

        // Força o navegador a renderizar esse empurrão instantâneo (Reflow)
        void track.offsetWidth;

        // Agora liga a animação e desliza de volta para o 0 (trazendo a nova div para a tela)
        track.style.transition = 'transform 0.4s ease-in-out';
        track.style.transform = 'translateX(0)';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const bundleBtn = document.querySelector('.bundle-btn');

    if (bundleBtn) {
        bundleBtn.addEventListener('click', (e) => {
            // Se quiser que o botão apenas simule uma ação por agora
            e.preventDefault();

            // Chama a função showMessage que já existe no seu player.js
            if (typeof showMessage === 'function') {
                showMessage("SUCESSO", "Redirecionando para a loja...", "fa-shopping-cart");
            } else {
                alert("A processar compra...");
            }
        });
    }
});

/**
 * ZERA'S CRAFT - MOTOR DE ABAS ZIGZAG
 * Controla a visibilidade dos painéis.
 */
function openTab(evt, tabId) {
    const tabPanes = document.querySelectorAll('.tab-pane');
    const tabBtns = document.querySelectorAll('.tab-btn');

    // 1. Esconde todos os painéis e remove active dos botões
    tabPanes.forEach(pane => pane.classList.remove('active'));
    tabBtns.forEach(btn => btn.classList.remove('active'));

    // 2. Mostra o painel selecionado e ativa o botão clicado
    document.getElementById(tabId).classList.add('active');
    evt.currentTarget.classList.add('active');
}


document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.content-item');

    // Animação de fade-in para os itens da grade
    items.forEach((item, index) => {
        item.style.opacity = "0";
        item.style.transform = "translateY(20px)";

        setTimeout(() => {
            item.style.transition = "all 0.6s ease";
            item.style.opacity = "1";
            item.style.transform = "translateY(0)";
        }, 200 * index);
    });

    // Integração com o seu showMessage do player.js
    const downloadBtn = document.querySelector('.btn-primary');
    downloadBtn.addEventListener('click', () => {
        if (typeof showMessage === 'function') {
            showMessage("SISTEMA", "Iniciando download seguro...", "fa-download");
        }
    });
});


document.querySelectorAll('.link-item').forEach(item => {
    item.addEventListener('click', () => {
        const title = item.querySelector('.link-title').innerText;

        // Se a função showMessage existir no seu player.js, ela será chamada
        if (typeof showMessage === 'function') {
            showMessage("REDIRECIONANDO", `Abrindo: ${title}`, "fa-external-link-alt");
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const block = document.querySelector('.pixel-block');

    // Verificamos se o bloco existe antes de iniciar o intervalo
    if (block) {
        // Pequeno efeito visual de "glitch" aleatório
        setInterval(() => {
            block.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
        }, 100);

        // Integração com sua mensagem do player.js
        if (typeof showMessage === 'function') {
            setTimeout(() => {
                showMessage("ERRO 404", "Coordenadas não encontradas!", "fa-ghost");
            }, 500);
        }
    }
});

document.querySelectorAll('.btn-access').forEach(button => {
    button.addEventListener('click', (e) => {
        const channelName = e.target.closest('.creator-card').querySelector('h3').innerText;

        if (typeof showMessage === 'function') {
            showMessage("EXTERNAL LINK", `Abrindo o canal de ${channelName}...`, "fa-external-link-alt");
        }
    });
});

/* ==========================================
   PORTAL DE JOGOS (ABAS PC E ACORDEÃO MOBILE)
========================================== */

// Função para PC (Alterna entre as abas laterais)
function mcPortalSwitch(event, targetId) {
    // 1. Pega os elementos do sistema
    const wrapper = event.currentTarget.closest('.mc-portal-wrapper');
    const tabs = wrapper.querySelectorAll('.mc-portal-tab');
    const contents = wrapper.querySelectorAll('.mc-portal-content');

    // 2. Remove a classe 'active' de todas as abas e de todos os conteúdos
    tabs.forEach(tab => tab.classList.remove('active'));
    contents.forEach(content => content.classList.remove('active'));

    // 3. Adiciona a classe 'active' no botão clicado e no painel correspondente
    event.currentTarget.classList.add('active');
    const targetContent = document.getElementById(targetId);
    if (targetContent) {
        targetContent.classList.add('active');
    }
}

/* ==========================================
   SLIDER DOS MODOS (HERO TRACK)
========================================== */
function moveHero(direction) {
    // 1. Encontra o container principal
    const track = document.getElementById('heroTrack');
    if (!track) return;

    // 2. Pega todos os slides dentro do track
    const slides = Array.from(track.querySelectorAll('.h-slide'));
    if (slides.length === 0) return;

    // 3. Descobre qual slide está com a classe 'active' agora
    let currentIndex = slides.findIndex(slide => slide.classList.contains('active'));

    // Fallback de segurança (se nenhum tiver active, assume o primeiro)
    if (currentIndex === -1) currentIndex = 0;

    // 4. Remove a classe active do slide atual
    slides[currentIndex].classList.remove('active');

    // 5. Calcula o índice do próximo slide (com Loop Infinito)
    let newIndex = currentIndex + direction;

    if (newIndex >= slides.length) {
        newIndex = 0; // Se passou do limite, volta pro início
    } else if (newIndex < 0) {
        newIndex = slides.length - 1; // Se recuou antes do 0, vai pro final
    }

    // 6. Adiciona a classe active no novo slide
    slides[newIndex].classList.add('active');
}

// Função para Mobile (Abre/Fecha a Sanfona)
function mcPortalToggleAcc(btnElement) {
    const currentItem = btnElement.closest('.mc-portal-content');
    const wrapper = btnElement.closest('.mc-portal-wrapper');

    // Se o item clicado já estiver aberto, ele o fecha
    if (currentItem.classList.contains('active')) {
        currentItem.classList.remove('active');
    }
    // Se estiver fechado, fecha os outros e abre o clicado
    else {
        // Opcional: Fecha todos os outros acordeões antes de abrir o novo
        const allItems = wrapper.querySelectorAll('.mc-portal-content');
        allItems.forEach(item => item.classList.remove('active'));

        // Abre o item que foi clicado
        currentItem.classList.add('active');
    }
}

function toggleAccordion(btn) {
    const parent = btn.parentElement;
    const isActive = parent.classList.contains("active");

    // Fecha os outros (Estilo Industrial)
    document.querySelectorAll('.hub-content').forEach(item => item.classList.remove('active'));

    if (!isActive) parent.classList.add("active");
}

// NOVO: Função para garantir que comece fechado no Mobile
function initHub() {
    if (window.innerWidth <= 768) {
        document.querySelectorAll('.hub-content').forEach(item => {
            item.classList.remove('active');
        });
    }
}

// Executa ao carregar e ao redimensionar
window.addEventListener('load', initHub);
window.addEventListener('resize', initHub);

const ZerasCountEngine = {
    init() {
        const targets = document.querySelectorAll('.count-me');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animate(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        targets.forEach(t => observer.observe(t));
    },

    animate(el) {
        const target = parseFloat(el.getAttribute('data-target'));
        const unit = el.getAttribute('data-unit') || "";
        const isDecimal = target % 1 !== 0; // Deteta se é GB/MB ou Inteiro

        const duration = 2000;
        const start = performance.now();

        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            let current = progress * target;

            if (isDecimal) {
                // Formatação para GB/MB: 2 casas decimais
                el.innerText = `${current.toFixed(2)} ${unit}`;
            } else {
                // Formatação para Inteiros: Sem decimais e com ponto de milhar
                el.innerText = Math.floor(current).toLocaleString('pt-BR') + unit;
            }

            if (progress < 1) requestAnimationFrame(step);
            else el.innerText = isDecimal ? `${target.toFixed(2)} ${unit}` : target.toLocaleString('pt-BR') + unit;
        };

        requestAnimationFrame(step);
    }
};
document.addEventListener('DOMContentLoaded', () => ZerasCountEngine.init());


function toggleAccordion(btn) {
    const accordion = btn.closest('.f-accordion');
    const icon = btn.querySelector('i');

    // Alterna estado
    const isActive = accordion.classList.toggle('active');

    // Troca ícone
    if (isActive) {
        icon.classList.replace('fa-plus', 'fa-minus');
    } else {
        icon.classList.replace('fa-minus', 'fa-plus');
    }
}

// Resete Mobile: Inicia fechado
if (window.innerWidth <= 768) {
    document.querySelectorAll('.f-accordion').forEach(acc => acc.classList.remove('active'));
}


/**
 * ZERA'S CRAFT - HERO ENGINE
 * Troca imagem do banner, textos e botão dinamicamente.
 */
function heroSwitcher(element) {
    const banner = document.getElementById('mainBanner');
    const title = document.getElementById('heroTitle');
    const desc = document.getElementById('heroDesc');
    const btn = document.getElementById('heroBtn'); // Captura o botão
    const thumbs = document.querySelectorAll('.t-box');

    // 1. Efeito visual suave na troca de imagem
    banner.style.opacity = '0.7';
    setTimeout(() => {
        banner.src = element.querySelector('img').src;
        banner.style.opacity = '1';
    }, 150);

    // 2. Atualiza textos do card estático
    title.innerText = element.getAttribute('data-title');
    desc.innerText = element.getAttribute('data-desc');

    // 3. Atualiza o Botão (Link e Texto) preservando a setinha
    btn.href = element.getAttribute('data-link');
    btn.innerHTML = `${element.getAttribute('data-btn-text')} <i class="fas fa-chevron-right"></i>`;

    // 4. Gerencia destaque visual (borda verde nas thumbs)
    thumbs.forEach(t => t.classList.remove('active'));
    element.classList.add('active');
}

/* RANKING */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.t-row-elite').forEach((row, i) => {
        const nick = row.getAttribute('data-nick');
        if (nick) {
            // Carrega skin e preserva o texto original (Mixed-Case)
            row.querySelector('.xbox-head').src = `https://mc-heads.net/avatar/${nick}/64`;
            row.querySelector('.nick-txt').innerText = nick;
        }

        // Revelação Industrial
        row.style.opacity = "0";
        setTimeout(() => {
            row.style.transition = "all 0.5s ease";
            row.style.opacity = "1";
        }, i * 80);
    });
});

function handleEliteTip(btn, event) {
    const row = btn.closest('.t-row-elite');
    const tooltip = document.getElementById('eliteTooltip');
    const isMobile = window.innerWidth <= 768;

    // Injeção de Dados Real
    document.getElementById('ttUser').innerText = row.getAttribute('data-nick');
    document.getElementById('ttDesc').innerText = row.getAttribute('data-bio');

    tooltip.style.display = "block";

    if (!isMobile) {
        // PC: Posicionamento Dinâmico
        tooltip.style.left = (event.pageX + 20) + "px";
        tooltip.style.top = (event.pageY + 20) + "px";
    }
    // Mobile: O CSS cuida do centro (fixed)
    event.stopPropagation();
}

/* ===================================================================
   HUB DE JOGOS (CONTROLES DESKTOP E MOBILE)
=================================================================== */

// 1. Função para o Desktop (Cliques na Barra Lateral)
function openHub(event, gameId) {
    if (window.innerWidth > 768) {
        // Remove a classe 'active' de todos os botões laterais
        const links = document.querySelectorAll('.tab-link');
        links.forEach(link => link.classList.remove('active'));

        // Remove a classe 'active' de todos os conteúdos
        const contents = document.querySelectorAll('.hub-content');
        contents.forEach(content => content.classList.remove('active'));

        // Adiciona a classe 'active' no botão clicado e no conteúdo alvo
        event.currentTarget.classList.add('active');
        document.getElementById(gameId).classList.add('active');
    }
}

// 2. Função EXCLUSIVA para o Mobile do Hub (Cliques no Acordeão)
function toggleHubAccordion(buttonElement) {
    // Pega o contêiner pai (.hub-content) do botão clicado
    const currentContent = buttonElement.closest('.hub-content');

    // Fechar as outras abas ao abrir uma nova (Sanfona)
    const allContents = document.querySelectorAll('.hub-content');
    allContents.forEach(content => {
        if (content !== currentContent) {
            content.classList.remove('active');
        }
    });

    // Alterna a classe 'active' no elemento clicado para abrir/fechar
    currentContent.classList.toggle('active');
}

function closeEliteTip() {
    const eliteTip = document.getElementById('elite-tip'); // Substitua pelo ID real que estiver no seu código
    if (eliteTip) { // <- Essa é a proteção! Só executa se o elemento existir na página
        eliteTip.style.display = 'none';
    }
}

// Segurança: Fecha ao clicar fora do tooltip
document.addEventListener('click', (e) => {
    // Só chama a função se não der erro
    if (typeof closeEliteTip === 'function') {
        closeEliteTip();
    }
});


/* ==========================================
   1. CONTROLE DAS ABAS (Com Auto-Scroll no Mobile)
========================================== */
function switchInnerTab(evt, targetId) {
    evt.preventDefault();
    const section = evt.currentTarget.closest('.game-section');

    // Desativa abas e painéis
    section.querySelectorAll('.nav-tab-btn').forEach(tab => tab.classList.remove('active'));
    section.querySelectorAll('.content-panel').forEach(panel => panel.classList.remove('active'));

    // Ativa clicados
    evt.currentTarget.classList.add('active');
    const targetPanel = document.getElementById(targetId);
    if (targetPanel) {
        targetPanel.classList.add('active');
    }

    // Auto-centraliza a aba clicada na tela (ótimo para mobile)
    evt.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

/* ==========================================
   2. SISTEMA DA GALERIA DE IMAGENS (Com Auto-Scroll)
========================================== */
function setGalleryImg(evt, newSrc) {
    const galleryBox = evt.currentTarget.closest('.gallery-container');
    const mainImg = galleryBox.querySelector('#active-gallery-img');

    // Troca a foto gigante
    mainImg.src = newSrc;

    // Atualiza a borda azul
    galleryBox.querySelectorAll('.thumb-item').forEach(thumb => thumb.classList.remove('active'));
    evt.currentTarget.classList.add('active');
}

// Botão de Próxima Foto
function nextGalleryImg(evt) {
    const galleryBox = evt.currentTarget.closest('.gallery-container');
    const thumbs = Array.from(galleryBox.querySelectorAll('.thumb-item'));

    // Identifica a atual e calcula a próxima
    let currentIndex = thumbs.findIndex(thumb => thumb.classList.contains('active'));
    let nextIndex = (currentIndex + 1) % thumbs.length;

    // Aciona o clique na próxima (isso já puxa a rolagem automática)
    thumbs[nextIndex].click();
}

/* ==========================================
   3. BOTÃO DE EXPANDIR TEXTO ("Mostrar mais")
========================================== */
function toggleDescription(evt, btnElement) {
    evt.preventDefault();

    const infoCard = btnElement.closest('.info-card');
    const textContainer = infoCard.querySelector('.card-body');
    const btnText = btnElement.querySelector('span');

    if (textContainer.classList.contains('text-collapsed')) {
        textContainer.classList.remove('text-collapsed');
        textContainer.classList.add('text-expanded');
        btnElement.classList.add('active');
        btnText.innerText = "Mostrar menos";
    } else {
        textContainer.classList.remove('text-expanded');
        textContainer.classList.add('text-collapsed');
        btnElement.classList.remove('active');
        btnText.innerText = "Mostrar mais";
    }
}


/* ==========================================
   BANNER DE CHECKOUT INTELIGENTE (SCROLL)
========================================== */
document.addEventListener('DOMContentLoaded', () => {
    const banner = document.getElementById('checkout-banner');
    const anchor = document.getElementById('checkout-anchor');

    if (!banner || !anchor) return;

    window.addEventListener('scroll', () => {
        // Pega a posição da âncora invisível em relação ao topo da janela
        const anchorRect = anchor.getBoundingClientRect();

        // Verifica se é mobile (usando a mesma medida do seu CSS)
        const isMobile = window.innerWidth <= 1024;

        // No PC, o header tem 70px, então ativamos quando a âncora chegar no 70
        // No Mobile, o header tem 60px.
        const triggerPoint = isMobile ? 60 : 70;

        if (anchorRect.top <= triggerPoint) {
            // Passou do ponto: GRUDAR!

            // Compensa a altura do banner na âncora para a página não "pular"
            anchor.style.height = banner.offsetHeight + 'px';

            if (isMobile) {
                banner.classList.add('is-fixed-mob');
                banner.classList.remove('is-fixed-pc');
            } else {
                banner.classList.add('is-fixed-pc');
                banner.classList.remove('is-fixed-mob');
            }
        } else {
            // Voltou para cima: DESGRUDAR!
            banner.classList.remove('is-fixed-pc', 'is-fixed-mob');
            anchor.style.height = '0px';
        }
    });
});


/* ==========================================
   SHOWCASE DE RECURSOS - MOTOR DE TROCA VIA URL
========================================== */
function changeFeatureImage(clickedTab) {
    const container = clickedTab.closest('.feat-container');
    const mainImg = container.querySelector('#feat-main-img');
    const allTabs = container.querySelectorAll('.feat-tab');

    // 1. Evita recarregar se a aba já estiver ativa
    if (clickedTab.classList.contains('active')) return;

    // 2. Captura a URL do atributo style
    // O navegador retorna algo como: url("assets/images/...")
    let bgUrl = clickedTab.style.backgroundImage;

    // 3. Limpa a string para pegar apenas o caminho do arquivo
    let cleanPath = bgUrl.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');

    // 4. Efeito Visual de Fade Out
    mainImg.style.opacity = '0';

    setTimeout(() => {
        // 5. Aplica o novo caminho no SRC da imagem
        mainImg.src = cleanPath;

        // 6. Atualiza as classes visuais
        allTabs.forEach(tab => tab.classList.remove('active'));
        clickedTab.classList.add('active');

        // 7. Fade In
        mainImg.style.opacity = '1';
    }, 200);
}

/* ==========================================
   AUTOLOADER DE NAVEGAÇÃO CORRIGIDO
========================================== */
document.addEventListener("DOMContentLoaded", () => {
    const navPlaceholder = document.getElementById('nav-placeholder');

    if (navPlaceholder) {
        // Tentamos carregar da raiz. Se falhar (em subpastas), tentamos subir um nível.
        fetch('nav.html')
            .then(response => {
                if (!response.ok) return fetch('../nav.html'); // Busca na pasta anterior se não achar na atual
                return response;
            })
            .then(response => response.text())
            .then(htmlData => {
                navPlaceholder.innerHTML = htmlData;
            })
            .catch(error => console.error("Erro ao carregar nav.html:", error));
    }
});



/**
 * ZERA'S CRAFT - MOTOR DE NOTÍCIAS
 * Gerencia a entrada suave e as transições dos cards
 */
document.addEventListener("DOMContentLoaded", () => {
    const newsCards = document.querySelectorAll(".mc-news-card");

    const newsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Delay reduzido para 50ms (efeito quase instantâneo)
                setTimeout(() => {
                    entry.target.classList.add("reveal-active");
                }, index * 50);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    newsCards.forEach(card => newsObserver.observe(card));
});

let currentOffset = 0;

function setDiscovery(el) {
    const mainImg = document.getElementById('discovery-img');
    const mainCaption = document.getElementById('discovery-caption');
    const allThumbs = document.querySelectorAll('.d-thumb');

    // Extrai os dados do HTML
    let bgUrl = el.style.backgroundImage;
    let path = bgUrl.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
    let caption = el.getAttribute('data-caption');

    // Troca Visual
    mainImg.style.opacity = '0';
    setTimeout(() => {
        mainImg.src = path;
        mainCaption.innerText = caption;
        mainImg.style.opacity = '1';
    }, 200);

    // Classe Ativa
    allThumbs.forEach(t => t.classList.remove('active'));
    el.classList.add('active');
}

function slideTrack(direction) {
    const track = document.getElementById('discoveryTrack');
    const viewportWidth = document.querySelector('.discovery-viewport').offsetWidth;
    const itemWidth = 160 + 12; // largura + gap
    const maxScroll = track.scrollWidth - viewportWidth;

    currentOffset += (direction * itemWidth);

    // Limites de segurança
    if (currentOffset < 0) currentOffset = 0;
    if (currentOffset > maxScroll) currentOffset = maxScroll;

    track.style.transform = `translateX(-${currentOffset}px)`;
}


function toggleExplorer(card) {
    // Opcional: Fecha os outros cards ao abrir um novo (Comente se quiser abrir vários)
    document.querySelectorAll('.explorer-card').forEach(c => {
        if (c !== card) c.classList.remove('active');
    });

    // Alterna o estado do card clicado
    card.classList.toggle('active');
}

function toggleMcAcc(element) {
    element.classList.toggle('active');
}


/* ==========================================
   SISTEMA DE GALERIA (LIGHTBOX / TELA CHEIA)
========================================== */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Cria o Modal no fundo do site dinamicamente
    const lightboxHTML = `
        <div class="gallery-lightbox" id="galleryLightbox">
            <span class="lightbox-close" id="lightboxClose">&times;</span>
            <img class="lightbox-img" id="lightboxImg" src="">
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);

    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeBtn = document.getElementById('lightboxClose');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // 2. Abrir a imagem em tela cheia
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img) {
                lightboxImg.src = img.src; // Copia a foto do card pro modal
                lightbox.classList.add('active');

                // Trava a rolagem do site usando sua função existente (se houver)
                if (typeof lockScroll === 'function') {
                    lockScroll();
                } else {
                    document.body.style.overflow = 'hidden';
                }
            }
        });
    });

    // 3. Fechar a imagem (Função central)
    function closeGallery() {
        lightbox.classList.remove('active');

        // Limpa o src depois da animação terminar para não piscar
        setTimeout(() => { lightboxImg.src = ""; }, 300);

        // Destrava a rolagem do site
        if (typeof unlockScroll === 'function') {
            unlockScroll();
        } else {
            document.body.style.overflow = '';
        }
    }

    // 4. Gatilhos para fechar
    closeBtn.addEventListener('click', closeGallery); // Clicando no "X"

    lightbox.addEventListener('click', (e) => { // Clicando fora da imagem
        if (e.target === lightbox) {
            closeGallery();
        }
    });

    document.addEventListener('keydown', (e) => { // Apertando ESC
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeGallery();
        }
    });
});


/* ==========================================
   SISTEMA DE PLAYER DE VÍDEO INTELIGENTE
========================================== */
document.addEventListener('DOMContentLoaded', () => {
    const videoFrames = document.querySelectorAll('.video-frame');

    videoFrames.forEach(frame => {
        frame.addEventListener('click', function () {
            // Verifica se o vídeo já está tocando
            if (this.classList.contains('playing')) return;

            // Pega o ID do vídeo do atributo HTML
            const videoId = this.getAttribute('data-video-id');

            if (videoId) {
                this.classList.add('playing');

                // Cria o iframe do YouTube dinamicamente
                const iframe = document.createElement('iframe');
                // Adiciona autoplay e oculta elementos desnecessários do Youtube
                iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&modestbranding=1`);
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
                iframe.setAttribute('allowfullscreen', 'true');

                // Limpa a miniatura/botão e insere o vídeo tocando
                this.innerHTML = '';
                this.appendChild(iframe);
            }
        });
    });
});

function toggleAccordion(button) {
    // Alterna a classe 'active' no botão que foi clicado
    button.classList.toggle("active");
}

/* ==========================================
   MÓDULO: STATUS DO DISCORD & METAS (+100%)
========================================== */
document.addEventListener('DOMContentLoaded', () => {
    const inviteCode = 'GYGVBqGEwP';

    // ==========================================
    // 1. FUNÇÃO DE ANIMAÇÃO GLOBAL
    // ==========================================
    function animateValue(obj, start, end, duration, isPercent = false, suffix = '') {
        if (!obj) return;
        let startTimestamp = null;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);

            // Se for porcentagem e passar de 100, exibe o + (Ex: +105%)
            let prefix = (isPercent && current > 100) ? '+' : '';

            obj.innerText = isPercent ? prefix + current + '%' : current.toLocaleString('pt-BR') + suffix;

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                let finalPrefix = (isPercent && end > 100) ? '+' : '';
                obj.innerText = isPercent ? finalPrefix + Math.floor(end) + '%' : Math.floor(end).toLocaleString('pt-BR') + suffix;
            }
        };
        window.requestAnimationFrame(step);
    }

    // ==========================================
    // 2. SISTEMA INDEPENDENTE: STATUS
    // ==========================================
    function initStatusDisplay(totalMembers) {
        const statusCountEl = document.getElementById('new-status-count');
        if (statusCountEl) {
            animateValue(statusCountEl, 0, totalMembers, 1500, false, ' Membros Totais');
        }
    }

    // ==========================================
    // 3. SISTEMA INDEPENDENTE: METAS
    // ==========================================
    function initGoalsDisplay(totalMembers) {
        const membersCountEl = document.getElementById('new-members-count');
        const objectiveEl = document.getElementById('new-objective-val');
        const progressBar = document.getElementById('new-goal-fill');
        const progressText = document.getElementById('new-percent-text');

        // A. Anima o número de membros solto
        if (membersCountEl) {
            animateValue(membersCountEl, 0, totalMembers, 1500);
        }

        // B. Lógica da Barra de Progresso
        if (objectiveEl && progressBar && progressText) {
            let rawText = objectiveEl.textContent || "1";
            let objectiveVal = parseFloat(rawText.replace(/\D/g, '')) || 1;

            let realPercentage = (totalMembers / objectiveVal) * 100;
            if (realPercentage < 0) realPercentage = 0;

            let visualPercentage = realPercentage > 100 ? 100 : realPercentage;

            setTimeout(() => {
                progressBar.style.width = visualPercentage + '%';
                animateValue(progressText, 0, realPercentage, 1500, true);
            }, 300);
        }
    }

    // ==========================================
    // 4. MOTOR PRINCIPAL (BUSCA DE DADOS)
    // ==========================================
    async function fetchDiscordData() {
        try {
            const response = await fetch(`https://discord.com/api/v9/invites/${inviteCode}?with_counts=true`);

            if (!response.ok) throw new Error("A API do Discord bloqueou a consulta.");

            const data = await response.json();
            const totalMembers = data.approximate_member_count || 0;

            // Dispara os dois sistemas simultaneamente, mas separados
            initStatusDisplay(totalMembers);
            initGoalsDisplay(totalMembers);

        } catch (error) {
            console.error("Zera's Craft -> Erro ao buscar dados do Discord:", error);

            // Fallbacks de segurança em caso de erro na internet do jogador
            const statusCountEl = document.getElementById('new-status-count');
            const membersCountEl = document.getElementById('new-members-count');

            if (statusCountEl) statusCountEl.innerText = "Servidor Online";
            if (membersCountEl) membersCountEl.innerText = "---";
        }
    }

    // Dá o pontapé inicial
    fetchDiscordData();
});


/* ==========================================
   CONTROLE DO MODAL
========================================== */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Trava o scroll do fundo
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Destrava o scroll
    }
}

// Fechar clicando fora da caixa (no fundo escuro)
window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal-overlay')) {
        event.target.classList.remove('active');
        document.body.style.overflow = '';
    }
});


/* ==========================================
   SIMULADOR DE CARREGAMENTO (LOADERS)
========================================== */
document.addEventListener('DOMContentLoaded', () => {
    // Puxa as duas divs do HTML
    const loadingState = document.getElementById('loading-state');
    const readyState = document.getElementById('ready-state');

    // Se os elementos existirem na tela, inicia a lógica
    if (loadingState && readyState) {

        // Simula um tempo de espera (Ex: 3000 milissegundos = 3 segundos)
        setTimeout(() => {

            // 1. Esconde os skeletons e o spinner
            loadingState.style.display = 'none';

            // 2. Mostra o conteúdo real
            readyState.style.display = 'block';

            // 3. Adiciona a animação suave para aparecer bonito
            readyState.classList.add('fade-in-content');

        }, 3000); // <- Mude este número para o tempo que desejar
    }
});

/* ==========================================
   CONTROLE DO DROPDOWN (MOBILE)
========================================== */
function toggleDropdown(element) {
    // Só aplica o clique se for tela de celular (O PC usa o hover do CSS)
    if (window.innerWidth <= 768) {
        element.classList.toggle('active');
    }
}

// Fecha o dropdown se o usuário tocar fora dele
window.addEventListener('click', function (event) {
    if (!event.target.closest('.dropdown')) {
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(drop => {
            drop.classList.remove('active');
        });
    }
});

/* ==========================================
   SISTEMA DE BANNER (MEMÓRIA LOCAL)
========================================== */
// Função acionada ao clicar no botão "Entendi"
function fecharESalvarBanner(bannerId) {
    const banner = document.getElementById(bannerId);

    if (banner) {
        // Faz uma animação de descida antes de sumir
        banner.style.opacity = '0';
        banner.style.transform = 'translateY(20px)';

        // Espera a animação terminar (400ms) e remove da tela
        setTimeout(() => {
            banner.style.display = 'none';
        }, 400);
    }
}