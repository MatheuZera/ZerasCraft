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
    const audioNextButton = document.getElementById('audioNextButton'); // Novo botão
    const musicTitleDisplay = document.getElementById('musicTitleDisplay');
    const audioProgressArc = document.getElementById('audioProgressArc');
    const arcProgress = audioProgressArc ? audioProgressArc.querySelector('.arc-progress') : null;

    // Garante que o raio e a circunferência são definidos corretamente para o SVG
    // CONFIRME SE O RAIO NO SEU SVG (<circle r="XX">) É REALMENTE 27!
    const arcRadius = 27;
    const arcCircumference = 2 * Math.PI * arcRadius;

    // A playlist com seus títulos e caminhos.
    const musicPlaylist = [
        { title: 'Aria Math Lofi', src: 'assets/audios/musics/Aria-Math-Lofi.mp3' },
        { title: 'Aria Math', src: 'assets/audios/musics/Aria-Math.mp3' },
        { title: 'Beginning', src: 'assets/audios/musics/Beginning.mp3' },
        { title: 'Biome Fest', src: 'assets/audios/musics/Biome-Fest.mp3' },
        { title: 'Blind Spots', src: 'assets/audios/musics/Blind-Spots.mp3' },
        { title: 'Clark', src: 'assets/audios/musics/Clark.mp3' },
        { title: 'Danny', src: 'assets/audios/musics/Danny.mp3' },
        { title: 'Dreiton', src: 'assets/audios/musics/Dreiton.mp3' },
        { title: 'Dry Hands', src: 'assets/audios/musics/Dry-Hands.mp3' },
        { title: 'Floating Trees', src: 'assets/audios/musics/Floating-Trees.mp3' },
        { title: 'Haggstrom', src: 'assets/audios/musics/Haggstrom.mp3' },
        { title: 'Key', src: 'assets/audios/musics/Key.mp3' },
        { title: 'Living Mice', src: 'assets/audios/musics/Living-Mice.mp3' },
        { title: 'Mice On Venus', src: 'assets/audios/musics/Mice-On-Venus.mp3' },
        { title: 'Minecraft', src: 'assets/audios/musics/Minecraft.mp3' },
        { title: 'Moog City', src: 'assets/audios/musics/Moog-City.mp3' },
        { title: 'Mutation', src: 'assets/audios/musics/Mutation.mp3' },
        { title: 'Sweden', src: 'assets/audios/musics/Sweden.mp3' },
        { title: 'Taswell', src: 'assets/audios/musics/Taswell.mp3' },
        { title: 'Wet Hands', src: 'assets/audios/musics/Wet-Hands.mp3' },
        { title: 'Blocks', src: 'assets/audios/musics/records/Blocks.mp3' },
        { title: 'Cat', src: 'assets/audios/musics/records/Cat.mp3' },
        { title: 'Far', src: 'assets/audios/musics/records/Far.mp3' },
        { title: 'Mall', src: 'assets/audios/musics/records/Mall.mp3' },
        { title: 'Mellohi', src: 'assets/audios/musics/records/Mellohi.mp3' },
        { title: 'Otherside', src: 'assets/audios/musics/records/Otherside.mp3' },
        { title: 'Pingstep Master', src: 'assets/audios/musics/records/Pingstep_Master.mp3' },
        { title: 'Relic', src: 'assets/audios/musics/records/Relic.mp3' },
        { title: 'Stal', src: 'assets/audios/musics/records/Stal.mp3' },
        { title: 'Strad', src: 'assets/audios/musics/records/Strad.mp3' },
        { title: 'Wait', src: 'assets/audios/musics/records/Wait.mp3' },
        { title: 'Ward', src: 'assets/audios/musics/records/Ward.mp3' },
    ];
    let currentMusicIndex = -1;

    // =====================================
    // Funções Auxiliares de Áudio
    // =====================================

    const initializeAudioEffect = (name, path, volume = 0.5) => {
        const audio = new Audio(path);
        audio.preload = 'auto'; // Preload para um carregamento mais rápido
        audio.volume = volume;
        audioEffects[name] = audio;
        return audio;
    };

    hoverSound = initializeAudioEffect('select', 'assets/audios/effects/select.mp3', 0.3); // Ajuste o volume se desejar
    clickSound = initializeAudioEffect('click', 'assets/audios/effects/click.mp3', 0.7); // Ajuste o volume se desejar

    const playEffectSoundInternal = (audioElement) => {
        if (audioElement) {
            // Clonar o elemento para permitir múltiplos sons rápidos sem cortar o anterior
            const clonedAudio = audioElement.cloneNode();
            clonedAudio.volume = audioElement.volume;
            clonedAudio.play().catch(e => console.warn("Erro ao tentar tocar som de efeito:", e.message));
        }
    };

    const playEffectSound = (audioElement) => {
        // Pequeno atraso para evitar conflitos de reprodução rápida ou no carregamento inicial
        setTimeout(() => {
            playEffectSoundInternal(audioElement);
        }, 10);
    };

    function showCentralMessage(message) {
        const centralMessageElement = document.getElementById('centralMessage');
        if (centralMessageElement) {
            centralMessageElement.textContent = message;
            centralMessageElement.classList.add('show'); // Adiciona classe 'show' para animação
            setTimeout(() => {
                centralMessageElement.classList.remove('show'); // Remove a classe para esconder
            }, 3000); // Mensagem visível por 3 segundos
        } else {
            console.log(`[Mensagem Central] ${message}`); // Fallback para console se o elemento não existir
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
            menuToggle.classList.toggle('active'); // Adiciona/remove classe para girar
            playEffectSound(clickSound);
        });

        // Fecha o menu ao clicar em um link (mobile)
        document.querySelectorAll('.main-nav a').forEach(item => {
            item.addEventListener('click', () => {
                // Pequeno atraso para permitir que a navegação ocorra antes do fechamento total
                setTimeout(() => {
                    navMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                }, 300); // Ajuste o atraso se a transição da página for rápida
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
                playEffectSound(clickSound); // Toca som de clique

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
                    // Lógica específica para copiar IP:Porta
                    if (selectors.includes('#serverIp') && selectors.includes('#serverPort') && partsToCopy.length === 2) {
                        textToCopy = `${partsToCopy[0]}:${partsToCopy[1]}`;
                    } else {
                        textToCopy = partsToCopy.join('');
                    }

                } else if (button.dataset.copyText) {
                    // Se o botão tem um texto direto para copiar (ex: "Acessar Servidor")
                    textToCopy = button.dataset.copyText;
                } else {
                    console.warn("Botão de cópia encontrado sem 'data-copy-target' ou 'data-copy-text'.");
                }

                if (textToCopy) {
                    try {
                        await navigator.clipboard.writeText(textToCopy);
                        console.log('Texto copiado: ' + textToCopy);
                        showCentralMessage(`'${textToCopy}' copiado!`);

                        // Efeito visual no botão
                        button.textContent = 'Copiado!';
                        button.classList.add('copied');

                        setTimeout(() => {
                            button.textContent = originalButtonText;
                            button.classList.remove('copied');
                        }, 2000); // Volta ao texto original após 2 segundos

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
    // 3. Sistema de Áudio de Fundo - Com Persistência, Reprodução Aleatória e Arco de Progresso
    // =====================================

    const updateAudioButtonTitle = () => {
        if (musicTitleDisplay && currentMusicIndex !== -1 && musicPlaylist[currentMusicIndex]) {
            if (!backgroundAudio.paused) {
                musicTitleDisplay.textContent = `${musicPlaylist[currentMusicIndex].title}`;
            } else {
                musicTitleDisplay.textContent = 'Clique para Tocar..';
            }
        } else if (musicTitleDisplay) {
            musicTitleDisplay.textContent = 'Nenhuma Música';
        }
    };

    const getRandomMusicIndex = () => {
        if (musicPlaylist.length === 0) return -1;
        let newIndex;
        // Evita repetir a mesma música consecutivamente se houver mais de uma
        if (musicPlaylist.length > 1) {
            do {
                newIndex = Math.floor(Math.random() * musicPlaylist.length);
            } while (newIndex === currentMusicIndex);
        } else {
            newIndex = 0; // Se só tem uma música, sempre toca ela
        }
        return newIndex;
    };

    const playMusic = () => {
        if (!backgroundAudio || !backgroundAudio.src) {
            console.warn("Áudio não pronto para tocar.");
            return;
        }
        backgroundAudio.play().then(() => {
            if (audioControlButton) audioControlButton.classList.add('is-playing');
            showCentralMessage(`Tocando: ${musicPlaylist[currentMusicIndex].title}`);
            updateAudioButtonTitle();
            console.log(`[Áudio] Música '${musicPlaylist[currentMusicIndex].title}' começou a tocar.`);
            saveAudioState(); // Salva o estado ao iniciar a reprodução
        }).catch(e => {
            console.error("Erro ao tentar tocar áudio (provavelmente autoplay bloqueado):", e.message);
            if (audioControlButton) audioControlButton.classList.remove('is-playing');
            showCentralMessage('Autoplay bloqueado. Clique para tocar.');
            updateAudioButtonTitle();
            preparingNextMusic = false; // Permite tentar carregar novamente
        });
    };

    const loadNewMusic = (playAfterLoad = false, specificIndex = -1) => {
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
        currentMusicIndex = (specificIndex !== -1) ? specificIndex : getRandomMusicIndex();
        const music = musicPlaylist[currentMusicIndex];

        if (currentMusicIndex === -1) {
            console.warn("Não foi possível obter um índice de música válido. Playlist vazia ou erro.");
            preparingNextMusic = false;
            return;
        }

        console.log(`[Áudio] Carregando: ${music.title} de ${music.src}`);
        backgroundAudio.src = music.src;
        backgroundAudio.load();

        backgroundAudio.oncanplaythrough = () => {
            console.log(`[Áudio] Música '${music.title}' pronta para tocar. Tempo de carregamento: ${backgroundAudio.readyState}`);
            preparingNextMusic = false;
            if (playAfterLoad) {
                playMusic();
            } else {
                updateAudioButtonTitle();
            }
            backgroundAudio.oncanplaythrough = null; // Remove listener para evitar chamadas múltiplas
            saveAudioState(); // Salva o estado após carregar a música
        };

        backgroundAudio.onerror = (e) => {
            console.error(`Erro ao carregar áudio: ${music.src}`, e);
            showCentralMessage('Erro ao carregar música. Pulando...');
            preparingNextMusic = false;
            backgroundAudio.onerror = null;
            setTimeout(() => loadNewMusic(playAfterLoad), 500); // Tenta carregar a próxima música
        };
    };

    const updateProgressArc = () => {
        if (!arcProgress) return;

        if (backgroundAudio.duration > 0 && !isNaN(backgroundAudio.duration)) {
            const progress = (backgroundAudio.currentTime / backgroundAudio.duration);
            const offset = arcCircumference * (1 - progress);
            arcProgress.style.strokeDashoffset = offset;
        } else {
            arcProgress.style.strokeDashoffset = arcCircumference; // Zera o arco se a duração não for válida
        }
    };

    // Salvar estado do áudio no localStorage
    const saveAudioState = () => {
        if (backgroundAudio) {
            const audioState = {
                currentTime: backgroundAudio.currentTime,
                currentMusicIndex: currentMusicIndex,
                paused: backgroundAudio.paused,
                volume: backgroundAudio.volume,
                userInteracted: localStorage.getItem('userInteractedWithAudio') === 'true' // Salva o status de interação
            };
            localStorage.setItem('audioState', JSON.stringify(audioState));
            console.log("[Áudio State] Estado salvo:", audioState);
        }
    };

    // Restaurar estado do áudio do localStorage
    const restoreAudioState = () => {
        const savedState = localStorage.getItem('audioState');
        if (savedState) {
            const audioState = JSON.parse(savedState);
            console.log("[Áudio State] Estado restaurado:", audioState);

            currentMusicIndex = audioState.currentMusicIndex;
            backgroundAudio.volume = audioState.volume;

            if (currentMusicIndex !== -1 && musicPlaylist[currentMusicIndex]) {
                backgroundAudio.src = musicPlaylist[currentMusicIndex].src;
                backgroundAudio.load();

                backgroundAudio.onloadedmetadata = () => {
                    backgroundAudio.currentTime = audioState.currentTime;
                    updateProgressArc();
                    if (!audioState.paused && audioState.userInteracted) {
                        // Tentar tocar SOMENTE SE o usuário já interagiu antes
                        playMusic();
                    } else {
                        // Se não estava tocando ou não houve interação, apenas atualiza o título
                        updateAudioButtonTitle();
                        if (audioControlButton) audioControlButton.classList.remove('is-playing');
                    }
                    backgroundAudio.onloadedmetadata = null;
                };
                backgroundAudio.onerror = (e) => {
                    console.error("Erro ao carregar música restaurada:", e);
                    showCentralMessage('Erro ao restaurar música. Pulando...');
                    loadNewMusic(true); // Tenta carregar uma nova música
                };
            } else {
                console.warn("[Áudio State] Índice de música inválido no estado salvo. Carregando nova música.");
                loadNewMusic(false);
            }
        } else {
            console.log("[Áudio State] Nenhum estado de áudio salvo encontrado. Carregando música inicial.");
            loadNewMusic(false); // Carrega uma música aleatória se não houver estado salvo
        }
    };

    // Adiciona o listener para salvar o estado antes de o usuário sair da página
    window.addEventListener('beforeunload', saveAudioState);
    window.addEventListener('pagehide', saveAudioState); // Melhor para dispositivos móveis

    if (backgroundAudio) { // Só procede se o elemento de áudio existe
        if (arcProgress) { // Configura o SVG para o progresso circular
            arcProgress.style.strokeDasharray = `${arcCircumference} ${arcCircumference}`;
            arcProgress.style.strokeDashoffset = arcCircumference;
            arcProgress.style.transition = 'stroke-dashoffset 1s linear';
        }

        restoreAudioState(); // Tenta restaurar o estado do áudio ao carregar a página

        backgroundAudio.addEventListener('timeupdate', updateProgressArc); // Atualiza o arco
        backgroundAudio.addEventListener('ended', () => {
            console.log("Música atual terminou (evento 'ended'). ZERANDO ARCO e carregando a próxima...");
            if (audioControlButton) audioControlButton.classList.remove('is-playing');
            updateProgressArc(); // Garante que o arco zere
            preparingNextMusic = false;
            loadNewMusic(true); // Carrega e toca a próxima música automaticamente
        });

        // Event listener para o botão principal de play/pause/skip
        if (audioControlButton) {
            audioControlButton.addEventListener('click', () => {
                playEffectSound(clickSound); // Toca som de clique

                if (backgroundAudio.paused) {
                    // Se estiver pausado ou sem música carregada, tenta tocar/carregar
                    if (currentMusicIndex === -1 || !backgroundAudio.src || backgroundAudio.ended || backgroundAudio.currentTime === 0) {
                        console.log("Botão clicado: Carregando nova música e tentando tocar.");
                        loadNewMusic(true);
                    } else {
                        console.log("Botão clicado: Despausando música existente.");
                        playMusic();
                    }
                    localStorage.setItem('userInteractedWithAudio', 'true'); // Marca que o usuário interagiu
                } else {
                    // Se estiver tocando, pausa e pula para a próxima
                    console.log("Botão clicado: Música tocando. Pausando e pulando para a próxima.");
                    backgroundAudio.pause();
                    if (audioControlButton) audioControlButton.classList.remove('is-playing');
                    showCentralMessage('Pulando para a próxima música...');
                    preparingNextMusic = false; // Reseta flag para próxima carga
                    loadNewMusic(true); // Carrega e toca a próxima música
                }
                updateAudioButtonTitle();
            });
        }

        // Event listener para o botão "Próxima Música"
        if (audioNextButton) {
            audioNextButton.addEventListener('click', () => {
                playEffectSound(clickSound); // Toca som de clique
                console.log("Botão 'Próxima Música' clicado.");
                backgroundAudio.pause(); // Pausa a música atual imediatamente
                if (audioControlButton) audioControlButton.classList.remove('is-playing');
                showCentralMessage('Próxima música...');
                preparingNextMusic = false; // Permite nova carga
                loadNewMusic(true); // Carrega e toca a próxima música
            });
        }

        // Primeira interação do usuário para permitir autoplay (política de navegadores)
        let hasInitialInteraction = false;
        const handleInitialAudioPlay = () => {
            if (hasInitialInteraction) return;
            hasInitialInteraction = true;

            console.log("Primeira interação na página detectada.");
            localStorage.setItem('userInteractedWithAudio', 'true'); // Grava a interação

            // Remover listeners para que não dispare novamente
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

        // Adiciona listeners globais para detectar a primeira interação
        document.addEventListener('click', handleInitialAudioPlay, { once: true, capture: true, passive: true });
        document.addEventListener('keydown', handleInitialAudioPlay, { once: true, capture: true, passive: true });

        // Ajusta o progresso do arco após um pequeno delay para garantir que o SVG esteja renderizado
        setTimeout(updateProgressArc, 100);
        updateAudioButtonTitle(); // Garante que o título seja atualizado mesmo sem interação imediata

    } else {
        console.warn("Elemento de áudio de fundo não encontrado. Verifique o ID 'backgroundAudio'.");
    }


    // =====================================
    // 4. Sistema de Sons para Interações (Hover e Click)
    // =====================================

    // Adiciona som de HOVER para CARDS
    document.querySelectorAll('.service-card, .role-category-card, .access-card, .community-card, .event-card, .partnership-card, .security-card, .faq-item, .info-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            playEffectSound(hoverSound);
        });
    });

    // Adiciona som de HOVER para LINKS e BOTÕES
    document.querySelectorAll('a:not(.menu-toggle):not(.main-nav a), .btn-primary, .btn-link, button:not(#audioControlButton):not(#audioNextButton):not(.copy-button)').forEach(element => {
        // Excluído: menu-toggle (já tem som ao clicar), links do main-nav (já tem som ao clicar), botões de áudio, botões de cópia (já tem som)
        element.addEventListener('mouseenter', () => {
            playEffectSound(hoverSound);
        });
    });

    // Adiciona som de CLICK para LINKS e BOTÕES (gerais, exceto os com lógica de áudio/cópia própria)
    document.querySelectorAll('a:not(.menu-toggle):not(.main-nav a), .btn-primary, .btn-link, button:not(#audioControlButton):not(#audioNextButton):not(.copy-button)').forEach(element => {
        element.addEventListener('click', (event) => {
            playEffectSound(clickSound); // Toca som de clique imediatamente

            if (element.textContent.includes('Nada para ver aqui!')) { // Exemplo de link dummy
                showCentralMessage('Realmente, nada para ver aqui!');
                event.preventDefault(); // Impede navegação se for um link dummy
            }
        });
    });


    // =====================================
    // 5. Botão "Voltar ao Topo"
    // =====================================
    const scrollTopButton = document.getElementById('scrollTopButton');

    if (scrollTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Mostra o botão após rolar 300px
                scrollTopButton.classList.add('show');
            } else {
                scrollTopButton.classList.remove('show');
            }
        });
        scrollTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Rolagem suave
            playEffectSound(clickSound); // Toca som de clique
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
    // 7. Efeitos de Rolagem para Elementos (Fade-in)
    // =====================================
    const sections = document.querySelectorAll('.fade-in-section');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // A seção se torna visível quando 10% dela entra na viewport
    };
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Deixa de observar uma vez que a animação foi acionada
            }
        });
    }, observerOptions);
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // =====================================
    // 8. Ativar Link da Navegação da Página Atual
    // =====================================
    const highlightActiveNavLink = () => {
        const currentPath = window.location.pathname.split('/').pop(); // Ex: 'index.html', 'community.html'
        document.querySelectorAll('.main-nav .nav-link').forEach(link => {
            link.classList.remove('active'); // Remove 'active' de todos os links

            // Verifica se o href do link corresponde ao nome do arquivo atual
            // Ou se a URL é a raiz e o link é para index.html
            if (link.getAttribute('href') === currentPath ||
                (currentPath === '' && link.getAttribute('href') === 'index.html')
            ) {
                link.classList.add('active'); // Adiciona 'active' ao link correspondente
            }
        });
    };

    highlightActiveNavLink(); // Chama a função na carga da página
});