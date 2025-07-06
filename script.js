document.addEventListener('DOMContentLoaded', () => {
    // Função para exibir toast notifications (mantida, pois pode ser útil para debug)
    function showToast(message, duration = 3000) {
        const toastContainer = document.querySelector('.toast-container') || (() => {
            const div = document.createElement('div');
            div.className = 'toast-container';
            document.body.appendChild(div);
            return div;
        })();

        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = message;
        toastContainer.appendChild(toast);

        void toast.offsetWidth; // Força o reflow
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => toast.remove(), { once: true });
        }, duration);
    }

    // =========================================
    // Efeitos Sonoros de Interação
    // =========================================
    // Carrega os elementos de áudio
    const clickSound = document.getElementById('clickSound'); // Para links/botões
    const hoverSound = document.getElementById('hoverSound'); // Para hover em cards

    // Preload SFX para evitar atrasos na primeira reprodução
    if (clickSound) clickSound.load();
    if (hoverSound) hoverSound.load();

    // Função genérica para tocar um som
    function playAudioElement(audioElement) {
        if (!audioElement) {
            console.warn("Elemento de áudio não encontrado para reprodução.");
            return;
        }
        // Para permitir que o som toque novamente rapidamente
        if (!audioElement.paused) {
            audioElement.pause();
            audioElement.currentTime = 0; // Reinicia o som
        }
        audioElement.play().catch(e => {
            // Captura o erro se o autoplay for bloqueado
            console.log(`Erro ao tocar som: ${audioElement.id || 'desconhecido'} - ${e.message}`, e);
        });
    }

    // =========================================
    // Interatividade dos Cards e Links
    // =========================================

    // 1. Cards Interativos - Som de hover e clique, e animação do ícone
    const interactiveCards = document.querySelectorAll('.interactive-card');

    interactiveCards.forEach(card => {
        // Evento de mouseenter (hover) para tocar o som e animar o ícone
        card.addEventListener('mouseenter', () => {
            playAudioElement(hoverSound); // Toca o som de hover
            // A animação CSS já é ativada pelo :hover no CSS.
            // Se precisar de alguma manipulação de classe adicional, faria aqui.
        });

        // Evento de clique para o card inteiro
        card.addEventListener('click', (event) => {
            // Evita disparar o som de clique se o clique foi em um elemento interativo interno
            // Embora agora os cards sejam o principal ponto de clique, isso é uma boa prática
            // Se você remover todos os botões/links de dentro dos cards, pode simplificar.
            const clickedElement = event.target;
            const isInternalInteractiveElement = clickedElement.closest('a') || clickedElement.closest('button');

            if (!isInternalInteractiveElement) {
                playAudioElement(clickSound); // Toca o som de clique
                // A animação CSS de ':active' já é ativada pelo clique no CSS.
                // Se precisar de alguma manipulação de classe adicional, faria aqui.
            }
        });
    });

    // 2. Links/Botões Genéricos (que não são cards) - Som de clique
    // Alvo: todos os 'a' e 'button' que NÃO estejam dentro de um '.interactive-card'
    // Isso garante que os cards interativos lidem com seus próprios cliques.
    const generalLinksButtons = document.querySelectorAll(
        'a:not(.interactive-card a), button:not(.interactive-card button)'
    );

    generalLinksButtons.forEach(element => {
        element.addEventListener('click', () => {
            playAudioElement(clickSound); // Toca o som de clique
        });
    });

    // Removido: Toda a lógica de música de fundo e controles,
    // e os setups para botões de cópia e seus respectivos handlers,
    // pois a solicitação é para remover atalhos e botões.
    // Assim como os listeners de hover para ícones de título ou sliders de volume.

    // Se ainda houver o elemento de música de fundo no HTML, ele pode ser removido.
    // const backgroundMusic = document.getElementById('backgroundMusic');
    // if (backgroundMusic) {
    //     backgroundMusic.remove(); // Remove o elemento de áudio do DOM
    // }
});