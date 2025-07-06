document.addEventListener('DOMContentLoaded', function() {
    // --- Lógica para o botão de áudio de fundo (Minecraft Audio) ---
    // Pega a referência para o elemento de áudio do Minecraft no HTML
    const minecraftAudio = document.getElementById('minecraftAudio');
    const playAudioBtn = document.getElementById('playAudioBtn');

    if (playAudioBtn && minecraftAudio) {
        playAudioBtn.classList.add('play-audio-btn-off');
        let isPlaying = false; 

        playAudioBtn.addEventListener('click', function() {
            if (isPlaying) {
                minecraftAudio.pause();
                minecraftAudio.currentTime = 0; // Reinicia o áudio
                isPlaying = false;
                playAudioBtn.classList.remove('play-audio-btn-on');
                playAudioBtn.classList.add('play-audio-btn-off');
            } else {
                // Tenta reproduzir o áudio. O .catch lida com a política de autoplay do navegador.
                minecraftAudio.play().catch(e => {
                    console.warn("Reprodução do áudio do Minecraft bloqueada ou falhou:", e);
                    // Aqui você pode adicionar feedback visual ao usuário, se desejar.
                });
                isPlaying = true;
                playAudioBtn.classList.remove('play-audio-btn-off');
                playAudioBtn.classList.add('play-audio-btn-on');
            }
        });

        // Eventos para atualizar o estado do botão quando o áudio termina ou é pausado externamente
        minecraftAudio.addEventListener('ended', function() {
            isPlaying = false;
            playAudioBtn.classList.remove('play-audio-btn-on');
            playAudioBtn.classList.add('play-audio-btn-off');
        });

        minecraftAudio.addEventListener('pause', function() {
            // Só atualiza se realmente não estiver tocando
            if (isPlaying && minecraftAudio.paused) {
                isPlaying = false;
                playAudioBtn.classList.remove('play-audio-btn-on');
                playAudioBtn.classList.add('play-audio-btn-off');
            }
        });

        minecraftAudio.addEventListener('play', function() {
            isPlaying = true;
            playAudioBtn.classList.remove('play-audio-btn-off');
            playAudioBtn.classList.add('play-audio-btn-on');
        });

    } else {
        console.error("Erro: Botão 'playAudioBtn' ou elemento de áudio 'minecraftAudio' não encontrados no DOM. Verifique seus IDs no HTML.");
    }

    // --- Lógica para o som de clique em interações ---
    // Cria uma nova instância de áudio diretamente do arquivo
    const clickAudio = new Audio('audios/click.mp3');
    clickAudio.preload = 'auto'; // Pré-carrega o áudio para uso mais rápido

    document.addEventListener('click', function(event) {
        const clickedElement = event.target;

        // Verifica se o elemento clicado é um link (<a>), um botão (<button>)
        // ou tem alguma das classes de botão/link que você usa.
        const isClickable = clickedElement.tagName === 'A' ||
                            clickedElement.tagName === 'BUTTON' ||
                            clickedElement.classList.contains('btn-primary') ||
                            clickedElement.classList.contains('btn-secondary') ||
                            clickedElement.classList.contains('btn-link');
        
        // Evita que o som de clique toque no próprio botão de áudio principal
        const isMainAudioButton = clickedElement.id === 'playAudioBtn';

        if (isClickable && !isMainAudioButton) {
            clickAudio.currentTime = 0; // Reinicia o áudio para que ele possa ser tocado novamente rapidamente
            clickAudio.play().catch(e => {
                // Captura e exibe qualquer erro de reprodução (ex: autoplay block)
                console.warn("Erro ao reproduzir som de clique:", e);
            });
        }
    });

    // --- Lógica para reproduzir select.mp3 ao passar o mouse/toque nas abas/cards ---
    // Cria uma nova instância de áudio diretamente do arquivo para o som 'select'
    const selectAudio = new Audio('audios/select.mp3');
    selectAudio.preload = 'auto'; // Pré-carrega o áudio

    // Seleciona todos os elementos que você quer que acionem o som 'select'
    // Com base nas classes dos seus cards no HTML
    const interactiveCards = document.querySelectorAll(
        '.service-card, .role-category-card, .event-card, .community-card, .partnership-card'
    );

    // Função para tocar o áudio select.mp3
    function playSelectSound() {
        selectAudio.currentTime = 0; // Reinicia o áudio para que ele possa ser tocado rapidamente
        selectAudio.play().catch(e => {
            // Captura e ignora o erro se a reprodução automática foi bloqueada
            console.warn("Reprodução de áudio 'select.mp3' bloqueada ou falhou:", e);
        });
    }

    // Adiciona o event listener 'mouseenter' para cada card interativo
    interactiveCards.forEach(card => {
        card.addEventListener('mouseenter', playSelectSound);
        // Para dispositivos touch, 'touchstart' pode ser usado, mas tenha cuidado
        // para não duplicar o som ou gerar um comportamento indesejado em scrolls.
        // Geralmente, 'mouseenter' é suficiente para a maioria dos casos de hover.
        // card.addEventListener('touchstart', playSelectSound); // Opcional para touch
    });
});