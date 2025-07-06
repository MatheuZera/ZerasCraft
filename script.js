document.addEventListener('DOMContentLoaded', function() {

    /* ========================================= */
    /* UTILITIES                                 */
    /* ========================================= */

    /**
     * Detects if the device is touch.
     * @returns {boolean} True if it's a touch device, false otherwise.
     */
    function isTouchDevice() {
        return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
    }

    const isMobile = isTouchDevice(); // Detects once on initialization

    /**
     * Copies the provided text to the clipboard.
     * @param {string} text - The text to be copied.
     * @returns {Promise<boolean>} A Promise that resolves to true if the copy is successful, false otherwise.
     */
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true; // Returns true to indicate success
        } catch (err) {
            console.error('Failed to copy:', err);
            // Fallback for older methods if the modern API fails or is unavailable
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed"; // Prevents scrolling off-screen
            textArea.style.left = "-9999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                document.body.removeChild(textArea);
                return true;
            } catch (fallbackErr) {
                console.error('Failed to copy via fallback:', fallbackErr);
                document.body.removeChild(textArea);
                return false; // Returns false to indicate failure
            }
        }
    }

    /**
     * Shows a temporary "toast" notification on the screen.
     * @param {string} message - The message to be displayed.
     * @param {number} duration - Duration in milliseconds the toast will be visible (default: 3000).
     */
    function showToast(message, duration = 3000) {
        const toast = document.createElement('div');
        toast.classList.add('toast-notification');
        toast.textContent = message;
        document.body.appendChild(toast);

        // Force reflow to ensure CSS transition works
        void toast.offsetWidth;

        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => {
                toast.remove();
            }, {
                once: true
            });
        }, duration);
    }

    /* ========================================= */
    /* BACKGROUND AUDIO (MINECRAFT-STYLE)        */
    /* ========================================= */

   document.addEventListener('DOMContentLoaded', () => {
    const playAudioBtn = document.getElementById('playAudioBtn');
    const audioPlayer = new Audio();
    audioPlayer.loop = false; // Queremos que toque uma vez e vá para a próxima
    audioPlayer.volume = 0.5; // Começa com volume médio
    let currentMusicIndex = 0;
    let isPlaying = false;

    // Elementos do toast e do arco de progresso
    const audioInfoToast = document.getElementById('audioInfoToast');
    const progressBarArc = playAudioBtn.querySelector('span');

    const musicList = [
        'audios/musics/Aria-Math-Lofi-Remake.mp3',
        'audios/musics/Aria-Math.mp3',
        'audios/musics/Begining.mp3',
        'audios/musics/Biome-Fest.mp3',
        'audios/musics/Blind-Spots.mp3',
        'audios/musics/Clark.mp3',
        'audios/musics/Danny.mp3',
        'audios/musics/Dreiton.mp3',
        'audios/musics/Dry-Hands.mp3',
        'audios/musics/Floating-Trees.mp3',
        'audios/musics/Haggstrom.mp3',
        'audios/musics/haunt-Muskie.mp3',
        'audios/musics/Key.mp3',
        'audios/musics/Living-Mice.mp3',
        'audios/musics/Mice-On-Venus.mp3',
        'audios/musics/Minecraft.mp3',
        'audios/musics/Moog-City-2.mp3',
        'audios/musics/Mutation.mp3',
        'audios/musics/Oxygène.mp3',
        'audios/musics/Subwoofer-Lullaby.mp3',
        'audios/musics/Sweden.mp3',
        'audios/musics/Taswell.mp3',
        'audios/musics/Wet-Hands.mp3',
    ];

    // Shuffle music list
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    shuffleArray(musicList); // Embaralha a lista de músicas ao carregar

    // Função para extrair o nome da música do caminho
    function getMusicName(path) {
        const parts = path.split('/');
        const fileName = parts[parts.length - 1]; // Obtém "NomeDaMusica.mp3"
        return fileName.replace('.mp3', '').replace(/-/g, ' '); // Remove .mp3 e substitui hífens por espaços
    }

    // Função para mostrar o toast
    function showAudioInfoToast(message) {
        audioInfoToast.textContent = message;
        audioInfoToast.classList.remove('animate-out'); // Reseta a animação se já estiver rodando
        audioInfoToast.classList.add('show');

        // Garante que a animação rode do início
        void audioInfoToast.offsetWidth; // Trigger reflow to restart animation
        audioInfoToast.classList.add('animate-out');

        // Esconde o toast após a animação
        setTimeout(() => {
            audioInfoToast.classList.remove('show', 'animate-out');
        }, 4000); // Duração total da animação (4s)
    }

    // Função para tocar a próxima música na playlist
    function playNextMusic() {
        if (musicList.length === 0) {
            console.warn("Nenhuma música na lista.");
            return;
        }

        audioPlayer.src = musicList[currentMusicIndex];
        audioPlayer.play()
            .then(() => {
                isPlaying = true;
                playAudioBtn.classList.add('play-audio-btn-on');
                playAudioBtn.classList.remove('play-audio-btn-off', 'animating');
                const musicName = getMusicName(musicList[currentMusicIndex]);
                showAudioInfoToast(`Tocando: ${musicName}`);
            })
            .catch(error => {
                console.error("Erro ao tocar música:", error);
                isPlaying = false;
                playAudioBtn.classList.remove('play-audio-btn-on');
                playAudioBtn.classList.add('play-audio-btn-off');
            });

        currentMusicIndex = (currentMusicIndex + 1) % musicList.length; // Avança para a próxima música (loop)
    }

    // Event Listener para o botão de áudio
    playAudioBtn.addEventListener('click', () => {
        if (isPlaying) {
            audioPlayer.pause();
            isPlaying = false;
            playAudioBtn.classList.remove('play-audio-btn-on');
            playAudioBtn.classList.add('play-audio-btn-off');
            playAudioBtn.classList.remove('animating'); // Remove a animação se a música for pausada manualmente
            progressBarArc.style.transform = 'rotate(0deg)'; // Reseta o arco
            progressBarArc.style.transition = 'none'; // Remove transição para o reset
        } else {
            // Tenta tocar a música atual ou a próxima se for a primeira vez
            if (!audioPlayer.src || audioPlayer.paused) {
                playNextMusic();
            } else {
                audioPlayer.play()
                    .then(() => {
                        isPlaying = true;
                        playAudioBtn.classList.add('play-audio-btn-on');
                        playAudioBtn.classList.remove('play-audio-btn-off', 'animating');
                        // Mostra o toast novamente se a música estava pausada
                        const musicName = getMusicName(musicList[currentMusicIndex > 0 ? currentMusicIndex - 1 : musicList.length - 1]); // Pega o nome da música atual
                        showAudioInfoToast(`Retomando: ${musicName}`);
                        progressBarArc.style.transition = 'transform linear'; // Volta a transição para o arco
                    })
                    .catch(error => {
                        console.error("Erro ao retomar música:", error);
                        playAudioBtn.classList.remove('play-audio-btn-on');
                        playAudioBtn.classList.add('play-audio-btn-off');
                    });
            }
        }
    });

    // Atualiza o progresso do arco
    audioPlayer.addEventListener('timeupdate', () => {
        if (isPlaying) {
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 360; // 0 a 360 graus
            progressBarArc.style.transform = `rotate(${progress}deg)`;
        }
    });

    // Quando a música termina, toca a próxima
    audioPlayer.addEventListener('ended', () => {
        playNextMusic();
    });

    // Início: Tenta tocar a primeira música automaticamente (pode ser bloqueado pelos navegadores)
    // Uma boa prática é iniciar a reprodução após uma interação do usuário.
    // audioPlayer.src = musicList[currentMusicIndex];
    // playAudioBtn.classList.add('animating'); // Adiciona animação de "chamar"
});

