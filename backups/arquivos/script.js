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

const ZerasSync = {
    // ID fornecido pelo usuário: 1390120239588577482
    guildID: '1390120239588577482',

    async update() {
        // Null Check: verifica se o elemento existe antes de renderizar
        const display = document.getElementById('discord-count');
        if (!display) return;

        try {
            // Chamada ao endpoint JSON fornecido
            const response = await fetch(`https://discord.com/api/guilds/${this.guildID}/widget.json`);
            if (!response.ok) throw new Error("API Offline");

            const data = await response.json();

            // O widget.json retorna o 'presence_count' (membros online)
            if (data.presence_count !== undefined) {
                const onlineCount = data.presence_count;
                // Atualização parcial: altera apenas o texto para manter o foco
                display.innerText = `${onlineCount.toLocaleString()} membros online agora`;
            }
        } catch (error) {
            console.error("Zera's Craft Sync Error:", error);
            // Fallback para manter a imersão visual caso a API falhe
            display.innerText = "mais de 5.000 membros";
        }
    }
};

// Inicia a sincronização após o carregamento total para evitar erros de ID
window.addEventListener('DOMContentLoaded', () => {
    ZerasSync.update();
    // Atualiza a cada 5 minutos (300000ms)
    setInterval(() => ZerasSync.update(), 300000);
});

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

/**
 * SISTEMA DE NAVEGAÇÃO ZERAS CRAFT
 */

// Abrir e fechar Sidebar Mobile
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const body = document.body;

    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');

    // Impede o scroll do site com o menu aberto
    if (sidebar.classList.contains('active')) {
        body.style.overflow = 'hidden';
    } else {
        body.style.overflow = 'auto';
    }
}

// Controle de Dropdown Mobile (Sistema de Painel Lateral)
function toggleDrop(element) {
    const parent = element.parentElement;

    // Opcional: Fecha outros dropdowns ao abrir um novo
    /*
    document.querySelectorAll('.sidebar-dropdown').forEach(item => {
        if (item !== parent) item.classList.remove('open');
    });
    */

    parent.classList.toggle('open');
}

// Fechar sidebar ao clicar em um link (opcional)
document.querySelectorAll('.sidebar-links a').forEach(link => {
    link.addEventListener('click', () => {
        const sidebar = document.getElementById('sidebar');
        if (sidebar.classList.contains('active')) {
            toggleSidebar();
        }
    });
});

// Fechar com a tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const sidebar = document.getElementById('sidebar');
        if (sidebar.classList.contains('active')) toggleSidebar();
    }
});

// 2. Copiar IP
function copyIP() {
    const ip = "MCPixelLegends88.aternos.me:0000";
    navigator.clipboard.writeText(ip).then(() => {
        alert("Te Vemos por Lá! // (Nosso Servidor tem suporte nativo para Bedrock e Java) ;)");
    }).catch(err => {
        console.error('Erro ao copiar', err);
    });
}

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


let currentIndex = 0;

function moveCarousel(direction) {
    const track = document.getElementById('carouselTrack');
    const cards = document.querySelectorAll('.mc-collectible-card');
    const cardWidth = cards[0].offsetWidth + 20; // Largura do card + gap
    const visibleCards = window.innerWidth > 768 ? 3 : 1; // Quantos cards aparecem por vez
    const maxIndex = cards.length - visibleCards;

    // Atualiza o índice com base na direção
    currentIndex += direction;

    // --- AS TRAVAS DE SEGURANÇA ---

    // 1. Trava da Esquerda: Se o índice for menor que 0, força a voltar para 0
    if (currentIndex < 0) {
        currentIndex = 0;
        return; // Interrompe a função para não animar sem necessidade
    }

    // 2. Trava da Direita: Se passar do último card visível, trava no máximo
    if (currentIndex > maxIndex) {
        currentIndex = maxIndex;
        return;
    }

    // Aplica o movimento apenas se estiver dentro dos limites
    const moveDistance = currentIndex * cardWidth;
    track.style.transform = `translateX(-${moveDistance}px)`;
}



// CONFIGURAÇÃO DOS ÍNDICES
let worldIndex = 0;
let heroIndex = 0;

// 1. Lógica Slider "Expanda seu Mundo" (Pula 1 por 1)
function moveWorld(direction) {
    const track = document.getElementById('worldTrack');
    const items = track.children.length;
    const step = track.children[0].offsetWidth;

    // Loop Infinito Matemático
    worldIndex = (worldIndex + direction + items) % items;

    track.style.transform = `translateX(-${worldIndex * step}px)`;
}

let currentHeroSlide = 0;

function moveHero(direction) {
    const slides = document.querySelectorAll('.h-slide');

    // Remove o ativo do atual
    slides[currentHeroSlide].classList.remove('active');

    // Calcula o próximo (com trava para não bugar)
    currentHeroSlide += direction;

    if (currentHeroSlide < 0) {
        currentHeroSlide = slides.length - 1;
    } else if (currentHeroSlide >= slides.length) {
        currentHeroSlide = 0;
    }

    // Adiciona ativo ao novo slide
    slides[currentHeroSlide].classList.add('active');
}

// 3. Lógica de Accordions
function toggleAccordion(button) {
    const panel = button.nextElementSibling;
    const icon = button.querySelector('i');

    // Fecha outros painéis abertos para evitar bugs visuais
    document.querySelectorAll('.acc-panel').forEach(p => {
        if (p !== panel) p.style.maxHeight = null;
    });

    if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
        icon.className = "fas fa-plus";
    } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
        icon.className = "fas fa-minus";
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



function openTab(evt, tabId) {
    // Esconde todos os panes
    const panes = document.querySelectorAll(".tab-pane");
    panes.forEach(p => p.classList.remove("active"));

    // Remove classe active dos botões
    const btns = document.querySelectorAll(".tab-btn");
    btns.forEach(b => b.classList.remove("active"));

    // Mostra a aba atual e marca o botão
    document.getElementById(tabId).classList.add("active");
    evt.currentTarget.classList.add("active");

    // Feedback visual (opcional, integra com seu player.js)
    if (typeof showMessage === 'function') {
        showMessage("ABA ALTERADA", "Explorando novo conteúdo", "fa-th-large");
    }
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