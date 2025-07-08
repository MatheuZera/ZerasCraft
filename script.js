document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM totalmente carregado. Iniciando script principal.");

    // =====================================
    // 1. Menu Responsivo (mantido)
    // =====================================
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNavList = document.getElementById('main-nav-list');

    if (menuToggle && mainNavList) {
        menuToggle.addEventListener('click', function() {
            mainNavList.classList.toggle('active');
            console.log("Menu responsivo clicado. Estado 'active' de main-nav-list:", mainNavList.classList.contains('active'));
        });
    } else {
        console.warn("Elementos do menu responsivo (menu-toggle ou main-nav-list) não encontrados.");
    }

    // =====================================
    // 2. Efeitos Sonoros Gerais (Click e Hover/Select) (mantido, com ajuste para os botões de copiar)
    // =====================================
    const clickSoundEffect = new Audio('audios/effects/click.mp3');
    const selectSoundEffect = new Audio('audios/effects/select.mp3');
    const animationEndSound = new Audio('audios/effects/hover-complete.mp3');

    function playGeneralSound(audioElement) {
        if (!audioElement || !audioElement.src) {
            console.warn("Elemento de áudio ou src não fornecido/inválido para playGeneralSound.");
            return;
        }
        audioElement.currentTime = 0;
        audioElement.play().catch(e => {
            console.warn(`Erro ao tocar efeito sonoro geral (${audioElement.src.split('/').pop()}):`, e.message);
        });
    }

    // Listener para Click em Botões e Links
    // Alvo: todos os <a> e <button> que NÃO são o 'audioControlButton' E NÃO SÃO BOTÕES DE COPIAR
    document.querySelectorAll('a, button').forEach(element => {
        // Excluímos os botões de áudio e os botões de copiar que terão listeners específicos
        if (element.id !== 'audioControlButton' && !element.classList.contains('copy-button-specific-listener')) {
            element.addEventListener('click', (event) => {
                playGeneralSound(clickSoundEffect);

                if (element.tagName === 'A' && element.href && element.getAttribute('target') !== '_blank' && element.href.startsWith(window.location.origin)) {
                    event.preventDefault();
                    setTimeout(() => {
                        window.location.href = element.href;
                    }, 200);
                }
            });
        }
    });

    // Hover/Interação em Cards (mantido)
    const playedAnimationEndSound = new WeakSet();

    const cardSelectors = [
        '.card',
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
            playedAnimationEndSound.delete(cardElement);
        });

        cardElement.addEventListener('transitionend', (event) => {
            if (event.propertyName === 'transform' && cardElement.matches(':hover') && !playedAnimationEndSound.has(cardElement)) {
                playGeneralSound(animationEndSound);
                playedAnimationEndSound.add(cardElement);
            }
        });

        cardElement.addEventListener('mouseleave', () => {
            playedAnimationEndSound.delete(cardElement);
        });

        cardElement.addEventListener('focus', () => {
            playGeneralSound(selectSoundEffect);
        });
        cardElement.addEventListener('blur', () => {
            playedAnimationEndSound.delete(cardElement);
        });
    });

    // =====================================
    // 3. Sistema de Música de Fundo (mantido)
    // =====================================
    const backgroundMusic = document.getElementById('backgroundMusic');
    const audioControlButton = document.getElementById('audioControlButton');
    const centralMessage = document.getElementById('centralMessage');
    const progressArc = audioControlButton ? audioControlButton.querySelector('.arc-progress') : null;
    const currentMusicTitleDisplay = document.getElementById('currentMusicTitle');
    const onIcon = audioControlButton ? audioControlButton.querySelector('.icon-on') : null;
    const offIcon = audioControlButton ? audioControlButton.querySelector('.icon-off') : null;

    const playlist = [
        { title: "Aria-Math-Lofi", src: "audios/musics/Aria-Math-Lofi-Remake.mp3" },
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
    const circumference = 100;
    let messageTimeout;

    function updateProgressBar() {
        if (backgroundMusic && progressArc && !backgroundMusic.paused && !backgroundMusic.ended && backgroundMusic.duration > 0) {
            const percentage = (backgroundMusic.currentTime / backgroundMusic.duration) * 100;
            const offset = circumference - (percentage / 100) * circumference;
            progressArc.style.strokeDasharray = `${circumference}, ${circumference}`;
            progressArc.style.strokeDashoffset = offset;
        } else if (progressArc) {
            progressArc.style.strokeDasharray = `0, ${circumference}`;
            progressArc.style.strokeDashoffset = circumference;
        }
    }

    function playNextTrack() {
        console.log("Música atual terminou, tocando a próxima na playlist.");
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadAndPlayCurrentTrack();
    }

    function selectRandomTrack() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * playlist.length);
        } while (newIndex === currentTrackIndex && playlist.length > 1);
        currentTrackIndex = newIndex;
        console.log(`Selecionada música aleatória: Índice ${currentTrackIndex}, Título: ${playlist[currentTrackIndex].title}`);
    }

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
        backgroundMusic.load();

        backgroundMusic.play().then(() => {
            updateButtonState(true);
            showCentralMessage(`🎵 > ${currentTrack.title}`);
            if (currentMusicTitleDisplay) currentMusicTitleDisplay.textContent = currentTrack.title;
            console.log(`Música "${currentTrack.title}" iniciada com sucesso.`);
        }).catch(e => {
            console.error("Erro ao iniciar a reprodução da música de fundo:", e);
            updateButtonState(false);
            showCentralMessage(`Carregando: ${currentTrack.title}`);
            if (currentMusicTitleDisplay) currentMusicTitleDisplay.textContent = "Música Pausada";
            console.log("A reprodução automática pode ter sido bloqueada. O usuário precisa interagir.");
        });
    }

    const userPrefersMusic = localStorage.getItem('musicEnabled');
    console.log(`Preferência de música do usuário (localStorage): ${userPrefersMusic}`);

    if (backgroundMusic && currentMusicTitleDisplay) {
        if (!userPrefersMusic || userPrefersMusic === 'false') {
            selectRandomTrack();
        }

        if (userPrefersMusic === 'true') {
            loadAndPlayCurrentTrack();
        } else {
            backgroundMusic.pause();
            updateButtonState(false);
            currentMusicTitleDisplay.textContent = "Desligada";
            console.log("Música iniciada como desligada (preferência do usuário ou padrão).");
        }
    } else {
        console.error("Elementos essenciais do sistema de música (backgroundMusic ou currentMusicTitleDisplay) não encontrados no DOM. O sistema de música não será inicializado.");
        if (audioControlButton) audioControlButton.style.display = 'none';
    }

    if (audioControlButton) {
        audioControlButton.addEventListener('click', () => {
            console.log("Botão de controle de áudio clicado.");
            if (backgroundMusic.paused) {
                console.log("Música estava pausada, selecionando uma música aleatória e tentando tocar agora.");
                selectRandomTrack();
                loadAndPlayCurrentTrack();
                localStorage.setItem('musicEnabled', 'true');
            } else {
                console.log("Música estava tocando, pausando agora.");
                backgroundMusic.pause();
                updateButtonState(false);
                if 
                (currentMusicTitleDisplay) currentMusicTitleDisplay.textContent = "Desligada";
                localStorage.setItem('musicEnabled', 'false');
            }
        });
    } else {
        console.error("Elemento 'audioControlButton' não encontrado no DOM! O controle de música não funcionará.");
    }

    if (backgroundMusic) {
        backgroundMusic.addEventListener('ended', playNextTrack);
        backgroundMusic.addEventListener('timeupdate', updateProgressBar);
        backgroundMusic.addEventListener('loadedmetadata', updateProgressBar);
        backgroundMusic.addEventListener('error', (e) => {
            console.error("Erro no elemento de áudio backgroundMusic:", e);
            showCentralMessage("Erro!");
            updateButtonState(false);
            if (currentMusicTitleDisplay) currentMusicTitleDisplay.textContent = "Erro de Áudio";
        });
    }

    // =====================================
    // 4. Funcionalidade de Copiar IP/Endereço
    // =====================================

    const copyIpPortBtn = document.getElementById('copyIpPortBtn');
    const serverIp = document.getElementById('serverIp');
    const serverPort = document.getElementById('serverPort');
    const copyIpPortFeedback = document.getElementById('copyIpPortFeedback');

    if (copyIpPortBtn && serverIp && serverPort && copyIpPortFeedback) {
        // Adiciona uma classe para que o listener geral de clique não o manipule também
        copyIpPortBtn.classList.add('copy-button-specific-listener');
        copyIpPortBtn.addEventListener('click', async () => {
            playGeneralSound(clickSoundEffect); // Toca o som de clique

            const ip = serverIp.textContent;
            const port = serverPort.textContent;
            const textToCopy = `${ip}:${port}`;

            try {
                await navigator.clipboard.writeText(textToCopy);
                copyIpPortFeedback.textContent = 'Copiado!';
                copyIpPortFeedback.style.color = 'lightgreen';
                setTimeout(() => {
                    copyIpPortFeedback.textContent = '';
                }, 2000);
                console.log(`IP e Porta copiados: ${textToCopy}`);
            } catch (err) {
                console.error('Erro ao copiar IP e Porta:', err);
                copyIpPortFeedback.textContent = 'Erro ao copiar!';
                copyIpPortFeedback.style.color = 'red';
                setTimeout(() => {
                    copyIpPortFeedback.textContent = '';
                }, 2000);
            }
        });
    } else {
        console.warn("Elementos do botão Copiar IP & Porta não encontrados. A funcionalidade pode não funcionar.");
    }

    const copyAddressBtn = document.getElementById('copyAddressBtn');
    const serverAddress = document.getElementById('serverAddress');
    const copyAddressFeedback = document.getElementById('copyAddressFeedback');

    if (copyAddressBtn && serverAddress && copyAddressFeedback) {
        copyAddressBtn.classList.add('copy-button-specific-listener');
        copyAddressBtn.addEventListener('click', async () => {
            playGeneralSound(clickSoundEffect); // Toca o som de clique

            const textToCopy = serverAddress.textContent;

            try {
                await navigator.clipboard.writeText(textToCopy);
                copyAddressFeedback.textContent = 'Copiado!';
                copyAddressFeedback.style.color = 'lightgreen';
                setTimeout(() => {
                    copyAddressFeedback.textContent = '';
                }, 2000);
                console.log(`Endereço Java copiado: ${textToCopy}`);
            } catch (err) {
                console.error('Erro ao copiar Endereço Java:', err);
                copyAddressFeedback.textContent = 'Erro ao copiar!';
                copyAddressFeedback.style.color = 'red';
                setTimeout(() => {
                    copyAddressFeedback.textContent = '';
                }, 2000);
            }
        });
    } else {
        console.warn("Elementos do botão Copiar Endereço Java não encontrados. A funcionalidade pode não funcionar.");
    }

    const copyNewAccessBtn = document.getElementById('copyNewAccessBtn');
    const newAccessAddress = document.getElementById('newAccessAddress');
    const copyNewAccessFeedback = document.getElementById('copyNewAccessFeedback');

    if (copyNewAccessBtn && newAccessAddress && copyNewAccessFeedback) {
        copyNewAccessBtn.classList.add('copy-button-specific-listener');
        copyNewAccessBtn.addEventListener('click', async () => {
            playGeneralSound(clickSoundEffect); // Toca o som de clique

            const textToCopy = newAccessAddress.textContent;

            try {
                await navigator.clipboard.writeText(textToCopy);
                copyNewAccessFeedback.textContent = 'Copiado!';
                copyNewAccessFeedback.style.color = 'lightgreen';
                setTimeout(() => {
                    copyNewAccessFeedback.textContent = '';
                }, 2000);
                console.log(`Novo Endereço de Acesso copiado: ${textToCopy}`);
            } catch (err) {
                console.error('Erro ao copiar Novo Endereço de Acesso:', err);
                copyNewAccessFeedback.textContent = 'Erro ao copiar!';
                copyNewAccessFeedback.style.color = 'red';
                setTimeout(() => {
                    copyNewAccessFeedback.textContent = '';
                }, 2000);
            }
        });
    } else {
        console.warn("Elementos do botão Copiar Novo Tipo de Acesso não encontrados. A funcionalidade pode não funcionar.");
    }


    console.log("Todos os Event Listeners configurados.");
});