document.addEventListener('DOMContentLoaded', function() {
    // Detecta se é um dispositivo touch (mais robusto)
    const isTouchDevice = () => {
        return (('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0));
    };

    const isMobile = isTouchDevice();

    // --- Áudio de Fundo (Música do Minecraft) ---
    const playAudioBtn = document.getElementById('playAudioBtn');
    const backgroundAudio = new Audio();
    backgroundAudio.volume = 0.7; // AJUSTE ESTE VALOR
    backgroundAudio.preload = 'auto';
    let isPlaying = false;
    let currentTrackIndex = -1;

    // Lista de músicas (ajuste os caminhos se necessário)
    const playlist = [
        'audios/musics/Aria-Math-Lofi-Remake.mp3',
        'audios/musics/Aria-Math.mp3',
        'audios/musics/Begining.mp3',
        'audios/musics/Biome-Fest.mp3',
        'audios/musics/Blind-Spots.mp3',
        'audios/musics/Clark.mp3',
        'audios/musics/Danny.mp3',
        'audios/musics/Dreiton.mp3',
        'audios/musics/Dry-Hands.mp3',
        'audios/musics/Floating.mp3',
        'audios/musics/Haggstrom.mp3',
        'audios/musics/haunt-Muskie.mp3',
        'audios/musics/Key.mp3',
        'audios/musics/Living-Mice.mp3',
        'audios/musics/Minecraft.mp3',
        'audios/musics/Moong-City.mp3',
        'audios/musics/Mutation.mp3',
        'audios/musics/Oxygène.mp3',
        'audios/musics/Subwoofer-Lullaby.mp3',
        'audios/musics/Sweden.mp3',
        'audios/musics/Taswell.mp3',
        'audios/musics/Wet-Hands.mp3',
    ];

    function playNextRandomTrack() {
        if (playlist.length === 0) {
            console.warn("Playlist vazia. Nenhuma música para tocar.");
            return;
        }

        let nextTrackIndex;
        do {
            nextTrackIndex = Math.floor(Math.random() * playlist.length);
        } while (nextTrackIndex === currentTrackIndex && playlist.length > 1);

        currentTrackIndex = nextTrackIndex;
        backgroundAudio.src = playlist[currentTrackIndex];
        
        backgroundAudio.play().catch(e => {
            console.warn("Reprodução do áudio de fundo bloqueada ou falhou:", e);
            isPlaying = false; // Garante que o estado seja falso se falhar
            updateAudioButtonState();
        });
    }

    function updateAudioButtonState() {
        if (isPlaying) {
            playAudioBtn.classList.remove('play-audio-btn-off', 'animating');
            playAudioBtn.classList.add('play-audio-btn-on');
        } else {
            playAudioBtn.classList.remove('play-audio-btn-on');
            playAudioBtn.classList.add('play-audio-btn-off', 'animating');
        }
    }

    if (playAudioBtn) {
        updateAudioButtonState(); // Define o estado inicial do botão

        playAudioBtn.addEventListener('click', function() {
            if (isPlaying) {
                backgroundAudio.pause();
                backgroundAudio.currentTime = 0;
            } else {
                playNextRandomTrack();
            }
            isPlaying = !isPlaying; // Inverte o estado após a tentativa de play/pause
            updateAudioButtonState();
        });

        backgroundAudio.addEventListener('ended', playNextRandomTrack);
        backgroundAudio.addEventListener('pause', () => { // Listener mais robusto
            if (isPlaying && backgroundAudio.paused) { // Garante que foi uma pausa intencional ou falha
                isPlaying = false;
                updateAudioButtonState();
            }
        });
        backgroundAudio.addEventListener('play', () => { // Listener mais robusto
            if (!isPlaying && !backgroundAudio.paused) { // Garante que está realmente tocando
                isPlaying = true;
                updateAudioButtonState();
            }
        });
    } else {
        console.error("Erro: Elemento 'playAudioBtn' não encontrado no DOM.");
    }

    // --- Som de Clique Geral ---
    const clickAudio = new Audio('audios/click.mp3');
    clickAudio.preload = 'auto'; 
    clickAudio.volume = 0.4;

    document.addEventListener('click', function(event) {
        const clickedElement = event.target;
        // Check if the clicked element or its closest ancestor is a clickable element,
        // but not the main audio button itself.
        const isClickable = clickedElement.closest('a, button, .btn-primary, .btn-secondary, .btn-link, .btn-pixel-legends, .btn-copy-ip');
        
        if (isClickable && isClickable.id !== 'playAudioBtn') {
            clickAudio.currentTime = 0;
            clickAudio.play().catch(e => console.warn("Erro ao reproduzir som de clique:", e));
        }
    });

    // --- Som de Seleção (Hover/Tap em Cards) ---
    const interactiveCardsSelector = `
        .service-card:not(.security-card), 
        .role-category-card, 
        .event-card, 
        .community-card, 
        .partnership-card, 
        .access-card, 
        .feature-card,
        .security-grid-item
    `;
    const interactiveCards = document.querySelectorAll(interactiveCardsSelector);
    const selectAudio = new Audio('audios/select.mp3');
    selectAudio.preload = 'auto';
    selectAudio.volume = 0.3; // Ajuste para o volume desejado

    function playSelectSound(audioElement) {
        audioElement.currentTime = 0;
        audioElement.play().catch(e => console.warn("Reprodução de áudio 'select.mp3' bloqueada ou falhou:", e));
    }

    interactiveCards.forEach(card => {
        if (!isMobile) {
            card.addEventListener('mouseenter', () => playSelectSound(selectAudio));
        } else {
            // Lógica de toque para dispositivos móveis
            let startX, startY;
            let touchMoved = false;
            const DRAG_THRESHOLD_PX = 10;

            card.addEventListener('touchstart', (event) => {
                startX = event.touches[0].clientX;
                startY = event.touches[0].clientY;
                touchMoved = false;
            });

            card.addEventListener('touchmove', (event) => {
                const currentX = event.touches[0].clientX;
                const currentY = event.touches[0].clientY;
                const deltaX = Math.abs(currentX - startX);
                const deltaY = Math.abs(currentY - startY);

                if (deltaX > DRAG_THRESHOLD_PX || deltaY > DRAG_THRESHOLD_PX) {
                    touchMoved = true;
                }
            });

            card.addEventListener('touchend', (event) => {
                // Toca o som APENAS se não houve deslize e se o toque não foi em um link/botão interno
                if (!touchMoved && !event.target.closest('a, button, .btn-pixel-legends, .btn-copy-ip')) {
                    playSelectSound(selectAudio);
                }
            });

            card.addEventListener('touchcancel', () => {
                touchMoved = false;
            });
        }
    });

    // --- Copiar IP do Servidor ---
    const copyButtons = document.querySelectorAll('.btn-copy-ip');
    const notificationSound = document.getElementById('notificationSound');
    if (notificationSound) {
        notificationSound.volume = 0.5;
    }

    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const ip = this.dataset.ip;
            const port = this.dataset.port;
            const textToCopy = port ? `${ip}:${port}` : ip;

            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    const originalText = this.textContent;
                    this.textContent = 'Copiado!';
                    this.disabled = true;

                    if (notificationSound) {
                        notificationSound.currentTime = 0;
                        notificationSound.play().catch(e => console.warn("Erro ao reproduzir som de notificação:", e));
                    }
                    
                    setTimeout(() => {
                        this.textContent = originalText;
                        this.disabled = false;
                    }, 1500);
                })
                .catch(err => {
                    console.error('Falha ao copiar:', err);
                    alert('Erro ao copiar o IP. Tente manualmente: ' + textToCopy);
                });
        });
    });

    // --- Mostrar Botão de Áudio e Iniciar Playback na Primeira Interação do Usuário ---
    let userInteracted = false; 

    function handleFirstUserInteraction() {
        if (!userInteracted) {
            if (playAudioBtn) {
                playAudioBtn.style.display = 'block';
            }
            // Inicia a reprodução de áudio de fundo aqui para contornar políticas de autoplay
            playNextRandomTrack();
            userInteracted = true;
            // Remove os listeners após a primeira interação para evitar execução desnecessária
            document.removeEventListener('scroll', handleFirstUserInteraction);
            document.removeEventListener('mousemove', handleFirstUserInteraction);
            document.removeEventListener('click', handleFirstUserInteraction);
            document.removeEventListener('touchstart', handleFirstUserInteraction);
        }
    }

    // Adiciona listeners para várias formas de interação do usuário
    document.addEventListener('scroll', handleFirstUserInteraction);
    document.addEventListener('mousemove', handleFirstUserInteraction);
    document.addEventListener('click', handleFirstUserInteraction);
    document.addEventListener('touchstart', handleFirstUserInteraction);
});