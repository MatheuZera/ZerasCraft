// ========================================= //
// FUNÇÕES E EVENTOS PARA O CARD INTERATIVO PIXEL LEGENDS //
// ========================================= //

document.addEventListener('DOMContentLoaded', () => {
    const pixelLegendsCard = document.getElementById('pixelLegendsCard');
    const expandBtn = pixelLegendsCard ? pixelLegendsCard.querySelector('.expand-btn') : null;
    const cardContentWrapper = pixelLegendsCard ? pixelLegendsCard.querySelector('.card-content-wrapper') : null;

    // Carrega os sons
    const selectSound = new Audio('sounds/select.mp3');
    const clickSound = new Audio('sounds/click.mp3');

    // Função para tocar o som de seleção
    function playSelectSound() {
        if (!selectSound.paused) {
            selectSound.pause();
            selectSound.currentTime = 0;
        }
        selectSound.play().catch(e => console.error("Erro ao tocar som 'select.mp3':", e));
    }

    // Função para tocar o som de clique
    function playClickSound() {
        if (!clickSound.paused) {
            clickSound.pause();
            clickSound.currentTime = 0;
        }
        clickSound.play().catch(e => console.error("Erro ao tocar som 'click.mp3':", e));
    }

    // Evento de hover para o card (toca select.mp3)
    if (pixelLegendsCard) {
        pixelLegendsCard.addEventListener('mouseenter', () => {
            playSelectSound();
        });
    }

    // Evento de clique para o botão de expandir (toca click.mp3 e expande)
    if (expandBtn && cardContentWrapper && pixelLegendsCard) {
        expandBtn.addEventListener('click', (event) => {
            event.stopPropagation(); // Evita que o clique se propague para o card inteiro
            playClickSound();

            const isExpanded = pixelLegendsCard.classList.toggle('expanded');
            expandBtn.setAttribute('aria-expanded', isExpanded);
        });

        // Evento de clique no card para expandir/contrair (exceto no botão)
        pixelLegendsCard.addEventListener('click', (event) => {
            // Se o clique não foi no botão de expandir, ou em um link/botão dentro do conteúdo
            if (!expandBtn.contains(event.target) && !event.target.closest('a') && !event.target.closest('button')) {
                playClickSound();
                const isExpanded = pixelLegendsCard.classList.toggle('expanded');
                expandBtn.setAttribute('aria-expanded', isExpanded);
            }
        });
    }

    // ========================================= //
    // FUNCIONALIDADE COPIAR IP/PORTA (Existente, mas revisada a integração) //
    // ========================================= //

    const copyButtons = document.querySelectorAll('.copy-ip-btn');
    const toastNotification = document.getElementById('toastNotification');

    function showToast(message) {
        if (toastNotification) {
            toastNotification.textContent = message;
            toastNotification.classList.add('show');
            setTimeout(() => {
                toastNotification.classList.remove('show');
            }, 3000); // Esconde após 3 segundos
        }
    }

    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const ip = this.dataset.ip;
            const port = this.dataset.port;
            let textToCopy = ip;

            if (port) {
                textToCopy += `\nPORTA: ${port}`; // Adiciona a porta em nova linha
            }

            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    showToast('IP copiado: ' + ip + (port ? ` e Porta: ${port}` : ''));
                })
                .catch(err => {
                    console.error('Falha ao copiar texto: ', err);
                    showToast('Erro ao copiar!');
                });
        });
    });

    // ========================================= //
    // REINICIAR ANIMAÇÃO DO BOTÃO DE ÁUDIO (EXISTENTE) //
    // ========================================= //
    const playAudioBtn = document.getElementById('playAudioBtn');
    if (playAudioBtn) {
        // Remove e adiciona a classe para reiniciar a animação
        // Isso garante que a animação comece ao carregar a página
        playAudioBtn.classList.remove('animating');
        void playAudioBtn.offsetWidth; // Trigger reflow
        playAudioBtn.classList.add('animating');
        playAudioBtn.style.display = 'flex'; // Garante que o botão seja visível
    }
});