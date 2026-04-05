/* ===================================================================
   ZERA'S CRAFT - PLAYER DE ÁUDIO AVANÇADO (OTIMIZADO)
=================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // 1. ELEMENTOS DOM
    const backgroundAudio = document.getElementById('backgroundAudio');
    const audioControlButton = document.getElementById('audioControlButton');
    const audioNextButton = document.getElementById('audioNextButton');
    const audioPrevButton = document.getElementById('audioPrevButton');
    const audioModeButton = document.getElementById('audioModeButton');
    const musicTitleDisplay = document.getElementById('musicTitleDisplay');
    const nowPlayingIcon = document.querySelector('.now-playing i');
    const audioProgressBar = document.getElementById('audioProgressBar');
    const currentTimeDisplay = document.getElementById('currentTimeDisplay');
    const durationDisplay = document.getElementById('durationDisplay');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeButton = document.getElementById('volumeButton');
    const centralMessage = document.getElementById('centralMessage');

    // 2. PLAYLIST E ESTADO
    const playlist = [
        { icon: 'fas fa-music', playlist: 'Minecraft', title: 'Calm 1', src: 'assets/audios/musics/background/calm1.mp3' },
        { icon: 'fas fa-book', playlist: 'C418', title: 'Calm 2', src: 'assets/audios/musics/background/calm2.mp3' },
        { icon: 'fas fa-gamepad', playlist: 'Lobby', title: 'Aria Math', src: 'assets/audios/musics/background/ariamath.mp3' }
    ];

    let currentMode = 'sequencial';
    let currentMusicIndex = 0;
    let isDragging = false;
    let lastSaveTime = 0;
    let playHistory = [];
    let lastMessageTime = 0;
    let waitingTimeout; // <- Variável para o atraso inteligente do carregamento

    // ===================================================================
    // 3. SISTEMA DE NOTIFICAÇÕES (CORES E ÍCONES)
    // =================================================================== 
    let messageTimeout;
    const showMessage = (title, desc, iconClass, colorHex) => {
        if (!centralMessage) return;

        lastMessageTime = Date.now();

        const titleStrong = centralMessage.querySelector('.message-content strong');
        const descSpan = centralMessage.querySelector('.message-content span');
        const iconI = centralMessage.querySelector('.message-icon i');
        const iconContainer = centralMessage.querySelector('.message-icon');

        if (titleStrong) titleStrong.textContent = title;
        if (descSpan) descSpan.textContent = desc;

        if (iconI && iconContainer) {
            iconI.className = `fas ${iconClass}`;
            iconContainer.style.backgroundColor = colorHex;
        }

        centralMessage.classList.remove('hide');
        centralMessage.classList.add('show');

        clearTimeout(messageTimeout);
        messageTimeout = setTimeout(() => {
            centralMessage.classList.add('hide');
            setTimeout(() => {
                centralMessage.classList.remove('show', 'hide');
            }, 500);
        }, 3000);
    };

    // ===================================================================
    // 4. MEMÓRIA DO PLAYER
    // =================================================================== 
    const saveState = () => {
        if (!backgroundAudio) return;
        const state = {
            index: currentMusicIndex,
            currentTime: backgroundAudio.currentTime,
            volume: backgroundAudio.volume,
            mode: currentMode,
            paused: backgroundAudio.paused,
            history: playHistory
        };
        localStorage.setItem('zeraAudioState', JSON.stringify(state));
    };

    window.addEventListener('beforeunload', saveState);

    const formatTime = (seconds) => {
        if (isNaN(seconds) || seconds < 0) return "0:00";
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    };

    const updateUI = () => {
        if (audioControlButton) {
            const icon = audioControlButton.querySelector('i');
            if (icon) icon.className = (!backgroundAudio.paused) ? 'fas fa-pause' : 'fas fa-play';
        }

        if (musicTitleDisplay && playlist[currentMusicIndex]) {
            const music = playlist[currentMusicIndex];
            musicTitleDisplay.textContent = `[${music.playlist}] ${music.title}`;
            if (nowPlayingIcon) nowPlayingIcon.className = music.icon;
        }

        if (audioModeButton) {
            const modeIcon = audioModeButton.querySelector('i');
            if (modeIcon) {
                const icons = { 'sequencial': 'fa-list-ol', 'aleatorio': 'fa-random', 'loop': 'fa-repeat' };
                modeIcon.className = `fas ${icons[currentMode]}`;
            }
        }
    };

    // ===================================================================
    // 5. CONTROLES DO ÁUDIO
    // =================================================================== 
    const loadMusic = (index, autoPlay = true, msgTitle = "MÚSICA", msgIcon = "fa-play", msgColor = "#1db954") => {
        if (!playlist[index]) index = 0;
        currentMusicIndex = index;
        const music = playlist[currentMusicIndex];

        clearTimeout(waitingTimeout); // Cancela qualquer aviso de lentidão anterior

        // Mostra qual ação foi feita (Próxima, Anterior, etc)
        showMessage(msgTitle, `[${music.playlist}] ${music.title}`, msgIcon, msgColor);

        backgroundAudio.src = music.src;
        backgroundAudio.load();
        updateUI();

        if (autoPlay) {
            backgroundAudio.play().catch(() => {
                showMessage("ÁUDIO BLOQUEADO", "O navegador exige que você clique no Play.", "fa-hand-paper", "#e91e63");
                updateUI();
            });
        }
    };

    const togglePlay = () => {
        if (backgroundAudio.paused) {
            backgroundAudio.play().then(() => {
                showMessage("TOCANDO", `[${playlist[currentMusicIndex].playlist}] ${playlist[currentMusicIndex].title}`, "fa-play", "#1db954");
            }).catch(() => {
                showMessage("INTERAÇÃO NECESSÁRIA", "Permita o áudio no navegador", "fa-lock", "#e91e63");
            });
        } else {
            backgroundAudio.pause();
            showMessage("PAUSADO", "A música foi interrompida.", "fa-pause", "#f1c40f");
        }
        saveState();
        updateUI();
    };

    const playNext = () => {
        if (currentMode === 'loop') {
            backgroundAudio.currentTime = 0;
            backgroundAudio.play();
            showMessage("REINICIANDO", "Faixa atual em repetição", "fa-redo", "#1db954");
            return;
        }

        playHistory.push(currentMusicIndex);

        let nextIndex = (currentMusicIndex + 1) % playlist.length;
        if (currentMode === 'aleatorio') {
            nextIndex = Math.floor(Math.random() * playlist.length);
        }

        loadMusic(nextIndex, true, "PRÓXIMA MÚSICA", "fa-step-forward", "#1db954");
    };

    const playPrev = () => {
        if (backgroundAudio.currentTime >= 5 || currentMode === 'loop') {
            backgroundAudio.currentTime = 0;
            backgroundAudio.play();
            showMessage("REINICIANDO", "Voltando ao início da música", "fa-undo", "#1db954");
        } else {
            if (playHistory.length > 0) {
                currentMusicIndex = playHistory.pop();
            } else {
                currentMusicIndex = (currentMusicIndex - 1 + playlist.length) % playlist.length;
            }
            loadMusic(currentMusicIndex, true, "MÚSICA ANTERIOR", "fa-step-backward", "#1db954");
        }
    };

    // ===================================================================
    // 6. EVENTOS (API DO ÁUDIO)
    // =================================================================== 

    // (AZUL) Espera 1 segundo. Se a música não tocar, avisa que a internet tá lenta!
    backgroundAudio.addEventListener('waiting', () => {
        clearTimeout(waitingTimeout);
        waitingTimeout = setTimeout(() => {
            showMessage("CONEXÃO LENTA...", "Aguardando carregamento da faixa.", "fa-spinner fa-spin", "#2196F3");
        }, 1000);
    });

    backgroundAudio.addEventListener('playing', () => {
        clearTimeout(waitingTimeout); // A música tocou! Cancela o aviso de lentidão.

        // Só avisa "TOCANDO" se fizer muito tempo da última mensagem, pra não esmagar o aviso de "PRÓXIMA"
        if (Date.now() - lastMessageTime > 2000) {
            showMessage("TOCANDO", `[${playlist[currentMusicIndex].playlist}] ${playlist[currentMusicIndex].title}`, "fa-play", "#1db954");
        }
        updateUI();
    });

    backgroundAudio.addEventListener('error', () => {
        clearTimeout(waitingTimeout);
        showMessage("FALHA NA FAIXA", "Pulando para a próxima música...", "fa-exclamation-triangle", "#ff4444");
        setTimeout(playNext, 2500);
    });

    backgroundAudio.addEventListener('timeupdate', () => {
        if (!isDragging && audioProgressBar && backgroundAudio.duration) {
            audioProgressBar.value = (backgroundAudio.currentTime / backgroundAudio.duration) * 100;
            currentTimeDisplay.textContent = formatTime(backgroundAudio.currentTime);
            durationDisplay.textContent = formatTime(backgroundAudio.duration);
        }
        if (Math.abs(backgroundAudio.currentTime - lastSaveTime) > 1) {
            saveState();
            lastSaveTime = backgroundAudio.currentTime;
        }
    });

    backgroundAudio.addEventListener('ended', playNext);

    // ===================================================================
    // 7. BOTÕES E SLIDERS
    // =================================================================== 
    if (audioControlButton) audioControlButton.addEventListener('click', togglePlay);
    if (audioNextButton) audioNextButton.addEventListener('click', playNext);
    if (audioPrevButton) audioPrevButton.addEventListener('click', playPrev);

    if (audioModeButton) {
        audioModeButton.addEventListener('click', () => {
            const modes = ['sequencial', 'aleatorio', 'loop'];
            currentMode = modes[(modes.indexOf(currentMode) + 1) % modes.length];
            showMessage("MODO ALTERADO", `Ativado: ${currentMode.toUpperCase()}`, "fa-sync-alt", "#ff9800");
            saveState();
            updateUI();
        });
    }

    // VOLUME EM TEMPO REAL
    if (volumeSlider) {
        volumeSlider.addEventListener('input', () => {
            backgroundAudio.volume = volumeSlider.value;
            const volPercent = Math.round(backgroundAudio.volume * 100);

            // Muda o ícone conforme a porcentagem
            let volIcon = 'fa-volume-up';
            if (volPercent === 0) volIcon = 'fa-volume-mute';
            else if (volPercent < 50) volIcon = 'fa-volume-down';

            if (volumeButton) {
                const icon = volumeButton.querySelector('i');
                if (icon) icon.className = `fas ${volIcon}`;
            }

            // (AZUL) Mostra a % exata do volume
            showMessage("VOLUME", `${volPercent}%`, volIcon, "#2196F3");
            saveState();
        });
    }

    if (volumeButton && volumeSlider) {
        volumeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            volumeSlider.classList.toggle('is-active');
        });
        volumeSlider.addEventListener('click', (e) => e.stopPropagation());
    }
    document.addEventListener('click', () => {
        if (volumeSlider) volumeSlider.classList.remove('is-active');
    });

    if (audioProgressBar) {
        audioProgressBar.addEventListener('input', () => isDragging = true);
        audioProgressBar.addEventListener('change', () => {
            if (backgroundAudio.duration) {
                backgroundAudio.currentTime = (audioProgressBar.value / 100) * backgroundAudio.duration;
            }
            isDragging = false;
        });
    }

    // ===================================================================
    // 8. BOOT INICIAL (MEMÓRIA)
    // =================================================================== 
    const savedState = JSON.parse(localStorage.getItem('zeraAudioState'));
    if (savedState) {
        currentMusicIndex = savedState.index || 0;
        currentMode = savedState.mode || 'sequencial';
        playHistory = savedState.history || [];

        backgroundAudio.volume = savedState.volume !== undefined ? savedState.volume : 0.5;
        if (volumeSlider) volumeSlider.value = backgroundAudio.volume;

        loadMusic(currentMusicIndex, false, "CARREGANDO...", "fa-spinner fa-spin", "#2196F3");
        backgroundAudio.currentTime = savedState.currentTime || 0;

        if (!savedState.paused) {
            backgroundAudio.play().catch(() => {
                showMessage("INTERAÇÃO NECESSÁRIA", "Clique no Play para retornar o áudio.", "fa-hand-paper", "#e91e63");
            });
        }
    } else {
        loadMusic(0, false, "CARREGANDO...", "fa-spinner fa-spin", "#2196F3");
        backgroundAudio.volume = 0.5;
    }
    updateUI();
});