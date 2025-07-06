document.addEventListener('DOMContentLoaded', function() {
    const minecraftAudio = document.getElementById('minecraftAudio');
    const playAudioBtn = document.getElementById('playAudioBtn'); // O botão que vamos mostrar

    // --- Configuração de volume (permanece igual) ---
    if (minecraftAudio) {
        minecraftAudio.volume = 0.7; // AJUSTE ESTE VALOR
    }

    // --- Lógica de reprodução do áudio do Minecraft (permanece igual) ---
    if (playAudioBtn && minecraftAudio) {
        playAudioBtn.classList.add('play-audio-btn-off');
        let isPlaying = false; 

        playAudioBtn.addEventListener('click', function() {
            if (isPlaying) {
                minecraftAudio.pause();
                minecraftAudio.currentTime = 0;
                isPlaying = false;
                playAudioBtn.classList.remove('play-audio-btn-on');
                playAudioBtn.classList.add('play-audio-btn-off');
            } else {
                minecraftAudio.play().catch(e => {
                    console.warn("Reprodução do áudio do Minecraft bloqueada ou falhou:", e);
                });
                isPlaying = true;
                playAudioBtn.classList.remove('play-audio-btn-off');
                playAudioBtn.classList.add('play-audio-btn-on');
            }
        });

        minecraftAudio.addEventListener('ended', function() {
            isPlaying = false;
            playAudioBtn.classList.remove('play-audio-btn-on');
            playAudioBtn.classList.add('play-audio-btn-off');
        });

        minecraftAudio.addEventListener('pause', function() {
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
        console.error("Erro: Elementos 'playAudioBtn' ou 'minecraftAudio' não encontrados no DOM. Verifique seus IDs no HTML.");
    }

    // --- Lógica para o som de clique em interações (permanece igual) ---
    const clickAudio = new Audio('audios/click.mp3');
    clickAudio.preload = 'auto'; 
    clickAudio.volume = 0.4; // AJUSTE ESTE VALOR

    document.addEventListener('click', function(event) {
        const clickedElement = event.target;
        const isClickable = clickedElement.tagName === 'A' ||
                            clickedElement.tagName === 'BUTTON' ||
                            clickedElement.classList.contains('btn-primary') ||
                            clickedElement.classList.contains('btn-secondary') ||
                            clickedElement.classList.contains('btn-link');
        
        const isMainAudioButton = clickedElement.id === 'playAudioBtn';

        if (isClickable && !isMainAudioButton) {
            clickAudio.currentTime = 0;
            clickAudio.play().catch(e => {
                console.warn("Erro ao reproduzir som de clique:", e);
            });
        }
    });

    // --- Lógica para reproduzir select.mp3 ao passar o mouse/toque nas abas/cards (permanece igual) ---
    const selectAudio = new Audio('audios/select.mp3');
    selectAudio.preload = 'auto'; 
    selectAudio.volume = 0.3; // AJUSTE ESTE VALOR

    const interactiveCards = document.querySelectorAll(
        '.service-card, .role-category-card, .event-card, .community-card, .partnership-card'
    );

    function playSelectSound() {
        selectAudio.currentTime = 0;
        selectAudio.play().catch(e => {
            console.warn("Reprodução de áudio 'select.mp3' bloqueada ou falhou:", e);
        });
    }

    interactiveCards.forEach(card => {
        card.addEventListener('mouseenter', playSelectSound);
    });

    // --- NOVO: Lógica para mostrar o botão de áudio após a primeira interação ---
    let userInteracted = false; // Flag para controlar se o usuário já interagiu

    function handleUserInteraction() {
        if (!userInteracted) {
            // Mostra o botão de áudio
            if (playAudioBtn) {
                playAudioBtn.style.display = 'block'; // Ou playAudioBtn.classList.add('show-audio-btn'); se usar transições CSS
            }
            
            // Opcional: Tentar tocar o select.mp3 uma vez aqui, após a interação
            // Isso garante que o som 'select' (que é um som de UI) possa ser ouvido
            // logo após a primeira interação do usuário, mesmo antes de passar o mouse.
            selectAudio.currentTime = 0;
            selectAudio.play().catch(e => {
                console.warn("Reprodução inicial de 'select.mp3' após interação falhou:", e);
            });

            userInteracted = true; // Define a flag como verdadeira
            // Remove os event listeners para que a função não seja executada múltiplas vezes
            document.removeEventListener('scroll', handleUserInteraction);
            document.removeEventListener('mousemove', handleUserInteraction);
            document.removeEventListener('touchstart', handleUserInteraction);
            document.removeEventListener('click', handleUserInteraction); // Importante para cliques gerais
        }
    }

    // Adiciona event listeners para detectar a primeira interação
    document.addEventListener('scroll', handleUserInteraction); // Rolagem do mouse/scroll mobile
    document.addEventListener('mousemove', handleUserInteraction); // Movimento do mouse
    document.addEventListener('touchstart', handleUserInteraction); // Toque na tela (mobile)
    document.addEventListener('click', handleUserInteraction); // Qualquer clique
});