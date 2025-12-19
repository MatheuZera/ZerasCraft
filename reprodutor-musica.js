document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM totalmente carregado e pronto!");

    // ===================================================================
    // 1. SISTEMA DE ÁUDIO & MÚSICAS
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

    let preparingNextMusic = false;
    let userInteractedWithAudio = localStorage.getItem('userInteractedWithAudio') === 'true';
    let currentMode = localStorage.getItem('audioMode') || 'sequencial';
    let currentMusicIndex = -1;

    const musicPlaylist = [
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

        // ?
        { title: ' [?] Minecraft', src: 'assets/audios/musics/?/Minecraft.mp3' },
    ];

    // =====================================
    // Efeitos Sonoros
    // =====================================
    const audioEffects = {
        link: new Audio('assets/audios/effects/link.mp3'),
        card: new Audio('assets/audios/effects/card.mp3'),
        button: new Audio('assets/audios/effects/button.mp3'),
        select: new Audio('assets/audios/effects/select.mp3'),
        click: new Audio('assets/audios/effects/click.mp3'),
        buttonClick: new Audio('assets/audios/effects/button-click.mp3'),
    };

    Object.values(audioEffects).forEach(audio => {
        audio.preload = 'auto';
        audio.volume = 0.5;
    });
    audioEffects.click.volume = 0.7;

    const playEffectSound = (name) => {
        const audioElement = audioEffects[name];
        if (audioElement) {
            const clonedAudio = audioElement.cloneNode();
            clonedAudio.volume = audioElement.volume;
            clonedAudio.play().catch(e => {
                console.error(`Erro ao tentar tocar som de efeito '${name}':`, e.message);
                console.error(`Verifique se o arquivo '${audioElement.src}' existe e está acessível.`);
            });
        }
    };

    // =====================================
    // Funções Auxiliares
    // =====================================
    const showCentralMessage = (message) => {
        const centralMessageElement = document.getElementById('centralMessage');
        if (centralMessageElement) {
            centralMessageElement.textContent = message;
            centralMessageElement.classList.add('show');
            setTimeout(() => {
                centralMessageElement.classList.remove('show');
            }, 3000);
        } else {
            console.log(`[Mensagem Central] ${message}`);
        }
    };

    const formatTime = (seconds) => {
        if (isNaN(seconds) || seconds < 0) return "0:00";
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // =====================================
    // Gerenciamento do Volume
    // =====================================
    const volumeButton = document.getElementById('volumeButton');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeContainer = document.querySelector('.volume-container');

    // A variável correta para o seu áudio de fundo
    const mainAudio = backgroundAudio;

    if (mainAudio && volumeButton && volumeSlider && volumeContainer) {
        // Função para atualizar o ícone do botão de volume
        function updateVolumeIcon(volume) {
            const icon = volumeButton.querySelector('i');
            if (!icon) return;
            icon.classList.remove('fa-volume-mute', 'fa-volume-down', 'fa-volume-up');
            if (volume === 0) {
                icon.classList.add('fa-volume-mute');
            } else if (volume < 0.5) {
                icon.classList.add('fa-volume-down');
            } else {
                icon.classList.add('fa-volume-up');
            }
        }

        // Sincroniza o slider com o volume atual do áudio
        volumeSlider.value = mainAudio.volume;
        updateVolumeIcon(mainAudio.volume);

        // Adiciona evento para mudar o volume
        volumeSlider.addEventListener('input', () => {
            const volumeValue = parseFloat(volumeSlider.value);
            mainAudio.volume = volumeValue;
            updateVolumeIcon(volumeValue);
            // Salva o estado do áudio no localStorage sempre que o volume muda
            saveAudioState();
        });

        // Lógica de clique para mostrar/esconder o slider
        volumeButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Impede que o clique no botão esconda o slider
            volumeSlider.classList.toggle('is-active');
            // Você pode adicionar um som de efeito aqui, se desejar.
            playEffectSound('buttonClick');
        });

        // Esconde o slider se o usuário clicar em qualquer lugar fora dele
        document.addEventListener('click', (event) => {
            if (volumeSlider.classList.contains('is-active') && !volumeContainer.contains(event.target)) {
                volumeSlider.classList.remove('is-active');
            }
        });
    }

    // =====================================
    // Gerenciamento de Áudio Principal
    // =====================================
    const updateModeIcon = () => {
        const iconElement = audioModeButton ? audioModeButton.querySelector('i') : null;
        if (!iconElement) return;

        switch (currentMode) {
            case 'sequencial':
                iconElement.className = 'fas fa-list-ol';
                audioModeButton.setAttribute('title', 'Tocar em sequência');
                showCentralMessage('Modo: 📃 Sequencial');
                break;
            case 'aleatorio':
                iconElement.className = 'fas fa-random';
                audioModeButton.setAttribute('title', 'Reprodução aleatória');
                showCentralMessage('Modo: 🎲 Aleatório');
                break;
            case 'loop':
                iconElement.className = 'fas fa-repeat';
                audioModeButton.setAttribute('title', 'Repetir a música atual');
                showCentralMessage('Modo: 🔂 Repetir');
                break;
        }
    };

    const updateAudioButtonTitle = () => {
        const iconElement = audioControlButton ? audioControlButton.querySelector('i') : null;
        if (!musicTitleDisplay || !iconElement) return;

        if (!backgroundAudio.paused && currentMusicIndex !== -1 && musicPlaylist[currentMusicIndex]) {
            musicTitleDisplay.textContent = musicPlaylist[currentMusicIndex].title;
            iconElement.classList.remove('fa-play');
            iconElement.classList.add('fa-pause');
            if (audioControlButton) audioControlButton.classList.add('is-playing');
        } else {
            musicTitleDisplay.textContent = '[#] 📌 Clique para Tocar';
            iconElement.classList.remove('fa-pause');
            iconElement.classList.add('fa-play');
            if (audioControlButton) audioControlButton.classList.remove('is-playing');
        }
    };

    const getRandomMusicIndex = () => {
        if (musicPlaylist.length === 0) return -1;
        let newIndex;
        if (musicPlaylist.length > 1) {
            do {
                newIndex = Math.floor(Math.random() * musicPlaylist.length);
            } while (newIndex === currentMusicIndex);
        } else {
            newIndex = 0;
        }
        return newIndex;
    };

    const playMusic = () => {
        if (!backgroundAudio || !backgroundAudio.src) {
            console.warn("Áudio não pronto para tocar ou sem fonte.");
            return;
        }
        backgroundAudio.play().then(() => {
            showCentralMessage(`[📌] Tocando: ${musicPlaylist[currentMusicIndex].title}`);
            updateAudioButtonTitle();
            saveAudioState();
        }).catch(e => {
            console.error("Erro ao tentar tocar áudio (provavelmente autoplay bloqueado):", e.message);
            showCentralMessage('[#] Clique para tentar tocar..');
            updateAudioButtonTitle();
            saveAudioState();
        });
    };

    const loadMusic = (index) => {
        if (index === -1 || !musicPlaylist[index]) {
            console.warn("Índice de música inválido.");
            return;
        }
        preparingNextMusic = true;
        currentMusicIndex = index;
        const music = musicPlaylist[currentMusicIndex];
        backgroundAudio.src = music.src;
        backgroundAudio.load();
        backgroundAudio.oncanplaythrough = () => {
            preparingNextMusic = false;
            playMusic();
            updateProgressAndTimers();
            backgroundAudio.oncanplaythrough = null;
            saveAudioState();
        };
        backgroundAudio.onerror = (e) => {
            console.error(`Erro ao carregar áudio: ${music.src}`, e);
            showCentralMessage('[❗] Erro ao carregar música. Pulando...');
            preparingNextMusic = false;
            backgroundAudio.onerror = null;
            setTimeout(() => playNextMusic(), 500);
        };
    };

    const playNextMusic = () => {
        if (musicPlaylist.length === 0) return;
        let nextIndex;
        if (currentMode === 'aleatorio') {
            nextIndex = getRandomMusicIndex();
        } else if (currentMode === 'sequencial') {
            nextIndex = (currentMusicIndex + 1) % musicPlaylist.length;
        } else if (currentMode === 'loop') {
            backgroundAudio.currentTime = 0;
            playMusic();
            return;
        }
        loadMusic(nextIndex);
        showCentralMessage('↪️ Carregando..');
    };

    const playPrevMusic = () => {
        if (musicPlaylist.length === 0) return;
        let prevIndex;
        if (currentMode === 'aleatorio') {
            prevIndex = getRandomMusicIndex();
        } else if (currentMode === 'sequencial') {
            prevIndex = (currentMusicIndex - 1 + musicPlaylist.length) % musicPlaylist.length;
        } else if (currentMode === 'loop') {
            backgroundAudio.currentTime = 0;
            playMusic();
            return;
        }
        loadMusic(prevIndex);
        showCentralMessage('↪️ Carregando..');
    };

    const updateProgressAndTimers = () => {
        if (!audioProgressBar || !currentTimeDisplay || !durationDisplay) return;
        const duration = backgroundAudio.duration;
        if (duration > 0 && isFinite(duration)) {
            const progress = backgroundAudio.currentTime / duration;
            audioProgressBar.value = progress * 100;
            currentTimeDisplay.textContent = formatTime(backgroundAudio.currentTime);
            durationDisplay.textContent = formatTime(duration);
        } else {
            audioProgressBar.value = 0;
            currentTimeDisplay.textContent = "0:00";
            durationDisplay.textContent = "0:00";
        }
    };

    const saveAudioState = () => {
        if (backgroundAudio) {
            const audioState = {
                currentTime: backgroundAudio.currentTime,
                currentMusicIndex: currentMusicIndex,
                paused: backgroundAudio.paused,
                volume: backgroundAudio.volume,
                playbackRate: backgroundAudio.playbackRate,
                userInteracted: userInteractedWithAudio,
                currentMode: currentMode
            };
            localStorage.setItem('audioState', JSON.stringify(audioState));
        }
    };

    const restoreAudioState = () => {
        const savedState = localStorage.getItem('audioState');
        if (savedState) {
            const audioState = JSON.parse(savedState);
            currentMusicIndex = audioState.currentMusicIndex;
            backgroundAudio.volume = audioState.volume;
            backgroundAudio.playbackRate = audioState.playbackRate || 1;
            userInteractedWithAudio = audioState.userInteracted;
            currentMode = audioState.currentMode || 'sequencial';
            updateModeIcon();

            if (playbackSpeedSelect) {
                playbackSpeedSelect.value = backgroundAudio.playbackRate;
            }

            if (currentMusicIndex !== -1 && musicPlaylist[currentMusicIndex]) {
                backgroundAudio.src = musicPlaylist[currentMusicIndex].src;
                backgroundAudio.load();

                backgroundAudio.onloadedmetadata = () => {
                    if (backgroundAudio.duration > 0 && audioState.currentTime < backgroundAudio.duration) {
                        backgroundAudio.currentTime = audioState.currentTime;
                    }
                    updateProgressAndTimers();
                    if (!audioState.paused && userInteractedWithAudio) {
                        playMusic();
                    } else {
                        updateAudioButtonTitle();
                    }
                    backgroundAudio.onloadedmetadata = null;
                    saveAudioState();
                };
                backgroundAudio.onerror = (e) => {
                    console.error("Erro ao carregar música restaurada:", e);
                    showCentralMessage('Erro ao restaurar música. Pulando...');
                    playNextMusic();
                };
            } else {
                playNextMusic();
            }
        } else {
            playNextMusic();
        }
    };

    // =====================================
    // Listeners de Eventos
    // =====================================
    restoreAudioState();
    updateModeIcon();

    // Eventos para efeitos sonoros
    const soundEffectListeners = [
        { selector: 'a', sound: 'link' },
        { selector: 'button:not([id^="audio"])', sound: 'button' },
        { selector: '.card', sound: 'card' },
        { selector: 'select', sound: 'select', event: 'change' },
    ];

    const playedSounds = new Set();
    const playEffectAndCache = (sound) => {
        if (!playedSounds.has(sound)) {
            playEffectSound(sound);
            playedSounds.add(sound);
            setTimeout(() => playedSounds.delete(sound), 500);
        }
    };

    soundEffectListeners.forEach(({ selector, sound, event = 'click' }) => {
        document.querySelectorAll(selector).forEach(element => {
            element.addEventListener(event, () => playEffectAndCache(sound));
        });
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            saveAudioState();
        } else {
            if (!backgroundAudio.paused && userInteractedWithAudio) {
                playMusic();
            } else {
                updateAudioButtonTitle();
            }
        }
    });

    if (audioModeButton) {
        audioModeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            playEffectSound('buttonClick');
            switch (currentMode) {
                case 'sequencial':
                    currentMode = 'aleatorio';
                    break;
                case 'aleatorio':
                    currentMode = 'loop';
                    break;
                default:
                    currentMode = 'sequencial';
            }
            updateModeIcon();
            localStorage.setItem('audioMode', currentMode);
        });
    }

    if (backgroundAudio) {
        backgroundAudio.addEventListener('ended', playNextMusic);
        if (audioNextButton) audioNextButton.addEventListener('click', () => {
            playEffectSound('buttonClick');
            playNextMusic();
        });
        if (audioPrevButton) audioPrevButton.addEventListener('click', () => {
            playEffectSound('buttonClick');
            playPrevMusic();
        });
        backgroundAudio.addEventListener('timeupdate', updateProgressAndTimers);
    }

    if (audioControlButton) {
        audioControlButton.addEventListener('click', (e) => {
            e.stopPropagation();
            playEffectSound('click');
            userInteractedWithAudio = true;
            if (backgroundAudio.paused) {
                if (currentMusicIndex === -1) {
                    playNextMusic();
                } else {
                    playMusic();
                }
            } else {
                backgroundAudio.pause();
                updateAudioButtonTitle();
                showCentralMessage('[⏸️] Reprodução Pausada');
            }
            saveAudioState();
        });
    }

    // Gerenciamento da Barra de Progresso
    if (audioProgressBar && backgroundAudio) {
        audioProgressBar.addEventListener('input', () => {
            const newTime = (audioProgressBar.value / 100) * backgroundAudio.duration;
            if (!isNaN(newTime) && isFinite(newTime)) {
                backgroundAudio.currentTime = newTime;
            }
        });
    }

    // ===================================================================
    // Sistema de Áudio de Fundo (Event Listeners Principais)
    // ===================================================================
    if (backgroundAudio) {
        restoreAudioState();
        backgroundAudio.addEventListener('timeupdate', updateProgressAndTimers);
        backgroundAudio.addEventListener('ended', () => {
            updateProgressAndTimers();
            preparingNextMusic = false;
            loadNewMusic(true); // Carrega a próxima música e a toca
        });
        backgroundAudio.addEventListener('loadedmetadata', updateProgressAndTimers);

        if (audioControlButton) {
            audioControlButton.addEventListener('click', () => {
                playEffectSound(clickSound);
                userInteractedWithAudio = true; // Marca que o usuário interagiu
                localStorage.setItem('userInteractedWithAudio', 'true');

                if (backgroundAudio.paused) {
                    if (currentMusicIndex === -1 || !backgroundAudio.src) {
                        loadNewMusic(true); // Carrega uma música e toca
                    } else {
                        playMusic(); // Apenas toca a música atual
                    }
                } else {
                    backgroundAudio.pause();
                    updateAudioButtonTitle();
                }
            });
        }

        if (audioNextButton) {
            audioNextButton.addEventListener('click', () => {
                playEffectSound(clickSound);
                backgroundAudio.pause(); // Pausa a música atual imediatamente
                showCentralMessage('↪️ Próxima música...');
                preparingNextMusic = false;
                loadNewMusic(true); // Carrega a próxima música e a toca
            });
        }

        if (audioPrevButton) {
            audioPrevButton.addEventListener('click', () => {
                playEffectSound(clickSound);
                backgroundAudio.pause(); // Pausa a música atual imediatamente
                showCentralMessage('↩️ Música anterior...');
                preparingNextMusic = false;
                let prevIndex = currentMusicIndex - 1;
                if (prevIndex < 0) {
                    prevIndex = musicPlaylist.length - 1; // Volta para a última música se estiver na primeira
                }
                loadNewMusic(true, prevIndex); // Carrega e toca a música anterior
            });
        }

        if (audioProgressBar) {
            let isDragging = false;
            // Flag para controlar se o usuário está arrastando

            audioProgressBar.addEventListener('input', () => {
                // Atualiza o tempo exibido instantaneamente enquanto arrasta
                const tempTime = (audioProgressBar.value / 100) * backgroundAudio.duration;
                currentTimeDisplay.textContent = formatTime(tempTime);
            });
            audioProgressBar.addEventListener('mousedown', () => {
                isDragging = true;
                audioProgressBar.dataset.isDragging = 'true'; // Define a flag no dataset
                backgroundAudio.pause();
            });
            audioProgressBar.addEventListener('mouseup', () => {
                isDragging = false;
                audioProgressBar.dataset.isDragging = 'false'; // Limpa a flag
                const seekTime = (audioProgressBar.value / 100) * backgroundAudio.duration;
                if (!isNaN(seekTime) && isFinite(seekTime)) {
                    backgroundAudio.currentTime = seekTime;
                    if (userInteractedWithAudio && backgroundAudio.src) { // Verifica a interação
                        playMusic(); // Retoma a reprodução após soltar
                    }
                } else {
                    console.warn("Tempo de busca inválido.");
                }
            });
            // Adiciona evento para touch devices
            audioProgressBar.addEventListener('touchstart', (e) => {
                isDragging = true;
                audioProgressBar.dataset.isDragging = 'true';
                backgroundAudio.pause();
                // Previne a rolagem da página ao arrastar o slider
                e.preventDefault();
            });
            audioProgressBar.addEventListener('touchend', () => {
                isDragging = false;
                audioProgressBar.dataset.isDragging = 'false';
                const seekTime = (audioProgressBar.value / 100) * backgroundAudio.duration;
                if (!isNaN(seekTime) && isFinite(seekTime)) {
                    backgroundAudio.currentTime = seekTime;
                    if (userInteractedWithAudio && backgroundAudio.src) {
                        playMusic();
                    }
                } else {
                    console.warn("Tempo de busca inválido.");
                }
            });
            audioProgressBar.addEventListener('touchmove', (e) => {
                if (isDragging) {
                    // Calcula a posição do toque para atualizar o slider
                    const rect = audioProgressBar.getBoundingClientRect();
                    const x = e.touches[0].clientX - rect.left;
                    const width = rect.width;
                    let value = (x / width) * 100;
                    value = Math.max(0, Math.min(100, value)); // Garante que o valor esteja entre 0 e 100

                    audioProgressBar.value = value;
                    const tempTime = (value / 100) * backgroundAudio.duration;
                    currentTimeDisplay.textContent = formatTime(tempTime);
                    e.preventDefault(); // Previne a rolagem da página
                }
            });
        }

        if (playbackSpeedSelect) {
            playbackSpeedSelect.addEventListener('change', (event) => {
                const newSpeed = parseFloat(event.target.value);
                if (!isNaN(newSpeed) && newSpeed > 0) {
                    backgroundAudio.playbackRate = newSpeed;
                    saveAudioState();
                    showCentralMessage(`[⏩] Velocidade: ${newSpeed}x`);
                }
            });
        }

        window.addEventListener('beforeunload', saveAudioState);
        window.addEventListener('pagehide', saveAudioState);
    }
});