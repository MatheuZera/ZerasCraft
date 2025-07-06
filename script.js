document.addEventListener('DOMContentLoaded', function() {
    // Função para detectar se é um dispositivo touch (simplificada)
    function isTouchDevice() {
        return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
    }

    const isMobile = isTouchDevice(); // Detecta uma vez na inicialização

    // --- Lógica para o botão de áudio de fundo (Minecraft Audio) ---
    const playAudioBtn = document.getElementById('playAudioBtn');

    // Lista de músicas para a playlist aleatória
    const playlist = [
        'audios/musics/Aria-Math-Lofi-Remake.mp3', // ALtere para os nomes reais dos seus arquivos
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

    let currentTrackIndex = -1; // -1 para indicar que nenhuma música foi selecionada ainda
    const backgroundAudio = new Audio(); // Crie um objeto de áudio sem src inicial
    backgroundAudio.volume = 0.7; // AJUSTE ESTE VALOR
    backgroundAudio.preload = 'auto'; // Carrega o áudio mais rápido

    // Função para tocar a próxima música aleatoriamente
    function playNextRandomTrack() {
        if (playlist.length === 0) {
            console.warn("Playlist vazia. Não há músicas para tocar.");
            return;
        }

        let nextTrackIndex;
        do {
            nextTrackIndex = Math.floor(Math.random() * playlist.length);
        } while (nextTrackIndex === currentTrackIndex && playlist.length > 1); // Evita tocar a mesma música duas vezes seguidas, se houver mais de uma

        currentTrackIndex = nextTrackIndex;
        backgroundAudio.src = playlist[currentTrackIndex];
        
        backgroundAudio.play().catch(e => {
            console.warn("Reprodução do áudio de fundo bloqueada ou falhou:", e);
            // Se a reprodução falhou (geralmente por autoplay policy), o botão permanecerá OFF
            // E o estado 'isPlaying' não será atualizado para true imediatamente.
        });
    }

    if (playAudioBtn) {
        playAudioBtn.classList.add('play-audio-btn-off');
        playAudioBtn.classList.add('animating'); // Adiciona a classe de animação inicialmente
        let isPlaying = false; 

        playAudioBtn.addEventListener('click', function() {
            if (isPlaying) {
                backgroundAudio.pause();
                backgroundAudio.currentTime = 0; // Opcional: Reinicia a música ao pausar
                isPlaying = false;
                playAudioBtn.classList.remove('play-audio-btn-on');
                playAudioBtn.classList.add('play-audio-btn-off');
                playAudioBtn.classList.add('animating'); // Começa a animar quando pausado
            } else {
                // Ao clicar para tocar, toca a próxima música aleatória
                playNextRandomTrack();
                isPlaying = true; // Assume que vai tocar, mas o catch() pode ajustar
                playAudioBtn.classList.remove('play-audio-btn-off');
                playAudioBtn.classList.add('play-audio-btn-on');
                playAudioBtn.classList.remove('animating'); // Para a animação quando tocando
            }
        });

        // Evento quando uma música termina: toca a próxima aleatoriamente
        backgroundAudio.addEventListener('ended', function() {
            playNextRandomTrack();
        });

        // Eventos para gerenciar o estado visual do botão
        backgroundAudio.addEventListener('pause', function() {
            if (isPlaying && backgroundAudio.paused) { // Verifica se estava tocando e foi pausado
                isPlaying = false;
                playAudioBtn.classList.remove('play-audio-btn-on');
                playAudioBtn.classList.add('play-audio-btn-off');
                playAudioBtn.classList.add('animating');
            }
        });

        backgroundAudio.addEventListener('play', function() {
            isPlaying = true;
            playAudioBtn.classList.remove('play-audio-btn-off');
            playAudioBtn.classList.add('play-audio-btn-on');
            playAudioBtn.classList.remove('animating');
        });

    } else {
        console.error("Erro: Elemento 'playAudioBtn' não encontrado no DOM. Verifique seu ID no HTML.");
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
            
            // Toca a música aleatória de fundo na primeira interação do usuário
            // Isso também é importante para contornar políticas de autoplay de navegadores.
            playNextRandomTrack(); // Chama a função para tocar a primeira música aleatória
            
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