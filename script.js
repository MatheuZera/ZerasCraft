// script.js - Lógica de interatividade para o site Mundo Zera's Craft

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM totalmente carregado e pronto!");

    // =====================================
    // Variáveis de Áudio e Elementos
    // =====================================
    let hoverSound;
    let clickSound;
    const backgroundAudio = document.getElementById('backgroundAudio');
    let preparingNextMusic = false; // Flag para evitar múltiplas chamadas de load/play simultâneas
    const audioEffects = {};

    const audioControlButton = document.getElementById('audioControlButton');
    const musicTitleDisplay = document.getElementById('musicTitleDisplay');
    const audioProgressArc = document.getElementById('audioProgressArc');
    const arcProgress = audioProgressArc ? audioProgressArc.querySelector('.arc-progress') : null;

    // Garante que o raio e a circunferência são definidos corretamente para o SVG
    // CONFIRME SE O RAIO NO SEU SVG (<circle r="XX">) É REALMENTE 27!
    const arcRadius = 27;
    const arcCircumference = 2 * Math.PI * arcRadius;

    // A playlist com seus títulos e caminhos.
    const musicPlaylist = [
        { title: 'Aria-Math-Lofi-Remastered', src: 'audios/musics/Aria-Math-Lofi-Remake.mp3' },
        { title: 'Aria-Math', src: 'audios/musics/Aria-Math.mp3' },
        { title: 'Beginning 2', src: 'audios/musics/Beginning 2.mp3' },
        { title: 'Biome-Fest', src: 'audios/musics/Biome-Fest.mp3' },
        { title: 'Blind-Spots', src: 'audios/musics/Blind-Spots.mp3' },
        { title: 'Clark', src: 'audios/musics/Clark.mp3' },
        { title: 'Danny', src: 'audios/musics/Danny.mp3' },
        { title: 'Dreiton', src: 'audios/musics/Dreiton.mp3' },
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

    hoverSound = initializeAudioEffect('select', 'audios/effects/select.mp3', 0.3);
    clickSound = initializeAudioEffect('click', 'audios/effects/click.mp3', 0.7);

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
    // 1. Menu Hambúrguer para Responsividade
    // =====================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.main-nav');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            playEffectSound(clickSound);
        });

        document.querySelectorAll('.main-nav a').forEach(item => {
            item.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                playEffectSound(clickSound);
            });
        });
    } else {
        console.warn("Elementos do menu hambúrguer não encontrados. Verifique as classes 'menu-toggle' e 'main-nav'.");
    }

    // =====================================
    // 2. Funcionalidade de Copiar Texto
    // =====================================
    const copyButtons = document.querySelectorAll('.copy-button');

    if (copyButtons.length > 0) {
        copyButtons.forEach(button => {
            button.addEventListener('click', async () => {
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
    // 3. Sistema de Áudio de Fundo - Com Reprodução Aleatória e Arco de Progresso (NOVA LÓGICA)
    // =====================================

    const updateAudioButtonTitle = () => {
        if (musicTitleDisplay && currentMusicIndex !== -1 && musicPlaylist[currentMusicIndex]) {
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
        if (musicPlaylist.length === 0) return -1;
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * musicPlaylist.length);
        } while (newIndex === currentMusicIndex && musicPlaylist.length > 1);
        return newIndex;
    };

    const playMusic = () => {
        if (backgroundAudio.paused) {
            backgroundAudio.play().then(() => {
                audioControlButton.classList.add('is-playing');
                showCentralMessage(`Tocando: ${musicPlaylist[currentMusicIndex].title}`);
                updateAudioButtonTitle();
                console.log(`[Áudio] Música '${musicPlaylist[currentMusicIndex].title}' começou a tocar.`);
            }).catch(e => {
                console.error("Erro ao tentar tocar áudio (provavelmente autoplay bloqueado):", e.message);
                audioControlButton.classList.remove('is-playing');
                showCentralMessage('Autoplay bloqueado. Clique para tocar.');
                updateAudioButtonTitle();
                preparingNextMusic = false;
            });
        }
    };

    const loadNewMusic = (playAfterLoad = false) => {
        if (musicPlaylist.length === 0) {
            console.warn("Playlist vazia, não é possível carregar música.");
            preparingNextMusic = false;
            return;
        }
        if (preparingNextMusic) {
            console.log("Já está preparando a próxima música, abortando nova carga.");
            return;
        }

        preparingNextMusic = true;
        currentMusicIndex = getRandomMusicIndex();
        const music = musicPlaylist[currentMusicIndex];

        if (currentMusicIndex === -1) { // Verifica novamente se houve falha em obter índice
            console.warn("Não foi possível obter um índice de música válido. Playlist vazia ou erro.");
            preparingNextMusic = false;
            return;
        }

        console.log(`[Áudio] Carregando: ${music.title} de ${music.src}`);
        backgroundAudio.src = music.src;
        backgroundAudio.load(); // Inicia o carregamento

        // Event listener para quando a música estiver pronta para tocar
        backgroundAudio.oncanplaythrough = () => {
            console.log(`[Áudio] Música '${music.title}' pronta para tocar. Tempo de carregamento: ${backgroundAudio.readyState}`);
            preparingNextMusic = false; // Libera a flag

            if (playAfterLoad) {
                playMusic();
            } else {
                updateAudioButtonTitle();
            }
            backgroundAudio.oncanplaythrough = null; // Remove o listener após uso
        };

        // Event listener para erros de carregamento
        backgroundAudio.onerror = (e) => {
            console.error(`Erro ao carregar áudio: ${music.src}`, e);
            showCentralMessage('Erro ao carregar música. Pulando...');
            preparingNextMusic = false;
            backgroundAudio.onerror = null; // Remove o listener após uso
            setTimeout(() => loadNewMusic(playAfterLoad), 500); // Tenta a próxima em caso de erro
        };
    };

    const updateProgressArc = () => {
        if (!arcProgress) return;

        if (backgroundAudio.duration > 0 && !isNaN(backgroundAudio.duration)) {
            const progress = (backgroundAudio.currentTime / backgroundAudio.duration);
            const offset = arcCircumference * (1 - progress);
            arcProgress.style.strokeDashoffset = offset;
        } else {
            // Garante que o arco esteja "zerado" (completo) se não houver duração válida ou música
            arcProgress.style.strokeDashoffset = arcCircumference;
        }
    };

    if (backgroundAudio && audioControlButton && musicTitleDisplay && arcProgress) {
        // Configuração inicial do arco
        arcProgress.style.strokeDasharray = `${arcCircumference} ${arcCircumference}`;
        arcProgress.style.strokeDashoffset = arcCircumference; // Inicia o arco como 'zerado' (completo)
        arcProgress.style.transition = 'stroke-dashoffset 1s linear'; // Garante a transição suave

        // Carrega a primeira música na inicialização (não toca automaticamente)
        loadNewMusic(false);

        // Event listeners para o áudio
        backgroundAudio.addEventListener('loadedmetadata', updateProgressArc);
        backgroundAudio.addEventListener('timeupdate', updateProgressArc);

        // ESSA É A LÓGICA PRINCIPAL PARA TROCAR A MÚSICA NO FIM
        backgroundAudio.addEventListener('ended', () => {
            console.log("Música atual terminou (evento 'ended'). ZERANDO ARCO e carregando a próxima...");
            audioControlButton.classList.remove('is-playing'); // Remove o estado de tocando
            updateProgressArc(); // Garante que o arco volte ao "zero" visualmente (completo)
            preparingNextMusic = false; // Libera para carregar a próxima
            loadNewMusic(true); // Carrega e tenta tocar a próxima música automaticamente
        });

        audioControlButton.addEventListener('click', () => {
            playEffectSound(clickSound);

            if (backgroundAudio.paused) {
                // Se estiver pausado, tenta tocar a música atual ou carrega uma nova se não houver nenhuma ou se já terminou
                if (currentMusicIndex === -1 || !backgroundAudio.src || backgroundAudio.ended || backgroundAudio.currentTime === 0) {
                    console.log("Botão clicado: Carregando nova música e tentando tocar.");
                    loadNewMusic(true);
                } else {
                    console.log("Botão clicado: Despausando música existente.");
                    playMusic(); // Tenta despausar
                }
                localStorage.setItem('userInteractedWithAudio', 'true');
            } else {
                // Se estiver tocando, pausa e pula para a próxima ao mesmo tempo
                console.log("Botão clicado: Música tocando. Pausando e pulando para a próxima.");
                backgroundAudio.pause();
                audioControlButton.classList.remove('is-playing');
                showCentralMessage('Pulando para a próxima música...');
                preparingNextMusic = false; // Libera para carregar a próxima
                loadNewMusic(true); // Carrega e tenta tocar a próxima música
            }
            updateAudioButtonTitle();
        });

        // Lógica de Autoplay na inicialização e após primeira interação
        let hasInitialInteraction = false;
        const handleInitialAudioPlay = () => {
            if (hasInitialInteraction) return;
            hasInitialInteraction = true;

            console.log("Primeira interação na página detectada.");
            localStorage.setItem('userInteractedWithAudio', 'true');

            document.removeEventListener('click', handleInitialAudioPlay, { once: true, capture: true });
            document.removeEventListener('keydown', handleInitialAudioPlay, { once: true, capture: true });

            if (backgroundAudio.paused || !backgroundAudio.src) {
                if (currentMusicIndex === -1) {
                    loadNewMusic(true);
                } else {
                    playMusic();
                }
            }
        };

        document.addEventListener('click', handleInitialAudioPlay, { once: true, capture: true, passive: true });
        document.addEventListener('keydown', handleInitialAudioPlay, { once: true, capture: true, passive: true });

        const tryAutoPlayOnLoad = () => {
            if (localStorage.getItem('userInteractedWithAudio') === 'true') {
                console.log("Usuário já interagiu anteriormente. Tentando autoplay na carga da página.");
                if (currentMusicIndex !== -1 && backgroundAudio.paused) {
                    playMusic();
                } else if (currentMusicIndex === -1) {
                    loadNewMusic(true);
                }
            } else {
                console.log("Primeira visita ou interação não registrada. Autoplay não permitido. Aguardando interação.");
                updateAudioButtonTitle();
            }
        };

        tryAutoPlayOnLoad();

        setTimeout(updateProgressArc, 100);
        updateAudioButtonTitle();

    } else {
        console.warn("Elementos de áudio de fundo não encontrados. Verifique os IDs 'backgroundAudio', 'audioControlButton', 'musicTitleDisplay' e 'audioProgressArc'.");
    }

    // =====================================
    // 4. Sistema de Sons para Interações
    // =====================================
    document.querySelectorAll('.access-card, .info-card, .service-card, .community-card, .event-card, .partnership-card, .security-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            playEffectSound(hoverSound);
        });
    });

    document.querySelectorAll('a:not(.menu-toggle):not(.main-nav a), .btn-primary, .btn-link').forEach(element => {
        element.addEventListener('click', (event) => {
            playEffectSound(clickSound);

            if (element.textContent.includes('Nada para ver aqui!')) {
                showCentralMessage('Realmente, nada para ver aqui!');
                event.preventDefault();
            }
        });
    });

    // =====================================
    // 5. Botão "Voltar ao Topo"
    // =====================================
    const scrollTopButton = document.getElementById('scrollTopButton');

    if (scrollTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopButton.classList.add('show');
            } else {
                scrollTopButton.classList.remove('show');
            }
        });
        scrollTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            playEffectSound(clickSound);
        });
    } else {
        console.warn("Botão 'Voltar ao Topo' não encontrado. Verifique o ID 'scrollTopButton'.");
    }

    // =====================================
    // 6. Atualizar Ano Atual no Rodapé
    // =====================================
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    } else {
        console.warn("Elemento para o ano atual não encontrado. Verifique o ID 'currentYear'.");
    }

    // =====================================
    // 7. Efeitos de Rolagem para Elementos
    // =====================================
    const sections = document.querySelectorAll('.fade-in-section');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
});