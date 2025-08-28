document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM totalmente carregado e pronto!");

    // =====================================
    // Variáveis Globais de Áudio e Elementos
    // =====================================
    let hoverSound;
    let clickSound;
    const backgroundAudio = document.getElementById('backgroundAudio');
    const audioEffects = {};

    const audioControlButton = document.getElementById('audioControlButton');
    const audioPrevButton = document.getElementById('audioPrevButton');
    const audioNextButton = document.getElementById('audioNextButton');
    const musicTitleDisplay = document.getElementById('musicTitleDisplay');
    const audioProgressBar = document.getElementById('audioProgressBar');
    const currentTimeDisplay = document.getElementById('currentTimeDisplay');
    const durationDisplay = document.getElementById('durationDisplay');
    const playbackSpeedSelect = document.getElementById('playbackSpeed');

    let preparingNextMusic = false;
    let userInteractedWithAudio = localStorage.getItem('userInteractedWithAudio') === 'true'; // Inicializa do localStorage

    const musicPlaylist = [
        { title: '✨ Aerie (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Aerie.mp3' },
        { title: '✨ Comforting Memories (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Comforting.mp3' },
        { title: '✨ Creator (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Creator.mp3' },
        { title: '✨ Infinite Amethyst (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Infinity.mp3' },
        { title: '✨ Left to Bloom (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Left.mp3' },
        { title: '✨ Otherside (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Otherside.mp3' },
        { title: '⛏️ Aria Math Lofi', src: 'assets/audios/musics/Aria-Math-Lofi.mp3' },
        { title: '⛏️ Aria Math', src: 'assets/audios/musics/Aria-Math.mp3' },
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
    ];
    let currentMusicIndex = -1;

    // =====================================
    // Funções Auxiliares de Áudio
    // =====================================
    const initializeAudioEffect = (name, path, volume = 0.5) => {
        const audio = new Audio(path);
        audio.preload = 'auto';
        audio.volume = volume;
        audioEffects[name] = audio;
        return audio;
    };
    hoverSound = initializeAudioEffect('select', 'assets/audios/effects/select.mp3', 0.3);
    clickSound = initializeAudioEffect('click', 'assets/audios/effects/click.mp3', 0.7);

    const playEffectSoundInternal = (audioElement) => {
        if (audioElement) {
            const clonedAudio = audioElement.cloneNode();
            clonedAudio.volume = audioElement.volume;
            clonedAudio.play().catch(e => console.warn("Erro ao tentar tocar som de efeito:", e.message));
        }
    };
    const playEffectSound = (audioElement) => {
        setTimeout(() => {
            playEffectSoundInternal(audioElement);
        }, 10);
    };

    function showCentralMessage(message) {
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
    }

    // Função para formatar o tempo (0:00)
    function formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) return "0:00";
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // =====================================
    // Lógica de Controle da Música de Fundo
    // =====================================

    const updateAudioButtonTitle = () => {
        const iconElement = audioControlButton ? audioControlButton.querySelector('i') : null;

        if (musicTitleDisplay && iconElement) {
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
            // Se só tiver uma música, toca ela
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
            showCentralMessage('Autoplay bloqueado. Clique para tocar.');
            updateAudioButtonTitle();
            saveAudioState();
        });
    };

    const loadNewMusic = (playAfterLoad = false, specificIndex = -1) => {
        if (musicPlaylist.length === 0) {
            console.warn("Playlist vazia, não é possível carregar música.");
            preparingNextMusic = false;
            updateAudioButtonTitle();
            return;
        }
        if (preparingNextMusic) {
            console.log("Já está preparando a próxima música, abortando nova carga.");
            return;
        }

        preparingNextMusic = true;
        
        // Define o próximo índice. Se specificIndex for -1, pega um aleatório.
        // Se for o botão 'anterior', o specificIndex já vem correto.
        // Se for o botão 'próximo' ou 'ended', usa o next logic normal.
        if (specificIndex !== -1) {
             currentMusicIndex = specificIndex;
        } else {
            // Se não é um índice específico, pega o próximo ou aleatório
            if (currentMusicIndex === -1) { // Primeira vez que vai tocar
                currentMusicIndex = getRandomMusicIndex();
            } else { // Pega a próxima na sequência ou aleatório se já estava tocando
                currentMusicIndex = (currentMusicIndex + 1) % musicPlaylist.length;
            }
        }
        
        const music = musicPlaylist[currentMusicIndex];
        if (!music) {
            console.warn("Não foi possível obter um índice de música válido. Playlist vazia ou erro.");
            preparingNextMusic = false;
            return;
        }

        backgroundAudio.src = music.src;
        backgroundAudio.load();
        backgroundAudio.oncanplaythrough = () => {
            preparingNextMusic = false;
            if (playAfterLoad) {
                playMusic();
            } else {
                updateAudioButtonTitle();
            }
            updateProgressAndTimers();
            // Garante que 0:00 / 0:00 ou duração real apareça
            backgroundAudio.oncanplaythrough = null;
            // Limpa para evitar execuções múltiplas
            saveAudioState();
        };
        backgroundAudio.onerror = (e) => {
            console.error(`Erro ao carregar áudio: ${music.src}`, e);
            showCentralMessage('Erro ao carregar música. Pulando...');
            preparingNextMusic = false;
            backgroundAudio.onerror = null;
            // Tenta carregar a próxima música para evitar um loop de erro com a mesma música
            setTimeout(() => loadNewMusic(playAfterLoad), 500);
        };
    };

    // FUNÇÃO ATUALIZADA: progress bar e tempo
    const updateProgressAndTimers = () => {
        if (!audioProgressBar || !currentTimeDisplay || !durationDisplay) return;
        if (backgroundAudio.duration > 0 && !isNaN(backgroundAudio.duration) && isFinite(backgroundAudio.duration)) {
            const progress = (backgroundAudio.currentTime / backgroundAudio.duration);
            audioProgressBar.value = progress * 100;
            currentTimeDisplay.textContent = formatTime(backgroundAudio.currentTime);
            durationDisplay.textContent = formatTime(backgroundAudio.duration);
        } else {
            // Garante que mostre 0:00 / 0:00 antes da metadata ser carregada
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
                userInteracted: userInteractedWithAudio
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
            if (playbackSpeedSelect) {
                playbackSpeedSelect.value = backgroundAudio.playbackRate;
            }

            if (currentMusicIndex !== -1 && musicPlaylist[currentMusicIndex]) {
                backgroundAudio.src = musicPlaylist[currentMusicIndex].src;
                backgroundAudio.load();

                // Lógica para quando o áudio restaurado está pronto
                backgroundAudio.onloadedmetadata = () => {
                    if (backgroundAudio.duration > 0 && audioState.currentTime < backgroundAudio.duration) {
                        backgroundAudio.currentTime = audioState.currentTime;
                    }
                    updateProgressAndTimers();
                    // Atualiza a barra de progresso e timers
                    if (!audioState.paused && userInteractedWithAudio) {
                        playMusic();
                    } else {
                        updateAudioButtonTitle();
                    }
                    backgroundAudio.onloadedmetadata = null;
                    // Limpa para evitar execuções múltiplas
                    saveAudioState();
                };
                backgroundAudio.onerror = (e) => {
                    console.error("Erro ao carregar música restaurada:", e);
                    showCentralMessage('Erro ao restaurar música. Pulando...');
                    loadNewMusic(true);
                };
            } else {
                loadNewMusic(false);
            }
        } else {
            loadNewMusic(false);
        }
    };
    // =====================================
    // Listener para Interação com a Página
    // =====================================
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            saveAudioState();
        } else {
            if (!backgroundAudio.paused && userInteractedWithAudio) {
                console.log("Aba ativa novamente, tentando tocar a música...");
                // Apenas toca se a música não estava pausada e o usuário interagiu antes
                playMusic();
            } else {
                updateAudioButtonTitle();
            }
        }
    });
    // =====================================
    // 1. Menu Hambúrguer (Otimizado para mais páginas)
    // =====================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.main-nav');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            playEffectSound(clickSound);
            document.body.classList.toggle('no-scroll', navMenu.classList.contains('active'));
        });
        document.querySelectorAll('.main-nav a').forEach(item => {
            item.addEventListener('click', (event) => {
                // Manipula a navegação suave para IDs de seção
                const href = item.getAttribute('href');
                if (href && href.startsWith('#')) {
                    event.preventDefault(); // Previne o comportamento padrão do link
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }

                setTimeout(() => {
                    navMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }, 300);
                playEffectSound(clickSound);
            });
        });
    }

    // =====================================
    // 2. Funcionalidade de Copiar Texto
    // =====================================
    const copyButtons = document.querySelectorAll('.copy-button');
    if (copyButtons.length > 0) {
        copyButtons.forEach(button => {
            button.addEventListener('click', async () => {
                let textToCopy = '';
                let targetElementSelector = button.dataset.copyTarget;
                let originalButtonText = button.textContent;

                if (targetElementSelector) {
                    const parentContext = button.closest('.access-info') || document;
                    const selectors = targetElementSelector.split(',').map(s => s.trim());
                    let partsToCopy = [];
                    for (const selector of selectors) {
                        const targetElement = parentContext.querySelector(selector);
                        if (targetElement) {
                            partsToCopy.push(targetElement.textContent.trim());
                        }
                    }
                    if (selectors.includes('#serverIp') && selectors.includes('#serverPort') && partsToCopy.length === 2) {
                        textToCopy = `${partsToCopy[0]}:${partsToCopy[1]}`;
                    } else {
                        textToCopy = partsToCopy.join('');
                    }
                } else if (button.dataset.copyText) {
                    textToCopy = button.dataset.copyText;
                }

                if (textToCopy) {
                    try {
                        const textArea = document.createElement("textarea");
                        textArea.value = textToCopy;
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);

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
            });
        });
    }

    // =====================================
    // 3. Sistema de Áudio de Fundo (Event Listeners Principais)
    // =====================================
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

    // =====================================
    // 4. Sistema de Sons para Interações
    // =====================================
    document.querySelectorAll(
        '.btn-primary, .menu-item a, .music-button, .card, .card-download-btn, .copy-button, .btn-ripple, .btn-hover-fill, .btn-border-anim, .btn-gradient-anim'
    ).forEach(element => {
        element.addEventListener('mouseenter', () => playEffectSound(hoverSound));
    });
    document.querySelectorAll(
        'a:not([href^="#"]), .btn-primary, .music-button, .card, .card-download-btn, .copy-button, .btn-ripple, .btn-hover-fill, .btn-border-anim, .btn-gradient-anim'
    ).forEach(element => {
        element.addEventListener('click', (event) => {
            playEffectSound(clickSound);
            // Previne a navegação imediata para reproduzir o som primeiro
            if (element.tagName === 'A' && element.getAttribute('href') && element.getAttribute('href').charAt(0) !== '#') {
                event.preventDefault();
                setTimeout(() => {
                    window.location.href = element.href;
                }, 200); // Pequeno atraso para o som tocar
            }
        });
    });
    // =====================================
    // 5. Animações de Rolagem com ScrollReveal
    // =====================================
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

    // =====================================
    // 6. Contador Animado (CountUp.js)
    // =====================================
    const countUpElements = document.querySelectorAll('.counter');
    if (countUpElements.length > 0 && typeof CountUp !== 'undefined') {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetElement = entry.target;
                    const endVal = parseFloat(targetElement.getAttribute('data-target'));
                    const instance = new CountUp(targetElement, endVal, {
                        duration: 2.5,
                        separator: '.' // Ajuste para formato brasileiro
                    });
                    if (!instance.error) {
                        instance.start();
                    } else {
                        console.error(instance.error);
                    }
                    observer.unobserve(targetElement); // Anima uma vez
                }
            });
        }, {
            threshold: 0.8 // Quando 80% do elemento estiver visível
        });

        countUpElements.forEach(element => {
            observer.observe(element);
        });
    }

    // =====================================
    // 7. Galeria de Imagens (Lightbox)
    // =====================================
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const lightbox = document.getElementById('myLightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const closeBtn = document.querySelector('.lightbox-close');
    if (galleryItems.length > 0 && lightbox && lightboxImage && closeBtn) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                lightbox.classList.add('active');
                lightboxImage.src = item.src;
                playEffectSound(clickSound);
            });
        });

        closeBtn.addEventListener('click', () => {
            lightbox.classList.remove('active');
            playEffectSound(clickSound);
        });
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) { // Fecha apenas se clicar no overlay
                lightbox.classList.remove('active');
                playEffectSound(clickSound);
            }
        });
    } else {
        console.warn("Elementos do Lightbox não encontrados. Verifique a estrutura HTML.");
    }

    // =====================================
    // 8. Tabs de Conteúdo
    // =====================================
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                button.classList.add('active');
                const targetId = button.dataset.tabTarget;
                const targetContent = document.querySelector(targetId);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
                playEffectSound(clickSound);
            });
        });
    }

    // =====================================
    // 9. Flip Cards (Exemplo: Team Members)
    // =====================================
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
            playEffectSound(clickSound);
        });
    });
    // =====================================
    // 10. Accordion (Acordeão) - CORRIGIDO
    // =====================================
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.closest('.accordion-item');
            const isActive = accordionItem.classList.contains('active');

            // Fecha todos os outros itens do acordeão
            document.querySelectorAll('.accordion-item.active').forEach(item => {
                if (item !== accordionItem) {
                    item.classList.remove('active');
                }
            });

            // Alterna o estado do item clicado
            accordionItem.classList.toggle('active');
            
            playEffectSound(clickSound);
        });
    });

    // =====================================
    // 11. Modal (Popup) - Exemplo
    // =====================================
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const myModal = document.getElementById('myModal');

    if (openModalBtn && myModal && closeModalBtn) {
        openModalBtn.addEventListener('click', () => {
            myModal.classList.add('active');
            playEffectSound(clickSound);
        });
        closeModalBtn.addEventListener('click', () => {
            myModal.classList.remove('active');
            playEffectSound(clickSound);
        });
        myModal.addEventListener('click', (e) => {
            if (e.target === myModal) { // Fecha apenas se clicar no overlay
                myModal.classList.remove('active');
                playEffectSound(clickSound);
            }
        });
    } else {
        console.warn("Elementos do Modal não encontrados. Verifique a estrutura HTML.");
    }

    // =====================================
    // 12. Spoiler Block
    // =====================================
    const spoilerToggles = document.querySelectorAll('.spoiler-toggle');
    spoilerToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const spoilerBlock = toggle.closest('.spoiler-block');
            spoilerBlock.classList.toggle('revealed');
            playEffectSound(clickSound);
        });
    });
    // =====================================
    // 13. Ripple Button Effect
    // =====================================
    document.querySelectorAll('.btn-ripple').forEach(button => {
        button.addEventListener('click', function(e) {
            const circle = document.createElement('span');
            const diameter = Math.max(this.clientWidth, this.clientHeight);
            const radius = diameter / 2;

            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${e.clientX - (this.getBoundingClientRect().left + radius)}px`;
            circle.style.top = `${e.clientY - (this.getBoundingClientRect().top + radius)}px`;
            circle.classList.add('ripple');

            const ripple = this.getElementsByClassName('ripple')[0];
            if (ripple) {
                ripple.remove();
            }

            this.appendChild(circle);
        });
    });
    // =====================================
    // 14. Image Carousel
    // =====================================
    const carouselContainers = document.querySelectorAll('.image-carousel-container');
    carouselContainers.forEach(container => {
        const track = container.querySelector('.image-carousel-track');
        const images = Array.from(track.children);
        const prevButton = container.querySelector('.carousel-prev');
        const nextButton = container.querySelector('.carousel-next');
        const dotsContainer = container.querySelector('.carousel-dots');

        if (!track || images.length === 0 || !prevButton || !nextButton || !dotsContainer) {
            console.warn("Elemento(s) do carrossel não encontrado(s). Verifique a estrutura HTML.");
            return;
        }

        let slideIndex = 0;
        let slideWidth = images[0].clientWidth; // Largura inicial da primeira imagem

        // Criar dots
        dotsContainer.innerHTML = ''; // Limpa dots existentes para recriação
        images.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                moveToSlide(index);
                playEffectSound(clickSound);
            });
            dotsContainer.appendChild(dot);
        });

        const dots = Array.from(dotsContainer.children);

        const updateDots = () => {
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[slideIndex]) {
                dots[slideIndex].classList.add('active');
            }
        };

        const moveToSlide = (index) => {
            if (index < 0) {
                slideIndex = images.length - 1;
            } else if (index >= images.length) {
                slideIndex = 0;
            } else {
                slideIndex = index;
            }
            track.style.transform = `translateX(-${slideIndex * slideWidth}px)`;
            updateDots();
        };
        prevButton.addEventListener('click', () => {
            moveToSlide(slideIndex - 1);
            playEffectSound(clickSound);
        });
        nextButton.addEventListener('click', () => {
            moveToSlide(slideIndex + 1);
            playEffectSound(clickSound);
        });
        // Atualizar largura do slide em redimensionamento (importante para responsividade)
        const updateSlideWidth = () => {
            if (images.length > 0) {
                slideWidth = container.clientWidth;
                images.forEach(img => {
                    img.style.width = `${slideWidth}px`;
                });
                moveToSlide(slideIndex); // Reposiciona o carrossel
            }
        };
        window.addEventListener('resize', updateSlideWidth);
        updateSlideWidth(); // Chamada inicial para garantir que as imagens tenham o tamanho correto
    });
    // =====================================
    // 15. Review Slider
    // =====================================
    const reviewSliderContainers = document.querySelectorAll('.review-slider-container');
    reviewSliderContainers.forEach(container => {
        const track = container.querySelector('.review-slider-track');
        const reviewCards = Array.from(track.children);
        const prevButton = container.querySelector('.review-prev-btn');
        const nextButton = container.querySelector('.review-next-btn');

        if (!track || reviewCards.length === 0 || !prevButton || !nextButton) {
            console.warn("Elemento(s) do slider de reviews não encontrado(s). Verifique a estrutura HTML.");
            return;
        }

        let slideIndex = 0;
        let cardsPerView = 3; // Padrão para desktop
        let cardTotalWidth = 0; // Largura de um card + suas margens

        const updateCardsPerView = () => {
            if (window.innerWidth <= 768) {
                cardsPerView = 1;
            } else if (window.innerWidth <= 1024) {
                cardsPerView = 2;
            } else {
                cardsPerView = 3;
            }
            if (reviewCards.length > 0) {
                const cardStyle = getComputedStyle(reviewCards[0]);
                const marginRight = parseFloat(cardStyle.marginRight);
                const marginLeft = parseFloat(cardStyle.marginLeft);
                cardTotalWidth = reviewCards[0].offsetWidth + marginRight + marginLeft;
            }
        };
        const moveToSlide = (index) => {
            updateCardsPerView();
            // Recalcula antes de mover
            let newIndex = index;
            if (newIndex < 0) {
                newIndex = reviewCards.length - cardsPerView;
            } else if (newIndex > reviewCards.length - cardsPerView) {
                newIndex = 0;
            }
            slideIndex = newIndex;
            track.style.transform = `translateX(-${slideIndex * cardTotalWidth}px)`;
        };

        prevButton.addEventListener('click', () => {
            moveToSlide(slideIndex - cardsPerView);
            playEffectSound(clickSound);
        });
        nextButton.addEventListener('click', () => {
            moveToSlide(slideIndex + cardsPerView);
            playEffectSound(clickSound);
        });
        window.addEventListener('resize', () => {
            updateCardsPerView();
            moveToSlide(slideIndex); // Reposiciona o slider
        });
        updateCardsPerView(); // Chamada inicial
        moveToSlide(0);
        // Inicia na primeira "página"
    });

    // =====================================
    // 16. Progress Bar Animation (Status Bars)
    // =====================================
    const progressBarFills = document.querySelectorAll('.progress-bar-fill');
    const animateProgressBar = (progressBar) => {
        const progress = progressBar.dataset.progress;
        let currentWidth = 0;
        const interval = setInterval(() => {
            if (currentWidth >= progress) {
                clearInterval(interval);
            } else {
                currentWidth++;
                progressBar.style.width = `${currentWidth}%`;
                // Atualiza a porcentagem no elemento irmão
                const percentageSpan = progressBar.closest('.status-bar-item').querySelector('.status-percentage');
                if (percentageSpan) {
                    percentageSpan.textContent = `${currentWidth}%`;
                }
            }
        }, 20); // Velocidade da animação
    };
    const progressBarObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                animateProgressBar(entry.target);
                entry.target.dataset.animated = 'true'; // Marca como animado
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.7 // Quando 70% da barra estiver visível
    });
    progressBarFills.forEach(bar => {
        progressBarObserver.observe(bar);
    });
    // =====================================
    // 17. Glitch Text (header logo)
    // =====================================
    const glitchTextElements = document.querySelectorAll('.glitch-text');
    glitchTextElements.forEach(element => {
        element.setAttribute('data-text', element.textContent);
    });
    // =====================================
    // 18. Animated Underline Title
    // =====================================
    // Este é puramente CSS, sem JS necessário.
    // =====================================
    // 19. Curtain Title (Seção de Título com Cortina)
    // =====================================
    const curtainTitleWrappers = document.querySelectorAll('.curtain-title-wrapper');
    const curtainObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.8 });
    // Quando 80% do elemento estiver visível

    curtainTitleWrappers.forEach(wrapper => {
        curtainObserver.observe(wrapper);
    });
    // =====================================
    // 20. Hover Text Reveal (com imagem)
    // =====================================
    // Este é puramente CSS, sem JS necessário.
    // =====================================
    // 21. Console Box
    // =====================================
    // Este é puramente CSS, sem JS necessário.
    // =====================================
    // 22. Custom Radio Buttons
    // =====================================
    // Este é puramente CSS, sem JS necessário.
    // =====================================
    // 23. Animated Quote
    // =====================================
    // Este é puramente CSS, sem JS necessário.
    // =====================================
    // 24. Animated List (usando IntersectionObserver para animar ao rolar)
    // =====================================
    const animatedLists = document.querySelectorAll('.animated-list');
    const listObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                Array.from(entry.target.children).forEach((li, index) => {
                    setTimeout(() => {
                        li.classList.add('animated');
                    }, index * 100); // Atraso sequencial
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    animatedLists.forEach(list => {
        listObserver.observe(list);
    });
    // =====================================
    // 25. Modern Contact Form (validação básica HTML5)
    // =====================================
    const modernContactForm = document.querySelector('.modern-contact-form');
    if (modernContactForm) {
        modernContactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            playEffectSound(clickSound);
            showCentralMessage('Mensagem enviada com sucesso! (Funcionalidade real exige backend)');
            modernContactForm.reset(); // Limpa o formulário após o "envio"
        });
    }

    // =====================================
    // 26. Read More / Read Less
    // =====================================
    const readMoreContainers = document.querySelectorAll('.read-more-container');
    readMoreContainers.forEach(container => {
        const toggleButton = container.querySelector('.read-more-toggle');
        const hiddenText = container.querySelector('.read-more-text.hidden'); // Pega apenas o parágrafo escondido

        if (toggleButton && hiddenText) {
            // Inicializa: se o texto extra estiver oculto, o botão deve ser "Leia Mais"
            if (hiddenText.classList.contains('hidden')) {
                toggleButton.textContent = 'Leia Mais';
            } else {
                toggleButton.textContent = 'Leia Menos';
            }

            toggleButton.addEventListener('click', () => {
                hiddenText.classList.toggle('hidden');
                if (hiddenText.classList.contains('hidden')) {
                    toggleButton.textContent = 'Leia Mais';
                } else {
                    toggleButton.textContent = 'Leia Menos';
                }
                playEffectSound(clickSound);
            });
        }
    });
    // =====================================
    // 99. Usabilidade e Ajustes Finais
    // =====================================

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

    // Atualização do Ano no Rodapé
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Scroll Progress Bar
    const scrollProgress = document.querySelector('.scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            scrollProgress.style.width = `${progress}%`;
        });
    }
});