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

    // =======================================================
    // A
    // =======================================================

    const acordeaoBtns = document.querySelectorAll('.acordeao-btn');
    acordeaoBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            this.classList.toggle('active');
            const painel = this.nextElementSibling;
            if (painel.style.maxHeight) {
                painel.style.maxHeight = null;
            } else {
                painel.style.maxHeight = painel.scrollHeight + 'px';
            }
        });
    });

    // Exemplo JS: Interação simples
    const btnDestaque = document.querySelector('.btn-destaque');
    btnDestaque.addEventListener('click', () => {
        console.log('Botão clicado!');
    });


    // Exemplo JS: Interação de clique
    const cards = document.querySelectorAll('.card-conteudo');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            alert('Card clicado!');
        });
    });

    // =======================================================
    // A
    // =======================================================

    // Nenhuma JS funcional necessária para a animação CSS.
    // O JS abaixo é apenas um exemplo de interação.
    const tituloNeon = document.querySelector('.titulo-neon');
    tituloNeon.addEventListener('mouseover', () => {
        tituloNeon.style.animationPlayState = 'paused';
    });
    tituloNeon.addEventListener('mouseout', () => {
        tituloNeon.style.animationPlayState = 'running';
    });

    // =======================================================
    // A
    // =======================================================

    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-theme');
        // Adicione a lógica para mudar o tema, por exemplo:
        if (document.body.classList.contains('dark-theme')) {
            console.log('Tema escuro ativado!');
        } else {
            console.log('Tema claro ativado!');
        }
    });

    // =======================================================
    // A
    // =======================================================

    const progressBar = document.querySelector('.progress-bar');
    const progressValue = progressBar.getAttribute('data-progress');
    progressBar.style.width = progressValue + '%';


    const modalBtn = document.querySelector('.btn-modal-open');
    const modalBg = document.querySelector('.modal-bg');
    const modalClose = document.querySelector('.modal-close');

    modalBtn.addEventListener('click', () => {
        modalBg.style.display = 'block';
    });

    modalClose.addEventListener('click', () => {
        modalBg.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modalBg) {
            modalBg.style.display = 'none';
        }
    });

    // =======================================================
    // A
    // =======================================================

    const abasBtns = document.querySelectorAll('.aba-btn');
    const abasPaineis = document.querySelectorAll('.aba-painel');

    abasBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            abasBtns.forEach(b => b.classList.remove('active'));
            abasPaineis.forEach(p => p.classList.remove('active'));

            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // =======================================================
    // A
    // =======================================================

    const carrosselSlider = document.querySelector('.carrossel-slider');
    const carrosselPrev = document.querySelector('.carrossel-prev');
    const carrosselNext = document.querySelector('.carrossel-next');
    let slideIndex = 0;

    carrosselNext.addEventListener('click', () => {
        slideIndex++;
        if (slideIndex >= carrosselSlider.children.length) {
            slideIndex = 0;
        }
        carrosselSlider.style.transform = `translateX(-${slideIndex * 100}%)`;
    });

    carrosselPrev.addEventListener('click', () => {
        slideIndex--;
        if (slideIndex < 0) {
            slideIndex = carrosselSlider.children.length - 1;
        }
        carrosselSlider.style.transform = `translateX(-${slideIndex * 100}%)`;
    });


    // Exemplo JS: Validação de formulário
    const form = document.querySelector('.form-contato');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Formulário enviado!');
        // Adicione a sua lógica de validação aqui
    });


    // =======================================================
    // A
    // =======================================================

    const btnScrollTop = document.querySelector('.btn-scroll-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btnScrollTop.classList.add('show');
        } else {
            btnScrollTop.classList.remove('show');
        }
    });
    btnScrollTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // =======================================================
    // A
    // =======================================================

    const typingText = document.querySelector('.typing-text');
    const textToType = 'Desenvolvimento Web Moderno.';
    let i = 0;

    function typeWriter() {
        if (i < textToType.length) {
            typingText.textContent += textToType.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    typeWriter();

    // =======================================================
    // A
    // =======================================================

    const galeriaItens = document.querySelectorAll('.galeria-item');
    const lightboxOverlay = document.querySelector('.lightbox-overlay');
    const lightboxImagem = document.querySelector('.lightbox-imagem');
    const lightboxClose = document.querySelector('.lightbox-close');

    galeriaItens.forEach(item => {
        item.addEventListener('click', () => {
            lightboxOverlay.style.display = 'flex';
            lightboxImagem.src = item.src;
        });
    });

    lightboxClose.addEventListener('click', () => {
        lightboxOverlay.style.display = 'none';
    });

    lightboxOverlay.addEventListener('click', (e) => {
        if (e.target !== lightboxImagem) {
            lightboxOverlay.style.display = 'none';
        }
    });

    // =======================================================
    // A
    // =======================================================

    const btnShare = document.querySelector('.btn-share');
    const shareIcons = document.querySelector('.share-icons');

    btnShare.addEventListener('click', () => {
        shareIcons.classList.toggle('show');
    });

    // =======================================================
    // A
    // =======================================================

    const contadores = document.querySelectorAll('.contador-numero');

    const startCounter = (element) => {
        let count = 0;
        const target = parseInt(element.getAttribute('data-target'));
        const increment = target / 200; // Ajuste a velocidade da animação aqui

        const updateCount = () => {
            if (count < target) {
                count += increment;
                element.innerText = Math.ceil(count);
                requestAnimationFrame(updateCount);
            } else {
                element.innerText = target;
            }
        };
        updateCount();
    };

    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // Aciona quando 50% do elemento está visível
    };

    // =======================================================
    // A
    // =======================================================

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, options);

    contadores.forEach(contador => {
        observer.observe(contador);
    });

    // =======================================================
    // A
    // =======================================================

    // Exemplo de lógica de clique
    const btnIcon = document.querySelector('.btn-icon');
    btnIcon.addEventListener('click', () => {
        alert('Reproduzindo vídeo...');
    });

    const btnModalBlur = document.querySelector('.btn-modal-blur');
    const modalBlurBg = document.querySelector('.modal-blur-bg');
    const modalBlurClose = document.querySelector('.modal-blur-close');
    const btnEntendido = document.querySelector('.modal-blur-content .btn-destaque');

    btnModalBlur.addEventListener('click', () => {
        modalBlurBg.classList.add('show');
        document.body.classList.add('no-scroll');
    });

    modalBlurClose.addEventListener('click', () => {
        modalBlurBg.classList.remove('show');
        document.body.classList.remove('no-scroll');
    });

    btnEntendido.addEventListener('click', () => {
        modalBlurBg.classList.remove('show');
        document.body.classList.remove('no-scroll');
    });

    // =======================================================
    // A
    // =======================================================

    const abasBotoesAnimadas = document.querySelectorAll('.aba-btn-animada');
    const abasPaineisAnimados = document.querySelectorAll('.aba-painel-animada');
    const abaIndicador = document.querySelector('.aba-indicador');

    function updateIndicador(btn) {
        abaIndicador.style.width = `${btn.offsetWidth}px`;
        abaIndicador.style.left = `${btn.offsetLeft}px`;
    }

    abasBotoesAnimadas.forEach(btn => {
        btn.addEventListener('click', function () {
            abasBotoesAnimadas.forEach(b => b.classList.remove('active'));
            abasPaineisAnimados.forEach(p => p.classList.remove('active'));

            this.classList.add('active');
            const tabId = this.getAttribute('data-tab-animada');
            document.getElementById(tabId).classList.add('active');
            updateIndicador(this);
        });
    });

    // Inicializa a posição do indicador na primeira aba
    const primeiraAba = document.querySelector('.aba-btn-animada.active');
    if (primeiraAba) {
        updateIndicador(primeiraAba);
    }

    // =======================================================
    // A
    // =======================================================

    const btnAviso = document.querySelector('.btn-aviso-sucesso');
    const avisoToast = document.getElementById('aviso-toast');

    btnAviso.addEventListener('click', () => {
        avisoToast.classList.add('show');
        setTimeout(() => {
            avisoToast.classList.remove('show');
        }, 3000); // Esconde a mensagem após 3 segundos
    });

    // =======================================================
    // A
    // =======================================================

    const btnCopy = document.querySelector('.btn-copy');
    const codigoBloco = document.querySelector('.codigo-bloco');

    btnCopy.addEventListener('click', () => {
        const texto = codigoBloco.textContent;
        navigator.clipboard.writeText(texto).then(() => {
            console.log('Código copiado para a área de transferência!');
            // Opcional: mostrar uma mensagem de sucesso
            const mensagemCopy = document.createElement('span');
            mensagemCopy.textContent = 'Copiado!';
            mensagemCopy.classList.add('aviso-copy');
            btnCopy.appendChild(mensagemCopy);
            setTimeout(() => {
                mensagemCopy.remove();
            }, 1500);
        }).catch(err => {
            console.error('Erro ao copiar: ', err);
        });
    });

    // =======================================================
    // A
    // =======================================================

    const btnSidebarOpen = document.querySelector('.btn-sidebar-open');
    const btnSidebarClose = document.querySelector('.btn-sidebar-close');
    const sidebarMenu = document.querySelector('.sidebar-menu');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');

    btnSidebarOpen.addEventListener('click', () => {
        sidebarMenu.classList.add('open');
        sidebarOverlay.style.display = 'block';
    });

    btnSidebarClose.addEventListener('click', () => {
        sidebarMenu.classList.remove('open');
        sidebarOverlay.style.display = 'none';
    });

    sidebarOverlay.addEventListener('click', () => {
        sidebarMenu.classList.remove('open');
        sidebarOverlay.style.display = 'none';
    });

    // =======================================================
    // A
    // =======================================================

    const filtroBtns = document.querySelectorAll('.filtro-btn');

    filtroBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filtroBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');

            galeriaItens.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // =======================================================
    // A
    // =======================================================

    const chatbotBtn = document.querySelector('.chatbot-btn');
    const chatbotBox = document.querySelector('.chatbot-box');
    const chatbotClose = document.querySelector('.chatbot-close');

    chatbotBtn.addEventListener('click', () => {
        chatbotBox.classList.toggle('show');
    });

    chatbotClose.addEventListener('click', () => {
        chatbotBox.classList.remove('show');
    });

    // =======================================================
    // A
    // =======================================================

    const btnRipple = document.querySelector('.btn-ripple');

    btnRipple.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        this.appendChild(ripple);

        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    });

    // =======================================================
    // A
    // =======================================================

    const cardPerfil3D = document.querySelector('.card-perfil-3d');

    cardPerfil3D.addEventListener('mousemove', (e) => {
        const rect = cardPerfil3D.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        const rotateX = (y - 0.5) * 20;
        const rotateY = -(x - 0.5) * 20;

        cardPerfil3D.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    cardPerfil3D.addEventListener('mouseleave', () => {
        cardPerfil3D.style.transform = `perspective(1000px) rotateX(0) rotateY(0)`;
    });

    // =======================================================
    // A
    // =======================================================

    const btnDownload = document.querySelector('.btn-download');

    btnDownload.addEventListener('click', () => {
        btnDownload.classList.add('loading');
        setTimeout(() => {
            btnDownload.classList.remove('loading');
            // Você pode adicionar a lógica de download aqui
            alert('Download concluído!');
        }, 2000);
    });

    // =======================================================
    // A
    // =======================================================

    const cookieConsent = document.getElementById('cookie-consent');
    const btnAceitarCookie = document.querySelector('.btn-aceitar-cookie');
    const btnRejeitarCookie = document.querySelector('.btn-rejeitar-cookie');

    if (!localStorage.getItem('cookie-accepted')) {
        setTimeout(() => {
            cookieConsent.classList.add('show');
        }, 1000);
    }

    function hideCookieConsent() {
        cookieConsent.style.transform = 'translateX(-50%) translateY(150%)';
    }

    btnAceitarCookie.addEventListener('click', () => {
        localStorage.setItem('cookie-accepted', 'true');
        hideCookieConsent();
    });

    btnRejeitarCookie.addEventListener('click', () => {
        localStorage.setItem('cookie-accepted', 'false');
        hideCookieConsent();
    });


    const scrollContainer = document.querySelector('.scroll-horizontal-container');
    let isDown = false;
    let startX;
    let scrollLeft;

    scrollContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        scrollContainer.classList.add('active');
        startX = e.pageX - scrollContainer.offsetLeft;
        scrollLeft = scrollContainer.scrollLeft;
    });

    scrollContainer.addEventListener('mouseleave', () => {
        isDown = false;
        scrollContainer.classList.remove('active');
    });

    scrollContainer.addEventListener('mouseup', () => {
        isDown = false;
        scrollContainer.classList.remove('active');
    });

    scrollContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollContainer.offsetLeft;
        const walk = (x - startX) * 2;
        scrollContainer.scrollLeft = scrollLeft - walk;
    });

    // =======================================================
    // A
    // =======================================================

    const testemunhoWrapper = document.querySelector('.testemunho-wrapper');
    const bolhas = document.querySelectorAll('.bolha-testemunho');
    let testemunhoIndex = 0;

    function updateCarrossel() {
        testemunhoWrapper.style.transform = `translateX(-${testemunhoIndex * 100}%)`;
        bolhas.forEach((bolha, index) => {
            if (index === testemunhoIndex) {
                bolha.classList.add('active');
            } else {
                bolha.classList.remove('active');
            }
        });
    }

    bolhas.forEach((bolha, index) => {
        bolha.addEventListener('click', () => {
            testemunhoIndex = index;
            updateCarrossel();
        });
    });

    // =======================================================
    // A
    // =======================================================

    const rollingNumbers = document.querySelectorAll('.numero-rolling');

    rollingNumbers.forEach(element => {
        const target = parseInt(element.getAttribute('data-target'));
        const initialHeight = element.offsetHeight;
        let count = 0;

        // Adiciona os números para a animação
        const numbersContainer = document.createElement('div');
        numbersContainer.style.transition = 'transform 2s ease-out';
        numbersContainer.style.transform = `translateY(-${target}px)`;

        for (let i = 0; i <= target; i++) {
            const numberSpan = document.createElement('span');
            numberSpan.textContent = i;
            numberSpan.style.height = initialHeight + 'px';
            numberSpan.style.display = 'flex';
            numberSpan.style.justifyContent = 'center';
            numberSpan.style.alignItems = 'center';
            numbersContainer.appendChild(numberSpan);
        }

        element.innerHTML = '';
        element.appendChild(numbersContainer);

        // Animação ao rolar
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    numbersContainer.style.transform = `translateY(-${target * initialHeight}px)`;
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(element);
    });

    // =======================================================
    // A
    // =======================================================

    const shareContainer = document.querySelector('.share-container');
    const btnShareToggle = document.querySelector('.btn-share-toggle');

    btnShareToggle.addEventListener('click', () => {
        shareContainer.classList.toggle('active');
    });

    // =======================================================
    // A
    // =======================================================

    const galeriaColunas = document.querySelectorAll('.galeria-coluna');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        galeriaColunas.forEach(coluna => {
            const speed = parseFloat(coluna.getAttribute('data-speed'));
            const yPos = -(scrollY * speed);
            coluna.style.transform = `translateY(${yPos}px)`;
        });
    });

    // =======================================================
    // A
    // =======================================================

    const btnNotificacao = document.querySelector('.btn-notificacao');
    const notificationDropdown = document.querySelector('.notification-dropdown');
    const notificationCount = document.getElementById('notification-count');
    const notificationList = document.getElementById('notification-list');
    const btnLimpar = document.querySelector('.btn-limpar');
    let count = 0;

    btnNotificacao.addEventListener('click', () => {
        notificationDropdown.classList.toggle('show');
    });

    function addNotification(message) {
        count++;
        notificationCount.textContent = count;
        const newLi = document.createElement('li');
        newLi.textContent = message;

        if (notificationList.children[0].textContent === 'Nenhuma notificação nova.') {
            notificationList.innerHTML = '';
        }
        notificationList.prepend(newLi);
    }

    btnLimpar.addEventListener('click', () => {
        notificationList.innerHTML = '<li>Nenhuma notificação nova.</li>';
        count = 0;
        notificationCount.textContent = '0';
    });

    // Exemplo de como usar a função:
    addNotification('Nova mensagem de Maria.');
    addNotification('Seu pedido foi enviado.');

    // =======================================================
    // A
    // =======================================================

    const dropdownContainer = document.querySelector('.dropdown-menu-container');
    const dropdownBtn = document.querySelector('.dropdown-btn');

    dropdownBtn.addEventListener('click', () => {
        dropdownContainer.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown-menu-container')) {
            dropdownContainer.classList.remove('open');
        }
    });

    // =======================================================
    // A
    // =======================================================

    const pageLoader = document.getElementById('page-loader');

    window.addEventListener('load', () => {
        setTimeout(() => {
            pageLoader.classList.add('hidden');
        }, 1000); // Esconde o loader após 1 segundo
    });

    // =======================================================
    // A
    // =======================================================

    const tabela = document.getElementById('tabela-estatisticas');
    const headers = tabela.querySelectorAll('th');
    const tbody = tabela.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.dataset.column;
            const order = header.dataset.order === 'asc' ? 'desc' : 'asc';
            header.dataset.order = order;

            const sortedRows = rows.sort((a, b) => {
                const aText = a.querySelector(`td:nth-child(${Array.from(headers).indexOf(header) + 1})`).textContent.trim();
                const bText = b.querySelector(`td:nth-child(${Array.from(headers).indexOf(header) + 1})`).textContent.trim();

                const aValue = isNaN(aText) ? aText : parseFloat(aText.replace(/[^0-9.-]+/g, ""));
                const bValue = isNaN(bText) ? bText : parseFloat(bText.replace(/[^0-9.-]+/g, ""));

                if (aValue < bValue) {
                    return order === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return order === 'asc' ? 1 : -1;
                }
                return 0;
            });

            tbody.innerHTML = '';
            sortedRows.forEach(row => tbody.appendChild(row));
        });
    });

    // =======================================================
    // A
    // =======================================================

    const progressCircle = document.querySelector('.circulo-progresso');
    const porcentagem = parseFloat(progressCircle.dataset.porcentagem);
    const offset = 283 - (porcentagem / 100) * 283;

    // Animação ao entrar na tela
    const observe = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                progressCircle.style.strokeDashoffset = offset;
                observe.unobserve(entry.target);
            }
        });
    });
    observe.observe(progressCircle);

    // =======================================================
    // A
    // =======================================================

    const barras = document.querySelectorAll('.barra-item');

    const observe2 = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                barras.forEach(barra => {
                    const value = barra.dataset.value;
                    barra.style.height = `${value}%`;
                    const fillBar = barra.querySelector('::before');
                    if (fillBar) {
                        fillBar.style.transform = 'scaleY(1)';
                    }
                });
                observe2.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    observe2.observe(document.querySelector('.grafico-barras'));

    // =======================================================
    // A
    // =======================================================

    const searchEfeito = document.querySelector('.search-efeito');
    const inputEfeito = document.querySelector('.input-efeito');

    searchEfeito.addEventListener('click', () => {
        searchEfeito.classList.add('active');
        inputEfeito.focus();
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-efeito')) {
            searchEfeito.classList.remove('active');
        }
    });

    // =======================================================
    // A
    // =======================================================

    const acordeaoItems = document.querySelectorAll('.acordeao-item');

    acordeaoItems.forEach(item => {
        const btn = item.querySelector('.acordeao-btn');
        btn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            acordeaoItems.forEach(i => i.classList.remove('active'));
            if (!isActive) {
                item.classList.add('active');
                // Animação de altura
                const painel = item.querySelector('.acordeao-painel');
                painel.style.maxHeight = painel.scrollHeight + 'px';
            } else {
                const painel = item.querySelector('.acordeao-painel');
                painel.style.maxHeight = null;
            }
        });
    });

    // =======================================================
    // A
    // =======================================================

    const btnAbrirAviso = document.querySelector('.btn-abrir-aviso');
    const avisoOverlay = document.querySelector('.aviso-popup-overlay');
    const avisoClose = document.querySelector('.aviso-popup-close');

    btnAbrirAviso.addEventListener('click', () => {
        avisoOverlay.classList.add('show');
    });

    avisoClose.addEventListener('click', () => {
        avisoOverlay.classList.remove('show');
    });



    document.querySelectorAll('.toolbox-trigger').forEach(trigger => {
        trigger.addEventListener('click', function (event) {
            event.stopPropagation();
            this.classList.toggle('active');
        });
    });
    document.addEventListener('click', () => {
        document.querySelectorAll('.toolbox-trigger.active').forEach(trigger => {
            trigger.classList.remove('active');
        });
    });

    // =======================================================
    // A
    // =======================================================

    const btnFade = document.querySelector('.btn-tooltip-fade');
    const overlayFade = document.querySelector('.tooltip-fade-overlay');
    const btnFecharFade = document.querySelector('.btn-fechar-tooltip');
    btnFade.addEventListener('click', () => overlayFade.classList.add('show'));
    btnFecharFade.addEventListener('click', () => overlayFade.classList.remove('show'));
    overlayFade.addEventListener('click', (e) => {
        if (e.target === overlayFade) overlayFade.classList.remove('show');
    });

    // =======================================================
    // A
    // =======================================================

    const toolboxRodape = document.querySelector('.toolbox-rodape');
    const toolboxFechar = document.querySelector('.toolbox-fechar');
    setTimeout(() => toolboxRodape.classList.add('show'), 1000);
    toolboxFechar.addEventListener('click', () => toolboxRodape.classList.remove('show'));



    // Incluir a funcionalidade de copiar código do item 25.
    document.querySelectorAll('.toolbox-codigo-trigger').forEach(trigger => {
        trigger.addEventListener('click', function (event) {
            event.stopPropagation();
            this.classList.toggle('active');
        });
    });

    // =======================================================
    // A
    // =======================================================

    const carouselItems = document.querySelectorAll('.carousel-full-screen .carousel-item');
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');
    let currentSlide = 0;
    function showSlide(index) {
        carouselItems.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
    }
    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide > 0) ? currentSlide - 1 : carouselItems.length - 1;
        showSlide(currentSlide);
    });
    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide < carouselItems.length - 1) ? currentSlide + 1 : 0;
        showSlide(currentSlide);
    });

    // =======================================================
    // A
    // =======================================================

    const wrapper = document.querySelector('.carousel-cards-wrapper');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    let currentCard = 0;
    const cardsPerView = 3;
    function updateCarousel(index) {
        wrapper.style.transform = `translateX(-${index * (100 / cardsPerView)}%)`;
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    }
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentCard = index;
            updateCarousel(currentCard);
        });
    });

    // =======================================================
    // A
    // =======================================================

    const tabsContainer = document.querySelector('.tabs-container');
    const tabButtons = tabsContainer.querySelectorAll('.tab-button');
    const tabPanes = tabsContainer.querySelectorAll('.tab-pane');
    const tabIndicator = tabsContainer.querySelector('.tab-indicator');

    function updateIndicator(button) {
        const buttonRect = button.getBoundingClientRect();
        const containerRect = tabsContainer.getBoundingClientRect();
        tabIndicator.style.left = `${buttonRect.left - containerRect.left}px`;
        tabIndicator.style.width = `${buttonRect.width}px`;
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');

            updateIndicator(button);
        });
    });

    // Inicializa o indicador
    updateIndicator(document.querySelector('.tab-button.active'));
    window.addEventListener('resize', () => {
        updateIndicator(document.querySelector('.tab-button.active'));
    });

    // =======================================================
    // A
    // =======================================================

    const formCard = document.getElementById('form-contato');
    const inputs = form.querySelectorAll('input, textarea');

    const feedbackMessages = {
        nome: 'O nome deve ter pelo menos 3 caracteres.',
        email: 'Por favor, insira um e-mail válido.',
        mensagem: 'A mensagem não pode estar vazia.'
    };

    function validateInput(input) {
        const parent = input.parentElement;
        const feedback = parent.querySelector('.feedback-validacao');

        if (input.checkValidity()) {
            parent.classList.remove('invalid');
            parent.classList.add('valid');
            feedback.textContent = '';
        } else {
            parent.classList.remove('valid');
            parent.classList.add('invalid');
            feedback.textContent = feedbackMessages[input.id] || 'Campo inválido.';
        }
    }

    inputs.forEach(input => {
        input.addEventListener('input', () => validateInput(input));
        input.addEventListener('blur', () => validateInput(input));
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isFormValid = true;
        inputs.forEach(input => {
            validateInput(input);
            if (!input.checkValidity()) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            alert('Formulário enviado com sucesso!');
            form.reset();
        } else {
            alert('Por favor, preencha todos os campos corretamente.');
        }
    });

    // =======================================================
    // A
    // =======================================================

    const swipeWrapper = document.querySelector('.liquid-swipe-wrapper');
    const prevBtn2 = document.querySelector('.liquid-btn.prev');
    const nextBtn2 = document.querySelector('.liquid-btn.next');
    const cards2 = document.querySelectorAll('.liquid-card');
    let currentIndex = 0;

    function updateSwipe() {
        swipeWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    prevBtn2.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : cards.length - 1;
        updateSwipe();
    });

    nextBtn2.addEventListener('click', () => {
        currentIndex = (currentIndex < cards2.length - 1) ? currentIndex + 1 : 0;
        updateSwipe();
    });

    // =======================================================
    // A
    // =======================================================

    const cardReflexo = document.querySelector('.card-reflexo');

    cardReflexo.addEventListener('mousemove', (e) => {
        const rect = cardReflexo.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        cardReflexo.style.setProperty('--x', `${x}px`);
        cardReflexo.style.setProperty('--y', `${y}px`);

        // Atualiza a posição do reflexo em CSS
        cardReflexo.style.setProperty('--reflect-pos', `${x * 100 / rect.width}% ${y * 100 / rect.height}%`);
    });

    // =======================================================
    // A
    // =======================================================

    const starsContainer = document.querySelector('.rating-stars');
    const stars = starsContainer.querySelectorAll('i');

    function setRating(ratingValue) {
        stars.forEach(star => {
            if (parseInt(star.dataset.value) <= ratingValue) {
                star.classList.add('filled');
            } else {
                star.classList.remove('filled');
            }
        });
    }

    // Inicializa a avaliação com o valor do atributo 'data-rating'
    setRating(parseInt(starsContainer.dataset.rating));

    starsContainer.addEventListener('click', (e) => {
        const clickedStar = e.target.closest('i');
        if (clickedStar) {
            const ratingValue = parseInt(clickedStar.dataset.value);
            starsContainer.dataset.rating = ratingValue;
            setRating(ratingValue);
            console.log(`Nova avaliação: ${ratingValue} estrelas`);
            // Aqui você pode enviar a avaliação para o servidor
        }
    });

    // =======================================================
    // A
    // =======================================================

    const wrapper3d = document.querySelector('.carousel-3d-wrapper');
    const prev3d = document.querySelector('.prev-3d');
    const next3d = document.querySelector('.next-3d');
    const cards3d = document.querySelectorAll('.carousel-3d-card');
    let currentIndex3d = 0;

    function updateCarousel3d() {
        wrapper3d.style.transform = `translateX(-${currentIndex3d * 100}%)`;
    }

    prev3d.addEventListener('click', () => {
        currentIndex3d = (currentIndex3d > 0) ? currentIndex3d - 1 : cards3d.length - 1;
        updateCarousel3d();
    });

    next3d.addEventListener('click', () => {
        currentIndex3d = (currentIndex3d < cards3d.length - 1) ? currentIndex3d + 1 : 0;
        updateCarousel3d();
    });


    // =======================================================
    // A
    // =======================================================

    document.querySelectorAll('.btn-ler-mais').forEach(button => {
        button.addEventListener('click', () => {
            const parentCard = button.closest('.card-ler-mais');
            const shortText = parentCard.querySelector('.texto-curto');
            const fullText = parentCard.querySelector('.texto-completo');
            const dots = parentCard.querySelector('.ler-mais-ponto');

            if (fullText.style.display === 'none') {
                fullText.style.display = 'inline';
                dots.style.display = 'none';
                button.textContent = 'Ler Menos';
            } else {
                fullText.style.display = 'none';
                dots.style.display = 'inline';
                button.textContent = 'Ler Mais';
            }
        });
    });

    // =======================================================
    // A
    // =======================================================

    const tocLinks = document.querySelectorAll('.toc a');
    const sections = document.querySelectorAll('.conteudo-longo section');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 60) {
                current = section.getAttribute('id');
            }
        });

        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.href.includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // =======================================================
    // A
    // =======================================================

    document.querySelectorAll('.btn-copiar').forEach(button => {
        button.addEventListener('click', () => {
            const parent = button.closest('.campo-copia');
            const input = parent.querySelector('input');
            const feedback = parent.querySelector('.feedback-copia');

            input.select();
            input.setSelectionRange(0, 99999);
            document.execCommand('copy');

            feedback.classList.add('show');
            setTimeout(() => {
                feedback.classList.remove('show');
            }, 1500);
        });
    });

    // =======================================================
    // A
    // =======================================================

    document.querySelectorAll('.btn-share').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const network = e.currentTarget.dataset.share;
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            let shareUrl = '';

            switch (network) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://api.whatsapp.com/send?text=${title}%20${url}`;
                    break;
            }

            if (shareUrl) {
                window.open(shareUrl, '_blank');
            }
        });
    });

    // =======================================================
    // A
    // =======================================================

    const modalOverlay = document.getElementById('modal-detalhes-plano');
    const closeModalBtn = modalOverlay.querySelector('.close-modal');
    const modalPlanTitle = document.getElementById('modal-plan-title');
    const modalPlanDescription = document.getElementById('modal-plan-description');
    const modalMainThumbnail = document.getElementById('modal-main-thumbnail');
    const modalThumbnailsContainer = document.getElementById('modal-thumbnails');
    const modalPlanFeatures = document.getElementById('modal-plan-features');

    const plansData = {
        essencial: {
            title: 'Plano Essencial',
            description: 'Ideal para quem está começando, com os recursos básicos para sua presença online. Tenha acesso a funcionalidades essenciais e um bom desempenho.',
            thumbnails: [
                'https://via.placeholder.com/600x400/1A1A1A/FFFFFF?text=Essencial+1',
                'https://via.placeholder.com/600x400/333333/FFFFFF?text=Essencial+2',
                'https://via.placeholder.com/600x400/555555/FFFFFF?text=Essencial+3'
            ],
            features: [
                '1 Usuário', '5 Projetos', '10GB Armazenamento', 'Suporte Básico', 'Relatórios Mensais'
            ]
        },
        premium: {
            title: 'Plano Premium',
            description: 'Nosso plano mais popular, com todos os recursos avançados e suporte prioritário. Perfeito para equipes e projetos em crescimento que precisam de mais poder.',
            thumbnails: [
                'https://via.placeholder.com/600x400/007bff/FFFFFF?text=Premium+1',
                'https://via.placeholder.com/600x400/0056b3/FFFFFF?text=Premium+2',
                'https://via.placeholder.com/600x400/003c7a/FFFFFF?text=Premium+3'
            ],
            features: [
                '5 Usuários', 'Projetos Ilimitados', '100GB Armazenamento', 'Suporte Prioritário', 'Relatórios Detalhados', 'Funcionalidades Exclusivas'
            ]
        },
        ultimate: {
            title: 'Plano Ultimate',
            description: 'A solução completa para grandes empresas, com acesso exclusivo e gerenciamento dedicado. Obtenha desempenho máximo e atenção personalizada para suas necessidades.',
            thumbnails: [
                'https://via.placeholder.com/600x400/6200EE/FFFFFF?text=Ultimate+1',
                'https://via.placeholder.com/600x400/3700B3/FFFFFF?text=Ultimate+2',
                'https://via.placeholder.com/600x400/1A0066/FFFFFF?text=Ultimate+3'
            ],
            features: [
                'Usuários Ilimitados', 'Projetos Ilimitados', 'Armazenamento Ilimitado', 'Gerente de Conta Dedicado', 'Análises Avançadas', 'Treinamento Personalizado'
            ]
        }
    };

    document.querySelectorAll('.comparison-card button[data-plan]').forEach(button => {
        button.addEventListener('click', (e) => {
            const planKey = e.currentTarget.dataset.plan;
            const plan = plansData[planKey];

            modalPlanTitle.textContent = plan.title;
            modalPlanDescription.textContent = plan.description;

            // Carregar a primeira thumbnail como principal
            modalMainThumbnail.src = plan.thumbnails[0];

            // Limpar e carregar as thumbnails do carrossel
            modalThumbnailsContainer.innerHTML = '';
            plan.thumbnails.forEach(thumbSrc => {
                const img = document.createElement('img');
                img.src = thumbSrc;
                img.alt = plan.title;
                img.addEventListener('click', () => {
                    modalMainThumbnail.src = thumbSrc;
                    modalThumbnailsContainer.querySelectorAll('img').forEach(i => i.classList.remove('active'));
                    img.classList.add('active');
                });
                modalThumbnailsContainer.appendChild(img);
            });
            // Ativar a primeira thumbnail
            if (modalThumbnailsContainer.firstElementChild) {
                modalThumbnailsContainer.firstElementChild.classList.add('active');
            }


            // Limpar e carregar os recursos
            modalPlanFeatures.innerHTML = '<h4>Recursos Inclusos:</h4><ul></ul>';
            const featuresList = modalPlanFeatures.querySelector('ul');
            plan.features.forEach(feature => {
                const li = document.createElement('li');
                li.innerHTML = `<i class="fas fa-check-circle"></i> ${feature}`;
                featuresList.appendChild(li);
            });

            modalOverlay.classList.add('show');
        });
    });

    closeModalBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('show');
    });

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('show');
        }
    });

    // =======================================================
    // A
    // =======================================================

    const btnSubmitLoading = document.getElementById('btn-submit-loading');

    btnSubmitLoading.addEventListener('click', () => {
        btnSubmitLoading.classList.add('loading');
        btnSubmitLoading.disabled = true; // Desabilita o botão para evitar múltiplos cliques

        // Simula um carregamento de dados (ex: chamada de API)
        setTimeout(() => {
            btnSubmitLoading.classList.remove('loading');
            btnSubmitLoading.disabled = false;
            alert('Dados salvos com sucesso!');
        }, 2000);
    });

    // =======================================================
    // A
    // =======================================================

    const galleryImages = document.querySelectorAll('.gallery-grid img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxClose2 = lightbox.querySelector('.lightbox-close');

    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            lightbox.classList.add('show');
            lightboxImg.src = img.dataset.fullSrc;
        });
    });

    lightboxClose2.addEventListener('click', () => {
        lightbox.classList.remove('show');
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('show');
        }
    });

    // =======================================================
    // A
    // =======================================================

    const items = [
        { id: 1, title: 'Mod de Magia', description: 'Adiciona novas habilidades mágicas.', rating: 4.5, tags: ['mod'], thumbnail: 'https://via.placeholder.com/400x300/F44336/FFFFFF?text=Mod+Magia', details: 'Inclui 50 feitiços, 10 varinhas e novos inimigos. Requer a versão 1.18.' },
        { id: 2, title: 'Skin Cyberpunk', description: 'Um visual futurista para seu personagem.', rating: 4.8, tags: ['skin'], thumbnail: 'https://via.placeholder.com/400x300/E91E63/FFFFFF?text=Skin+Cyberpunk', details: 'Design com luzes de neon e armadura cromada. Compatível com todas as plataformas.' },
        { id: 3, title: 'Addon de Decoração', description: 'Mais de 100 blocos e itens decorativos.', rating: 4.2, tags: ['addon'], thumbnail: 'https://via.placeholder.com/400x300/9C27B0/FFFFFF?text=Addon+Decoracao', details: 'Perfeito para construção e criação de interiores. Funciona em servidores.' },
        { id: 4, title: 'Arquivo de Cores Vibrantes', description: 'Um pacote de texturas com cores vivas.', rating: 4.7, tags: ['arquivos'], thumbnail: 'https://via.placeholder.com/400x300/673AB7/FFFFFF?text=Cores+Vibrantes', details: 'Melhora a experiência visual do jogo. Formato .zip.' },
        { id: 5, title: 'Mod de Animais Exóticos', description: 'Adiciona novas criaturas e biomas.', rating: 4.6, tags: ['mod'], thumbnail: 'https://via.placeholder.com/400x300/3F51B5/FFFFFF?text=Mod+Animais', details: 'Descubra pandas, elefantes e leões. Os animais interagem entre si.' },
        { id: 6, title: 'Addon de Armas', description: 'Novas armas de fogo e ferramentas de combate.', rating: 4.1, tags: ['addon'], thumbnail: 'https://via.placeholder.com/400x300/2196F3/FFFFFF?text=Addon+Armas', details: 'Aumente o arsenal de seu personagem com armas e munições.' },
        { id: 7, title: 'Skin de Robô', description: 'Transforme-se em um robô superpoderoso.', rating: 4.4, tags: ['skin'], thumbnail: 'https://via.placeholder.com/400x300/03A9F4/FFFFFF?text=Skin+Robo', details: 'Inclui efeitos sonoros de metal. Disponível para download instantâneo.' }
    ];

    const searchInput2 = document.getElementById('searchInput');
    const tagButtons = document.querySelectorAll('.tag-btn');
    const searchResults = document.getElementById('searchResults');
    const itemModal = document.getElementById('itemModal');
    const closeModal = itemModal.querySelector('.close-modal');

    function renderItems(filteredItems) {
        searchResults.innerHTML = '';
        filteredItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'result-card';
            card.innerHTML = `
            <img src="${item.thumbnail}" alt="${item.title}">
            <div class="card-content">
                <h4>${item.title}</h4>
                <p>${item.description}</p>
                <div class="card-rating">
                    ${'★'.repeat(Math.floor(item.rating))}
                    ${item.rating % 1 !== 0 ? '½' : ''}
                    (${item.rating})
                </div>
                <button class="card-button" data-id="${item.id}">Detalhes</button>
            </div>
        `;
            searchResults.appendChild(card);
        });
    }

    function filterAndSearch() {
        const searchTerm = searchInput2.value.toLowerCase();
        const activeTag = document.querySelector('.tag-btn.active').dataset.tag;

        const filteredItems = items.filter(item => {
            const matchesTag = activeTag === 'all' || item.tags.includes(activeTag);
            const matchesSearch = item.title.toLowerCase().includes(searchTerm) || item.description.toLowerCase().includes(searchTerm);
            return matchesTag && matchesSearch;
        });

        renderItems(filteredItems);
    }

    // Eventos de tags
    tagButtons.forEach(button => {
        button.addEventListener('click', () => {
            tagButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterAndSearch();
        });
    });

    // Evento de pesquisa
    searchInput2.addEventListener('input', filterAndSearch);

    // Eventos de modal
    searchResults.addEventListener('click', (e) => {
        const button = e.target.closest('.card-button');
        if (button) {
            const itemId = parseInt(button.dataset.id);
            const item = items.find(i => i.id === itemId);
            if (item) {
                document.getElementById('modalThumbnail').src = item.thumbnail;
                document.getElementById('modalTitle').textContent = item.title;
                document.getElementById('modalDescription').textContent = item.description;
                document.getElementById('modalRating').innerHTML = `Nota: ${'★'.repeat(Math.floor(item.rating))} (${item.rating})`;
                document.getElementById('modalDetails').innerHTML = `<p><strong>Detalhes Adicionais:</strong> ${item.details}</p>`;
                itemModal.classList.add('show');
            }
        }
    });

    closeModal.addEventListener('click', () => {
        itemModal.classList.remove('show');
    });

    itemModal.addEventListener('click', (e) => {
        if (e.target === itemModal) {
            itemModal.classList.remove('show');
        }
    });

    // Inicialização
    filterAndSearch();


    // =======================================================
    // A
    // =======================================================

    // O array `items` é o mesmo do exemplo anterior.

    const tabButton = document.querySelectorAll('.tab-search-btn');
    const tabPane = document.querySelectorAll('.search-tab-pane');

    function renderCardsToPane(paneId, itemsToRender) {
        const pane = document.getElementById(paneId);
        pane.innerHTML = '';
        itemsToRender.forEach(item => {
            const card = document.createElement('div');
            card.className = 'result-card';
            card.innerHTML = `
            <img src="${item.thumbnail}" alt="${item.title}">
            <div class="card-content">
                <h4>${item.title}</h4>
                <p>${item.description}</p>
                <div class="card-rating">
                    ${'★'.repeat(Math.floor(item.rating))}
                    ${item.rating % 1 !== 0 ? '½' : ''}
                    (${item.rating})
                </div>
                <button class="card-button" data-id="${item.id}">Detalhes</button>
            </div>
        `;
            pane.appendChild(card);
        });
    }

    function switchTab(tabId) {
        tabPane.forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');

        if (tabId === 'all') {
            renderCardsToPane(tabId, items);
        } else {
            const filteredItems = items.filter(item => item.tags.includes(tabId));
            renderCardsToPane(tabId, filteredItems);
        }
    }

    // Eventos de abas
    tabButton.forEach(button => {
        button.addEventListener('click', () => {
            tabButton.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            switchTab(button.dataset.tab);
        });
    });

    // Eventos do modal (os mesmos do exemplo anterior)
    document.addEventListener('click', (e) => {
        const button = e.target.closest('.card-button');
        if (button) {
            const itemId = parseInt(button.dataset.id);
            const item = items.find(i => i.id === itemId);
            if (item) {
                const modal = document.getElementById('itemModal'); // ou 'itemModal2' se for um modal diferente
                document.getElementById('modalThumbnail').src = item.thumbnail;
                document.getElementById('modalTitle').textContent = item.title;
                document.getElementById('modalDescription').textContent = item.description;
                document.getElementById('modalRating').innerHTML = `Nota: ${'★'.repeat(Math.floor(item.rating))} (${item.rating})`;
                document.getElementById('modalDetails').innerHTML = `<p><strong>Detalhes Adicionais:</strong> ${item.details}</p>`;
                modal.classList.add('show');
            }
        }
    });

    // Inicialização
    switchTab('all');
});