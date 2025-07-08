// script.js - Lógica de interatividade para o site Mundo Zera's Craft

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM totalmente carregado e pronto!");

    // =====================================
    // 0. Variáveis Globais e Inicialização de Sons e Funções Utilitárias
    // =====================================
    let hoverSound;
    let clickSound;
    const backgroundAudio = document.getElementById('backgroundAudio');

    // Flag para controlar se já estamos preparando a próxima música, evitando chamadas múltiplas
    let preparingNextMusic = false;

    try {
        hoverSound = new Audio('audios/effects/select.mp3');
        hoverSound.preload = 'auto';
        console.log("[Efeitos Sonoros] Carregando: audios/effects/select.mp3");

        clickSound = new Audio('audios/effects/click.mp3');
        clickSound.preload = 'auto';
        console.log("[Efeitos Sonoros] Carregando: audios/effects/click.mp3");

    } catch (e) {
        console.error("[Efeitos Sonoros] Erro ao inicializar objetos Audio:", e);
    }

    const playEffectSound = (audioElement) => {
        if (!audioElement) {
            console.warn("[Efeitos Sonoros] Elemento de áudio não inicializado. Não é possível tocar.");
            return;
        }

        if (audioElement.readyState < 1) { // checking if readyState is less than HAVE_METADATA
            console.warn(`[Efeitos Sonoros] Áudio "${audioElement.src}" não está pronto (${audioElement.readyState}). Tentando carregar novamente.`);
            audioElement.load();
            return;
        }

        if (backgroundAudio && !backgroundAudio.paused) {
            audioElement.volume = 0.4;
        } else {
            audioElement.volume = 0.8;
        }

        audioElement.currentTime = 0; // Reinicia o áudio para poder tocar múltiplas vezes seguidas
        audioElement.play().then(() => {
            // console.log(`[Efeitos Sonoros] Sucesso ao tocar: ${audioElement.src}`);
        }).catch(e => {
            console.error(`[Efeitos Sonoros] Erro ao tocar som "${audioElement.src}":`, e);
            if (e.name === "NotAllowedError" || e.name === "AbortError") {
                console.warn("[Efeitos Sonoros] Reprodução de som bloqueada pelo navegador. Necessita interação do usuário.");
            }
        });
    };

    function showCentralMessage(message) {
        let messageBox = document.getElementById('centralMessageBox');
        if (!messageBox) {
            const body = document.body;
            messageBox = document.createElement('div');
            messageBox.id = 'centralMessageBox';
            messageBox.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.5s ease-in-out;
            `;
            body.appendChild(messageBox);
        }
        messageBox.textContent = message;
        messageBox.style.opacity = '1';
        setTimeout(() => {
            messageBox.style.opacity = '0';
        }, 3000);
    }


    // =====================================
    // 1. Menu Hambúrguer para Responsividade
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
            item.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                playEffectSound(clickSound);
            });
        });
    } else {
        console.warn("Elementos do menu hambúrguer não encontrados. Verifique as classes 'menu-toggle' e 'nav-menu'.");
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

                        playEffectSound(clickSound);

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
    // 3. Sistema de Áudio de Fundo - Com Reprodução Aleatória
    // =====================================
    const audioControlButton = document.getElementById('audioControlButton');
    const musicTitleDisplay = document.getElementById('musicTitleDisplay');
    const audioProgressArc = document.getElementById('audioProgressArc');
    const arcProgress = audioProgressArc ? audioProgressArc.querySelector('.arc-progress') : null;

    const musicPlaylist = [
        { title: "Aria-Math-Lofi", src: "audios/musics/Aria-Math-Lofi.mp3" },
        { title: "Beginning 2", src: "audios/musics/Beginning 2.mp3" },
        { title: "Biome-Fest", src: "audios/musics/Biome-Fest.mp3" },
        { title: "Blind-Spots", src: "audios/musics/Blind-Spots.mp3" },
        { title: "Clark", src: "audios/musics/Clark.mp3" },
        { title: "Danny", src: "audios/musics/Danny.mp3" },
        { title: "Dreiton", src: "audios/musics/Dreiton.mp3" },
        { title: "Dry-Hands", src: "audios/musics/Dry-Hands.mp3" },
        { title: "Floating-Trees", src: "audios/musics/Floating-Trees.mp3" },
        { title: "Haggstrom", src: "audios/musics/Haggstrom.mp3" },
        { title: "Haunt-Muskie", src: "audios/musics/Haunt-Muskie.mp3" },
        { title: "Key", src: "audios/musics/Key.mp3" },
        { title: "Living-Mice", src: "audios/musics/Living-Mice.mp3" },
        { title: "Mice-On-Venus", src: "audios/musics/Mice-On-Venus.mp3" },
        { title: "Minecraft", src: "audios/musics/Minecraft.mp3" },
        { title: "Moog-City 2", src: "audios/musics/Moog-City 2.mp3" },
        { title: "Mutation", src: "audios/musics/Mutation.mp3" },
        { title: "Oxygène", src: "audios/musics/Oxygène.mp3" },
        { title: "Sweden", src: "audios/musics/Sweden.mp3" },
        { title: "Subwoofer-Lullaby", src: "audios/musics/Subwoofer-Lullaby.mp3" },
        { title: "Taswell", src: "audios/musics/Taswell.mp3" },
        { title: "Wet-Hands", src: "audios/musics/Wet-Hands.mp3" }
    ];
    let currentMusicIndex = -1;

    // Helper to update the button's title based on audio state
    const updateAudioButtonTitle = () => {
        if (backgroundAudio.paused) {
            audioControlButton.title = "Tocar música de fundo (Aleatório)";
        } else {
            audioControlButton.title = `Tocando: ${musicPlaylist[currentMusicIndex]?.title || 'Música Desconhecida'}`;
        }
    };

    const getRandomMusicIndex = () => {
        if (musicPlaylist.length === 0) return -1;
        if (musicPlaylist.length === 1) return 0;

        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * musicPlaylist.length);
            console.log(`[getRandomMusicIndex] Tentando novo índice: ${newIndex}, Índice atual: ${currentMusicIndex}`);
        } while (newIndex === currentMusicIndex);

        console.log(`[getRandomMusicIndex] Novo índice selecionado: ${newIndex}`);
        return newIndex;
    };

    const loadRandomMusic = (playImmediately = false) => {
        // Resetamos a flag ao carregar uma nova música
        preparingNextMusic = false;

        const oldIndex = currentMusicIndex;
        currentMusicIndex = getRandomMusicIndex();
        console.log(`[loadRandomMusic] Índice anterior: ${oldIndex}, Novo índice: ${currentMusicIndex}`);

        if (currentMusicIndex === -1) {
            console.warn("Playlist vazia, nenhuma música para tocar.");
            return;
        }

        const selectedMusic = musicPlaylist[currentMusicIndex];
        backgroundAudio.src = selectedMusic.src;
        musicTitleDisplay.textContent = selectedMusic.title;
        backgroundAudio.load(); // Solicita o carregamento do novo SRC
        updateAudioButtonTitle(); // Update button title immediately

        console.log(`[Áudio] Tentando carregar: "${selectedMusic.title}" do caminho: "${selectedMusic.src}"`);

        if (playImmediately) {
            backgroundAudio.play().then(() => {
                console.log(`[Áudio] Reproduzindo: "${selectedMusic.title}"`);
                audioControlButton.classList.add('is-playing'); // Ensure play state is reflected
                showCentralMessage(`Tocando: ${selectedMusic.title}`); // Only show message on successful play
            }).catch(e => {
                console.error(`[Áudio] Erro ao tentar tocar "${selectedMusic.title}":`, e);
                if (e.name === "NotAllowedError" || e.name === "AbortError" || e.name === "DOMException") {
                    console.warn("[Áudio] Reprodução bloqueada ou falha na fonte. Tentando próxima música em 2 segundos...");
                    showCentralMessage('Falha ao tocar música. Tentando a próxima.');
                    // Tenta a próxima música após um pequeno atraso para evitar loops de erro.
                    setTimeout(() => loadRandomMusic(true), 2000);
                } else {
                    showCentralMessage('Falha grave ao tocar música.');
                }
            });
        }
    };

    const updateProgressArc = () => {
        if (backgroundAudio && arcProgress) {
            const duration = backgroundAudio.duration;
            const currentTime = backgroundAudio.currentTime;
            const circumference = 2 * Math.PI * 27;

            if (isFinite(duration) && duration > 0) {
                const progress = currentTime / duration;
                const offset = circumference * (1 - progress);
                arcProgress.style.strokeDasharray = `${circumference} ${circumference}`;
                arcProgress.style.strokeDashoffset = offset;

                // === NOVA Lógica de detecção de "arco zerado" ou quase fim ===
                // Se o offset está perto do valor total da circunferência (arco "zerado")
                // ou se a música está a menos de um pequeno limiar do fim,
                // e ainda não estamos preparando a próxima música.
                const threshold = 0.5; // Segundos para considerar "perto do fim"
                if ((duration - currentTime < threshold || offset >= circumference - 1) && !preparingNextMusic) {
                    console.log(`[Áudio] Detectado fim da música via arco/timeupdate. CurrentTime: ${currentTime}, Duration: ${duration}, Offset: ${offset}`);
                    preparingNextMusic = true; // Define a flag para evitar chamadas múltiplas

                    // Pequeno atraso para garantir que o player terminou de processar
                    setTimeout(() => {
                        // Verifica se a música realmente "terminou" (ou está muito perto do fim) e não está pausada
                        // e que o índice da música ainda é o mesmo (para evitar troca se o usuário já clicou antes)
                        if (!backgroundAudio.paused && backgroundAudio.currentTime >= backgroundAudio.duration - 0.1) {
                            console.log("[Áudio] Disparando carregamento da próxima música via fallback de arco/timeupdate.");
                            loadRandomMusic(true);
                        } else {
                            // Se a música não terminou de fato (ex: usuário pausou), reseta a flag
                            preparingNextMusic = false;
                        }
                    }, 200); // Um pequeno atraso para estabilização
                }
            } else {
                // Se a duração não é válida (música não carregou ou é 0), o arco fica zerado.
                // Isso pode significar que a música não pôde ser reproduzida.
                arcProgress.style.strokeDashoffset = circumference;
                // Adicione uma verificação para tentar a próxima música se a atual não tiver duração válida
                if (!isFinite(duration) && duration <= 0 && !preparingNextMusic) {
                    console.warn("[Áudio] Duração inválida, possivelmente erro de carregamento. Tentando próxima música.");
                    preparingNextMusic = true;
                    setTimeout(() => loadRandomMusic(true), 1000); // Tenta próxima após 1s
                }
            }
        }
    };

    if (backgroundAudio && audioControlButton && musicTitleDisplay) {
        loadRandomMusic(); // Initial load, but won't auto-play without user interaction

        backgroundAudio.addEventListener('loadedmetadata', () => {
            console.log("[Áudio] Metadados carregados.");
            updateProgressArc();
            preparingNextMusic = false; // Reseta a flag ao carregar metadados de uma nova música
            updateAudioButtonTitle(); // Update button title once metadata is loaded
        });

        backgroundAudio.addEventListener('timeupdate', updateProgressArc);

        // Mantenha o evento 'ended', pois ele ainda é o ideal se disparar,
        // mas agora o timeupdate será o principal fallback.
        backgroundAudio.addEventListener('ended', () => {
            console.log("[Áudio] Música atual terminou (via evento 'ended'). Carregando próxima...");
            // Verifica a flag antes de carregar, para não duplicar se timeupdate já disparou
            if (!preparingNextMusic) {
                preparingNextMusic = true; // Garante que timeupdate não dispare em paralelo logo em seguida
                loadRandomMusic(true);
            }
        });

        audioControlButton.addEventListener('click', () => {
            if (backgroundAudio.paused) {
                preparingNextMusic = false; // Reseta a flag ao iniciar pelo botão
                loadRandomMusic(true); // Ensures a new song is loaded if it was stopped and none was playing
                localStorage.setItem('userInteractedWithAudio', 'true');
                // The showCentralMessage and class 'is-playing' will be handled by the play() promise and loadedmetadata
            } else {
                backgroundAudio.pause();
                audioControlButton.classList.remove('is-playing');
                showCentralMessage('Música pausada.');
                preparingNextMusic = false; // Resets the flag on pause
                updateAudioButtonTitle(); // Update button title to reflect pause
            }
        });

        const tryAutoPlay = () => {
            if (localStorage.getItem('userInteractedWithAudio') === 'true') {
                // We're trying to play the current audio source, not necessarily load a new one randomly.
                // If it successfully plays, it means the browser allowed it.
                backgroundAudio.play().then(() => {
                    audioControlButton.classList.add('is-playing');
                    console.log("[Áudio] Áudio iniciado automaticamente (interação prévia detectada).");
                    showCentralMessage(`Tocando: ${musicPlaylist[currentMusicIndex]?.title || 'Música de fundo'}`);
                    updateAudioButtonTitle(); // Ensure title is updated on auto-play
                }).catch(e => {
                    console.log("[Áudio] Reprodução automática bloqueada ou sem interação. O usuário precisará clicar para iniciar.", e);
                    document.body.addEventListener('click', handleInitialAudioPlay, { once: true });
                });
            } else {
                console.log("[Áudio] Nenhuma interação prévia detectada. O usuário precisará clicar para iniciar o áudio.");
                document.body.addEventListener('click', handleInitialAudioPlay, { once: true });
            }
        };

        const handleInitialAudioPlay = () => {
            if (backgroundAudio.paused) {
                backgroundAudio.play().then(() => {
                    audioControlButton.classList.add('is-playing');
                    localStorage.setItem('userInteractedWithAudio', 'true');
                    console.log("Áudio iniciado por interação inicial do usuário.");
                    showCentralMessage(`Tocando: ${musicPlaylist[currentMusicIndex]?.title || 'Música de fundo'}`);
                    updateAudioButtonTitle(); // Ensure title is updated on initial user play
                }).catch(e => {
                    console.error("[Áudio] Erro ao tentar reproduzir áudio após interação:", e);
                });
            }
        };

        tryAutoPlay();
        // Initial update of the arc and button title, just in case
        setTimeout(updateProgressArc, 100);
        updateAudioButtonTitle(); // Initial call to set the correct title
    } else {
        console.warn("Elementos de áudio de fundo não encontrados. Verifique os IDs 'backgroundAudio', 'audioControlButton', 'musicTitleDisplay' e 'audioProgressArc'.");
    }

    // =====================================
    // 4. Sistema de Sons para Interações
    // =====================================
    document.querySelectorAll('.access-card, .info-card, .service-card, .community-card, .event-card, .partnership-card, .security-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            console.log("[Efeitos Sonoros] Mouse entrou no card. Tentando tocar hover sound.");
            playEffectSound(hoverSound);
        });
    });

    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (event) => {
            console.log("[Efeitos Sonoros] Link clicado. Tentando tocar click sound.");
            playEffectSound(clickSound);
        });
    });

    document.querySelectorAll('button:not(.copy-button), input[type="button"], input[type="submit"]').forEach(button => {
        button.addEventListener('click', (event) => {
            console.log("[Efeitos Sonoros] Botão clicado. Tentando tocar click sound.");
            playEffectSound(clickSound);
        });
    });

    // =====================================
    // 5. Botão "Voltar ao Topo"
    // =====================================
    const scrollTopButton = document.getElementById('scrollTopButton');

    if (scrollTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopButton.classList.add('visible');
            } else {
                scrollTopButton.classList.remove('visible');
            }
        });

        scrollTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
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