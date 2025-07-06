document.addEventListener('DOMContentLoaded', () => {
    console.log("Script principal carregado. DOM Content Loaded.");

    // =====================================
    // 1. Controle de Áudio de Fundo
    // =====================================
    const audio = document.getElementById('backgroundMusic');
    const audioControlButton = document.getElementById('audioControlButton');
    const currentMusicTitle = document.getElementById('currentMusicTitle');
    const audioProgressArc = document.getElementById('audioProgressArc');
    const onIcon = audioControlButton ? audioControlButton.querySelector('.on-icon') : null; // Ícone com X (para mute)
    const offIcon = audioControlButton ? audioControlButton.querySelector('.off-icon') : null; // Ícone sem X (para volume normal)

    // Coleta todas as fontes de música do HTML
    const musicSources = Array.from(audio ? audio.querySelectorAll('source') : []).map(source => ({
        src: source.src,
        title: source.dataset.title || 'Música Desconhecida' // Usa data-title ou um fallback
    }));

    let currentMusicIndex = -1; // Índice da música atualmente selecionada

    console.log(`Músicas encontradas: ${musicSources.length}`, musicSources);

    /**
     * Atualiza o estado visual do botão de controle de áudio (classes, ícones, texto, progresso).
     * Esta função agora se baseia no estado real do elemento <audio>.
     */
    function updateAudioButtonState() {
        if (!audioControlButton || !onIcon || !offIcon || !audio || !currentMusicTitle || !audioProgressArc) {
            console.warn("[updateAudioButtonState] Um ou mais elementos de controle de áudio não encontrados.");
            return;
        }

        console.log(`[updateAudioButtonState] Called. audio.paused = ${audio.paused}, audio.src = ${audio.src ? 'Defined' : 'Undefined'}`);

        // A música está "tocando" se não estiver pausada E tiver uma fonte definida
        const isCurrentlyPlaying = !audio.paused && audio.src && audio.readyState >= 3; // readyState >=3 significa dados suficientes para tocar

        if (isCurrentlyPlaying) {
            audioControlButton.classList.remove('off');
            audioControlButton.classList.add('on'); // Adiciona 'on' class para o neon e borda
            onIcon.style.display = 'none'; // Esconde o ícone de mute
            offIcon.style.display = 'inline-block'; // Mostra o ícone de volume normal
            // O título da música já deve ter sido definido por playRandomMusic()
            audioControlButton.setAttribute('aria-label', `Música tocando: ${currentMusicTitle.textContent}. Clique para pausar.`);
            updateProgressBar(); // Inicia/continua a atualização da barra de progresso
        } else {
            audioControlButton.classList.remove('on'); // Remove 'on' class para desativar o neon e borda
            audioControlButton.classList.add('off');
            onIcon.style.display = 'inline-block'; // Mostra o ícone de mute
            offIcon.style.display = 'none'; // Esconde o ícone de volume normal
            audioControlButton.setAttribute('aria-label', 'Música pausada. Clique para tocar.');
            audioProgressArc.style.transform = `rotate(-45deg)`; // Reseta a barra de progresso
        }
        console.log(`[updateAudioButtonState] UI updated. Button classList: ${audioControlButton.classList}`);
    }

    /**
     * Reproduz uma música aleatória da lista.
     * Tenta lidar com a política de autoplay e erros de reprodução.
     */
    function playRandomMusic() {
        console.log("[playRandomMusic] Attempting to start playback...");

        if (musicSources.length === 0) {
            if (currentMusicTitle) currentMusicTitle.textContent = 'Nenhuma música encontrada.';
            if (audioControlButton) audioControlButton.disabled = true;
            updateAudioButtonState(); // Garante que o botão esteja desligado
            console.warn("[playRandomMusic] No music sources configured in HTML.");
            return;
        }

        let randomIndex;
        if (musicSources.length > 1) {
            do {
                randomIndex = Math.floor(Math.random() * musicSources.length);
            } while (randomIndex === currentMusicIndex);
        } else {
            randomIndex = 0; // Apenas uma música, reproduz ela
        }

        currentMusicIndex = randomIndex;
        const selectedMusic = musicSources[currentMusicIndex];

        audio.src = selectedMusic.src;
        audio.load(); // Carrega a nova fonte (essencial para alguns navegadores/cenários)

        if (currentMusicTitle) currentMusicTitle.textContent = selectedMusic.title; // Atualiza o título imediatamente

        console.log(`[playRandomMusic] Loading '${selectedMusic.title}' from '${selectedMusic.src}'`);

        // Tenta reproduzir a música
        audio.play()
            .then(() => {
                // Reprodução bem-sucedida. O listener do evento 'play' vai chamar updateAudioButtonState().
                console.log(`[playRandomMusic] Successfully playing '${selectedMusic.title}'.`);
            })
            .catch(error => {
                // A promessa de play foi rejeitada.
                console.error(`[playRandomMusic] Failed to play '${selectedMusic.title}' from '${selectedMusic.src}':`, error);

                if (error.name === 'NotAllowedError') {
                    // Autoplay bloqueado. A UI deve refletir que a música não está tocando.
                    if (currentMusicTitle) currentMusicTitle.textContent = 'Clique para tocar.'; // Indica que a interação do usuário é necessária
                    audio.pause(); // Garante que o elemento de áudio esteja realmente pausado
                    updateAudioButtonState(); // Atualiza a UI para o estado OFF
                    console.log("[playRandomMusic] Autoplay blocked. Waiting for user interaction.");
                } else if (error.name === 'NotSupportedError' || error.name === 'AbortError') {
                    // Problema com o próprio arquivo (não suportado, carregamento abortado)
                    if (currentMusicTitle) currentMusicTitle.textContent = 'Desligado.';
                    audio.pause(); // Garante que o áudio esteja pausado
                    updateAudioButtonState(); // Atualiza a UI para o estado OFF
                    console.error("[playRandomMusic] Audio format or loading error:", error);
                    // Opcional: Tenta a próxima música se houverem várias e for um erro de arquivo
                    if (musicSources.length > 1) {
                        console.log("[playRandomMusic] Trying next song due to file error...");
                        setTimeout(playRandomMusic, 1500); // Tenta a próxima após um pequeno atraso
                    }
                } else {
                    // Outros erros genéricos (ex: DOMException se play() for interrompido muito rapidamente)
                    if (currentMusicTitle) currentMusicTitle.textContent = 'Erro de reprodução.';
                    audio.pause(); // Garante que o áudio esteja pausado
                    updateAudioButtonState(); // Atualiza a UI para o estado OFF
                    console.error("[playRandomMusic] Unexpected error during playback:", error);
                }
            });
    }

    /**
     * Pausa a música que está tocando.
     */
    function pauseMusic() {
        console.log("[pauseMusic] Pausing playback.");
        audio.pause(); // Isso irá disparar o listener do evento 'pause'
        if (currentMusicTitle) currentMusicTitle.textContent = 'Desligado'; // Reverte o texto para "Desligado"
        // updateAudioButtonState() será chamada pelo listener do evento 'pause'
    }

    // Event Listener para o clique do botão de controle de áudio
    if (audioControlButton) {
        audioControlButton.addEventListener('click', () => {
            console.log("[audioControlButton] Clicked. Current audio.paused state:", audio.paused);
            // A lógica agora se baseia diretamente no estado 'paused' do elemento de áudio
            if (!audio.paused) { // Se não estiver pausado, está tocando (ou tentando tocar)
                console.log("[audioControlButton] Music is playing, pausing.");
                pauseMusic();
            } else {
                console.log("[audioControlButton] Music is paused, attempting to play.");
                playRandomMusic();
            }
        });
    }


    // Evento quando a música termina (para reproduzir a próxima faixa automaticamente)
    if (audio) {
        audio.addEventListener('ended', () => {
            console.log("[audio] 'ended' event fired. Playing next random music.");
            playRandomMusic();
        });

        // Evento quando o áudio é oficialmente pausado (por código ou UI)
        audio.addEventListener('pause', () => {
            console.log("[audio] 'pause' event fired. Updating UI.");
            // Garante que a UI seja atualizada para o estado pausado
            updateAudioButtonState();
        });

        // Evento quando o áudio oficialmente começa a tocar (por código ou UI)
        audio.addEventListener('play', () => {
            console.log("[audio] 'play' event fired. Updating UI.");
            // Garante que a UI seja atualizada para o estado tocando
            updateAudioButtonState();
        });

        // Evento para erros gerais do elemento de áudio (para depuração)
        audio.addEventListener('error', (e) => {
            console.error("[audio] Error on <audio> element:", e.message, e);
            if (currentMusicTitle) currentMusicTitle.textContent = 'Erro de áudio!';
            audio.pause(); // Garante que o áudio pare de tentar tocar
            updateAudioButtonState(); // Atualiza a UI para o estado OFF
        });
    }


    // Função para atualizar a barra de progresso circular
    function updateProgressBar() {
        if (!audioProgressArc || !audio) return; // Garante que os elementos existam

        // Somente atualiza se o áudio estiver realmente tocando e tiver duração válida
        if (!audio.paused && !isNaN(audio.duration) && audio.duration > 0) {
            const progress = (audio.currentTime / audio.duration); // Progresso de 0 a 1
            const rotation = progress * 360; // Rotação total em graus
            audioProgressArc.style.transform = `rotate(${rotation - 45}deg)`; // -45deg para alinhar o início no topo
            requestAnimationFrame(updateProgressBar); // Solicita o próximo frame
        } else {
            audioProgressArc.style.transform = `rotate(-45deg)`; // Reseta a barra
        }
    }

    // Inicialização do estado do botão de áudio quando a página carrega
    if (audioControlButton) { // Verifica se audioControlButton existe antes de tentar acessar suas propriedades
        if (musicSources.length > 0) {
            audioControlButton.disabled = false;
            if (currentMusicTitle) currentMusicTitle.textContent = 'Clique para tocar.'; // Limpa a mensagem inicial
            updateAudioButtonState(); // Define o estado visual inicial para "off"
            console.log("Audio button initialized to 'Clique para tocar'.");
        } else {
            audioControlButton.disabled = true; // Desabilita o botão se não houver música
            if (currentMusicTitle) currentMusicTitle.textContent = 'Nenhuma música disponível.';
            updateAudioButtonState(); // Define o estado visual inicial para "off" e desabilitado
            console.warn("No music configured. Audio button disabled.");
        }
    } else {
        console.warn("Audio control button not found. Background music functionality might be impaired.");
    }


    // =====================================
    // 2. Seus Outros Scripts Existentes
    // (Mantidos e integrados aqui)
    // =====================================

    // Click Sound Effects (mantido como está, para links e botões específicos)
    const clickSoundEffect = new Audio('audios/effects/click.mp3');
    document.querySelectorAll('a, button[data-sound-effect="select"]').forEach(element => {
        // Evita conflito com o botão de controle de áudio principal
        if (element.id !== 'audioControlButton') {
            element.addEventListener('click', (event) => {
                clickSoundEffect.currentTime = 0;
                clickSoundEffect.play().catch(e => console.error("Error playing click sound effect:", e.message));

                if (element.tagName === 'A' && element.href && element.getAttribute('target') !== '_blank' && element.href.startsWith(window.location.origin)) {
                    // Previne o padrão apenas se for um link interno para uma âncora ou mesma página
                    // e permite que links externos ou _blank funcionem normalmente.
                    event.preventDefault();
                    setTimeout(() => {
                        window.location.href = element.href;
                    }, 200);
                }
            });
        }
    });

    // HOVER/INTERACTION Sound Effects for CARDS
    const selectSound = new Audio('audios/effects/select.mp3');

    const cardSelectors = [
        '.service-card',
        '.role-category-card',
        '.access-card',
        '.event-card',
        '.community-card',
        '.partnership-card',
        '.partnership-proposal-card',
    ].join(', ');

    document.querySelectorAll(cardSelectors).forEach(element => {
        // Evento de mouse enter (quando o mouse entra no card)
        element.addEventListener('mouseenter', () => {
            console.log("Select sound: Mouse entered a card.");
            selectSound.currentTime = 0; // Reset audio to play from start
            selectSound.play().catch(e => console.error("Error playing hover sound on mouseenter:", e.message));
        });

        // Opcional: Evento de click (se você quiser que o som toque também ao clicar)
        // CUIDADO: Isso pode gerar muitos sons se o card for também um link/botão que já tem clickSoundEffect.
        // Pense se quer ter AMBOS os sons tocando no clique, ou apenas um.
        element.addEventListener('click', (event) => {
            console.log("Select sound: Card clicked.");
            // Só toca se o elemento não for um link ou botão já coberto pelo clickSoundEffect global
            // ou se você quiser que o som do card prevaleça/adicione ao som do clique.
            // Para evitar duplicação, você pode remover esta parte se o elemento já tiver data-sound-effect="select"
            // ou se for um 'a' ou 'button' que o clickSoundEffect já pega.
            if (!element.matches('a, button[data-sound-effect="select"]')) {
                selectSound.currentTime = 0;
                selectSound.play().catch(e => console.error("Error playing hover sound on click:", e.message));
            }
        });

        // Opcional: Evento de foco (para navegação por teclado)
        element.addEventListener('focus', () => {
            console.log("Select sound: Card focused.");
            selectSound.currentTime = 0;
            selectSound.play().catch(e => console.error("Error playing hover sound on focus:", e.message));
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