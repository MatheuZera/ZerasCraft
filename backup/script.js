// script.js - Lógica de interatividade para o site Mundo Zera's Craft

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM totalmente carregado e pronto!");

    let hoverSound;
    let clickSound;
    const backgroundAudio = document.getElementById('backgroundAudio');
    let preparingNextMusic = false; // Flag para evitar múltiplas chamadas de load/play
    const audioEffects = {};

    const initializeAudioEffect = (name, path, volume = 0.5) => {
        const audio = new Audio(path);
        audio.preload = 'auto'; // Pré-carrega o áudio
        audio.volume = volume;
        audioEffects[name] = audio;
        console.log(`[Áudio] Efeito '${name}' carregado de: ${path}`);
        return audio;
    };

    hoverSound = initializeAudioEffect('select', 'audios/effects/select.mp3', 0.3);
    clickSound = initializeAudioEffect('click', 'audios/effects/click.mp3', 0.7);

    const playEffectSoundInternal = (audioElement) => {
        if (audioElement) {
            const clonedAudio = audioElement.cloneNode(); // Clona para permitir múltiplas reproduções rápidas
            clonedAudio.volume = audioElement.volume;
            clonedAudio.play().catch(e => console.warn("Erro ao tentar tocar som de efeito:", e.message));
        } else {
            console.warn("[Áudio] Tentativa de tocar efeito sonoro nulo ou indefinido.");
        }
    };

    const playEffectSound = (audioElement) => {
        setTimeout(() => {
            playEffectSoundInternal(audioElement);
        }, 10); // Pequeno delay para evitar conflito com outros eventos
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
    // Nova Função para Lidar com a Animação de Botões Pós-Execução
    // REVISADO: Removido 'display: none' para evitar que o botão suma permanentemente para links âncora.
    // Agora ele apenas esmaece, se for para navegar, a página irá carregar outra coisa,
    // se for âncora, o botão vai esmaecer e voltar ao normal.
    // =====================================
    const handleButtonClickAnimation = (buttonElement, delayBeforeAnimate = 0) => {
        // Verifica se o botão é um link âncora para a mesma página
        const isAnchorLink = buttonElement.tagName === 'A' && buttonElement.href.startsWith('#');

        setTimeout(() => {
            // Adiciona a classe para iniciar a animação (opacity: 0, transform, pointer-events: none)
            buttonElement.classList.add('btn-animating-out');

            // Tempo da animação CSS (deve corresponder ao transition no CSS)
            const animationDuration = 500; // 0.5s

            // Para links âncora, remove a classe após a animação para que o botão reapareça
            if (isAnchorLink) {
                setTimeout(() => {
                    buttonElement.classList.remove('btn-animating-out');
                    // Opcional: Se quiser que ele volte 100% visível sem delay, pode redefinir o estilo direto
                    // buttonElement.style.opacity = '1';
                    // buttonElement.style.transform = 'translateY(0)';
                    console.log("Botão âncora animado e classe de saída removida.");
                }, animationDuration);
            } else {
                // Para links que levam a outras páginas, não precisamos remover a classe,
                // pois a página será recarregada.
                // Contudo, se por algum motivo a navegação falhar, o botão permaneceria escondido.
                // Uma solução robusta seria gerenciar isso via evento 'transitionend' no link externo.
                // Por simplicidade aqui, para links externos, o setTimeout para window.location.href
                // já garante que a navegação ocorra após a animação de "esmaecer".
                console.log("Botão de navegação animado para saída.");
            }
        }, delayBeforeAnimate);
    };


    // =====================================
    // 2. Funcionalidade de Copiar Texto
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
    // 3. Sistema de Áudio de Fundo - Com Reprodução Aleatória
    // =====================================
    const audioControlButton = document.getElementById('audioControlButton');
    const musicTitleDisplay = document.getElementById('musicTitleDisplay');
    const audioProgressArc = document.getElementById('audioProgressArc');
    const arcProgress = audioProgressArc ? audioProgressArc.querySelector('.arc-progress') : null;

    const musicPlaylist = [
        { title: 'Aria-Math-Lofi-Remastered', src: 'audios/musics/Aria-Math-Lofi-Remastered.mp3' },
        { title: 'Aria-Math', src: 'audios/musics/Aria-Math.mp3' },
        { title: 'Beginning 2', src: 'audios/musics/Beginning 2.mp3' },
        { title: 'Biome-Fest', src: 'audios/musics/Biome-Fest.mp3' },
        { title: 'Blind-Spots', src: 'audios/musics/Blind-Spots.mp3' },
        { title: 'Clark', src: 'audios/musics/Clark.mp3' },
        { title: 'Danny', src: 'audios/musics/Danny.mp3' },
        { title: 'Dreiton', src: 'audios/musics/Dreiton.mp3' }, // Corrigido o título para Dreiton
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
        let newIndex;
        // Garante que a próxima música seja diferente da atual, se houver mais de uma
        do {
            newIndex = Math.floor(Math.random() * musicPlaylist.length);
        } while (newIndex === currentMusicIndex && musicPlaylist.length > 1);
        return newIndex;
    };

    // Declarar os handlers fora da função para poder removê-los corretamente
    let onCanPlayThroughHandler = null;
    let onAudioErrorHandler = null;

    const loadRandomMusic = (playImmediately = false) => {
        if (musicPlaylist.length === 0) {
            console.warn("Playlist vazia, não é possível carregar música.");
            return;
        }
        if (preparingNextMusic) {
            console.log("Já está preparando a próxima música, abortando.");
            return; // Evita múltiplas chamadas enquanto uma música já está carregando
        }

        preparingNextMusic = true;
        currentMusicIndex = getRandomMusicIndex();
        const music = musicPlaylist[currentMusicIndex];

        console.log(`[Áudio] Carregando: ${music.title} de ${music.src}`);
        backgroundAudio.src = music.src;
        backgroundAudio.load(); // Inicia o carregamento da nova música

        // Remover handlers antigos antes de adicionar novos para evitar duplicação
        if (onCanPlayThroughHandler) {
            backgroundAudio.removeEventListener('canplaythrough', onCanPlayThroughHandler);
        }
        if (onAudioErrorHandler) {
            backgroundAudio.removeEventListener('error', onAudioErrorHandler);
        }

        // Definir os novos handlers
        onCanPlayThroughHandler = () => {
            console.log(`[Áudio] Música '${music.title}' pronta para tocar.`);
            preparingNextMusic = false; // Libera a flag
            if (playImmediately) {
                backgroundAudio.play().then(() => {
                    audioControlButton.classList.add('is-playing');
                    showCentralMessage(`Tocando: ${music.title}`);
                    updateAudioButtonTitle();
                }).catch(e => {
                    console.error("Erro ao tentar tocar áudio de fundo (provavelmente autoplay bloqueado):", e.message);
                    audioControlButton.classList.remove('is-playing');
                    showCentralMessage('Autoplay bloqueado. Clique para tocar.');
                    updateAudioButtonTitle(); // Atualiza o título mesmo se não tocar
                });
            } else {
                updateAudioButtonTitle();
            }
            // Remover o handler após a execução para evitar chamadas duplicadas
            backgroundAudio.removeEventListener('canplaythrough', onCanPlayThroughHandler);
        };

        onAudioErrorHandler = (e) => {
            console.error(`Erro ao carregar ou reproduzir áudio: ${music.src}`, e);
            showCentralMessage('Erro ao carregar música.');
            preparingNextMusic = false; // Libera a flag
            // Remover o handler após a execução
            backgroundAudio.removeEventListener('error', onAudioErrorHandler);
            // Tente carregar a próxima música automaticamente em caso de erro, para não ficar travado
            setTimeout(() => loadRandomMusic(playImmediately), 500);
        };

        // Adicionar os novos handlers
        backgroundAudio.addEventListener('canplaythrough', onCanPlayThroughHandler);
        backgroundAudio.addEventListener('error', onAudioErrorHandler);
    };

    const updateProgressArc = () => {
        if (backgroundAudio.duration > 0 && arcProgress) {
            const progress = (backgroundAudio.currentTime / backgroundAudio.duration);
            const circumference = 2 * Math.PI * 27; // 2 * PI * raio (raio 27)
            const offset = circumference * (1 - progress);
            arcProgress.style.strokeDasharray = `${circumference} ${circumference}`; // Define o comprimento da linha
            arcProgress.style.strokeDashoffset = offset; // Define o quanto da linha é visível
        } else if (arcProgress) {
            arcProgress.style.strokeDashoffset = '0'; // Reseta o progresso se não houver música
        }
    };

    if (backgroundAudio && audioControlButton && musicTitleDisplay && arcProgress) { // Verifique se todos os elementos existem
        // Carrega a primeira música na inicialização, mas não tenta tocar imediatamente (autoplay bloqueado)
        loadRandomMusic(false);

        backgroundAudio.addEventListener('loadedmetadata', () => {
            console.log("Metadados da música carregados (para o progresso do arco).");
            updateProgressArc(); // Garante que o arco é atualizado quando a duração é conhecida
        });
        backgroundAudio.addEventListener('timeupdate', updateProgressArc); // Atualiza o arco conforme a música avança
        // A MÚSICA DEVE IR PARA A PRÓXIMA ALEATORIAMENTE QUANDO:
        // 1. O ARCO DE PRODUÇÃO REINICIA DO 0, EXECUTANDO O EVENTO
        backgroundAudio.addEventListener('ended', () => {
            console.log("Música atual terminou. Carregando e tocando a próxima...");
            loadRandomMusic(true); // Carrega e tenta tocar a próxima música automaticamente
        });

        audioControlButton.addEventListener('click', () => {
            playEffectSound(clickSound);

            // 2. QUANDO CLICO SOBRE O BOTÃO (se já estiver tocando, troca; se estiver pausado, tenta tocar ou carregar uma nova)
            if (backgroundAudio.paused) {
                if (preparingNextMusic || currentMusicIndex === -1 || !backgroundAudio.src) {
                    console.log("Botão clicado: Carregando nova música e tentando tocar.");
                    loadRandomMusic(true); // Carrega uma nova música e tenta tocar
                } else {
                    console.log("Botão clicado: Tentando tocar música existente.");
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
                console.log("Botão clicado: Pausando música OU pulando para a próxima.");
                backgroundAudio.pause(); // Pausa a música atual
                audioControlButton.classList.remove('is-playing');
                showCentralMessage('Música pausada. Clicou novamente para pular.');
                
                // NOVIDADE: Adiciona lógica para pular para a próxima música ao clicar novamente
                // se a música estiver tocando
                loadRandomMusic(true); // Carrega e tenta tocar a próxima música
            }
            updateAudioButtonTitle();
        });

        // =================================================================
        // Lógica de Autoplay na inicialização e após primeira interação
        // =================================================================
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
                    loadRandomMusic(true);
                } else {
                    backgroundAudio.play().then(() => {
                        audioControlButton.classList.add('is-playing');
                        showCentralMessage(`Tocando: ${musicPlaylist[currentMusicIndex].title}`);
                        updateAudioButtonTitle();
                    }).catch(e => {
                        console.warn("Autoplay bloqueado após interação inicial. Usuário precisará clicar no botão de música.", e.message);
                        showCentralMessage('Clique no botão de música para iniciar.');
                        audioControlButton.classList.remove('is-playing');
                        updateAudioButtonTitle();
                    });
                }
            }
        };

        document.addEventListener('click', handleInitialAudioPlay, { once: true, capture: true, passive: true });
        document.addEventListener('keydown', handleInitialAudioPlay, { once: true, capture: true, passive: true });

        const tryAutoPlayOnLoad = () => {
            if (localStorage.getItem('userInteractedWithAudio') === 'true') {
                console.log("Usuário já interagiu anteriormente. Tentando autoplay na carga da página.");
                if (currentMusicIndex !== -1 && backgroundAudio.paused) {
                    backgroundAudio.play().then(() => {
                        audioControlButton.classList.add('is-playing');
                        showCentralMessage(`Tocando: ${musicPlaylist[currentMusicIndex].title}`);
                        updateAudioButtonTitle();
                    }).catch(e => {
                        console.warn("Autoplay bloqueado pelo navegador na inicialização (mesmo com interação prévia). Usuário precisará clicar.", e.message);
                        showCentralMessage('Clique no botão de música para iniciar.');
                        audioControlButton.classList.remove('is-playing');
                        updateAudioButtonTitle();
                    });
                } else if (currentMusicIndex === -1) {
                    loadRandomMusic(true);
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
            console.log("[Efeitos Sonoros] Mouse entrou no card. Tentando tocar hover sound.");
            playEffectSound(hoverSound);
        });
    });

    // ATENÇÃO A ESTE BLOCO PARA A CORREÇÃO DO BUG DO BOTÃO
    document.querySelectorAll('a:not(.menu-toggle):not(.nav-menu a), .btn-primary, .btn-link').forEach(element => {
        element.addEventListener('click', (event) => {
            console.log("[Efeitos Sonoros] Link/Botão clicado. Tentando tocar click sound.");
            playEffectSound(clickSound);

            // Verifica se o link é para uma URL externa ou para outra página (não um link âncora interno)
            const isExternalOrFullPageLink = element.tagName === 'A' && element.href &&
                                             (element.href.startsWith('http') || element.href.startsWith('https') || !element.href.includes('#'));

            // Se for um link externo ou um botão que deve "desaparecer" (ex: "Nada para ver aqui!")
            if (isExternalOrFullPageLink && !element.classList.contains('no-animation')) {
                event.preventDefault(); // Impede a navegação imediata
                handleButtonClickAnimation(element); // Anima o botão para fora

                // Navega para a URL após a animação de saída
                setTimeout(() => {
                    window.location.href = element.href;
                }, 500); // 500ms deve corresponder à duração da sua animação CSS
            }
            // Lógica para links âncora internos
            else if (element.tagName === 'A' && element.href && element.href.startsWith('#')) {
                // Para links âncora, apenas execute a animação *se ela não esconder o botão permanentemente*.
                // Sua função handleButtonClickAnimation já foi modificada para lidar com isso.
                // Não precisa de preventDefault ou setTimeout para window.location.href aqui,
                // pois o comportamento padrão do navegador já fará o scroll.
                handleButtonClickAnimation(element); // Fará o esmaecimento e o reset se for âncora
            }
            // Lógica para botões que não são links, mas que você quer animar (ex: "Nada para ver aqui!")
            else if (element.tagName === 'BUTTON' || (element.classList.contains('btn-primary') && !element.href) || (element.classList.contains('btn-link') && !element.href)) {
                if (!element.classList.contains('copy-button')) {
                    if (element.textContent.includes('Nada para ver aqui!')) {
                        handleButtonClickAnimation(element);
                    }
                }
            }
            // Caso contrário, é um link ou botão normal que não precisa de animação complexa ou já foi tratado (ex: copy-button)
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
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% da seção visível para acionar
    };
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Deixa de observar depois de visível
            }
        });
    }, observerOptions);
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
});