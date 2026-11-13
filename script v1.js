function copiarIP(textoIP) {
    navigator.clipboard.writeText(textoIP).then(() => {
        alert('IP copiado para a área de transferência: ' + textoIP);
    }).catch(err => {
        console.error('Erro ao copiar IP: ', err);
    });
}

function toggleSidebarSection(btn) {
    btn.classList.toggle('collapsed');
    const container = btn.nextElementSibling;
    container.classList.toggle('collapsed');
}

function toggleVersionsDropdown(bar) {
    bar.classList.toggle('open');
    const content = document.getElementById('versionsContent');
    content.classList.toggle('open');
}

function toggleMoreModal(e) {
    e.stopPropagation();
    const modal = document.getElementById('moreModal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

window.onclick = function () {
    const modal = document.getElementById('moreModal');
    if (modal) modal.style.display = 'none';
}

function filterPageStrings() {
    const input = document.getElementById('searchInput').value.toLowerCase().trim();
    const sections = document.querySelectorAll('.searchable-section');

    sections.forEach(section => {
        const textContent = section.textContent.toLowerCase();
        if (input === '' || textContent.includes(input)) {
            section.style.display = '';
        } else {
            section.style.display = 'none';
        }
    });
}

/* Script para gerenciar a seleção de abas superiores (Acende em branco e destaca) */
function setActiveNav(clickedBtn) {
    const navButtons = document.querySelectorAll('.header-left-group .wiki-header-btn, .header-right-group .wiki-header-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));
    clickedBtn.classList.add('active');
}








let isMpAnimating = false;

function slideMarketplace(direction) {
    if (isMpAnimating) return; // Impede cliques múltiplos durante a animação
    isMpAnimating = true;

    const track = document.getElementById('marketplaceTrack');
    const cards = track.querySelectorAll('.mp-card');
    if (cards.length === 0) return;

    const cardWidth = cards[0].offsetWidth + 14; // largura do card + gap

    // Torna a transição mais suave e fluida (0.4s)
    track.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
    track.style.transform = `translateX(${direction < 0 ? cardWidth : -cardWidth}px)`;

    setTimeout(() => {
        track.style.transition = 'none';
        track.style.transform = 'translateX(0)';

        if (direction > 0) {
            // Avançou: joga o primeiro card para o final
            track.appendChild(cards[0]);
        } else {
            // Voltou: joga o último card para o início
            track.insertBefore(cards[cards.length - 1], cards[0]);
        }

        // Libera o próximo clique após um pequeno intervalo de respiro
        setTimeout(() => {
            isMpAnimating = false;
        }, 50);

    }, 400); // Sincronizado com os 0.4s da transição CSS
}
















// Altera a imagem da thumb principal ao clicar na miniatura lateral
function changeMainThumb(cardId, imgUrl, thumbElement) {
    const mainThumb = document.getElementById(`main-thumb-${cardId}`);
    mainThumb.style.backgroundImage = `url('${imgUrl}')`;

    // Gerencia classe ativa nas miniaturas do card específico
    const sidebar = thumbElement.parentElement;
    sidebar.querySelectorAll('.timeline-thumb-item').forEach(el => el.classList.remove('active-thumb'));
    thumbElement.classList.add('active-thumb');
}

// Filtra a exibição dos grupos de cards com base no ano selecionado
function filterTimeline(year, btnElement) {
    document.querySelectorAll('.timeline-year-btn').forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');

    document.querySelectorAll('.timeline-card-group').forEach(group => {
        if (group.getAttribute('data-year') === year) {
            group.style.display = 'grid';
        } else {
            group.style.display = 'none';
        }
    });
}

// Sistema de Ler Mais / Menos dinâmico com o HTML
function toggleReadMore(textElementId, btnElement) {
    const textEl = document.getElementById(textElementId);
    const fullText = textEl.getAttribute('data-fulltext');

    if (btnElement.textContent.includes('Mostrar mais')) {
        textEl.textContent = fullText;
        btnElement.textContent = 'Mostrar menos ▴';
    } else {
        textEl.textContent = fullText.substring(0, 85) + '...';
        btnElement.textContent = 'Mostrar mais ▾';
    }
}
















function switchRealmsTab(version) {
    const btnBedrock = document.getElementById('btnBedrock');
    const btnJava = document.getElementById('btnJava');
    const tableBedrock = document.getElementById('tableBedrock');
    const tableJava = document.getElementById('tableJava');

    if (version === 'bedrock') {
        btnBedrock.classList.add('active');
        btnJava.classList.remove('active');
        tableBedrock.style.display = 'block';
        tableJava.style.display = 'none';
    } else {
        btnJava.classList.add('active');
        btnBedrock.classList.remove('active');
        tableJava.style.display = 'block';
        tableBedrock.style.display = 'none';
    }
}











// Gera partículas flutuantes dinamicamente no fundo do bloco
function createFloatingParticles() {
    const container = document.getElementById('particlesContainer');
    if (!container) return;

    const particleCount = 18; // Quantidade de partículas simultâneas

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('floating-particle');

        // Posição horizontal aleatória
        const posX = Math.random() * 100;
        // Tamanho aleatório (entre 6px e 14px para parecer bloquinhos)
        const size = Math.floor(Math.random() * 8) + 6;
        // Duração da animação aleatória (velocidade de subida)
        const duration = Math.random() * 6 + 6;
        // Atraso inicial para não subirem todas juntas
        const delay = Math.random() * 5;

        particle.style.left = `${posX}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;

        container.appendChild(particle);
    }
}

// Inicializa as partículas ao carregar o componente
window.addEventListener('DOMContentLoaded', () => {
    createFloatingParticles();
});



















// Alterna entre a aba de Downloads e a aba de Suporte
function switchTestTab(tabName, clickedBtn) {
    document.querySelectorAll('.test-tab-btn').forEach(btn => btn.classList.remove('active'));
    clickedBtn.classList.add('active');

    const downloadsContent = document.getElementById('contentDownloads');
    const suporteContent = document.getElementById('contentSuporte');

    if (tabName === 'downloads') {
        downloadsContent.style.display = 'block';
        suporteContent.style.display = 'none';
    } else {
        downloadsContent.style.display = 'none';
        suporteContent.style.display = 'block';
    }
}

// Controla a abertura e fechamento das perguntas frequentes (FAQ)
function toggleFaqAccordion(bar) {
    const item = bar.parentElement;
    item.classList.toggle('open');
}

// Filtra os artigos de suporte em tempo real conforme o usuário digita
function filterSupportArticles() {
    const input = document.getElementById('supportSearchInput').value.toLowerCase().trim();
    const list = document.getElementById('supportArticlesList');
    const items = list.getElementsByTagName('li');

    for (let i = 0; i < items.length; i++) {
        const text = items[i].textContent.toLowerCase();
        if (text.includes(input)) {
            items[i].style.display = "";
        } else {
            items[i].style.display = "none";
        }
    }
}
















// Base de dados simulada de cards de notícias
const allNewsCards = [
    { title: "GET READY TO PLAY DIMENSION CLASH!", desc: "Get ready for Dimension Clash, a fast-paced Minecraft PvP adventure...", date: "2 days ago", timestamp: 3, category: "bedrock", popularity: 85, img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop" },
    { title: "COMO USAR COMANDOS NO MINECRAFT", desc: "Caso nunca tenha jogado Minecraft antes, aqui informamos o que...", date: "3 days ago", timestamp: 2, category: "java", popularity: 40, img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop" },
    { title: "MINECRAFT PREVIEW 26.50.24", desc: "Minecraft Bedrock Edition Preview 26.50.24 Changelog details...", date: "3 days ago", timestamp: 2, category: "bedrock", popularity: 92, img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&auto=format&fit=crop" },
    { title: "MINECRAFT FOR NINTENDO SWITCH 2 IS COMING", desc: "Sound the trumpets! Minecraft arrives on Nintendo Switch 2...", date: "3 days ago", timestamp: 2, category: "community", popularity: 99, img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400&auto=format&fit=crop" },
    { title: "NETHER UPDATE OUT TODAY ON JAVA", desc: "Download Minecraft Java Edition 1.16 today!", date: "4 days ago", timestamp: 1, category: "java", popularity: 60, img: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=400&auto=format&fit=crop" },
    { title: "MINECRAFT JAVA EDITION 1.21.3", desc: "Minecraft 1.21.3 release notes and updates...", date: "4 days ago", timestamp: 1, category: "java", popularity: 50, img: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=400&auto=format&fit=crop" },
    { title: "MINECRAFT JAVA EDITION 1.21.7", desc: "Minecraft Java Edition 1.21.7 stability fixes...", date: "4 days ago", timestamp: 1, category: "java", popularity: 55, img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=400&auto=format&fit=crop" },
    { title: "MINECRAFT JAVA EDITION 1.21.9", desc: "Minecraft Java Edition 1.21.9 performance improvements...", date: "4 days ago", timestamp: 1, category: "java", popularity: 70, img: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=400&auto=format&fit=crop" },
    { title: "COMMUNITY SPOTLIGHT: EPIC BUILDS", desc: "Check out the best community creations of this month!", date: "5 days ago", timestamp: 0, category: "community", popularity: 75, img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=400&auto=format&fit=crop" }
];

let currentFilteredCards = [...allNewsCards];
let currentPage = 1;
const itemsPerPage = 4; // 4 cards por página para demonstrar a paginação < 1 de 2 >
let currentSortType = 'recent';

// Abre/fecha menu de ordenação
function toggleSortMenu() {
    const menu = document.getElementById('sortMenuDropdown');
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}

// Altera a ordenação
function changeSort(type, label) {
    currentSortType = type;
    document.getElementById('currentSortLabel').textContent = label;
    document.getElementById('sortMenuDropdown').style.display = 'none';

    if (type === 'recent') {
        currentFilteredCards.sort((a, b) => b.timestamp - a.timestamp);
    } else if (type === 'oldest') {
        currentFilteredCards.sort((a, b) => a.timestamp - b.timestamp);
    } else if (type === 'popular') {
        currentFilteredCards.sort((a, b) => b.popularity - a.popularity);
    }

    currentPage = 1;
    renderNews();
}

// Abre/fecha modal de filtros
function toggleFilterModal() {
    const modal = document.getElementById('filterModalBox');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

// Aplica os filtros dos checkboxes
function applyFilters() {
    const checkboxes = document.querySelectorAll('.news-filter-chk');
    const activeCategories = Array.from(checkboxes).filter(chk => chk.checked).map(chk => chk.value);

    currentFilteredCards = allNewsCards.filter(card => activeCategories.includes(card.category));

    // Reaplica ordenação atual
    changeSort(currentSortType, document.getElementById('currentSortLabel').textContent);
    toggleFilterModal();
}

// Renderiza os cards e paginação
function renderNews() {
    const grid = document.getElementById('newsCardsGrid');
    const counter = document.getElementById('newsCounter');

    counter.textContent = `${currentFilteredCards.length} Cards`;

    const totalPages = Math.ceil(currentFilteredCards.length / itemsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    document.getElementById('totalPagesSpan').textContent = totalPages;

    const start = (currentPage - 1) * itemsPerPage;
    const paginatedItems = currentFilteredCards.slice(start, start + itemsPerPage);

    grid.innerHTML = '';
    paginatedItems.forEach(card => {
        grid.innerHTML += `
            <div class="news-card-item">
                <div class="news-card-thumb" style="background-image: url('${card.img}');"></div>
                <div class="news-card-body">
                    <h3 class="news-card-title">${card.title}</h3>
                    <p class="news-card-desc">${card.desc}</p>
                    <span class="news-card-date">${card.date}</span>
                </div>
            </div>
        `;
    });

    renderPaginationNumbers(totalPages);
}

// Renderiza os números de páginas
function renderPaginationNumbers(totalPages) {
    const container = document.getElementById('pageNumbersContainer');
    container.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        container.innerHTML += `
            <button class="page-num-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>
        `;
    }
}

function goToPage(page) {
    currentPage = page;
    renderNews();
}

function changePage(direction) {
    const totalPages = Math.ceil(currentFilteredCards.length / itemsPerPage) || 1;
    currentPage += direction;
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;
    renderNews();
}

// Inicializa na carga da página
window.addEventListener('DOMContentLoaded', () => {
    changeSort('recent', 'MOST RECENT');
});










// Abre o modal pegando apenas a imagem
function openImageModal(cardElement) {
    const imgDiv = cardElement.querySelector('.community-img');
    const bgStyle = window.getComputedStyle(imgDiv).backgroundImage;
    const imageUrl = bgStyle.slice(5, -2); // Remove o 'url("' e '")'

    const modal = document.getElementById('imageViewerModal');
    const modalImg = document.getElementById('modalExpandedImg');

    modalImg.src = imageUrl;
    modal.classList.add('active');
}

// Fecha o modal suavemente
function closeImageModal() {
    const modal = document.getElementById('imageViewerModal');
    modal.classList.remove('active');
}

// Atalho da tecla ESC para fechar
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeImageModal();
    }
});











async function updateDiscordGoal() {
    const serverId = '1390120239588577482';

    const goalElement = document.getElementById('discordGoalTarget');
    const targetGoal = goalElement ? parseInt(goalElement.innerText) : 200;

    const membersCountEl = document.getElementById('discordMembersCount');
    const progressBarFill = document.getElementById('goalProgressBarFill');
    const tooltipBadge = document.getElementById('goalTooltipBadge');
    const percentText = document.getElementById('goalPercentText');

    let totalMembers = 100; // Valor padrão de fallback

    try {
        const response = await fetch(`https://discord.com/api/guilds/${serverId}/widget.json`);
        if (response.ok) {
            const data = await response.json();
            if (data.presence_count) {
                totalMembers = data.presence_count;
            }
        }
    } catch (error) {
        console.log("Usando dados locais para a meta.");
    }

    if (membersCountEl) {
        membersCountEl.innerText = totalMembers;
    }

    // Cálculo da porcentagem (permite ultrapassar 100% se passar do objetivo)
    let rawPercentage = (totalMembers / targetGoal) * 100;
    let displayPercentage = Math.round(rawPercentage);

    // Trava visual da barra de progresso em 100%, mas exibe o número real no texto (ex: 105%)
    let fillWidth = Math.min(displayPercentage, 100);

    if (progressBarFill) {
        progressBarFill.style.width = fillWidth + '%';
    }

    if (percentText) {
        percentText.innerText = displayPercentage + '%';
    }

    if (tooltipBadge) {
        tooltipBadge.style.left = fillWidth + '%';
    }
}

document.addEventListener('DOMContentLoaded', updateDiscordGoal);









// Função para abrir o modal recebendo Título e Texto dinamicamente
function abrirModal(titulo, texto) {
    const modal = document.getElementById('wikiAnimatedModal');
    const titleEl = document.getElementById('modalTitle');
    const textEl = document.getElementById('modalText');

    if (titleEl) titleEl.innerText = titulo;
    if (textEl) textEl.innerHTML = texto; // Permite usar tags HTML como <br>

    if (modal) {
        modal.classList.add('open');
    }
}

// Função para fechar o modal
function fecharModal() {
    const modal = document.getElementById('wikiAnimatedModal');
    if (modal) {
        modal.classList.remove('open');
    }
}

// Fecha se clicar no fundo escuro fora do modal
function fecharModalFora(event) {
    const modal = document.getElementById('wikiAnimatedModal');
    if (event.target === modal) {
        fecharModal();
    }
}










// Função para abrir o card lateral dinamicamente
function abrirCardLateral(titulo, texto) {
    const sideCard = document.getElementById('wikiSideCard');
    const titleEl = document.getElementById('sideCardTitle');
    const textEl = document.getElementById('sideCardText');

    if (titleEl) titleEl.innerText = titulo;
    if (textEl) textEl.innerHTML = texto; // Permite usar <br>

    if (sideCard) {
        sideCard.classList.add('open');
    }
}

// Função para fechar o card lateral
function fecharCardLateral() {
    const sideCard = document.getElementById('wikiSideCard');
    if (sideCard) {
        sideCard.classList.remove('open');
    }
}










function mudarBannerHero(element) {
    // Evita reiniciar se clicar na thumb já ativa
    if (element.classList.contains('active')) return;

    // Remove a classe 'active' de todas as miniaturas e adiciona na nova
    const thumbs = document.querySelectorAll('.hero-thumb-item');
    thumbs.forEach(thumb => thumb.classList.remove('active'));
    element.classList.add('active');

    // Pega os dados dos atributos data-*
    const bgUrl = element.getAttribute('data-bg');
    const titulo = element.getAttribute('data-titulo');
    const desc = element.getAttribute('data-desc');
    const btnText = element.getAttribute('data-btntext');

    const heroSection = document.getElementById('heroShowcase');
    const infoCard = document.querySelector('.hero-info-card');

    if (infoCard) {

        setTimeout(() => {
            // 2. Altera a imagem de fundo do banner
            if (heroSection) {
                heroSection.style.backgroundImage = `url('${bgUrl}')`;
            }

            // 3. Atualiza os textos e o botão do card
            const titleEl = document.getElementById('heroTitle');
            const descEl = document.getElementById('heroDesc');
            const btnEl = document.getElementById('heroBtn');

            if (titleEl) titleEl.innerText = titulo;
            if (descEl) descEl.innerText = desc;
            if (btnEl) btnEl.innerHTML = `${btnText} <span>›</span>`;

            // 4. Retorna com o card suavemente (fade-in)
            infoCard.classList.remove('fade-out');
        }, 10); // Tempo sincronizado com o CSS
    }
}









// Função para trocar o vídeo do player na versão desktop
function mudarVideoDesktop(element, videoId) {
    // Remove active de todos os itens da sidebar
    const items = document.querySelectorAll('.sidebar-item');
    items.forEach(item => item.classList.remove('active'));

    // Adiciona active no item clicado
    element.classList.add('active');

    // Atualiza o iframe do YouTube com o novo ID do vídeo
    const iframe = document.getElementById('desktopYoutubePlayer');
    if (iframe) {
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
}

// Função para abrir/fechar as seções expansíveis no mobile (Acordeão)
function toggleAccordion(header) {
    const item = header.parentElement;
    const content = item.querySelector('.accordion-content');

    // Fecha os outros abertos (opcional)
    const allItems = document.querySelectorAll('.accordion-item');
    allItems.forEach(acc => {
        if (acc !== item) {
            acc.classList.remove('open');
            acc.querySelector('.accordion-content').style.maxHeight = null;
        }
    });

    // Alterna o atual
    item.classList.toggle('open');
    if (item.classList.contains('open')) {
        content.style.maxHeight = content.scrollHeight + 'px';
    } else {
        content.style.maxHeight = null;
    }
}







function rolarColecionaveis(direcao) {
    const grid = document.querySelector('.collectibles-grid');
    if (!grid) return;
    const scrollAmount = 240;
    if (direcao === 'left') {
        grid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        grid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}








document.addEventListener("DOMContentLoaded", () => {
    iniciarCarrosselInfinito();
});

let isCarouselMoving = false;

function iniciarCarrosselInfinito() {
    const track = document.getElementById('introCarouselTrack');
    if (!track) return;

    // Centraliza o segundo item inicialmente para deixar 1 à esquerda e 1 à direita
    const cards = Array.from(track.children);
    if (cards.length >= 3) {
        // Move o último item para o início para que o Card 2 fique no centro
        track.insertBefore(track.lastElementChild, track.firstElementChild);
    }
    atualizarPosicaoCentro(false);
}

function atualizarPosicaoCentro(animar = true) {
    const track = document.getElementById('introCarouselTrack');
    const viewport = document.querySelector('.infinite-carousel-viewport');
    if (!track || !viewport) return;

    const cards = Array.from(track.children);
    const gap = 32; // Mesmo valor do gap no CSS
    const cardWidth = cards[0].offsetWidth;
    const viewportWidth = viewport.offsetWidth;

    // Calcula o deslocamento exato para centralizar o 2º card visível (índice 1)
    const centerIndex = 1;
    const offset = (viewportWidth / 2) - (cardWidth / 2) - (centerIndex * (cardWidth + gap));

    track.style.transition = animar ? 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)' : 'none';
    track.style.transform = `translateX(${offset}px)`;

    // Destaca apenas o card que está no centro
    cards.forEach((card, idx) => {
        if (idx === centerIndex) {
            card.classList.add('center-active');
        } else {
            card.classList.remove('center-active');
        }
    });
}

function moverCarrosselInfinito(direcao) {
    if (isCarouselMoving) return;
    isCarouselMoving = true;

    const track = document.getElementById('introCarouselTrack');
    const viewport = document.querySelector('.infinite-carousel-viewport');
    if (!track || !viewport) return;

    const cards = Array.from(track.children);
    const gap = 32;
    const cardWidth = cards[0].offsetWidth;
    const viewportWidth = viewport.offsetWidth;
    const step = cardWidth + gap;

    // Deslocamento base atual (índice 1 no centro)
    const baseOffset = (viewportWidth / 2) - (cardWidth / 2) - step;

    track.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';

    if (direcao === 1) {
        // Avança para a direita (desliza para a esquerda)
        track.style.transform = `translateX(${baseOffset - step}px)`;

        // Atualiza visualmente o próximo card que vai para o centro
        cards.forEach((c, i) => c.classList.toggle('center-active', i === 2));

        setTimeout(() => {
            track.style.transition = 'none';
            track.appendChild(track.firstElementChild); // Joga o primeiro para o final
            track.style.transform = `translateX(${baseOffset}px)`;
            isCarouselMoving = false;
        }, 400);

    } else {
        // Volta para a esquerda: prepara o último item no início sem animação antes de deslizar
        track.style.transition = 'none';
        track.insertBefore(track.lastElementChild, track.firstElementChild);
        track.style.transform = `translateX(${baseOffset - step}px)`;

        // Força o navegador a aplicar a posição antes de animar de volta ao centro
        void track.offsetWidth;

        track.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
        track.style.transform = `translateX(${baseOffset}px)`;

        const updatedCards = Array.from(track.children);
        updatedCards.forEach((c, i) => c.classList.toggle('center-active', i === 1));

        setTimeout(() => {
            isCarouselMoving = false;
        }, 400);
    }
}

// Recalcula o alinhamento central se a tela for redimensionada
window.addEventListener('resize', () => atualizarPosicaoCentro(false));











// Array com os links das imagens da galeria
const galleryImages = [
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop'
];

let currentLightboxIndex = 0;

function abrirLightbox(index) {
    currentLightboxIndex = index;
    const modal = document.getElementById('wikiLightboxModal');
    modal.classList.add('active');
    atualizarLightboxContent();
}

function fecharLightbox() {
    const modal = document.getElementById('wikiLightboxModal');
    modal.classList.remove('active');
}

function mudarFotoLightbox(direcao) {
    currentLightboxIndex += direcao;
    if (currentLightboxIndex < 0) {
        currentLightboxIndex = galleryImages.length - 1;
    } else if (currentLightboxIndex >= galleryImages.length) {
        currentLightboxIndex = 0;
    }
    atualizarLightboxContent();
}

function atualizarLightboxContent() {
    const imgElement = document.getElementById('lightboxImageElement');
    imgElement.src = galleryImages[currentLightboxIndex];

    // Atualiza os pontos de paginação
    const dotsContainer = document.getElementById('lightboxDotsContainer');
    dotsContainer.innerHTML = '';

    galleryImages.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.className = `lightbox-dot ${idx === currentLightboxIndex ? 'active' : ''}`;
        dot.onclick = () => {
            currentLightboxIndex = idx;
            atualizarLightboxContent();
        };
        dotsContainer.appendChild(dot);
    });
}

// Fechar com a tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        fecharLightbox();
    }
});











