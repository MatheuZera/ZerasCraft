document.addEventListener('DOMContentLoaded', function() {
    // Função para detectar se é um dispositivo touch (simplificada)
    function isTouchDevice() {
        return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
    }

    const isMobile = isTouchDevice(); // Detecta uma vez na inicialização

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

    // --- Lógica para o som de clique em interações GERAIS (incluindo botões e links) ---
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

    // --- Lógica para reproduzir select.mp3 nos cards (diferente para PC e Mobile) ---
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
        if (!isMobile) {
            // Se for PC, usa mouseenter (passar o cursor)
            card.addEventListener('mouseenter', playSelectSoundGeneral);
        } else {
            // Lógica para mobile: tocar no card sem deslizar
            let startX, startY;
            let touchMoved = false;
            const DRAG_THRESHOLD_PX = 10; // 10 pixels de movimento para considerar deslize

            card.addEventListener('touchstart', function(event) {
                startX = event.touches[0].clientX;
                startY = event.touches[0].clientY;
                touchMoved = false; // Reseta a flag de movimento
            });

            card.addEventListener('touchmove', function(event) {
                const currentX = event.touches[0].clientX;
                const currentY = event.touches[0].clientY;
                const deltaX = Math.abs(currentX - startX);
                const deltaY = Math.abs(currentY - startY);

                if (deltaX > DRAG_THRESHOLD_PX || deltaY > DRAG_THRESHOLD_PX) {
                    touchMoved = true; // Se moveu além do limite, marca como deslize
                }
            });

            card.addEventListener('touchend', function(event) {
                // Se o toque terminou e NÃO houve deslize significativo
                if (!touchMoved) {
                    // Evita tocar o som de select se o clique for em um link/botão interno
                    // e você quiser que apenas o som de clique padrão seja reproduzido para esses elementos.
                    if (!event.target.closest('a, button, .btn-primary, .btn-secondary, .btn-link')) {
                        playSelectSoundGeneral();
                    } else if (event.target.tagName !== 'A' && event.target.tagName !== 'BUTTON') {
                        // Se clicou no card mas não diretamente em um link/botão dentro dele
                        playSelectSoundGeneral();
                    }
                }
            });

            // Adiciona um listener 'touchcancel' para garantir que o estado seja resetado
            card.addEventListener('touchcancel', function() {
                touchMoved = false;
            });
        }
    });

    // --- Lógica para reproduzir select.mp3 para CADA ITEM DA GRADE DE SEGURANÇA ---
    const securityGridItems = document.querySelectorAll('.security-grid-item');

    securityGridItems.forEach(item => {
        const itemSelectAudio = new Audio('audios/select.mp3');
        itemSelectAudio.preload = 'auto';
        itemSelectAudio.volume = 0.2;

        if (!isMobile) {
            // Se for PC, usa mouseenter
            item.addEventListener('mouseenter', function() {
                itemSelectAudio.currentTime = 0;
                itemSelectAudio.play().catch(e => {
                    console.warn("Reprodução de áudio 'select.mp3' para item da grade bloqueada ou falhou:", e);
                });
            });
        } else {
            // Lógica para mobile: tocar no item sem deslizar
            let startX, startY;
            let touchMoved = false;
            const DRAG_THRESHOLD_PX = 10; // 10 pixels de movimento para considerar deslize

            item.addEventListener('touchstart', function(event) {
                startX = event.touches[0].clientX;
                startY = event.touches[0].clientY;
                touchMoved = false;
            });

            item.addEventListener('touchmove', function(event) {
                const currentX = event.touches[0].clientX;
                const currentY = event.touches[0].clientY;
                const deltaX = Math.abs(currentX - startX);
                const deltaY = Math.abs(currentY - startY);

                if (deltaX > DRAG_THRESHOLD_PX || deltaY > DRAG_THRESHOLD_PX) {
                    touchMoved = true;
                }
            });

            item.addEventListener('touchend', function(event) {
                if (!touchMoved) {
                    itemSelectAudio.currentTime = 0;
                    itemSelectAudio.play().catch(e => {
                        console.warn("Reprodução de áudio 'select.mp3' para item da grade (toque) bloqueada ou falhou:", e);
                    });
                }
            });

            item.addEventListener('touchcancel', function() {
                touchMoved = false;
            });
        }
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
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('touchstart', handleUserInteraction);
        }
    }

    document.addEventListener('scroll', handleUserInteraction);
    document.addEventListener('mousemove', handleUserInteraction);
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
});