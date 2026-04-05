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
            // BACKGROUND
            { icon: 'fas fa-cloud', playlist: 'Background', title: 'A Familiar Room', src: 'assets/audios/musics/background/a_familiar_room.mp3' },
            { icon: 'fas fa-cloud', playlist: 'Background', title: 'Aerie (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Aerie.mp3' },
            { icon: 'fas fa-cloud', playlist: 'Background', title: 'An Ordinary Day', src: 'assets/audios/musics/background/an_ordinary_day.mp3' },
            { icon: 'fas fa-cloud', playlist: 'Background', title: 'Ancestry', src: 'assets/audios/musics/background/ancestry.mp3' },
            { icon: 'fas fa-cloud', playlist: 'Background', title: 'Bromeliad', src: 'assets/audios/musics/background/bromeliad.mp3' },
            { icon: 'fas fa-cloud', playlist: 'Background', title: 'Calm 1', src: 'assets/audios/musics/background/calm1.mp3' },
            { icon: 'fas fa-cloud', playlist: 'Background', title: 'Calm 2', src: 'assets/audios/musics/background/calm2.mp3' },
            { icon: 'fas fa-cloud', playlist: 'Background', title: 'Calm 3', src: 'assets/audios/musics/background/calm3.mp3' },
            { icon: 'fas fa-cloud', playlist: 'Background', title: 'Comforting Memories (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Comforting.mp3' },
            { icon: 'fas fa-cloud', playlist: 'Background', title: 'Creator (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Creator.mp3' },
            { icon: 'fas fa-cloud', playlist: 'Background', title: 'Dunes', src: 'assets/audios/musics/background/dunes.mp3' },
            { icon: 'fas fa-cloud', playlist: 'Background', title: 'Echo in the Wind', src: 'assets/audios/musics/background/echo_in_the_wind.mp3' },
            { icon: 'fas fa-cloud', playlist: 'Background', title: 'Firebugs', src: 'assets/audios/musics/background/firebugs.mp3' },
            { icon: 'fas fa-cloud', playlist: 'Background', title: 'Floating Dream', src: 'assets/audios/musics/background/floating_dream.mp3' },
            { icon: 'fas fa-cloud', playlist: 'Background', title: 'Hal 1', src: 'assets/audios/musics/background/hal1.mp3' },
            { icon: 'fas fa-cloud', playlist: 'Background', title: 'Hal 2', src: 'assets/audios/musics/background/hal2.mp3' },
            { icon: 'fas fa-cloud', playlist: 'Background', title: 'Hal 3', src: 'assets/audios/musics/background/hal3.mp3' },
            { icon: 'fas fa-cloud', playlist: 'Background', title: 'Hal 4', src: 'assets/audios/musics/background/hal4.mp3' },
            { icon: 'fas fa-cloud', playlist: 'Background', title: 'Infinite Amethyst (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Infinity.mp3' },
            { icon: 'fas fa-cloud', playlist: 'Background', title: 'Labyrinthine', src: 'assets/audios/musics/background/labyrinthine.mp3' },
            { icon: 'fas fa-cloud', playlist: 'Background', title: 'Left to Bloom (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Left.mp3' },
            { icon: 'fas fa-cloud', playlist: 'Background', title: 'Nuance 1', src: 'assets/audios/musics/background/nuance1.mp3' },
            { icon: 'fas fa-cloud', playlist: 'Background', title: 'Nuance 2', src: 'assets/audios/musics/background/nuance2.mp3' },
            { icon: 'fas fa-cloud', playlist: 'Background', title: 'One more Day!', src: 'assets/audios/musics/background/one_more_day.mp3' },
            { icon: 'fas fa-cloud', playlist: 'Background', title: 'Otherside (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Otherside.mp3' },
            { icon: 'fas fa-cloud', playlist: 'Background', title: 'Piano 1', src: 'assets/audios/musics/background/piano1.mp3' },
            { icon: 'fas fa-cloud', playlist: 'Background', title: 'Piano 2', src: 'assets/audios/musics/background/piano2.mp3' },
            { icon: 'fas fa-cloud', playlist: 'Background', title: 'Piano 3', src: 'assets/audios/musics/background/piano3.mp3' },
            { icon: 'fas fa-cloud', playlist: 'Background', title: 'Stand Tall', src: 'assets/audios/musics/background/stand_tall.mp3' },
            { icon: 'fas fa-cloud', playlist: 'Background', title: 'Wending', src: 'assets/audios/musics/background/wending.mp3' },

            // C418 ALBUM
            { icon: 'fas fa-cube', playlist: 'C418', title: 'Aria Math', src: 'assets/audios/musics/c418/Aria-Math.mp3' },
            { icon: 'fas fa-cube', playlist: 'C418', title: 'Beginning', src: 'assets/audios/musics/c418/Beginning.mp3' },
            { icon: 'fas fa-cube', playlist: 'C418', title: 'Biome Fest', src: 'assets/audios/musics/c418/Biome-Fest.mp3' },
            { icon: 'fas fa-cube', playlist: 'C418', title: 'Blind Spots', src: 'assets/audios/musics/c418/Blind-Spots.mp3' },
            { icon: 'fas fa-cube', playlist: 'C418', title: 'Clark', src: 'assets/audios/musics/c418/Clark.mp3' },
            { icon: 'fas fa-cube', playlist: 'C418', title: 'Danny', src: 'assets/audios/musics/c418/Danny.mp3' },
            { icon: 'fas fa-cube', playlist: 'C418', title: 'Dreiton', src: 'assets/audios/musics/c418/Dreiton.mp3' },
            { icon: 'fas fa-cube', playlist: 'C418', title: 'Dry Hands', src: 'assets/audios/musics/c418/Dry-Hands.mp3' },
            { icon: 'fas fa-cube', playlist: 'C418', title: 'Floating Trees', src: 'assets/audios/musics/c418/Floating-Trees.mp3' },
            { icon: 'fas fa-cube', playlist: 'C418', title: 'Haggstrom', src: 'assets/audios/musics/c418/Haggstrom.mp3' },
            { icon: 'fas fa-cube', playlist: 'C418', title: 'Key', src: 'assets/audios/musics/c418/Key.mp3' },
            { icon: 'fas fa-cube', playlist: 'C418', title: 'Living Mice', src: 'assets/audios/musics/c418/Living-Mice.mp3' },
            { icon: 'fas fa-cube', playlist: 'C418', title: 'Mice On Venus', src: 'assets/audios/musics/c418/Mice-On-Venus.mp3' },
            { icon: 'fas fa-cube', playlist: 'C418', title: 'Minecraft', src: 'assets/audios/musics/c418/Minecraft.mp3' },
            { icon: 'fas fa-cube', playlist: 'C418', title: 'Moog City 1', src: 'assets/audios/musics/c418/Moog-City1.mp3' },
            { icon: 'fas fa-cube', playlist: 'C418', title: 'Moog City 2', src: 'assets/audios/musics/c418/Moog-City2.mp3' },
            { icon: 'fas fa-cube', playlist: 'C418', title: 'Mutation', src: 'assets/audios/musics/c418/Mutation.mp3' },
            { icon: 'fas fa-cube', playlist: 'C418', title: 'Sweden', src: 'assets/audios/musics/c418/Sweden.mp3' },
            { icon: 'fas fa-cube', playlist: 'C418', title: 'Taswell', src: 'assets/audios/musics/c418/Taswell.mp3' },
            { icon: 'fas fa-cube', playlist: 'C418', title: 'Wet Hands', src: 'assets/audios/musics/c418/Wet-Hands.mp3' },

            // CREATIVE MUSICS
            { icon: 'fas fa-leaf', playlist: 'Creative', title: 'Creative 1', src: 'assets/audios/musics/minecraft/Creative1.mp3' },
            { icon: 'fas fa-leaf', playlist: 'Creative', title: 'Creative 2', src: 'assets/audios/musics/minecraft/Creative2.mp3' },
            { icon: 'fas fa-leaf', playlist: 'Creative', title: 'Creative 3', src: 'assets/audios/musics/minecraft/Creative3.mp3' },
            { icon: 'fas fa-leaf', playlist: 'Creative', title: 'Creative 4', src: 'assets/audios/musics/minecraft/Creative4.mp3' },
            { icon: 'fas fa-leaf', playlist: 'Creative', title: 'Creative 5', src: 'assets/audios/musics/minecraft/Creative5.mp3' },
            { icon: 'fas fa-leaf', playlist: 'Creative', title: 'Creative 6', src: 'assets/audios/musics/minecraft/Creative6.mp3' },

            // END MUSICS
            { icon: 'fas fa-bolt', playlist: 'End', title: 'Boss', src: 'assets/audios/musics/end/Boss.mp3' },
            { icon: 'fas fa-bolt', playlist: 'End', title: 'Créditos', src: 'assets/audios/musics/end/Credits.mp3' },
            { icon: 'fas fa-bolt', playlist: 'End', title: 'Fim', src: 'assets/audios/musics/end/End.mp3' },

            // MUSICS GENERAL
            { icon: 'fas fa-music', playlist: 'Músicas', title: 'Alone', src: 'assets/audios/musics/musics/Alone.mp3' },
            { icon: 'fas fa-music', playlist: 'Músicas', title: 'Aria Math Lofi', src: 'assets/audios/musics/musics/Aria-Math-Lofi.mp3' },
            { icon: 'fas fa-music', playlist: 'Músicas', title: 'Megalovania (hakkaku)', src: 'assets/audios/musics/musics/Megalovania.mp3' },
            { icon: 'fas fa-music', playlist: 'Músicas', title: 'Over the Waterfall (Varu)', src: 'assets/audios/musics/musics/Over-the-Waterfall.mp3' },
            { icon: 'fas fa-music', playlist: 'Músicas', title: 'Rat Dance (Jatis)', src: 'assets/audios/musics/musics/Rat-Dance.mp3' },
            { icon: 'fas fa-music', playlist: 'Músicas', title: 'The Fat Rat - Note Block', src: 'assets/audios/musics/musics/TheFatRat_NoteBlock.mp3' },

            // NETHER MUSICS
            { icon: 'fas fa-meteor', playlist: 'Nether', title: 'Chrysopoeia', src: 'assets/audios/musics/nether/Chrysopoeia.mp3' },
            { icon: 'fas fa-meteor', playlist: 'Nether', title: 'Nether 1', src: 'assets/audios/musics/nether/Nether1.mp3' },
            { icon: 'fas fa-meteor', playlist: 'Nether', title: 'Nether 2', src: 'assets/audios/musics/nether/Nether2.mp3' },
            { icon: 'fas fa-meteor', playlist: 'Nether', title: 'Nether 3', src: 'assets/audios/musics/nether/Nether3.mp3' },
            { icon: 'fas fa-meteor', playlist: 'Nether', title: 'Nether 4', src: 'assets/audios/musics/nether/Nether4.mp3' },
            { icon: 'fas fa-meteor', playlist: 'Nether', title: 'Rubedo', src: 'assets/audios/musics/nether/Rubedo.mp3' },
            { icon: 'fas fa-meteor', playlist: 'Nether', title: 'So Below', src: 'assets/audios/musics/nether/So_Below.mp3' },

            // RECORDS
            { icon: 'fas fa-compact-disc', playlist: 'Discos', title: 'Blocks', src: 'assets/audios/musics/records/Blocks.mp3' },
            { icon: 'fas fa-compact-disc', playlist: 'Discos', title: 'Cat', src: 'assets/audios/musics/records/Cat.mp3' },
            { icon: 'fas fa-compact-disc', playlist: 'Discos', title: 'Far', src: 'assets/audios/musics/records/Far.mp3' },
            { icon: 'fas fa-compact-disc', playlist: 'Discos', title: 'Mall', src: 'assets/audios/musics/records/Mall.mp3' },
            { icon: 'fas fa-compact-disc', playlist: 'Discos', title: 'Mellohi', src: 'assets/audios/musics/records/Mellohi.mp3' },
            { icon: 'fas fa-compact-disc', playlist: 'Discos', title: 'Otherside', src: 'assets/audios/musics/records/Otherside.mp3' },
            { icon: 'fas fa-compact-disc', playlist: 'Discos', title: 'Pingstep Master', src: 'assets/audios/musics/records/Pingstep_Master.mp3' },
            { icon: 'fas fa-compact-disc', playlist: 'Discos', title: 'Relic', src: 'assets/audios/musics/records/Relic.mp3' },
            { icon: 'fas fa-compact-disc', playlist: 'Discos', title: 'Stal', src: 'assets/audios/musics/records/Stal.mp3' },
            { icon: 'fas fa-compact-disc', playlist: 'Discos', title: 'Strad', src: 'assets/audios/musics/records/Strad.mp3' },
            { icon: 'fas fa-compact-disc', playlist: 'Discos', title: 'Wait', src: 'assets/audios/musics/records/Wait.mp3' },
            { icon: 'fas fa-compact-disc', playlist: 'Discos', title: 'Ward', src: 'assets/audios/musics/records/Ward.mp3' },

            // REMIX
            { icon: 'fas fa-fire', playlist: 'Remix', title: 'Aria Math (Synthwave)', src: 'assets/audios/musics/remix/Aria-Math.mp3' },
            { icon: 'fas fa-fire', playlist: 'Remix', title: 'Aria Math Piano', src: 'assets/audios/musics/remix/Aria-Math-Piano.mp3' },
            { icon: 'fas fa-fire', playlist: 'Remix', title: 'Cat Remix (Caution & Remix)', src: 'assets/audios/musics/remix/Cat-Remix.mp3' },
            { icon: 'fas fa-fire', playlist: 'Remix', title: 'Minecraft Music Remix', src: 'assets/audios/musics/remix/Minecraft-Remix.mp3' },
            { icon: 'fas fa-fire', playlist: 'Remix', title: 'Pigstep Remix (Fury Hearted)', src: 'assets/audios/musics/remix/Pigstep-Remix.mp3' },
            { icon: 'fas fa-fire', playlist: 'Remix', title: 'Sweden Remix (Caution & Crisis)', src: 'assets/audios/musics/remix/Sweden.mp3' },

            // WATER
            { icon: 'fas fa-water', playlist: 'Water', title: 'Axolotl', src: 'assets/audios/musics/water/Axolotl.mp3' },
            { icon: 'fas fa-water', playlist: 'Water', title: 'Dragon Fish', src: 'assets/audios/musics/water/Dragon_Fish.mp3' },
            { icon: 'fas fa-water', playlist: 'Water', title: 'Shuniji', src: 'assets/audios/musics/water/Shuniji.mp3' }
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