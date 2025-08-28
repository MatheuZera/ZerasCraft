document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM totalmente carregado e pronto!");

    // =====================================
    // Variáveis Globais de Áudio e Elementos
    // =====================================
    let hoverSound; // Será definido depois de carregar o som para cards
    let clickSound; // Será definido depois de carregar o som para botões
    let linkSound; // Será definido depois de carregar o som para links

    const backgroundAudio = document.getElementById('backgroundAudio');
    const audioEffects = {}; // Adicione aqui qualquer outro efeito que você carregar

    // Carregamento dos arquivos de áudio
    // Certifique-se de que estes caminhos estão corretos!
    hoverSound = new Audio('assets/audios/effects/select.mp3');
    clickSound = new Audio('assets/audios/effects/click.mp3');
    linkSound = new Audio('assets/audios/effects/link.mp3');
    // Adicione outros efeitos aqui se necessário, ex: audioEffects.success = new Audio('path/to/success.mp3');

    // Funções Auxiliares de Áudio
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

    // Variáveis (certifique-se de que estão definidas globalmente ou no escopo correto)
    let currentMusicIndex = -1; // Começa sem música selecionada
    let preparingNextMusic = false;
    let userInteractedWithAudio = localStorage.getItem('userInteractedWithAudio') === 'true'; // Inicializa do localStorage

    const musicPlaylist = [
        { title: '✨ Aerie (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Aerie.mp3' },
        { title: '✨ Comforting Memories (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Comforting.mp3' },
        { title: '✨ Creator (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Creator.mp3' },
        { title: '✨ Echoes of the Eye (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Echoes.mp3' },
        { title: '✨ Timber Hearth (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Timber.mp3' },
        { title: '✨ Travelers (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Travelers.mp3' },
        { title: '✨ The Universe (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/The.mp3' },
        { title: '✨ End Times (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/End.mp3' },
        { title: '✨ Space (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Space.mp3' },
        { title: '✨ River (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/River.mp3' },
        { title: '✨ Final Voyage (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Final.mp3' },
        { title: '✨ Deep (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Deep.mp3' },
        { title: '✨ Infinite Amethyst (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Infinite.mp3' },
        { title: '✨ Otherside (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Otherside.mp3' },
        { title: '✨ Relic (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Relic.mp3' }
    ];

    const audioControlButton = document.getElementById('audioControlButton');
    const musicTitleDisplay = document.getElementById('musicTitleDisplay');
    const audioProgressBar = document.getElementById('audioProgressBar');
    const currentTimeDisplay = document.getElementById('currentTimeDisplay');
    const durationDisplay = document.getElementById('durationDisplay');
    const audioNextButton = document.getElementById('audioNextButton');
    const audioPrevButton = document.getElementById('audioPrevButton');
    const playbackSpeedSelect = document.getElementById('playbackSpeed');


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

        if (specificIndex !== -1) {
            currentMusicIndex = specificIndex;
        } else {
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
            backgroundAudio.oncanplaythrough = null;
            saveAudioState();
        };
        backgroundAudio.onerror = (e) => {
            console.error(`Erro ao carregar áudio: ${music.src}`, e);
            showCentralMessage('Erro ao carregar música. Pulando...');
            preparingNextMusic = false;
            backgroundAudio.onerror = null;
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

                backgroundAudio.onloadedmetadata = () => {
                    if (backgroundAudio.duration > 0 && audioState.currentTime < backgroundAudio.duration) {
                        backgroundAudio.currentTime = audioState.currentTime;
                    }
                    updateProgressAndTimers();
                    if ((!audioState.paused && userInteractedWithAudio) || (!userInteractedWithAudio && audioState.paused === false)) {
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
                    loadNewMusic(true);
                };
            } else {
                loadNewMusic(true);
            }
        } else {
            userInteractedWithAudio = false;
            loadNewMusic(true);
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
                playMusic();
            } else {
                updateAudioButtonTitle();
            }
        }
    });

    // =====================================
    // 3. Sistema de Áudio de Fundo (Event Listeners Principais)
    // =====================================
    if (backgroundAudio) {
        restoreAudioState(); // CHAMADA PRINCIPAL PARA INICIALIZAR O ÁUDIO

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
            
            audioProgressBar.addEventListener('input', () => {
                const tempTime = (audioProgressBar.value / 100) * backgroundAudio.duration;
                currentTimeDisplay.textContent = formatTime(tempTime);
            });
            audioProgressBar.addEventListener('mousedown', () => {
                isDragging = true;
                audioProgressBar.dataset.isDragging = 'true';
                backgroundAudio.pause();
            });
            audioProgressBar.addEventListener('mouseup', () => {
                isDragging = false;
                audioProgressBar.dataset.isDragging = 'false';
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
                    const rect = audioProgressBar.getBoundingClientRect();
                    const x = e.touches[0].clientX - rect.left;
                    const width = rect.width;
                    let value = (x / width) * 100;
                    value = Math.max(0, Math.min(100, value));

                    audioProgressBar.value = value;
                    const tempTime = (value / 100) * backgroundAudio.duration;
                    currentTimeDisplay.textContent = formatTime(tempTime);
                    e.preventDefault();
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
    // 4. Sistema de Sons para Interações (Aprimorado e Corrigido)
    // =====================================

    // --- SONS DE HOVER (select.mp3) para Cards e Imagens Interativas ---
    // Inclui cards (ex: .card, .file-card, .event-card) e imagens de galeria que podem ter animação
    document.querySelectorAll(
        '.card, .file-card, .event-card, .gallery-item img, .review-card, .testimonial-card'
    ).forEach(element => {
        element.addEventListener('mouseenter', () => playEffectSound(hoverSound));
    });

    // --- SONS DE CLIQUE (select.mp3) para Cards e Imagens Interativas (se apropriado) ---
    // Usamos o mesmo som de select para clique em cards/imagens que podem abrir lightboxes, etc.
    document.querySelectorAll(
        '.card, .file-card, .event-card, .gallery-item img, .review-card, .testimonial-card'
    ).forEach(element => {
        element.addEventListener('click', () => playEffectSound(clickSound)); // Usando clickSound para cards
    });


    // --- SONS DE CLIQUE (link.mp3) para LINKS ---
    // Seleciona todas as tags <a> que não são âncoras internas (#) e não são "javascript:void(0)"
    // Isso inclui links estilizados como botões (ex: <a class="btn-primary">)
    document.querySelectorAll(
        'a:not([href^="#"]):not([href="javascript:void(0)"]), .main-nav a, .hero-social-links a.btn-primary, .pagination-link'
    ).forEach(element => {
        element.addEventListener('click', (event) => {
            playEffectSound(linkSound);

            // Para links externos, introduz um pequeno atraso para o som tocar antes de navegar
            if (element.tagName === 'A' && element.getAttribute('href') && !element.getAttribute('href').startsWith('#') && !element.getAttribute('href').startsWith('javascript:')) {
                event.preventDefault();
                setTimeout(() => {
                    window.location.href = element.href;
                }, 200); // Atraso de 200ms
            }
        });
    });

    // --- SONS DE CLIQUE (click.mp3) para BOTÕES e Controles de UI ---
    // Seleciona elementos <button> e outras divs/labels que funcionam como botões,
    // garantindo que não sejam confundidos com links.
    document.querySelectorAll(
        'button:not(.main-nav a):not(.hero-social-links a), .menu-toggle, .music-button, .copy-button, .accordion-header, .tab-button, .modal-close-btn, .lightbox-close, .carousel-button, #showSpinnerBtn, #toggleSkeletonBtn, #floatingActionButton, .custom-radio-btn, .close-alert, #acceptCookiesBtn, #declineCookiesBtn, #prevStepBtn, #nextStepBtn, #scrollTopButton, #update-progress-btn, .toggle-switch-container label, #notification-bell, .collapsible-header, #custom-select-trigger, .custom-select-option, #play-pause-btn, #mute-unmute-btn, #fullscreen-btn, #toggle-password-visibility, .copy-code-btn, #openNewsletterModalBtn, .fab-main-btn, .fab-sub-item, #audio-play-pause-btn, #audio-mute-unmute-btn, #back-to-top-btn'
    ).forEach(element => {
        element.addEventListener('click', () => playEffectSound(clickSound));
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
    // populateMobileNav(); // Popula o menu mobile na carga inicial - comentado para o HTML atual

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
        const firstTabPane = document.getElementById(firstTabButton.dataset.tab); // Alterado para data-tab
        if (firstTabButton) firstTabButton.classList.add('active');
        if (firstTabPane) firstTabPane.classList.add('active');


        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetId = button.dataset.tab; // Alterado para data-tab

                tabButtons.forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(pane => pane.classList.add('hidden')); // Esconde todos
                
                button.classList.add('active');
                document.getElementById(targetId).classList.remove('hidden'); // Mostra o target

                playEffectSound(clickSound);
            });
        });
    }


    // Modal (Aberto via botão no HTML)
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.querySelector('.modal .close-button'); // Atualizado para o seletor correto
    const modalOverlay = document.getElementById('myModal');

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
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const lightboxOverlay = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-img');
    const closeLightboxBtn = document.getElementById('close-lightbox');

    if (galleryItems.length > 0 && lightboxOverlay && lightboxImage && closeLightboxBtn) {
        galleryItems.forEach(img => {
            img.addEventListener('click', () => {
                lightboxImage.src = img.dataset.largeSrc || img.src;
                lightboxImage.alt = img.alt;
                lightboxOverlay.classList.add('opacity-100', 'visible');
                lightboxOverlay.classList.remove('opacity-0', 'invisible');
                playEffectSound(clickSound);
            });
        });

        closeLightboxBtn.addEventListener('click', () => {
            lightboxOverlay.classList.remove('opacity-100', 'visible');
            lightboxOverlay.classList.add('opacity-0', 'invisible');
            playEffectSound(clickSound);
        });

        lightboxOverlay.addEventListener('click', (e) => {
            if (e.target === lightboxOverlay) {
                lightboxOverlay.classList.remove('opacity-100', 'visible');
                lightboxOverlay.classList.add('opacity-0', 'invisible');
            }
        });
    }


    // Carrossel de Imagens
    const carouselContainer = document.querySelector('.image-carousel-container');
    if (carouselContainer) {
        const carouselTrack = document.querySelector('.image-carousel-track');
        const carouselSlides = Array.from(carouselTrack.children);
        const carouselNextBtn = carouselContainer.querySelector('.carousel-next');
        const carouselPrevBtn = carouselContainer.querySelector('.carousel-prev');
        const carouselDotsContainer = carouselContainer.querySelector('.carousel-dots');

        let currentSlideIndex = 0;
        let slideInterval; // Para o autoplay

        // Cria os pontos de navegação
        if (carouselDotsContainer) {
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
        }
        const carouselDots = carouselDotsContainer ? Array.from(carouselDotsContainer.children) : [];

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

        if (carouselNextBtn) {
            carouselNextBtn.addEventListener('click', () => {
                const nextIndex = (currentSlideIndex + 1) % carouselSlides.length;
                moveToSlide(nextIndex);
                resetAutoplay();
            });
        }

        if (carouselPrevBtn) {
            carouselPrevBtn.addEventListener('click', () => {
                const prevIndex = (currentSlideIndex - 1 + carouselSlides.length) % carouselSlides.length;
                moveToSlide(prevIndex);
                resetAutoplay();
            });
        }

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
    const imageCompareContainer = document.querySelector('.image-compare-container');
    if (imageCompareContainer) {
        const imageCompareSlider = imageCompareContainer.querySelector('.image-compare-slider');
        const imageAfter = imageCompareContainer.querySelector('.image-after');
        const imageCompareHandle = imageCompareContainer.querySelector('.image-compare-handle');

        if (imageCompareSlider && imageAfter && imageCompareHandle) {
            const updateSlider = () => {
                const sliderValue = imageCompareSlider.value;
                imageAfter.style.width = `${sliderValue}%`;
                imageCompareHandle.style.left = `${sliderValue}%`;
            };

            imageCompareSlider.addEventListener('input', updateSlider);
            updateSlider(); // Define a posição inicial
        }
    }


    // Toggle Spinner
    const loadingSpinner = document.querySelector('.loading-spinner'); // Seletor genérico
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
    const actualContent = document.querySelector('#skeletonContent .actual-content'); // Ajustado para ser filho de skeletonContent

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

    // Toggle Switch (Menu Mobile - já estava acima, este é o do HTML)
    const mobileMenuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const closeMobileMenuBtn = document.querySelector('#mobile-menu .close-menu');

    if (mobileMenuToggle && mobileMenu && mobileMenuOverlay && closeMobileMenuBtn) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.remove('translate-x-full');
            mobileMenuOverlay.classList.remove('hidden');
            document.body.classList.add('no-scroll');
            playEffectSound(clickSound);
        });

        closeMobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('translate-x-full');
            mobileMenuOverlay.classList.add('hidden');
            document.body.classList.remove('no-scroll');
            playEffectSound(clickSound);
        });

        mobileMenuOverlay.addEventListener('click', () => {
            mobileMenu.classList.add('translate-x-full');
            mobileMenuOverlay.classList.add('hidden');
            document.body.classList.remove('no-scroll');
        });

        document.querySelectorAll('#mobile-menu .mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                // Fecha o menu após clicar em um link
                mobileMenu.classList.add('translate-x-full');
                mobileMenuOverlay.classList.add('hidden');
                document.body.classList.remove('no-scroll');
                playEffectSound(linkSound); // Usa linkSound para links de navegação
            });
        });
    }

    // --- Componentes Adicionais (Reativados e Consertados) ---

    // Announcement Banner
    const announcementBanner = document.getElementById('announcement-banner');
    const closeBannerBtn = document.querySelector('.close-banner');

    if (announcementBanner && closeBannerBtn) {
        // Mostra o banner após um pequeno atraso para animação
        setTimeout(() => {
            announcementBanner.classList.remove('hidden-element'); // A classe "hidden-element" deve ser removida
            // Se você quiser que ele deslize de cima, adicione/remova classes de CSS para isso
        }, 1000);

        closeBannerBtn.addEventListener('click', () => {
            announcementBanner.style.maxHeight = '0';
            announcementBanner.style.opacity = '0';
            announcementBanner.style.paddingTop = '0';
            announcementBanner.style.paddingBottom = '0';
            setTimeout(() => {
                announcementBanner.remove(); // Remove completamente após a transição
            }, 500);
            playEffectSound(clickSound);
        });
    }

    // Tooltips
    const tooltipTriggers = document.querySelectorAll('.tooltip-trigger');
    const tooltipTriggerIcons = document.querySelectorAll('.tooltip-trigger-icon');

    tooltipTriggers.forEach(trigger => {
        const tooltipText = trigger.nextElementSibling;
        if (tooltipText && tooltipText.classList.contains('tooltip-text')) {
            trigger.addEventListener('mouseenter', () => {
                tooltipText.classList.add('show');
            });
            trigger.addEventListener('mouseleave', () => {
                tooltipText.classList.remove('show');
            });
        }
    });

    tooltipTriggerIcons.forEach(icon => {
        const tooltipText = icon.nextElementSibling;
        if (tooltipText && tooltipText.classList.contains('tooltip-text')) {
            icon.addEventListener('mouseenter', () => {
                tooltipText.classList.add('show');
            });
            icon.addEventListener('mouseleave', () => {
                tooltipText.classList.remove('show');
            });
        }
    });

    // Custom Radio Buttons (já no HTML)
    document.querySelectorAll('.custom-radio-btn input').forEach(radio => {
        radio.addEventListener('change', () => {
            console.log(`Opção de rádio selecionada: ${radio.value}`);
            playEffectSound(clickSound);
        });
    });

    // Custom Checkboxes
    document.querySelectorAll('.custom-checkbox-btn input').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            console.log(`Checkbox ${checkbox.id} ${checkbox.checked ? 'marcada' : 'desmarcada'}`);
            playEffectSound(clickSound);
        });
    });

    // Custom Range Slider
    const volumeSlider = document.getElementById('volume-slider');
    const volumeValueSpan = document.getElementById('volume-value');

    if (volumeSlider && volumeValueSpan) {
        volumeSlider.addEventListener('input', () => {
            volumeValueSpan.textContent = `${volumeSlider.value}%`;
            // Implementar a lógica de controle de volume aqui, se houver um player de áudio
        });
    }

    // Linear Progress Bar
    const updateProgressBtn = document.getElementById('update-progress-btn');
    const linearProgressBarFill = document.querySelector('.linear-progress-fill');
    const linearProgressText = document.querySelector('.linear-progress-bar span');

    if (updateProgressBtn && linearProgressBarFill && linearProgressText) {
        updateProgressBtn.addEventListener('click', () => {
            let currentWidth = parseInt(linearProgressBarFill.style.width) || 0;
            let newWidth = (currentWidth + 20) % 120; // Incrementa de 20%, reinicia em 0 após 100%
            if (newWidth === 0) newWidth = 20; // Garante que não vá para 0%
            
            linearProgressBarFill.style.width = `${newWidth}%`;
            linearProgressText.textContent = `${newWidth}% Concluído`;
            playEffectSound(clickSound);
        });
    }

    // Star Rating
    const starRatingContainer = document.getElementById('star-rating');
    const ratingText = document.getElementById('rating-text');
    let currentRating = 0;

    if (starRatingContainer && ratingText) {
        const stars = starRatingContainer.querySelectorAll('i');

        const updateStarRating = (rating) => {
            stars.forEach(star => {
                const starValue = parseInt(star.dataset.value);
                if (starValue <= rating) {
                    star.classList.remove('far');
                    star.classList.add('fas');
                    star.classList.add('text-yellow-400'); // Cor para estrela cheia
                } else {
                    star.classList.remove('fas');
                    star.classList.remove('text-yellow-400');
                    star.classList.add('far');
                }
            });
            ratingText.textContent = rating === 0 ? 'Nenhuma avaliação.' : `Você avaliou com ${rating} estrelas.`;
        };

        stars.forEach(star => {
            star.addEventListener('click', () => {
                currentRating = parseInt(star.dataset.value);
                updateStarRating(currentRating);
                playEffectSound(clickSound);
            });

            star.addEventListener('mouseenter', () => {
                const hoverValue = parseInt(star.dataset.value);
                updateStarRating(hoverValue); // Mostra a classificação no hover
            });

            star.addEventListener('mouseleave', () => {
                updateStarRating(currentRating); // Retorna à classificação atual
            });
        });

        updateStarRating(currentRating); // Inicializa a exibição
    }

    // Notification Bell
    const notificationBell = document.getElementById('notification-bell');
    const notificationCount = document.getElementById('notification-count');
    let unreadNotifications = parseInt(notificationCount?.textContent) || 0;

    if (notificationBell && notificationCount) {
        notificationBell.addEventListener('click', () => {
            showCentralMessage(`Você tem ${unreadNotifications} notificações não lidas.`);
            // Implementar lógica para abrir/fechar painel de notificações
            unreadNotifications = 0; // Zera as notificações ao clicar
            notificationCount.textContent = unreadNotifications;
            notificationCount.classList.toggle('hidden', unreadNotifications === 0);
            playEffectSound(clickSound);
        });

        // Esconde o contador se não houver notificações
        notificationCount.classList.toggle('hidden', unreadNotifications === 0);
    }

    // Collapsible Section
    document.querySelectorAll('.collapsible-header').forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            header.classList.toggle('active');
            content.classList.toggle('hidden-content');
            if (!content.classList.contains('hidden-content')) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = null;
            }
            playEffectSound(clickSound);
        });
    });

    // Tabbed Content
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
            const targetTab = document.getElementById(button.dataset.tab);
            if (targetTab) {
                targetTab.classList.remove('hidden');
            }
            playEffectSound(clickSound);
        });
    });
    // Ativar a primeira aba por padrão
    const initialTabButton = document.querySelector('.tab-button.active');
    if (initialTabButton) {
        const initialTabContent = document.getElementById(initialTabButton.dataset.tab);
        if (initialTabContent) {
            initialTabContent.classList.remove('hidden');
        }
    } else {
        const firstTab = document.querySelector('.tab-button');
        if (firstTab) {
            firstTab.classList.add('active');
            const firstTabContent = document.getElementById(firstTab.dataset.tab);
            if (firstTabContent) {
                firstTabContent.classList.remove('hidden');
            }
        }
    }

    // Custom Select Dropdown
    const customSelectTrigger = document.getElementById('custom-select-trigger');
    const customSelectOptions = document.getElementById('custom-select-options');

    if (customSelectTrigger && customSelectOptions) {
        customSelectTrigger.addEventListener('click', () => {
            customSelectOptions.classList.toggle('hidden-element');
            customSelectTrigger.querySelector('i').classList.toggle('rotate-180');
            playEffectSound(clickSound);
        });

        document.querySelectorAll('.custom-select-option').forEach(option => {
            option.addEventListener('click', () => {
                customSelectTrigger.querySelector('span').textContent = option.textContent;
                customSelectOptions.classList.add('hidden-element');
                customSelectTrigger.querySelector('i').classList.remove('rotate-180');
                showCentralMessage(`Selecionado: ${option.textContent}`);
                playEffectSound(clickSound);
            });
        });

        document.addEventListener('click', (e) => {
            if (!customSelectTrigger.contains(e.target) && !customSelectOptions.contains(e.target)) {
                customSelectOptions.classList.add('hidden-element');
                customSelectTrigger.querySelector('i').classList.remove('rotate-180');
            }
        });
    }

    // Copy to Clipboard Button
    const copyTextInput = document.getElementById('copy-text-input');
    const copyButton = document.getElementById('copy-button');
    const copyFeedback = document.getElementById('copy-feedback');

    if (copyButton && copyTextInput && copyFeedback) {
        copyButton.addEventListener('click', async () => {
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(copyTextInput.value);
                } else {
                    const textArea = document.createElement("textarea");
                    textArea.value = copyTextInput.value;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                }
                copyFeedback.classList.remove('hidden-element');
                setTimeout(() => {
                    copyFeedback.classList.add('hidden-element');
                }, 2000);
            } catch (err) {
                console.error('Erro ao copiar: ', err);
                copyFeedback.textContent = 'Falha ao copiar!';
                copyFeedback.classList.remove('hidden-element');
                copyFeedback.classList.add('text-red-500');
                setTimeout(() => {
                    copyFeedback.classList.add('hidden-element');
                    copyFeedback.classList.remove('text-red-500');
                    copyFeedback.textContent = 'Copiado!'; // Reset message
                }, 2000);
            }
            playEffectSound(clickSound);
        });
    }

    // Social Share Buttons (apenas placeholder de função)
    document.querySelectorAll('.social-share-buttons a').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const platform = button.querySelector('i').classList[1].replace('fa-', '');
            showCentralMessage(`Compartilhar no ${platform.charAt(0).toUpperCase() + platform.slice(1)}...`);
            playEffectSound(clickSound);
            // Lógica real de compartilhamento aqui
        });
    });

    // HTML5 Video Player with Custom Controls
    const customVideoPlayer = document.getElementById('custom-video-player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const muteUnmuteBtn = document.getElementById('mute-unmute-btn');
    const volumeRange = document.getElementById('volume-range');
    const currentTimeSpan = document.getElementById('current-time');
    const durationSpan = document.getElementById('duration');
    const fullscreenBtn = document.getElementById('fullscreen-btn');

    if (customVideoPlayer && playPauseBtn && muteUnmuteBtn && volumeRange && currentTimeSpan && durationSpan && fullscreenBtn) {
        playPauseBtn.addEventListener('click', () => {
            if (customVideoPlayer.paused) {
                customVideoPlayer.play();
                playPauseBtn.querySelector('i').classList.replace('fa-play', 'fa-pause');
            } else {
                customVideoPlayer.pause();
                playPauseBtn.querySelector('i').classList.replace('fa-pause', 'fa-play');
            }
            playEffectSound(clickSound);
        });

        muteUnmuteBtn.addEventListener('click', () => {
            customVideoPlayer.muted = !customVideoPlayer.muted;
            muteUnmuteBtn.querySelector('i').classList.replace(
                customVideoPlayer.muted ? 'fa-volume-up' : 'fa-volume-mute',
                customVideoPlayer.muted ? 'fa-volume-mute' : 'fa-volume-up'
            );
            playEffectSound(clickSound);
        });

        volumeRange.addEventListener('input', () => {
            customVideoPlayer.volume = volumeRange.value;
            if (customVideoPlayer.volume === 0) {
                muteUnmuteBtn.querySelector('i').classList.replace('fa-volume-up', 'fa-volume-mute');
                customVideoPlayer.muted = true;
            } else {
                muteUnmuteBtn.querySelector('i').classList.replace('fa-volume-mute', 'fa-volume-up');
                customVideoPlayer.muted = false;
            }
        });

        customVideoPlayer.addEventListener('timeupdate', () => {
            currentTimeSpan.textContent = formatTime(customVideoPlayer.currentTime);
            // Atualiza a barra de progresso do vídeo, se houver
        });

        customVideoPlayer.addEventListener('loadedmetadata', () => {
            durationSpan.textContent = formatTime(customVideoPlayer.duration);
            volumeRange.value = customVideoPlayer.volume; // Sincroniza o slider com o volume
        });

        fullscreenBtn.addEventListener('click', () => {
            if (customVideoPlayer.requestFullscreen) {
                customVideoPlayer.requestFullscreen();
            } else if (customVideoPlayer.webkitRequestFullscreen) { /* Safari */
                customVideoPlayer.webkitRequestFullscreen();
            } else if (customVideoPlayer.mozRequestFullScreen) { /* Firefox */
                customVideoPlayer.mozRequestFullScreen();
            } else if (customVideoPlayer.msRequestFullscreen) { /* IE/Edge */
                customVideoPlayer.msRequestFullscreen();
            }
            playEffectSound(clickSound);
        });
    }

    // Draggable Card Component
    const draggableCard = document.getElementById('draggable-card');
    if (draggableCard) {
        let isDragging = false;
        let offsetX, offsetY;

        draggableCard.addEventListener('mousedown', (e) => {
            isDragging = true;
            draggableCard.classList.add('active');
            offsetX = e.clientX - draggableCard.getBoundingClientRect().left;
            offsetY = e.clientY - draggableCard.getBoundingClientRect().top;
            playEffectSound(clickSound);
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            draggableCard.style.left = `${x}px`;
            draggableCard.style.top = `${y}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            draggableCard.classList.remove('active');
        });

        // Touch events for mobile
        draggableCard.addEventListener('touchstart', (e) => {
            isDragging = true;
            draggableCard.classList.add('active');
            const touch = e.touches[0];
            offsetX = touch.clientX - draggableCard.getBoundingClientRect().left;
            offsetY = touch.clientY - draggableCard.getBoundingClientRect().top;
            e.preventDefault(); // Prevent scrolling
            playEffectSound(clickSound);
        });

        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const touch = e.touches[0];
            const x = touch.clientX - offsetX;
            const y = touch.clientY - offsetY;
            draggableCard.style.left = `${x}px`;
            draggableCard.style.top = `${y}px`;
            e.preventDefault(); // Prevent scrolling
        });

        document.addEventListener('touchend', () => {
            isDragging = false;
            draggableCard.classList.remove('active');
        });
    }

    // Countdown Timer (Próximo Evento)
    const countdownTimerElement = document.getElementById('countdown-timer');
    if (countdownTimerElement) {
        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');

        // Defina a data do próximo evento aqui (ex: 1º de Janeiro do próximo ano)
        const nextEventDate = new Date();
        nextEventDate.setFullYear(nextEventDate.getFullYear() + 1); // Exemplo: próximo ano
        nextEventDate.setMonth(0); // Janeiro
        nextEventDate.setDate(1); // Dia 1
        nextEventDate.setHours(0, 0, 0, 0); // Meia-noite

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = nextEventDate - now;

            if (distance < 0) {
                countdownTimerElement.textContent = "EVENTO AO VIVO!";
                clearInterval(countdownInterval);
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            daysElement.textContent = String(days).padStart(2, '0');
            hoursElement.textContent = String(hours).padStart(2, '0');
            minutesElement.textContent = String(minutes).padStart(2, '0');
            secondsElement.textContent = String(seconds).padStart(2, '0');
        };

        const countdownInterval = setInterval(updateCountdown, 1000);
        updateCountdown(); // Chama uma vez para exibir imediatamente
    }

    // Input com Live Character Count
    const charCountTextarea = document.getElementById('char-count-textarea');
    const charCountSpan = document.getElementById('char-count');
    const maxLength = 200; // Defina o limite de caracteres

    if (charCountTextarea && charCountSpan) {
        charCountTextarea.addEventListener('input', () => {
            const currentLength = charCountTextarea.value.length;
            charCountSpan.textContent = currentLength;
            if (currentLength > maxLength) {
                charCountSpan.style.color = 'red';
            } else {
                charCountSpan.style.color = ''; // Reseta para a cor padrão
            }
            // Opcional: truncar o texto se exceder o limite
            // charCountTextarea.value = charCountTextarea.value.substring(0, maxLength);
        });
    }

    // Styled File Input
    const customFileUpload = document.getElementById('custom-file-upload');
    const fileNameSpan = document.getElementById('file-name');

    if (customFileUpload && fileNameSpan) {
        customFileUpload.addEventListener('change', () => {
            if (customFileUpload.files.length > 0) {
                fileNameSpan.textContent = customFileUpload.files[0].name;
                showCentralMessage(`Arquivo selecionado: ${customFileUpload.files[0].name}`);
            } else {
                fileNameSpan.textContent = 'Nenhum arquivo selecionado';
            }
        });
    }

    // Password Visibility Toggle
    const passwordInput = document.getElementById('password-input');
    const togglePasswordVisibilityBtn = document.getElementById('toggle-password-visibility');

    if (passwordInput && togglePasswordVisibilityBtn) {
        togglePasswordVisibilityBtn.addEventListener('click', () => {
            const icon = togglePasswordVisibilityBtn.querySelector('i');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
            playEffectSound(clickSound);
        });
    }

    // Multi-Step Form Indicator
    const nextStepBtn = document.getElementById('next-step-btn');
    const prevStepBtn = document.getElementById('prevStepBtn'); // Adicionei o ID se não estiver no HTML
    const stepItems = document.querySelectorAll('.multi-step-indicator .step-item');
    let currentStep = 1;

    const updateMultiStepUI = () => {
        stepItems.forEach(item => {
            const step = parseInt(item.dataset.step);
            const circle = item.querySelector('.step-circle');
            const label = item.querySelector('.step-label');
            
            if (step < currentStep) {
                circle.classList.add('bg-green-500', 'text-white');
                circle.classList.remove('bg-gray-700', 'text-gray-400');
                label.classList.add('text-green-400');
                label.classList.remove('text-gray-400');
            } else if (step === currentStep) {
                circle.classList.add('bg-green-500', 'text-white');
                circle.classList.remove('bg-gray-700', 'text-gray-400');
                label.classList.add('text-green-400');
                label.classList.remove('text-gray-400');
            } else {
                circle.classList.remove('bg-green-500', 'text-white');
                circle.classList.add('bg-gray-700', 'text-gray-400');
                label.classList.remove('text-green-400');
                label.classList.add('text-gray-400');
            }
        });
        // Atualiza a linha entre os passos
        const stepLines = document.querySelectorAll('.multi-step-indicator .step-line');
        stepLines.forEach((line, index) => {
            if (index < currentStep - 1) {
                line.classList.remove('bg-gray-700');
                line.classList.add('bg-green-500');
            } else {
                line.classList.remove('bg-green-500');
                line.classList.add('bg-gray-700');
            }
        });
        
        // Desabilita/habilita botões
        if (prevStepBtn) prevStepBtn.disabled = currentStep === 1;
        if (nextStepBtn) nextStepBtn.disabled = currentStep === stepItems.length;
    };

    if (nextStepBtn) {
        nextStepBtn.addEventListener('click', () => {
            if (currentStep < stepItems.length) {
                currentStep++;
                updateMultiStepUI();
                playEffectSound(clickSound);
            }
        });
    }
    if (prevStepBtn) { // Certifique-se de que este botão existe no HTML
        prevStepBtn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                updateMultiStepUI();
                playEffectSound(clickSound);
            }
        });
    }
    updateMultiStepUI(); // Inicializa a UI do formulário multi-etapas

    // Code Block with Copy
    const copyCodeBtn = document.querySelector('.copy-code-btn');
    const codeSnippet = document.getElementById('code-snippet');
    const copyCodeFeedback = document.querySelector('.copy-feedback-code');

    if (copyCodeBtn && codeSnippet && copyCodeFeedback) {
        copyCodeBtn.addEventListener('click', async () => {
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(codeSnippet.textContent.trim());
                } else {
                    const textArea = document.createElement("textarea");
                    textArea.value = codeSnippet.textContent.trim();
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                }
                copyCodeFeedback.classList.remove('hidden-element');
                setTimeout(() => {
                    copyCodeFeedback.classList.add('hidden-element');
                }, 2000);
            } catch (err) {
                console.error('Erro ao copiar código: ', err);
                copyCodeFeedback.textContent = 'Falha ao copiar!';
                copyCodeFeedback.classList.remove('hidden-element');
                copyCodeFeedback.classList.add('text-red-500');
                setTimeout(() => {
                    copyCodeFeedback.classList.add('hidden-element');
                    copyCodeFeedback.classList.remove('text-red-500');
                    copyCodeFeedback.textContent = 'Copiado!'; // Reset message
                }, 2000);
            }
            playEffectSound(clickSound);
        });
    }

    // Contact Form (apenas feedback de submissão simulado)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            showCentralMessage('Mensagem enviada com sucesso!');
            contactForm.reset(); // Limpa o formulário
            playEffectSound(clickSound);
        });
    }

    // Newsletter Signup Modal
    const openNewsletterModalBtn = document.getElementById('openNewsletterModalBtn');
    const newsletterModal = document.getElementById('newsletter-modal');
    const closeNewsletterModalBtn = newsletterModal ? newsletterModal.querySelector('.close-button') : null;
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterFeedback = document.getElementById('newsletter-feedback');

    if (openNewsletterModalBtn && newsletterModal && closeNewsletterModalBtn && newsletterForm && newsletterFeedback) {
        openNewsletterModalBtn.addEventListener('click', () => {
            newsletterModal.classList.add('active');
            playEffectSound(clickSound);
        });

        closeNewsletterModalBtn.addEventListener('click', () => {
            newsletterModal.classList.remove('active');
            playEffectSound(clickSound);
        });

        newsletterModal.addEventListener('click', (e) => {
            if (e.target === newsletterModal) {
                newsletterModal.classList.remove('active');
            }
        });

        newsletterForm.addEventListener('submit', (event) => {
            event.preventDefault();
            newsletterFeedback.classList.remove('hidden-element');
            newsletterForm.reset();
            setTimeout(() => {
                newsletterFeedback.classList.add('hidden-element');
                newsletterModal.classList.remove('active');
            }, 2000);
            showCentralMessage('Assinatura da Newsletter confirmada!');
            playEffectSound(clickSound);
        });
    }

    // Drag & Drop File Upload Zone
    const dropZone = document.getElementById('drop-zone');
    const dropZoneFileInput = document.getElementById('drop-zone-file-input');
    const fileList = document.getElementById('file-list');

    if (dropZone && dropZoneFileInput && fileList) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false); // Previne default para toda a página
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.add('hover'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.remove('hover'), false);
        });

        dropZone.addEventListener('drop', handleDrop, false);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles(files);
        }

        dropZone.addEventListener('click', () => {
            dropZoneFileInput.click();
            playEffectSound(clickSound);
        });

        dropZoneFileInput.addEventListener('change', (e) => {
            handleFiles(e.target.files);
        });

        function handleFiles(files) {
            fileList.innerHTML = ''; // Limpa a lista anterior
            if (files.length > 0) {
                for (const file of files) {
                    const listItem = document.createElement('p');
                    listItem.textContent = `Arquivo: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
                    fileList.appendChild(listItem);
                    showCentralMessage(`Arquivo '${file.name}' adicionado!`);
                }
            } else {
                fileList.textContent = 'Nenhum arquivo selecionado.';
            }
        }
    }


    // Floating Action Button (FAB)
    const fabMainBtn = document.getElementById('fab-main-btn');
    const fabSubMenu = document.getElementById('fab-sub-menu');

    if (fabMainBtn && fabSubMenu) {
        fabMainBtn.addEventListener('click', () => {
            fabSubMenu.classList.toggle('hidden-element');
            fabMainBtn.querySelector('i').classList.toggle('fa-plus');
            fabMainBtn.querySelector('i').classList.toggle('fa-times'); // Alterna entre + e X
            playEffectSound(clickSound);
        });

        document.querySelectorAll('.fab-sub-item').forEach(item => {
            item.addEventListener('click', () => {
                const action = item.dataset.action;
                showCentralMessage(`Ação FAB: ${action.charAt(0).toUpperCase() + action.slice(1)}`);
                fabSubMenu.classList.add('hidden-element'); // Fecha o menu
                fabMainBtn.querySelector('i').classList.remove('fa-times');
                fabMainBtn.querySelector('i').classList.add('fa-plus');
                playEffectSound(clickSound);
            });
        });

        // Fecha o FAB se clicar fora
        document.addEventListener('click', (e) => {
            if (!fabMainBtn.contains(e.target) && !fabSubMenu.contains(e.target) && !fabSubMenu.classList.contains('hidden-element')) {
                fabSubMenu.classList.add('hidden-element');
                fabMainBtn.querySelector('i').classList.remove('fa-times');
                fabMainBtn.querySelector('i').classList.add('fa-plus');
            }
        });
    }

    // Fundo de Áudio Fixo (Player na parte inferior)
    const audioPlayer = document.getElementById('audio-player');
    const audioPlayPauseBtn = document.getElementById('audio-play-pause-btn');
    const audioProgressFill = document.getElementById('audio-progress-fill');
    const audioProgressHandle = document.getElementById('audio-progress-handle');
    const audioCurrentTime = document.getElementById('audio-current-time');
    const audioDuration = document.getElementById('audio-duration');
    const audioMuteUnmuteBtn = document.getElementById('audio-mute-unmute-btn');
    const audioVolumeSlider = document.getElementById('audio-volume-slider');

    // Playlist de exemplo para o player fixo
    const fixedAudioPlaylist = [
        { title: 'Melodia da Floresta', src: 'assets/audios/musics/background/Aerie.mp3' },
        { title: 'Sons da Caverna', src: 'assets/audios/effects/click.mp3' } // Usando click.mp3 como exemplo, substitua por música
    ];
    let currentFixedAudioIndex = 0;
    let isDraggingFixedAudio = false;

    if (audioPlayer && audioPlayPauseBtn && audioProgressFill && audioProgressHandle && audioCurrentTime && audioDuration && audioMuteUnmuteBtn && audioVolumeSlider) {

        // Carregar primeira música
        const loadFixedAudio = (index) => {
            if (fixedAudioPlaylist[index]) {
                audioPlayer.src = fixedAudioPlaylist[index].src;
                audioPlayer.load();
                audioPlayer.onloadedmetadata = () => {
                    audioDuration.textContent = formatTime(audioPlayer.duration);
                    audioPlayer.currentTime = 0; // Reinicia a cada nova música
                    audioProgressFill.style.width = '0%';
                    audioProgressHandle.style.left = '0%';
                };
            }
        };

        loadFixedAudio(currentFixedAudioIndex);

        audioPlayPauseBtn.addEventListener('click', () => {
            if (audioPlayer.paused) {
                audioPlayer.play().catch(e => console.error("Erro ao tocar áudio fixo:", e));
                audioPlayPauseBtn.querySelector('i').classList.replace('fa-play', 'fa-pause');
            } else {
                audioPlayer.pause();
                audioPlayPauseBtn.querySelector('i').classList.replace('fa-pause', 'fa-play');
            }
            playEffectSound(clickSound);
        });

        audioMuteUnmuteBtn.addEventListener('click', () => {
            audioPlayer.muted = !audioPlayer.muted;
            audioMuteUnmuteBtn.querySelector('i').classList.replace(
                audioPlayer.muted ? 'fa-volume-up' : 'fa-volume-mute',
                audioPlayer.muted ? 'fa-volume-mute' : 'fa-volume-up'
            );
            playEffectSound(clickSound);
        });

        audioVolumeSlider.addEventListener('input', () => {
            audioPlayer.volume = audioVolumeSlider.value;
            if (audioPlayer.volume === 0) {
                audioMuteUnmuteBtn.querySelector('i').classList.replace('fa-volume-up', 'fa-volume-mute');
                audioPlayer.muted = true;
            } else {
                audioMuteUnmuteBtn.querySelector('i').classList.replace('fa-volume-mute', 'fa-volume-up');
                audioPlayer.muted = false;
            }
        });

        audioPlayer.addEventListener('timeupdate', () => {
            if (!isDraggingFixedAudio && audioPlayer.duration) {
                const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
                audioProgressFill.style.width = `${progress}%`;
                audioProgressHandle.style.left = `${progress}%`;
                audioCurrentTime.textContent = formatTime(audioPlayer.currentTime);
            }
        });

        audioPlayer.addEventListener('ended', () => {
            currentFixedAudioIndex = (currentFixedAudioIndex + 1) % fixedAudioPlaylist.length;
            loadFixedAudio(currentFixedAudioIndex);
            audioPlayer.play().catch(e => console.error("Erro ao tocar próxima música:", e));
        });

        // Eventos para arrastar a barra de progresso do player fixo
        audioProgressFill.parentElement.addEventListener('mousedown', (e) => {
            isDraggingFixedAudio = true;
            audioPlayer.pause();
            updateFixedAudioProgress(e);
        });
        document.addEventListener('mousemove', (e) => {
            if (isDraggingFixedAudio) {
                updateFixedAudioProgress(e);
            }
        });
        document.addEventListener('mouseup', () => {
            if (isDraggingFixedAudio) {
                isDraggingFixedAudio = false;
                audioPlayer.play().catch(e => console.error("Erro ao retomar áudio fixo:", e));
            }
        });

        // Touch events para a barra de progresso do player fixo
        audioProgressFill.parentElement.addEventListener('touchstart', (e) => {
            isDraggingFixedAudio = true;
            audioPlayer.pause();
            updateFixedAudioProgress(e.touches[0]);
            e.preventDefault();
        });
        document.addEventListener('touchmove', (e) => {
            if (isDraggingFixedAudio) {
                updateFixedAudioProgress(e.touches[0]);
                e.preventDefault();
            }
        });
        document.addEventListener('touchend', () => {
            if (isDraggingFixedAudio) {
                isDraggingFixedAudio = false;
                audioPlayer.play().catch(e => console.error("Erro ao retomar áudio fixo:", e));
            }
        });

        const updateFixedAudioProgress = (e) => {
            const rect = audioProgressFill.parentElement.getBoundingClientRect();
            let x = e.clientX || e.touches[0].clientX;
            let percent = ((x - rect.left) / rect.width) * 100;
            percent = Math.max(0, Math.min(100, percent)); // Limita entre 0 e 100

            audioProgressFill.style.width = `${percent}%`;
            audioProgressHandle.style.left = `${percent}%`;

            const seekTime = (percent / 100) * audioPlayer.duration;
            if (!isNaN(seekTime) && isFinite(seekTime)) {
                audioPlayer.currentTime = seekTime;
                audioCurrentTime.textContent = formatTime(seekTime);
            }
        };
    }

    // Botão Voltar ao Topo
    const backToTopBtn = document.getElementById('back-to-top-btn');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Mostra após rolar 300px
                backToTopBtn.classList.add('opacity-100', 'visible');
                backToTopBtn.classList.remove('opacity-0', 'invisible');
            } else {
                backToTopBtn.classList.remove('opacity-100', 'visible');
                backToTopBtn.classList.add('opacity-0', 'invisible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            playEffectSound(clickSound);
        });
    }

    // Atualização do Ano no Rodapé (Se houver um elemento com id="currentYear")
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});

// A função playEffectSound precisa estar acessível globalmente se for chamada fora do DOMContentLoaded
// ou certifique-se de que todas as chamadas estejam dentro do DOMContentLoaded.
// Mantenho-a aqui para demonstrar o carregamento dos áudios.
function playEffectSound(sound) {
    if (sound) {
        sound.currentTime = 0; // Reinicia o áudio para que ele possa ser tocado rapidamente
        sound.play().catch(e => console.error("Erro ao tocar áudio:", e));
    }
}