function trocarGuia(index, elemento) {
    // Remove a classe active de todos os botões do menu
    const botoes = document.querySelectorAll('.guide-menu-item');
    botoes.forEach(btn => btn.classList.remove('active'));

    // Adiciona active no botão clicado
    elemento.classList.add('active');

    // Remove a classe active de todos os painéis
    const paineis = document.querySelectorAll('.guide-pane');
    paineis.forEach(pane => pane.classList.remove('active'));

    // Ativa apenas o painel correspondente ao índice
    if (paineis[index]) {
        paineis[index].classList.add('active');
    }
}








function abrirModalRefinado(nome, descricao, servidor, avatarUrl, statText) {
    const overlay = document.getElementById('refinedModalOverlay');

    document.getElementById('modalPlayerName').innerText = nome;
    document.getElementById('modalPlayerDesc').innerText = descricao;
    document.getElementById('modalPlayerServer').innerText = servidor;
    document.getElementById('modalPlayerAvatar').src = avatarUrl;
    document.getElementById('modalPlayerStat').innerText = statText;

    overlay.classList.add('active');
}

function fecharModalRefinado() {
    const overlay = document.getElementById('refinedModalOverlay');
    overlay.classList.remove('active');
}

// Fecha o modal ao pressionar a tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        fecharModalRefinado();
    }
});















