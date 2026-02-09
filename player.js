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
        // BACKGROUND
        { title: ' [Background] ✨ A Familiar Room', src: 'assets/audios/musics/background/a_familiar_room.mp3' },
        { title: ' [Background] ✨ Aerie (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Aerie.mp3' },
        { title: ' [Background] ✨ An Ordinary Day', src: 'assets/audios/musics/background/an_ordinary_day.mp3' },
        { title: ' [Background] ✨ Ancestry', src: 'assets/audios/musics/background/ancestry.mp3' },
        { title: ' [Background] ✨ Bromeliad', src: 'assets/audios/musics/background/bromeliad.mp3' },
        { title: ' [Background] ✨ Calm 1', src: 'assets/audios/musics/background/calm1.mp3' },
        { title: ' [Background] ✨ Calm 2', src: 'assets/audios/musics/background/calm2.mp3' },
        { title: ' [Background] ✨ Calm 3', src: 'assets/audios/musics/background/calm3.mp3' },
        { title: ' [Background] ✨ Comforting Memories (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Comforting.mp3' },
        { title: ' [Background] ✨ Creator (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Creator.mp3' },
        { title: ' [Background] ✨ Dunes', src: 'assets/audios/musics/background/dunes.mp3' },
        { title: ' [Background] ✨ Echo in the Wind', src: 'assets/audios/musics/background/echo_in_the_wind.mp3' },
        { title: ' [Background] ✨ Firebugs', src: 'assets/audios/musics/background/firebugs.mp3' },
        { title: ' [Background] ✨ Floating Dream', src: 'assets/audios/musics/background/floating_dream.mp3' },
        { title: ' [Background] ✨ Hal 1', src: 'assets/audios/musics/background/hal1.mp3' },
        { title: ' [Background] ✨ Hal 2', src: 'assets/audios/musics/background/hal2.mp3' },
        { title: ' [Background] ✨ Hal 3', src: 'assets/audios/musics/background/hal3.mp3' },
        { title: ' [Background] ✨ Hal 4', src: 'assets/audios/musics/background/hal4.mp3' },
        { title: ' [Background] ✨ Infinite Amethyst (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Infinity.mp3' },
        { title: ' [Background] ✨ Labyrinthine', src: 'assets/audios/musics/background/labyrinthine.mp3' },
        { title: ' [Background] ✨ Left to Bloom (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Left.mp3' },
        { title: ' [Background] ✨ Nuance 1', src: 'assets/audios/musics/background/nuance1.mp3' },
        { title: ' [Background] ✨ Nuance 2', src: 'assets/audios/musics/background/nuance2.mp3' },
        { title: ' [Background] ✨ One more Day!', src: 'assets/audios/musics/background/one_more_day.mp3' },
        { title: ' [Background] ✨ Otherside (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Otherside.mp3' },
        { title: ' [Background] ✨ Piano 1', src: 'assets/audios/musics/background/piano1.mp3' },
        { title: ' [Background] ✨ Piano 2', src: 'assets/audios/musics/background/piano2.mp3' },
        { title: ' [Background] ✨ Piano 3', src: 'assets/audios/musics/background/piano3.mp3' },
        { title: ' [Background] ✨ Stand Tall', src: 'assets/audios/musics/background/stand_tall.mp3' },
        { title: ' [Background] ✨ Wending', src: 'assets/audios/musics/background/wending.mp3' },

        // C418 ALBUM
        { title: ' [C418] ⛏️ Aria Math', src: 'assets/audios/musics/c418/Aria-Math.mp3' },
        { title: ' [C418] ⛏️ Beginning', src: 'assets/audios/musics/c418/Beginning.mp3' },
        { title: ' [C418] ⛏️ Biome Fest', src: 'assets/audios/musics/c418/Biome-Fest.mp3' },
        { title: ' [C418] ⛏️ Blind Spots', src: 'assets/audios/musics/c418/Blind-Spots.mp3' },
        { title: ' [C418] ⛏️ Clark', src: 'assets/audios/musics/c418/Clark.mp3' },
        { title: ' [C418] ⛏️ Danny', src: 'assets/audios/musics/c418/Danny.mp3' },
        { title: ' [C418] ⛏️ Dreiton', src: 'assets/audios/musics/c418/Dreiton.mp3' },
        { title: ' [C418] ⛏️ Dry Hands', src: 'assets/audios/musics/c418/Dry-Hands.mp3' },
        { title: ' [C418] ⛏️ Floating Trees', src: 'assets/audios/musics/c418/Floating-Trees.mp3' },
        { title: ' [C418] ⛏️ Haggstrom', src: 'assets/audios/musics/c418/Haggstrom.mp3' },
        { title: ' [C418] ⛏️ Key', src: 'assets/audios/musics/c418/Key.mp3' },
        { title: ' [C418] ⛏️ Living Mice', src: 'assets/audios/musics/c418/Living-Mice.mp3' },
        { title: ' [C418] ⛏️ Mice On Venus', src: 'assets/audios/musics/c418/Mice-On-Venus.mp3' },
        { title: ' [C418] ⛏️ Minecraft', src: 'assets/audios/musics/c418/Minecraft.mp3' },
        { title: ' [C418] ⛏️ Moog City 1', src: 'assets/audios/musics/c418/Moog-City1.mp3' },
        { title: ' [C418] ⛏️ Moog City 2', src: 'assets/audios/musics/c418/Moog-City2.mp3' },
        { title: ' [C418] ⛏️ Mutation', src: 'assets/audios/musics/c418/Mutation.mp3' },
        { title: ' [C418] ⛏️ Sweden', src: 'assets/audios/musics/c418/Sweden.mp3' },
        { title: ' [C418] ⛏️ Taswell', src: 'assets/audios/musics/c418/Taswell.mp3' },
        { title: ' [C418] ⛏️ Wet Hands', src: 'assets/audios/musics/c418/Wet-Hands.mp3' },

        // CREATIVE MUSICS
        { title: ' [Creative] 🍃 Creative 1', src: 'assets/audios/musics/minecraft/Creative1.mp3' },
        { title: ' [Creative] 🍃 Creative 2', src: 'assets/audios/musics/minecraft/Creative2.mp3' },
        { title: ' [Creative] 🍃 Creative 3', src: 'assets/audios/musics/minecraft/Creative3.mp3' },
        { title: ' [Creative] 🍃 Creative 4', src: 'assets/audios/musics/minecraft/Creative4.mp3' },
        { title: ' [Creative] 🍃 Creative 5', src: 'assets/audios/musics/minecraft/Creative5.mp3' },
        { title: ' [Creative] 🍃 Creative 6', src: 'assets/audios/musics/minecraft/Creative6.mp3' },

        // END MUSICS
        { title: ' [End] ⚡ Boss', src: 'assets/audios/musics/end/Boss.mp3' },
        { title: ' [End] ⚡ Créditos', src: 'assets/audios/musics/end/Credits.mp3' },
        { title: ' [End] ⚡ Fim', src: 'assets/audios/musics/end/End.mp3' },

        // MUSICS GENERAL
        { title: ' [Músicas] 🎵 Alone', src: 'assets/audios/musics/musics/Alone.mp3' },
        { title: ' [Músicas] 🎵 Aria Math Lofi', src: 'assets/audios/musics/musics/Aria-Math-Lofi.mp3' },
        { title: ' [Músicas] 🎵 Megalovania (hakkaku)', src: 'assets/audios/musics/musics/Megalovania.mp3' },
        { title: ' [Músicas] 🎵 Over the Waterfall (Varu)', src: 'assets/audios/musics/musics/Over-the-Waterfall.mp3' },
        { title: ' [Músicas] 🎵 Rat Dance (Jatis)', src: 'assets/audios/musics/musics/Rat-Dance.mp3' },
        { title: ' [Músicas] 🎵 The Fat Rat - Note Block', src: 'assets/audios/musics/musics/TheFatRat_NoteBlock.mp3' },

        // NETHER MUSICS
        { title: ' [Nether] 🌠 Chrysopoeia', src: 'assets/audios/musics/nether/Chrysopoeia.mp3' },
        { title: ' [Nether] 🌠 Nether 1', src: 'assets/audios/musics/nether/Nether1.mp3' },
        { title: ' [Nether] 🌠 Nether 2', src: 'assets/audios/musics/nether/Nether2.mp3' },
        { title: ' [Nether] 🌠 Nether 3', src: 'assets/audios/musics/nether/Nether3.mp3' },
        { title: ' [Nether] 🌠 Nether 4', src: 'assets/audios/musics/nether/Nether4.mp3' },
        { title: ' [Nether] 🌠 Rubedo', src: 'assets/audios/musics/nether/Rubedo.mp3' },
        { title: ' [Nether] 🌠 So Below', src: 'assets/audios/musics/nether/So_Below.mp3' },

        // RECORDS
        { title: ' [Discos] 💿 Blocks', src: 'assets/audios/musics/records/Blocks.mp3' },
        { title: ' [Discos] 💿 Cat', src: 'assets/audios/musics/records/Cat.mp3' },
        { title: ' [Discos] 💿 Far', src: 'assets/audios/musics/records/Far.mp3' },
        { title: ' [Discos] 💿 Mall', src: 'assets/audios/musics/records/Mall.mp3' },
        { title: ' [Discos] 💿 Mellohi', src: 'assets/audios/musics/records/Mellohi.mp3' },
        { title: ' [Discos] 💿 Otherside', src: 'assets/audios/musics/records/Otherside.mp3' },
        { title: ' [Discos] 💿 Pingstep Master', src: 'assets/audios/musics/records/Pingstep_Master.mp3' },
        { title: ' [Discos] 💿 Relic', src: 'assets/audios/musics/records/Relic.mp3' },
        { title: ' [Discos] 💿 Stal', src: 'assets/audios/musics/records/Stal.mp3' },
        { title: ' [Discos] 💿 Strad', src: 'assets/audios/musics/records/Strad.mp3' },
        { title: ' [Discos] 💿 Wait', src: 'assets/audios/musics/records/Wait.mp3' },
        { title: ' [Discos] 💿 Ward', src: 'assets/audios/musics/records/Ward.mp3' },

        // REMIX
        { title: ' [Remix] 🔥 Aria Math (Synthwave)', src: 'assets/audios/musics/remix/Aria-Math.mp3' },
        { title: ' [Remix] 🔥 Aria Math Piano', src: 'assets/audios/musics/remix/Aria-Math-Piano.mp3' },
        { title: ' [Remix] 🔥 Cat Remix (Caution & Remix)', src: 'assets/audios/musics/remix/Cat-Remix.mp3' },
        { title: ' [Remix] 🔥 Minecraft Music Remix', src: 'assets/audios/musics/remix/Minecraft-Remix.mp3' },
        { title: ' [Remix] 🔥 Pigstep Remix (Fury Hearted)', src: 'assets/audios/musics/remix/Pigstep-Remix.mp3' },
        { title: ' [Remix] 🔥 Sweden Remix (Caution & Crisis)', src: 'assets/audios/musics/remix/Sweden.mp3' },

        // WATER
        { title: ' [Water] ⭐ Axolotl', src: 'assets/audios/musics/water/Axolotl.mp3' },
        { title: ' [Water] ⭐ Deagon Fish', src: 'assets/audios/musics/water/Dragon_Fish.mp3' },
        { title: ' [Water] ⭐ Shuniji', src: 'assets/audios/musics/water/Shuniji.mp3' },
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