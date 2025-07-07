document.addEventListener('DOMContentLoaded', function() {
    // =====================================
    // 1. Menu Responsivo
    // =====================================
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNavList = document.getElementById('main-nav-list');

    if (menuToggle && mainNavList) {
        menuToggle.addEventListener('click', function() {
            mainNavList.classList.toggle('active');
        });
    }

    // =====================================
    // 2. Efeitos Sonoros Gerais (Click e Hover/Select)
    // =====================================
    const clickSoundEffect = new Audio('audios/effects/click.mp3'); // Som de clique para botões/links
    const selectSoundEffect = new Audio('audios/effects/select.mp3'); // Som de hover/seleção para cards
    const animationEndSound = new Audio('audios/effects/hover-complete.mp3'); // Som de final de animação do card

    // Função auxiliar para tocar som, lidando com erros de autoplay
    function playSound(audioElement) {
        audioElement.currentTime = 0; // Reinicia o áudio
        audioElement.play().catch(e => console.warn("Erro ao tocar efeito sonoro:", e.message));
    }

    // Clique em Botões e Links
    document.querySelectorAll('a, button[data-sound-effect="select"]').forEach(element => {
        // Exclui o botão de controle de áudio principal para evitar dois sons de clique
        if (element.id !== 'audioControlButton') {
            element.addEventListener('click', (event) => {
                playSound(clickSoundEffect);

                // Previne navegação imediata para links internos para permitir o som
                if (element.tagName === 'A' && element.href && element.getAttribute('target') !== '_blank' && element.href.startsWith(window.location.origin)) {
                    event.preventDefault();
                    setTimeout(() => {
                        window.location.href = element.href;
                    }, 200); // Pequeno atraso para o som tocar
                }
            });
        }
    });

    // Hover/Interação em Cards
    const playedAnimationEndSound = new WeakSet(); // Rastreia cards para som de final de animação

    const cardSelectors = [
        '.service-card',
        '.role-category-card',
        '.access-card',
        '.event-card',
        '.community-card',
        '.partnership-card',
        '.partnership-proposal-card',
        '.security-card', // Adicionado, se aplicável
        '.card' // Adicionado para cobrir cards genéricos, se houver
    ].join(', ');

    document.querySelectorAll(cardSelectors).forEach(cardElement => {
        cardElement.addEventListener('mouseenter', () => {
            playSound(selectSoundEffect);
            playedAnimationEndSound.delete(cardElement); // Reseta para que o som de animação toque novamente
        });

        cardElement.addEventListener('transitionend', (event) => {
            // Monitora a transição da propriedade 'transform' (ou outra que defina a animação do hover)
            // e verifica se o mouse ainda está sobre o card e se o som já não tocou.
            if (event.propertyName === 'transform' && cardElement.matches(':hover') && !playedAnimationEndSound.has(cardElement)) {
                playSound(animationEndSound);
                playedAnimationEndSound.add(cardElement); // Marca que o som já tocou
            }
        });

        cardElement.addEventListener('mouseleave', () => {
            playedAnimationEndSound.delete(cardElement); // Reseta o estado
        });

        // Opcional: Efeitos sonoros em foco (para acessibilidade com teclado)
        cardElement.addEventListener('focus', () => {
            playSound(selectSoundEffect);
        });
        cardElement.addEventListener('blur', () => {
            playedAnimationEndSound.delete(cardElement); // Reseta o estado
        });
    });


    // =====================================
    // 3. Lógica para Controle de Áudio de Fundo (Música Aleatória)
    // =====================================
    const audioControlButton = document.getElementById('audioControlButton');
    const backgroundMusic = document.getElementById('backgroundMusic'); // Certifique-se que o ID é backgroundMusic
    const currentMusicTitleDisplay = document.getElementById('currentMusicTitle'); // Certifique-se que o ID é currentMusicTitle
    const centralMessageDisplay = document.getElementById('centralMessage'); // Elemento para mensagens de feedback

    const audioProgressArc = document.querySelector('.audio-progress-arc');
    const arcProgress = audioProgressArc ? audioProgressArc.querySelector('.arc-progress') : null;

    // Array de músicas para o player (ajuste os caminhos conforme necessário)
    // Títulos foram adicionados para melhor exibição
    const musicPlaylist = [
        { title: "Aria Math", src: "audios/musics/Aria-Math.mp3" },
        { title: "Biome Fest", src: "audios/musics/Biome-Fest.mp3" },
        { title: "Blind Spots", src: "audios/musics/Blind-Spots.mp3" },
        { title: "Clark", src: "audios/musics/Clark.mp3" },
        { title: "Danny", src: "audios/musics/Danny.mp3" },
        { title: "Dreiton", src: "audios/musics/Dreiton.mp3" },
        { title: "Dry Hands", src: "audios/musics/Dry-Hands.mp3" },
        { title: "Floating Trees", src: "audios/musics/Floating-Trees.mp3" },
        { title: "Haggstrom", src: "audios/musics/Haggstrom.mp3" },
        { title: "Haunt Muskie", src: "audios/musics/Haunt-Muskie.mp3" },
        { title: "Key", src: "audios/musics/Key.mp3" },
        { title: "Living Mice", src: "audios/musics/Living-Mice.mp3" },
        { title: "Minecraft", src: "audios/musics/Minecraft.mp3" },
        { title: "Moog City 2", src: "audios/musics/Moog-City 2.mp3" },
        { title: "Mutation", src: "audios/musics/Mutation.mp3" },
        { title: "Oxygène", src: "audios/musics/Oxygène.mp3" },
        { title: "Subwoofer Lullaby", src: "audios/musics/Subwoofer-Lullaby.mp3" },
        { title: "Sweden", src: "audios/musics/Sweden.mp3" },
        { title: "Taswell", src: "audios/musics/Taswell.mp3" },
        { title: "Wet Hands", src: "audios/musics/Wet-Hands.mp3" }
    ];

    let currentMusicIndex = -1; // -1 para indicar que nenhuma música foi selecionada ainda
    let userInteractedWithAudio = false; // Flag para controlar a interação do usuário com o controle de áudio

    // Função para exibir mensagem central
    function showCentralMessage(message, duration = 2000) {
        if (centralMessageDisplay) {
            centralMessageDisplay.textContent = message;
            centralMessageDisplay.classList.add('show');
            setTimeout(() => {
                centralMessageDisplay.classList.remove('show');
            }, duration);
        }
    }

    // Função para selecionar uma música aleatória
    function selectRandomMusic() {
        let newIndex;
        // Garante que a próxima música não seja a mesma, a menos que só haja uma música na lista
        if (musicPlaylist.length === 1) {
            newIndex = 0;
        } else {
            do {
                newIndex = Math.floor(Math.random() * musicPlaylist.length);
            } while (newIndex === currentMusicIndex);
        }
        currentMusicIndex = newIndex;
        return musicPlaylist[currentMusicIndex];
    }

    // Função para tocar uma música específica
    function playMusic(musicObject) {
        backgroundMusic.src = musicObject.src;
        currentMusicTitleDisplay.textContent = musicObject.title;
        backgroundMusic.play()
            .then(() => {
                audioControlButton.classList.add('is-playing');
                showCentralMessage(`Tocando: ${musicObject.title}`);
            })
            .catch(error => {
                console.error("Erro ao reproduzir a música:", error);
                audioControlButton.classList.remove('is-playing');
                showCentralMessage("Erro ao tocar música. Clique novamente.");
            });
    }

    // Função para alternar o áudio (pausar/tocar a próxima aleatória)
    function toggleAudioPlayback() {
        if (backgroundMusic.paused) {
            const nextMusic = selectRandomMusic(); // Seleciona uma nova música aleatória
            playMusic(nextMusic);
        } else {
            backgroundMusic.pause();
            audioControlButton.classList.remove('is-playing');
            currentMusicTitleDisplay.textContent = 'Música Pausada';
            showCentralMessage("Música Pausada");
        }
    }

    // Evento de clique no botão de áudio
    if (audioControlButton) {
        audioControlButton.addEventListener('click', () => {
            userInteractedWithAudio = true; // Marca que houve interação com o controle de áudio
            toggleAudioPlayback(); // Alterna a reprodução (toca próxima aleatória ou pausa)
        });
    }

    // Quando a música termina, toca a próxima aleatória
    backgroundMusic.addEventListener('ended', () => {
        toggleAudioPlayback(); // Usa a mesma função para selecionar e tocar a próxima
    });

    // Event listener para atualizar o progresso do arco
    if (backgroundMusic && arcProgress) {
        backgroundMusic.addEventListener('timeupdate', () => {
            const duration = backgroundMusic.duration;
            const currentTime = backgroundMusic.currentTime;
            if (duration > 0) {
                const percentage = (currentTime / duration) * 100;
                const circumference = 2 * Math.PI * 16; // Raio 'r' do SVG é 16
                const dashoffset = circumference - (percentage / 100) * circumference;
                arcProgress.style.strokeDasharray = `${circumference} ${circumference}`;
                arcProgress.style.strokeDashoffset = dashoffset;
            }
        });

        // Reseta o arco de progresso quando a música é carregada/iniciada
        backgroundMusic.addEventListener('play', () => {
            if (arcProgress) {
                const circumference = 2 * Math.PI * 16;
                arcProgress.style.strokeDashoffset = circumference; // Começa o arco do início
            }
        });
    }

    // Inicialização do player de áudio na carga da página
    // Seleciona uma música aleatória para ser a "primeira", mas não a toca automaticamente
    if (musicPlaylist.length > 0) {
        selectRandomMusic(); // Define currentMusicIndex e preenche o backgroundMusic.src
        backgroundMusic.src = musicPlaylist[currentMusicIndex].src;
        currentMusicTitleDisplay.textContent = musicPlaylist[currentMusicIndex].title;
    } else {
        currentMusicTitleDisplay.textContent = 'Nenhuma música disponível';
        if (audioControlButton) audioControlButton.disabled = true; // Desabilita o botão se não houver música
    }
    backgroundMusic.pause(); // Garante que esteja pausado no início
    audioControlButton.classList.remove('is-playing'); // Estado visual de pausado

    // Lida com a política de autoplay: tenta tocar a música APÓS a primeira interação GERAL do usuário na página
    // Isso é crucial para navegadores modernos
    document.body.addEventListener('click', function initialInteractionHandler() {
        if (!userInteractedWithAudio && backgroundMusic.paused && musicPlaylist.length > 0) {
            // Se o usuário ainda não clicou no botão de áudio e a música está pausada,
            // tenta tocar a música que já foi pré-selecionada.
            backgroundMusic.play()
                .then(() => {
                    userInteractedWithAudio = true; // Marca como interagido para evitar futuras tentativas de autoplay
                    audioControlButton.classList.add('is-playing');
                    showCentralMessage(`Tocando: ${musicPlaylist[currentMusicIndex].title}`);
                })
                .catch(error => {
                    console.warn("Autoplay impedido ou erro na primeira reprodução:", error);
                    // O botão ainda mostrará o estado de 'pausado', e o usuário precisará clicar.
                });
        }
        // Remove este listener uma vez que a primeira interação ocorreu (se a reprodução foi bem-sucedida ou não)
        document.body.removeEventListener('click', initialInteractionHandler);
    }, { once: true }); // Garante que este listener só seja executado uma vez


    // =====================================
    // 4. Lógica de Copiar para Área de Transferência
    // =====================================

    // Função auxiliar para copiar texto e dar feedback
    function copyToClipboard(elementId, feedbackElementId, textToCopyOverride = null) {
        const element = document.getElementById(elementId);
        const feedback = document.getElementById(feedbackElementId);
        let textToCopy;

        if (textToCopyOverride) {
            textToCopy = textToCopyOverride;
        } else if (element) {
            textToCopy = element.textContent || element.innerText;
        } else {
            console.error(`Elemento com ID ${elementId} não encontrado para cópia.`);
            if (feedback) {
                feedback.textContent = 'Erro!';
                feedback.style.opacity = '1';
                setTimeout(() => feedback.style.opacity = '0', 2000);
            }
            return;
        }

        navigator.clipboard.writeText(textToCopy).then(() => {
            if (feedback) {
                feedback.textContent = 'Copiado!';
                feedback.style.opacity = '1';
                setTimeout(() => feedback.style.opacity = '0', 2000);
            }
            showCentralMessage(`"${textToCopy}" copiado!`, 1500); // Feedback global
            playSound(clickSoundEffect); // Toca o som de clique ao copiar
        }).catch(err => {
            console.error('Erro ao copiar: ', err);
            if (feedback) {
                feedback.textContent = 'Erro ao copiar!';
                feedback.style.opacity = '1';
                setTimeout(() => feedback.style.opacity = '0', 2000);
            }
            showCentralMessage("Erro ao copiar!", 1500);
        });
    }

    const copyIpPortBtn = document.getElementById('copyIpPortBtn');
    if (copyIpPortBtn) {
        copyIpPortBtn.addEventListener('click', function() {
            const ip = document.getElementById('serverIp');
            const port = document.getElementById('serverPort');
            if (ip && port) {
                const fullAddress = `${ip.textContent}:${port.textContent}`;
                copyToClipboard(null, 'copyIpPortFeedback', fullAddress); // Passa o texto completo
            } else {
                console.error("Elementos para IP ou Porta não encontrados.");
            }
        });
    }

    const copyAddressBtn = document.getElementById('copyAddressBtn');
    if (copyAddressBtn) {
        copyAddressBtn.addEventListener('click', function() {
            copyToClipboard('serverAddress', 'copyAddressFeedback');
        });
    }

    const copyNewAccessBtn = document.getElementById('copyNewAccessBtn');
    if (copyNewAccessBtn) {
        copyNewAccessBtn.addEventListener('click', function() {
            copyToClipboard('newAccessAddress', 'copyNewAccessFeedback');
        });
    }
});