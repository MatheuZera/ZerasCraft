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
    const desktopNav = document.querySelector('.desktop-nav'); // Adicionado para a navegação desktop
    const mobileNav = document.querySelector('.mobile-nav');   // Adicionado para a navegação mobile

    // Função para copiar links do desktop para o mobile
    const populateMobileNav = () => {
        if (desktopNav && mobileNav) {
            mobileNav.innerHTML = desktopNav.innerHTML; // Copia os itens de navegação
        }
    };
    populateMobileNav(); // Popula o menu mobile na carga inicial

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

                // Fecha o menu mobile após a seleção
                if (navMenu.classList.contains('active')) {
                    setTimeout(() => {
                        navMenu.classList.remove('active');
                        menuToggle.classList.remove('active');
                        document.body.classList.remove('no-scroll');
                    }, 300);
                }
                playEffectSound(clickSound);
            });
        });
    }

    // =====================================
    // 2. Funcionalidade de Copiar Texto
    // =====================================
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
    // 4. Sistema de Sons para Interações (Aprimorado)
    // =====================================
    // Adiciona som de hover em elementos interativos
    document.querySelectorAll(
        '.btn-primary, .menu-toggle, .music-button, .card, .card-download-btn, .copy-button, .accordion-header, .tab-button, .tooltip-trigger, .tooltip-trigger-icon, .custom-radio-btn, .close-alert, #showSpinnerBtn, #toggleSkeletonBtn, #floatingActionButton, .custom-range-slider, .rating-stars i, .spoiler-toggle, #acceptCookiesBtn, #declineCookiesBtn, #prevStepBtn, #nextStepBtn'
    ).forEach(element => {
        element.addEventListener('mouseenter', () => playEffectSound(hoverSound));
    });

    // Adiciona som de clique em elementos interativos
    document.querySelectorAll(
        'a:not([href^="#"]), .btn-primary, .menu-toggle, .music-button, .card, .card-download-btn, .copy-button, .accordion-header, .tab-button, #openModalBtn, #closeModalBtn, .lightbox-close, .open-lightbox-btn, .carousel-btn, #showSpinnerBtn, #toggleSkeletonBtn, #darkModeToggle, #notificationsToggle, #floatingActionButton, .rating-stars i, .spoiler-toggle, #playPauseVideoBtn, #fullScreenVideoBtn, #acceptCookiesBtn, #declineCookiesBtn, #prevStepBtn, #nextStepBtn'
    ).forEach(element => {
        element.addEventListener('click', (event) => {
            playEffectSound(clickSound);
            // Para links externos, introduz um pequeno atraso para o som tocar antes de navegar
            if (element.tagName === 'A' && element.getAttribute('href') && !element.getAttribute('href').startsWith('#') && !element.getAttribute('href').startsWith('javascript:')) {
                event.preventDefault();
                setTimeout(() => {
                    window.location.href = element.href;
                }, 200); // Atraso de 200ms
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
    // 6. Componentes Interativos Específicos
    // =====================================

    // Contador Animado (CountUp.js)
    const counterElements = document.querySelectorAll('.counter');
    if (typeof CountUp !== 'undefined' && counterElements.length > 0) {
        const options = {
            duration: 2.5,
            separator: '.',
            startVal: 0,
        };
        const observers = [];

        counterElements.forEach(el => {
            const endValue = parseInt(el.dataset.target); // Alterado para data-target
            const countUp = new CountUp(el, endValue, options);

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (!el.classList.contains('counted')) {
                            countUp.start();
                            el.classList.add('counted');
                        }
                    } else {
                        // Opcional: reiniciar o contador ao sair da tela
                        // el.classList.remove('counted');
                        // el.textContent = '0';
                    }
                });
            }, {
                threshold: 0.5
            });
            observers.push(observer);
            observer.observe(el);
        });
    }

    // Acordeão
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = header.nextElementSibling;

            if (item.classList.contains('active')) {
                item.classList.remove('active');
                header.classList.remove('active');
                content.classList.remove('open');
                content.style.maxHeight = null; // Reseta max-height
            } else {
                // Fecha outros itens antes de abrir o atual (comportamento de acordeão)
                accordionHeaders.forEach(otherHeader => {
                    const otherItem = otherHeader.parentElement;
                    const otherContent = otherHeader.nextElementSibling;
                    otherItem.classList.remove('active');
                    otherHeader.classList.remove('active');
                    otherContent.classList.remove('open');
                    otherContent.style.maxHeight = null;
                });

                item.classList.add('active');
                header.classList.add('active');
                content.classList.add('open');
                content.style.maxHeight = content.scrollHeight + "px"; // Ajusta max-height para a altura do conteúdo
            }
            playEffectSound(clickSound);
        });
    });

    // Abas (não presente no HTML atual, mas mantido para referência futura)
    const tabButtons = document.querySelectorAll('.tab-button');
    if (tabButtons.length > 0) {
        // Ativar a primeira aba por padrão, se houver
        const firstTabButton = tabButtons[0];
        const firstTabPane = document.getElementById(firstTabButton.dataset.tabId);
        if (firstTabButton) firstTabButton.classList.add('active');
        if (firstTabPane) firstTabPane.classList.add('active');


        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetId = button.dataset.tabId;

                tabButtons.forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));

                button.classList.add('active');
                document.getElementById(targetId).classList.add('active');

                playEffectSound(clickSound);
            });
        });
    }


    // Modal (Aberto via botão no HTML)
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn'); // Atualizado para o ID no HTML
    const modalOverlay = document.getElementById('myModal'); // Atualizado para o ID no HTML

    if (openModalBtn && modalOverlay) {
        openModalBtn.addEventListener('click', () => {
            modalOverlay.classList.add('active');
            playEffectSound(clickSound);
        });
    }

    if (closeModalBtn && modalOverlay) {
        closeModalBtn.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
            playEffectSound(clickSound);
        });
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
            }
        });
    }

    // Lightbox para Galeria de Imagens
    const openLightboxBtns = document.querySelectorAll('.open-lightbox-btn');
    const closeLightboxBtn = document.querySelector('.lightbox-close');
    const lightboxOverlay = document.getElementById('myLightbox');
    const lightboxImage = document.getElementById('lightbox-image');

    openLightboxBtns.forEach(button => {
        button.addEventListener('click', () => {
            const imageUrl = button.dataset.imageUrl;
            const imageAlt = button.dataset.imageAlt;
            lightboxImage.src = imageUrl;
            lightboxImage.alt = imageAlt;
            lightboxOverlay.classList.add('show'); // Usa 'show' conforme o CSS
            playEffectSound(clickSound);
        });
    });

    if (closeLightboxBtn && lightboxOverlay) {
        closeLightboxBtn.addEventListener('click', () => {
            lightboxOverlay.classList.remove('show');
            playEffectSound(clickSound);
        });
        lightboxOverlay.addEventListener('click', (e) => {
            if (e.target === lightboxOverlay) {
                lightboxOverlay.classList.remove('show');
            }
        });
    }


    // Carrossel de Imagens
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        const carouselTrack = document.getElementById('imageCarouselTrack'); // ID do HTML
        const carouselSlides = Array.from(carouselTrack.children);
        const carouselNextBtn = document.getElementById('carouselNextBtn'); // ID do HTML
        const carouselPrevBtn = document.getElementById('carouselPrevBtn'); // ID do HTML
        const carouselDotsContainer = document.getElementById('carouselDots'); // ID do HTML

        let currentSlideIndex = 0;
        let slideInterval; // Para o autoplay

        // Cria os pontos de navegação
        carouselSlides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                moveToSlide(index);
                resetAutoplay();
            });
            carouselDotsContainer.appendChild(dot);
        });
        const carouselDots = Array.from(carouselDotsContainer.children);

        const updateSlidePosition = () => {
            if (carouselSlides.length === 0) return;
            const slideWidth = carouselSlides[0].getBoundingClientRect().width;
            carouselTrack.style.transform = `translateX(-${slideWidth * currentSlideIndex}px)`;
        };

        const updateDots = () => {
            carouselDots.forEach((dot, index) => {
                if (index === currentSlideIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        };

        const moveToSlide = (targetIndex) => {
            currentSlideIndex = targetIndex;
            updateSlidePosition();
            updateDots();
            playEffectSound(clickSound);
        };

        carouselNextBtn.addEventListener('click', () => {
            const nextIndex = (currentSlideIndex + 1) % carouselSlides.length;
            moveToSlide(nextIndex);
            resetAutoplay();
        });

        carouselPrevBtn.addEventListener('click', () => {
            const prevIndex = (currentSlideIndex - 1 + carouselSlides.length) % carouselSlides.length;
            moveToSlide(prevIndex);
            resetAutoplay();
        });

        // Autoplay
        const startAutoplay = () => {
            slideInterval = setInterval(() => {
                const nextIndex = (currentSlideIndex + 1) % carouselSlides.length;
                moveToSlide(nextIndex);
            }, 5000); // Muda a cada 5 segundos
        };

        const resetAutoplay = () => {
            clearInterval(slideInterval);
            startAutoplay();
        };

        // Redimensionamento
        window.addEventListener('resize', () => {
            updateSlidePosition();
        });

        startAutoplay(); // Inicia o autoplay ao carregar a página
    }

    // Image Compare Slider
    const imageCompareSlider = document.getElementById('imageCompareSlider');
    const imageAfter = document.querySelector('.image-compare-img-wrapper .image-after');
    const imageCompareHandle = document.getElementById('imageCompareHandle');

    if (imageCompareSlider && imageAfter && imageCompareHandle) {
        const updateSlider = () => {
            const sliderValue = imageCompareSlider.value;
            imageAfter.style.width = `${sliderValue}%`;
            imageCompareHandle.style.left = `${sliderValue}%`;
        };

        imageCompareSlider.addEventListener('input', updateSlider);
        updateSlider(); // Define a posição inicial
    }

    // Toggle Spinner
    const loadingSpinner = document.getElementById('loadingSpinner');
    const showSpinnerBtn = document.getElementById('showSpinnerBtn');

    if (loadingSpinner && showSpinnerBtn) {
        showSpinnerBtn.addEventListener('click', () => {
            loadingSpinner.classList.toggle('hidden');
            playEffectSound(clickSound);
        });
    }

    // Toggle Switches
    const darkModeToggle = document.getElementById('darkModeToggle');
    const notificationsToggle = document.getElementById('notificationsToggle');

    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', () => {
            console.log('Modo Escuro:', darkModeToggle.checked);
            playEffectSound(clickSound);
            // Implementar lógica de tema escuro aqui
        });
    }
    if (notificationsToggle) {
        notificationsToggle.addEventListener('change', () => {
            console.log('Notificações:', notificationsToggle.checked);
            playEffectSound(clickSound);
            // Implementar lógica de notificações aqui
        });
    }

    // Progress Circles
    const progressCircles = document.querySelectorAll('.progress-circle');
    progressCircles.forEach(circle => {
        const progress = parseInt(circle.dataset.progress);
        const circleBar = circle.querySelector('.progress-bar-circle');
        const radius = circleBar.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (progress / 100) * circumference;

        circleBar.style.strokeDasharray = circumference;
        circleBar.style.strokeDashoffset = circumference; // Começa escondido

        // Animação ao entrar na viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    circleBar.style.strokeDashoffset = offset;
                    observer.unobserve(entry.target); // Para de observar após a animação
                }
            });
        }, { threshold: 0.75 }); // Trigger quando 75% visível
        observer.observe(circle);
    });

    // Skeleton Loader
    const toggleSkeletonBtn = document.getElementById('toggleSkeletonBtn');
    const skeletonContainer = document.getElementById('skeletonContent');
    const actualContent = document.getElementById('actualContent');

    if (toggleSkeletonBtn && skeletonContainer && actualContent) {
        toggleSkeletonBtn.addEventListener('click', () => {
            if (skeletonContainer.classList.contains('loaded')) {
                // Se o conteúdo real está visível, volta para o esqueleto
                skeletonContainer.classList.remove('loaded');
                actualContent.classList.add('hidden');
                showCentralMessage('Carregando conteúdo...');
            } else {
                // Simula um carregamento de 2 segundos antes de mostrar o conteúdo real
                showCentralMessage('Carregando...');
                setTimeout(() => {
                    skeletonContainer.classList.add('loaded');
                    actualContent.classList.remove('hidden');
                    showCentralMessage('Conteúdo carregado!');
                }, 2000);
            }
            playEffectSound(clickSound);
        });
    }

    // Review Slider (Testemunhos)
    const reviewSliderContainer = document.querySelector('.review-slider-container');
    if (reviewSliderContainer) {
        const reviewSliderTrack = document.querySelector('.review-slider-track'); // Seleciona o track
        const reviewSlides = Array.from(reviewSliderTrack.children);
        const reviewNextBtn = document.querySelector('.review-button.review-next-btn'); // Seleciona os botões
        const reviewPrevBtn = document.querySelector('.review-button.review-prev-btn');

        let currentReviewIndex = 0;

        const updateReviewSlidePosition = () => {
            if (reviewSlides.length === 0) return;
            const slideWidth = reviewSlides[0].getBoundingClientRect().width;
            reviewSliderTrack.style.transform = `translateX(-${slideWidth * currentReviewIndex}px)`;
        };

        const moveReviewToSlide = (targetIndex) => {
            currentReviewIndex = targetIndex;
            updateReviewSlidePosition();
            playEffectSound(clickSound);
        };

        if (reviewNextBtn) {
            reviewNextBtn.addEventListener('click', () => {
                const nextIndex = (currentReviewIndex + 1) % reviewSlides.length;
                moveReviewToSlide(nextIndex);
            });
        }

        if (reviewPrevBtn) {
            reviewPrevBtn.addEventListener('click', () => {
                const prevIndex = (currentReviewIndex - 1 + reviewSlides.length) % reviewSlides.length;
                moveReviewToSlide(prevIndex);
            });
        }


        // Atualiza a posição inicial e ao redimensionar
        window.addEventListener('resize', updateReviewSlidePosition);
        updateReviewSlidePosition();
    }

    // Read More / Read Less (não presente no HTML atual, mas mantido para referência futura)
    const readMoreToggle = document.getElementById('readMoreToggle');
    const moreText = document.getElementById('moreText');

    if (readMoreToggle && moreText) {
        readMoreToggle.addEventListener('click', () => {
            if (moreText.classList.contains('hidden-content')) {
                moreText.classList.remove('hidden-content');
                readMoreToggle.textContent = 'Leia Menos';
            } else {
                moreText.classList.add('hidden-content');
                readMoreToggle.textContent = 'Leia Mais';
            }
            playEffectSound(clickSound);
        });
    }

    // Typewriter Effect (não presente no HTML atual, mas mantido para referência futura)
    const typewriterTextElement = document.getElementById('typewriterText');
    if (typewriterTextElement) {
        const dataText = JSON.parse(typewriterTextElement.dataset.text);
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 150;

        function typeWriter() {
            const currentText = dataText[textIndex];
            if (isDeleting) {
                typewriterTextElement.textContent = currentText.substring(0, charIndex--);
            } else {
                typewriterTextElement.textContent = currentText.substring(0, charIndex++);
            }

            if (!isDeleting && charIndex > currentText.length) {
                typingSpeed = 2000; // Pausa no final da frase
                isDeleting = true;
            } else if (isDeleting && charIndex < 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % dataText.length;
                typingSpeed = 150; // Velocidade de digitação
            }

            setTimeout(typeWriter, typingSpeed);
        }
        typeWriter();
    }

    // Custom Video Player (não presente no HTML atual, mas mantido para referência futura)
    const myVideo = document.getElementById('myVideo');
    const playPauseVideoBtn = document.getElementById('playPauseVideoBtn');
    const videoProgressBar = document.getElementById('videoProgressBar');
    const videoCurrentTime = document.getElementById('videoCurrentTime');
    const videoDuration = document.getElementById('videoDuration');
    const videoVolume = document.getElementById('videoVolume');
    const fullScreenVideoBtn = document.getElementById('fullScreenVideoBtn');

    if (myVideo && playPauseVideoBtn && videoProgressBar && videoCurrentTime && videoDuration && videoVolume && fullScreenVideoBtn) {
        // Play/Pause
        playPauseVideoBtn.addEventListener('click', () => {
            if (myVideo.paused) {
                myVideo.play();
                playPauseVideoBtn.querySelector('i').classList.remove('fa-play');
                playPauseVideoBtn.querySelector('i').classList.add('fa-pause');
            } else {
                myVideo.pause();
                playPauseVideoBtn.querySelector('i').classList.remove('fa-pause');
                playPauseVideoBtn.querySelector('i').classList.add('fa-play');
            }
            playEffectSound(clickSound);
        });

        // Update progress bar
        myVideo.addEventListener('timeupdate', () => {
            const progress = (myVideo.currentTime / myVideo.duration) * 100;
            videoProgressBar.value = progress;
            videoCurrentTime.textContent = formatTime(myVideo.currentTime);
        });

        myVideo.addEventListener('loadedmetadata', () => {
            videoDuration.textContent = formatTime(myVideo.duration);
        });

        // Seek video
        videoProgressBar.addEventListener('input', () => {
            const seekTime = (videoProgressBar.value / 100) * myVideo.duration;
            myVideo.currentTime = seekTime;
        });

        // Volume control
        videoVolume.addEventListener('input', () => {
            myVideo.volume = videoVolume.value / 100;
        });

        // Fullscreen
        fullScreenVideoBtn.addEventListener('click', () => {
            if (myVideo.requestFullscreen) {
                myVideo.requestFullscreen();
            } else if (myVideo.mozRequestFullScreen) { /* Firefox */
                myVideo.mozRequestFullScreen();
            } else if (myVideo.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                myVideo.webkitRequestFullscreen();
            } else if (myVideo.msRequestFullscreen) { /* IE/Edge */
                myVideo.msRequestFullscreen();
            }
            playEffectSound(clickSound);
        });
    }

    // Floating Action Button (não presente no HTML atual, mas mantido para referência futura)
    const floatingActionButton = document.getElementById('floatingActionButton');
    if (floatingActionButton) {
        floatingActionButton.addEventListener('click', () => {
            showCentralMessage('Ação Rápida Acionada!');
            playEffectSound(clickSound);
            // Implementar ações adicionais aqui, como abrir um sub-menu
        });
    }

    // Modern Contact Form (apenas feedback de submissão simulado)
    const contactForm = document.getElementById('contactForm'); // Mantido ID genérico
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            showCentralMessage('Mensagem enviada com sucesso!');
            contactForm.reset(); // Limpa o formulário
            playEffectSound(clickSound);
        });
    }

    // Range Slider Personalizado (não presente no HTML atual, mas mantido para referência futura)
    const volumeRange = document.getElementById('volumeRange');
    const volumeValue = document.getElementById('volumeValue');
    const distanceRange = document.getElementById('distanceRange');
    const distanceValue = document.getElementById('distanceValue');

    if (volumeRange && volumeValue) {
        volumeRange.addEventListener('input', () => {
            volumeValue.textContent = volumeRange.value;
        });
    }
    if (distanceRange && distanceValue) {
        distanceRange.addEventListener('input', () => {
            distanceValue.textContent = distanceRange.value;
        });
    }

    // Rating Stars (não presente no HTML atual, mas mantido para referência futura)
    const ratingStarsContainer = document.getElementById('ratingStars');
    if (ratingStarsContainer) {
        const stars = ratingStarsContainer.querySelectorAll('i');
        const currentRatingSpan = document.getElementById('currentRating');
        let currentRating = parseFloat(ratingStarsContainer.dataset.rating) || 0;

        const updateStars = (rating) => {
            stars.forEach(star => {
                const starValue = parseInt(star.dataset.value);
                if (starValue <= rating) {
                    star.classList.remove('far');
                    star.classList.add('fas');
                } else {
                    star.classList.remove('fas');
                    star.classList.add('far');
                }
            });
            currentRatingSpan.textContent = `(${rating}/5)`;
        };

        stars.forEach(star => {
            star.addEventListener('click', () => {
                currentRating = parseInt(star.dataset.value);
                updateStars(currentRating);
                showCentralMessage(`Avaliação: ${currentRating} estrelas!`);
                playEffectSound(clickSound);
            });
            star.addEventListener('mouseenter', () => {
                const hoverValue = parseInt(star.dataset.value);
                stars.forEach(s => {
                    const sValue = parseInt(s.dataset.value);
                    if (sValue <= hoverValue) {
                        s.classList.remove('far');
                        s.classList.add('fas');
                    } else {
                        s.classList.remove('fas');
                        s.classList.add('far');
                    }
                });
            });
            star.addEventListener('mouseleave', () => {
                updateStars(currentRating); // Volta para a avaliação atual
            });
        });

        updateStars(currentRating); // Define o estado inicial das estrelas
    }

    // Inline Form Validation Feedback (não presente no HTML atual, mas mantido para referência futura)
    const inlineValidationForm = document.getElementById('inlineValidationForm');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email-validate');
    const passwordInput = document.getElementById('password-validate');

    const usernameFeedback = document.getElementById('usernameFeedback');
    const emailFeedback = document.getElementById('emailFeedback');
    const passwordFeedback = document.getElementById('passwordFeedback');

    const validateField = (input, feedbackElement, validationFn, errorMessage) => {
        if (validationFn(input.value)) {
            feedbackElement.textContent = '';
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
            return true;
        } else {
            feedbackElement.textContent = errorMessage;
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
            return false;
        }
    };

    const isUsernameValid = (username) => username.length >= 3;
    const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPasswordValid = (password) => password.length >= 6;

    if (inlineValidationForm) {
        usernameInput.addEventListener('input', () => validateField(usernameInput, usernameFeedback, isUsernameValid, 'Mínimo de 3 caracteres.'));
        emailInput.addEventListener('input', () => validateField(emailInput, emailFeedback, isEmailValid, 'Email inválido.'));
        passwordInput.addEventListener('input', () => validateField(passwordInput, passwordFeedback, isPasswordValid, 'Mínimo de 6 caracteres.'));

        inlineValidationForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const isFormValid =
                validateField(usernameInput, usernameFeedback, isUsernameValid, 'Mínimo de 3 caracteres.') &&
                validateField(emailInput, emailFeedback, isEmailValid, 'Email inválido.') &&
                validateField(passwordInput, passwordFeedback, isPasswordValid, 'Mínimo de 6 caracteres.');

            if (isFormValid) {
                showCentralMessage('Formulário registrado com sucesso!');
                inlineValidationForm.reset();
                usernameInput.classList.remove('is-valid');
                emailInput.classList.remove('is-valid');
                passwordInput.classList.remove('is-valid');
            } else {
                showCentralMessage('Por favor, corrija os erros do formulário.');
            }
            playEffectSound(clickSound);
        });
    }

    // Spoiler Block (não presente no HTML atual, mas mantido para referência futura)
    const spoilerToggle = document.getElementById('spoilerToggle');
    const spoilerContent = document.getElementById('spoilerContent');

    if (spoilerToggle && spoilerContent) {
        spoilerToggle.addEventListener('click', () => {
            spoilerContent.classList.toggle('hidden-content');
            if (spoilerContent.classList.contains('hidden-content')) {
                spoilerToggle.textContent = 'Clique para revelar o spoiler!';
            } else {
                spoilerToggle.textContent = 'Esconder spoiler';
            }
            playEffectSound(clickSound);
        });
    }

    // Hover Text Reveal (não presente no HTML atual, mas mantido para referência futura)
    const hoverTextTrigger = document.getElementById('hoverTextTrigger');
    const hoverImage = document.getElementById('hoverImage');

    if (hoverTextTrigger && hoverImage) {
        hoverTextTrigger.addEventListener('mouseenter', () => {
            hoverImage.style.opacity = '1';
            hoverImage.style.visibility = 'visible';
        });
        hoverTextTrigger.addEventListener('mouseleave', () => {
            hoverImage.style.opacity = '0';
            hoverImage.style.visibility = 'hidden';
        });
    }

    // Cookie Consent Banner (não presente no HTML atual, mas mantido para referência futura)
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptCookiesBtn = document.getElementById('acceptCookiesBtn');
    const declineCookiesBtn = document.getElementById('declineCookiesBtn');

    if (cookieBanner && acceptCookiesBtn && declineCookiesBtn) {
        const hasAcceptedCookies = localStorage.getItem('cookieConsent') === 'accepted';

        if (!hasAcceptedCookies) {
            cookieBanner.style.display = 'flex'; // Mostra o banner se não aceitou
        }

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.style.display = 'none';
            showCentralMessage('Cookies aceitos!');
            playEffectSound(clickSound);
        });

        declineCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined'); // Ou simplesmente esconde sem aceitar
            cookieBanner.style.display = 'none';
            showCentralMessage('Cookies recusados. Algumas funcionalidades podem ser limitadas.');
            playEffectSound(clickSound);
        });
    }

    // Multi-Step Form Indicator (não presente no HTML atual, mas mantido para referência futura)
    const stepIndicatorContainer = document.querySelector('.step-indicator-container');
    if (stepIndicatorContainer) {
        const stepItems = stepIndicatorContainer.querySelectorAll('.step-item');
        const prevStepBtn = document.getElementById('prevStepBtn');
        const nextStepBtn = document.getElementById('nextStepBtn');
        const stepContentText = document.getElementById('stepContentText');

        let currentStep = 1;

        const updateStepUI = () => {
            stepItems.forEach(item => {
                const step = parseInt(item.dataset.step);
                if (step === currentStep) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });

            // Atualiza o texto do conteúdo
            let contentMessage = '';
            switch (currentStep) {
                case 1:
                    contentMessage = 'Preencha seus dados básicos para começar.';
                    break;
                case 2:
                    contentMessage = 'Selecione suas preferências e opções.';
                    break;
                case 3:
                    contentMessage = 'Revise suas informações e confirme o cadastro.';
                    break;
                default:
                    contentMessage = 'Erro no passo.';
            }
            stepContentText.textContent = contentMessage;

            // Habilita/desabilita botões
            prevStepBtn.disabled = currentStep === 1;
            nextStepBtn.disabled = currentStep === stepItems.length;
        };

        nextStepBtn.addEventListener('click', () => {
            if (currentStep < stepItems.length) {
                currentStep++;
                updateStepUI();
            }
            playEffectSound(clickSound);
        });

        prevStepBtn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                updateStepUI();
            }
            playEffectSound(clickSound);
        });

        updateStepUI(); // Inicia a UI no primeiro passo
    }

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
});
