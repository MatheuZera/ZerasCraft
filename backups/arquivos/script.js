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
function switchTab(evt, tabId) {
    // 1. Busca todos os elementos
    const allContents = document.querySelectorAll('.tab-content');
    const allButtons = document.querySelectorAll('.tab-btn');

    // 2. REMOÇÃO FORÇADA: Limpa classes e estilos inline de todas as abas
    allContents.forEach(content => {
        content.classList.remove('active');
        content.style.setProperty('display', 'none', 'important');
    });

    // 3. Reseta os botões
    allButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    // 4. ATIVAÇÃO: Mostra apenas a aba clicada
    const target = document.getElementById(tabId);
    if (target) {
        target.style.setProperty('display', 'block', 'important');
        // Pequeno delay para garantir que o navegador processe o display antes da animação
        setTimeout(() => {
            target.classList.add('active');
        }, 10);
    }

    // 5. Destaca o botão atual
    evt.currentTarget.classList.add('active');
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


let currentScroll = 0;

function moveCarousel(direction) {
    const track = document.getElementById('carouselTrack');
    const viewport = document.querySelector('.mc-carousel-viewport');

    if (!track || !viewport) return;

    const card = track.querySelector('.mc-collectible-card');
    const cardWidth = card.offsetWidth + 20; // Largura do card + gap
    const totalWidth = track.scrollWidth;
    const visibleWidth = viewport.offsetWidth;
    const maxScroll = totalWidth - visibleWidth;

    // Calcula o próximo movimento
    // direction 1 = próximo (move para esquerda/negativo)
    // direction -1 = anterior (move para direita/positivo)
    currentScroll -= (direction * cardWidth);

    // LÓGICA DE LOOP
    // Se tentou ir além do final, volta para o início
    if (Math.abs(currentScroll) > maxScroll && direction === 1) {
        currentScroll = 0;
    }
    // Se tentou voltar antes do início, vai para o final
    else if (currentScroll > 0 && direction === -1) {
        currentScroll = -maxScroll;
    }

    // Aplica o movimento
    track.style.transform = `translateX(${currentScroll}px)`;
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

// 2. Lógica Hero "Sobrevivência"
function moveHero(direction) {
    const slides = document.querySelectorAll('.h-slide');
    slides[heroIndex].classList.remove('active');

    // Loop Infinito Matemático
    heroIndex = (heroIndex + direction + slides.length) % slides.length;

    slides[heroIndex].classList.add('active');
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