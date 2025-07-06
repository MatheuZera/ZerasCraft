document.addEventListener('DOMContentLoaded', () => {
    console.log("Script principal carregado. DOM Content Loaded.");

    // =====================================
    // 1. Controle de Áudio de Fundo - REVISADO
    // =====================================
    const audio = document.getElementById('backgroundMusic');
    const audioControlButton = document.getElementById('audioControlButton');
    const currentMusicTitle = document.getElementById('currentMusicTitle');
    const audioProgressArc = document.getElementById('audioProgressArc');
    const onIcon = audioControlButton ? audioControlButton.querySelector('.on-icon') : null; // Ícone com X (para mute)
    const offIcon = audioControlButton ? audioControlButton.querySelector('.off-icon') : null; // Ícone sem X (para volume normal)

    // Coleta todas as fontes de música do HTML
    // Use `decodeURIComponent` para lidar com espaços e caracteres especiais nos nomes de arquivos
    const musicSources = Array.from(audio ? audio.querySelectorAll('source') : []).map(source => ({
        src: decodeURIComponent(source.src), // Decodifica o URI para usar no console/depuração
        title: source.dataset.title || 'Música Desconhecida'
    }));

    let currentMusicIndex = -1; // Índice da música atualmente selecionada
    let userInteracted = false; // Flag para rastrear a primeira interação do usuário

    console.log(`Músicas encontradas: ${musicSources.length}`, musicSources);

    /**
     * Atualiza o estado visual do botão de controle de áudio (classes, ícones, texto, progresso).
     */
    function updateAudioButtonState() {
        if (!audioControlButton || !onIcon || !offIcon || !audio || !currentMusicTitle || !audioProgressArc) {
            console.warn("[updateAudioButtonState] Um ou mais elementos de controle de áudio não encontrados. Abortando atualização de UI.");
            return;
        }

        const isAudioPlaying = !audio.paused && audio.src && audio.readyState >= 3;
        console.log(`[updateAudioButtonState] Called. isAudioPlaying: ${isAudioPlaying}, audio.paused: ${audio.paused}, audio.src: ${audio.src ? 'Defined' : 'Undefined'}, readyState: ${audio.readyState}`);

        if (isAudioPlaying) {
            audioControlButton.classList.remove('off');
            audioControlButton.classList.add('on');
            onIcon.style.display = 'none';
            offIcon.style.display = 'inline-block';
            audioControlButton.setAttribute('aria-label', `Música tocando: ${currentMusicTitle.textContent}. Clique para pausar.`);
            updateProgressBar();
        } else {
            audioControlButton.classList.remove('on');
            audioControlButton.classList.add('off');
            onIcon.style.display = 'inline-block';
            offIcon.style.display = 'none';
            audioControlButton.setAttribute('aria-label', 'Música pausada. Clique para tocar.');
            audioProgressArc.style.transform = `rotate(-45deg)`; // Reseta a barra de progresso
            // Se o áudio estiver pausado e não houver interação do usuário, exibe a mensagem inicial.
            if (!userInteracted && currentMusicTitle.textContent !== 'Nenhuma música disponível.') {
                currentMusicTitle.textContent = 'Clique para tocar.';
            }
        }
        console.log(`[updateAudioButtonState] UI updated. Button classList: ${audioControlButton.classList}`);
    }

    /**
     * Tenta reproduzir uma música aleatória da lista.
     * Esta função agora é chamada apenas após uma interação explícita do usuário.
     */
    function playRandomMusic() {
        console.log("[playRandomMusic] Attempting to start playback...");

        if (musicSources.length === 0) {
            if (currentMusicTitle) currentMusicTitle.textContent = 'Nenhuma música disponível.';
            if (audioControlButton) audioControlButton.disabled = true;
            updateAudioButtonState();
            console.warn("[playRandomMusic] Nenhuma fonte de música configurada no HTML. Botão de áudio desativado.");
            return;
        }

        let randomIndex;
        if (musicSources.length > 1) {
            do {
                randomIndex = Math.floor(Math.random() * musicSources.length);
            } while (randomIndex === currentMusicIndex);
        } else {
            randomIndex = 0;
        }

        currentMusicIndex = randomIndex;
        const selectedMusic = musicSources[currentMusicIndex];

        audio.src = selectedMusic.src;
        audio.load();

        if (currentMusicTitle) currentMusicTitle.textContent = selectedMusic.title;

        console.log(`[playRandomMusic] Carregando '${selectedMusic.title}' de '${selectedMusic.src}'`);

        audio.play()
            .then(() => {
                userInteracted = true; // Define que o usuário interagiu com sucesso
                console.log(`[playRandomMusic] Sucesso ao reproduzir '${selectedMusic.title}'.`);
            })
            .catch(error => {
                console.error(`[playRandomMusic] Falha ao reproduzir '${selectedMusic.title}' de '${selectedMusic.src}':`, error);
                if (currentMusicTitle) currentMusicTitle.textContent = 'Erro ao tocar música.'; // Mensagem mais clara
                audio.pause();
                updateAudioButtonState();
                // Se o autoplay foi bloqueado, a mensagem "Clique para tocar" é mais útil
                if (error.name === 'NotAllowedError' && currentMusicTitle) {
                    currentMusicTitle.textContent = 'Clique para tocar.';
                    console.warn("[playRandomMusic] Autoplay bloqueado. Aguardando interação do usuário.");
                } else if (error.name === 'NotSupportedError' || error.name === 'AbortError') {
                    console.error("[playRandomMusic] Erro de formato de áudio ou carregamento:", error);
                }
            });
    }

    /**
     * Pausa a música.
     */
    function pauseMusic() {
        console.log("[pauseMusic] Pausando reprodução.");
        audio.pause();
        if (currentMusicTitle) {
            currentMusicTitle.textContent = 'Desligado'; // Reverte o texto para "Desligado"
        }
    }

    // Event Listener para o clique do botão de controle de áudio
    if (audioControlButton) {
        audioControlButton.addEventListener('click', () => {
            console.log("[audioControlButton] Clicado. Estado atual audio.paused:", audio.paused);
            if (!audio.paused) {
                console.log("[audioControlButton] Música está tocando, pausando.");
                pauseMusic();
            } else {
                console.log("[audioControlButton] Música está pausada, tentando tocar.");
                // Se o usuário interagiu pela primeira vez e não há música carregada ou tocando
                if (musicSources.length > 0 && (!audio.src || audio.paused)) {
                    playRandomMusic();
                } else {
                    // Se o áudio está carregado mas pausado (e talvez tenha sido bloqueado), tente tocar
                    audio.play().then(() => {
                        userInteracted = true;
                        console.log("[audioControlButton] Retomando reprodução após clique.");
                    }).catch(error => {
                        console.error("[audioControlButton] Erro ao retomar reprodução:", error);
                        if (currentMusicTitle) currentMusicTitle.textContent = 'Erro ao tocar música.';
                        updateAudioButtonState();
                    });
                }
            }
        });
    }

    // Eventos do elemento <audio>
    if (audio) {
        audio.addEventListener('ended', () => {
            console.log("[audio] Evento 'ended' disparado. Tocando próxima música aleatória.");
            playRandomMusic();
        });

        audio.addEventListener('pause', () => {
            console.log("[audio] Evento 'pause' disparado. Atualizando UI.");
            updateAudioButtonState();
        });

        audio.addEventListener('play', () => {
            console.log("[audio] Evento 'play' disparado. Atualizando UI.");
            updateAudioButtonState();
        });

        audio.addEventListener('error', (e) => {
            console.error("[audio] Erro no elemento <audio>:", e.message, e);
            if (currentMusicTitle) currentMusicTitle.textContent = 'Erro de áudio!';
            audio.pause();
            updateAudioButtonState();
        });

        // Este evento é crucial para saber quando o áudio está pronto para ser reproduzido
        audio.addEventListener('canplaythrough', () => {
            console.log("[audio] canplaythrough event fired. Audio is ready.");
            // Não iniciamos o play aqui, esperamos o clique do usuário
            // Apenas atualizamos o estado do botão para indicar que está pronto
            if (!userInteracted && currentMusicTitle.textContent === 'Carregando...') {
                 currentMusicTitle.textContent = 'Clique para tocar.';
            }
            updateAudioButtonState();
        });

        audio.addEventListener('waiting', () => {
            console.log("[audio] waiting event fired. Buffering...");
            if (currentMusicTitle) currentMusicTitle.textContent = 'Carregando...';
        });
    }

    // Função para atualizar a barra de progresso circular
    function updateProgressBar() {
        if (!audioProgressArc || !audio) return;

        if (!audio.paused && !isNaN(audio.duration) && audio.duration > 0) {
            const progress = (audio.currentTime / audio.duration);
            const rotation = progress * 360;
            audioProgressArc.style.transform = `rotate(${rotation - 45}deg)`;
            requestAnimationFrame(updateProgressBar);
        } else {
            audioProgressArc.style.transform = `rotate(-45deg)`;
        }
    }

    // Inicialização do estado do botão de áudio quando a página carrega
    if (audioControlButton) {
        if (musicSources.length > 0) {
            audioControlButton.disabled = false;
            if (currentMusicTitle) currentMusicTitle.textContent = 'Carregando...'; // Mensagem inicial
            // Tenta carregar a primeira música para preencher o `audio.src` e `audio.readyState`
            // mas sem tentar tocar automaticamente
            audio.src = musicSources[0].src;
            audio.load();
            updateAudioButtonState();
            console.log("Botão de áudio inicializado. Música configurada para o primeiro item da playlist.");
        } else {
            audioControlButton.disabled = true;
            if (currentMusicTitle) currentMusicTitle.textContent = 'Nenhuma música disponível.';
            updateAudioButtonState();
            console.warn("Nenhuma música configurada. Botão de áudio desativado.");
        }
    } else {
        console.warn("Botão de controle de áudio não encontrado. A funcionalidade de música de fundo pode estar comprometida.");
    }

    // =====================================
    // 2. Seus Outros Scripts Existentes
    // (Mantidos e integrados aqui)
    // =====================================

    // Click Sound Effects (mantido como está, para links e botões específicos)
    const clickSoundEffect = new Audio('audios/click.mp3');
    document.querySelectorAll('a, button[data-sound-effect="select"]').forEach(element => {
        if (element.id !== 'audioControlButton') {
            element.addEventListener('click', (event) => {
                clickSoundEffect.currentTime = 0;
                clickSoundEffect.play().catch(e => console.error("Error playing click sound effect:", e.message));

                if (element.tagName === 'A' && element.href && element.getAttribute('target') !== '_blank' && element.href.startsWith(window.location.origin)) {
                    event.preventDefault();
                    setTimeout(() => {
                        window.location.href = element.href;
                    }, 200);
                }
            });
        }
    });

    // HOVER/INTERACTION Sound Effects for CARDS
    const selectSound = new Audio('audios/select.mp3');
    const animationEndSound = new Audio('audios/effects/hover-complete.mp3');

    const playedAnimationEndSound = new WeakSet();

    const cardSelectors = [
        '.service-card',
        '.role-category-card',
        '.access-card',
        '.event-card',
        '.community-card',
        '.partnership-card',
        '.partnership-proposal-card',
        // Adicione seletores para os novos cards baseados nas imagens, se eles não estiverem incluídos nas classes acima
        // Ex: '.card-plataformas', '.card-xp', '.card-guildas', '.card-status'
        // Se eles usarem as classes existentes como 'service-card', não precisa adicionar mais seletores.
    ].join(', ');

    document.querySelectorAll(cardSelectors).forEach(cardElement => {
        cardElement.addEventListener('mouseenter', () => {
            console.log("Select sound: Mouse entered a card. Playing initial sound.");
            selectSound.currentTime = 0;
            selectSound.play().catch(e => console.error("Error playing initial hover sound:", e.message));
            playedAnimationEndSound.delete(cardElement);
        });

        cardElement.addEventListener('transitionend', (event) => {
            if (event.propertyName === 'transform' && cardElement.matches(':hover') && !playedAnimationEndSound.has(cardElement)) {
                console.log("Animation end sound: Transform transition ended on hovered card. Playing final sound.");
                animationEndSound.currentTime = 0;
                animationEndSound.play().catch(e => console.error("Error playing animation end sound:", e.message));
                playedAnimationEndSound.add(cardElement);
            }
        });

        cardElement.addEventListener('mouseleave', () => {
            console.log("Mouse left card. Resetting sound state.");
            playedAnimationEndSound.delete(cardElement);
        });

        cardElement.addEventListener('focus', () => {
            console.log("Select sound: Card focused. Playing initial sound.");
            selectSound.currentTime = 0;
            selectSound.play().catch(e => console.error("Error playing initial hover sound on focus:", e.message));
            playedAnimationEndSound.delete(cardElement);
        });

        cardElement.addEventListener('blur', () => {
            console.log("Card blurred. Resetting sound state.");
            playedAnimationEndSound.delete(cardElement);
        });
    });


    // Copy IP and Port Logic
    const copyIpPortBtn = document.getElementById('copyIpPortBtn');
    if (copyIpPortBtn) {
        copyIpPortBtn.addEventListener('click', () => {
            const ip = document.getElementById('serverIp');
            const port = document.getElementById('serverPort');
            if (ip && port) {
                const textToCopy = `${ip.textContent}:${port.textContent}`;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    alert('IP e Porta copiados: ' + textToCopy);
                    console.log("IP e Porta copiados:", textToCopy);
                }).catch(err => {
                    console.error('Erro ao copiar IP e Porta: ', err);
                });
            } else {
                console.error("Elements for IP or Port not found.");
            }
        });
    }

    const copyAddressBtn = document.getElementById('copyAddressBtn');
    if (copyAddressBtn) {
        copyAddressBtn.addEventListener('click', () => {
            const address = document.getElementById('serverAddress');
            if (address) {
                navigator.clipboard.writeText(address.textContent).then(() => {
                    alert('Endereço copiado: ' + address.textContent);
                    console.log("Endereço copiado:", address.textContent);
                }).catch(err => {
                    console.error('Erro ao copiar Endereço: ', err);
                });
            } else {
                console.error("Element for server address not found.");
            }
        });
    }

    const copyNewAccessBtn = document.getElementById('copyNewAccessBtn');
    if (copyNewAccessBtn) {
        copyNewAccessBtn.addEventListener('click', () => {
            const newAccessAddress = document.getElementById('newAccessAddress');
            if (newAccessAddress) {
                navigator.clipboard.writeText(newAccessAddress.textContent).then(() => {
                    alert('Endereço do Novo Acesso copiado: ' + newAccessAddress.textContent);
                    console.log("Endereço do Novo Acesso copiado:", newAccessAddress.textContent);
                }).catch(err => {
                    console.error('Erro ao copiar Endereço Adicional: ', err);
                });
            } else {
                console.error("Element for new access address not found.");
            }
        });
    }
});