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

    // =====================================
    // 7. ELEMENTOS
    // =====================================

    // Aguarda o documento estar completamente carregado
    document.addEventListener('DOMContentLoaded', () => {
        // Seleciona todos os elementos com a classe .stat-number
        const counters = document.querySelectorAll('.stat-number');
        const options = {
            threshold: 0.5 // Aciona a animação quando 50% do elemento está visível
        };

        // Callback para o IntersectionObserver
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Inicia o contador
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    let count = 0;
                    const speed = 200; // Ajuste a velocidade da animação

                    const updateCount = () => {
                        const increment = target / speed;
                        if (count < target) {
                            count += increment;
                            counter.innerText = Math.ceil(count);
                            setTimeout(updateCount, 1);
                        } else {
                            counter.innerText = target.toLocaleString('pt-BR'); // Formata o número final
                        }
                    };

                    updateCount();
                    observer.unobserve(counter); // Para de observar após a animação
                }
            });
        }, options);

        // Começa a observar cada contador
        counters.forEach(counter => {
            observer.observe(counter);
        });
    });


    document.addEventListener('DOMContentLoaded', () => {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const lightbox = document.getElementById('lightbox-modal');
        const lightboxImg = document.getElementById('lightbox-image');
        const closeBtn = document.querySelector('.lightbox-close');

        galleryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const imageUrl = item.getAttribute('data-image');
                lightboxImg.src = imageUrl;
                lightbox.classList.add('active');
            });
        });

        closeBtn.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
            }
        });
    });



    document.addEventListener('DOMContentLoaded', () => {
        const track = document.querySelector('.testimonials-track');
        const cards = Array.from(track.children);
        const nextBtn = document.querySelector('.testimonials-carousel-container .next');
        const prevBtn = document.querySelector('.testimonials-carousel-container .prev');
        let cardWidth = cards[0].offsetWidth + 20; // width + margin

        let currentIndex = 0;

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % cards.length;
            track.style.transform = `translateX(-${cardWidth * currentIndex}px)`;
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            track.style.transform = `translateX(-${cardWidth * currentIndex}px)`;
        });
    });


    document.addEventListener('DOMContentLoaded', () => {
        const tabs = document.querySelectorAll('.tab-btn-advanced');
        const contents = document.querySelectorAll('.tab-content-advanced');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.tab;

                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));

                tab.classList.add('active');
                document.getElementById(target).classList.add('active');
            });
        });
    });



    document.addEventListener('DOMContentLoaded', () => {
        const progressBars = document.querySelectorAll('.skill-progress');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const percent = entry.target.dataset.percent;
                    entry.target.style.width = percent + '%';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        progressBars.forEach(bar => {
            observer.observe(bar);
        });
    });




    function showToast(title, message, type = 'success', duration = 5000) {
        const toast = document.getElementById('toast-notification');
        const toastTitle = toast.querySelector('.toast-title');
        const toastMessage = toast.querySelector('.toast-message');
        const toastIcon = toast.querySelector('.toast-icon i');

        toastTitle.textContent = title;
        toastMessage.textContent = message;

        toast.classList.remove('error', 'success');
        toastIcon.classList.remove('fa-check-circle', 'fa-times-circle');

        if (type === 'error') {
            toast.classList.add('error');
            toastIcon.classList.add('fa-times-circle');
        } else {
            toast.classList.add('success');
            toastIcon.classList.add('fa-check-circle');
        }

        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }

    document.getElementById('show-toast').addEventListener('click', () => {
        showToast('Sucesso!', 'Você se conectou ao servidor com sucesso.');
    });


    document.addEventListener('DOMContentLoaded', () => {
        const themeToggleBtn = document.getElementById('theme-toggle');
        const body = document.body;

        // Checa o tema preferido do usuário ou o salvo no localStorage
        const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

        if (savedTheme === 'light') {
            body.classList.add('light-theme');
            themeToggleBtn.querySelector('i').className = 'fas fa-sun';
        } else {
            themeToggleBtn.querySelector('i').className = 'fas fa-moon';
        }

        themeToggleBtn.addEventListener('click', () => {
            if (body.classList.contains('light-theme')) {
                body.classList.remove('light-theme');
                themeToggleBtn.querySelector('i').className = 'fas fa-moon';
                localStorage.setItem('theme', 'dark');
            } else {
                body.classList.add('light-theme');
                themeToggleBtn.querySelector('i').className = 'fas fa-sun';
                localStorage.setItem('theme', 'light');
            }
        });
    });


    document.addEventListener('DOMContentLoaded', () => {
        const faqQuestions = document.querySelectorAll('.faq-question');

        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const parentItem = question.parentElement;
                parentItem.classList.toggle('active');
            });
        });
    });



    document.addEventListener('DOMContentLoaded', () => {
        const videoModal = document.getElementById('video-modal');
        const openVideoModalBtn = document.getElementById('open-video-modal');
        const closeVideoModalBtn = document.querySelector('.video-modal-close');
        const videoIframe = document.getElementById('video-iframe');

        // Substitua o ID do vídeo do YouTube aqui
        const youtubeVideoId = 'dQw4w9WgXcQ'; 

        openVideoModalBtn.addEventListener('click', () => {
            videoIframe.src = `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1`;
            videoModal.style.display = 'flex';
        });

        closeVideoModalBtn.addEventListener('click', () => {
            videoIframe.src = ''; // Para parar o vídeo
            videoModal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === videoModal) {
                videoIframe.src = '';
                videoModal.style.display = 'none';
            }
        });
    });


    document.addEventListener('DOMContentLoaded', () => {
        const closeBtns = document.querySelectorAll('.close-alert-btn');

        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                btn.parentElement.style.display = 'none';
            });
        });
    });


    document.addEventListener('DOMContentLoaded', () => {
        const chatForm = document.getElementById('chat-form');
        const chatInput = document.getElementById('chat-input');
        const chatBox = document.getElementById('chat-box');

        // Função para adicionar uma mensagem
        function addMessage(user, message, type = 'other') {
            const messageElement = document.createElement('div');
            messageElement.classList.add('chat-message', `message-${type}`);
            messageElement.innerHTML = `<strong>${user}:</strong> ${message}`;
            chatBox.prepend(messageElement); // Adiciona no início para o "flex-direction: column-reverse"
        }

        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const message = chatInput.value.trim();
            if (message) {
                // Simula uma mensagem do usuário
                addMessage('Você', message, 'user');
                chatInput.value = '';

                // Simula uma resposta
                setTimeout(() => {
                    const botResponse = "Obrigado pela sua mensagem!";
                    addMessage('Admin', botResponse, 'other');
                }, 1000);
            }
        });

        // Mensagens iniciais para demonstração
        addMessage('Admin', 'Bem-vindo ao chat da comunidade!');
        addMessage('Player1', 'Alguém online para jogar?');
    });


    document.addEventListener('DOMContentLoaded', () => {
        const newsTrack = document.querySelector('.news-track');
        const newsCards = Array.from(newsTrack.children);
        const newsNextBtn = document.querySelector('.news-nav.next');
        const newsPrevBtn = document.querySelector('.news-nav.prev');
        let cardWidth = newsCards[0].offsetWidth + 20;

        let currentIndex = 0;

        newsNextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % newsCards.length;
            newsTrack.style.transform = `translateX(-${cardWidth * currentIndex}px)`;
        });

        newsPrevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + newsCards.length) % newsCards.length;
            newsTrack.style.transform = `translateX(-${cardWidth * currentIndex}px)`;
        });
    });


    document.addEventListener('DOMContentLoaded', () => {
        const newsletterForm = document.getElementById('newsletter-form');
        const newsletterEmail = document.getElementById('newsletter-email');
        const newsletterMessage = document.getElementById('newsletter-message');

        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterEmail.value.trim();

            if (email === "") {
                newsletterMessage.textContent = 'Por favor, digite um e-mail válido.';
                newsletterMessage.classList.add('error');
                newsletterMessage.classList.remove('success');
                return;
            }

            // Simula o envio
            setTimeout(() => {
                newsletterMessage.textContent = 'E-mail cadastrado com sucesso!';
                newsletterMessage.classList.add('success');
                newsletterMessage.classList.remove('error');
                newsletterEmail.value = '';
            }, 1000);
        });
    });



    document.addEventListener('DOMContentLoaded', () => {
        const stars = document.querySelectorAll('.stars i');
        const ratingText = document.getElementById('rating-text');

        stars.forEach(star => {
            star.addEventListener('click', () => {
                const rating = star.dataset.rating;
                ratingText.textContent = `Você avaliou com ${rating} estrelas!`;

                stars.forEach(s => {
                    if (s.dataset.rating <= rating) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });
        });
    });


    document.addEventListener('DOMContentLoaded', () => {
        // Defina a data do evento (Ano, Mês-1, Dia, Hora, Minuto, Segundo)
        const eventDate = new Date('2025-12-25T00:00:00').getTime();

        const countdown = setInterval(() => {
            const now = new Date().getTime();
            const distance = eventDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('days').textContent = days < 10 ? `0${days}` : days;
            document.getElementById('hours').textContent = hours < 10 ? `0${hours}` : hours;
            document.getElementById('minutes').textContent = minutes < 10 ? `0${minutes}` : minutes;
            document.getElementById('seconds').textContent = seconds < 10 ? `0${seconds}` : seconds;

            if (distance < 0) {
                clearInterval(countdown);
                document.getElementById('countdown').innerHTML = "O evento já começou!";
            }
        }, 1000);
    });


    document.addEventListener('DOMContentLoaded', () => {
        const faqSearch = document.getElementById('faq-search');
        const faqItems = document.querySelectorAll('.faq-item');
        const faqQuestions = document.querySelectorAll('.faq-question');

        faqSearch.addEventListener('keyup', () => {
            const searchTerm = faqSearch.value.toLowerCase();

            faqItems.forEach(item => {
                const question = item.querySelector('h4').textContent.toLowerCase();
                const tags = item.dataset.tags.toLowerCase();

                if (question.includes(searchTerm) || tags.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });

        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const parentItem = question.parentElement;
                parentItem.classList.toggle('active');
            });
        });
    });

    // O JavaScript pode ser usado aqui para buscar dados de uma API
    // TABELA DE ESTATÍSTICAS DO SERVIDOR <-------------------
    // e atualizar a tabela dinamicamente. Exemplo:
    // function fetchServerStats() {
    //    fetch('/api/server-stats')
    //        .then(response => response.json())
    //        .then(data => {
    //            document.getElementById('players-online').textContent = data.playersOnline;
    //            document.getElementById('server-version').textContent = data.serverVersion;
    //            document.getElementById('uptime').textContent = data.uptime;
    //            document.getElementById('last-update').textContent = data.lastUpdate;
    //        });
    // }
    // fetchServerStats();


    document.addEventListener('DOMContentLoaded', () => {
        const heartBtn = document.querySelector('.btn-heart');
        const heartIcon = heartBtn.querySelector('i');
        const heartSpan = heartBtn.querySelector('span');
        let isLiked = false;
        let likes = 50;

        heartBtn.addEventListener('click', () => {
            isLiked = !isLiked;
            if (isLiked) {
                likes++;
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas');
                heartBtn.classList.add('active');
            } else {
                likes--;
                heartIcon.classList.remove('fas');
                heartIcon.classList.add('far');
                heartBtn.classList.remove('active');
            }
            heartSpan.textContent = `${likes} Curtidas`;
        });
    });


    document.addEventListener('DOMContentLoaded', () => {
        const memberCards = document.querySelectorAll('.team-member-modal');
        const memberModal = document.getElementById('member-modal');
        const memberDetailsContent = document.getElementById('member-details-content');
        const closeBtn = document.querySelector('#member-modal .close-btn');

        const membersData = {
            steve: {
                name: 'Steve O Construtor',
                role: 'Admin Chefe',
                image: 'assets/img/player1.png',
                bio: 'Steve é o cérebro por trás de todas as nossas construções épicas. Com mais de 10 anos de experiência, ele garante que nosso servidor seja o mais belo e funcional de todos.',
                discord: '@steve_builder'
            },
            alex: {
                name: 'Alex A Exploradora',
                role: 'Moderadora Sênior',
                image: 'assets/img/player2.png',
                bio: 'Alex é a responsável por guiar os novos jogadores e manter a paz na comunidade. Sua dedicação e paciência a tornam um pilar essencial para o nosso servidor.',
                discord: '@alex_explorer'
            }
        };

        memberCards.forEach(card => {
            card.addEventListener('click', () => {
                const memberId = card.dataset.memberId;
                const member = membersData[memberId];

                memberDetailsContent.innerHTML = `
                    <img src="${member.image}" alt="${member.name}">
                    <h4>${member.name}</h4>
                    <p class="role">${member.role}</p>
                    <p class="bio">${member.bio}</p>
                    <p class="discord"><strong>Discord:</strong> ${member.discord}</p>
                `;

                memberModal.style.display = 'flex';
            });
        });

        closeBtn.addEventListener('click', () => {
            memberModal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === memberModal) {
                memberModal.style.display = 'none';
            }
        });
    });

    document.addEventListener('DOMContentLoaded', () => {
        const searchInput = document.getElementById('dynamic-search');
        const resultsBox = document.getElementById('search-results-box');

        const availableResults = [
            { title: "Planos de Acesso", url: "#pricing" },
            { title: "Nossa Equipe", url: "#team" },
            { title: "Últimas Notícias", url: "#news" },
            { title: "Perguntas Frequentes", url: "#faq" },
            { title: "Conecte-se ao Servidor", url: "#connect" },
            { title: "Trailer do Servidor", url: "#video" }
        ];

        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            resultsBox.innerHTML = '';

            if (searchTerm.length > 1) {
                const filteredResults = availableResults.filter(item => item.title.toLowerCase().includes(searchTerm));

                if (filteredResults.length > 0) {
                    filteredResults.forEach(item => {
                        const resultItem = document.createElement('a');
                        resultItem.classList.add('search-result-item');
                        resultItem.textContent = item.title;
                        resultItem.href = item.url;
                        resultsBox.appendChild(resultItem);
                    });
                    resultsBox.style.display = 'block';
                } else {
                    resultsBox.style.display = 'none';
                }
            } else {
                resultsBox.style.display = 'none';
            }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container-dynamic')) {
                resultsBox.style.display = 'none';
            }
        });
    });


    document.addEventListener('DOMContentLoaded', () => {
        const audioPlayer = document.getElementById('audio-player');
        const playPauseBtn = document.getElementById('play-pause-btn');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const progressBar = document.getElementById('progress-bar');
        const trackTitle = document.getElementById('track-title');
        const trackArtist = document.getElementById('track-artist');
        const albumCoverImg = document.getElementById('album-cover-img');

        const playlist = [
            {
                title: 'Música da Floresta',
                artist: 'Compositor A',
                src: 'assets/audio/song1.mp3',
                cover: 'assets/img/album1.jpg'
            },
            {
                title: 'Tema do Castelo',
                artist: 'Compositor B',
                src: 'assets/audio/song2.mp3',
                cover: 'assets/img/album2.jpg'
            },
            {
                title: 'Mina Profunda',
                artist: 'Compositor C',
                src: 'assets/audio/song3.mp3',
                cover: 'assets/img/album3.jpg'
            }
        ];

        let currentTrackIndex = 0;

        function loadTrack(index) {
            const track = playlist[index];
            audioPlayer.src = track.src;
            trackTitle.textContent = track.title;
            trackArtist.textContent = track.artist;
            albumCoverImg.src = track.cover;
            audioPlayer.load();
        }

        function togglePlayPause() {
            if (audioPlayer.paused) {
                audioPlayer.play();
                playPauseBtn.querySelector('i').className = 'fas fa-pause';
            } else {
                audioPlayer.pause();
                playPauseBtn.querySelector('i').className = 'fas fa-play';
            }
        }

        function playNext() {
            currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
            loadTrack(currentTrackIndex);
            audioPlayer.play();
        }

        function playPrev() {
            currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
            loadTrack(currentTrackIndex);
            audioPlayer.play();
        }

        playPauseBtn.addEventListener('click', togglePlayPause);
        nextBtn.addEventListener('click', playNext);
        prevBtn.addEventListener('click', playPrev);

        audioPlayer.addEventListener('timeupdate', () => {
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressBar.style.width = `${progress}%`;
        });

        audioPlayer.addEventListener('ended', playNext);

        loadTrack(currentTrackIndex);
    });



    document.addEventListener('DOMContentLoaded', () => {
        const testimonialText = document.getElementById('testimonial-text');
        const testimonialAuthorName = document.getElementById('testimonial-author-name');
        const testimonials = [
            {
                text: "O melhor servidor que já joguei! A comunidade é super receptiva e os eventos são muito divertidos.",
                author: "João 'PlayerPro'",
                avatar: "assets/img/avatar1.png"
            },
            {
                text: "Sempre encontro algo novo para fazer. A equipe se dedica muito e está sempre atenta às sugestões.",
                author: "Maria 'Mineira'",
                avatar: "assets/img/avatar2.png"
            },
            {
                text: "O servidor é bem otimizado e nunca tive problemas de lag. Recomendo para todos os fãs de Minecraft!",
                author: "Pedro 'ConstrutorX'",
                avatar: "assets/img/avatar3.png"
            }
        ];

        let currentTestimonialIndex = 0;
        let charIndex = 0;
        const typingSpeed = 50;

        function typeWriterEffect() {
            const currentTestimonial = testimonials[currentTestimonialIndex];
            if (charIndex < currentTestimonial.text.length) {
                testimonialText.textContent += currentTestimonial.text.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriterEffect, typingSpeed);
            } else {
                testimonialAuthorName.textContent = currentTestimonial.author;
                testimonialText.style.borderColor = 'transparent';
                setTimeout(nextTestimonial, 3000); // 3 segundos antes do próximo
            }
        }

        function nextTestimonial() {
            currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
            charIndex = 0;
            testimonialText.textContent = '';
            typeWriterEffect();
        }

        typeWriterEffect();
    });
  
});