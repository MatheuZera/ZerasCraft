// script.js - Lógica de interatividade para o site Mundo Zera's Craft

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM totalmente carregado e pronto!");

    // =====================================
    // Variáveis Globais e Inicialização de Áudio (Completadas)
    // =====================================
    let hoverSound;
    let clickSound;
    const backgroundAudio = document.getElementById('backgroundAudio');
    let preparingNextMusic = false;
    const audioEffects = {}; // Objeto para armazenar as instâncias de áudio de efeitos

    // Função para inicializar um novo objeto Audio para efeitos sonoros
    const initializeAudioEffect = (name, path, volume = 0.5) => {
        const audio = new Audio(path);
        audio.preload = 'auto'; // Carrega o áudio assim que possível
        audio.volume = volume; // Define o volume padrão
        audioEffects[name] = audio; // Armazena a instância no objeto audioEffects
        console.log(`[Áudio] Efeito '${name}' carregado de: ${path}`);
        return audio;
    };

    // Inicializa os sons de hover e clique
    hoverSound = initializeAudioEffect('select', 'audios/effects/select.mp3', 0.3); // Ajuste o volume se necessário
    clickSound = initializeAudioEffect('click', 'audios/effects/click.mp3', 0.7); // Ajuste o volume se necessário

    // Função interna para tocar um elemento de áudio, clonando-o para evitar atrasos
    const playEffectSoundInternal = (audioElement) => {
        if (audioElement) {
            const clonedAudio = audioElement.cloneNode(); // Clona o áudio para permitir reproduções rápidas
            clonedAudio.volume = audioElement.volume; // Mantém o volume original
            clonedAudio.play().catch(e => console.warn("Erro ao tentar tocar som:", e.message));
        } else {
            console.warn("[Áudio] Tentativa de tocar efeito sonoro nulo ou indefinido.");
        }
    };

    // Função pública para tocar um efeito sonoro
    const playEffectSound = (audioElement) => {
        // Pequeno atraso para garantir que o navegador processe o clique/hover
        // e não bloqueie a reprodução. Pode ser ajustado ou removido se não houver problemas.
        setTimeout(() => {
            playEffectSoundInternal(audioElement);
        }, 10);
    };

    // Função para exibir mensagens centrais (se você tiver um elemento para isso)
    function showCentralMessage(message) {
        const centralMessageElement = document.getElementById('centralMessage'); // Assumindo um ID para a mensagem
        if (centralMessageElement) {
            centralMessageElement.textContent = message;
            centralMessageElement.style.opacity = '1';
            centralMessageElement.style.transform = 'translateY(0)';
            setTimeout(() => {
                centralMessageElement.style.opacity = '0';
                centralMessageElement.style.transform = 'translateY(-20px)';
            }, 3000); // Mensagem some após 3 segundos
        } else {
            console.log(`[Mensagem Central] ${message}`); // Apenas loga se o elemento não existir
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
    // 3. Sistema de Áudio de Fundo - Com Reprodução Aleatória (Completado)
    // =====================================
    const audioControlButton = document.getElementById('audioControlButton');
    const musicTitleDisplay = document.getElementById('musicTitleDisplay');
    const audioProgressArc = document.getElementById('audioProgressArc');
    const arcProgress = audioProgressArc ? audioProgressArc.querySelector('.arc-progress') : null;

    // A playlist agora precisa ter o caminho completo para o áudio
    const musicPlaylist = [
        { title: 'Bensound - Sunny', src: 'audios/music/bensound-sunny.mp3' },
        { title: 'Música 2', src: 'audios/music/music2.mp3' }, // Adicione suas músicas aqui
        { title: 'Música 3', src: 'audios/music/music3.mp3' },
    ];
    let currentMusicIndex = -1; // -1 significa nenhuma música carregada inicialmente

    // Atualiza o título da música no botão de controle
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

    // Obtém um índice de música aleatório diferente do atual
    const getRandomMusicIndex = () => {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * musicPlaylist.length);
        } while (newIndex === currentMusicIndex && musicPlaylist.length > 1); // Garante que não repete a mesma música se houver mais de uma
        return newIndex;
    };

    // Carrega uma música aleatória e opcionalmente a toca
    const loadRandomMusic = (playImmediately = false) => {
        if (musicPlaylist.length === 0) {
            console.warn("Playlist vazia, não é possível carregar música.");
            return;
        }
        preparingNextMusic = true; // Sinaliza que estamos preparando uma nova música
        currentMusicIndex = getRandomMusicIndex();
        const music = musicPlaylist[currentMusicIndex];
        backgroundAudio.src = music.src;
        backgroundAudio.load(); // Carrega a nova fonte

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
            backgroundAudio.oncanplaythrough = null; // Remove o listener para evitar múltiplas execuções
        };

        backgroundAudio.onerror = (e) => {
            console.error(`Erro ao carregar ou reproduzir áudio: ${music.src}`, e);
            showCentralMessage('Erro ao carregar música.');
            preparingNextMusic = false;
        };
    };

    // Atualiza o arco de progresso da música
    const updateProgressArc = () => {
        if (backgroundAudio.duration > 0 && arcProgress) {
            const progress = (backgroundAudio.currentTime / backgroundAudio.duration);
            const circumference = 2 * Math.PI * 27; // 27 é o raio do círculo
            const offset = circumference * (1 - progress);
            arcProgress.style.strokeDasharray = `${circumference} ${circumference}`;
            arcProgress.style.strokeDashoffset = offset;
        } else if (arcProgress) {
            arcProgress.style.strokeDashoffset = '0'; // Reseta quando não há música
        }
    };

    if (backgroundAudio && audioControlButton && musicTitleDisplay) {
        loadRandomMusic(); // Carrega a primeira música (não toca automaticamente)

        backgroundAudio.addEventListener('loadedmetadata', () => {
            console.log("Metadados da música carregados.");
            updateProgressArc(); // Atualiza o arco assim que os metadados estiverem disponíveis
        });
        backgroundAudio.addEventListener('timeupdate', updateProgressArc);
        backgroundAudio.addEventListener('ended', () => {
            console.log("Música atual terminou. Carregando próxima...");
            loadRandomMusic(true); // Toca a próxima música imediatamente
        });

        audioControlButton.addEventListener('click', () => {
            playEffectSound(clickSound); // Clicar no botão de áudio

            if (backgroundAudio.paused) {
                if (!backgroundAudio.src || preparingNextMusic) {
                     // Se não há src ou estamos preparando a próxima, force o carregamento e play
                    loadRandomMusic(true);
                } else {
                    // Já tem src, apenas tente tocar
                    backgroundAudio.play().then(() => {
                        audioControlButton.classList.add('is-playing');
                        showCentralMessage(`Tocando: ${musicPlaylist[currentMusicIndex].title}`);
                    }).catch(e => {
                        console.error("Erro ao tocar (autoplay bloqueado?):", e.message);
                        showCentralMessage('Autoplay bloqueado. Clique novamente para tocar.');
                    });
                }
                localStorage.setItem('userInteractedWithAudio', 'true'); // Marca que o usuário interagiu
            } else {
                backgroundAudio.pause();
                audioControlButton.classList.remove('is-playing');
                showCentralMessage('Música pausada.');
            }
            updateAudioButtonTitle(); // Atualiza o título após a ação
        });

        const tryAutoPlay = () => {
            // Se o usuário já interagiu antes (salvo no localStorage), tentamos tocar automaticamente
            if (localStorage.getItem('userInteractedWithAudio') === 'true') {
                if (backgroundAudio.src) { // Só tenta se já houver uma src definida
                    backgroundAudio.play().then(() => {
                        audioControlButton.classList.add('is-playing');
                        showCentralMessage(`Tocando: ${musicPlaylist[currentMusicIndex].title}`);
                        updateAudioButtonTitle();
                    }).catch(e => {
                        console.warn("Autoplay bloqueado pelo navegador na inicialização. Usuário precisará clicar.");
                        showCentralMessage('Clique no botão de música para iniciar.');
                        audioControlButton.classList.remove('is-playing');
                        updateAudioButtonTitle(); // Garante que o título esteja correto
                    });
                }
            } else {
                // Se nunca interagiu, não tenta autoplay, apenas mostra o status inicial
                updateAudioButtonTitle();
            }
        };

        // Função para lidar com a primeira interação do usuário, permitindo o áudio
        const handleInitialAudioPlay = () => {
            if (backgroundAudio.paused && localStorage.getItem('userInteractedWithAudio') === 'true') {
                // Se estava pausado e o usuário já interagiu, tenta tocar (para casos de recarregamento)
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
                updateAudioButtonTitle(); // Apenas atualiza o título para "Pausado" ou "Nenhuma Música"
            }
            document.removeEventListener('click', handleInitialAudioPlay); // Remove o listener após a primeira execução
            document.removeEventListener('keydown', handleInitialAudioPlay);
        };

        // Adiciona listeners para a primeira interação do usuário (necessário para autoplay em alguns navegadores)
        document.addEventListener('click', handleInitialAudioPlay, { once: true });
        document.addEventListener('keydown', handleInitialAudioPlay, { once: true });

        // Chama tryAutoPlay após a inicialização completa do DOM
        tryAutoPlay();
        setTimeout(updateProgressArc, 100);
        updateAudioButtonTitle(); // Garante que o título inicial seja exibido
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