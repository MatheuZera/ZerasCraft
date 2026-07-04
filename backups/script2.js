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