// Implementação da função showToast, caso ainda não exista no seu script.js
function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.classList.add('toast-notification');
    toast.textContent = message;
    document.body.appendChild(toast);

    // Force reflow to enable transition
    void toast.offsetWidth;

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => {
            toast.remove();
        }, { once: true });
    }, duration);
}

    /* ========================================= */
    /* CLICK SOUNDS FOR INTERACTIVE ELEMENTS     */
    /* ========================================= */

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

        // Plays the click sound only if the element is clickable AND NOT the main audio button
        if (isClickable && !isMainAudioButton) {
            clickAudio.currentTime = 0;
            clickAudio.play().catch(e => {
                console.warn("Error playing click sound:", e);
            });
        }
    });

    /* ========================================= */
    /* HOVER/TOUCH SOUNDS FOR CARDS (SELECT.MP3) */
    /* ========================================= */

    const interactiveCardsGeneral = document.querySelectorAll(
        '.service-card:not(.security-card), .role-category-card, .event-card, .community-card, .partnership-card, .pixel-legends-btn'
    );
    const securityGridItems = document.querySelectorAll('.security-grid-item');

    const DRAG_THRESHOLD_PX = 10; // 10 pixels of movement to consider a swipe

    /**
     * Sets up "selection" audio listeners for cards,
     * differentiating mouseenter for desktop and touch for mobile.
     * @param {NodeList} elements - Collection of elements (cards) to be monitored.
     * @param {number} volume - Volume for the selection audio.
     * @param {boolean} preventClickBubble - If true, checks if the click is on a clickable sub-element.
     */
    function setupCardHoverSound(elements, volume, preventClickBubble = false) {
        const selectAudio = new Audio('audios/select.mp3');
        selectAudio.preload = 'auto';
        selectAudio.volume = volume;

        function playSound() {
            selectAudio.currentTime = 0;
            selectAudio.play().catch(e => {
                console.warn(`'select.mp3' audio playback (volume ${volume}) blocked or failed:`, e);
            });
        }

        elements.forEach(card => {
            if (!isMobile) {
                // If it's a PC, use mouseenter (hover the cursor)
                card.addEventListener('mouseenter', playSound);
            } else {
                // Logic for mobile: tap the card without swiping
                let startX, startY;
                let touchMoved = false;

                card.addEventListener('touchstart', function(event) {
                    startX = event.touches[0].clientX;
                    startY = event.touches[0].clientY;
                    touchMoved = false;
                });

                card.addEventListener('touchmove', function(event) {
                    const currentX = event.touches[0].clientX;
                    const currentY = event.touches[0].clientY;
                    const deltaX = Math.abs(currentX - startX);
                    const deltaY = Math.abs(currentY - startY);

                    if (deltaX > DRAG_THRESHOLD_PX || deltaY > DRAG_THRESHOLD_PX) {
                        touchMoved = true;
                    }
                });

                card.addEventListener('touchend', function(event) {
                    if (!touchMoved) {
                        // If preventClickBubble is true, check if the click was on an internal interactive element
                        if (preventClickBubble && event.target.closest('a, button, .btn-primary, .btn-secondary, .btn-link')) {
                            // Clicked on a link/button inside the card, do not play the select sound
                            return;
                        }
                        playSound();
                    }
                });

                card.addEventListener('touchcancel', function() {
                    touchMoved = false;
                });
            }
        });
    }

    // Applies the logic for general cards
    setupCardHoverSound(interactiveCardsGeneral, 0.3, true);

    // Applies the logic for security grid items (with different volume)
    setupCardHoverSound(securityGridItems, 0.2);

    /* ========================================= */
    /* COPY IP/PORT BUTTONS                      */
    /* ========================================= */

    const copyButtons = document.querySelectorAll('.copy-btn'); // Selects all buttons with this class

    copyButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const targetId = this.dataset.target;
            let textToCopy = '';

            if (targetId === 'bedrock-ip-port') {
                const ip = document.getElementById('bedrock-ip').textContent;
                const port = document.getElementById('bedrock-port').textContent;
                textToCopy = `${ip}:${port}`;
            } else if (targetId === 'java-address') {
                textToCopy = document.getElementById('java-address').textContent;
            }

            if (textToCopy) {
                const success = await copyToClipboard(textToCopy);
                if (success) {
                    showToast('Copiado: ' + textToCopy, 2000); // Shows toast for 2 seconds
                } else {
                    showToast('Falha ao copiar. Tente novamente!', 3000);
                }
            } else {
                console.warn('Conteúdo para copiar não encontrado.');
            }
        });
    });


    /* ========================================= */
    /* INITIAL USER INTERACTION HANDLER          */
    /* ========================================= */

    let userInteracted = false;

    /**
     * Handles the first user interaction to enable background audio
     * and show the audio control button.
     */
    function handleUserInteraction() {
        if (!userInteracted) {
            if (playAudioBtn) {
                playAudioBtn.style.display = 'flex'; // Shows the button as flex to center content
            }

            // Plays random background music on the first user interaction.
            // This is crucial to bypass browser autoplay policies.
            playNextRandomTrack();

            userInteracted = true;
            // Removes listeners after the first interaction to avoid unnecessary execution
            document.removeEventListener('scroll', handleUserInteraction);
            document.removeEventListener('mousemove', handleUserInteraction);
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('touchstart', handleUserInteraction);
        }
    }

    // Adds listeners to detect the first user interaction
    document.addEventListener('scroll', handleUserInteraction);
    document.addEventListener('mousemove', handleUserInteraction);
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    // ========================================= //
    // FUNCTIONS AND EVENTS FOR THE PIXEL LEGENDS INTERACTIVE CARD //
    // ========================================= //

    const pixelLegendsCard = document.getElementById('pixelLegendsCard');
    const expandBtn = pixelLegendsCard ? pixelLegendsCard.querySelector('.expand-btn') : null;
    const cardContentWrapper = pixelLegendsCard ? pixelLegendsCard.querySelector('.card-content-wrapper') : null;

    // Loads the sounds (ensure these paths are correct, potentially "audios/select.mp3" etc.)
    const selectSound = new Audio('audios/select.mp3');
    const clickSound = new Audio('audios/click.mp3');
    selectSound.preload = 'auto';
    clickSound.preload = 'auto';

    // Function to play the selection sound
    function playSelectSound() {
        if (!selectSound.paused) {
            selectSound.pause();
            selectSound.currentTime = 0;
        }
        selectSound.play().catch(e => console.error("Error playing 'select.mp3' sound:", e));
    }

    // Function to play the click sound
    function playClickSound() {
        if (!clickSound.paused) {
            clickSound.pause();
            clickSound.currentTime = 0;
        }
        clickSound.play().catch(e => console.error("Error playing 'click.mp3' sound:", e));
    }

    // Hover event for the card (plays select.mp3)
    if (pixelLegendsCard) {
        pixelLegendsCard.addEventListener('mouseenter', () => {
            playSelectSound();
        });
    }

    // Click event for the expand button (plays click.mp3 and expands)
    if (expandBtn && cardContentWrapper && pixelLegendsCard) {
        expandBtn.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevents the click from propagating to the entire card
            playClickSound();

            const isExpanded = pixelLegendsCard.classList.toggle('expanded');
            expandBtn.setAttribute('aria-expanded', isExpanded);
        });

        // Click event on the card to expand/collapse (except on the button or internal links/buttons)
        pixelLegendsCard.addEventListener('click', (event) => {
            // If the click was not on the expand button, or on a link/button inside the content
            if (!expandBtn.contains(event.target) && !event.target.closest('a') && !event.target.closest('button')) {
                playClickSound();
                const isExpanded = pixelLegendsCard.classList.toggle('expanded');
                expandBtn.setAttribute('aria-expanded', isExpanded);
            }
        });
    }

    // ========================================= //
    // RESTART AUDIO BUTTON ANIMATION (EXISTING) //
    // ========================================= //

    if (playAudioBtn) {
        // Removes and adds the class to restart the animation
        playAudioBtn.classList.remove('animating');
        void playAudioBtn.offsetWidth; // Trigger reflow
        playAudioBtn.classList.add('animating');
        playAudioBtn.style.display = 'flex'; // Ensures the button is visible
    }
});