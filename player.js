document.addEventListener('DOMContentLoaded', () => {
    console.log("Player Otimizado Iniciado (Sem Efeitos)");

    // ===================================================================
    // 1. ELEMENTOS DOM
    // =================================================================== 
    const backgroundAudio = document.getElementById('backgroundAudio');
    const audioControlButton = document.getElementById('audioControlButton');
    const audioPrevButton = document.getElementById('audioPrevButton');
    const audioNextButton = document.getElementById('audioNextButton');
    const audioModeButton = document.getElementById('audioModeButton');
    const musicTitleDisplay = document.getElementById('musicTitleDisplay');
    const audioProgressBar = document.getElementById('audioProgressBar');
    const currentTimeDisplay = document.getElementById('currentTimeDisplay');
    const durationDisplay = document.getElementById('durationDisplay');
    const playbackSpeedSelect = document.getElementById('playbackSpeed');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeButton = document.getElementById('volumeButton');
    const centralMessage = document.getElementById('centralMessage');

    // ===================================================================
    // 2. CONFIGURAÇÃO E ESTADO
    // =================================================================== 
    let currentMode = localStorage.getItem('audioMode') || 'sequencial';
    let currentMusicIndex = 0;
    let isDragging = false;

    const playlist = [
        { title: 'Calm 1', src: 'assets/audios/musics/c418/calm1.mp3' },
        { title: 'Calm 2', src: 'assets/audios/musics/c418/calm2.mp3' }
    ];

    // ===================================================================
    // 3. FUNÇÕES AUXILIARES E MENSAGENS (COM DESCRIÇÃO)
    // =================================================================== 
    const formatTime = (seconds) => {
        if (isNaN(seconds) || seconds < 0) return "0:00";
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    };

    const showMessage = (title, desc, iconClass = "fa-check") => {
        if (centralMessage) {
            const titleStrong = centralMessage.querySelector('.message-content strong');
            const descSpan = centralMessage.querySelector('.message-content span');
            const iconI = centralMessage.querySelector('.message-icon i');
            const iconContainer = centralMessage.querySelector('.message-icon');

            if (titleStrong) titleStrong.textContent = title.toUpperCase();
            if (descSpan) descSpan.textContent = desc;

            if (iconI) {
                iconI.className = `fas ${iconClass}`;
                if (iconContainer) {
                    const t = title.toUpperCase();
                    if (t.includes("ERRO")) iconContainer.style.background = "#ff4444";
                    else if (t.includes("PAUSADO")) iconContainer.style.background = "#ffa000";
                    else if (t.includes("VOLUME")) iconContainer.style.background = "#2196F3";
                    else iconContainer.style.background = "#1db954";
                }
            }

            // Animação de entrada
            centralMessage.classList.remove('hide');
            centralMessage.classList.add('show');

            clearTimeout(centralMessage.timer);
            centralMessage.timer = setTimeout(() => {
                // Animação de saída
                centralMessage.classList.add('hide');
                setTimeout(() => {
                    centralMessage.classList.remove('show', 'hide');
                }, 500); // Tempo da transição CSS
            }, 3500);
        }
    };

    const updateUI = () => {
        if (audioControlButton) {
            const icon = audioControlButton.querySelector('i');
            if (icon) {
                icon.className = (!backgroundAudio.paused && backgroundAudio.duration > 0)
                    ? 'fas fa-pause' : 'fas fa-play';
            }
        }
        if (musicTitleDisplay && playlist[currentMusicIndex]) {
            musicTitleDisplay.textContent = playlist[currentMusicIndex].title;
        }
        if (audioModeButton) {
            const modeIcon = audioModeButton.querySelector('i');
            if (modeIcon) {
                const icons = {
                    'sequencial': 'fas fa-list-ol',
                    'aleatorio': 'fas fa-random',
                    'loop': 'fas fa-repeat'
                };
                modeIcon.className = icons[currentMode];
            }
        }
    };

    const saveState = () => {
        const state = {
            index: currentMusicIndex,
            currentTime: backgroundAudio.currentTime,
            volume: backgroundAudio.volume,
            mode: currentMode,
            paused: backgroundAudio.paused
        };
        localStorage.setItem('audioState', JSON.stringify(state));
    };

    // ===================================================================
    // 4. LÓGICA DO PLAYER
    // =================================================================== 
    const loadMusic = (index, autoPlay = true, titleMsg = "TOCANDO", iconMsg = "fa-play") => {
        if (!playlist[index]) index = 0;
        currentMusicIndex = index; // Atualiza o índice global
        const music = playlist[currentMusicIndex];

        backgroundAudio.pause();
        backgroundAudio.src = music.src;
        backgroundAudio.load();
        updateUI(); // Atualiza o título no painel

        if (autoPlay) {
            backgroundAudio.play()
                .then(() => {
                    updateUI();
                    // Exibe a mensagem com o Título da ação, Nome da Música e o Ícone correto
                    showMessage(titleMsg, music.title, iconMsg);
                })
                .catch(() => updateUI());
        }
    };

    const togglePlay = () => {
        if (backgroundAudio.paused) {
            backgroundAudio.play().then(() => {
                updateUI();
                showMessage("RETOMADO", playlist[currentMusicIndex].title, "fa-play");
            });
        } else {
            backgroundAudio.pause();
            updateUI();
            showMessage("PAUSADO", "O áudio foi interrompido", "fa-pause");
        }
    };

    // ===================================================================
    // 5. EVENT LISTENERS
    // =================================================================== 
    if (audioControlButton) audioControlButton.addEventListener('click', togglePlay);

    if (audioNextButton) {
        audioNextButton.addEventListener('click', () => {
            let nextIndex = (currentMusicIndex + 1) % playlist.length;
            if (currentMode === 'aleatorio') {
                nextIndex = Math.floor(Math.random() * playlist.length);
            }
            // O terceiro parâmetro define o Título da mensagem, o quarto o Ícone
            loadMusic(nextIndex, true, "PRÓXIMO", "fa-step-forward");
        });
    }

    if (audioPrevButton) {
        audioPrevButton.addEventListener('click', () => {
            if (backgroundAudio.currentTime > 3) {
                backgroundAudio.currentTime = 0;
                showMessage("REINICIADO", playlist[currentMusicIndex].title, "fa-undo");
            } else {
                const prevIndex = (currentMusicIndex - 1 + playlist.length) % playlist.length;
                loadMusic(prevIndex, true, "ANTERIOR", "fa-step-backward");
            }
        });
    }

    if (audioModeButton) {
        audioModeButton.addEventListener('click', () => {
            const modes = ['sequencial', 'aleatorio', 'loop'];
            let nextModeIndex = (modes.indexOf(currentMode) + 1) % modes.length;
            currentMode = modes[nextModeIndex];
            localStorage.setItem('audioMode', currentMode);
            updateUI();
            showMessage("MODO ALTERADO", `Ativado: ${currentMode.toUpperCase()}`, "fa-sync-alt");
        });
    }

    if (backgroundAudio) {
        backgroundAudio.addEventListener('timeupdate', () => {
            if (!isDragging && audioProgressBar && backgroundAudio.duration) {
                audioProgressBar.value = (backgroundAudio.currentTime / backgroundAudio.duration) * 100;
                currentTimeDisplay.textContent = formatTime(backgroundAudio.currentTime);
                durationDisplay.textContent = formatTime(backgroundAudio.duration);
            }
        });
        backgroundAudio.addEventListener('ended', () => {
            if (currentMode === 'loop') loadMusic(currentMusicIndex, true, "REPETINDO");
            else {
                showMessage("PULANDO", "Iniciando próxima faixa...", "fa-forward");
                setTimeout(() => {
                    let nextIndex = (currentMusicIndex + 1) % playlist.length;
                    if (currentMode === 'aleatorio') nextIndex = Math.floor(Math.random() * playlist.length);
                    loadMusic(nextIndex, true);
                }, 1000);
            }
        });
        backgroundAudio.addEventListener('error', () => {
            showMessage("ERRO", "Não foi possível carregar a música", "fa-exclamation-triangle");
        });
    }

    // Dentro do evento DOMContentLoaded
    if (volumeButton && volumeSlider) {
        volumeButton.addEventListener('click', (e) => {
            e.stopPropagation(); //
            volumeSlider.classList.toggle('is-active');
        });

        // Impede que o clique no próprio slider o feche
        volumeSlider.addEventListener('click', (e) => e.stopPropagation());
    }

    // Garante que o slider feche ao clicar fora
    document.addEventListener('click', () => {
        if (volumeSlider) volumeSlider.classList.remove('is-active');
    });

    // Fecha o slider ao clicar em qualquer outro lugar da página
    document.addEventListener('click', () => {
        if (volumeSlider) volumeSlider.classList.remove('is-active');
    });

    // Controle de Volume e Mensagens
    if (volumeSlider) {
        volumeSlider.addEventListener('input', () => {
            backgroundAudio.volume = volumeSlider.value;
            const volPercent = Math.round(backgroundAudio.volume * 100);

            const icon = volumeButton.querySelector('i');
            if (icon) {
                if (backgroundAudio.volume == 0) icon.className = 'fas fa-volume-mute';
                else if (backgroundAudio.volume < 0.5) icon.className = 'fas fa-volume-down';
                else icon.className = 'fas fa-volume-up';
            }

            // Mensagem informativa com Título, Descrição e Ícone
            if (volPercent % 20 === 0) {
                showMessage("VOLUME ATUAL", `${volPercent}% do volume total`, "fa-volume-up");
            }
            saveState();
        });
    }

    // Restante do estado e inicialização...
    const savedState = JSON.parse(localStorage.getItem('audioState'));
    if (savedState) {
        currentMusicIndex = savedState.index || 0;
        currentMode = savedState.mode || 'sequencial';
        backgroundAudio.volume = savedState.volume ?? 1;
        if (volumeSlider) volumeSlider.value = backgroundAudio.volume;
        loadMusic(currentMusicIndex, false);
        backgroundAudio.currentTime = savedState.currentTime || 0;
    } else {
        loadMusic(0, false);
    }
    updateUI();

    // BARRA DE PROGRESSO: Permite selecionar e arrastar a música
    if (audioProgressBar) {
        audioProgressBar.addEventListener('input', () => {
            isDragging = true; // Pausa a atualização automática do tempo enquanto arrasta
        });

        audioProgressBar.addEventListener('change', () => {
            if (backgroundAudio.duration) {
                const time = (audioProgressBar.value / 100) * backgroundAudio.duration;
                backgroundAudio.currentTime = time;
            }
            isDragging = false;
        });
    }

    // ===================================================================
    // 7. OCULTAR PLAYER NO FOOTER (MOBILE)
    // =================================================================== 
    // BARRA DE PROGRESSO: Permite selecionar e arrastar a música
    if (audioProgressBar) {
        audioProgressBar.addEventListener('input', () => {
            isDragging = true; // Pausa a atualização automática do tempo enquanto arrasta
        });

        audioProgressBar.addEventListener('change', () => {
            if (backgroundAudio.duration) {
                const time = (audioProgressBar.value / 100) * backgroundAudio.duration;
                backgroundAudio.currentTime = time;
            }
            isDragging = false;
        });
    }
});