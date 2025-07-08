// script.js - Lógica de interatividade para o site Mundo Zera's Craft

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM totalmente carregado e pronto!");

    // ... (Mantenha todas as suas variáveis globais e inicialização de áudio como estão, incluindo hoverSound e clickSound) ...
    let hoverSound;
    let clickSound;
    const backgroundAudio = document.getElementById('backgroundAudio');
    let preparingNextMusic = false;
    const audioEffects = {};

    const initializeAudioEffect = (name, path, volume = 0.5) => {
        const audio = new Audio(path);
        audio.preload = 'auto';
        audio.volume = volume;
        audioEffects[name] = audio;
        console.log(`[Áudio] Efeito '${name}' carregado de: ${path}`);
        return audio;
    };

    hoverSound = initializeAudioEffect('select', 'audios/effects/select.mp3', 0.3);
    clickSound = initializeAudioEffect('click', 'audios/effects/click.mp3', 0.7);

    const playEffectSoundInternal = (audioElement) => {
        if (audioElement) {
            const clonedAudio = audioElement.cloneNode();
            clonedAudio.volume = audioElement.volume;
            clonedAudio.play().catch(e => console.warn("Erro ao tentar tocar som:", e.message));
        } else {
            console.warn("[Áudio] Tentativa de tocar efeito sonoro nulo ou indefinido.");
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
            centralMessageElement.style.opacity = '1';
            centralMessageElement.style.transform = 'translateY(0)';
            setTimeout(() => {
                centralMessageElement.style.opacity = '0';
                centralMessageElement.style.transform = 'translateY(-20px)';
            }, 3000);
        } else {
            console.log(`[Mensagem Central] ${message}`);
        }
    }


    // =====================================
    // 1. Menu Hambúrguer para Responsividade (Seu código existente)
    // =====================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            playEffectSound(clickSound);
        });

        document.querySelectorAll('.nav-menu a').forEach(item => {
            item.addEventListener('click', (event) => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                playEffectSound(clickSound);
            });
        });
    } else {
        console.warn("Elementos do menu hambúrguer não encontrados. Verifique as classes 'menu-toggle' e 'nav-menu'.");
    }

    // =====================================
    // Nova Função para Lidar com a Animação de Botões Pós-Execução (Seu código existente)
    // =====================================
    const handleButtonClickAnimation = (buttonElement, delayBeforeAnimate = 0) => {
        setTimeout(() => {
            buttonElement.classList.add('btn-animating-out');
            const animationDuration = 500;

            setTimeout(() => {
                buttonElement.style.display = 'none';
                console.log("Botão animado e escondido/removido.");
            }, animationDuration);
        }, delayBeforeAnimate);
    };


    // =====================================
    // 2. Funcionalidade de Copiar Texto (Seu código existente)
    // =====================================
    const copyButtons = document.querySelectorAll('.copy-button');

    if (copyButtons.length > 0) {
        copyButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
                playEffectSound(clickSound);

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
                        } else {
                            console.warn(`[Copiar] Elemento alvo '${selector}' não encontrado no contexto.`, parentContext);
                        }
                    }
                    if (selectors.includes('#serverIp') && selectors.includes('#serverPort') && partsToCopy.length === 2) {
                        textToCopy = `${partsToCopy[0]}:${partsToCopy[1]}`;
                    } else {
                        textToCopy = partsToCopy.join('');
                    }

                } else if (button.dataset.copyText) {
                    textToCopy = button.dataset.copyText;
                } else {
                    const accessCard = button.closest('.access-card');
                    if (accessCard) {
                        const ipElement = accessCard.querySelector('.ip');
                        const portElement = accessCard.querySelector('.port');
                        if (ipElement) {
                            textToCopy += ipElement.textContent.trim();
                        }
                        if (portElement) {
                            if (textToCopy) textToCopy += ':';
                            textToCopy += portElement.textContent.trim();
                        }
                    } else {
                        console.warn("Botão de cópia encontrado sem 'data-copy-target' ou 'data-copy-text', e não em um contexto .access-card/.access-info para fallback.");
                    }
                }

                if (textToCopy) {
                    try {
                        await navigator.clipboard.writeText(textToCopy);
                        console.log('Texto copiado: ' + textToCopy);
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
                    console.warn("Nenhum texto válido para copiar encontrado.");
                    showCentralMessage('Nada para copiar.');
                }
            });
        });
    } else {
        console.warn("Nenhum botão de cópia encontrado. Verifique a classe 'copy-button'.");
    }

    // =====================================
    // 3. Sistema de Áudio de Fundo - Com Reprodução Aleatória (Completado e Atualizado)
    // =====================================
    const audioControlButton = document.getElementById('audioControlButton');
    const musicTitleDisplay = document.getElementById('musicTitleDisplay');
    const audioProgressArc = document.getElementById('audioProgressArc');
    const arcProgress = audioProgressArc ? audioProgressArc.querySelector('.arc-progress') : null;

    // A playlist agora com os nomes dos arquivos da sua pasta 'musics'
    const musicPlaylist = [
        { title: 'Aria-Math-Lofi-Remastered', src: 'audios/musics/Aria-Math-Lofi-Remake.mp3' },
        { title: 'Aria-Math', src: 'audios/musics/Aria-Math.mp3' },
        { title: 'Beginning 2', src: 'audios/musics/Beginning 2.mp3' },
        { title: 'Biome-Fest', src: 'audios/musics/Biome-Fest.mp3' },
        { title: 'Blind-Spots', src: 'audios/musics/Blind-Spots.mp3' },
        { title: 'Clark', src: 'audios/musics/Clark.mp3' },
        { title: 'Danny', src: 'audios/musics/Danny.mp3' },
        { title: 'Draiton', src: 'audios/musics/Dreiton.mp3' },
        { title: 'Dry-Hands', src: 'audios/musics/Dry-Hands.mp3' },
        { title: 'Floating-Trees', src: 'audios/musics/Floating-Trees.mp3' },
        { title: 'Haggstrom', src: 'audios/musics/Haggstrom.mp3' },
        { title: 'Key', src: 'audios/musics/Key.mp3' },
        { title: 'Living-Mice', src: 'audios/musics/Living-Mice.mp3' },
        { title: 'Mice-On-Venus', src: 'audios/musics/Mice-On-Venus.mp3' },
        { title: 'Minecraft', src: 'audios/musics/Minecraft.mp3' },
        { title: 'Moog-City 2', src: 'audios/musics/Moog-City 2.mp3' },
        { title: 'Mutation', src: 'audios/musics/Mutation.mp3' },
        { title: 'Sweden', src: 'audios/musics/Sweden.mp3' },
        { title: 'Taswell', src: 'audios/musics/Taswell.mp3' },
        { title: 'Wet-Hands', src: 'audios/musics/Wet-Hands.mp3' },
        // Certifique-se de que cada nome de arquivo e caminho estão EXATOS
    ];
    let currentMusicIndex = -1;

    const updateAudioButtonTitle = () => {
        if (musicTitleDisplay && currentMusicIndex !== -1) {
            if (!backgroundAudio.paused) {
                musicTitleDisplay.textContent = `${musicPlaylist[currentMusicIndex].title}`;
            } else {
                musicTitleDisplay.textContent = 'Música Pausada';
            }
        } else if (musicTitleDisplay) {
            musicTitleDisplay.textContent = 'Nenhuma Música';
        }
    };

    const getRandomMusicIndex = () => {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * musicPlaylist.length);
        } while (newIndex === currentMusicIndex && musicPlaylist.length > 1);
        return newIndex;
    };

    const loadRandomMusic = (playImmediately = false) => {
        if (musicPlaylist.length === 0) {
            console.warn("Playlist vazia, não é possível carregar música.");
            return;
        }
        preparingNextMusic = true;
        currentMusicIndex = getRandomMusicIndex();
        const music = musicPlaylist[currentMusicIndex];
        backgroundAudio.src = music.src;
        backgroundAudio.load();

        backgroundAudio.oncanplaythrough = () => {
            if (playImmediately) {
                backgroundAudio.play().then(() => {
                    audioControlButton.classList.add('is-playing');
                    showCentralMessage(`Tocando: ${music.title}`);
                    preparingNextMusic = false;
                    updateAudioButtonTitle();
                }).catch(e => {
                    console.error("Erro ao tentar tocar áudio de fundo (possivelmente autoplay bloqueado):", e.message);
                    audioControlButton.classList.remove('is-playing');
                    showCentralMessage('Autoplay bloqueado. Clique para tocar.');
                    preparingNextMusic = false;
                });
            } else {
                preparingNextMusic = false;
                updateAudioButtonTitle();
            }
            backgroundAudio.oncanplaythrough = null;
        };

        backgroundAudio.onerror = (e) => {
            console.error(`Erro ao carregar ou reproduzir áudio: ${music.src}`, e);
            showCentralMessage('Erro ao carregar música.');
            preparingNextMusic = false;
        };
    };

    const updateProgressArc = () => {
        if (backgroundAudio.duration > 0 && arcProgress) {
            const progress = (backgroundAudio.currentTime / backgroundAudio.duration);
            const circumference = 2 * Math.PI * 27;
            const offset = circumference * (1 - progress);
            arcProgress.style.strokeDasharray = `${circumference} ${circumference}`;
            arcProgress.style.strokeDashoffset = offset;
        } else if (arcProgress) {
            arcProgress.style.strokeDashoffset = '0';
        }
    };

    if (backgroundAudio && audioControlButton && musicTitleDisplay) {
        loadRandomMusic();

        backgroundAudio.addEventListener('loadedmetadata', () => {
            console.log("Metadados da música carregados.");
            updateProgressArc();
        });
        backgroundAudio.addEventListener('timeupdate', updateProgressArc);
        backgroundAudio.addEventListener('ended', () => {
            console.log("Música atual terminou. Carregando próxima...");
            loadRandomMusic(true);
        });

        audioControlButton.addEventListener('click', () => {
            playEffectSound(clickSound);

            if (backgroundAudio.paused) {
                if (!backgroundAudio.src || preparingNextMusic) {
                    loadRandomMusic(true);
                } else {
                    backgroundAudio.play().then(() => {
                        audioControlButton.classList.add('is-playing');
                        showCentralMessage(`Tocando: ${musicPlaylist[currentMusicIndex].title}`);
                    }).catch(e => {
                        console.error("Erro ao tocar (autoplay bloqueado?):", e.message);
                        showCentralMessage('Autoplay bloqueado. Clique novamente para tocar.');
                    });
                }
                localStorage.setItem('userInteractedWithAudio', 'true');
            } else {
                backgroundAudio.pause();
                audioControlButton.classList.remove('is-playing');
                showCentralMessage('Música pausada.');
            }
            updateAudioButtonTitle();
        });

        const tryAutoPlay = () => {
            if (localStorage.getItem('userInteractedWithAudio') === 'true') {
                if (backgroundAudio.src) {
                    backgroundAudio.play().then(() => {
                        audioControlButton.classList.add('is-playing');
                        showCentralMessage(`Tocando: ${musicPlaylist[currentMusicIndex].title}`);
                        updateAudioButtonTitle();
                    }).catch(e => {
                        console.warn("Autoplay bloqueado pelo navegador na inicialização. Usuário precisará clicar.");
                        showCentralMessage('Clique no botão de música para iniciar.');
                        audioControlButton.classList.remove('is-playing');
                        updateAudioButtonTitle();
                    });
                }
            } else {
                updateAudioButtonTitle();
            }
        };

        const handleInitialAudioPlay = () => {
            if (backgroundAudio.paused && localStorage.getItem('userInteractedWithAudio') === 'true') {
                backgroundAudio.play().then(() => {
                    audioControlButton.classList.add('is-playing');
                    showCentralMessage(`Tocando: ${musicPlaylist[currentMusicIndex].title}`);
                    updateAudioButtonTitle();
                }).catch(e => {
                    console.warn("Autoplay bloqueado após interação inicial (para sessões futuras).");
                    showCentralMessage('Clique no botão de música para iniciar.');
                    audioControlButton.classList.remove('is-playing');
                    updateAudioButtonTitle();
                });
            } else if (backgroundAudio.paused) {
                updateAudioButtonTitle();
            }
            document.removeEventListener('click', handleInitialAudioPlay);
            document.removeEventListener('keydown', handleInitialAudioPlay);
        };

        document.addEventListener('click', handleInitialAudioPlay, { once: true });
        document.addEventListener('keydown', handleInitialAudioPlay, { once: true });

        tryAutoPlay();
        setTimeout(updateProgressArc, 100);
        updateAudioButtonTitle();
    } else {
        console.warn("Elementos de áudio de fundo não encontrados. Verifique os IDs 'backgroundAudio', 'audioControlButton', 'musicTitleDisplay' e 'audioProgressArc'.");
    }

    // =====================================
    // 4. Sistema de Sons para Interações (Seu código existente)
    // =====================================
    document.querySelectorAll('.access-card, .info-card, .service-card, .community-card, .event-card, .partnership-card, .security-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            console.log("[Efeitos Sonoros] Mouse entrou no card. Tentando tocar hover sound.");
            playEffectSound(hoverSound);
        });
    });

    document.querySelectorAll('a:not(.menu-toggle):not(.nav-menu a), .btn-primary, .btn-link').forEach(element => {
        element.addEventListener('click', (event) => {
            console.log("[Efeitos Sonoros] Link/Botão clicado. Tentando tocar click sound.");
            playEffectSound(clickSound);

            if (element.tagName === 'A' && element.href && element.href !== '#' && !element.classList.contains('no-animation')) {
                event.preventDefault();
                handleButtonClickAnimation(element);
                setTimeout(() => {
                    window.location.href = element.href;
                }, 500);
            }
            else if (element.tagName === 'BUTTON' || element.classList.contains('btn-primary') || element.classList.contains('btn-link')) {
                if (!element.classList.contains('copy-button')) {
                    if (element.textContent.includes('Nada para ver aqui!')) {
                        handleButtonClickAnimation(element);
                    }
                }
            }
        });
    });

    // =====================================
    // 5. Botão "Voltar ao Topo" (Seu código existente)
    // =====================================
    const scrollTopButton = document.getElementById('scrollTopButton');

    if (scrollTopButton) {
        window.addEventListener('scroll', () => { /* ... seu código ... */ });
        scrollTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            playEffectSound(clickSound);
        });
    } else {
        console.warn("Botão 'Voltar ao Topo' não encontrado. Verifique o ID 'scrollTopButton'.");
    }

    // =====================================
    // 6. Atualizar Ano Atual no Rodapé (Seu código existente)
    // =====================================
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    } else {
        console.warn("Elemento para o ano atual não encontrado. Verifique o ID 'currentYear'.");
    }

    // =====================================
    // 7. Efeitos de Rolagem para Elementos (Seu código existente)
    // =====================================
    const sections = document.querySelectorAll('.fade-in-section');
    const observerOptions = { /* ... seu código ... */ };
    const sectionObserver = new IntersectionObserver((entries, observer) => { /* ... seu código ... */ }, observerOptions);
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
});