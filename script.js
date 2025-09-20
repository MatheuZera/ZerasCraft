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
        { title: '✨ Aerie (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Aerie.mp3' },
        { title: '✨ Comforting Memories (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Comforting.mp3' },
        { title: '✨ Creator (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Creator.mp3' },
        { title: '✨ Infinite Amethyst (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Infinity.mp3' },
        { title: '✨ Left to Bloom (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Left.mp3' },
        { title: '✨ Otherside (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Otherside.mp3' },

        { title: '⛏️ Aria Math', src: 'assets/audios/musics/Aria-Math.mp3' },
        { title: '⛏️ Aria Math Lofi', src: 'assets/audios/musics/Aria-Math-Lofi.mp3' },
        { title: '⛏️ Beginning', src: 'assets/audios/musics/Beginning.mp3' },
        { title: '⛏️ Biome Fest', src: 'assets/audios/musics/Biome-Fest.mp3' },
        { title: '⛏️ Blind Spots', src: 'assets/audios/musics/Blind-Spots.mp3' },
        { title: '⛏️ Clark', src: 'assets/audios/musics/Clark.mp3' },
        { title: '⛏️ Danny', src: 'assets/audios/musics/Danny.mp3' },
        { title: '⛏️ Dreiton', src: 'assets/audios/musics/Dreiton.mp3' },
        { title: '⛏️ Dry Hands', src: 'assets/audios/musics/Dry-Hands.mp3' },
        { title: '⛏️ Floating Trees', src: 'assets/audios/musics/Floating-Trees.mp3' },
        { title: '⛏️ Haggstrom', src: 'assets/audios/musics/Haggstrom.mp3' },
        { title: '⛏️ Key', src: 'assets/audios/musics/Key.mp3' },
        { title: '⛏️ Living Mice', src: 'assets/audios/musics/Living-Mice.mp3' },
        { title: '⛏️ Mice On Venus', src: 'assets/audios/musics/Mice-On-Venus.mp3' },
        { title: '⛏️ Minecraft', src: 'assets/audios/musics/Minecraft.mp3' },
        { title: '⛏️ Moog City', src: 'assets/audios/musics/Moog-City.mp3' },
        { title: '⛏️ Mutation', src: 'assets/audios/musics/Mutation.mp3' },
        { title: '⛏️ Sweden', src: 'assets/audios/musics/Sweden.mp3' },
        { title: '⛏️ Taswell', src: 'assets/audios/musics/Taswell.mp3' },
        { title: '⛏️ Wet Hands', src: 'assets/audios/musics/Wet-Hands.mp3' },

        { title: '💿 Blocks', src: 'assets/audios/musics/records/Blocks.mp3' },
        { title: '💿 Cat', src: 'assets/audios/musics/records/Cat.mp3' },
        { title: '💿 Far', src: 'assets/audios/musics/records/Far.mp3' },
        { title: '💿 Mall', src: 'assets/audios/musics/records/Mall.mp3' },
        { title: '💿 Mellohi', src: 'assets/audios/musics/records/Mellohi.mp3' },
        { title: '💿 Otherside', src: 'assets/audios/musics/records/Otherside.mp3' },
        { title: '💿 Pingstep Master', src: 'assets/audios/musics/records/Pingstep_Master.mp3' },
        { title: '💿 Relic', src: 'assets/audios/musics/records/Relic.mp3' },
        { title: '💿 Stal', src: 'assets/audios/musics/records/Stal.mp3' },
        { title: '💿 Strad', src: 'assets/audios/musics/records/Strad.mp3' },
        { title: '💿 Wait', src: 'assets/audios/musics/records/Wait.mp3' },
        { title: '💿 Ward', src: 'assets/audios/musics/records/Ward.mp3' },

        { title: '🍃 Creative 1', src: 'assets/audios/musics/minecraft/Creative1.mp3' },
        { title: '🍃 Creative 2', src: 'assets/audios/musics/minecraft/Creative2.mp3' },
        { title: '🍃 Creative 3', src: 'assets/audios/musics/minecraft/Creative3.mp3' },
        { title: '🍃 Creative 4', src: 'assets/audios/musics/minecraft/Creative4.mp3' },
        { title: '🍃 Creative 5', src: 'assets/audios/musics/minecraft/Creative5.mp3' },
        { title: '🍃 Creative 6', src: 'assets/audios/musics/minecraft/Creative6.mp3' },

        { title: '🎵 over the Waterfall (By Varu)', src: 'assets/audios/musics/others/Over-the-Waterfall.mp3' },
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
    // Configuração de Áudio
    // =====================================

    // Define os caminhos e pre-carrega os sons
    const linkSound = new Audio('assets/audios/effects/link.mp3');
    const cardSound = new Audio('assets/audios/effects/card.mp3');
    const buttonSound = new Audio('assets/audios/effects/button.mp3');
    const selectSound = new Audio('assets/audios/effects/select.mp3');
    const buttonClickSound = new Audio('assets/audios/effects/button-click.mp3');

    linkSound.preload = 'auto';
    cardSound.preload = 'auto';
    buttonSound.preload = 'auto';
    selectSound.preload = 'auto';
    buttonClickSound.preload = 'auto';

    /**
     * Toca um som de forma controlada, clonando o áudio para evitar interrupções.
     * @param {HTMLAudioElement} sound - O objeto de áudio a ser tocado.
     */
    function playSound(sound) {
        const clonedSound = sound.cloneNode();
        clonedSound.play().catch(e => console.error("Erro ao tocar o áudio:", e));
    }

    // =====================================
    // Gerenciamento de Eventos de Clique
    // =====================================

    document.addEventListener('click', (event) => {
        const target = event.target.closest('a, button');

        if (!target) {
            return;
        }

        const isNavLink = target.tagName === 'A' && target.href && !target.href.startsWith('#') && !target.href.includes('javascript:');
        const isSpecialButton = target.tagName === 'BUTTON' || (target.tagName === 'A' && target.href.startsWith('#'));

        if (isNavLink) {
            // Toca o som de link para navegação
            event.preventDefault();
            playSound(linkSound);
            setTimeout(() => {
                window.location.href = target.href;
            }, 300);
        } else if (isSpecialButton) {
            // Toca o som de clique para botões e links internos
            playSound(buttonClickSound);
        }
    });

    // =====================================
    // Gerenciamento de Eventos de Hover
    // =====================================

    // Seletores para os elementos
    const cardElements = document.querySelectorAll(
        '.service-card, .role-category-card, .access-card, .community-card, .event-card, .security-card, .faq-item, .info-card, .card, .marketplace-item, .wiki-category-card, .article-card, .youtube-card, .server-card, .donation-tier-card, .vote-site-card, .team-member-card, .news-featured-card, .news-article-card, .job-opening-card, .forum-post-card, .comment-card, .stat-item, .parallax-card, .card-container, .result-card'
    );

    const buttonElements = document.querySelectorAll(
        'button, .btn, .btn-primary, .btn-destaque, .btn-push-down, .liquid-btn, .tag-btn, .btn-top'
    );

    const textLinkElements = document.querySelectorAll(
        'p a, span a, li a'
    );

    // Adiciona os event listeners
    cardElements.forEach(element => {
        element.addEventListener('mouseenter', () => playSound(cardSound));
    });

    buttonElements.forEach(element => {
        element.addEventListener('mouseenter', () => playSound(buttonSound));
    });

    textLinkElements.forEach(element => {
        element.addEventListener('mouseenter', () => playSound(selectSound));
    });

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
                showCentralMessage('Modo: Sequencial');
                break;
            case 'aleatorio':
                iconElement.className = 'fas fa-random';
                audioModeButton.setAttribute('title', 'Reprodução aleatória');
                showCentralMessage('Modo: Aleatório');
                break;
            case 'loop':
                iconElement.className = 'fas fa-repeat';
                audioModeButton.setAttribute('title', 'Repetir a música atual');
                showCentralMessage('Modo: Repetir');
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
            musicTitleDisplay.textContent = 'Clique para Tocar';
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
            showCentralMessage(`Tocando: ${musicPlaylist[currentMusicIndex].title}`);
            updateAudioButtonTitle();
            saveAudioState();
        }).catch(e => {
            console.error("Erro ao tentar tocar áudio (provavelmente autoplay bloqueado):", e.message);
            showCentralMessage('Clique para tentar tocar..');
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
            showCentralMessage('Erro ao carregar música. Pulando...');
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
        showCentralMessage('Carregando..');
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
        showCentralMessage('Carregando..');
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
                showCentralMessage('Reprodução Pausada');
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
    // 2. Menu Hambúrguer (Otimizado para mais páginas)
    // ===================================================================
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.main-nav');
    const menuIcon = menuToggle.querySelector('i');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');

            if (nav.classList.contains('active')) {
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-times');
            } else {
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            }
        });
    }

    // ===================================================================
    // 3. Funcionalidade de Copiar Texto
    // ===================================================================
    // Esta função foi atualizada para incluir a lógica para o IP/Porta do servidor
    const copyButtons = document.querySelectorAll('.copy-button'); // Certifique-se de que seus botões de cópia têm esta classe
    if (copyButtons.length > 0) {
        copyButtons.forEach(button => {
            button.addEventListener('click', async () => {
                let textToCopy = '';
                let targetElementSelector = button.dataset.copyTarget; // Ex: '#serverIp, #serverPort'
                let originalButtonText = button.textContent;

                if (targetElementSelector) {
                    const selectors = targetElementSelector.split(',').map(s => s.trim());
                    let partsToCopy = [];
                    for (const selector of selectors) {
                        const targetElement = document.querySelector(selector);
                        if (targetElement) {
                            partsToCopy.push(targetElement.textContent.trim());
                        }
                    }
                    if (selectors.includes('#serverIp') && selectors.includes('#serverPort') && partsToCopy.length === 2) {
                        textToCopy = `${partsToCopy[0]}:${partsToCopy[1]}`;
                    } else {
                        textToCopy = partsToCopy.join(' '); // Junta com espaço se for outro tipo de múltiplos elementos
                    }
                } else if (button.dataset.copyText) {
                    textToCopy = button.dataset.copyText;
                }

                if (textToCopy) {
                    try {
                        // Usa a API Clipboard mais moderna se disponível, com fallback para execCommand
                        if (navigator.clipboard && navigator.clipboard.writeText) {
                            await navigator.clipboard.writeText(textToCopy);
                        } else {
                            const textArea = document.createElement("textarea");
                            textArea.value = textToCopy;
                            document.body.appendChild(textArea);
                            textArea.select();
                            document.execCommand('copy');
                            document.body.removeChild(textArea);
                        }

                        showCentralMessage(`'${textToCopy}' copiado!`);
                        button.textContent = 'Copiado!';
                        button.classList.add('copied');
                        setTimeout(() => {
                            button.textContent = originalButtonText;
                            button.classList.remove('copied');
                        }, 2000);
                    } catch (err) {
                        console.error('Erro ao copiar: ', err);
                        showCentralMessage('Falha ao copiar.');
                    }
                } else {
                    showCentralMessage('Nada para copiar.');
                }
                playEffectSound(clickSound);
            });
        });
    }


    // ===================================================================
    // 4. Sistema de Áudio de Fundo (Event Listeners Principais)
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
                showCentralMessage('Próxima música...');
                preparingNextMusic = false;
                loadNewMusic(true); // Carrega a próxima música e a toca
            });
        }

        if (audioPrevButton) {
            audioPrevButton.addEventListener('click', () => {
                playEffectSound(clickSound);
                backgroundAudio.pause(); // Pausa a música atual imediatamente
                showCentralMessage('Música anterior...');
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
                    showCentralMessage(`Velocidade: ${newSpeed}x`);
                }
            });
        }

        window.addEventListener('beforeunload', saveAudioState);
        window.addEventListener('pagehide', saveAudioState);
    }



    // ===================================================================
    // 5. Animações de Rolagem com ScrollReveal
    // ===================================================================
    // Adicionado um pequeno atraso para o ScrollReveal carregar e evitar piscar
    setTimeout(() => {
        if (typeof ScrollReveal !== 'undefined') {
            ScrollReveal().reveal('.reveal', {
                delay: 200,
                distance: '50px',
                origin: 'bottom',
                interval: 100,
                mobile: true // Habilitado em mobile agora para melhor UX
            });
            ScrollReveal().reveal('.reveal-left', {
                delay: 200,
                distance: '50px',
                origin: 'left',
                mobile: true
            });
            ScrollReveal().reveal('.reveal-right', {
                delay: 200,
                distance: '50px',
                origin: 'right',
                mobile: true
            });
            ScrollReveal().reveal('.reveal-up', {
                delay: 200,
                distance: '50px',
                origin: 'top',
                mobile: true
            });
        } else {
            console.warn("ScrollReveal não está definido. Verifique se o script foi incluído corretamente.");
        }
    }, 500); // Atraso de 500ms


    // ===================================================================
    // 6. Sistema de arquivos.html
    // ===================================================================

    // Filter Buttons for Arquivos (addons.html)
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cardGrid = document.getElementById('card-grid');

    const downloadItems = [
        {
            title: 'Addon de Magia Épica',
            category: 'Addon',
            description: 'Adiciona novos feitiços, varinhas e dimensões mágicas ao jogo.',
            imageUrl: 'https://placehold.co/400x225/4CAF50/FFFFFF?text=Magia+Addon',
            version: '1.2.0',
            size: '5.3 MB',
            downloadLink: '#'
        },
        {
            title: 'Mod de Criaturas Lendárias',
            category: 'Mod',
            description: 'Enfrente bosses lendários e domestique novas criaturas para te acompanhar.',
            imageUrl: 'https://placehold.co/400x225/388E3C/FFFFFF?text=Criaturas+Mod',
            version: '2.1.0',
            size: '12.8 MB',
            downloadLink: '#'
        },
        {
            title: 'Skin Pack: Heróis do Pixel',
            category: 'Skin',
            description: 'Pacote com 10 skins exclusivas de heróis em estilo pixel art.',
            imageUrl: 'https://placehold.co/400x225/2E7D32/FFFFFF?text=Skins+Herois',
            version: '1.0.0',
            size: '2.1 MB',
            downloadLink: '#'
        },
        {
            title: 'Arquivos de Servidor - Config Básico',
            category: 'Arquivos Gerais',
            description: 'Configurações básicas para iniciar seu próprio servidor Zera\'s Craft.',
            imageUrl: 'https://placehold.co/400x225/1A1A1A/FFFFFF?text=Server+Configs',
            version: '1.0.0',
            size: '1.5 MB',
            downloadLink: '#'
        },
        {
            title: 'Addon de Ferramentas Avançadas',
            category: 'Addon',
            description: 'Novas ferramentas e máquinas para automatizar suas construções e mineração.',
            imageUrl: 'https://placehold.co/400x225/4CAF50/FFFFFF?text=Ferramentas+Addon',
            version: '1.1.0',
            size: '7.0 MB',
            downloadLink: '#'
        },
        {
            title: 'Mod de Decoração Moderna',
            category: 'Mod',
            description: 'Adicione móveis, blocos e elementos decorativos para casas modernas.',
            imageUrl: 'https://placehold.co/400x225/388E3C/FFFFFF?text=Decoracao+Mod',
            version: '1.5.0',
            size: '8.1 MB',
            downloadLink: '#'
        },
        {
            title: 'Skin: Cavaleiro das Sombras',
            category: 'Skin',
            description: 'Uma skin sombria e imponente para os aventureiros mais corajosos.',
            imageUrl: 'https://placehold.co/400x225/2C3E50/FFFFFF?text=Skin+Cavaleiro',
            version: '1.0.0',
            size: '0.8 MB',
            downloadLink: '#'
        },
        {
            title: 'Pastas Essenciais do Jogo',
            category: 'Arquivos Gerais',
            description: 'Coleção de pastas e arquivos indispensáveis para o bom funcionamento do Minecraft.',
            imageUrl: 'https://placehold.co/400x225/1A1A1A/FFFFFF?text=Pastas+Jogo',
            version: '1.0.0',
            size: '3.2 MB',
            downloadLink: '#'
        }
    ];

    // ===============================
    // Card de Download
    // ===============================
    const generateDownloadCard = (item) => {
        const card = document.createElement('div');
        card.classList.add('card', 'download-card');
        card.dataset.category = item.category;

        card.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.title}" class="card-image responsive-image">
            <div class="card-content">
                <h3 class="card-title">${item.title}</h3>
                <p class="card-description">${item.description}</p>
                <div class="card-meta">
                    <span class="card-version">Versão: ${item.version}</span>
                    <span class="card-size">Tamanho: ${item.size}</span>
                </div>
                <button class="btn-primary card-download-btn"
                        data-title="${item.title}"
                        data-description="${item.description}"
                        data-image="${item.imageUrl}"
                        data-version="${item.version}"
                        data-size="${item.size}"
                        data-download-link="${item.downloadLink}">
                    Detalhes & Baixar
                </button>
            </div>
        `;
        return card;
    };

    // ===============================
    // Visualizar Itens de Download
    // ===============================
    const renderDownloadItems = (filter = 'all') => {
        if (!cardGrid) return;
        cardGrid.innerHTML = ''; // Limpa o grid atual

        const filteredItems = filter === 'all'
            ? downloadItems
            : downloadItems.filter(item => item.category === filter);

        if (filteredItems.length === 0) {
            cardGrid.innerHTML = '<p class="text-center">Nenhum item encontrado nesta categoria.</p>';
            return;
        }

        filteredItems.forEach(item => {
            cardGrid.appendChild(generateDownloadCard(item));
        });

        // Adiciona event listeners aos novos botões de download
        document.querySelectorAll('.card-download-btn').forEach(button => {
            button.addEventListener('click', () => {
                const modal = document.getElementById('download-modal');
                const modalImage = document.getElementById('modal-image');
                const modalTitle = document.getElementById('modal-title');
                const modalDescription = document.getElementById('modal-description');
                const modalVersion = document.getElementById('modal-version');
                const modalSize = document.getElementById('modal-size');
                const modalDownloadLink = document.getElementById('modal-download-link');

                modalImage.src = button.dataset.image;
                modalImage.alt = button.dataset.title;
                modalTitle.textContent = button.dataset.title;
                modalDescription.textContent = button.dataset.description;
                if (modalVersion) modalVersion.textContent = button.dataset.version;
                if (modalSize) modalSize.textContent = button.dataset.size;
                modalDownloadLink.href = button.dataset.downloadLink;

                modal.classList.add('active');
                playEffectSound(clickSound);
            });
        });
    };

    if (filterButtons.length > 0 && cardGrid) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const filter = button.dataset.filter;
                renderDownloadItems(filter);
                playEffectSound(clickSound);
            });
        });
        renderDownloadItems('all'); // Renderiza todos os itens na carga inicial
    }

    // ===============================
    // Modal de Detalhes & Baixar
    // ===============================
    // Modal de Download (do arquivos.html)
    const downloadModal = document.getElementById('download-modal');
    const downloadModalCloseBtn = downloadModal ? downloadModal.querySelector('.modal-close-btn') : null;

    if (downloadModalCloseBtn && downloadModal) {
        downloadModalCloseBtn.addEventListener('click', () => {
            downloadModal.classList.remove('active');
            playEffectSound(clickSound);
        });
        downloadModal.addEventListener('click', (e) => {
            if (e.target === downloadModal) {
                downloadModal.classList.remove('active');
            }
        });
    }

    // ===============================
    // Sistema de Busca
    // ===============================
    // Search Input for Downloads/Arquivos
    const searchInput = document.getElementById('search-input'); // Para arquivos.html
    const downloadSearchInput = document.getElementById('download-search-input'); // Para downloads.html

    const filterCardsBySearch = (searchTerm) => {
        const currentFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
        const filteredByCat = currentFilter === 'all'
            ? downloadItems
            : downloadItems.filter(item => item.category === currentFilter);

        const finalFilteredItems = filteredByCat.filter(item =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (cardGrid) {
            cardGrid.innerHTML = '';
            if (finalFilteredItems.length === 0) {
                cardGrid.innerHTML = '<p class="text-center">Nenhum item encontrado com este termo de pesquisa.</p>';
            } else {
                finalFilteredItems.forEach(item => {
                    cardGrid.appendChild(generateDownloadCard(item));
                });
            }
            // Re-bind click handlers for dynamically added cards
            document.querySelectorAll('.card-download-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const modal = document.getElementById('download-modal');
                    const modalImage = document.getElementById('modal-image');
                    const modalTitle = document.getElementById('modal-title');
                    const modalDescription = document.getElementById('modal-description');
                    const modalVersion = document.getElementById('modal-version');
                    const modalSize = document.getElementById('modal-size');
                    const modalDownloadLink = document.getElementById('modal-download-link');

                    modalImage.src = button.dataset.image;
                    modalImage.alt = button.dataset.title;
                    modalTitle.textContent = button.dataset.title;
                    modalDescription.textContent = button.dataset.description;
                    if (modalVersion) modalVersion.textContent = button.dataset.version;
                    if (modalSize) modalSize.textContent = button.dataset.size;
                    modalDownloadLink.href = button.dataset.downloadLink;

                    modal.classList.add('active');
                    playEffectSound(clickSound);
                });
            });
        }
    };

    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            filterCardsBySearch(event.target.value);
        });
    }
    if (downloadSearchInput) {
        downloadSearchInput.addEventListener('input', (event) => {
            filterCardsBySearch(event.target.value);
        });
    }


    // ===================================================================
    // 7. Botão Voltar ao Topo
    // ===================================================================

    // Botão Voltar ao Topo
    const scrollTopButton = document.getElementById('scrollTopButton');
    if (scrollTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 200) {
                scrollTopButton.classList.add('show');
            } else {
                scrollTopButton.classList.remove('show');
            }
        });

        scrollTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            playEffectSound(clickSound);
        });
    }

    // ===================================================================
    // 8. Atualizar ano no Rodapé
    // ===================================================================
    // Atualização do Ano no Rodapé
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});