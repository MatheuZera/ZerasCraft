document.addEventListener('DOMContentLoaded', function() {



    /* ========================================= */

    /* UTILITIES                                 */

    /* ========================================= */



    /**

     * Detecta se o dispositivo é touch.

     * @returns {boolean} True se for um dispositivo touch, false caso contrário.

     */

    function isTouchDevice() {

        return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);

    }



    const isMobile = isTouchDevice(); // Detecta uma vez na inicialização



    /**

     * Copia o texto fornecido para a área de transferência.

     * @param {string} text - O texto a ser copiado.

     * @returns {Promise<void>} Uma Promise que resolve se a cópia for bem-sucedida.

     */

    async function copyToClipboard(text) {

        try {

            await navigator.clipboard.writeText(text);

            return true; // Retorna true para indicar sucesso

        } catch (err) {

            console.error('Falha ao copiar:', err);

            // Fallback para métodos antigos se a API moderna falhar ou não estiver disponível

            const textArea = document.createElement("textarea");

            textArea.value = text;

            textArea.style.position = "fixed"; // Evita que role para fora da tela

            textArea.style.left = "-9999px";

            document.body.appendChild(textArea);

            textArea.focus();

            textArea.select();

            try {

                document.execCommand('copy');

                document.body.removeChild(textArea);

                return true;

            } catch (fallbackErr) {

                console.error('Falha ao copiar via fallback:', fallbackErr);

                document.body.removeChild(textArea);

                return false; // Retorna false para indicar falha

            }

        }

    }



    /**

     * Mostra uma notificação de "toast" temporária na tela.

     * @param {string} message - A mensagem a ser exibida.

     * @param {number} duration - Duração em milissegundos que o toast ficará visível (padrão: 3000).

     */

    function showToast(message, duration = 3000) {

        const toast = document.createElement('div');

        toast.classList.add('toast-notification');

        toast.textContent = message;

        document.body.appendChild(toast);



        // Forçar reflow para garantir que a transição CSS funcione

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

    /* BACKGROUND AUDIO (MINECRAFT-STYLE)        */

    /* ========================================= */



    const playAudioBtn = document.getElementById('playAudioBtn');

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



    let currentTrackIndex = -1; // -1 para indicar que nenhuma música foi selecionada ainda

    const backgroundAudio = new Audio();

    backgroundAudio.volume = 0.7; // AJUSTE ESTE VALOR

    backgroundAudio.preload = 'auto';



    /**

     * Toca a próxima música aleatória da playlist.

     */

    function playNextRandomTrack() {

        if (playlist.length === 0) {

            console.warn("Playlist vazia. Não há músicas para tocar.");

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

            // Se a reprodução falhou (geralmente por autoplay policy), o botão permanecerá OFF.

            // O estado 'isPlaying' não será atualizado para true imediatamente por aqui.

        });

    }



    if (playAudioBtn) {

        playAudioBtn.classList.add('play-audio-btn-off');

        playAudioBtn.classList.add('animating'); // Adiciona a classe de animação inicialmente

        let isPlaying = false; // Estado interno para controlar se o áudio está tocando



        playAudioBtn.addEventListener('click', function() {

            if (isPlaying) {

                backgroundAudio.pause();

                backgroundAudio.currentTime = 0; // Opcional: Reinicia a música ao pausar

                // isPlaying é atualizado pelo listener 'pause'

            } else {

                playNextRandomTrack();

                // isPlaying é atualizado pelo listener 'play'

            }

            // A atualização das classes 'play-audio-btn-on/off' e 'animating'

            // é feita pelos listeners 'play' e 'pause' do backgroundAudio.

        });



        // Evento quando uma música termina: toca a próxima aleatoriamente

        backgroundAudio.addEventListener('ended', function() {

            playNextRandomTrack();

        });



        // Eventos para gerenciar o estado visual do botão com base no player de áudio

        backgroundAudio.addEventListener('pause', function() {

            // Verifica se a pausa foi intencional (pelo usuário) ou automática (final da música)

            // Se o áudio foi pausado e não está mais tocando, atualiza o estado

            // Não confie em backgroundAudio.playing, pois não é padrão. Use backgroundAudio.paused

            if (backgroundAudio.paused) {

                isPlaying = false;

                playAudioBtn.classList.remove('play-audio-btn-on');

                playAudioBtn.classList.add('play-audio-btn-off');

                playAudioBtn.classList.add('animating'); // Começa a animar quando pausado

            }

        });



        backgroundAudio.addEventListener('play', function() {

            isPlaying = true;

            playAudioBtn.classList.remove('play-audio-btn-off');

            playAudioBtn.classList.add('play-audio-btn-on');

            playAudioBtn.classList.remove('animating'); // Para a animação quando tocando

        });



    } else {

        console.error("Erro: Elemento 'playAudioBtn' não encontrado no DOM. Verifique seu ID no HTML.");

    }



    /* ========================================= */

    /* CLICK SOUNDS FOR INTERACTIVE ELEMENTS     */

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



        // Toca o som de clique apenas se o elemento for clicável E NÃO for o botão de áudio principal

        if (isClickable && !isMainAudioButton) {

            clickAudio.currentTime = 0;

            clickAudio.play().catch(e => {

                console.warn("Erro ao reproduzir som de clique:", e);

            });

        }

    });



    /* ========================================= */

    /* HOVER/TOUCH SOUNDS FOR CARDS (SELECT.MP3) */

    /* ========================================= */



    const interactiveCardsGeneral = document.querySelectorAll(

        '.service-card:not(.security-card), .role-category-card, .event-card, .community-card, .partnership-card, .pixel-legends-btn'

        // Adicionada a classe '.pixel-legends-btn' aqui

    );

    const securityGridItems = document.querySelectorAll('.security-grid-item');



    const DRAG_THRESHOLD_PX = 10; // 10 pixels de movimento para considerar deslize



    /**

     * Configura listeners de áudio de "seleção" para cards,

     * diferenciando mouseenter para desktop e toque para mobile.

     * @param {NodeList} elements - Coleção de elementos (cards) a serem monitorados.

     * @param {number} volume - Volume para o áudio de seleção.

     * @param {boolean} preventClickBubble - Se true, verifica se o clique é em um sub-elemento clicável.

     */

    function setupCardHoverSound(elements, volume, preventClickBubble = false) {

        const selectAudio = new Audio('audios/select.mp3');

        selectAudio.preload = 'auto';

        selectAudio.volume = volume;



        function playSound() {

            selectAudio.currentTime = 0;

            selectAudio.play().catch(e => {

                console.warn(`Reprodução de áudio 'select.mp3' (volume ${volume}) bloqueada ou falhou:`, e);

            });

        }



        elements.forEach(card => {

            if (!isMobile) {

                // Se for PC, usa mouseenter (passar o cursor)

                card.addEventListener('mouseenter', playSound);

            } else {

                // Lógica para mobile: tocar no card sem deslizar

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

                        // Se preventClickBubble for true, verifica se o clique foi em um elemento interativo interno

                        if (preventClickBubble && event.target.closest('a, button, .btn-primary, .btn-secondary, .btn-link')) {

                            // Clicou em um link/botão dentro do card, não toca o som de select

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



    // Aplica a lógica para os cards gerais

    setupCardHoverSound(interactiveCardsGeneral, 0.3, true);



    // Aplica a lógica para os itens da grade de segurança (com volume diferente)

    setupCardHoverSound(securityGridItems, 0.2); // Não precisa de preventClickBubble para esses itens se eles não têm links/botões internos que devem ser ignorados.



    /* ========================================= */

    /* COPY IP/PORT BUTTONS                      */

    /* ========================================= */



    const copyButtons = document.querySelectorAll('.copy-ip-btn'); // Seleciona todos os botões com essa classe



    copyButtons.forEach(button => {

        button.addEventListener('click', async function() {

            const ipToCopy = this.dataset.ip; // Pega o IP/Porta do atributo data-ip

            if (ipToCopy) {

                const success = await copyToClipboard(ipToCopy);

                if (success) {

                    showToast('Copiado: ' + ipToCopy, 2000); // Mostra toast por 2 segundos

                } else {

                    showToast('Falha ao copiar. Tente novamente!', 3000);

                }

            } else {

                console.warn('Atributo data-ip não encontrado no botão de cópia.');

            }

        });

    });



    /* ========================================= */

    /* INITIAL USER INTERACTION HANDLER          */

    /* ========================================= */



    let userInteracted = false;



    /**

     * Manipula a primeira interação do usuário para habilitar o áudio de fundo

     * e mostrar o botão de controle de áudio.

     */

    function handleUserInteraction() {

        if (!userInteracted) {

            if (playAudioBtn) {

                playAudioBtn.style.display = 'block'; // Mostra o botão

            }

           

            // Toca a música aleatória de fundo na primeira interação do usuário.

            // Isso é crucial para contornar políticas de autoplay de navegadores.

            playNextRandomTrack();

           

            userInteracted = true;

            // Remove os listeners após a primeira interação para evitar execução desnecessária

            document.removeEventListener('scroll', handleUserInteraction);

            document.removeEventListener('mousemove', handleUserInteraction);

            document.removeEventListener('click', handleUserInteraction);

            document.removeEventListener('touchstart', handleUserInteraction);

        }

    }



    // Adiciona listeners para detectar a primeira interação do usuário

    document.addEventListener('scroll', handleUserInteraction);

    document.addEventListener('mousemove', handleUserInteraction);

    document.addEventListener('click', handleUserInteraction);

    document.addEventListener('touchstart', handleUserInteraction);



});