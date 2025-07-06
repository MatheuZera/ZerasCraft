document.addEventListener('DOMContentLoaded', function() {
    // --- Lógica para o botão de áudio de fundo (Minecraft Audio) ---
    const minecraftAudio = document.getElementById('minecraftAudio');
    const playAudioBtn = document.getElementById('playAudioBtn');

    if (minecraftAudio) {
        minecraftAudio.volume = 0.6; // AJUSTE ESTE VALOR
    }

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

    // --- Lógica para o som de clique em interações ---
    const clickAudio = new Audio('audios/click.mp3');
    clickAudio.preload = 'auto'; 
    clickAudio.volume = 0.3; // AJUSTE ESTE VALOR

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

    // --- Lógica para reproduzir select.mp3 ao passar o mouse/toque nos cards GERAIS ---
    // ESTA PARTE AGORA VAI EXCLUIR OS security-grid-item
    // Pois os security-grid-item terão sua própria lógica de áudio.
    const interactiveCardsGeneral = document.querySelectorAll(
        '.service-card:not(.security-card), .role-category-card, .event-card, .community-card, .partnership-card'
    );

    // Cria uma ÚNICA instância para os cards gerais (que não são os itens de segurança)
    const selectAudioGeneral = new Audio('audios/select.mp3');
    selectAudioGeneral.preload = 'auto';
    selectAudioGeneral.volume = 0.1; // AJUSTE ESTE VALOR

    function playSelectSoundGeneral() {
        selectAudioGeneral.currentTime = 0;
        selectAudioGeneral.play().catch(e => {
            console.warn("Reprodução de áudio 'select.mp3' (geral) bloqueada ou falhou:", e);
        });
    }

    interactiveCardsGeneral.forEach(card => {
        card.addEventListener('mouseenter', playSelectSoundGeneral);
    });

    // --- NOVO: Lógica para reproduzir select.mp3 para CADA ITEM DA GRADE DE SEGURANÇA ---
    const securityGridItems = document.querySelectorAll('.security-grid-item');

    securityGridItems.forEach(item => {
        // Para cada item, crie uma NOVA instância de áudio
        const itemSelectAudio = new Audio('audios/select.mp3');
        itemSelectAudio.preload = 'auto';
        itemSelectAudio.volume = 0.1; // AJUSTE O VOLUME PARA OS ITENS DA GRADE (pode ser menor)

        item.addEventListener('mouseenter', function() {
            itemSelectAudio.currentTime = 0; // Reinicia o som para este item
            itemSelectAudio.play().catch(e => {
                console.warn("Reprodução de áudio 'select.mp3' para item da grade bloqueada ou falhou:", e);
            });
        });
    });


    // --- Lógica para mostrar o botão de áudio após a primeira interação ---
    let userInteracted = false; 

    function handleUserInteraction() {
        if (!userInteracted) {
            if (playAudioBtn) {
                playAudioBtn.style.display = 'block';
            }
            
            // Tenta tocar o select.mp3 geral uma vez aqui, após a interação
            // Isso garante que o som 'select' (que é um som de UI) possa ser ouvido
            // logo após a primeira interação do usuário.
            selectAudioGeneral.currentTime = 0; // Usa o áudio geral
            selectAudioGeneral.play().catch(e => {
                console.warn("Reprodução inicial de 'select.mp3' após interação falhou:", e);
            });

            userInteracted = true;
            document.removeEventListener('scroll', handleUserInteraction);
            document.removeEventListener('mousemove', handleUserInteraction);
            document.removeEventListener('touchstart', handleUserInteraction);
            document.removeEventListener('click', handleUserInteraction);
        }
    }

    document.addEventListener('scroll', handleUserInteraction);
    document.addEventListener('mousemove', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    document.addEventListener('click', handleUserInteraction);
});