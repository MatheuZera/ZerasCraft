document.addEventListener('DOMContentLoaded', function() {
    // --- Lógica para o botão de áudio de fundo (Minecraft Audio) ---
    const minecraftAudio = document.getElementById('minecraftAudio');
    const playAudioBtn = document.getElementById('playAudioBtn');

    if (minecraftAudio) {
        minecraftAudio.volume = 0.7; // AJUSTE ESTE VALOR
    }

    if (playAudioBtn && minecraftAudio) {
        playAudioBtn.classList.add('play-audio-btn-off');
        playAudioBtn.classList.add('animating'); // Adiciona a classe de animação inicialmente
        let isPlaying = false; 

        playAudioBtn.addEventListener('click', function() {
            if (isPlaying) {
                minecraftAudio.pause();
                minecraftAudio.currentTime = 0;
                isPlaying = false;
                playAudioBtn.classList.remove('play-audio-btn-on');
                playAudioBtn.classList.add('play-audio-btn-off');
                playAudioBtn.classList.add('animating'); // Começa a animar quando pausado
            } else {
                minecraftAudio.play().catch(e => {
                    console.warn("Reprodução do áudio do Minecraft bloqueada ou falhou:", e);
                });
                isPlaying = true;
                playAudioBtn.classList.remove('play-audio-btn-off');
                playAudioBtn.classList.add('play-audio-btn-on');
                playAudioBtn.classList.remove('animating'); // Para a animação quando tocando
            }
        });

        minecraftAudio.addEventListener('ended', function() {
            isPlaying = false;
            playAudioBtn.classList.remove('play-audio-btn-on');
            playAudioBtn.classList.add('play-audio-btn-off');
            playAudioBtn.classList.add('animating'); // Começa a animar quando termina
        });

        minecraftAudio.addEventListener('pause', function() {
            if (isPlaying && minecraftAudio.paused) {
                isPlaying = false;
                playAudioBtn.classList.remove('play-audio-btn-on');
                playAudioBtn.classList.add('play-audio-btn-off');
                playAudioBtn.classList.add('animating'); // Começa a animar quando pausado
            }
        });

        minecraftAudio.addEventListener('play', function() {
            isPlaying = true;
            playAudioBtn.classList.remove('play-audio-btn-off');
            playAudioBtn.classList.add('play-audio-btn-on');
            playAudioBtn.classList.remove('animating'); // Para a animação quando tocando
        });

    } else {
        console.error("Erro: Elementos 'playAudioBtn' ou 'minecraftAudio' não encontrados no DOM. Verifique seus IDs no HTML.");
    }

    // --- Lógica para o som de clique em interações ---
    const clickAudio = new Audio('audios/click.mp3');
    clickAudio.preload = 'auto'; 
    clickAudio.volume = 0.4;

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
    const interactiveCardsGeneral = document.querySelectorAll(
        '.service-card:not(.security-card), .role-category-card, .event-card, .community-card, .partnership-card'
    );

    const selectAudioGeneral = new Audio('audios/select.mp3');
    selectAudioGeneral.preload = 'auto';
    selectAudioGeneral.volume = 0.3;

    function playSelectSoundGeneral() {
        selectAudioGeneral.currentTime = 0;
        selectAudioGeneral.play().catch(e => {
            console.warn("Reprodução de áudio 'select.mp3' (geral) bloqueada ou falhou:", e);
        });
    }

    interactiveCardsGeneral.forEach(card => {
        card.addEventListener('mouseenter', playSelectSoundGeneral);
        card.addEventListener('touchstart', playSelectSoundGeneral); // <--- Adicionado para touch
    });

    // --- NOVO: Lógica para reproduzir select.mp3 para CADA ITEM DA GRADE DE SEGURANÇA ---
    const securityGridItems = document.querySelectorAll('.security-grid-item');

    securityGridItems.forEach(item => {
        const itemSelectAudio = new Audio('audios/select.mp3');
        itemSelectAudio.preload = 'auto';
        itemSelectAudio.volume = 0.2;

        item.addEventListener('mouseenter', function() {
            itemSelectAudio.currentTime = 0;
            itemSelectAudio.play().catch(e => {
                console.warn("Reprodução de áudio 'select.mp3' para item da grade bloqueada ou falhou:", e);
            });
        });
        item.addEventListener('touchstart', function() { // <--- Adicionado para touch
            itemSelectAudio.currentTime = 0;
            itemSelectAudio.play().catch(e => {
                console.warn("Reprodução de áudio 'select.mp3' para item da grade (touch) bloqueada ou falhou:", e);
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
            
            selectAudioGeneral.currentTime = 0;
            selectAudioGeneral.play().catch(e => {
                console.warn("Reprodução inicial de 'select.mp3' após interação falhou:", e);
            });

            userInteracted = true;
            document.removeEventListener('scroll', handleUserInteraction);
            document.removeEventListener('mousemove', handleUserInteraction);
            document.removeEventListener('touchstart', handleUserInteraction); // Importante remover aqui também
            document.removeEventListener('click', handleUserInteraction);
        }
    }

    // Adiciona o listener de touchstart para a primeira interação também
    document.addEventListener('scroll', handleUserInteraction);
    document.addEventListener('mousemove', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction); // Adicionado para mobile
    document.addEventListener('click', handleUserInteraction);
});