// Dados das imagens e legendas extraídas das suas capturas
const slidesData = [
    {
        img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
        caption: "Atravesse paisagens impressionantes e descubra os mistérios."
    },
    {
        img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop",
        caption: "Jogue conteúdos incríveis criados pela comunidade."
    },
    {
        img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
        caption: "Explore fortalezas antigas e defenda seu território."
    },
    {
        img: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop",
        caption: "Crie biomas personalizados e dê vida às construções."
    },
    {
        img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
        caption: "Enfrente perigos e colete recursos raros no Nether."
    }
];

let indiceAtual = 0;

function atualizarCarrossel() {
    const mainImg = document.getElementById('carouselMainImg');
    const captionText = document.getElementById('carouselCaptionText');
    const thumbs = document.querySelectorAll('.carousel-thumb');

    // Atualiza imagem e legenda do palco principal
    mainImg.src = slidesData[indiceAtual].img;
    captionText.innerText = slidesData[indiceAtual].caption;

    // Gerencia a classe 'active' das miniaturas
    thumbs.forEach((thumb, index) => {
        if (index === indiceAtual) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

function mudarSlide(direcao) {
    indiceAtual += direcao;

    // Loop infinito (se passar do último, volta pro primeiro e vice-versa)
    if (indiceAtual < 0) {
        indiceAtual = slidesData.length - 1;
    } else if (indiceAtual >= slidesData.length) {
        indiceAtual = 0;
    }

    atualizarCarrossel();
}

function irParaSlide(index) {
    indiceAtual = index;
    atualizarCarrossel();
}









/* ==========================================================
   MOTOR JAVASCRIPT: EXTRAÇÃO DO HTML E RENDERIZAÇÃO
   ========================================================== */
function getLeaderboardDataFromHTML() {
    const rawContainer = document.getElementById('lbRawData');
    const categories = rawContainer.querySelectorAll('[data-category]');
    const dataObj = {};

    categories.forEach(catDiv => {
        const catName = catDiv.getAttribute('data-category');
        const items = catDiv.querySelectorAll('div');

        dataObj[catName] = Array.from(items).map(item => ({
            rank: parseInt(item.getAttribute('data-rank')),
            name: item.getAttribute('data-name'),
            score: item.getAttribute('data-score'),
            uuid: item.getAttribute('data-uuid') || '',
            tag: item.getAttribute('data-tag') || '',
            isClan: item.getAttribute('data-is-clan') === 'true'
        }));
    });

    return dataObj;
}

let leaderboardData = {};
let currentCategory = 'money';

function renderLeaderboard(category, filterText = '') {
    const container = document.getElementById('lbTableBody');
    const data = leaderboardData[category] || [];

    // Filtro de pesquisa em tempo real
    const filtered = data.filter(item => item.name.toLowerCase().includes(filterText.toLowerCase()));

    if (filtered.length === 0) {
        container.innerHTML = `<div class="lb-empty-msg">Nenhum registro encontrado para "${filterText}".</div>`;
        return;
    }

    container.innerHTML = filtered.map(item => {
        let rankClass = '';
        if (item.rank === 1) rankClass = 'top-1';
        else if (item.rank === 2) rankClass = 'top-2';
        else if (item.rank === 3) rankClass = 'top-3';

        let playerInfoHtml = '';
        if (item.isClan) {
            playerInfoHtml = `
                <span class="lb-clan-tag">${item.tag}</span>
                <span class="lb-name">${item.name}</span>
            `;
        } else {
            playerInfoHtml = `
                <img src="https://crafatar.com/avatars/${item.uuid}?size=32&overlay" alt="Avatar" class="lb-avatar pixelated">
                <span class="lb-name">${item.name}</span>
            `;
        }

        return `
            <div class="lb-row">
                <span class="lb-rank ${rankClass}">${item.rank}º</span>
                <div class="lb-player-info">${playerInfoHtml}</div>
                <span class="lb-score">${item.score}</span>
            </div>
        `;
    }).join('');
}

// Inicialização ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    leaderboardData = getLeaderboardDataFromHTML();
    renderLeaderboard('money');

    // Eventos de troca de aba
    document.querySelectorAll('.lb-radio').forEach(radio => {
        radio.addEventListener('change', (e) => {
            currentCategory = e.target.getAttribute('data-category');
            document.getElementById('lbSearchInput').value = '';
            renderLeaderboard(currentCategory);
        });
    });

    // Evento de pesquisa em tempo real
    document.getElementById('lbSearchInput').addEventListener('input', (e) => {
        renderLeaderboard(currentCategory, e.target.value);
    });
});












document.addEventListener("DOMContentLoaded", () => {
    const goalCards = document.querySelectorAll('.gc-card');

    goalCards.forEach(card => {
        const current = parseFloat(card.getAttribute('data-current'));
        const target = parseFloat(card.getAttribute('data-target'));

        // Cálculo da porcentagem (Limitado a 100% no máximo)
        let percentage = Math.round((current / target) * 100);
        if (percentage > 100) percentage = 100;
        if (percentage < 0) percentage = 0;

        // Atualiza os elementos visuais do card
        card.querySelector('.gc-percentage-text').textContent = percentage + '%';
        card.querySelector('.gc-progress-fill').style.width = percentage + '%';
        card.querySelector('.gc-current-val').textContent = current;
        card.querySelector('.gc-target-val').textContent = target;
    });
});
















document.addEventListener("DOMContentLoaded", function () {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    let detectedOS = "windows"; // Padrão caso não identifique

    // Identificação precisa do SO
    if (/android/i.test(userAgent)) {
        detectedOS = "android";
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        detectedOS = "ios";
    } else if (/mac/i.test(userAgent)) {
        detectedOS = "macos";
    } else if (/linux/i.test(userAgent)) {
        detectedOS = "linux";
    } else if (/win/i.test(userAgent)) {
        detectedOS = "windows";
    }

    // Aplica o destaque automático no card correspondente
    mudarOS(detectedOS);
});

function mudarOS(osName) {
    // Remove destaque de todos os cards e abas
    document.querySelectorAll('.os-card').forEach(card => {
        card.classList.remove('highlight-os');
        card.style.display = 'flex'; // Mantém todos visíveis no grid
    });
    
    document.querySelectorAll('.os-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.querySelectorAll('.os-detected-badge').forEach(badge => {
        badge.style.display = 'none';
    });

    // Ativa o card e aba selecionados
    const targetCard = document.getElementById('card-' + osName);
    const targetBadge = document.getElementById('badge-' + osName);
    
    if (targetCard) {
        targetCard.classList.add('highlight-os');
        targetBadge.style.display = 'inline-block';
        
        // Opcional: Dá um leve scroll suave para o card detectado se necessário em mobile
        // targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Ativa o botão correspondente na barra de abas
    eventosAtivarAba(osName);
}

function eventosAtivarAba(osName) {
    const buttons = document.querySelectorAll('.os-tab-btn');
    buttons.forEach(btn => {
        if (btn.textContent.toLowerCase().includes(osName) || 
            (osName === 'ios' && btn.textContent.toLowerCase().includes('iphone')) ||
            (osName === 'macos' && btn.textContent.toLowerCase().includes('macos'))) {
            btn.classList.add('active');
        }
    });
}
















const track = document.getElementById('carouselTrack');
let cards = Array.from(track.children);
let currentIndex = 1; // Inicia no segundo card (central)

function atualizarCarrossel(comTransicao = true) {
    cards = Array.from(track.children); // Atualiza a lista de cards na ordem atual

    if (comTransicao) {
        track.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
    } else {
        track.style.transition = 'none';
    }

    // Aplica a classe active apenas no card central
    cards.forEach((card, idx) => {
        if (idx === currentIndex) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });

    // Centraliza o card ativo no container
    const activeCard = cards[currentIndex];
    const trackWrapper = track.parentElement;
    
    const cardOffsetLeft = activeCard.offsetLeft;
    const cardWidth = activeCard.clientWidth;
    const wrapperWidth = trackWrapper.clientWidth;
    
    const targetTranslateX = (wrapperWidth / 2) - cardOffsetLeft - (cardWidth / 2);
    track.style.transform = `translateX(${targetTranslateX}px)`;
}

function rolarInfinito(direcao) {
    track.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
    currentIndex += direcao;

    // Se o usuário está indo para a direita e passou do último card
    if (currentIndex >= cards.length) {
        track.style.transition = 'none'; // Desliga a animação para o reposicionamento imediato
        const primeiroCard = track.firstElementChild;
        track.appendChild(primeiroCard); // Pega o primeiro card da esquerda e joga para o final da direita
        currentIndex = cards.length - 1; // Ajusta o índice para o novo último card
        atualizarCarrossel(false);
        
        // Retoma a transição no próximo frame
        setTimeout(() => {
            track.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
        }, 20);
        return;
    }

    // Se o usuário está indo para a esquerda e passou do primeiro card
    if (currentIndex < 0) {
        track.style.transition = 'none'; // Desliga a animação
        const ultimoCard = track.lastElementChild;
        track.insertBefore(ultimoCard, track.firstElementChild); // Pega o último card da direita e joga para o início da esquerda
        currentIndex = 0; // Ajusta o índice para o novo primeiro card
        atualizarCarrossel(false);
        
        // Retoma a transição no próximo frame
        setTimeout(() => {
            track.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
        }, 20);
        return;
    }

    atualizarCarrossel(true);
}

// Inicializa centralizado ao carregar e redimensionar a tela
window.addEventListener('load', () => atualizarCarrossel(false));
window.addEventListener('resize', () => atualizarCarrossel(false));