document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM totalmente carregado. Iniciando script principal.");

    // =====================================
    // 1. Menu Responsivo
    // =====================================
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNavList = document.getElementById('main-nav-list'); // Certifique-se que seu elemento nav tem o id="main-nav-list"

    if (menuToggle && mainNavList) {
        menuToggle.addEventListener('click', function() {
            mainNavList.classList.toggle('active');
            console.log("Menu responsivo clicado. Estado 'active' de main-nav-list:", mainNavList.classList.contains('active'));
        });
    } else {
        console.warn("Elementos do menu responsivo (menu-toggle ou main-nav-list) não encontrados.");
    }

    // =====================================
    // 2. Efeitos Sonoros Gerais (Click e Hover/Select)
    // =====================================
    // Usando new Audio() para ter controle separado de cada som.
    // Garanta que esses caminhos estejam corretos!
    const clickSoundEffect = new Audio('audios/effects/click.mp3'); 
    const selectSoundEffect = new Audio('audios/effects/select.mp3'); 
    const animationEndSound = new Audio('audios/effects/hover-complete.mp3'); 

    // Função auxiliar para tocar som, lidando com erros de autoplay e ausência de elemento
    function playGeneralSound(audioElement) {
        if (!audioElement || !audioElement.src) {
            console.warn("Elemento de áudio ou src não fornecido/inválido para playGeneralSound.");
            return;
        }
        audioElement.currentTime = 0; // Reinicia o áudio para tocar do início
        audioElement.play().catch(e => {
            // Este catch é importante para erros de autoplay sem interação do usuário
            console.warn(`Erro ao tocar efeito sonoro geral (${audioElement.src.split('/').pop()}):`, e.message);
        });
    }

    // Listener para Click em Botões e Links
    // Alvo: todos os <a> e <button> que NÃO são o 'audioControlButton'
    document.querySelectorAll('a, button').forEach(element => {
        if (element.id !== 'audioControlButton') { // Exclui o botão de música principal
            element.addEventListener('click', (event) => {
                playGeneralSound(clickSoundEffect);

                // Pequeno atraso para links internos para permitir o som antes da navegação
                // Aplica-se apenas a <a> que não abrem em nova aba e são do mesmo domínio
                if (element.tagName === 'A' && element.href && element.getAttribute('target') !== '_blank' && element.href.startsWith(window.location.origin)) {
                    event.preventDefault(); // Impede a navegação imediata
                    setTimeout(() => {
                        window.location.href = element.href; // Navega após um pequeno atraso
                    }, 200); 
                }
            });
        }
    });

    // Hover/Interação em Cards (para sons de select e animationEnd)
    const playedAnimationEndSound = new WeakSet(); // Rastreia cards para som de final de animação

    // Combine todos os seletores de cards em uma única string
    const cardSelectors = [
        '.card', // Classe geral para qualquer card
        '.service-card',
        '.role-category-card',
        '.access-card',
        '.event-card',
        '.community-card',
        '.partnership-card',
        '.partnership-proposal-card',
        '.security-card'
    ].join(', '); 

    document.querySelectorAll(cardSelectors).forEach(cardElement => {
        cardElement.addEventListener('mouseenter', () => {
            playGeneralSound(selectSoundEffect);
            // Remove do WeakSet para permitir que o som de animação toque novamente se o mouse sair e voltar
            playedAnimationEndSound.delete(cardElement); 
        });

        cardElement.addEventListener('transitionend', (event) => {
            // Verifica se a transição foi na propriedade 'transform' (comum para hover effects)
            // e se o mouse ainda está sobre o card (':hover')
            // e se o som de animação ainda não tocou para este card durante o hover atual
            if (event.propertyName === 'transform' && cardElement.matches(':hover') && !playedAnimationEndSound.has(cardElement)) {
                playGeneralSound(animationEndSound);
                // Adiciona ao WeakSet para evitar que o som toque múltiplas vezes durante o mesmo hover
                playedAnimationEndSound.add(cardElement); 
            }
        });

        cardElement.addEventListener('mouseleave', () => {
            // Ao sair do card, remove-o do WeakSet para resetar o estado
            playedAnimationEndEndSound.delete(cardElement); 
        });

        // Adiciona suporte para navegação via teclado (tab) para acessibilidade
        cardElement.addEventListener('focus', () => {
            playGeneralSound(selectSoundEffect);
        });
        cardElement.addEventListener('blur', () => {
            // Reseta o estado quando o card perde o foco
            playedAnimationEndSound.delete(cardElement); 
        });
    });

    // =====================================
    // 3. Sistema de Música de Fundo
    // =====================================

    // --- Referências aos Elementos DOM da Música ---
    const backgroundMusic = document.getElementById('backgroundMusic');
    const audioControlButton = document.getElementById('audioControlButton');
    const centralMessage = document.getElementById('centralMessage');
    // Verifica se audioControlButton existe antes de tentar selecionar .arc-progress
    const progressArc = audioControlButton ? audioControlButton.querySelector('.arc-progress') : null;

    // Referência para o display do título da música (ID do HTML: currentMusicTitle)
    const currentMusicTitleDisplay = document.getElementById('currentMusicTitle');

    // Referências aos ícones específicos (Classes no HTML: icon-on, icon-off)
    const onIcon = audioControlButton ? audioControlButton.querySelector('.icon-on') : null; 
    const offIcon = audioControlButton ? audioControlButton.querySelector('.icon-off') : null; 

    // --- Playlist de Músicas ---
    const playlist = [
        { title: "Aria-Math", src: "audios/musics/Aria-Math.mp3" },
        { title: "Beginning 2", src: "audios/musics/Beginning-2.mp3" },
        { title: "Biome-Fest", src: "audios/musics/Biome-Fest.mp3" },
        { title: "Blind-Spots", src: "audios/musics/Blind-Spots.mp3" },
        { title: "Clark", src: "audios/musics/Clark.mp3" },
        { title: "Danny", src: "audios/musics/Danny.mp3" },
        { title: "Dreiton", src: "audios/musics/Dreiton.mp3" },
        { title: "Dry-Hands", src: "audios/musics/Dry-Hands.mp3" },
        { title: "Floating-Trees", src: "audios/musics/Floating-Trees.mp3" },
        { title: "Haggstrom", src: "audios/musics/Haggstrom.mp3" },
        { title: "Key", src: "audios/musics/Key.mp3" },
        { title: "Living-Mice", src: "audios/musics/Living-Mice.mp3" },
        { title: "Mice-On-Venus", src: "audios/musics/Mice-On-Venus.mp3" },
        { title: "Minecraft", src: "audios/musics/Minecraft.mp3" },
        { title: "Moog-City 2", src: "audios/musics/Moog-City 2.mp3" },
        { title: "Mutation", src: "audios/musics/Mutation.mp3" },
        { title: "Sweden", src: "audios/musics/Sweden.mp3" },
        { title: "Taswell", src: "audios/musics/Taswell.mp3" },
        { title: "Wet-Hands", src: "audios/musics/Wet-Hands.mp3" }
    ];
    let currentTrackIndex = 0;
    const circumference = 100; // Valor para o SVG do progresso
    let messageTimeout; // Para controlar o timeout da mensagem central

    // --- Funções do Player de Música ---

    function updateProgressBar() {
        // Verifica se backgroundMusic e progressArc existem antes de usar
        if (backgroundMusic && progressArc && !backgroundMusic.paused && !backgroundMusic.ended && backgroundMusic.duration > 0) {
            const percentage = (backgroundMusic.currentTime / backgroundMusic.duration) * 100;
            const offset = circumference - (percentage / 100) * circumference;
            progressArc.style.strokeDasharray = `${circumference}, ${circumference}`; 
            progressArc.style.strokeDashoffset = offset; 
        } else if (progressArc) {
            // Reinicia a barra de progresso quando a música está pausada ou não iniciada
            progressArc.style.strokeDasharray = `0, ${circumference}`;
            progressArc.style.strokeDashoffset = circumference;
        }
    }

    function playNextTrack() {
        console.log("Música atual terminou, tocando a próxima na playlist.");
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadAndPlayCurrentTrack(); 
    }

    // Atualiza o estado visual do botão (classe 'is-playing' e troca de ícones)
    function updateButtonState(isPlaying) {
        if (!audioControlButton || !onIcon || !offIcon) {
            console.warn("Elementos do botão de áudio ou ícones não encontrados para updateButtonState.");
            return;
        }

        if (isPlaying) {
            audioControlButton.classList.add('is-playing');
            onIcon.style.display = 'inline-block'; 
            offIcon.style.display = 'none';      
        } else {
            audioControlButton.classList.remove('is-playing');
            onIcon.style.display = 'none';       
            offIcon.style.display = 'inline-block'; 
        }
        console.log(`Estado do botão de áudio atualizado: ${isPlaying ? 'Play' : 'Pause'}`);
    }

    // Exibe a mensagem central na tela
    function showCentralMessage(message) {
        if (!centralMessage) {
            console.warn("Elemento 'centralMessage' não encontrado no DOM.");
            return;
        }
        centralMessage.textContent = message;
        centralMessage.classList.add('show');

        clearTimeout(messageTimeout); 

        messageTimeout = setTimeout(() => {
            centralMessage.classList.remove('show');
        }, 3000);
        console.log(`Mensagem central: "${message}"`);
    }

    // Carrega e tenta tocar a música atual da playlist
    function loadAndPlayCurrentTrack() {
        const currentTrack = playlist[currentTrackIndex];
        if (!currentTrack) {
            showCentralMessage("Erro: Playlist vazia ou música não encontrada.");
            console.error("Playlist vazia ou índice de música inválido.");
            updateButtonState(false);
            if (currentMusicTitleDisplay) currentMusicTitleDisplay.textContent = "Erro na Música";
            return;
        }
        if (!backgroundMusic) {
            console.error("Elemento 'backgroundMusic' não encontrado para carregar e tocar.");
            showCentralMessage("Erro no sistema de áudio!");
            updateButtonState(false);
            if (currentMusicTitleDisplay) currentMusicTitleDisplay.textContent = "Erro de Áudio";
            return;
        }

        console.log(`Tentando carregar e tocar: "${currentTrack.title}" de "${currentTrack.src}"`);
        backgroundMusic.src = currentTrack.src;
        backgroundMusic.load(); // Recarrega a nova fonte para ter certeza

        backgroundMusic.play().then(() => {
            updateButtonState(true); // Música tocando
            showCentralMessage(`Tocando: ${currentTrack.title}`);
            if (currentMusicTitleDisplay) currentMusicTitleDisplay.textContent = currentTrack.title; // Atualiza o texto
            console.log(`Música "${currentTrack.title}" iniciada com sucesso.`);
        }).catch(e => {
            console.error("Erro ao iniciar a reprodução da música de fundo:", e);
            updateButtonState(false); // Música pausada ou não iniciada
            showCentralMessage("Clique para iniciar a música");
            if (currentMusicTitleDisplay) currentMusicTitleDisplay.textContent = "Música Pausada"; // Atualiza o texto
            // Isso geralmente acontece devido às políticas de autoplay do navegador
            console.log("A reprodução automática pode ter sido bloqueada. O usuário precisa interagir.");
        });
    }

    // --- Inicialização ao Carregar a Página ---
    // Verifica a preferência do usuário no localStorage
    const userPrefersMusic = localStorage.getItem('musicEnabled');
    console.log(`Preferência de música do usuário (localStorage): ${userPrefersMusic}`);

    if (backgroundMusic && currentMusicTitleDisplay) { // Verifica se os elementos existem antes de iniciar
        if (userPrefersMusic === 'true') {
            loadAndPlayCurrentTrack(); // Tenta tocar a música se a preferência for 'true'
        } else {
            backgroundMusic.pause();
            updateButtonState(false); // Garante que o estado inicial seja "desligado"
            currentMusicTitleDisplay.textContent = "Música Desligada"; // Define o texto inicial
            console.log("Música iniciada como desligada (preferência do usuário ou padrão).");
        }
    } else {
        console.error("Elementos essenciais do sistema de música (backgroundMusic ou currentMusicTitleDisplay) não encontrados no DOM. O sistema de música não será inicializado.");
        // Opcional: desabilitar o botão de áudio se os elementos não forem encontrados
        if (audioControlButton) audioControlButton.style.display = 'none';
    }


    // --- Event Listeners para o Sistema de Música ---

    // Listener para o clique no botão de controle de áudio
    if (audioControlButton) {
        audioControlButton.addEventListener('click', () => {
            console.log("Botão de controle de áudio clicado.");
            // Toca o som de clique ao interagir com o botão principal (opcional, já tratado pelos sons gerais)
            // playGeneralSound(clickSoundEffect); 

            if (backgroundMusic.paused) {
                console.log("Música estava pausada, tentando tocar agora.");
                loadAndPlayCurrentTrack();
                localStorage.setItem('musicEnabled', 'true');
            } else {
                console.log("Música estava tocando, pausando agora.");
                backgroundMusic.pause();
                updateButtonState(false);
                showCentralMessage("Música Pausada");
                if (currentMusicTitleDisplay) currentMusicTitleDisplay.textContent = "Música Pausada";
                localStorage.setItem('musicEnabled', 'false');
            }
        });
    } else {
        console.error("Elemento 'audioControlButton' não encontrado no DOM! O controle de música não funcionará.");
    }

    // Listeners de estado do backgroundMusic
    if (backgroundMusic) {
        backgroundMusic.addEventListener('ended', playNextTrack);
        backgroundMusic.addEventListener('timeupdate', updateProgressBar);
        backgroundMusic.addEventListener('loadedmetadata', updateProgressBar);
        backgroundMusic.addEventListener('error', (e) => {
            console.error("Erro no elemento de áudio backgroundMusic:", e);
            showCentralMessage("Erro ao carregar música!");
            updateButtonState(false);
            if (currentMusicTitleDisplay) currentMusicTitleDisplay.textContent = "Erro de Áudio";
        });
    } // Se backgroundMusic não existe, o console.error já foi exibido na inicialização.

    console.log("Todos os Event Listeners configurados.");
});