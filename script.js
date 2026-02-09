// Atualizar o ano do copyright automaticamente
document.getElementById('current-year').textContent = new Date().getFullYear();

window.onscroll = function () {
    const btn = document.querySelector('.back-to-top');
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        btn.style.display = "flex";
    } else {
        btn.style.display = "none";
    }
};

// 1. Sidebar Toggle
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const burgerIcon = document.getElementById('burgerIcon');

    // Abre ou fecha a sidebar
    sidebar.classList.toggle('open');

    // Troca o ícone baseado no estado da sidebar
    if (sidebar.classList.contains('open')) {
        burgerIcon.classList.replace('fa-bars', 'fa-times');
    } else {
        burgerIcon.classList.replace('fa-times', 'fa-bars');
    }
}

// 2. Copiar IP
function copyIP() {
    const ip = "jogar.zerascraft.net";
    navigator.clipboard.writeText(ip).then(() => {
        alert("IP Copiado! Te esperamos no servidor.");
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
function openTab(evt, tabName) {
    let i, tabContent, tabBtns;

    // Esconde todos os conteúdos
    tabContent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
        tabContent[i].classList.remove("active");
    }

    // Remove a classe 'active' de todos os botões
    tabBtns = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tabBtns.length; i++) {
        tabBtns[i].classList.remove("active");
    }

    // Mostra a aba atual e adiciona a classe active ao botão
    document.getElementById(tabName).style.display = "block";
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}


function toggleAcc(element) {
    const answer = element.nextElementSibling;
    const icon = element.querySelector('i');

    // Fecha outros abertos (opcional)
    document.querySelectorAll('.faq-answer').forEach(el => {
        if (el !== answer) {
            el.classList.remove('open');
            el.previousElementSibling.querySelector('i').classList.replace('fa-minus', 'fa-plus');
        }
    });

    answer.classList.toggle('open');
    if (answer.classList.contains('open')) {
        icon.classList.replace('fa-plus', 'fa-minus');
    } else {
        icon.classList.replace('fa-minus', 'fa-plus');
    }
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