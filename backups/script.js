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

function openHub(evt, gameId) {
    const contents = document.getElementsByClassName("hub-content");
    const tabs = document.getElementsByClassName("tab-link");

    for (let i = 0; i < contents.length; i++) contents[i].classList.remove("active");
    for (let i = 0; i < tabs.length; i++) tabs[i].classList.remove("active");

    document.getElementById(gameId).classList.add("active");
    evt.currentTarget.classList.add("active");
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
 * Troca imagem do banner pela da thumb e atualiza textos.
 */
function heroSwitcher(element) {
    const banner = document.getElementById('mainBanner');
    const title = document.getElementById('heroTitle');
    const desc = document.getElementById('heroDesc');
    const thumbs = document.querySelectorAll('.t-box');

    // 1. Atualiza a imagem (Captura a mesma da thumb)
    banner.src = element.querySelector('img').src;

    // 2. Atualiza textos do card estático
    title.innerText = element.getAttribute('data-title');
    desc.innerText = element.getAttribute('data-desc');

    // 3. Gerencia destaque visual
    thumbs.forEach(t => t.classList.remove('active'));
    element.classList.add('active');
}