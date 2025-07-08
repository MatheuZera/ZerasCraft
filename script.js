// script.js - Lógica de interatividade para o site Mundo Zera's Craft

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM totalmente carregado e pronto!");

    // =====================================
    // 0. Variáveis Globais e Inicialização de Sons e Funções Utilitárias (NOVO TOPO)
    // =====================================
    // Declarações de variáveis para áudio
    let hoverSound;
    let clickSound;
    const backgroundAudio = document.getElementById('backgroundAudio'); // Declarado aqui para ser acessível a todos

    // Tenta inicializar os objetos Audio
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

    // Função para tocar um som de efeito
    const playEffectSound = (audioElement) => {
        if (!audioElement) {
            console.warn("[Efeitos Sonoros] Elemento de áudio não inicializado. Não é possível tocar.");
            return;
        }

        // Verifica se o áudio está pronto para ser tocado
        if (audioElement.readyState < 2) {
            console.warn(`[Efeitos Sonoros] Áudio "${audioElement.src}" não está pronto. Tentando carregar novamente.`);
            audioElement.load();
            return; // Sai e tenta de novo na próxima interação, ou ajuste o fluxo se necessário
        }

        // Ajusta o volume com base no áudio de fundo, se estiver tocando
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
                // showCentralMessage('Clique em qualquer lugar para ativar os sons!'); // Opcional: para feedback visual
            }
        });
    };

    // Função para exibir mensagens centrais
    function showCentralMessage(message) {
        let messageBox = document.getElementById('centralMessageBox');
        if (!messageBox) {
            const body = document.body;
            messageBox = document.createElement('div');
            messageBox.id = 'centralMessageBox';
            // Estilos CSS para a caixa de mensagem (pode ser movido para o CSS principal)
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
                    // Usando .access-info como contexto para os botões de IP/Porta
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
                    // Junta as partes. Se for copiar IP e Porta, adicione ':' entre eles.
                    // Isso é um ajuste se data-copy-target for algo como "#serverIp, #serverPort"
                    if (selectors.includes('#serverIp') && selectors.includes('#serverPort') && partsToCopy.length === 2) {
                        textToCopy = `${partsToCopy[0]}:${partsToCopy[1]}`;
                    } else {
                        textToCopy = partsToCopy.join('');
                    }

                } else if (button.dataset.copyText) {
                    textToCopy = button.dataset.copyText;
                } else {
                    // Fallback para a lógica original (menos provável de ser usada agora com data-copy-target)
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

                        playEffectSound(clickSound); // Toca o som de clique

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
    // const backgroundAudio já está declarado no topo do DOMContentLoaded
    const audioControlButton = document.getElementById('audioControlButton');
    const musicTitleDisplay = document.getElementById('musicTitleDisplay');
    const audioProgressArc = document.getElementById('audioProgressArc');
    const arcProgress = audioProgressArc ? audioProgressArc.querySelector('.arc-progress') : null;

    // Configurações da playlist de músicas
    const musicPlaylist = [
        { title: "Aria-Math-Lofi", src: "audios/musics/Aria-Math-Lofi.mp3" },
        { title: "Beginning 2", src: "audios/musics/Beginning 2.mp3" },
        { title: "Biome-Fest", src: "audios/musics/Biome-Fest.mp3" },
        { title: "Blind-Spots", src: "audios/musics/Blind-Spots.mp3" },
        { title: "Clark", src: "audios/musics/Clark.mp4" }, // Atenção: Era .mp3, mudou para .mp4? Verifique o arquivo real.
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
    let currentMusicIndex = -1; // Começa com -1 para que a primeira seleção seja aleatória

    const getRandomMusicIndex = () => {
        if (musicPlaylist.length === 0) return -1;
        if (musicPlaylist.length === 1) return 0;

        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * musicPlaylist.length);
        } while (newIndex === currentMusicIndex);

        return newIndex;
    };

    const loadRandomMusic = (playImmediately = false) => {
        currentMusicIndex = getRandomMusicIndex();
        if (currentMusicIndex === -1) {
            console.warn("Playlist vazia, nenhuma música para tocar.");
            return;
        }

        const selectedMusic = musicPlaylist[currentMusicIndex];
        backgroundAudio.src = selectedMusic.src;
        musicTitleDisplay.textContent = selectedMusic.title;
        backgroundAudio.load();

        console.log(`[Áudio] Tentando carregar: "${selectedMusic.title}" do caminho: "${selectedMusic.src}"`);

        if (playImmediately) {
            backgroundAudio.play().then(() => {
                console.log(`[Áudio] Reproduzindo: "${selectedMusic.title}"`);
            }).catch(e => {
                console.error(`[Áudio] Erro ao tentar tocar "${selectedMusic.title}":`, e);
                showCentralMessage('Falha ao tocar música. Clique no botão.');
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
            } else {
                arcProgress.style.strokeDashoffset = circumference;
            }
        }
    };

    if (backgroundAudio && audioControlButton && musicTitleDisplay) {
        loadRandomMusic();

        backgroundAudio.addEventListener('loadedmetadata', () => {
            console.log("[Áudio] Metadados carregados.");
            updateProgressArc();
        });

        backgroundAudio.addEventListener('timeupdate', updateProgressArc);

        backgroundAudio.addEventListener('ended', () => {
            console.log("[Áudio] Música atual terminou. Carregando próxima...");
            loadRandomMusic(true);
        });

        audioControlButton.addEventListener('click', () => {
            if (backgroundAudio.paused) {
                loadRandomMusic(true);
                audioControlButton.classList.add('is-playing');
                localStorage.setItem('userInteractedWithAudio', 'true');
                showCentralMessage('Música tocando...');
            } else {
                backgroundAudio.pause();
                audioControlButton.classList.remove('is-playing');
                showCentralMessage('Música pausada.');
            }
        });

        const tryAutoPlay = () => {
            if (localStorage.getItem('userInteractedWithAudio') === 'true') {
                backgroundAudio.play().then(() => {
                    audioControlButton.classList.add('is-playing');
                    console.log("[Áudio] Áudio iniciado automaticamente (interação prévia detectada).");
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
                }).catch(e => {
                    console.error("[Áudio] Erro ao tentar reproduzir áudio após interação:", e);
                });
            }
        };

        tryAutoPlay();
        setTimeout(updateProgressArc, 100);

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