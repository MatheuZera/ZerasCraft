// Atualizar o ano do copyright automaticamente
document.getElementById('current-year').textContent = new Date().getFullYear();

window.onscroll = function() {
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