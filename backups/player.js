/* ===================================================================
   ZERA'S CRAFT - PLAYER DE ÁUDIO AVANÇADO (FLUXO INTELIGENTE DE CARREGAMENTO)
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

    // ===================================================================
    // 2. PLAYLIST COMPLETA (COM CORES)
    // =================================================================== 
    const playlist = [
        // AMBIENTE (Background) - Azul Claro
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'A Familiar Room', src: 'assets/audios/musics/background/a_familiar_room.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Aerie (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Aerie.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'An Ordinary Day', src: 'assets/audios/musics/background/an_ordinary_day.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Ancestry', src: 'assets/audios/musics/background/ancestry.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Bromeliad', src: 'assets/audios/musics/background/bromeliad.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Calm 1', src: 'assets/audios/musics/background/calm1.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Calm 2', src: 'assets/audios/musics/background/calm2.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Calm 3', src: 'assets/audios/musics/background/calm3.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Comforting Memories (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Comforting.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Creator (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Creator.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Dunes', src: 'assets/audios/musics/background/dunes.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Echo in the Wind', src: 'assets/audios/musics/background/echo_in_the_wind.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Firebugs', src: 'assets/audios/musics/background/firebugs.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Floating Dream', src: 'assets/audios/musics/background/floating_dream.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Hal 1', src: 'assets/audios/musics/background/hal1.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Hal 2', src: 'assets/audios/musics/background/hal2.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Hal 3', src: 'assets/audios/musics/background/hal3.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Hal 4', src: 'assets/audios/musics/background/hal4.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Infinite Amethyst (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Infinity.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Labyrinthine', src: 'assets/audios/musics/background/labyrinthine.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Left to Bloom (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Left.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Nuance 1', src: 'assets/audios/musics/background/nuance1.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Nuance 2', src: 'assets/audios/musics/background/nuance2.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'One more Day!', src: 'assets/audios/musics/background/one_more_day.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Otherside (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Otherside.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Piano 1', src: 'assets/audios/musics/background/piano1.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Piano 2', src: 'assets/audios/musics/background/piano2.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Piano 3', src: 'assets/audios/musics/background/piano3.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Stand Tall', src: 'assets/audios/musics/background/stand_tall.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Wending', src: 'assets/audios/musics/background/wending.mp3' },

        // C418 ALBUM - Verde Clássico
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Aria Math', src: 'assets/audios/musics/c418/Aria-Math.mp3' },
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Beginning', src: 'assets/audios/musics/c418/Beginning.mp3' },
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Biome Fest', src: 'assets/audios/musics/c418/Biome-Fest.mp3' },
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Blind Spots', src: 'assets/audios/musics/c418/Blind-Spots.mp3' },
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Clark', src: 'assets/audios/musics/c418/Clark.mp3' },
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Danny', src: 'assets/audios/musics/c418/Danny.mp3' },
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Dreiton', src: 'assets/audios/musics/c418/Dreiton.mp3' },
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Dry Hands', src: 'assets/audios/musics/c418/Dry-Hands.mp3' },
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Floating Trees', src: 'assets/audios/musics/c418/Floating-Trees.mp3' },
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Haggstrom', src: 'assets/audios/musics/c418/Haggstrom.mp3' },
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Key', src: 'assets/audios/musics/c418/Key.mp3' },
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Living Mice', src: 'assets/audios/musics/c418/Living-Mice.mp3' },
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Mice On Venus', src: 'assets/audios/musics/c418/Mice-On-Venus.mp3' },
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Minecraft', src: 'assets/audios/musics/c418/Minecraft.mp3' },
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Moog City 1', src: 'assets/audios/musics/c418/Moog-City1.mp3' },
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Moog City 2', src: 'assets/audios/musics/c418/Moog-City2.mp3' },
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Mutation', src: 'assets/audios/musics/c418/Mutation.mp3' },
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Sweden', src: 'assets/audios/musics/c418/Sweden.mp3' },
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Taswell', src: 'assets/audios/musics/c418/Taswell.mp3' },
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Wet Hands', src: 'assets/audios/musics/c418/Wet-Hands.mp3' },

        // CREATIVE MUSICS - Verde Folha
        { icon: 'fas fa-leaf', color: '#8bc34a', playlist: 'Creative', title: 'Creative 1', src: 'assets/audios/musics/minecraft/Creative1.mp3' },
        { icon: 'fas fa-leaf', color: '#8bc34a', playlist: 'Creative', title: 'Creative 2', src: 'assets/audios/musics/minecraft/Creative2.mp3' },
        { icon: 'fas fa-leaf', color: '#8bc34a', playlist: 'Creative', title: 'Creative 3', src: 'assets/audios/musics/minecraft/Creative3.mp3' },
        { icon: 'fas fa-leaf', color: '#8bc34a', playlist: 'Creative', title: 'Creative 4', src: 'assets/audios/musics/minecraft/Creative4.mp3' },
        { icon: 'fas fa-leaf', color: '#8bc34a', playlist: 'Creative', title: 'Creative 5', src: 'assets/audios/musics/minecraft/Creative5.mp3' },
        { icon: 'fas fa-leaf', color: '#8bc34a', playlist: 'Creative', title: 'Creative 6', src: 'assets/audios/musics/minecraft/Creative6.mp3' },

        // END MUSICS - Roxo
        { icon: 'fas fa-bolt', color: '#9c27b0', playlist: 'End', title: 'Boss', src: 'assets/audios/musics/end/Boss.mp3' },
        { icon: 'fas fa-bolt', color: '#9c27b0', playlist: 'End', title: 'Créditos', src: 'assets/audios/musics/end/Credits.mp3' },
        { icon: 'fas fa-bolt', color: '#9c27b0', playlist: 'End', title: 'Fim', src: 'assets/audios/musics/end/End.mp3' },

        // MUSICS GENERAL - Rosa
        { icon: 'fas fa-music', color: '#e91e63', playlist: 'Músicas', title: 'Alone', src: 'assets/audios/musics/musics/Alone.mp3' },
        { icon: 'fas fa-music', color: '#e91e63', playlist: 'Músicas', title: 'Aria Math Lofi', src: 'assets/audios/musics/musics/Aria-Math-Lofi.mp3' },
        { icon: 'fas fa-music', color: '#e91e63', playlist: 'Músicas', title: 'Megalovania (hakkaku)', src: 'assets/audios/musics/musics/Megalovania.mp3' },
        { icon: 'fas fa-music', color: '#e91e63', playlist: 'Músicas', title: 'Over the Waterfall (Varu)', src: 'assets/audios/musics/musics/Over-the-Waterfall.mp3' },
        { icon: 'fas fa-music', color: '#e91e63', playlist: 'Músicas', title: 'Rat Dance (Jatis)', src: 'assets/audios/musics/musics/Rat-Dance.mp3' },
        { icon: 'fas fa-music', color: '#e91e63', playlist: 'Músicas', title: 'The Fat Rat - Note Block', src: 'assets/audios/musics/musics/TheFatRat_NoteBlock.mp3' },

        // NETHER MUSICS - Vermelho Fogo
        { icon: 'fas fa-meteor', color: '#f44336', playlist: 'Nether', title: 'Chrysopoeia', src: 'assets/audios/musics/nether/Chrysopoeia.mp3' },
        { icon: 'fas fa-meteor', color: '#f44336', playlist: 'Nether', title: 'Nether 1', src: 'assets/audios/musics/nether/Nether1.mp3' },
        { icon: 'fas fa-meteor', color: '#f44336', playlist: 'Nether', title: 'Nether 2', src: 'assets/audios/musics/nether/Nether2.mp3' },
        { icon: 'fas fa-meteor', color: '#f44336', playlist: 'Nether', title: 'Nether 3', src: 'assets/audios/musics/nether/Nether3.mp3' },
        { icon: 'fas fa-meteor', color: '#f44336', playlist: 'Nether', title: 'Nether 4', src: 'assets/audios/musics/nether/Nether4.mp3' },
        { icon: 'fas fa-meteor', color: '#f44336', playlist: 'Nether', title: 'Rubedo', src: 'assets/audios/musics/nether/Rubedo.mp3' },
        { icon: 'fas fa-meteor', color: '#f44336', playlist: 'Nether', title: 'So Below', src: 'assets/audios/musics/nether/So_Below.mp3' },

        // RECORDS - Amarelo / Dourado
        { icon: 'fas fa-compact-disc', color: '#ffc107', playlist: 'Discos', title: 'Blocks', src: 'assets/audios/musics/records/Blocks.mp3' },
        { icon: 'fas fa-compact-disc', color: '#ffc107', playlist: 'Discos', title: 'Cat', src: 'assets/audios/musics/records/Cat.mp3' },
        { icon: 'fas fa-compact-disc', color: '#ffc107', playlist: 'Discos', title: 'Far', src: 'assets/audios/musics/records/Far.mp3' },
        { icon: 'fas fa-compact-disc', color: '#ffc107', playlist: 'Discos', title: 'Mall', src: 'assets/audios/musics/records/Mall.mp3' },
        { icon: 'fas fa-compact-disc', color: '#ffc107', playlist: 'Discos', title: 'Mellohi', src: 'assets/audios/musics/records/Mellohi.mp3' },
        { icon: 'fas fa-compact-disc', color: '#ffc107', playlist: 'Discos', title: 'Otherside', src: 'assets/audios/musics/records/Otherside.mp3' },
        { icon: 'fas fa-compact-disc', color: '#ffc107', playlist: 'Discos', title: 'Pingstep Master', src: 'assets/audios/musics/records/Pingstep_Master.mp3' },
        { icon: 'fas fa-compact-disc', color: '#ffc107', playlist: 'Discos', title: 'Relic', src: 'assets/audios/musics/records/Relic.mp3' },
        { icon: 'fas fa-compact-disc', color: '#ffc107', playlist: 'Discos', title: 'Stal', src: 'assets/audios/musics/records/Stal.mp3' },
        { icon: 'fas fa-compact-disc', color: '#ffc107', playlist: 'Discos', title: 'Strad', src: 'assets/audios/musics/records/Strad.mp3' },
        { icon: 'fas fa-compact-disc', color: '#ffc107', playlist: 'Discos', title: 'Wait', src: 'assets/audios/musics/records/Wait.mp3' },
        { icon: 'fas fa-compact-disc', color: '#ffc107', playlist: 'Discos', title: 'Ward', src: 'assets/audios/musics/records/Ward.mp3' },

        // REMIX - Laranja
        { icon: 'fas fa-fire', color: '#ff9800', playlist: 'Remix', title: 'Aria Math (Synthwave)', src: 'assets/audios/musics/remix/Aria-Math.mp3' },
        { icon: 'fas fa-fire', color: '#ff9800', playlist: 'Remix', title: 'Aria Math Piano', src: 'assets/audios/musics/remix/Aria-Math-Piano.mp3' },
        { icon: 'fas fa-fire', color: '#ff9800', playlist: 'Remix', title: 'Cat Remix (Caution & Remix)', src: 'assets/audios/musics/remix/Cat-Remix.mp3' },
        { icon: 'fas fa-fire', color: '#ff9800', playlist: 'Remix', title: 'Minecraft Music Remix', src: 'assets/audios/musics/remix/Minecraft-Remix.mp3' },
        { icon: 'fas fa-fire', color: '#ff9800', playlist: 'Remix', title: 'Pigstep Remix (Fury Hearted)', src: 'assets/audios/musics/remix/Pigstep-Remix.mp3' },
        { icon: 'fas fa-fire', color: '#ff9800', playlist: 'Remix', title: 'Sweden Remix (Caution & Crisis)', src: 'assets/audios/musics/remix/Sweden.mp3' },

        // WATER - Azul
        { icon: 'fas fa-water', color: '#03a9f4', playlist: 'Water', title: 'Axolotl', src: 'assets/audios/musics/water/Axolotl.mp3' },
        { icon: 'fas fa-water', color: '#03a9f4', playlist: 'Water', title: 'Dragon Fish', src: 'assets/audios/musics/water/Dragon_Fish.mp3' },
        { icon: 'fas fa-water', color: '#03a9f4', playlist: 'Water', title: 'Shuniji', src: 'assets/audios/musics/water/Shuniji.mp3' }
    ];

    // ===================================================================
    // VARIÁVEIS DE CONTROLE DO PLAYER
    // =================================================================== 
    let currentMode = 'sequencial';
    let currentMusicIndex = 0;
    let isDragging = false;
    let lastSaveTime = 0;
    let playHistory = [];

    // ===================================================================
    // 3. SISTEMA DE NOTIFICAÇÕES (COM DURAÇÃO INTELIGENTE)
    // =================================================================== 
    let messageTimeout;

    // Agora aceitamos um "duration". Se for 0, a mensagem nunca some sozinha!
    const showMessage = (title, desc, iconClass, colorHex, duration = 3000) => {
        if (!centralMessage) return;

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

        // Limpa timers antigos (ex: uma mensagem de CARREGANDO interrompe qualquer coisa que estava na tela)
        clearTimeout(messageTimeout);

        // Se duration for maior que zero, ela tem um tempo de vida para sumir.
        // Se for zero (0), a mensagem é "imortal" e fica até outra chamar o showMessage por cima!
        if (duration > 0) {
            messageTimeout = setTimeout(() => {
                centralMessage.classList.add('hide');
                setTimeout(() => {
                    if (centralMessage.classList.contains('hide')) {
                        centralMessage.classList.remove('show', 'hide');
                    }
                }, 500);
            }, duration);
        }
    };

    // ===================================================================
    // 4. MEMÓRIA DO PLAYER E INTERFACE
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

            if (nowPlayingIcon) {
                nowPlayingIcon.className = music.icon;
                nowPlayingIcon.style.color = music.color;
            }
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
    const loadMusic = (index, autoPlay = true) => {
        if (!playlist[index]) index = 0;
        currentMusicIndex = index;
        const music = playlist[currentMusicIndex];

        // 1º PASSO DA LINHA DO TEMPO: O Loading entra infinito (duration = 0)
        showMessage("CARREGANDO...", `[${music.playlist}] ${music.title}`, "fa-spinner fa-spin", "#2196F3", 0);

        backgroundAudio.src = music.src;
        backgroundAudio.load();
        updateUI();

        if (autoPlay) {
            backgroundAudio.play().catch(() => {
                // Se der bloqueio, substitui o CARREGANDO por INTERAÇÃO NECESSÁRIA infinito
                showMessage("AVISO", "O navegador bloqueou o áudio automático. Clique no play.", "fa-hand-paper", "#ff0000", 0);
                updateUI();
            });
        }
    };

    const togglePlay = () => {
        if (backgroundAudio.paused) {
            // Volta o aviso de loading infinito logo que clica em play (caso a net engasgue)
            showMessage("CARREGANDO...", `[${playlist[currentMusicIndex].playlist}] ${playlist[currentMusicIndex].title}`, "fa-spinner fa-spin", "#2196F3", 0);

            backgroundAudio.play().catch(() => {
                showMessage("AVISO", "Houve um problema com a reprodução.", "fa-exclamation-circle", "#ff0000", 0);
            });
        } else {
            backgroundAudio.pause();
            showMessage("PAUSADO", "A música foi interrompida.", "fa-pause", "#f1c40f", 3000);
        }
        saveState();
        updateUI();
    };

    const playNext = () => {
        if (currentMode === 'loop') {
            backgroundAudio.currentTime = 0;
            showMessage("CARREGANDO...", `[${playlist[currentMusicIndex].playlist}] ${playlist[currentMusicIndex].title}`, "fa-spinner fa-spin", "#2196F3", 0);
            backgroundAudio.play().catch(() => {
                showMessage("AVISO", "Clique no Play para iniciar.", "fa-hand-paper", "#ff0000", 0);
            });
            return;
        }

        playHistory.push(currentMusicIndex);

        let nextIndex = (currentMusicIndex + 1) % playlist.length;
        if (currentMode === 'aleatorio') {
            nextIndex = Math.floor(Math.random() * playlist.length);
        }

        loadMusic(nextIndex, true);
    };

    const playPrev = () => {
        if (backgroundAudio.currentTime >= 5 || currentMode === 'loop') {
            backgroundAudio.currentTime = 0;
            showMessage("CARREGANDO...", `[${playlist[currentMusicIndex].playlist}] ${playlist[currentMusicIndex].title}`, "fa-spinner fa-spin", "#2196F3", 0);
            backgroundAudio.play().catch(() => {
                showMessage("AVISO", "Clique no Play para iniciar.", "fa-hand-paper", "#ff0000", 0);
            });
        } else {
            if (playHistory.length > 0) {
                currentMusicIndex = playHistory.pop();
            } else {
                currentMusicIndex = (currentMusicIndex - 1 + playlist.length) % playlist.length;
            }
            loadMusic(currentMusicIndex, true);
        }
    };

    // ===================================================================
    // 6. EVENTOS DA API DO NAVEGADOR
    // =================================================================== 

    // Se no meio da música a internet travar
    backgroundAudio.addEventListener('waiting', () => {
        showMessage("CARREGANDO...", `[${playlist[currentMusicIndex].playlist}] ${playlist[currentMusicIndex].title}`, "fa-spinner fa-spin", "#2196F3", 0);
    });

    // 2º PASSO DA LINHA DO TEMPO: A música conseguiu rodar! Substitui CARREGANDO por TOCANDO.
    backgroundAudio.addEventListener('playing', () => {
        showMessage("TOCANDO", `[${playlist[currentMusicIndex].playlist}] ${playlist[currentMusicIndex].title}`, "fa-play", "#1db954", 3000);
        updateUI();
    });

    // LINHA DO TEMPO DE ERROS: Falha -> Pula -> Carrega -> Toca
    backgroundAudio.addEventListener('error', () => {
        const failedMusic = playlist[currentMusicIndex];

        // Passo 1: Informa o Erro Crítico (Fica na tela para o jogador ler)
        showMessage("ERRO NA FAIXA", `Falha em: ${failedMusic.title}`, "fa-exclamation-triangle", "#ff4444", 0);

        // Passo 2: Após 2 segundos, avisa que vai pular
        setTimeout(() => {
            showMessage("PULANDO...", "Indo para a próxima faixa...", "fa-forward", "#ff9800", 0);

            // Passo 3: Manda tocar a próxima (Isso chama o "CARREGANDO..." infinito que depois vira "TOCANDO")
            setTimeout(playNext, 1500);
        }, 2000);
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
            showMessage("MODO ALTERADO", `Ativado: ${currentMode.toUpperCase()}`, "fa-sync-alt", "#ff9800", 3000);
            saveState();
            updateUI();
        });
    }

    if (volumeSlider) {
        volumeSlider.addEventListener('input', () => {
            backgroundAudio.volume = volumeSlider.value;
            const volPercent = Math.round(backgroundAudio.volume * 100);

            let volIcon = 'fa-volume-up';
            if (volPercent === 0) volIcon = 'fa-volume-mute';
            else if (volPercent < 50) volIcon = 'fa-volume-down';

            if (volumeButton) {
                const icon = volumeButton.querySelector('i');
                if (icon) icon.className = `fas ${volIcon}`;
            }

            showMessage("VOLUME", `${volPercent}%`, volIcon, "#2196F3", 2000);
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
    // 8. BOOT INICIAL (LIGA O CARRO)
    // =================================================================== 
    const savedState = JSON.parse(localStorage.getItem('zeraAudioState'));
    if (savedState) {
        currentMusicIndex = savedState.index || 0;
        currentMode = savedState.mode || 'sequencial';
        playHistory = savedState.history || [];

        backgroundAudio.volume = savedState.volume !== undefined ? savedState.volume : 0.5;
        if (volumeSlider) volumeSlider.value = backgroundAudio.volume;

        backgroundAudio.currentTime = savedState.currentTime || 0;

        if (!savedState.paused) {
            // Tenta puxar de onde parou. O loadMusic cuida do CARREGANDO -> TOCANDO.
            loadMusic(currentMusicIndex, true);
        } else {
            // Se estava pausado, carrega mas não dá play automático
            loadMusic(currentMusicIndex, false);
            // Sobrescreve o "CARREGANDO" imediatamente porque não estamos forçando play
            showMessage("PRONTO PARA TOCAR", "Música carregada. Clique no Play.", "fa-play-circle", "#1db954", 0);
        }
    } else {
        // Primeira vez da pessoa no site
        loadMusic(0, false);
        backgroundAudio.volume = 0.5;
        showMessage("PRONTO PARA TOCAR", "Bem-vindo! Clique no Play para ouvir a rádio.", "fa-play-circle", "#1db954", 0);
    }
    updateUI();
});